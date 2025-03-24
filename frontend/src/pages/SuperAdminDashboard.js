// src/pages/SuperAdminDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SuperAdminDashboard.css";

function SuperAdminDashboard() {
  const [specialData, setSpecialData] = useState("");  // e.g., from your backend
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchSpecialData(token);
  }, [navigate]);

  const fetchSpecialData = async (token) => {
    try {
      const res = await fetch("http://localhost:8070/api/superadmin/data", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setSpecialData(data.specialData || "No special data");
      } else {
        setMessage(data.message || "Error fetching special data");
      }
    } catch (err) {
      console.error("Error fetching special data:", err);
      setMessage("Error fetching special data");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    navigate("/login");
  };

  // Navigate to a new page that lists all admins
  const handleViewAdmins = () => {
    navigate("/superadmin/admins");
  };

  const handleGetSellers = () => {
    alert("Fetch sellers logic here (or navigate to a Sellers page).");
  };

  const handleGetBuyers = () => {
    alert("Fetch buyers logic here (or navigate to a Buyers page).");
  };

  const handleUpdateProfile = () => {
    alert("Update profile logic here");
  };

  const handleDeleteProfile = () => {
    alert("Delete profile logic here");
  };

  return (
    <div className="superadmin-container">
      <h2 className="superadmin-title">Super Admin Dashboard</h2>
      <p>Welcome, Super admin!</p>
      {message && <p className="superadmin-message">{message}</p>}
      <p>Special data: {specialData}</p>

      <div className="top-buttons">
        <button onClick={handleViewAdmins}>Admins</button>
        <button onClick={handleGetSellers}>Sellers</button>
        <button onClick={handleGetBuyers}>Buyers</button>
      </div>

      <div className="bottom-right-buttons">
        <button onClick={handleUpdateProfile} className="update-profile-button">
          Update Profile
        </button>
        <button onClick={handleDeleteProfile} className="delete-profile-button">
          Delete Profile
        </button>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </div>
  );
}

export default SuperAdminDashboard;