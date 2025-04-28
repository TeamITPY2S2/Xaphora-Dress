// src/pages/PaymentPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SavedCards from "../components/SavedCards";

const PaymentPage = () => {
  const navigate = useNavigate();

  const [cart, setCart] = useState([]);
  const [checkoutDetails, setCheckoutDetails] = useState({});
  const [usePoints, setUsePoints] = useState(false);
  const [finalTotal, setFinalTotal] = useState(0);
  const [userPoints, setUserPoints] = useState(0);
  const [address, setAddress] = useState(null);

  const [cardNumber, setCardNumber] = useState("");
  const [cardholderName, setCardholderName] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [cardErrors, setCardErrors] = useState({});

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/api/auth/login");
      return;
    }

    // Get cart items from user-specific cart
    const storedCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
    const storedDetails = JSON.parse(localStorage.getItem("checkoutDetails")) || {};
    
    if (storedCart.length === 0) {
      alert("Cart is empty!");
      navigate("/cart");
      return;
    }
    
    setCart(storedCart);
    setCheckoutDetails(storedDetails);

    fetchUserPoints();
    fetchDefaultAddress();
  }, [navigate]);

  const fetchUserPoints = async () => {
    try {
      const res = await axios.get(`http://localhost:8070/api/users/${userId}`);
      setUserPoints(res.data.loyaltyPoints || 0);
    } catch (error) {
      console.error("Error fetching loyalty points:", error);
    }
  };

  const fetchDefaultAddress = async () => {
    try {
      const res = await axios.get(`http://localhost:8070/api/address/user/${userId}`);
      const defaultAddr = res.data.find(addr => addr.isDefault) || res.data[0];
      setAddress(defaultAddr);
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  useEffect(() => {
    const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = usePoints ? Math.min(userPoints, cartTotal) : 0;
    setFinalTotal(cartTotal - discount);
  }, [cart, usePoints, userPoints]);

  // Add validation functions
  const validateCardNumber = (number) => {
    return /^\d{16}$/.test(number);
  };

  const validateExpiryDate = (date) => {
    return /^(0[1-9]|1[0-2])\/([0-9]{2})$/.test(date);
  };

  const validateCVV = (cvv) => {
    return /^\d{3,4}$/.test(cvv);
  };

  const validateCardholderName = (name) => {
    return name.trim().length > 0;
  };

  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 16);
    setCardNumber(value);
    setCardErrors(prev => ({
      ...prev,
      cardNumber: validateCardNumber(value) ? '' : 'Card number must be 16 digits'
    }));
  };

  const handleExpiryDateChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setExpiryDate(value);
    setCardErrors(prev => ({
      ...prev,
      expiryDate: validateExpiryDate(value) ? '' : 'Expiry date must be in MM/YY format'
    }));
  };

  const handleCVVChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCvv(value);
    setCardErrors(prev => ({
      ...prev,
      cvv: validateCVV(value) ? '' : 'CVV must be 3 or 4 digits'
    }));
  };

  const handleCardholderNameChange = (e) => {
    const value = e.target.value;
    setCardholderName(value);
    setCardErrors(prev => ({
      ...prev,
      cardholderName: validateCardholderName(value) ? '' : 'Cardholder name is required'
    }));
  };

  const validateCardDetails = () => {
    const errors = {};
    if (!validateCardNumber(cardNumber)) {
      errors.cardNumber = 'Card number must be 16 digits';
    }
    if (!validateExpiryDate(expiryDate)) {
      errors.expiryDate = 'Expiry date must be in MM/YY format';
    }
    if (!validateCVV(cvv)) {
      errors.cvv = 'CVV must be 3 or 4 digits';
    }
    if (!validateCardholderName(cardholderName)) {
      errors.cardholderName = 'Cardholder name is required';
    }
    setCardErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSelectSavedCard = (card) => {
    setCardNumber(card.cardNumber);
    setCardholderName(card.cardholderName);
    setExpiryDate(card.expiryDate);
    setCvv(card.cvv);
    setSaveCard(true);
  };

  const handlePayment = async () => {
    if (!validateCardDetails()) {
      alert("Please fix the card validation errors before proceeding");
      return;
    }

    if (!address) {
      alert("No shipping address found. Please add a shipping address first!");
      return;
    }

    const userId = localStorage.getItem("userId");
    const cartItems = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];

    if (cartItems.length === 0) {
      alert("Cart is empty!");
      return;
    }

    try {
      // First create the order
      const orderPayload = {
        userId,
        customerName: checkoutDetails.customerName || address.contactName,
        shippingAddress: {
          fullName: checkoutDetails.customerName || address.contactName,
          address: `${checkoutDetails.shippingAddress.addressLine1}, ${checkoutDetails.shippingAddress.city}, ${checkoutDetails.shippingAddress.state}, ${checkoutDetails.shippingAddress.zipCode}`,
          phone: checkoutDetails.shippingAddress.phoneNumber || "Not provided"
        },
        items: cartItems.map(item => ({
          productId: item.productId,
          productName: item.productName || "",
          size: item.size || "N/A",
          quantity: item.quantity,
          price: item.price,
          imageUrl: item.imageUrl || "https://via.placeholder.com/150"
        })),
        totalAmount: finalTotal,
        paymentMethod: "credit_card",
        status: "pending",
        paymentStatus: "completed"
      };

      console.log("Sending order payload:", orderPayload);

      const saveOrderRes = await axios.post("http://localhost:8070/api/orders", orderPayload);
      console.log("Order save response:", saveOrderRes.data);
      
      // Save the complete order details to localStorage
      const orderDetails = {
        ...saveOrderRes.data,
        customerName: orderPayload.customerName,
        shippingAddress: orderPayload.shippingAddress,
        items: orderPayload.items,
        totalAmount: orderPayload.totalAmount
      };
      
      localStorage.setItem("latestOrderDetails", JSON.stringify(orderDetails));
      
      // Clear cart from localStorage
      localStorage.removeItem(`cart_${userId}`);
      
      // Navigate to order confirmation
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Payment error:", error.response?.data || error.message);
      alert("Payment failed: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Payment</h1>

      {address ? (
        <div style={{ marginBottom: "20px" }}>
          <h3>Shipping Address</h3>
          <p>{address.contactName}</p>
          <p>{address.addressLine1}, {address.city}</p>
          <p>{address.state}, {address.zipCode}</p>
        </div>
      ) : (
        <p>No address found! Please add it in profile.</p>
      )}

      <h4>Cart Total: LKR {cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}</h4>

      <div style={{ margin: "10px 0" }}>
        <label>
          <input
            type="checkbox"
            checked={usePoints}
            onChange={() => setUsePoints(!usePoints)}
          />
          Use Loyalty Points (Available: {userPoints})
        </label>
      </div>

      <h2>Final Payable: LKR {finalTotal.toFixed(2)}</h2>

      <hr />

      <div style={{ display: "flex", gap: "20px" }}>
        <div style={{ flex: 1 }}>
          <SavedCards onSelectCard={handleSelectSavedCard} />
        </div>

        <div style={{ flex: 1 }}>
          <h3>Enter Card Details</h3>
          <div className="card-details" style={{ marginTop: "20px" }}>
            <div style={{ marginBottom: "10px" }}>
              <label>Card Number:</label>
              <input
                type="text"
                value={cardNumber}
                onChange={handleCardNumberChange}
                placeholder="1234 5678 9012 3456"
                maxLength="16"
              />
              {cardErrors.cardNumber && <span style={{ color: 'red' }}>{cardErrors.cardNumber}</span>}
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Cardholder Name:</label>
              <input
                type="text"
                value={cardholderName}
                onChange={handleCardholderNameChange}
                placeholder="John Doe"
              />
              {cardErrors.cardholderName && <span style={{ color: 'red' }}>{cardErrors.cardholderName}</span>}
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>Expiry Date:</label>
              <input
                type="text"
                value={expiryDate}
                onChange={handleExpiryDateChange}
                placeholder="MM/YY"
                maxLength="5"
              />
              {cardErrors.expiryDate && <span style={{ color: 'red' }}>{cardErrors.expiryDate}</span>}
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>CVV:</label>
              <input
                type="password"
                value={cvv}
                onChange={handleCVVChange}
                placeholder="123"
                maxLength="4"
              />
              {cardErrors.cvv && <span style={{ color: 'red' }}>{cardErrors.cvv}</span>}
            </div>

            <div style={{ marginBottom: "10px" }}>
              <label>
                <input
                  type="checkbox"
                  checked={saveCard}
                  onChange={(e) => setSaveCard(e.target.checked)}
                />
                Save card for future use
              </label>
            </div>
          </div>
        </div>
      </div>

      <button onClick={handlePayment} style={{ marginTop: "10px", padding: "10px 20px" }}>
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;
