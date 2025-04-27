import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";

const AdminOrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [statusOptions] = useState(["Ordered", "Packed", "Shipped", "Delivered"]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:8070/api/orders");
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:8070/api/orders/${orderId}`, { status: newStatus });
      fetchOrders(); // refresh orders
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

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
            No orders placed yet.
          </p>
        ) : (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              boxShadow: "0 0 10px rgba(0,0,0,0.1)",
              backgroundColor: "#fff",
            }}
          >
            <thead style={{ backgroundColor: "#3498db", color: "white" }}>
              <tr>
                <th style={{ padding: "10px" }}>Order ID</th>
                <th>Customer</th>
                <th>Amount (LKR)</th>
                <th>Payment</th>
                <th>Status</th>
                <th>Update Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id} style={{ textAlign: "center" }}>
                  <td style={{ padding: "10px" }}>{order._id}</td>
                  <td>{order.customerName}</td>
                  <td>{order.totalAmount.toFixed(2)}</td>
                  <td style={{ textTransform: "capitalize" }}>{order.paymentStatus}</td>
                  <td style={{ textTransform: "capitalize" }}>{order.status}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      style={{ padding: "5px", borderRadius: "5px" }}
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersDashboard;
