const express = require("express");
const mongoose = require("mongoose");
const cookieParser=require("cookie-parser");
const cors=require("cors");
require("dotenv").config();

const Auth = require("./router/auth.js");
const app = express();
const port = 9000;
const videoRoutes = require("./router/video.js");



async function main() {
  try {
    await mongoose.connect(process.env.MONGO_DB); // no extra options needed
    console.log("DB connected");
  } catch (err) {
    console.error("DB connection error:", err.message);
  }
}
app.use("/api/videos", videoRoutes);
app.use(express.json())
app.use(cookieParser())
app.use("/auth",Auth)
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  main();
});

app.get("/", (req, res) => {
  res.send("done");
});