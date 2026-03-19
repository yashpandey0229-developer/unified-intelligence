const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. Initialize Gemini 1.5 Flash (Most stable for Vercel/Production)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 2. MongoDB Atlas Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected Successfully"))
  .catch(err => console.log("❌ MongoDB Connection Error:", err));

// 3. Complaint Schema (Defines how data is stored)
const ComplaintSchema = new mongoose.Schema({
  text: String,
  category: String,
  priority: String,
  sla: String,
  sentiment: String,
  analysis: String,
  draftReply: String,
  timestamp: { type: Date, default: Date.now }
});

const Complaint = mongoose.model('Complaint', ComplaintSchema);

// 4. Health Check Route
app.get('/', (req, res) => {
  res.send("Unified Intelligence API is Live and Healthy 🚀");
});

// 5. GET Route: Fetch all previous triages from Database
app.get('/api/complaints', async (req, res) => {
  try {
    const data = await Complaint.find().sort({ timestamp: -1 });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data from MongoDB" });
  }
});

// 6. POST Route: Analyze with Gemini and Save to MongoDB
app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "No text provided" });

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Structured Prompt for JSON Output
    const prompt = `Analyze this customer complaint: "${text}". 
    Return ONLY a valid JSON object with these keys: 
    "category" (Technical/Billing/Logistics), 
    "priority" (High/Moderate/Low), 
    "sla" (e.g. 2 Hours), 
    "sentiment" (Negative/Neutral), 
    "analysis" (3 professional bullet points), 
    "draftReply" (An empathetic response).`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const rawText = response.text();

    // Clean any potential markdown formatting from AI
    const cleanJson = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanJson);

    // Save the record to MongoDB
    const newEntry = new Complaint({ text, ...data });
    await newEntry.save();

    res.json(newEntry);
  } catch (err) {
    console.error("GEMINI_ERROR:", err.message);
    
    // Fallback: Return a valid object so UI doesn't crash if AI fails
    const fallback = {
      text,
      category: "General",
      priority: "Moderate",
      sla: "24 Hours",
      sentiment: "Neutral",
      analysis: "AI Analysis currently unavailable. System has defaulted to standard triage protocols.",
      draftReply: "We have received your request and a human agent will review it shortly."
    };
    res.status(200).json(fallback);
  }
});

// Use port 8082 for local dev; Vercel handles the production port automatically
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => console.log(`Backend Active on Port ${PORT}`));