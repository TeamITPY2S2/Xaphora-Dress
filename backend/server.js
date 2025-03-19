const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8070;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const URL = process.env.MONGODB_URL;
mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connection Success!"))
  .catch((err) => console.error("MongoDB Connection Failed:", err));

// Routes
const cartRoutes = require("./routes/cartRoutes");
app.use("/api/cart", cartRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is up and running on port: ${PORT}`);
});
