// src/pages/AdminOrdersDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import './AdminOrdersDashboard.css';

const AdminOrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const userType = localStorage.getItem("userType");

      if (!token || userType !== "order-management") {
        localStorage.clear();
        navigate("/api/auth/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:8070/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setOrders(res.data);
      }catch (err) {
        console.error("Full fetch error:", err.response ? err.response.data : err.message);
        setError("Failed to fetch orders.");
      
      
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case "pending": return "status-pending";
      case "processing": return "status-processing";
      case "shipped": return "status-shipped";
      case "delivered": return "status-delivered";
      case "cancelled": return "status-cancelled";
      default: return "";
    }
  };

  const getPaymentStatusClass = (paymentStatus) => {
    return paymentStatus === "completed" ? "payment-completed" : "payment-pending";
  };

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-orders-container">
      <AdminSidebar />
      <div className="admin-orders-content">
        <h1 className="admin-orders-heading">📦 All Orders Overview</h1>

        {orders.length === 0 ? (
          <p style={{ textAlign: "center" }}>No orders found.</p>
        ) : (
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Address</th>
                  <th>Total (LKR)</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Ordered On</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.customerName}</td>
                    <td>{order.shippingAddress}</td>
                    <td>Rs {order.totalAmount.toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${getPaymentStatusClass(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusColorClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{formatDate(order.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersDashboard;
