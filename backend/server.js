const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv = require("dotenv");
const app = express();
const productRoutes = require("../backend/routes/productRoutes");

dotenv.config(); // Load environment variables

const PORT = process.env.PORT || 8070;

app.use(cors());
app.use(bodyParser.json());

app.use("/api", productRoutes);

const URL = process.env.MONGODB_URL;

// Connect to MongoDB
mongoose
  .connect(URL)
  .then(() => console.log("MongoDB Connection Success!"))
  .catch((err) => console.error("MongoDB Connection Failed:", err));

app.listen(PORT, () => {
  console.log(`Server is up and running on port no: ${PORT}`);
});
