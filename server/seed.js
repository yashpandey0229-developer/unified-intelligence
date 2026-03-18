require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');

const dummyComplaints = [
    "I haven't received my order #12345 yet. It's been two weeks!",
    "The app keeps crashing whenever I try to upload my profile picture.",
    "Why was I charged twice for my subscription this month?",
    "Your delivery person was very rude to me this morning.",
    "The product I received is damaged and the box was open."
];

const seedData = async () => {
    try {
        for (const text of dummyComplaints) {
            console.log(`Processing: ${text.substring(0, 20)}...`);
            // Sending it to the route we built earlier
            await axios.post('http://localhost:8082/api/complaints/process', { text });
        }
        console.log("✅ Database Seeded Successfully!");
        process.exit();
    } catch (error) {
        console.error("❌ Seeding failed:", error.message);
        process.exit(1);
    }
};

seedData();