const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { randomUUID } = require("crypto");

// Enable CORS for all routes
app.use(cors());
app.use(express.static("public"));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const users = new Map();

// Root endpoint serving the HTML file
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Endpoint to create a new user
app.post("/api/users", (req, res) => {
  const username = req.body.username;

  if (!username) {
    return res.status(400).json({ error: "Username is required" });
  }

  const id = randomUUID();
  const user = { username: username, _id: id, log: [] };
  users.set(id, user);

  res.json(user);
});

// Endpoint to get all users
app.get("/api/users", (req, res) => {
  const allUsers = Array.from(users.values());
  res.json(allUsers);
});

// Endpoint to add an exercise for a user
app.post("/api/users/:_id/exercises", (req, res) => {
  const userId = req.params._id;
  const { description, duration, date } = req.body;

  if (!description || !duration) {
    return res
      .status(400)
      .json({ error: "Description and duration are required" });
  }

  const existingUser = users.get(userId);
  if (!existingUser) {
    return res.status(404).json({ error: "User not found" });
  }

  const exerciseDate = date ? new Date(date) : new Date();
  if (isNaN(exerciseDate.getTime())) {
    return res.status(400).json({ error: "Invalid date format" });
  }

  const exercise = {
    description: description,
    duration: parseInt(duration),
    date: exerciseDate.toDateString(),
  };

  // Add exercise to user's log
  existingUser.log.push(exercise);

  const user = {
    _id: existingUser._id,
    username: existingUser.username,
    description: exercise.description,
    duration: exercise.duration,
    date: exercise.date,
  };

  res.json(user);
});

// Endpoint to get a user's exercise log
app.get("/api/users/:_id/logs", (req, res) => {
  try {
    const userId = req.params._id;
    const user = users.get(userId);
    const { from, to, limit } = req.query;

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let filteredLogs = user.log;

    // 'from' date filter
    if (from) {
      const fromDate = new Date(from);
      if (isNaN(fromDate.getTime())) {
        return res.status(400).json({ error: "Invalid 'from' date format" });
      }
      filteredLogs = filteredLogs.filter(
        (log) => new Date(log.date) >= fromDate
      );
    }

    // 'to' date filter
    if (to) {
      const toDate = new Date(to);
      if (isNaN(toDate.getTime())) {
        return res.status(400).json({ error: "Invalid 'to' date format" });
      }
      filteredLogs = filteredLogs.filter((log) => new Date(log.date) <= toDate);
    }

    // 'limit' filter
    if (limit) {
      const limitNum = parseInt(limit);
      if (isNaN(limitNum) || limitNum < 1) {
        return res.status(400).json({ error: "Invalid 'limit' value" });
      }
      filteredLogs = filteredLogs.slice(0, limitNum);
    }

    res.json({
      _id: user._id,
      username: user.username,
      count: filteredLogs.length,
      log: filteredLogs,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
