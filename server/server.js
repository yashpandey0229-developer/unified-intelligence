const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Initialize Gemini 2.5 Flash
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

// 3. Complaint Schema
const Complaint = mongoose.model('Complaint', new mongoose.Schema({
  text: String,
  category: String,
  priority: String,
  sla: String,
  sentiment: String,
  analysis: String,
  draftReply: String,
  timestamp: { type: Date, default: Date.now }
}));

// 4. GET Route: Fetch all data from MongoDB for the Dashboard
app.get('/api/complaints', async (req, res) => {
  try {
    const data = await Complaint.find().sort({ timestamp: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch complaints" });
  }
});

// 5. POST Route: Analyze with Gemini 2.5 Flash and Save
app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Analyze: "${text}". Return ONLY a JSON object: {"category":"...","priority":"...","sla":"...","sentiment":"...","analysis":"...","draftReply":"..."}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();

    // Remove markdown code blocks if AI adds them
    const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanJson);

    // Save to Database
    const newEntry = new Complaint({ text, ...data });
    await newEntry.save();

    res.json(newEntry);
  } catch (err) {
    console.error("GEMINI_ERROR:", err.message);
    res.status(500).json({ error: "AI Handshake Failed", message: err.message });
  }
});

const PORT = process.env.PORT || 8082;
app.listen(PORT, () => console.log(`Backend Active on Port ${PORT}`));