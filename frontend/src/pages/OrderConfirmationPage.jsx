import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const latestOrder = JSON.parse(localStorage.getItem("latestOrderDetails"));
    if (latestOrder) {
      setOrder(latestOrder);
    } else {
      navigate("/"); // Redirect if no order
    }
  }, [navigate]);

  return (
    <div style={{ padding: "30px", textAlign: "center" }}>
      {order ? (
        <>
          <h1 style={{ color: "#2c3e50", fontSize: "2.5rem" }}>
            🎉 Thank you for your order!
          </h1>
          <p style={{ marginTop: "10px", fontSize: "1.2rem", color: "#555" }}>
            Your order has been placed successfully. We'll notify you once it ships!
          </p>

          <div style={{
            marginTop: "40px",
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
            display: "inline-block",
            textAlign: "left",
            maxWidth: "600px",
            width: "100%"
          }}>
            <h2 style={{ fontSize: "1.8rem", marginBottom: "10px" }}>Order Summary</h2>

            <p><strong>Customer Name:</strong> {order.customerName}</p>
            <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>

            <h3 style={{ marginTop: "20px", fontSize: "1.5rem" }}>Items Ordered:</h3>
            <ul style={{ paddingLeft: "20px" }}>
              {order.items.map((item, index) => (
                <li key={index} style={{ marginBottom: "8px" }}>
                  {item.productName} ({item.size}) × {item.quantity} 
                  — Rs {(item.price * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>

            <h3 style={{ marginTop: "20px", fontSize: "1.5rem" }}>
              Total Paid: Rs {order.totalAmount.toFixed(2)}
            </h3>
          </div>

          <button
            onClick={() => navigate("/")}
            style={{
              marginTop: "30px",
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
        </>
      ) : (
        <p style={{ fontSize: "1.2rem" }}>Loading your order details...</p>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
