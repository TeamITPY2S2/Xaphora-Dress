const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config(); // Load environment variables

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Built-in middleware to parse JSON

// Import Routes
const userRoutes = require("./Routes/UserRoutes");
const authRoutes = require("./Routes/authRoutes");
const addAdminRoutes = require('./Routes/addAdminRoutes'); 

// Use Routes
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/admin", addAdminRoutes);

const PORT = process.env.PORT || 8070;
const URL = process.env.MONGODB_URL;

mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connection Success!"))
  .catch((err) => console.error("MongoDB Connection Failed:", err));

app.listen(PORT, () => {
  console.log(`Server is up and running on port no: ${PORT}`);
});