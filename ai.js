function addNote(){
  const input = document.getElementById("noteInput");
  const text = input.value.trim();
  if(!text) return;

  const note = document.createElement("div");
  note.className = "note";
  note.innerText = text;

  document.getElementById("board").appendChild(note);
  input.value="";
}

async function groupWithAI(){

  const notes = [...document.querySelectorAll(".note")]
    .map(n => n.innerText);

  if(notes.length===0){
    alert("Add notes first");
    return;
  }

  const prompt = `
Group these notes into categories.
Return ONLY JSON like this:
{
 "School": ["note"],
 "Personal": ["note"]
}

Notes:
${notes.join("\n")}
`;

  const res = await fetch("https://api.openai.com/v1/responses",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":"Bearer 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"
    },
    body: JSON.stringify({
      model:"gpt-4.1-mini",
      input: prompt
    })
  });

  const data = await res.json();

  const text = data.output[0].content[0].text;
  const groups = JSON.parse(text);

  renderGroups(groups);
}

function renderGroups(groups){
  const board = document.getElementById("board");
  board.innerHTML="";

  for(const category in groups){
    const col = document.createElement("div");
    col.className="column";

    const title = document.createElement("h3");
    title.innerText = category;
    col.appendChild(title);

    groups[category].forEach(noteText=>{
      const note = document.createElement("div");
      note.className="note";
      note.innerText=noteText;
      col.appendChild(note);
    });

    board.appendChild(col);
  }
}