// src/pages/OrderConfirmationPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const OrderConfirmationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  const clearCart = async (userId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/api/cart/${userId}/clear`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      localStorage.removeItem(`cart_${userId}`);
      console.log("Cart cleared successfully for user:", userId);
    } catch (err) {
      console.error("Error clearing cart:", err);
    }
  };

  useEffect(() => {
    // First try to get order from navigation state
    if (location.state?.orderDetails) {
      const orderData = location.state.orderDetails;
      // Transform shipping address data if needed
      if (orderData.shippingAddress) {
        orderData.shippingAddress = {
          fullName: orderData.shippingAddress.fullName || orderData.shippingAddress.contactName,
          address: orderData.shippingAddress.address || 
            `${orderData.shippingAddress.addressLine1}${orderData.shippingAddress.addressLine2 ? `, ${orderData.shippingAddress.addressLine2}` : ''}, ${orderData.shippingAddress.city}, ${orderData.shippingAddress.state} ${orderData.shippingAddress.zipCode}`,
          phone: orderData.shippingAddress.phone || orderData.shippingAddress.phoneNumber
        };
      }
      setOrder(orderData);
      return;
    }

    // If not in state, try to get from localStorage
    const storedOrder = localStorage.getItem("latestOrder");
    if (storedOrder) {
      try {
        const parsedOrder = JSON.parse(storedOrder);
        if (parsedOrder && parsedOrder.orderId) {
          // Transform shipping address data if needed
          if (parsedOrder.shippingAddress) {
            parsedOrder.shippingAddress = {
              fullName: parsedOrder.shippingAddress.fullName || parsedOrder.shippingAddress.contactName,
              address: parsedOrder.shippingAddress.address || 
                `${parsedOrder.shippingAddress.addressLine1}${parsedOrder.shippingAddress.addressLine2 ? `, ${parsedOrder.shippingAddress.addressLine2}` : ''}, ${parsedOrder.shippingAddress.city}, ${parsedOrder.shippingAddress.state} ${parsedOrder.shippingAddress.zipCode}`,
              phone: parsedOrder.shippingAddress.phone || parsedOrder.shippingAddress.phoneNumber
            };
          }
          setOrder(parsedOrder);
          return;
        }
      } catch (err) {
        console.error("Error parsing stored order:", err);
      }
    }

    // If no order data found, redirect to home
    setError("No order details found");
    setTimeout(() => {
      navigate("/");
    }, 2000);
  }, [location.state, navigate]);

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
            cursor: "pointer",
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ padding: "30px", textAlign: "center" }}>
        <p>Loading order details...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ padding: "30px", maxWidth: "800px", margin: "0 auto" }}>
        <h1 style={{ color: "#2c3e50", fontSize: "2.5rem", textAlign: "center", marginBottom: "20px" }}>
          🎉 Order Confirmed!
        </h1>
        <p style={{ textAlign: "center", fontSize: "1.2rem", color: "#555", marginBottom: "40px" }}>
          Thank you for your order. We'll notify you once it ships!
        </p>

        <div style={{ 
          padding: "30px", 
          border: "1px solid #ddd", 
          borderRadius: "10px",
          backgroundColor: "#fff",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
        }}>
          <h2 style={{ fontSize: "1.8rem", marginBottom: "20px", color: "#2c3e50" }}>
            Order Summary
          </h2>

          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ fontSize: "1.3rem", color: "#2c3e50", marginBottom: "10px" }}>Order Details</h3>
            <p><strong>Order ID:</strong> {order.orderId}</p>
            <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleString()}</p>
            <p><strong>Status:</strong> <span style={{ color: "#27ae60" }}>{order.status}</span></p>
            <p><strong>Payment Status:</strong> <span style={{ color: "#27ae60" }}>{order.paymentStatus}</span></p>
          </div>

          {order.shippingAddress && (
            <div style={{ marginBottom: "30px" }}>
              <h3 style={{ fontSize: "1.3rem", color: "#2c3e50", marginBottom: "10px" }}>Shipping Information</h3>
              <p><strong>Name:</strong> {order.shippingAddress.fullName}</p>
              <p><strong>Address:</strong> {order.shippingAddress.address}</p>
              <p><strong>Phone:</strong> {order.shippingAddress.phone}</p>
            </div>
          )}

          <div style={{ marginBottom: "30px" }}>
            <h3 style={{ fontSize: "1.3rem", color: "#2c3e50", marginBottom: "10px" }}>Items Ordered</h3>
            <div style={{ border: "1px solid #eee", borderRadius: "5px", overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead style={{ backgroundColor: "#f8f9fa" }}>
                  <tr>
                    <th style={{ padding: "12px", textAlign: "left" }}>Product</th>
                    <th style={{ padding: "12px", textAlign: "center" }}>Size</th>
                    <th style={{ padding: "12px", textAlign: "center" }}>Quantity</th>
                    <th style={{ padding: "12px", textAlign: "right" }}>Price</th>
                    <th style={{ padding: "12px", textAlign: "right" }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items?.map((item, idx) => (
                    <tr key={idx} style={{ borderTop: "1px solid #eee" }}>
                      <td style={{ padding: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <img 
                            src={item.imageUrl} 
                            alt={item.productName} 
                            style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                          />
                          <span>{item.productName}</span>
                        </div>
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>{item.size}</td>
                      <td style={{ padding: "12px", textAlign: "center" }}>{item.quantity}</td>
                      <td style={{ padding: "12px", textAlign: "right" }}>LKR {item.price.toFixed(2)}</td>
                      <td style={{ padding: "12px", textAlign: "right" }}>LKR {(item.price * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ 
            borderTop: "2px solid #eee", 
            paddingTop: "20px",
            marginTop: "20px"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span>Subtotal:</span>
              <span>LKR {order.subtotal?.toFixed(2) || "0.00"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
              <span>Shipping Fee:</span>
              <span>{order.shippingFee === 0 ? "FREE" : `LKR ${order.shippingFee?.toFixed(2) || "0.00"}`}</span>
            </div>
            {order.loyaltyPoints?.used > 0 && (
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px", color: "#27ae60" }}>
                <span>Loyalty Points Used:</span>
                <span>-LKR {(order.loyaltyPoints.used * 0.01).toFixed(2)}</span>
              </div>
            )}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              marginTop: "20px",
              paddingTop: "20px",
              borderTop: "1px solid #eee",
              fontSize: "1.2rem",
              fontWeight: "bold"
            }}>
              <span>Total Amount:</span>
              <span>LKR {order.totalAmount?.toFixed(2) || "0.00"}</span>
            </div>
            {order.loyaltyPoints?.earned > 0 && (
              <div style={{ 
                marginTop: "10px",
                textAlign: "right",
                color: "#27ae60",
                fontSize: "0.9rem"
              }}>
                You earned {order.loyaltyPoints.earned} loyalty points from this purchase!
              </div>
            )}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <button
            onClick={() => navigate("/my-orders")}
            style={{
              padding: "12px 24px",
              backgroundColor: "#3498db",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "1rem",
              cursor: "pointer",
              marginRight: "10px"
            }}
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate("/")}
            style={{
              padding: "12px 24px",
              backgroundColor: "#2ecc71",
              color: "white",
              border: "none",
              borderRadius: "5px",
              fontSize: "1rem",
              cursor: "pointer"
            }}
          >
            Continue Shopping
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default OrderConfirmationPage;
