const Users= require("../Models/User.js");
const jwt= require("jsonwebtoken");



 const signup = async (req, res) => {
  const { userName, password, email } = req.body;
  console.log(req.body);
  
  if (!userName || !password || !email) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const user1 = new Users({
      userName,
      email,
      password,
    });
    await user1.save();
    const token = jwt.sign({ userId: user1._id }, process.env.JWT_TOKEN, {
      expiresIn: "7d",
    });

    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });




    res.status(201).json({ message: "User created successfully", token });
  } catch (e) {
    console.log(e);
  }
}



const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    // ✅ Validate input
    if (!userName || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // 🔍 Find user by username
    const user = await Users.findOne({ userName });
    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    // 🔐 Check password
    const isMatch = await user.matchpass(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password." });
    }

    // 🪙 Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_TOKEN,
      { expiresIn: "7d" }
    );

    // 🍪 Set cookie
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    // ✅ Success response
    res.status(200).json({ message: "Login successful." });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
};

 const logout = async (req, res) => {
  res.clearCookie("jwt")
  res.status(201).json({ message: "passss" });
}


module.exports = { signup ,logout,login};
