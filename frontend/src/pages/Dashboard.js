// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Dashboard.css";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/api/auth/login");
        return;
      }
      try {
        const res = await fetch("http://localhost:8070/api/dashboard", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (!res.ok) {
          setMessage(data.message || "Error fetching dashboard data");
        } else {
          setDashboardData(data);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setMessage("Error fetching dashboard data");
      }
    };

    fetchDashboardData();
  }, [navigate]);

  useEffect(() => {
    if (dashboardData) {
      const { userType } = dashboardData;

      if (userType === "super-admin") {
        navigate("/superadmin");
      } else if (userType === "order-management") {
        navigate("/admin-orders");
      } else if (userType === "seller") {
        navigate("/seller-dashboard");
      }
    }
  }, [dashboardData, navigate]); // 👈 new separate useEffect for redirection

  const handleLogout = () => {
    localStorage.clear();
    navigate("/home");
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?")) return;
    const token = localStorage.getItem("token");
    const userId = dashboardData?._id;
    if (!userId) {
      alert("Cannot delete: user ID not found.");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8070/api/users/${userId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert("Your account has been deleted successfully.");
        handleLogout();
      } else {
        alert(data.message || "Failed to delete your account.");
      }
    } catch (err) {
      console.error("Error deleting profile:", err);
      alert("Error deleting your profile.");
    }
  };

  let content;
  if (message) {
    content = <div className="dashboard-message">{message}</div>;
  } else if (!dashboardData) {
    content = <div className="dashboard-loading">Loading dashboard...</div>;
  } else {
    const { userType } = dashboardData;

    if (userType === "admin") {
      content = (
        <div className="generic-dashboard">
          <h2>Admin Dashboard</h2>
          <p>Welcome, {dashboardData.firstName} {dashboardData.lastName}!</p>
          <button onClick={handleLogout}>Logout</button>
        </div>
      );
    } else if (userType === "buyer") {
      content = (
        <div className="buyer-account-page">
          <header className="buyer-header">
            <h1>My Account</h1>
          </header>
          <div className="buyer-content buyer-content-stacked">
            <section className="buyer-section buyer-history">
              <h3>Order History</h3>
              <p>You haven't placed any orders yet.</p>
              <button onClick={() => navigate('/my-orders')}>View My Orders</button>
            </section>
            <section className="buyer-section buyer-details">
              <h3>Account Details</h3>
              <div className="info">
                {dashboardData.firstName} {dashboardData.lastName}
              </div>
              <div className="info">
                {dashboardData.address?.country || "Sri Lanka"}
              </div>
              <Link to="/address" className="info-link">
                View Address
              </Link>
            </section>
          </div>
        </div>
      );
    } else {
      content = (
        <div className="generic-dashboard">
          <h2>Unknown Role</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      );
    }
  }

  return (
    <>
      <Navbar />
      {content}
      <Footer />
    </>
  );
}

export default Dashboard;
