// room-service/index.js
const express = require("express");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Static room data (sufficient for coursework)
const rooms = [
  { id: 1, name: "Conference Room A", capacity: 8, basePrice: 80 },
  { id: 2, name: "Conference Room B", capacity: 12, basePrice: 120 }
];

// Health
app.get("/rooms/health", (req, res) => {
  res.json({ ok: true });
});

// List rooms
app.get("/rooms", (req, res) => {
  res.json(rooms);
});

// Get room by id
app.get("/rooms/:id", (req, res) => {
  const id = Number(req.params.id);
  const room = rooms.find(r => r.id === id);
  res.json(room || null);
});

app.listen(PORT, () => {
  console.log(`room-service running on ${PORT}`);
});
