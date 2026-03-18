const express = require('express');
const router = express.Router();
const Complaint = require('./models/Complaint');
const { analyzeComplaint } = require('./aiController');

// GET all complaints
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new complaint (The "Magic" Route)
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;
    
    // 1. Get AI Analysis
    const aiResult = await analyzeComplaint(text);
    
    // 2. Map AI results to Schema
    const newComplaint = new Complaint({
      text: text,
      category: aiResult.category,
      severity: aiResult.severity,
      sentiment: aiResult.sentiment,
      summary: aiResult.summary,
      suggestedReply: aiResult.suggestedReply
    });

    // 3. Save to MongoDB
    const savedComplaint = await newComplaint.save();
    res.status(201).json(savedComplaint);
  } catch (err) {
    console.error("❌ Route Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// DELETE a complaint
router.delete('/:id', async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: "Resolved" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;