const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Initialize Gemini 3 Flash
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;

  try {
    // Using the Gemini 3 Flash model for superior reasoning and speed
    const model = genAI.getGenerativeModel({ 
      model: "gemini-3-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
      Analyze this customer complaint: "${text}"
      Return a JSON object with these exact keys:
      "category": (Technical, Billing, or Logistics),
      "priority": (High, Moderate, or Low),
      "sla": (e.g., "2 Hours" for High, "24 Hours" for Low),
      "sentiment": (Positive, Neutral, or Negative),
      "analysis": (A concise 3-bullet 360-degree view covering Root Cause, Trend, and a unique Next-Best Action),
      "draftReply": (A highly personalized, empathetic response to the customer).
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const data = JSON.parse(response.text());

    res.json({
      text,
      ...data,
      timestamp: new Date().toLocaleString()
    });

  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({ error: "Gemini 3 Flash Engine timed out. Check API Key." });
  }
});

const PORT = process.env.PORT || 8082;
app.listen(PORT, () => console.log(`Gemini 3 Server Active on Port ${PORT}`));