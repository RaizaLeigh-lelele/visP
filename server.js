import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const PORT = process.env.PORT || 3000;

app.post('/api/plan', async (req, res) => {
    const { tasks } = req.body;
    if (!tasks || !tasks.length) return res.status(400).json({ error: "No tasks provided" });

    try {
        const prompt = `
You are an AI planner. Organize these tasks into a prioritized schedule based on urgency, difficulty, and deadlines.
Return a JSON array of tasks with the same fields (name, time, diff, due) in recommended order.

Tasks:
${JSON.stringify(tasks)}
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
            temperature: 0.3,
        });

        let aiPlan = [];
        try {
            aiPlan = JSON.parse(response.choices[0].message.content);
        } catch (e) {
            console.error("Failed to parse AI response", e);
            return res.status(500).json({ error: "AI response parse failed" });
        }

        res.json({ plan: aiPlan });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));