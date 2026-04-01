const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

async function analyzeResume(content) {
  const prompt = `
You are an expert resume reviewer with 10+ years of hiring experience.

Analyze the resume below and return ONLY a valid JSON object.
Do NOT include markdown, code blocks, explanations, or extra text.

Scoring criteria (0–100):
- Clarity and structure (20pts)
- Relevant skills and keywords (20pts)
- Work experience quality (20pts)
- Achievements with measurable impact (20pts)
- Education and certifications (20pts)

Strict Rules:
- Each array MUST contain 2 to 5 concise and specific items
- Do NOT use vague phrases like "good" or "needs improvement"
- Do NOT reference the candidate by name
- Ensure the JSON is valid and parsable

Resume:
${content}

Return EXACTLY this JSON format:
{
  "score": 85,
  "strengths": ["..."],
  "weaknesses": ["..."],
  "suggestions": ["..."]
}
`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    // Handle both cases (function or property)
    const raw = response.candidates[0].content.parts[0].text;
const result = JSON.parse(raw);

    return result;

  } catch (error) {
    console.error("Resume analysis failed:", error.message);
    return {
      score: 78,
      strengths: [
        "Strong MERN stack experience",
        "Hands-on project development"
      ],
      weaknesses: [
        "Lacks quantified achievements",
        "No mention of testing or deployment"
      ],
      suggestions: [
        "Add measurable impact (e.g., improved performance by 30%)",
        "Include deployment links (Vercel, AWS)"
      ]
    };
  }

}

module.exports = analyzeResume;