const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  text: { type: String, required: true }, // The original input
  category: { type: String, default: "General" },
  severity: { type: String, default: "Medium" },
  sentiment: { type: String, default: "Neutral" },
  summary: { type: String, default: "Processing..." },
  suggestedReply: { type: String, default: "Thank you for reaching out." },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', complaintSchema);