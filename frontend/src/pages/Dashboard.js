// src/pages/Dashboard.js
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Dashboard.css";
import { FaBars } from "react-icons/fa";

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
    try {
      const res = await fetch("http://localhost:8070/api/dashboard/profile/delete", {
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

    if (userType === "order-management") {
      navigate("/admin-orders");
    } else if(userType === "delivery-management"){
      navigate("/admin-dashboard");
    }
    else if (userType === "buyer") {
      content = (
        <div className="buyer-account-page">
          <header className="buyer-header">
            <h1>My Account</h1>
          </header>

          <div className="buyer-content">
            {/* Account Overview Section */}
            <section className="buyer-section account-overview">
              <h3>Account Overview</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Name</span>
                  <span className="info-value">{dashboardData.firstName} {dashboardData.lastName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email</span>
                  <span className="info-value">{dashboardData.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Member Since</span>
                  <span className="info-value">{new Date(dashboardData.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </section>

            {/* Quick Actions Section */}
            <section className="buyer-section quick-actions">
              <h3>Quick Actions</h3>
              <div className="action-buttons">
                <button onClick={() => navigate('/my-orders')} className="action-btn">
                  <i className="bi bi-bag"></i>
                  View Orders
                </button>
                <button onClick={() => navigate('/address')} className="action-btn">
                  <i className="bi bi-geo-alt"></i>
                  Manage Addresses
                </button>
                <button onClick={() => navigate('/change-password')} className="action-btn">
                  <i className="bi bi-key"></i>
                  Change Password
                </button>
              </div>
            </section>

            {/* Recent Orders Section */}
            <section className="buyer-section recent-orders">
              <h3>Recent Orders</h3>
              {dashboardData.recentOrders && dashboardData.recentOrders.length > 0 ? (
                <div className="orders-list">
                  {dashboardData.recentOrders.slice(0, 3).map(order => (
                    <div key={order._id} className="order-item">
                      <div className="order-info">
                        <span className="order-id">Order #{order._id.slice(-6)}</span>
                        <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                        <span className="order-status">{order.status}</span>
                      </div>
                      <button onClick={() => navigate(`/order/${order._id}`)} className="view-order-btn">
                        View Details
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-orders">
                  <p>No recent orders found</p>
                  <button onClick={() => navigate('/home')} className="shop-now-btn">
                    Start Shopping
                  </button>
                </div>
              )}
            </section>

            {/*  Addresses Section */}
            <section className="buyer-section saved-addresses">
              <h3>Addresses</h3>
              {dashboardData.addresses && dashboardData.addresses.length > 0 ? (
                <div className="addresses-preview">
                  {dashboardData.addresses.slice(0, 2).map(address => (
                    <div key={address._id} className="address-preview">
                      <div className="address-info">
                        <strong>{address.contactName}</strong>
                        <p>{address.addressLine1}</p>
                        <p>{address.city}, {address.state} {address.zipCode}</p>
                      </div>
                      {address.isDefault && <span className="default-badge">Default</span>}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-addresses">
                  <button onClick={() => navigate('/address')} className="add-address-btn">
                    View and Add Address
                  </button>
                </div>
              )}
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
