// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    fetch("http://localhost:8070/api/dashboard", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    })
    .then((res) => res.json())
    .then((data) => {
      if (data.message && !data.userType) {
        // If there's a message but no userType, assume an error
        setMessage(data.message);
      } else {
        setDashboardData(data);
      }
    })
    .catch((err) => {
      console.error("Dashboard fetch error:", err);
      setMessage("Error fetching dashboard data");
    });
  }, [navigate]);

  if (message) {
    return <div>{message}</div>;
  }

  if (!dashboardData) {
    return <div>Loading dashboard...</div>;
  }

  // Check userType from the response
  switch (dashboardData.userType) {
    case "super-admin":
      return (
        <div>
          <h2>Super Admin Dashboard</h2>
          <p>Welcome, {dashboardData.firstName} {dashboardData.lastName}!</p>
          <p>Special data: {dashboardData.specialData}</p>
        </div>
      );

    case "admin":
      return (
        <div>
          <h2>Admin Dashboard</h2>
          <p>Welcome, {dashboardData.firstName} {dashboardData.lastName}!</p>
          <p>Admin type: {dashboardData.adminType}</p>
          <p>Data: {dashboardData.data}</p>
        </div>
      );

    case "seller":
      return (
        <div>
          <h2>Seller Dashboard</h2>
          <p>Welcome, {dashboardData.firstName} {dashboardData.lastName}!</p>
          <p>Data: {dashboardData.data}</p>
        </div>
      );

    case "buyer":
      return (
        <div>
          <h2>Buyer Dashboard</h2>
          <p>Welcome, {dashboardData.firstName} {dashboardData.lastName}!</p>
          <p>Data: {dashboardData.data}</p>
        </div>
      );

    default:
      return (
        <div>
          <h2>Unknown role</h2>
        </div>
      );
  }
}

export default Dashboard;