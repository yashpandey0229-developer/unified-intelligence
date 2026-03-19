const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// API Route for Analysis
app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;
  
  // LOGIC: This is where you would call the Gemini SDK
  // For the demo, we are using high-speed mock logic to show the UI flow
  try {
    const categories = ["Technical", "Billing", "Logistics", "Refund"];
    const randomCategory = categories[Math.floor(Math.random() * categories.length)];
    
    // Simulate AI processing delay
    setTimeout(() => {
      res.json({ 
        text, 
        category: randomCategory, 
        analysis: `AI Insight: This issue identified as ${randomCategory}. Recommendation: Flag for immediate human review based on keywords: "${text.substring(0, 15)}..."`
      });
    }, 800);
  } catch (err) {
    res.status(500).json({ error: "AI Processing Failed" });
  }
});

// Vercel Environment Port
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});