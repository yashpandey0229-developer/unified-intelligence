const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/analyze', async (req, res) => {
  const { text } = req.body;
  const input = text.toLowerCase();

  try {
    // --- 1. SEVERITY & SLA LOGIC ---
    let severity = "Moderate";
    let sla = "24 Hours";
    if (input.includes("broken") || input.includes("damaged") || input.includes("not working") || input.includes("urgent")) {
      severity = "High";
      sla = "2 Hours";
    } else if (input.includes("delay") || input.includes("wrong")) {
      severity = "Moderate";
      sla = "12 Hours";
    } else {
      severity = "Low";
      sla = "48 Hours";
    }

    // --- 2. SENTIMENT & CATEGORY ---
    let sentiment = "Neutral";
    if (input.includes("angry") || input.includes("worst") || input.includes("terrible") || input.includes("!") ) {
      sentiment = "Negative";
    }

    let category = "General";
    if (input.includes("package") || input.includes("delivery")) category = "Logistics";
    if (input.includes("refund") || input.includes("money") || input.includes("payment")) category = "Billing";
    if (input.includes("app") || input.includes("login") || input.includes("website")) category = "Technical";

    // --- 3. GEN-AI NEXT-BEST ACTION & DRAFT RESPONSE ---
    // This simulates the Gemini "Suggested Action"
    const nextAction = severity === "High" ? "Initiate immediate refund & flag for manager review." : "Send apology email and offer tracking update.";
    const draftResponse = `Dear Customer, we sincerely apologize for the ${category} issue. Our team has flagged this as ${severity} priority and will resolve it within ${sla}.`;

    res.json({
      text,
      category,
      severity,
      sentiment,
      sla,
      timestamp: new Date().toLocaleString(),
      nextAction,
      draftResponse,
      analysis: `[360° View Analysis]\n\n• Trend: Detected increase in ${category} complaints.\n• Root Cause: Potential fulfillment center error.\n• Suggested Action: ${nextAction}\n\nDraft Reply: "${draftResponse}"`
    });
  } catch (err) {
    res.status(500).json({ error: "AI Engine Failed" });
  }
});

const PORT = process.env.PORT || 8082;
app.listen(PORT, () => console.log(`Backend Active on ${PORT}`));