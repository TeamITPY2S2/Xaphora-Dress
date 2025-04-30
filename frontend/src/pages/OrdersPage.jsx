import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import './OrdersPage.css';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newOrder, setNewOrder] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedOrderId, setConfirmedOrderId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
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
          setFilteredOrders(response.data);
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

  // Add search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredOrders(orders);
      return;
    }

    const searchTermLower = searchTerm.toLowerCase();
    const filtered = orders.filter(order => {
      if (!order) return false;

      const orderId = (order._id || '').toLowerCase();
      const status = (order.status || '').toLowerCase();
      const fullName = (order.shippingAddress?.fullName || '').toLowerCase();
      const productNames = (order.items || []).map(item => 
        (item?.productName || '').toLowerCase()
      );

      return orderId.includes(searchTermLower) ||
             status.includes(searchTermLower) ||
             fullName.includes(searchTermLower) ||
             productNames.some(name => name.includes(searchTermLower));
    });

    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleConfirmDelivery = async (orderId) => {
    const confirmed = window.confirm("Are you sure you want to confirm delivery for this order?");
    
    if (!confirmed) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:8070/api/orders/${orderId}/confirm-delivery`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        setConfirmedOrderId(orderId);
        setShowConfirmation(true);
        // Remove the confirmed order from the list
        setOrders(orders.filter(order => order._id !== orderId));
      }
    } catch (error) {
      console.error("Error confirming delivery:", error);
      setError("Failed to confirm delivery. Please try again later.");
    }
  };

  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setConfirmedOrderId(null);
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

  const renderOrderCard = (order) => {
    return (
      <div key={order._id} className="order-card">
        <div className="order-header">
          <span className="order-id">Order #{order._id}</span>
          <span className="order-date">{formatDate(order.createdAt)}</span>
        </div>

        <div className="order-info">
          <div className="info-row">
            <span className="info-label">Status:</span>
            <span className={`info-value status-${order.status}`}>{order.status}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Total Amount:</span>
            <span className="info-value">LKR {order.totalAmount.toFixed(2)}</span>
          </div>
        </div>

        <div className="order-items">
          <h3 className="items-heading">Items</h3>
          {order.items.map((item, index) => (
            <div key={index} className="order-item">
              <div className="item-details">
                <span className="item-name">{item.productName}</span>
                <span className="item-size">Size: {item.size}</span>
                <span className="item-quantity">Qty: {item.quantity}</span>
              </div>
              <span className="item-price">LKR {item.price.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="order-actions">
          <button 
            className="confirm-delivery-btn"
            onClick={() => handleConfirmDelivery(order._id)}
          >
            Confirm Delivery
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="orders-container">
        <h1 className="orders-heading">My Orders</h1>
        
        {/* Search Bar */}
        <div className="search-container">
          <input
            type="text"
            placeholder="Search orders by ID, status, or product name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        {showConfirmation && (
          <div className="confirmation-modal">
            <div className="confirmation-content">
              <h2>Order Confirmed!</h2>
              <p>Order #{confirmedOrderId} has been marked as delivered.</p>
              <button className="close-btn" onClick={handleCloseConfirmation}>
                Close
              </button>
            </div>
          </div>
        )}
        
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

        {filteredOrders.length > 0 ? (
          <div className="orders-list">
            {filteredOrders.map((order) => renderOrderCard(order))}
          </div>
        ) : (
          <div className="empty-orders">
            <h2>No Orders Found</h2>
            <p>{searchTerm ? "No orders match your search criteria." : "You haven't placed any orders yet. Start shopping to see your orders here!"}</p>
            <button className="shop-now-btn" onClick={() => navigate("/")}>
              Shop Now
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default OrdersPage;
