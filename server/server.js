const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini with the API Key from Environment Variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: "No text provided for analysis." });
  }

  try {
    // Using gemini-1.5-flash for maximum stability and regional compatibility
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `
      Analyze this customer complaint: "${text}"
      Return ONLY a JSON object with these exact keys:
      {
        "category": "Technical" | "Billing" | "Logistics",
        "priority": "High" | "Moderate" | "Low",
        "sla": "e.g., 2 Hours",
        "sentiment": "Positive" | "Neutral" | "Negative",
        "analysis": "3 bullet points on Root Cause, Trend, and Next-Best Action",
        "draftReply": "An empathetic response"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let rawText = response.text();
    
    // Clean-up: Remove markdown code blocks if Gemini includes them
    const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanJson);

    res.json({
      text,
      ...data,
      timestamp: new Date().toLocaleString()
    });

  } catch (err) {
    console.error("Gemini Engine Error:", err);
    // Returning a detailed error helps us debug in Vercel Logs
    res.status(500).json({ 
      error: "Gemini Engine Error", 
      message: err.message 
    });
  }
});

// Use port 8082 for local dev, Vercel handles the production port
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => console.log(`Backend Active on Port ${PORT}`));