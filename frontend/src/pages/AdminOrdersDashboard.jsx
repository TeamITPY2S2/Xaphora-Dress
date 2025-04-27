import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";

const AdminOrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [statusOptions] = useState(["pending", "processing", "shipped", "delivered", "cancelled"]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userType = localStorage.getItem("userType");
    
    if (!token || userType !== "order-management") {
      navigate("/api/auth/login");
      return;
    }
    
    fetchOrders();
  }, [navigate]);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8070/api/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      setOrders(res.data);
      setLoading(false);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/api/auth/login");
      } else {
        setError("Error fetching orders: " + error.message);
      }
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8070/api/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      fetchOrders(); // refresh orders
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.clear();
        navigate("/api/auth/login");
      } else {
        setError("Error updating status: " + error.message);
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div style={{ display: "flex" }}>
      {/* Sidebar */}
      <AdminSidebar />

      {/* Content */}
      <div style={{ marginLeft: "250px", padding: "30px", width: "100%" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#34495e" }}>
          📦 Admin - Manage All Orders
        </h1>

        {orders.length === 0 ? (
          <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
            No orders found.
          </p>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8f9fa" }}>
                  <th style={{ padding: "12px", textAlign: "left" }}>Order ID</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Customer</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Total Amount</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Status</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Payment Status</th>
                  <th style={{ padding: "12px", textAlign: "left" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id} style={{ borderBottom: "1px solid #dee2e6" }}>
                    <td style={{ padding: "12px" }}>{order._id}</td>
                    <td style={{ padding: "12px" }}>{order.customerName}</td>
                    <td style={{ padding: "12px" }}>{formatDate(order.createdAt)}</td>
                    <td style={{ padding: "12px" }}>Rs. {order.totalAmount.toFixed(2)}</td>
                    <td style={{ padding: "12px" }}>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor: 
                          order.status === "pending" ? "#ffeeba" :
                          order.status === "processing" ? "#cce5ff" :
                          order.status === "shipped" ? "#d4edda" :
                          order.status === "delivered" ? "#d1e7dd" :
                          "#f8d7da",
                        color: 
                          order.status === "pending" ? "#856404" :
                          order.status === "processing" ? "#004085" :
                          order.status === "shipped" ? "#155724" :
                          order.status === "delivered" ? "#155724" :
                          "#721c24"
                      }}>
                        {order.status}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <span style={{
                        padding: "4px 8px",
                        borderRadius: "4px",
                        backgroundColor: order.paymentStatus === "completed" ? "#d4edda" : "#f8d7da",
                        color: order.paymentStatus === "completed" ? "#155724" : "#721c24"
                      }}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td style={{ padding: "12px" }}>
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        style={{
                          padding: "6px",
                          borderRadius: "4px",
                          border: "1px solid #ced4da"
                        }}
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </td>
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
