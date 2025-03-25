// src/pages/AddAdmin.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddAdmin.css";

function AddAdmin() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  // Default adminType is "user-management" (must match your schema exactly)
  const [adminType, setAdminType] = useState("user-management");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // If your route is protected, you might need a super-admin token
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8070/api/admins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include the token if your backend requires authentication
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          password,
          adminType
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Admin created successfully");
        navigate("/superadmin/admins"); // Return to admins list page
      } else {
        setMessage(data.message || "Failed to create admin");
      }
    } catch (error) {
      console.error("Error creating admin:", error);
      setMessage("Error creating admin");
    }
  };

  const handleBack = () => {
    navigate("/superadmin/admins");
  };

  return (
    <div className="add-admin-container">
      <button onClick={handleBack} className="back-button">Back</button>
      <h2>Add New Admin</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}

      <form onSubmit={handleSubmit} className="add-admin-form">
        <label>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>First Name</label>
        <input
          type="text"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <label>Last Name</label>
        <input
          type="text"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <label>Admin Type</label>
        <select value={adminType} onChange={(e) => setAdminType(e.target.value)}>
          {/* Make sure these values match your backend's enum EXACTLY */}
          <option value="super-admin">Super Admin</option>
          <option value="delivery">Delivery</option>
          <option value="inventory">Inventory</option>
          <option value="order-management">Order Management</option>
          <option value="reviews">Reviews</option>
          <option value="user-management">User Management</option>
        </select>

        <button type="submit" className="create-admin-button">Create Admin</button>
      </form>
    </div>
  );
}

export default AddAdmin;