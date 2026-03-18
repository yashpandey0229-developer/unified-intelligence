const express = require('express');
const router = express.Router();
const Complaint = require('./models/Complaint');
const { analyzeComplaint } = require('./aiController');

// 1. GET all
router.get('/', async (req, res) => {
  try {
    const complaints = await Complaint.find().sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. POST (AI Logic)
router.post('/', async (req, res) => {
  try {
    const { text } = req.body;
    const aiResult = await analyzeComplaint(text);
    const newComplaint = new Complaint({ text, ...aiResult });
    await newComplaint.save();
    res.status(201).json(newComplaint);
  } catch (err) {
    res.status(500).json({ error: "AI Failed" });
  }
});

// 3. PATCH (The new Escalation Route)
router.patch('/:id', async (req, res) => {
  try {
    const updated = await Complaint.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});

// 4. DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Complaint.findByIdAndDelete(req.params.id);
    res.json({ message: "Resolved" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;