import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { verifyuser } from "../middleware/auth.js";

const router = express.Router();

router.post("/sign", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const newUser = new User({ name, email, password: hash });
    await newUser.save();
    res.json({ status: true, message: "Account created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "User does not exist" });
    } else {
      const pass = await bcrypt.compare(password, user.password);
      if (!pass) {
        return res.json({ message: "Wrong password" });
      } else {
        const token = jwt.sign(
          { id: user._id, name: user.name },
          process.env.KEY,
          {
            expiresIn: "1h",
          }
        );
        res.cookie("token", token, {
          httpOnly: true,
          secure: true, // Always set to true for production HTTPS
          sameSite: "None", // 'None' is required for cross-site cookies
          maxAge: 3600000,
        });

        return res.json({ status: true, message: "Login successful" });
      }
    }
  } catch (err) {
    console.error("Login Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/logout", async (req, res) => {
  res.clearCookie("token").json({ message: "Logged Out" });
});

router.get("/profile", verifyuser, (req, res) => {
  res.json(req.user);
});

export default router;
