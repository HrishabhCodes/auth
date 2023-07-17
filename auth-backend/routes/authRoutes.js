const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { secretKey } = require("../config/config");
const authenticateToken = require("../middleware/authenticateToken");
const User = require("../models/User");

const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ message: "Username already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username, password: hashedPassword });
    await user.save();

    res.json({ message: "User registered successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Login route
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    const accessToken = jwt.sign({ username: user.username }, secretKey, {
      expiresIn: "1m",
    });
    const refreshToken = jwt.sign({ username: user.username }, secretKey, {
      expiresIn: "2m",
    });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Access token refresh route
router.post("/refresh-token", (req, res) => {
  const refreshToken = req.body.refreshToken;
  console.log(refreshToken);
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token provided." });
  }

  jwt.verify(refreshToken, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Invalid refresh token." });
    }

    const accessToken = jwt.sign({ username: user.username }, secretKey, {
      expiresIn: "1m",
    });
    res.json({ accessToken });
  });
});

module.exports = router;
