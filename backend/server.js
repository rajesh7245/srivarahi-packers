const express = require("express");
const path = require("path");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

/* ===================== PORT (VERY IMPORTANT) ===================== */
const PORT = process.env.PORT || 5000;

/* ===================== MIDDLEWARE ===================== */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ===================== SERVE FRONTEND ===================== */
app.use(express.static(path.join(__dirname, "../frontend")));

/* ===================== MONGODB ===================== */
const uri = process.env.MONGODB_URI; // FROM RENDER ENV
const client = new MongoClient(uri);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("srivarahi_packers");
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed", err);
  }
}
connectDB();

/* ===================== CREATE BOOKING ===================== */
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
      createdAt: new Date(),
    });

    res.json({ message: "Booking submitted successfully 🚚" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking failed" });
  }
});

/* ===================== ADMIN APIs ===================== */
app.get("/bookings", async (req, res) => {
  try {
    const data = await db.collection("bookings").find().toArray();
    res.json(data);
  } catch {
    res.status(500).json({ message: "Fetch failed" });
  }
});

app.delete("/bookings/:id", async (req, res) => {
  try {
    await db.collection("bookings").deleteOne({
      _id: new ObjectId(req.params.id),
    });
    res.json({ message: "Booking deleted" });
  } catch {
    res.status(500).json({ message: "Delete failed" });
  }
});

/* ===================== ADMIN LOGIN ===================== */
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin.html"));
});

/* ===================== START SERVER ===================== */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
