const { GoogleGenerativeAI } = require("@google/generative-ai");

const analyzeComplaint = async (text) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Using your confirmed working model for 2026
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `Analyze this customer complaint: "${text}". 
    Return ONLY a raw JSON object. Do not include markdown or backticks.
    Keys: "category", "severity", "sentiment", "summary", "suggestedReply".`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();
    
    console.log("🤖 AI RAW:", rawText);

    // 💡 THE ULTIMATE CLEANER: 
    // This finds the first '{' and the last '}' to strip away any ```json or text.
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : rawText;

    return JSON.parse(cleanJson);

  } catch (error) {
    console.error("❌ AI Error Details:", error.message);
    return {
      category: "General",
      severity: "High",
      sentiment: "Negative",
      summary: "Manual Triage Required",
      suggestedReply: "Our system is currently processing high volumes. An agent will review this shortly."
    };
  }
};

module.exports = { analyzeComplaint };