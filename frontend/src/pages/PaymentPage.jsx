// src/pages/PaymentPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    const storedDetails = JSON.parse(localStorage.getItem("checkoutDetails")) || {};
    setCart(storedCart);
    setCheckoutDetails(storedDetails);

    fetchUserPoints();
    fetchDefaultAddress();
  }, []);

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

  const handlePayment = async () => {
    if (!cardNumber || !cardholderName || !expiryDate || !cvv) {
      alert("Please fill in all card details!");
      return;
    }

    if (!address) {
      alert("No shipping address found. Please add a shipping address first!");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty!");
      return;
    }

    try {
      const orderPayload = {
        userId,
        customerName: checkoutDetails.customerName || address.contactName,
        shippingAddress: `${address.addressLine1}, ${address.city}, ${address.state}, ${address.zipCode}`,
        items: cart.map(item => ({
          productId: item.productId,
          productName: item.productName || "",
          quantity: item.quantity,
          price: item.price
        })),
        totalAmount: finalTotal,
        paymentMethod: "Card", // Make sure this line is sent
        status: "Ordered",
        paymentStatus: "completed",
      };

      const saveOrderRes = await axios.post("http://localhost:8070/api/orders", orderPayload);
      const orderId = saveOrderRes.data._id;

      if (saveCard) {
        await axios.post("http://localhost:8070/api/cardinfo", {
          userId,
          orderId,
          cardNumber,
          cardLast4: cardNumber.slice(-4),
          cardholderName,
          customerName: cardholderName,
          expiryDate,
          cvv,
          saveCardDetails: true,
        });
      }

      localStorage.removeItem("cart");
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

      <h3>Enter Card Details</h3>

      <div style={{ marginBottom: "10px" }}>
        <label>Card Number:</label>
        <input
          type="text"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Cardholder Name:</label>
        <input
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>Expiry Date (MM/YY):</label>
        <input
          type="text"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "10px" }}>
        <label>CVV:</label>
        <input
          type="password"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label>
          <input
            type="checkbox"
            checked={saveCard}
            onChange={() => setSaveCard(!saveCard)}
          />
          Save Card Details for Future
        </label>
      </div>

      <button onClick={handlePayment} style={{ marginTop: "10px", padding: "10px 20px" }}>
        Pay Now
      </button>
    </div>
  );
};

export default PaymentPage;
