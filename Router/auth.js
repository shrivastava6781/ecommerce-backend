// Router/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/user");

// Signup
router.post("/signup", async (req, res) => {

  const { name, email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) 
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name, email, password: hashedPassword
    })

    res.status(201).json({ message: "User registered successfully" });
  } 
  catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Login
router.post("/login", async (req, res) => {

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    
    if (!user){
      return res.status(400).json({ message: "Invalid email" });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch){
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ 
      token, 
      user: { name: user.name, email: user.email, id: user._id } 
    });
  } 
  catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
