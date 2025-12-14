// api-gateway/index.js

const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Local URLs for your services
const ROOM_SERVICE_URL = "http://room-service:3001";
const BOOKING_SERVICE_URL = "http://booking-service:3002";
const AUTH_SERVICE_URL = "http://auth-service:3003";


// Gateway health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "api-gateway" });
});

// ----- ROOM ROUTES -----
app.get("/rooms", async (req, res) => {
  try {
    const response = await axios.get(`${ROOM_SERVICE_URL}/rooms`);
    res.json(response.data);
  } catch (err) {
    console.error("room-service error:", err.message);
    res.status(500).json({ error: "Room service unavailable" });
  }
});

// ----- BOOKING ROUTES -----
app.get("/bookings", async (req, res) => {
  try {
    const response = await axios.get(`${BOOKING_SERVICE_URL}/bookings`);
    res.json(response.data);
  } catch (err) {
    console.error("booking-service error:", err.message);
    res.status(500).json({ error: "Booking service unavailable" });
  }
});

app.post("/bookings", async (req, res) => {
  try {
    const response = await axios.post(
      `${BOOKING_SERVICE_URL}/bookings`,
      req.body
    );
    res.status(201).json(response.data);
  } catch (err) {
    console.error("booking-service error:", err.message);
    res.status(500).json({ error: "Booking service unavailable" });
  }
});

// ----- AUTH ROUTES -----
app.post("/auth/login", async (req, res) => {
  try {
    const response = await axios.post(
      `${AUTH_SERVICE_URL}/auth/login`,
      req.body
    );
    res.json(response.data);
  } catch (err) {
    console.error("auth-service error:", err.message);
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.get("/auth/user/:id", async (req, res) => {
  try {
    const response = await axios.get(
      `${AUTH_SERVICE_URL}/auth/user/${req.params.id}`
    );
    res.json(response.data);
  } catch (err) {
    console.error("auth-service error:", err.message);
    res.status(404).json({ error: "User not found" });
  }
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});
// Register a user
app.post("/auth/register", async (req, res) => {
  try {
    const response = await axios.post(
      `${AUTH_SERVICE_URL}/auth/register`,
      req.body
    );
    res.json(response.data);
  } catch (err) {
    console.error("auth-service error:", err.message);
    res.status(500).json({ error: "Registration failed" });
  }
});
