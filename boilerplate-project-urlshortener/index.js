require("dotenv").config();
const express = require("express");
const cors = require("cors");
const dns = require("dns");
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;
const urlDatabase = new Map();
let urlCounter = 1;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/public", express.static(`${process.cwd()}/public`));

// Root endpoint serving the HTML file
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

// Short URL API endpoint
app.post("/api/shorturl", (req, res) => {
  const url = req.body.url;

  try {
    const urlObj = new URL(url);

    dns.lookup(urlObj.hostname, (err) => {
      if (err) {
        res.json({ error: "Invalid URL" });
        return;
      }

      urlDatabase.set(urlCounter, url);
      res.json({ original_url: url, short_url: urlCounter });
      urlCounter++;
    });
  } catch (error) {
    res.json({ error: "Invalid URL" });
  }
});

// Redirect endpoint
app.get("/api/shorturl/:short_url", (req, res) => {
  const shortUrl = req.params.short_url;
  const originalUrl = urlDatabase.get(Number(shortUrl));

  if (!originalUrl) {
    res.json({ error: "No short URL found for the given input" });
    return;
  }

  res.redirect(originalUrl);
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
