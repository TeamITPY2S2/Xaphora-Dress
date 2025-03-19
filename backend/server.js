const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();

dotenv.config(); // Load environment variables

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

// Import Routes
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./Routes/UserRoutes');
const deliveryRoutes = require('./Routes/DeliveryRoutes');

// Use Routes
app.use("/api", productRoutes);
app.use("/users", userRoutes);
app.use("/api/delivery", deliveryRoutes);

const PORT = process.env.PORT || 8070;
const URL = process.env.MONGODB_URL;

mongoose
  .connect(URL)
  .then(() => console.log("MongoDB Connection Success!"))
  .catch((err) => console.error("MongoDB Connection Failed:", err));

// Start the server
app.listen(PORT, () => {
  console.log(`Server is up and running on port no: ${PORT}`);
});
