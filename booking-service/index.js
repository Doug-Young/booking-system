// booking-service/index.js
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3002;
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://devuser:devpass@mongo:27017/bookingdb?authSource=admin";

// ✅ 7.2: weather service + base prices (goes here, near the config)
const WEATHER_SERVICE_URL = "http://weather-service:3004";

const ROOM_PRICES = {
  1: 80,
  2: 120
};

let bookings;

// Connect DB, then start server
(async () => {
  try {
    const client = await MongoClient.connect(MONGO_URI);
    const db = client.db("bookingdb");
    bookings = db.collection("bookings");

    console.log("booking-service connected to MongoDB");
    app.listen(PORT, () => console.log(`booking-service running on ${PORT}`));
  } catch (e) {
    console.error("Mongo connect failed");
    process.exit(1);
  }
})();

// Health
app.get("/bookings/health", (req, res) => {
  res.json({ ok: true });
});

// List bookings
app.get("/bookings", async (req, res) => {
  const all = await bookings.find({}).toArray();
  res.json(all);
});

// ✅ 7.3: Create booking WITH weather-based pricing (replaces your old POST)
app.post("/bookings", async (req, res) => {
  const { roomId, userName, date, location } = req.body;
  if (!roomId || !userName || !date) return res.status(400).end();

  const basePrice = ROOM_PRICES[roomId] || 100;

  let temperature = 21;
  try {
    const r = await axios.get(`${WEATHER_SERVICE_URL}/weather`, {
      params: { location: location || "unknown", date }
    });
    temperature = r.data.temperature;
  } catch {
    temperature = 21;
  }

  let adjustment = 0;
  if (temperature < 21) adjustment = 5;
  if (temperature > 21) adjustment = -5;

  const finalPrice = basePrice + adjustment;

  const doc = {
    roomId,
    userName,
    date,
    location: location || "unknown",
    basePrice,
    temperature,
    finalPrice,
    createdAt: new Date()
  };

  const result = await bookings.insertOne(doc);
  res.status(201).json({ id: result.insertedId, ...doc });
});

// Get booking by id
app.get("/bookings/:id", async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).end();

  const booking = await bookings.findOne({ _id: new ObjectId(id) });
  res.json(booking || null);
});
