const { Router } = require("express");
const userDetails = require("../model/userSchema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("../asyncHandler");

const userAuthRouter = Router();

// SIGNUP
userAuthRouter.post("/signup", asyncHandler(async (req, res) => {
  try {
    const { firstname, lastname, password } = req.body || {};
    const email = String(req.body?.email || "").trim().toLowerCase();
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({ error: "First name, last name, email, and password are required" });
    }

    const existingUser = await userDetails.findOne({
      email,
    });
    if (existingUser) return res.status(409).json({ message: "Email already exists" });

    const newPassword = await bcrypt.hash(password, 10);
    await userDetails.create({
      firstname,
      lastname,
      email,
      password: newPassword,
      token: "",
    });
    return res.status(201).json({ status: "OK" });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Email already exists" });
    console.error("Signup failed:", err);
    return res.status(500).json({ error: "Could not create account" });
  }
}));

// LOGIN
userAuthRouter.post("/login", asyncHandler(async (req, res) => {
  try {
    const email = String(req.body?.email || "").trim().toLowerCase();
    const password = req.body?.password;
    if (!email || !password) return res.status(400).json({ error: "Email and password are required" });

    const user = await userDetails.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ status: "ERROR", error: "Invalid email or password" });
    }

    const token = jwt.sign(
      { firstname: user.firstname, lastname: user.lastname, email: user.email },
      process.env.JWT_SECRET || "mysecretpasswordkey",
      { expiresIn: "1d" }
    );
    await userDetails.updateOne({ _id: user._id }, { $set: { token } });
    return res.json({ status: "OK", user: token });
  } catch (err) {
    console.error("Login failed:", err);
    return res.status(500).json({ error: "Could not log in" });
  }
}));

// LOGOUT
userAuthRouter.post("/logout", asyncHandler(async (req, res) => {
  try {
    const { token } = req.headers;
    if (!token) return res.status(400).json({ error: "Token header is required" });
    const user = await userDetails.findOne({ token: token });
    if (user) {
      user.token = "";
      await user.save();
      return res.status(200).json({ message: "logout successfully" });
    } else {
      return res.status(401).json({ error: "invalid token" });
    }
  } catch (err) {
    console.error("Logout failed:", err);
    return res.status(500).json({ error: "Could not log out" });
  }
}));

module.exports = userAuthRouter;
