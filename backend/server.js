require("dotenv").config(); // MUST be first

const express = require("express");
const path = require("path");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

/* ================= MIDDLEWARE ================= */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= SERVE FRONTEND ================= */
app.use(express.static(path.join(__dirname, "../frontend")));

/* ================= MONGODB ================= */
const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error("❌ MONGODB_URI not found. Check .env or Render env vars.");
  process.exit(1);
}

const client = new MongoClient(uri);
let db;

/* ================= CONNECT & START SERVER ================= */
async function startServer() {
  try {
    await client.connect();
    db = client.db("srivarahi_packers");

    console.log("✅ MongoDB Connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
}

startServer();

/* ================= CREATE BOOKING ================= */
app.post("/book", async (req, res) => {
  try {
    await db.collection("bookings").insertOne({
      name: req.body.name,
      phone: req.body.phone,
      from: req.body.from,
      to: req.body.to,
      service: req.body.service,
      date: req.body.date,
      status: "Pending",
      createdAt: new Date()
    });

    res.json({ message: "Booking submitted successfully 🚚" });
  } catch (err) {
    console.error("❌ Booking error:", err.message);
    res.status(500).json({ message: "Booking failed" });
  }
});

/* ================= GET BOOKINGS ================= */
app.get("/bookings", async (req, res) => {
  const data = await db.collection("bookings").find().toArray();
  res.json(data);
});

/* ================= DELETE BOOKING ================= */
app.delete("/bookings/:id", async (req, res) => {
  await db.collection("bookings").deleteOne({
    _id: new ObjectId(req.params.id)
  });
  res.json({ message: "Deleted" });
});

/* ================= UPDATE STATUS ================= */
app.put("/bookings/:id/status", async (req, res) => {
  await db.collection("bookings").updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: { status: req.body.status } }
  );
  res.json({ message: "Updated" });
});

/* ================= ADMIN ================= */
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin.html"));
});
