import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OrdersPage = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const userId = localStorage.getItem("userId"); // Get the logged-in user's ID

  useEffect(() => {
    if (userId) {
      axios.get(`http://localhost:8070/api/orders/user/${userId}`)
        .then((res) => setOrders(res.data))
        .catch((err) => console.error("Error fetching orders:", err));
    }
  }, [userId]);

  return (
    <div style={{ padding: "30px" }}>
      <h1 style={{ textAlign: "center", fontSize: "2.5rem", color: "#2c3e50", marginBottom: "30px" }}>
        🛒 My Orders
      </h1>

      {orders.length === 0 ? (
        <p style={{ textAlign: "center", fontSize: "1.2rem" }}>
          No orders found.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {orders.map((order) => (
            <div
              key={order._id}
              style={{
                padding: "20px",
                border: "1px solid #ccc",
                borderRadius: "10px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
                Order ID: <span style={{ fontSize: "1rem" }}>{order._id}</span>
              </h2>

              <p><strong>Customer:</strong> {order.customerName}</p>
              <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>

              <h3 style={{ marginTop: "15px", fontSize: "1.2rem" }}>Items:</h3>
              <ul style={{ paddingLeft: "20px" }}>
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.productName} ({item.size || "N/A"}) × {item.quantity} — Rs {(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>

              <p style={{ marginTop: "10px" }}>
                <strong>Total:</strong> Rs {order.totalAmount.toFixed(2)}
              </p>

              <p>
                <strong>Status:</strong> {order.status}
              </p>

              <p>
                <strong>Payment:</strong> {order.paymentStatus}
              </p>
            </div>
          ))}
        </div>
      )}

      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "1rem",
            cursor: "pointer"
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrdersPage;
