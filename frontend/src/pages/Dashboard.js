// src/pages/Dashboard.js
import { FaBars } from 'react-icons/fa';
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Footer from "../components/Footer";
import AccountDrawer from "../components/AccountDrawer";
import Navbar from "../components/Navbar"; 
import "./Dashboard.css";

function Dashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [message, setMessage] = useState("");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userType");
    navigate("/home");
  };

  const handleDeleteProfile = async () => {
    if (!window.confirm("Are you sure you want to delete your profile?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch("http://localhost:8070/api/dashboard/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        alert("Profile deleted successfully");
        handleLogout();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to delete profile");
      }
    } catch {
      alert("Error deleting profile");
    }
  };

  let content;
  if (message) {
    content = <div className="dashboard-message">{message}</div>;
  } else if (!dashboardData) {
    content = <div className="dashboard-loading">Loading dashboard...</div>;
  } else {
    switch (dashboardData.userType) {
      case "super-admin":
        navigate("/superadmin");
        return null;
      case "admin":
        content = (
          <div className="generic-dashboard">
            <h2>Admin Dashboard</h2>
            <p>Welcome, {dashboardData.firstName} {dashboardData.lastName}!</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        );
        break;
      case "seller":
        content = (
          <div className="generic-dashboard">
            <h2>Seller Dashboard</h2>
            <p>Welcome, {dashboardData.firstName} {dashboardData.lastName}!</p>
            <button onClick={handleLogout}>Logout</button>
          </div>
        );
        break;
      case "buyer":
        content = (
          <div className="buyer-account-page">
            <header className="buyer-header">
              <h1>My Account</h1>
                <button className="btn-menu" onClick={() => setDrawerOpen(true)}>
                <FaBars style={{ fontSize: "1.2rem" }} /> Menu
              </button>
            </header>

            <div className="buyer-content buyer-content-stacked">
              <section className="buyer-section buyer-history">
                <h3>Order History</h3>
                <p>You haven't placed any orders yet.</p>
              </section>

              <section className="buyer-section buyer-details">
                <h3>Account Details</h3>
                <div className="info">
                  {dashboardData.firstName} {dashboardData.lastName}
                </div>
                <div className="info">
                  {dashboardData.address?.country || "Sri Lanka"}
                </div>
                <Link to="/address" className="info-link">View Address</Link>
              </section>
            </div>
          </div>
        );
        break;
      default:
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
      <AccountDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        userName={`${dashboardData?.firstName || ""} ${dashboardData?.lastName || ""}`}
        onLogout={handleLogout}
        onAccountDetails={() => setDrawerOpen(false)}
        onAddresses={() => navigate("/address")}
        onResetPassword={() => navigate("/reset-password")}
        onUpdateProfile={() => navigate("/update-profile")}
        onDeleteProfile={handleDeleteProfile}
      />
      <Footer />
    </>
  );
}

export default Dashboard;