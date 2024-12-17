const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection pool
const db = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "Mataji12apt!", // Ensure this is secure in production
    database: process.env.DB_NAME || "forum_db",
});

// Serve static files
app.use(express.static(path.join(__dirname, '..'))); // Serve files from the root directory


// Root route
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "..", "index.html")); // Serving index.html from the root
});

// --- API Routes ---
// User Registration
app.post("/register", (req, res) => {
    console.log("Received registration request:", req.body);
    const { firstName, lastName, email } = req.body;
    if (!firstName || !lastName || !email) {
        return res.status(400).send("All fields are required.");
    }
    res.status(200).send("Registration successful!");
});

// Fetch Posts (Forum)
app.get("/posts", async (req, res) => {
    console.log("Fetching posts...");
    try {
        const [posts] = await db.query("SELECT * FROM posts");
        res.status(200).json(posts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).send("Error retrieving posts.");
    }
});

// Add New Post (Forum)
app.post("/posts", async (req, res) => {
    console.log("Received post request:", req.body);
    const { subject, message } = req.body;
    if (!subject || !message) {
        return res.status(400).send("Subject and message are required.");
    }

    try {
        const [result] = await db.query(
            "INSERT INTO posts (subject, message) VALUES (?, ?)",
            [subject, message]
        );
        res.status(200).send("Post added successfully.");
    } catch (error) {
        console.error("Error adding post:", error);
        res.status(500).send("Failed to add post.");
    }
});

// Personalized Recovery Plan (about.html)
app.post("/api/personalize", (req, res) => {
    const { addictionType, recoveryStage, goals } = req.body;

    if (!addictionType || !recoveryStage || !goals) {
        return res.status(400).json({ error: "Missing required fields." });
    }

    // Example logic for personalized plan
    const suggestions = getRecoverySuggestions(addictionType, recoveryStage);
    
    const personalizedPlan = {
        addictionType,
        recoveryStage,
        goals,
        suggestions
    };

    res.status(200).json(personalizedPlan);
});

// Function to generate personalized recovery suggestions
function getRecoverySuggestions(addictionType, recoveryStage) {
    if (recoveryStage === "beginner") {
        return [`Start with counseling for ${addictionType}`, "Join a support group", "Begin self-care practices"];
    }
    if (recoveryStage === "intermediate") {
        return [`Try individual therapy for ${addictionType}`, "Focus on physical health and fitness", "Consider a sober coach"];
    }
    if (recoveryStage === "advanced") {
        return [`Work on long-term relapse prevention strategies for ${addictionType}`, "Support others in recovery", "Strengthen mental health resilience"];
    }
    return ["Seek professional advice"];
}

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
