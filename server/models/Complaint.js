const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  text: { type: String, required: true },
  category: { type: String, default: "General" },
  severity: { type: String, default: "Medium" },
  sentiment: { type: String, default: "Neutral" },
  summary: { type: String, default: "Processing..." },
  suggestedReply: { type: String, default: "Thank you for reaching out." },
  
  // NEW ENTERPRISE FIELDS
  status: { type: String, enum: ['Open', 'In-Progress', 'Escalated', 'Resolved'], default: 'Open' },
  deadline: { type: Date, default: () => new Date(+new Date() + 24*60*60*1000) }, // 24-hour SLA
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', complaintSchema);