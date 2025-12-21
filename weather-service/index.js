// weather-service/index.js
const express = require("express");
const app = express();

const PORT = process.env.PORT || 3004;

// simple, demo weather
function fakeTemp(location, date) {
  const str = `${location || ""}-${date || ""}`.toLowerCase();
  let sum = 0;
  for (let i = 0; i < str.length; i++) sum += str.charCodeAt(i);
  // returns temperature between 10 and 25
  return 10 + (sum % 16);
}

app.get("/weather/health", (req, res) => {
  res.json({ ok: true });
});

app.get("/weather", (req, res) => {
  const location = req.query.location || "unknown";
  const date = req.query.date || "unknown";

  const temperature = fakeTemp(location, date);

  res.json({ location, date, temperature });
});

app.listen(PORT, () => {
  console.log(`weather-service running on ${PORT}`);
});
