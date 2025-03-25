// src/pages/SuperAdminDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SuperAdminDashboard.css";

function SuperAdminDashboard() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    // If you want to fetch some special data, do so here
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    navigate("/login");
  };

  const handleViewAdmins = () => {
    navigate("/superadmin/admins");
  };

  const handleGetSellers = () => {
    alert("Fetch sellers logic here");
  };

  const handleGetBuyers = () => {
    alert("Fetch buyers logic here");
  };

  const handleUpdateProfile = () => {
    alert("Update profile logic here");
  };

  const handleDeleteProfile = () => {
    alert("Delete profile logic here");
  };

  return (
    <div className="superadmin-container">
      <h2>Super Admin Dashboard</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <div className="top-buttons">
        <button onClick={handleViewAdmins}>Admins</button>
        <button onClick={handleGetSellers}>Sellers</button>
        <button onClick={handleGetBuyers}>Buyers</button>
      </div>
      <div className="bottom-right-buttons">
        <button onClick={handleUpdateProfile}>Update Profile</button>
        <button onClick={handleDeleteProfile}>Delete Profile</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;