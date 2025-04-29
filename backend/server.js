const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config();

// Add detailed email configuration logging
console.log('Detailed Environment Variables:');
console.log('EMAIL_USER length:', process.env.EMAIL_USER ? process.env.EMAIL_USER.length : 0);
console.log('EMAIL_PASSWORD length:', process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 0);
console.log('First character of password:', process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD[0] : 'not set');
console.log('Last character of password:', process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD[process.env.EMAIL_PASSWORD.length - 1] : 'not set');

// Add email configuration logging
console.log('Email Configuration Status:', {
    EMAIL_USER: process.env.EMAIL_USER ? 'Set' : 'Not Set',
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD ? 'Set' : 'Not Set'
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Routes
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/UserRoutes");

const deliveryRoutes = require("./routes/deliveryRoutes");



const orderRoutes = require("./routes/orderRoutes");
const deliveFeedbackRoutes = require("./routes/deliveFeedbackRoutes");
const deliveMonitoringRoutes = require("./routes/deliveMonitoringRoutes");
const historyRoutes = require("./routes/deliveHistoryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const sellerRoutes = require("./routes/sellerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const authRoutes = require("./routes/authRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const fcmRoutes = require('./routes/fcmRoutes');
//const pdfTemplate = require('./documents');

// Route Usage
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/feedback", deliveFeedbackRoutes);
//app.use("/api/monitoring", monitoringRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/sellers", sellerRoutes);
app.use("/api/admins", adminRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/auth", authRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/monitoring", deliveMonitoringRoutes);
app.use("/api/admin", deliveMonitoringRoutes);

app.use('/api/fcm', fcmRoutes);



// MongoDB Connection
const PORT = process.env.PORT || 8070;
const URL = process.env.MONGODB_URL;

mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connection Success!"))
  .catch((err) => console.error("MongoDB Connection Failed:", err));

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is up and running on port: ${PORT}`);
});