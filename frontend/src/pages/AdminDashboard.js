// src/pages/AdminDashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [adminData, setAdminData] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        // Redirect to login if no token exists
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("/api/admin/dashboard-data", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          // Extract error message from the response
          const errorData = await response.json();
          setMessage(errorData.message || "Failed to fetch admin data");
          return;
        }

        const data = await response.json();
        setAdminData(data);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setMessage("Error fetching admin data");
      }
    };

    fetchAdminData();
  }, [navigate]);

  if (message) {
    return <div>{message}</div>;
  }

  if (!adminData) {
    return <div>Loading admin dashboard...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>
      <p>
        Welcome, {adminData.firstName} {adminData.lastName}!
      </p>
      <p>Role: {adminData.adminType}</p>
      <div style={{ marginTop: "20px" }}>
        <h3>Stats</h3>
        <ul>
          <li>Total Users: {adminData.totalUsers}</li>
          <li>Total Orders: {adminData.totalOrders}</li>
          <li>Total Products: {adminData.totalProducts}</li>
        </ul>
      </div>
    </div>
  );
}

export default AdminDashboard;