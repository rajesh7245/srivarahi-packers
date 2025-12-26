const express = require("express");
const path = require("path");
const cors = require("cors");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();

/* ================= PORT (IMPORTANT) ================= */
const PORT = process.env.PORT || 5000;

/* ================= CORS (FIXED FOR ALL DEVICES) ================= */
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

/* ================= BODY PARSERS ================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= SERVE FRONTEND ================= */
app.use(express.static(path.join(__dirname, "../frontend")));

/* ================= MONGODB ================= */
const uri = process.env.MONGODB_URI; // 🔒 from Render env
const client = new MongoClient(uri);
let db;

async function connectDB() {
  try {
    await client.connect();
    db = client.db("srivarahi_packers");
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Error", err);
  }
}
connectDB();

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
      createdAt: new Date(),
    });

    res.json({ message: "Booking submitted successfully 🚚" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Booking failed" });
  }
});

/* ================= GET ALL BOOKINGS ================= */
app.get("/bookings", async (req, res) => {
  try {
    const data = await db.collection("bookings").find().toArray();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
});

/* ================= DELETE BOOKING ================= */
app.delete("/bookings/:id", async (req, res) => {
  try {
    await db.collection("bookings").deleteOne({
      _id: new ObjectId(req.params.id),
    });
    res.json({ message: "Booking deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

/* ================= UPDATE STATUS ================= */
app.put("/bookings/:id/status", async (req, res) => {
  try {
    await db.collection("bookings").updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { status: req.body.status } }
    );
    res.json({ message: "Status updated" });
  } catch (err) {
    res.status(500).json({ message: "Status update failed" });
  }
});

/* ================= ADMIN LOGIN ================= */
app.get("/admin", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/admin-login.html"));
});

app.post("/admin-login", async (req, res) => {
  try {
    const admin = await db.collection("admin").findOne({ username: "admin" });

    if (admin && admin.password === req.body.password) {
      res.sendFile(path.join(__dirname, "../frontend/admin.html"));
    } else {
      res.send("<h3>❌ Wrong password</h3><a href='/admin'>Try again</a>");
    }
  } catch (err) {
    res.status(500).send("Server error");
  }
});

/* ================= CHANGE ADMIN PASSWORD ================= */
app.post("/change-password", async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const admin = await db.collection("admin").findOne({ username: "admin" });

    if (!admin || admin.password !== oldPassword) {
      return res.json({ message: "❌ Old password is wrong" });
    }

    await db.collection("admin").updateOne(
      { username: "admin" },
      { $set: { password: newPassword } }
    );

    res.json({ message: "✅ Password changed successfully" });
  } catch (err) {
    res.status(500).json({ message: "Password change failed" });
  }
});

/* ================= START SERVER ================= */
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
