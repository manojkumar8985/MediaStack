const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");              // ✅ ADDED
const { Server } = require("socket.io");   // ✅ ADDED
require("dotenv").config();

const Auth = require("./router/auth.js");
const videoRoutes = require("./router/video.js");

const app = express();
const port = 9000;

/* =======================
   DATABASE CONNECTION
======================= */
async function main() {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("DB connected");
  } catch (err) {
    console.error("DB connection error:", err.message);
  }
}

/* =======================
   MIDDLEWARES (UNCHANGED)
======================= */
app.use(cors({
  origin: "http://localhost:5173", // or 3000
  credentials: true,               // 🔥 MUST
}));

app.use(express.json());
app.use(cookieParser());

/* =======================
   ROUTES (UNCHANGED)
======================= */
app.use("/auth", Auth);
app.use("/api/videos", videoRoutes);

app.get("/", (req, res) => {
  res.send("done");
});

/* =======================
   SOCKET.IO (REQUIRED ADDITION)
======================= */
const server = http.createServer(app);     // ✅ REQUIRED

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
});

// make io available in controllers
app.set("io", io);

/* =======================
   START SERVER (1-LINE CHANGE)
======================= */
server.listen(port, () => {                // ✅ CHANGED
  console.log(`Server running on port ${port}`);
  main();
});
