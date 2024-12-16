const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Temporary in-memory storage for posts (from server.js)
let posts = [];

// Database connection pool (from serverpersonalize.js)
const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Mataji12apt!",
    database: "forum_db",
});

// --- Routes from server.js ---

// Registration endpoint
app.post("/register", (req, res) => {
    const { firstName, lastName, email } = req.body;
    if (!firstName || !lastName || !email) {
        return res.status(400).send("All fields are required.");
    }
    res.status(200).send("Registration successful!");
});

// Post creation endpoint
app.post("/posts", (req, res) => {
    const { subject, message } = req.body;
    if (!subject || !message) {
        return res.status(400).send("Subject and message are required.");
    }
    posts.push({ subject, message });
    res.status(200).send("Post created!");
});
// Handle root route (default page)
app.get("/", (req, res) => {
    res.send("Welcome to the API!"); // Or any message you prefer
});
// Get all posts
app.get("/posts", (req, res) => {
    res.status(200).json(posts);
});

// --- Routes from serverpersonalize.js ---

// Personalized recovery plan endpoint
app.post("/api/personalize", async (req, res) => {
    const { addictionType, recoveryStage, goals } = req.body;

    const suggestions = generateSuggestions(recoveryStage);

    try {
        const [result] = await db.query(
            `INSERT INTO recovery_plans (user_id, addiction_type, recovery_stage, goals, suggestions)
       VALUES (?, ?, ?, ?, ?)`,
            [1, addictionType, recoveryStage, goals, JSON.stringify(suggestions)]
        );

        res.json({
            id: result.insertId,
            addictionType,
            recoveryStage,
            goals,
            suggestions,
        });
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).send("Failed to save recovery plan.");
    }
});

// Suggestion generator function
function generateSuggestions(stage) {
    switch (stage) {
        case "beginner":
            return ["Join a support group", "Start journaling", "Attend weekly therapy sessions"];
        case "intermediate":
            return ["Consider part-time work or volunteering", "Join advanced therapy groups", "Explore hobbies"];
        case "advanced":
            return ["Mentor others in recovery", "Organize local support groups", "Build long-term career goals"];
        default:
            return ["Stay motivated!"];
    }
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
