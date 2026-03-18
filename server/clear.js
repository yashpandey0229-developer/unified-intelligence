require('dotenv').config();
const mongoose = require('mongoose');
const Complaint = require('./models/Complaint'); // Adjust path to your model

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Complaint.deleteMany({});
    console.log("✅ Database Wiped Clean!");
    process.exit();
  })
  .catch(err => console.log(err));