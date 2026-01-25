const express = require("express");
const cors = require("cors");
require("dotenv").config();
const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");


const app = express();
app.use(cors());
app.use(express.json());

// Test DB connection
db.getConnection((err) => {
  if (err) {
    console.log("Database connection FAILED ❌");
    console.log(err);
  } else {
    console.log("Database connected SUCCESSFULLY ✅");
  }
});

// Auth routes
app.use("/api/auth", authRoutes);
app.use("/api", protectedRoutes);

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.listen(process.env.PORT, () => {
  console.log("Server started on http://localhost:" + process.env.PORT);
});
