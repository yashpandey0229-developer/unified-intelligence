require('dotenv').config(); // MUST BE LINE 1
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const complaintRoutes = require('./complaintRoutes');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected..."))
  .catch(err => console.log("❌ MongoDB Error:", err));

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/complaints', complaintRoutes);

const PORT = process.env.PORT || 8082;

app.get('/', (req, res) => {
    res.send("Complaint Dashboard Server is Running!");
});

app.listen(PORT, () => {
    console.log(`🚀 Server is sprinting on port ${PORT}`);
});