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
const port = 9000;


async function main() {
  try {
    await mongoose.connect(process.env.MONGO_DB);
    console.log("DB connected");
  } catch (err) {
    console.error("DB connection error:", err.message);
  }
}

app.use(cors({
  origin: "http://localhost:5173", 
  credentials: true,               
}));

app.use(express.json());
app.use(cookieParser());


app.use("/auth", Auth);
app.use("/api/videos", videoRoutes);

app.get("/", (req, res) => {
  res.send("done");
});


const server = http.createServer(app);     

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
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
