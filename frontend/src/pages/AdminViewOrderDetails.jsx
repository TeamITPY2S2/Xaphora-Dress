import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";

const AdminViewOrderDetails = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`http://localhost:8070/api/orders/${orderId}`);
      setOrder(res.data);
    } catch (error) {
      console.error("Error fetching order:", error);
    }
  };

  if (!order) {
    return (
      <div style={{ display: "flex" }}>
        <AdminSidebar />
        <div style={{ marginLeft: "250px", padding: "30px" }}>
          <h2>Loading order details...</h2>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex" }}>
      <AdminSidebar />

      <div style={{ marginLeft: "250px", padding: "30px", width: "100%" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            marginBottom: "20px",
            padding: "8px 20px",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          ← Back
        </button>

        <h2>Order Details</h2>

        <div style={{ marginBottom: "20px" }}>
          <p><strong>Order ID:</strong> {order._id}</p>
          <p><strong>Customer Name:</strong> {order.customerName}</p>
          <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
          <p><strong>Total Amount:</strong> Rs {order.totalAmount.toFixed(2)}</p>
          <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
          <p><strong>Status:</strong> {order.status}</p>
          <p><strong>Placed Date:</strong> {new Date(order.placedDate).toLocaleString()}</p>
        </div>

        <h3>Items Ordered:</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 0 10px rgba(0,0,0,0.1)" }}>
          <thead style={{ backgroundColor: "#2ecc71", color: "white" }}>
            <tr>
              <th style={{ padding: "10px" }}>Product ID</th>
              <th>Size</th>
              <th>Quantity</th>
              <th>Price (LKR)</th>
              <th>Subtotal (LKR)</th>
            </tr>
          </thead>

          <tbody>
            {order.items.map((item, index) => (
              <tr key={index} style={{ textAlign: "center" }}>
                <td style={{ padding: "10px" }}>{item.productId}</td>
                <td>{item.size}</td>
                <td>{item.quantity}</td>
                <td>{item.price.toFixed(2)}</td>
                <td>{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

      </div>
    </div>
  );
};

export default AdminViewOrderDetails;
