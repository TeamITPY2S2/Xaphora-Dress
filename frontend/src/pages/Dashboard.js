// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch("http://localhost:8070/api/dashboard", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (!response.ok) {
        setMessage(data.message || "Error fetching dashboard data");
      } else {
        setDashboardData(data);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setMessage("Error fetching dashboard data");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    navigate("/login");
  };

  const handleUpdateProfile = async () => {
    const newFirstName = prompt("Enter new first name:");
    const newLastName = prompt("Enter new last name:");
    if (!newFirstName || !newLastName) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("http://localhost:8070/api/dashboard/update", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ firstName: newFirstName, lastName: newLastName })
      });
      const data = await response.json();
      if (response.ok) {
        // Re-fetch dashboard data to ensure full updated info is shown
        await fetchDashboardData();
        alert("Profile updated successfully");
      } else {
        alert(data.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    }
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) return;
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("/api/dashboard/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        alert("Profile deleted successfully");
        localStorage.removeItem("token");
        localStorage.removeItem("userType");
        navigate("/signup");
      } else {
        alert(data.message || "Failed to delete profile");
      }
    } catch (error) {
      console.error("Error deleting profile:", error);
      alert("Error deleting profile");
    }
  };

  if (message) {
    return <div>{message}</div>;
  }

  if (!dashboardData) {
    return <div>Loading dashboard...</div>;
  }

  // Render dashboard based on userType
  switch (dashboardData.userType) {
    case "super-admin":
      return (
        <div style={{ padding: "20px" }}>
          <h2>Super Admin Dashboard</h2>
          <p>
            Welcome, {dashboardData.firstName} {dashboardData.lastName}!
          </p>
          <p>Special data: {dashboardData.specialData}</p>
          <button onClick={handleUpdateProfile}>Update Profile</button>{" "}
          <button onClick={handleDeleteProfile}>Delete Profile</button>{" "}
          <button onClick={handleLogout}>Logout</button>
        </div>
      );
    case "admin":
      return (
        <div style={{ padding: "20px" }}>
          <h2>Admin Dashboard</h2>
          <p>
            Welcome, {dashboardData.firstName} {dashboardData.lastName}!
          </p>
          <p>Admin type: {dashboardData.adminType}</p>
          <button onClick={handleUpdateProfile}>Update Profile</button>{" "}
          <button onClick={handleDeleteProfile}>Delete Profile</button>{" "}
          <button onClick={handleLogout}>Logout</button>
        </div>
      );
    case "seller":
      return (
        <div style={{ padding: "20px" }}>
          <h2>Seller Dashboard</h2>
          <p>
            Welcome, {dashboardData.firstName} {dashboardData.lastName}!
          </p>
          <button onClick={handleUpdateProfile}>Update Profile</button>{" "}
          <button onClick={handleDeleteProfile}>Delete Profile</button>{" "}
          <button onClick={handleLogout}>Logout</button>
        </div>
      );
    case "buyer":
      return (
        <div style={{ padding: "20px" }}>
          <h2>Buyer Dashboard</h2>
          <p>
            Welcome, {dashboardData.firstName} {dashboardData.lastName}!
          </p>
          <button onClick={handleUpdateProfile}>Update Profile</button>{" "}
          <button onClick={handleDeleteProfile}>Delete Profile</button>{" "}
          <button onClick={handleLogout}>Logout</button>
        </div>
      );
    default:
      return (
        <div style={{ padding: "20px" }}>
          <h2>Unknown Role</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      );
  }
}

export default Dashboard;