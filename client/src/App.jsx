import { useState } from "react"
import { data } from "react-router-dom";


function App() {
  const [content,setContent] = useState("");
  const [result, setResult] = useState(null)
  const [loading,setLoading] = useState(false)
  const [error,setError] = useState("");
  const [history,setHistory] = useState([]);
   function handleClear() {
  setContent("");
  setResult(null);
  setError("");
}
function handleDelete(indexToDelete){
  setHistory((prev) => 
    prev.filter((_,index)=> index != indexToDelete));
}
  async function handleAnalyze() {
    if(!content.trim()){
      setError("Please enter resume content");
    }
    try{
      setLoading(true);
      setError("");
    const response = await fetch("http://localhost:3000/resume/upload",{
      method:"POST",
      headers:{
        "Content-Type":"application/json",
      },
      body:JSON.stringify({content}),
    });

    const data = await response.json()
      setResult(data.resume);
      setHistory((prev)=>[data.resume,...prev]);
    
  } catch(error){
    console.log("Error:",error);
    setError("Failed to analyze resume.Please try again.")
    
  }finally{
    setLoading(false);
  }
  }
  let color = "green"
  if(result){
    if(result.score < 50){
      color = "red";
    }else if(result.score < 75){
      color = "orange"
    }else{
      color = "green"
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
        onChange={(e)=>{
          setContent(e.target.value)
          setResult(null);
          setError("");
        }
        }
      />
    
      <div style={{ marginTop: "10px" }}>
  <button 
    onClick={handleAnalyze} 
    disabled={loading || !content.trim()}
  >
    {loading ? "Analyzing..." : "Analyze Resume"}
  </button>

  <button onClick={handleClear} style={{ marginLeft: "10px" }}>
    Clear
  </button>
</div>
    {loading && <p>Analyzing resume...</p>}
    {error && <p style={{ color: "red" }}>{error}</p>}
    {result && (
      
      
  <div style={{
    marginTop:"20px",
    padding:"20px",
    border:"1px solid #ccc",
    borderRadius:"10px",
    width:"500px"
  }}>
    <h2>Score: {result.score}</h2>
    <div style={{
  height: "20px",
  width: "100%",
  backgroundColor: "#eee",
  borderRadius: "10px",
  overflow: "hidden",
  marginBottom: "15px"
}}>
  <div style={{
    height: "100%",
    width: `${result.score}%`,
    backgroundColor: "green"
  }}></div>
</div>

    <h3>Strengths</h3>
    <ul>
      {result.strengths.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>

    <h3>Weaknesses</h3>
    <ul>
      {result.weaknesses.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>

    <h3>Suggestions</h3>
    <ul>
      {result.suggestions.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
    {history.length > 0 && (
  <div style={{ marginTop: "20px" }}>
    <h2>History</h2>

    {history.map((item, index) => (
      <div 
  key={index}
  onClick={() => setResult(item)}
  style={{
    border: "1px solid #ccc",
    padding: "10px",
    marginBottom: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  }}
>
  <p><strong>Score:</strong> {item.score}</p>

  <button 
    onClick={(e) => {
      e.stopPropagation(); 
      handleDelete(index);
    }}
  >
    Delete
  </button>
</div>
    ))}
  </div>
)}
  </div>
  
)}

    </div>
  )
}

export default App
