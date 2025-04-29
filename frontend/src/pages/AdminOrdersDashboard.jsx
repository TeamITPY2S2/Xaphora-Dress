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
      const userId = localStorage.getItem("userId");

      if (!token || !userType || !userId) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      // Check if user has correct permissions
      if (userType !== "admin" && userType !== "order-management" && userType !== "super-admin") {
        localStorage.clear();
        navigate("/api/auth/login");
        return;
      }

      try {
        // Fetch orders
        const res = await axios.get("http://localhost:8070/api/orders", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Full fetch error:", err.response ? err.response.data : err.message);
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/api/auth/login");
          return;
        }
        if (err.response?.status === 403) {
          setError("Access denied. You don't have permission to view orders.");
          return;
        }
        setError("Failed to fetch orders. Please try again later.");
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

  const renderShippingAddress = (address) => {
    if (!address) return 'N/A';
    if (typeof address === 'string') return address;
    return address.address || 'N/A';
  };

  const renderPhone = (address) => {
    if (!address || typeof address !== 'object') return 'N/A';
    return address.phone || 'N/A';
  };

  const renderCustomerName = (order) => {
    if (order.customerName) return order.customerName;
    if (order.shippingAddress?.fullName) return order.shippingAddress.fullName;
    return 'N/A';
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
                  <th>Customer Name</th>
                  <th>Address</th>
                  <th>Phone</th>
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
                    <td>{renderCustomerName(order)}</td>
                    <td>{renderShippingAddress(order.shippingAddress)}</td>
                    <td>{renderPhone(order.shippingAddress)}</td>
                    <td>Rs {order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</td>
                    <td>
                      <span className={`status-badge ${getPaymentStatusClass(order.paymentStatus || 'pending')}`}>
                        {order.paymentStatus || 'pending'}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusColorClass(order.status || 'pending')}`}>
                        {order.status || 'pending'}
                      </span>
                    </td>
                    <td>{order.createdAt ? formatDate(order.createdAt) : 'N/A'}</td>
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
