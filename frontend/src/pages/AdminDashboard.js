import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const [adminData, setAdminData] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if there's a token in localStorage
    const token = localStorage.getItem("token");
    if (!token) {
      // If no token, redirect to login
      navigate("/login");
      return;
    }

    // Fetch some protected admin data
    // Adjust the endpoint (/api/admin/dashboard-data) as needed
    fetch("/api/admin/dashboard-data", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          // If the server sends an error property, display it
          setMessage(data.error);
        } else {
          // Otherwise, store the admin data
          setAdminData(data);
        }
      })
      .catch((err) => {
        console.error("Error fetching admin data:", err);
        setMessage("Error fetching admin data");
      });
  }, [navigate]);

  // If there's a server error or no data
  if (message) {
    return <div>{message}</div>;
  }

  // While adminData is loading
  if (!adminData) {
    return <div>Loading admin dashboard...</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Admin Dashboard</h2>
      <p>Welcome, {adminData.firstName} {adminData.lastName}!</p>
      <p>Role: {adminData.adminType}</p>

      {/* Example stats section */}
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