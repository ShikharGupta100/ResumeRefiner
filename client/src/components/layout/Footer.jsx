// src/components/layout/Footer.jsx
export default function Footer() {
  return (
    <footer style={{
      borderTop:"1px solid var(--border)", padding:"20px",
      textAlign:"center", color:"var(--text-muted)", fontSize:"0.8rem",
      marginTop:"60px",
    }}>
      Built with Groq AI · LLaMA 3.3 70B · MongoDB
    </footer>
  );
}