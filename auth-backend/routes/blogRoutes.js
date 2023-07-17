const express = require("express");
const authenticateToken = require("../middleware/authenticateToken");
const Blog = require("../models/Blog");

const router = express.Router();

// Create blog route
router.post("/blogs", authenticateToken, async (req, res) => {
  try {
    const { title, content } = req.body;
    const author = req.user.username;

    const blog = new Blog({ title, content, author });
    await blog.save();

    res.json({ message: "Blog created successfully." });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Get all blogs route
router.get("/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find().populate("author", "username");
    res.json(blogs);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = router;
