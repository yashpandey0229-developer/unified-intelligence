const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas Active"))
  .catch(err => console.log("❌ DB Link Failed:", err));

const Complaint = mongoose.model('Complaint', new mongoose.Schema({
  text: String, category: String, priority: String, sla: String,
  sentiment: String, analysis: String, draftReply: String,
  timestamp: { type: Date, default: Date.now }
}));

// GET: Dashboard Data
app.get('/api/complaints', async (req, res) => {
  const data = await Complaint.find().sort({ timestamp: -1 });
  res.json(data);
});

// POST: Gemini 2.5 Flash Analysis
app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Analyze: "${text}". Return ONLY JSON: {"category":"...","priority":"...","sla":"...","sentiment":"...","analysis":"...","draftReply":"..."}`;
    const result = await model.generateContent(prompt);
    const data = JSON.parse(result.response.text().replace(/```json|```/g, "").trim());
    const newEntry = new Complaint({ text, ...data });
    await newEntry.save();
    res.json(newEntry);
  } catch (err) { res.status(500).json({ error: "AI Engine Fault" }); }
});

// DELETE: Resolve & Purge Logic
app.delete('/api/complaints/:id', async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: "Purge Failed" }); }
});

const PORT = process.env.PORT || 8082;
app.listen(PORT, () => console.log(`Backend Pulse on Port ${PORT}`));
// server/server.js ke end mein
module.exports = app;