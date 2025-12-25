const express = require("express");
const {login,logout,signup}= require("../Controller/AuthController.js"); 
const {protectRoute }= require("../middleware/protect.js")

const app = express();


app.post("/signup", signup);
app.post("/login", login);
app.post("/logout", logout);

app.get("/me",protectRoute,(req,res)=>{
    res.status(200).json({success:true,user:req.user})
})


module.exports = app;