const express = require("express");
const {login,logout,signup}= require("../Controller/AuthController.js"); 
const jwt = require("jsonwebtoken");
const Users = require("../Models/User.js");

const app = express.Router();


app.post("/signup", signup);
app.post("/login", login);
app.post("/logout", logout);

app.get("/me", async (req, res) => {
  const token = req.cookies?.jwt;
  if (!token) {
    return res.status(200).json({ success: false, user: null });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await Users.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(200).json({ success: false, user: null });
    }

    return res.status(200).json({ success: true, user });
  } catch {
    return res.status(200).json({ success: false, user: null });
  }
});


module.exports = app;
