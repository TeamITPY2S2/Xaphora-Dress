// src/pages/AdminOrdersDashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar.jsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "./AdminOrdersDashboard.css";

const AdminOrdersDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingOrder, setEditingOrder] = useState(null);
  const [editFormData, setEditFormData] = useState({
    customerName: "",
    shippingAddress: {
      fullName: "",
      address: "",
      phone: ""
    },
    status: "",
    paymentStatus: ""
  });
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

  const handleEditClick = (order) => {
    setEditingOrder(order);
    setEditFormData({
      customerName: order.customerName,
      shippingAddress: {
        fullName: order.shippingAddress.fullName,
        address: order.shippingAddress.address,
        phone: order.shippingAddress.phone
      },
      status: order.status,
      paymentStatus: order.paymentStatus
    });
    setShowEditModal(true);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("shippingAddress.")) {
      const field = name.split(".")[1];
      setEditFormData(prev => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [field]: value
        }
      }));
    } else {
      setEditFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleUpdateOrder = async () => {
    try {
      const token = localStorage.getItem("token");
      
      await axios.put(
        `http://localhost:8070/api/orders/${editingOrder._id}`,
        editFormData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Update the order in the state
      setOrders(orders.map(order => 
        order._id === editingOrder._id 
          ? { ...order, ...editFormData }
          : order
      ));
      
      // Close the modal and reset form
      setShowEditModal(false);
      setEditingOrder(null);
      setEditFormData({
        customerName: "",
        shippingAddress: {
          fullName: "",
          address: "",
          phone: ""
        },
        status: "",
        paymentStatus: ""
      });
    } catch (err) {
      console.error("Update error:", err);
      setError("Failed to update order");
    }
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setEditingOrder(null);
    setEditFormData({
      customerName: "",
      shippingAddress: {
        fullName: "",
        address: "",
        phone: ""
      },
      status: "",
      paymentStatus: ""
    });
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) {
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8070/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Remove the deleted order from the state
      setOrders(orders.filter(order => order._id !== orderId));
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete order");
    }
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
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{renderCustomerName(order)}</td>
                    <td>{renderShippingAddress(order.shippingAddress)}</td>
                    <td>{renderPhone(order.shippingAddress)}</td>
                    <td>Rs {order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</td>
                    <td>
                      <span className={`status-badge ${order.paymentStatus === 'completed' ? 'payment-completed' : 'payment-pending'}`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td>{order.status}</td>
                    <td>{order.createdAt ? formatDate(order.createdAt) : 'N/A'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEditClick(order)}
                          className="edit-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order._id)}
                          className="delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Edit Order Details</h2>
              <div className="modal-form">
                <div className="form-group">
                  <label>Customer Name</label>
                  <input
                    type="text"
                    name="customerName"
                    value={editFormData.customerName}
                    onChange={handleEditFormChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="shippingAddress.fullName"
                    value={editFormData.shippingAddress.fullName}
                    onChange={handleEditFormChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="shippingAddress.address"
                    value={editFormData.shippingAddress.address}
                    onChange={handleEditFormChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="text"
                    name="shippingAddress.phone"
                    value={editFormData.shippingAddress.phone}
                    onChange={handleEditFormChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Payment Status</label>
                  <select
                    name="paymentStatus"
                    value={editFormData.paymentStatus}
                    onChange={handleEditFormChange}
                    className="form-select"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Order Status</label>
                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={handleEditFormChange}
                    className="form-select"
                  >
                    <option value="ordered">Ordered</option>
                    <option value="packed">Packed</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div className="modal-buttons">
                  <button onClick={handleUpdateOrder} className="save-btn">
                    Save Changes
                  </button>
                  <button onClick={handleCloseModal} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrdersDashboard;
