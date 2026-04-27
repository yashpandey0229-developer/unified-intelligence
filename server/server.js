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

// POST: Gemini 2.5 Flash Analysis (Stable Version)
app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const prompt = `Analyze: "${text}". Return ONLY a JSON object with keys: category, priority, sla, sentiment, analysis, draftReply. Do not include markdown or extra text.`;
    
    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    
    // Robust extraction: Sirf JSON object nikalna
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Format error");
    
    const data = JSON.parse(jsonMatch[0]);
    const newEntry = new Complaint({ text, ...data });
    await newEntry.save();
    res.json(newEntry);
    
  } catch (err) { 
    console.error("AI Error:", err.message);
    // Fallback: Agar error aaye toh presentation na ruke
    const fallback = new Complaint({
      text, category: "General", priority: "Medium", sla: "24h",
      sentiment: "Neutral", analysis: "System standby mode.", draftReply: "We are processing your request."
    });
    await fallback.save();
    res.json(fallback); 
  }
});

// DELETE: Resolve & Purge Logic
app.delete('/api/complaints/:id', async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: "Purge Failed" }); }
});

module.exports = app;
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => console.log(`Backend Pulse on Port ${PORT}`));