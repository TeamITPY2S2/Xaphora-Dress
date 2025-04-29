// src/pages/AdminOrdersDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./AdminOrdersDashboard.css";

const AdminOrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
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

      if (
        userType !== "admin" &&
        userType !== "order-management" &&
        userType !== "super-admin"
      ) {
        localStorage.clear();
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:8070/api/orders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (err) {
        console.error("Fetch error:", err.response || err.message);
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.clear();
          navigate("/login");
        } else {
          setError("Failed to fetch orders. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const renderCustomerName = (order) =>
    order.customerName || order.shippingAddress?.fullName || "N/A";

  const renderShippingAddress = (address) =>
    typeof address === "string"
      ? address
      : address?.addressLine1 || address?.address || "N/A";

  const renderPhone = (address) =>
    address?.phoneNumber || address?.phone || "N/A";

  // Filtering orders based on search and status
  const filteredOrders = orders.filter((order) => {
    const text = searchTerm.trim().toLowerCase();
    const inText =
      order._id.toLowerCase().includes(text) ||
      renderCustomerName(order).toLowerCase().includes(text) ||
      renderShippingAddress(order.shippingAddress)
        .toLowerCase()
        .includes(text);

    const status = (order.status || "").toLowerCase();
    const inStatus = filterStatus === "all" || status === filterStatus;

    return inText && inStatus;
  });

  // PDF generation
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Xaphora Dress - Orders Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);

    const tableData = filteredOrders.map((order) => [
      order._id,
      renderCustomerName(order),
      renderShippingAddress(order.shippingAddress),
      renderPhone(order.shippingAddress),
      order.totalAmount ? order.totalAmount.toFixed(2) : "0.00",
      order.paymentStatus || "N/A",
      order.status || "N/A",
      formatDate(order.createdAt),
    ]);

    autoTable(doc, {
      startY: 30,
      head: [[
        "Order ID",
        "Customer",
        "Address",
        "Phone",
        "Total (LKR)",
        "Payment",
        "Status",
        "Ordered On",
      ]],
      body: tableData,
      theme: "grid",
      headStyles: { fillColor: [52, 152, 219] },
      styles: { fontSize: 8 },
      margin: { left: 10, right: 10 },
    });

    doc.save(
      `Xaphora_Orders_${filterStatus}_${new Date()
        .toISOString()
        .split("T")[0]}.pdf`
    );
  };

  if (loading) return <div className="loading">Loading orders...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="admin-orders-container">
      <AdminSidebar />
      <div className="admin-orders-content">
        <h1 className="admin-orders-heading">
          📦 Order Management Dashboard
        </h1>

        {/* Controls */}
        <div className="dashboard-controls">
          <input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Orders</option>
            <option value="ordered">Ordered</option>
            <option value="packed">Packed</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>

          <button onClick={downloadPDF} className="download-btn">
            Download PDF
          </button>
        </div>

        {/* Table */}
        {filteredOrders.length === 0 ? (
          <p style={{ textAlign: "center" }}>No orders found.</p>
        ) : (
          <div className="orders-table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Address</th>
                  <th>Phone</th>
                  <th>Total (LKR)</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Ordered On</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{renderCustomerName(order)}</td>
                    <td>{renderShippingAddress(order.shippingAddress)}</td>
                    <td>{renderPhone(order.shippingAddress)}</td>
                    <td>
                      Rs {order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}
                    </td>
                    <td>
                      <span className={`status-badge ${order.paymentStatus === 'completed' ? 'payment-completed' : 'payment-pending'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${order.status}`}>
                        {order.status}
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
