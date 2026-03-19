const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Initialize Gemini
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

// 4. Analysis Route (Saves to DB)
app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Analyze: "${text}". Return ONLY JSON: {category, priority, sla, sentiment, analysis, draftReply}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const data = JSON.parse(response.text().replace(/```json|```/g, "").trim());

    // Save to MongoDB
    const newEntry = new Complaint({ text, ...data });
    await newEntry.save();

    res.json(newEntry);
  } catch (err) {
    res.status(500).json({ error: "AI Engine Error", details: err.message });
  }
});

// 5. Fetch Route (For Cross-Device Sync)
app.get('/api/complaints', async (req, res) => {
  const data = await Complaint.find().sort({ timestamp: -1 });
  res.json(data);
});

const PORT = process.env.PORT || 8082;
app.listen(PORT, () => console.log(`Backend Pro on Port ${PORT}`));