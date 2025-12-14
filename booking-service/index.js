// booking-service/index.js

const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3002;
const MONGO_URI = process.env.MONGO_URI || "mongodb://devuser:devpass@mongo:27017/bookingdb?authSource=admin";

let bookingsCollection;

// Connect to MongoDB first, then start the server
async function start() {
  try {
    const client = await MongoClient.connect(MONGO_URI);
    const db = client.db("bookingdb");
    bookingsCollection = db.collection("bookings");
    console.log("Connected to MongoDB for booking-service");

    app.listen(PORT, () => {
      console.log(`Booking service listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

// Healthcheck
app.get("/bookings/health", (req, res) => {
  res.json({ status: "ok", service: "booking-service" });
});

// Get all bookings
app.get("/bookings", async (req, res) => {
  try {
    const bookings = await bookingsCollection.find({}).toArray();
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching bookings:", err);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

// Create a booking
app.post("/bookings", async (req, res) => {
  const { roomId, userName, date } = req.body;

  if (!roomId || !userName || !date) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const newBooking = {
    roomId,
    userName,
    date,
    createdAt: new Date()
  };

  try {
    const result = await bookingsCollection.insertOne(newBooking);
    res.status(201).json({ id: result.insertedId, ...newBooking });
  } catch (err) {
    console.error("Error creating booking:", err);
    res.status(500).json({ error: "Failed to create booking" });
  }
});

// Get booking by ID (string _id from Mongo)
app.get("/bookings/:id", async (req, res) => {
  const { ObjectId } = require("mongodb");
  let objectId;

  try {
    objectId = new ObjectId(req.params.id);
  } catch {
    return res.status(400).json({ error: "Invalid booking ID" });
  }

  try {
    const booking = await bookingsCollection.findOne({ _id: objectId });
    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }
    res.json(booking);
  } catch (err) {
    console.error("Error fetching booking:", err);
    res.status(500).json({ error: "Failed to fetch booking" });
  }
});

start();
