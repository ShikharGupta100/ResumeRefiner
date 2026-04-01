import { useState } from "react"
import { data } from "react-router-dom";


function App() {
  const [content,setContent] = useState("");
  async function handleAnalyze() {
    try{
    const response = await fetch("http://localhost:3000/resume/upload",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({content}),
    });

    const data = await response.json()
      console.log(data);
    
  } catch(error){
    console.log("Error:",error);
    
  }
  }

  return (
    <div style={{padding:"20px"}}>
      <h1>Resume Analyzer</h1>
      <textarea
        rows={10}
        cols={60}
        placeholder="Paste your resume here"
        value={content}
        onChange={(e)=>setContent(e.target.value)}
      />
    <button onClick={handleAnalyze}>Analyze Resume</button>
    </div>
  )
}

export default App
