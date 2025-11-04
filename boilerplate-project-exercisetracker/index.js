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
  const user = { username: username, _id: id };

  res.json(user);
});

// Endpoint to add an exercise for a user
app.post("/api/users/:_id/", (req, res) => {
  const userId = req.params._id;
  const { description, duration, date } = req.body;

  if (!description || !duration) {
    return res
      .status(400)
      .json({ error: "Description and duration are required" });
  }

  const exerciseDate = date ? new Date(date) : new Date();

  const user = {
    _id: userId,
    exercise: {
      description: description,
      duration: parseInt(duration),
      date: exerciseDate.toDateString(),
    },
  };

  res.json(user);
});

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
