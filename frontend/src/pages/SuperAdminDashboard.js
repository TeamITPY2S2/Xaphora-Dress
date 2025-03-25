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
    // Optionally fetch user details or super admin name here
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    navigate("/api/auth/login");
  };

  const handleViewAdmins = () => {
    navigate("/superadmin/admins");
  };

  const handleGetSellers = () => {
    navigate("/superadmin/sellers"); 
    // Or alert("Fetch sellers logic here");
  };

  const handleGetBuyers = () => {
    navigate("/superadmin/buyers");
    // Or alert("Fetch buyers logic here");
  };

  const handleUpdateProfile = () => {
    alert("Update profile logic here");
  };

  const handleDeleteProfile = () => {
    alert("Delete profile logic here");
  };

  return (
    <div className="superadmin-container">
      {/* Top bar for logout */}
      <div className="top-bar">
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {/* Center name/title */}
      <h2 className="superadmin-title">SUPER ADMIN</h2>
      {message && <p className="superadmin-message">{message}</p>}

      {/* Center buttons (Admins, Sellers, Buyers) */}
      <div className="center-buttons">
        <button onClick={handleViewAdmins}>Admins</button>
        <button onClick={handleGetSellers}>Sellers</button>
        <button onClick={handleGetBuyers}>Buyers</button>
      </div>

      {/* Bottom-right corner for Update/Delete */}
      <div className="bottom-right-buttons">
        <button onClick={handleUpdateProfile}>Update Profile</button>
        <button onClick={handleDeleteProfile}>Delete Profile</button>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;