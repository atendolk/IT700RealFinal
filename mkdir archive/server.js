const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

let posts = []; // Temporary in-memory storage for posts

app.use(cors());
app.use(bodyParser.json());

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

// Get all posts
app.get("/posts", (req, res) => {
  res.status(200).json(posts);
});

// Start the server
app.listen(PORT, () => {
  console.log(Server running on http://localhost:${PORT});
});

serverpersonalize.js: