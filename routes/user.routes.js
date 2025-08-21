import express from "express";
const router = express.Router();
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.models.js";
import dotenv from "dotenv";

router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const existUser = await User.findOne({
      $or: [{ username }, { email }],
    });
    if (existUser) {
      return res
        .status(400)
        .json({ message: "Username or Email already exists!" });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPass });
    const saveNewUser = await newUser.save();
    res.status(200).json(saveNewUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({
      $or: [{ email: username }, { username: username }],
    });
    if (!user) {
      return res
        .status(404)
        .json({ message: "Username or E-mail does not exist!" });
    }
    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) {
      return res.status(400).json({ message: "Invalid Credentials!" });
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/logout", async (req, res) => {
  try {
    res.status(200).json({ message: "User Logout Successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
