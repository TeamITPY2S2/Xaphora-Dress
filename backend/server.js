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

// Import Routes
const userRoutes = require('./Routes/UserRoutes'); 

// Use Routes
app.use(express.json());
app.use("/users", userRoutes);


const PORT = process.env.PORT || 8070;
const URL = process.env.MONGODB_URL;



// const express = require("express");
// const mongoose = require("mongoose");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const dotenv = require("dotenv");
// const app = express();
// const router = require("./Routes/UserRouter"); 

// dotenv.config(); // Load environment variables

// //Middleware
// app.use("/users",router)

// const PORT = process.env.PORT || 8070;

// app.use(cors());
// app.use(bodyParser.json());

// const URL = process.env.MONGODB_URL;

// Connect to MongoDB
mongoose
  .connect(URL)
  .then(() => console.log("MongoDB Connection Success!"))
  .catch((err) => console.error("MongoDB Connection Failed:", err));

app.listen(PORT, () => {
  console.log(`Server is up and running on port no: ${PORT}`);
});
