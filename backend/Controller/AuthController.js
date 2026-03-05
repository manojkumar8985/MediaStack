const Users = require("../Models/User.js");
const jwt = require("jsonwebtoken");

const getJwtCookieOptions = (req) => {
  const isSecure =
    req.secure ||
    (typeof req.headers?.["x-forwarded-proto"] === "string" &&
      req.headers["x-forwarded-proto"].includes("https"));

  return {
    httpOnly: true,
    sameSite: isSecure ? "none" : "lax",
    secure: isSecure,
    path: "/",
  };
};

/* ===================== SIGNUP ===================== */
const signup = async (req, res) => {
  try {
    const { userName, password, email } = req.body;

    if (!userName || !password || !email) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await Users.findOne({ userName });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const user = await Users.create({
      userName,
      email,
      password,
    });

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      ...getJwtCookieOptions(req),
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User created successfully",
    });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===================== LOGIN ===================== */
const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await Users.findOne({ userName });
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    const isMatch = await user.matchpass(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("jwt", token, {
      ...getJwtCookieOptions(req),
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({ message: "Login successful" });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ===================== LOGOUT ===================== */
const logout = async (req, res) => {
  try {
    res.clearCookie("jwt", getJwtCookieOptions(req));

    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed" });
  }
};


module.exports = { signup, login, logout };
