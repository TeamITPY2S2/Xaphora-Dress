// backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Import Routes
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/UserRoutes");
const deliveryRoutes = require("./Routes/DeliveryRoutes");
const orderRoutes = require("./routes/orderRoutes");
const deliveFeedbackRoutes = require("./routes/deliveFeedbackRoutes");
const monitoringRoutes = require("./routes/deliveMonitoringRoutes");
const historyRoutes = require("./routes/deliveHistoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Use Routes
app.use("/api", productRoutes);
app.use("/users", userRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/feedback", deliveFeedbackRoutes);
app.use("/api/admins", adminRoutes); // Admin routes at /api/admins
app.use("/api/history", historyRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/payment", paymentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);

const PORT = process.env.PORT || 8070;
const URL = process.env.MONGODB_URL;

mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connection Success!"))
  .catch((err) => console.error("MongoDB Connection Failed:", err));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server is up and running on port: ${PORT}`);
});