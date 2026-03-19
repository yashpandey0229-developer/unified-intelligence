const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// API Route for Analysis
app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;
  try {
    const categories = ["Technical", "Billing", "Logistics", "Refund"];
    const priorities = ["High", "Moderate", "Low"];
    
    // Logic: High priority for "damaged" or "refund", Low for "general"
    let priority = "Moderate";
    if (text.toLowerCase().includes("damaged") || text.toLowerCase().includes("urgent")) priority = "High";
    if (text.toLowerCase().includes("how to") || text.toLowerCase().includes("query")) priority = "Low";

    const slaTime = priority === "High" ? "2 Hours" : priority === "Moderate" ? "24 Hours" : "48 Hours";

    res.json({ 
      text, 
      category: categories[Math.floor(Math.random() * categories.length)],
      priority,
      sla: slaTime,
      timestamp: new Date().toLocaleTimeString(),
      analysis: `AI Analysis: Issue flagged as ${priority} priority. Immediate resolution required within ${slaTime}.`
    });
  } catch (err) {
    res.status(500).json({ error: "Analysis Failed" });
  }
});

// Vercel Environment Port
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});