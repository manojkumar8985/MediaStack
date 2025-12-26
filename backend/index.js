const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");             
const { Server } = require("socket.io");  
require("dotenv").config();

const Auth = require("./router/auth.js");
const videoRoutes = require("./router/video.js");

const app = express();
app.set('trust proxy', 1); // Trust the first proxy
const port = 9000;


async function main() {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("DB connected");
  } catch (err) {
    console.error("DB connection error:", err.message);
  }
}

app.use(express.json());
app.use(cookieParser());

const allowedOrigins = ["http://localhost:5173", "https://mediastack-1.onrender.com", "https://media-stack-h2ve.vercel.app"];

app.use(cors({
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));


app.use("/auth", Auth);
app.use("/api/videos", videoRoutes);

app.get("/", (req, res) => {
  res.send("done");
});


const server = http.createServer(app);     

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173", "https://mediastack-1.onrender.com", "https://media-stack-h2ve.vercel.app"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
});

app.set("io", io);


server.listen(port, () => {               
  console.log(`Server running on port ${port}`);
  main();
});
