import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./OrderConfirmationPage.css";

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const orderDetails =
    location.state?.orderDetails ||
    JSON.parse(localStorage.getItem("orderSummary") || "null");

  const formatShippingAddress = (address) => {
    if (!address) return "No shipping address provided";
    return `${address.fullName}, ${address.address}, ${address.phone}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Date not available";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    if (!status) return "status-unknown";
    return `status-${status.toLowerCase()}`;
  };

  if (!orderDetails) {
    return (
      <>
        <Navbar />
        <div className="order-confirmation">
          <div className="confirmation-header">
            <h1>Order Confirmation</h1>
            <p className="error-message">
              No order details found. Please try again.
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="order-confirmation">
        <div className="confirmation-header">
          <h1>Order Confirmation</h1>
          <p className="success-message">Thank you for your order!</p>
        </div>

        <div className="order-details">
          <div className="order-section">
            <h2>Order Information</h2>
            <p>
              <strong>Order ID:</strong> {orderDetails.orderId || "Not available"}
            </p>
            <p>
              <strong>Order Date:</strong> {formatDate(orderDetails.createdAt)}
            </p>
            <p>
              <strong>Customer Name:</strong>{" "}
              {orderDetails.customerName || "Not available"}
            </p>
            <p>
              <strong>Payment Status:</strong>{" "}
              <span className={getStatusClass(orderDetails.paymentStatus)}>
                {orderDetails.paymentStatus || "Not available"}
              </span>
            </p>
            <p>
              <strong>Order Status:</strong>{" "}
              <span className={getStatusClass(orderDetails.status)}>
                {orderDetails.status || "Not available"}
              </span>
            </p>
          </div>

          <div className="order-section">
            <h2>Shipping Address</h2>
            <div className="address-details">
              <p>{formatShippingAddress(orderDetails.shippingAddress)}</p>
            </div>
          </div>

          <div className="order-section">
            <h2>Order Items</h2>
            <div className="items-list">
              {orderDetails.items?.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="item-image">
                    <img src={item.imageUrl} alt={item.productName} />
                  </div>
                  <div className="item-details">
                    <h3>{item.productName}</h3>
                    <p>Size: {item.size}</p>
                    <p>Quantity: {item.quantity}</p>
                    <p>Price: LKR {item.price?.toFixed(2) || "0.00"}</p>
                  </div>
                </div>
              )) || <p>No items found</p>}
            </div>
          </div>

          <div className="order-section">
            <h2>Order Summary</h2>
            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>LKR {orderDetails.subtotal?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="summary-row">
                <span>Shipping Fee:</span>
                <span>LKR {orderDetails.shippingFee?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="summary-row total">
                <span>Total Amount:</span>
                <span>LKR {orderDetails.totalAmount?.toFixed(2) || "0.00"}</span>
              </div>
              <div className="summary-row">
                <span>Payment Method:</span>
                <span>{orderDetails.paymentMethod || "Not available"}</span>
              </div>
              {orderDetails.loyaltyPoints && (
                <>
                  <div className="summary-row">
                    <span>Loyalty Points Used:</span>
                    <span>{orderDetails.loyaltyPoints.used || 0}</span>
                  </div>
                  <div className="summary-row">
                    <span>Loyalty Points Earned:</span>
                    <span>{orderDetails.loyaltyPoints.earned || 0}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button
            onClick={() => navigate("/my-orders")}
            className="view-orders-btn"
          >
            View My Orders
          </button>
          <button
            onClick={() => navigate("/")}
            className="continue-shopping-btn"
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