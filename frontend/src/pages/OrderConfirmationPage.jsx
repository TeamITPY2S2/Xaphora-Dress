// src/pages/OrderConfirmationPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  const clearCart = async (userId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/api/cart/${userId}/clear`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Also clear local storage as backup
      localStorage.removeItem(`cart_${userId}`);
      console.log("Cart cleared successfully for user:", userId);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  useEffect(() => {
    try {
      const latestOrder = JSON.parse(localStorage.getItem("latestOrderDetails"));
      console.log("Retrieved order from localStorage:", latestOrder); // Debug log
      
      if (latestOrder && latestOrder.customerName && latestOrder.items) {
        setOrder(latestOrder);
        
        // Clear the user's cart after successful order
        const userId = localStorage.getItem("userId");
        if (userId) {
          clearCart(userId);
        }
      } else {
        console.error("Invalid order data:", latestOrder); // Debug log
        setError("Invalid order data");
        navigate("/");
      }
    } catch (err) {
      console.error("Error parsing order data:", err); // Debug log
      setError("Error loading order details");
      navigate("/");
    }
  }, [navigate]);

  if (error) {
    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        <h1 style={{ color: "red" }}>Error</h1>
        <p>{error}</p>
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#3498db",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

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
            <p><strong>Shipping Address:</strong> {typeof order.shippingAddress === 'object' 
              ? `${order.shippingAddress.fullName}, ${order.shippingAddress.address}, Phone: ${order.shippingAddress.phone}`
              : order.shippingAddress}</p>

            <h3 style={{ marginTop: "20px", fontSize: "1.5rem" }}>Items Ordered:</h3>
            {order.items && order.items.length > 0 ? (
              <ul style={{ paddingLeft: "20px" }}>
                {order.items.map((item, index) => (
                  <li key={index} style={{ marginBottom: "8px" }}>
                    {item.productName} {item.size ? `(${item.size})` : ''} × {item.quantity} 
                    — Rs {(item.price * item.quantity).toFixed(2)}
                  </li>
                ))}
              </ul>
            ) : (
              <p>No items found in this order.</p>
            )}

            <h3 style={{ marginTop: "20px", fontSize: "1.5rem" }}>
              Total Paid: Rs {order.totalAmount?.toFixed(2) || '0.00'}
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
