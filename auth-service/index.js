// auth-service/index.js
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3003;
const MONGO_URI =
  process.env.MONGO_URI ||
  "mongodb://devuser:devpass@mongo:27017/authdb?authSource=admin";

let users;

// Connect to DB, then start server
(async () => {
  try {
    const client = await MongoClient.connect(MONGO_URI);
    const db = client.db("authdb");
    users = db.collection("users");

    console.log("auth-service connected to MongoDB");
    app.listen(PORT, () => console.log(`auth-service running on ${PORT}`));
  } catch (e) {
    console.error("Mongo connect failed");
    process.exit(1);
  }
})();

// Health
app.get("/auth/health", (req, res) => {
  res.json({ ok: true });
});

// Register
app.post("/auth/register", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).end();

  const existing = await users.findOne({ username });
  if (existing) return res.status(409).end();

  const result = await users.insertOne({ username, password });
  res.status(201).json({ id: result.insertedId, username });
});

// Login
app.post("/auth/login", async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) return res.status(400).end();

  const user = await users.findOne({ username, password });
  if (!user) return res.status(401).end();

  res.json({ userId: user._id });
});

// Get user by id
app.get("/auth/user/:id", async (req, res) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) return res.status(400).end();

  const user = await users.findOne({ _id: new ObjectId(id) });
  res.json(user || null);
});
