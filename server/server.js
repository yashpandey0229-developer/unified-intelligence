const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// API Route for Analysis
app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;
  // Your Gemini AI Logic here...
  // For demo, returning a mock response:
  res.json({ 
    text, 
    category: "Technical", 
    analysis: "AI processed successfully: " + text.substring(0, 20) + "..." 
  });
});

// CRITICAL: Use process.env.PORT for Vercel compatibility
const PORT = process.env.PORT || 8082;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});