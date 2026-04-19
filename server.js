// ============================================================
// TaskVault - Simple Backend
// Uses: Node.js, Express, MongoDB (via native driver)
// ============================================================

// ── Import required packages ──────────────────────────────
const express  = require("express");         // Web server
const { MongoClient, ObjectId } = require("mongodb"); // MongoDB driver
const path     = require("path");            // For serving HTML files

// ── App Setup ─────────────────────────────────────────────
const app  = express();
const PORT = 3000;

// MongoDB connection string (local MongoDB running on your computer)
const MONGO_URL = "mongodb://localhost:27017";
const DB_NAME   = "taskvault";  // Database name

// ── Middleware ─────────────────────────────────────────────
// Parse incoming JSON request bodies
app.use(express.json());

// Serve static files (index.html, style.css, dashboard.html)
// from the same folder as server.js
app.use(express.static(path.join(__dirname)));

// ── Connect to MongoDB ─────────────────────────────────────
let db; // We'll store the database connection here

MongoClient.connect(MONGO_URL)
  .then(client => {
    db = client.db(DB_NAME);
    console.log("✅ Connected to MongoDB");

    // Start the server only after DB is connected
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1); // Stop the app if DB fails
  });


// ============================================================
// ── ROUTES ──────────────────────────────────────────────────
// ============================================================

// ── POST /api/login ────────────────────────────────────────
// Check username and password against the "users" collection
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;

  // Look for a user with matching username and password
  const user = await db.collection("users").findOne({ username, password });

  if (user) {
    res.json({ success: true });
  } else {
    res.json({ success: false, message: "Invalid username or password." });
  }
});


// ── GET /api/tasks ─────────────────────────────────────────
// Return all tasks from the "tasks" collection
app.get("/api/tasks", async (req, res) => {
  const tasks = await db.collection("tasks").find().toArray();
  res.json(tasks);
});


// ── POST /api/tasks ────────────────────────────────────────
// Add a new task to the "tasks" collection
app.post("/api/tasks", async (req, res) => {
  const { title, priority, date, time } = req.body;

  // Build the task object
  const newTask = {
    title:     title,
    priority:  priority || "low",
    date:      date || "",
    time:      time || "",
    completed: false,           // All new tasks start as incomplete
    createdAt: new Date()       // Store when it was created
  };

  // Insert into MongoDB
  const result = await db.collection("tasks").insertOne(newTask);
  res.json({ success: true, id: result.insertedId });
});


// ── PATCH /api/tasks/:id ───────────────────────────────────
// Update a task (mark complete/incomplete)
app.patch("/api/tasks/:id", async (req, res) => {
  const taskId   = req.params.id;      // Get the task ID from the URL
  const { completed } = req.body;       // Get the new completed status

  // Update the task in MongoDB using its _id
  await db.collection("tasks").updateOne(
    { _id: new ObjectId(taskId) },      // Find by ID
    { $set: { completed: completed } }  // Update the "completed" field
  );

  res.json({ success: true });
});


// ── DELETE /api/tasks/:id ──────────────────────────────────
// Delete a task from the "tasks" collection
app.delete("/api/tasks/:id", async (req, res) => {
  const taskId = req.params.id;

  // Delete the task from MongoDB using its _id
  await db.collection("tasks").deleteOne({ _id: new ObjectId(taskId) });

  res.json({ success: true });
});