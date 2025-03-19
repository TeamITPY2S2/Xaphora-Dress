const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const deliveryRoutes = require("./routes/deliveryRoutes"); // Import the delivery routes
const app = express();

dotenv.config(); // Load environment variables

const PORT = process.env.PORT || 8070;

app.use(cors());
app.use(bodyParser.json());

// MongoDB connection URL
const URL = process.env.MONGODB_URL;

// Connect to MongoDB
mongoose
  .connect(URL)
  .then(() => console.log("MongoDB Connection Success!"))
  .catch((err) => console.error("MongoDB Connection Failed:", err));

// Use the delivery routes
app.use("/api/delivery", deliveryRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is up and running on port no: ${PORT}`);
});
