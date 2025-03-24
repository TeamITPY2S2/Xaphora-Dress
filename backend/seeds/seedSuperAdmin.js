// seedSuperAdmin.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/adminModel");

async function seedSuperAdmin() {
  await mongoose.connect("mongodb://127.0.0.1:27017/mydb");
  
  const existing = await Admin.findOne({ email: "superadmin@example.com" });
  if (existing) {
    console.log("Super admin already exists!");
    return;
  }

  const hashedPassword = await bcrypt.hash("password123", 10);
  const newAdmin = new Admin({
    firstName: "Super",
    lastName: "Admin",
    email: "superadmin@example.com",
    password: hashedPassword,
    adminType: "super-admin",
  });
  await newAdmin.save();
  console.log("Super admin created successfully!");
}

seedSuperAdmin().then(() => mongoose.disconnect());