const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');

const app = express();
app.use(bodyParser.json());
const cors = require('cors');
app.use(cors());

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'Mataji12apt!',
  database: 'forum_db',
});

app.post('/api/personalize', async (req, res) => {
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
    console.error('Database error:', error);
    res.status(500).send('Failed to save recovery plan.');
  }
});

function generateSuggestions(stage) {
  switch (stage) {
    case 'beginner':
      return ['Join a support group', 'Start journaling', 'Attend weekly therapy sessions'];
    case 'intermediate':
      return ['Consider part-time work or volunteering', 'Join advanced therapy groups', 'Explore hobbies'];
    case 'advanced':
      return ['Mentor others in recovery', 'Organize local support groups', 'Build long-term career goals'];
    default:
      return ['Stay motivated!'];
  }
}

app.listen(3001, () => console.log('Server is running on http://localhost:3001'));
