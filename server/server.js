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
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

const Complaint = mongoose.model('Complaint', new mongoose.Schema({
  text: String, category: String, priority: String, sla: String,
  sentiment: String, analysis: String, draftReply: String,
  timestamp: { type: Date, default: Date.now }
}));

app.get('/api/complaints', async (req, res) => {
  try {
    const data = await Complaint.find().sort({ timestamp: -1 });
    res.json(data);
  } catch (err) { res.status(500).json({ error: "Fetch failed" }); }
});

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
  } catch (err) { res.status(500).json({ error: "AI Failed" }); }
});

// NEW: Delete logic for the Resolve button
app.delete('/api/complaints/:id', async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) { res.status(500).json({ error: "Delete failed" }); }
});

const PORT = process.env.PORT || 8082;
app.listen(PORT, () => console.log(`Backend Active on Port ${PORT}`));