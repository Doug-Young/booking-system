// api-gateway/index.js
const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

const ROOM_SERVICE_URL = "http://room-service:3001";
const BOOKING_SERVICE_URL = "http://booking-service:3002";
const AUTH_SERVICE_URL = "http://auth-service:3003";
const WEATHER_SERVICE_URL = "http://weather-service:3004";


// Health
app.get("/health", (req, res) => {
  res.json({ ok: true });
});

// Rooms
app.get("/rooms", async (req, res) => {
  try {
    const r = await axios.get(`${ROOM_SERVICE_URL}/rooms`);
    res.json(r.data);
  } catch (e) {
    console.log("room-service failed");
    res.status(502).end();
  }
});

// Bookings
app.get("/bookings", async (req, res) => {
  try {
    const r = await axios.get(`${BOOKING_SERVICE_URL}/bookings`);
    res.json(r.data);
  } catch (e) {
    console.log("booking-service failed");
    res.status(502).end();
  }
});

app.post("/bookings", async (req, res) => {
  try {
    const r = await axios.post(`${BOOKING_SERVICE_URL}/bookings`, req.body);
    res.status(201).json(r.data);
  } catch (e) {
    console.log("booking-service failed");
    res.status(502).end();
  }
});

// Auth
app.post("/auth/register", async (req, res) => {
  try {
    const r = await axios.post(`${AUTH_SERVICE_URL}/auth/register`, req.body);
    res.json(r.data);
  } catch (e) {
    console.log("auth-service register failed");
    res.status(502).end();
  }
});

app.post("/auth/login", async (req, res) => {
  try {
    const r = await axios.post(`${AUTH_SERVICE_URL}/auth/login`, req.body);
    res.json(r.data);
  } catch (e) {
    console.log("auth-service login failed");
    res.status(401).end();
  }
});

app.get("/auth/user/:id", async (req, res) => {
  try {
    const r = await axios.get(`${AUTH_SERVICE_URL}/auth/user/${req.params.id}`);
    res.json(r.data);
  } catch (e) {
    console.log("auth-service user lookup failed");
    res.status(404).end();
  }
});

app.get("/weather", async (req, res) => {
  try {
    const r = await axios.get(`${WEATHER_SERVICE_URL}/weather`, { params: req.query });
    res.json(r.data);
  } catch (e) {
    console.log("weather-service failed");
    res.status(502).end();
  }
});

app.listen(PORT, () => {
  console.log(`api-gateway running on ${PORT}`);
});
