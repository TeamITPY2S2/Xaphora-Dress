// src/pages/PaymentPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./PaymentPage.css";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [checkoutDetails, setCheckoutDetails] = useState(null);
  const [userPoints, setUserPoints] = useState(0);
  const [usePoints, setUsePoints] = useState(false);
  const [pointsToUse, setPointsToUse] = useState(0);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const initializePayment = async () => {
      try {
        setLoading(true);
        if (!userId) {
          navigate("/login");
          return;
        }

        const details = JSON.parse(localStorage.getItem("checkoutDetails"));
        if (!details) {
          navigate("/cart");
          return;
        }
        setCheckoutDetails(details);

        // Fetch user points
        const userRes = await axios.get(`http://localhost:8070/api/users/${userId}`);
        setUserPoints(userRes.data.loyaltyPoints || 0);

        // Fetch saved cards
        const cardsRes = await axios.get(`http://localhost:8070/api/cardinfo/user/${userId}`);
        setSavedCards(cardsRes.data);
      } catch (error) {
        console.error("Error initializing payment:", error);
      } finally {
        setLoading(false);
      }
    };

    initializePayment();
  }, [navigate, userId]);

  const handleSelectCard = (card) => {
    setSelectedCard(card);
    setCardNumber(card.cardNumber);
    setExpiryDate(card.expiryDate);
    setCvv(card.cvv);
    setCardholderName(card.cardholderName);
    setSaveCard(true);
  };

  const calculateTotal = () => {
    if (!checkoutDetails) return 0;
    const subtotal = checkoutDetails.totalAmount;
    const shippingFee = subtotal >= 5000 ? 0 : 450; // Single delivery charge
    const pointsValue = usePoints ? pointsToUse * 0.01 : 0;
    return subtotal + shippingFee - pointsValue;
  };

  const calculateLoyaltyPoints = () => {
    if (!checkoutDetails) return 0;
    const subtotal = checkoutDetails.totalAmount;
    return Math.floor(subtotal * 0.1); // 1% of subtotal only
  };

  const validateCard = () => {
    const newErrors = {};
    if (!cardholderName.trim()) {
      newErrors.cardholderName = "Please enter the cardholder name";
    }
    if (!cardNumber.match(/^\d{16}$/)) {
      newErrors.cardNumber = "Please enter a valid 16-digit card number";
    }
    if (!expiryDate.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
      newErrors.expiryDate = "Please enter a valid expiry date (MM/YY)";
    }
    if (!cvv.match(/^\d{3,4}$/)) {
      newErrors.cvv = "Please enter a valid CVV";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePayment = async () => {
    if (!validateCard()) return;

    try {
      // Get the auth token
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to continue");
      }

      // Save card if requested
      if (saveCard) {
        try {
          const { data: existingCards } = await axios.get(
            `http://localhost:8070/api/cardinfo/user/${userId}`
          );
          const cardExists = existingCards.some(
            card =>
              card.cardNumber === cardNumber &&
              card.expiryDate === expiryDate
          );

          if (!cardExists) {
            await axios.post(
              "http://localhost:8070/api/cardinfo",
              {
                userId,
                cardNumber,
                cardholderName,
                expiryDate,
                cvv,
                saveCardDetails: true,
              },
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                  "Content-Type": "application/json",
                },
              }
            );
          }
        } catch (err) {
          console.error("Error saving card:", err);
          // proceed even if saving fails
        }
      }

      // Format shipping address
      const { shippingAddress } = checkoutDetails;
      const formattedShippingAddress = {
        fullName: shippingAddress.contactName,
        address: `${shippingAddress.addressLine1}${
          shippingAddress.addressLine2
            ? ", " + shippingAddress.addressLine2
            : ""
        }, ${shippingAddress.city}, ${shippingAddress.state} ${
          shippingAddress.zipCode
        }`,
        phone: shippingAddress.phoneNumber,
      };

      // Calculate fees & totals
      const subtotal = checkoutDetails.totalAmount;
      const shippingFee = subtotal >= 5000 ? 0 : 450;
      const orderData = {
        userId,
        customerName: checkoutDetails.customerName,
        shippingAddress: formattedShippingAddress,
        items: checkoutDetails.cartItems.map(item => ({
          productId: item.productId,
          productName: item.productName,
          size: item.size,
          quantity: item.quantity,
          price: item.price,
          imageUrl: item.imageUrl || "https://via.placeholder.com/150",
        })),
        subtotal,
        shippingFee,
        totalAmount: calculateTotal(),
        paymentMethod: "credit_card",
        paymentStatus: "completed",
        status: "processing",
        loyaltyPoints: {
          used: usePoints ? pointsToUse : 0,
          earned: calculateLoyaltyPoints(),
        },
      };

      console.log("Sending order data:", orderData);
      const orderRes = await axios.post(
        "http://localhost:8070/api/orders",
        orderData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update loyalty points if used
      if (usePoints) {
        await axios.post(
          "http://localhost:8070/api/users/update-points",
          {
            userId,
            pointsUsed: pointsToUse,
            pointsEarned: calculateLoyaltyPoints(),
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      // Cleanup
      localStorage.removeItem(`cart_${userId}`);
      localStorage.removeItem("checkoutDetails");

      // Prepare confirmation data
      const orderDetails = {
        orderId: orderRes.data._id,
        customerName: orderRes.data.customerName,
        shippingAddress: orderRes.data.shippingAddress,
        items: orderRes.data.items,
        subtotal: orderRes.data.subtotal,
        shippingFee: orderRes.data.shippingFee,
        totalAmount: orderRes.data.totalAmount,
        paymentMethod: orderRes.data.paymentMethod,
        paymentStatus: orderRes.data.paymentStatus,
        status: orderRes.data.status,
        loyaltyPoints: orderRes.data.loyaltyPoints,
        createdAt: orderRes.data.createdAt,
      };

      // Store order details in localStorage
      localStorage.setItem("latestOrder", JSON.stringify(orderDetails));
      console.log("Stored order details:", orderDetails);

      // Show success message and navigate
      alert("Payment successful! Your order has been placed.");
      
      // Navigate to order confirmation with state
      navigate("/order-confirmation", { 
        state: { orderDetails },
        replace: true 
      });

      // Fallback navigation if React Router navigation fails
      setTimeout(() => {
        const currentPath = window.location.pathname;
        if (currentPath !== "/order-confirmation") {
          window.location.href = "/order-confirmation";
        }
      }, 1000);
    } catch (error) {
      console.error("Payment failed:", error);
      const msg = error.response?.data?.error || error.message || "Payment failed.";
      alert(msg);
    }
  };

  const maskCardNumber = (cardNumber) => {
    return `**** **** **** ${cardNumber.slice(-4)}`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-message">
          <p>Loading payment details...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="payment-page">
        <div className="payment-header">
          <h1>Payment</h1>
        </div>

        <div className="payment-content">
          <div className="order-summary">
            <h3>Order Summary</h3>
            
            <div className="shipping-info">
              <h3>Shipping Address</h3>
              <p>{checkoutDetails?.shippingAddress.contactName}</p>
              <p>{checkoutDetails?.shippingAddress.addressLine1}</p>
              {checkoutDetails?.shippingAddress.addressLine2 && (
                <p>{checkoutDetails.shippingAddress.addressLine2}</p>
              )}
              <p>
                {checkoutDetails?.shippingAddress.city}, {checkoutDetails?.shippingAddress.state} {checkoutDetails?.shippingAddress.zipCode}
              </p>
            </div>

            <div className="summary-details">
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>LKR {checkoutDetails?.totalAmount.toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Shipping Fee:</span>
                <span>
                  {checkoutDetails?.totalAmount >= 5000 ? (
                    <span className="free-shipping">FREE</span>
                  ) : (
                    "LKR 450.00"
                  )}
                </span>
              </div>
              {usePoints && (
                <div className="summary-row">
                  <span>Points Used:</span>
                  <span>-LKR {(pointsToUse * 0.01).toFixed(2)}</span>
                </div>
              )}
              <div className="summary-row total">
                <span>Total:</span>
                <span>LKR {calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="payment-section">
            <h3>Payment Details</h3>

            <div className="loyalty-points">
              <label>
                <input
                  type="checkbox"
                  checked={usePoints}
                  onChange={(e) => setUsePoints(e.target.checked)}
                />
                Use Loyalty Points
              </label>
              {usePoints && (
                <div className="points-details">
                  <p>Available Points: {userPoints}</p>
                  <p>Points Value: LKR {(userPoints * 0.01).toFixed(2)}</p>
                  <input
                    type="number"
                    className="form-input"
                    value={pointsToUse}
                    onChange={(e) => setPointsToUse(Math.min(parseInt(e.target.value) || 0, userPoints))}
                    max={userPoints}
                    min="0"
                  />
                </div>
              )}
            </div>

            <div className="shipping-fee">
              <h4>Shipping Information</h4>
              {checkoutDetails?.totalAmount >= 5000 ? (
                <p className="free-shipping">You qualify for FREE shipping!</p>
              ) : (
                <p className="shipping-message">
                  Add LKR {(5000 - checkoutDetails?.totalAmount).toFixed(2)} more to your cart to get FREE shipping!
                </p>
              )}
            </div>

            <div className="final-total">
              <h2>Final Total: LKR {calculateTotal().toFixed(2)}</h2>
            </div>

            <div className="payment-methods">
              {savedCards.length > 0 && (
                <div className="saved-cards">
                  <h4>Saved Cards</h4>
                  <div className="saved-cards-list">
                    {savedCards.map((card) => (
                      <div
                        key={card._id}
                        className={`saved-card-item ${selectedCard?._id === card._id ? 'selected' : ''}`}
                        onClick={() => handleSelectCard(card)}
                      >
                        <div className="card-number">{maskCardNumber(card.cardNumber)}</div>
                        <div className="card-details">
                          <span>{card.cardholderName}</span>
                          <span>Expires: {card.expiryDate}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="card-form">
                <div className="form-group">
                  <label>Cardholder Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter name as it appears on card"
                    value={cardholderName}
                    onChange={(e) => setCardholderName(e.target.value)}
                  />
                  {errors.cardholderName && <span className="error-message">{errors.cardholderName}</span>}
                </div>

                <div className="form-group">
                  <label>Card Number</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="1234 5678 9012 3456"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                  />
                  {errors.cardNumber && <span className="error-message">{errors.cardNumber}</span>}
                </div>

                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="MM/YY"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(\d)/, "$1/$2"))}
                  />
                  {errors.expiryDate && <span className="error-message">{errors.expiryDate}</span>}
                </div>

                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                  />
                  {errors.cvv && <span className="error-message">{errors.cvv}</span>}
                </div>

                <div className="save-card-option">
                  <input
                    type="checkbox"
                    id="saveCard"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                  />
                  <label htmlFor="saveCard">Save this card for future purchases</label>
                </div>
              </div>
            </div>

            <button
              className="pay-button"
              onClick={handlePayment}
              disabled={!cardNumber || !expiryDate || !cvv}
            >
              Pay Now
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PaymentPage;
