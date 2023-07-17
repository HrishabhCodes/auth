const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { mongoURI } = require("./config/config");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");

const app = express();
const PORT = process.env.PORT || 9000;

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", blogRoutes);

mongoose
  .connect(mongoURI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
