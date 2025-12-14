// room-service/index.js

const express = require("express");
const app = express();

const PORT = process.env.PORT || 3001;

app.use(express.json());

// Fake data for now (database comes later)
const rooms = [
  { id: 1, name: "Conference Room A", capacity: 8, basePrice: 80 },
  { id: 2, name: "Conference Room B", capacity: 12, basePrice: 120 },
];

// Health check route
app.get("/rooms/health", (req, res) => {
  res.json({ status: "ok", service: "room-service" });
});

// List all rooms
app.get("/rooms", (req, res) => {
  res.json(rooms);
});

// Get a single room by ID
app.get("/rooms/:id", (req, res) => {
  const id = Number(req.params.id);
  const room = rooms.find(r => r.id === id);

  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }

  res.json(room);
});

app.listen(PORT, () => {
  console.log(`Room service listening on port ${PORT}`);
});
