// auth-service/index.js

const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3003;
const MONGO_URI = process.env.MONGO_URI || "mongodb://devuser:devpass@mongo:27017/authdb?authSource=admin";

let usersCollection;

// Connect to MongoDB first
async function start() {
  try {
    const client = await MongoClient.connect(MONGO_URI);
    const db = client.db("authdb");
    usersCollection = db.collection("users");

    console.log("Connected to MongoDB for auth-service");

    app.listen(PORT, () => {
      console.log(`Auth service listening on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
}

// Health
app.get("/auth/health", (req, res) => {
  res.json({ status: "ok", service: "auth-service" });
});

// Register user
app.post("/auth/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "Missing username or password" });

  try {
    const existing = await usersCollection.findOne({ username });
    if (existing)
      return res.status(409).json({ error: "User already exists" });

    const result = await usersCollection.insertOne({ username, password });
    res.status(201).json({ id: result.insertedId, username });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Registration failed" });
  }
});

// Login user
app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password)
    return res.status(400).json({ error: "Missing username or password" });

  try {
    const user = await usersCollection.findOne({ username, password });

    if (!user)
      return res.status(401).json({ error: "Invalid credentials" });

    res.json({ message: "Login successful", userId: user._id });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed" });
  }
});

// Get user by ID
app.get("/auth/user/:id", async (req, res) => {
  try {
    const id = new ObjectId(req.params.id);
    const user = await usersCollection.findOne({ _id: id });

    if (!user)
      return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: "Invalid ID format" });
  }
});

start();
