require("dotenv").config();
var express = require("express");
var app = express();

// Enable CORS so that the API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 }));

// Serve static files from the "public" directory
app.use(express.static("public"));

// Root endpoint serving the HTML file
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// API endpoint to parse headers
app.get("/api/whoami", (req, res) => {
  const ipaddress = req.ip;
  const language = req.headers["accept-language"];
  const software = req.headers["user-agent"];

  res.json({
    ipaddress: ipaddress,
    language: language,
    software: software,
  });
});

// Listen for requests
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
