import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import './OrdersPage.css';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newOrder, setNewOrder] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check if we have a new order from the location state
    if (location.state?.newOrder) {
      setNewOrder(location.state.newOrder);
    }

    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");
        
        if (!token || !userId) {
          navigate("/login");
          return;
        }

        const response = await axios.get(`http://localhost:8070/api/orders/user/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        if (response.data) {
          setOrders(response.data);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setError("Failed to load orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate, location]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return <div className="orders-container">Loading...</div>;
  }

  if (error) {
    return (
      <div className="orders-container">
        <div className="error-message">
          <h2>Error Loading Orders</h2>
          <p>{error}</p>
          <button className="retry-btn" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const renderOrderCard = (order) => (
    <div key={order._id} className="order-card">
      <div className="order-header">
        <span className="order-id">Order #{order._id.slice(-6)}</span>
        <span className="order-date">{formatDate(order.createdAt)}</span>
      </div>
      
      <div className="order-info">
        <div className="info-row">
          <span className="info-label">Customer:</span>
          <span className="info-value">{order.shippingAddress?.fullName || 'N/A'}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Address:</span>
          <span className="info-value">{order.shippingAddress?.address || 'N/A'}</span>
        </div>
        <div className="info-row">
          <span className="info-label">Phone:</span>
          <span className="info-value">{order.shippingAddress?.phone || 'N/A'}</span>
        </div>
      </div>

      <div className="order-items">
        <h3 className="items-heading">Ordered Items</h3>
        {order.items.map((item) => (
          <div key={item._id} className="order-item">
            <div className="item-details">
              <span className="item-name">{item.name}</span>
              <span className="item-size">Size: {item.size || "N/A"}</span>
              <span className="item-quantity">Qty: {item.quantity}</span>
            </div>
            <span className="item-price">Rs {item.price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="order-summary">
        <div className="summary-row">
          <span>Subtotal:</span>
          <span>Rs {order.totalAmount.toFixed(2)}</span>
        </div>
        <div className="summary-row">
          <span>Delivery Fee:</span>
          <span>Rs {order.deliveryFee ? order.deliveryFee.toFixed(2) : "0.00"}</span>
        </div>
        <div className="summary-row total">
          <span>Total Amount:</span>
          <span>Rs {(order.totalAmount + (order.deliveryFee || 0)).toFixed(2)}</span>
        </div>
      </div>

      <div className="order-status-container">
        <div className={`order-status status-${order.status}`}>
          <span className="status-label">Order Status:</span>
          <span className="status-value">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</span>
        </div>
        <div className={`payment-status status-${order.paymentStatus}`}>
          <span className="status-label">Payment Status:</span>
          <span className="status-value">{order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}</span>
        </div>
      </div>
    </div>
  );

  if (orders.length === 0 && !newOrder) {
    return (
      <div className="orders-container">
        <div className="empty-orders">
          <h2>No Orders Yet</h2>
          <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
          <button className="shop-now-btn" onClick={() => navigate("/")}>
            Shop Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
    <Navbar />
    <div className="orders-container">
      <h1 className="orders-heading">Your Orders</h1>
      
      {newOrder && (
        <div className="new-order-section">
          <h2 className="success-message">🎉 Order Placed Successfully!</h2>
          <p className="order-confirmation">
            Thank you for your order! Your order has been placed and is being processed.
            You can track your order status below.
          </p>
          {renderOrderCard(newOrder)}
        </div>
      )}

      {orders.length > 0 && (
        <div className="orders-list">
          {orders.map((order) => renderOrderCard(order))}
        </div>
      )}
    </div>
    <Footer />
    </>
  );
};

export default OrdersPage;
