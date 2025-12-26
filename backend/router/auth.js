const express = require("express");
const {login,logout,signup}= require("../Controller/AuthController.js"); 
const {protect }= require("../middleware/protect.js")

const app = express.Router();


app.post("/signup", signup);
app.post("/login", login);
app.post("/logout", logout);

app.get("/me",protect,(req,res)=>{
    res.status(200).json({success:true,user:req.user})
})


module.exports = app;