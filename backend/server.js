const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();


const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Built-in middleware to parse JSON



app.use(express.json());
app.use(morgan("dev"));

// Import Routes
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./Routes/UserRoutes");
const deliveryRoutes = require("./Routes/DeliveryRoutes");
const cartRoutes = require("./routes/cartRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const userRoutes = require("./Routes/UserRoutes");
const authRoutes = require("./Routes/authRoutes");
const addAdminRoutes = require('./Routes/addAdminRoutes'); 

// Use Routes
app.use("/api", productRoutes);
app.use("/users", userRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/cart", cartRoutes);
app.use("/payment", paymentRoutes); // Payment endpoints
app.use("/users", userRoutes);
app.use("/auth", authRoutes);
app.use("/admin", addAdminRoutes);
app.use(bodyParser.json());

const PORT = process.env.PORT || 8070;
const URL = process.env.MONGODB_URL;

mongoose
  .connect(URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connection Success!"))
  .catch((err) => console.error("MongoDB Connection Failed:", err));


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
  console.log(`Server is up and running on port: ${PORT}`);
});

