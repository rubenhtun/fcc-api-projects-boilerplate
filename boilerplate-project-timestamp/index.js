var express = require("express");
var app = express();

// Enable CORS so that the API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 }));

app.use(express.static("public"));

// Root endpoint serving the HTML file
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// Function to check if a date is invalid
const isValidDate = (date) => !isNaN(date.getTime());

// API endpoint to handle date requests
app.get("/api/:date?", (req, res) => {
  let dateParam = req.params.date;

  if (dateParam === undefined) {
    const currentDate = new Date();
    return res.json({
      unix: currentDate.getTime(),
      utc: currentDate.toUTCString(),
    });
  }

  let date;

  if (!isNaN(dateParam) && !isNaN(parseFloat(dateParam))) {
    date = new Date(parseInt(dateParam));
  } else {
    date = new Date(dateParam);
  }

  // Check if date is valid
  if (!isValidDate(date)) {
    return res.json({ error: "Invalid Date" });
  }

  res.json({
    unix: date.getTime(),
    utc: date.toUTCString(),
  });
});

// Listen on port set in environment variable or default to 3000
var listener = app.listen(process.env.PORT || 3000, function () {
  console.log("Your app is listening on port " + listener.address().port);
});
