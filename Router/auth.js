// Router/auth.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../Models/user");
const { Resend } = require("resend");
const crypto = require("crypto");
const resend = new Resend(process.env.RESEND_API_KEY);


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

// forgot password
router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }
    // Generate Token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;
    await user.save();

    // Reset URL
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // Send Email
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: user.email,
      subject: "TRNZY Password Reset",
      html: `
        <div style="
          font-family: Arial;
          padding: 20px;
        ">

          <h1>TRNZY</h1>

          <h2>Password Reset</h2>

          <p>
            Click below button to reset your password
          </p>

          <a
            href="${resetUrl}"
            style="
              display:inline-block;
              padding:12px 20px;
              background:#d9ff00;
              color:black;
              text-decoration:none;
              border-radius:8px;
              font-weight:bold;
            "
          >
            Reset Password
          </a>

        </div>
      `
    });
    res.status(200).json({
      message: "Reset link sent successfully"
    });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
});

//Reset Passwrod
router.post("/reset-password/:token", async (req, res) => {

  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: {
        $gt: Date.now()
      }
    });
    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired token"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save();

    res.status(200).json({
      message: "Password reset successful"
    });

  }
  catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error"
    });
  }
});

module.exports = router;
