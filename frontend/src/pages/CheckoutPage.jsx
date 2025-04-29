// src/pages/CheckoutPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [addressList, setAddressList] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [contactName, setContactName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [isSavingAddress, setIsSavingAddress] = useState(false);
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const initializeCheckout = async () => {
      try {
        setLoading(true);
        if (!userId) {
          navigate("/login");
          return;
        }

        const userCart = JSON.parse(localStorage.getItem(`cart_${userId}`)) || [];
        if (userCart.length === 0) {
          navigate("/cart");
          return;
        }
        setCart(userCart);

        const res = await axios.get(`http://localhost:8070/api/address/user/${userId}`);
        setAddressList(res.data);
        if (res.data.length > 0) {
          const defaultAddr = res.data.find(a => a.isDefault) || res.data[0];
          setSelectedAddressId(defaultAddr._id);
          fillAddressFields(defaultAddr);
        }
      } catch (error) {
        console.error("Error initializing checkout:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeCheckout();
  }, [navigate, userId]);

  const fillAddressFields = (address) => {
    setContactName(address.contactName || "");
    setPhoneNumber(address.phoneNumber || "");
    setAddressLine1(address.addressLine1 || "");
    setAddressLine2(address.addressLine2 || "");
    setCity(address.city || "");
    setState(address.state || "");
    setZipCode(address.zipCode || "");
  };

  const handleAddressChange = (e) => {
    const selectedId = e.target.value;
    setSelectedAddressId(selectedId);

    const addr = addressList.find(a => a._id === selectedId);
    if (addr) {
      fillAddressFields(addr);
    }
  };

  const calculateTotal = () => {
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const shippingFee = subtotal >= 5000 ? 0 : 450;
    return subtotal + shippingFee;
  };

  const handleSaveAddress = async () => {
    if (!contactName || !phoneNumber || !addressLine1 || !city || !state || !zipCode) {
      alert("Please fill all required fields!");
      return;
    }

    // Check if address already exists
    const isDuplicateAddress = addressList.some(addr => 
      addr.contactName === contactName &&
      addr.phoneNumber === phoneNumber &&
      addr.addressLine1 === addressLine1 &&
      addr.addressLine2 === addressLine2 &&
      addr.city === city &&
      addr.state === state &&
      addr.zipCode === zipCode
    );

    if (isDuplicateAddress) {
      alert("This address is already saved in your account!");
      return;
    }

    try {
      setIsSavingAddress(true);
      const newAddress = {
        userId,
        contactName,
        phoneNumber,
        addressLine1,
        addressLine2,
        city,
        state,
        zipCode,
        isDefault: addressList.length === 0
      };
      const res = await axios.post("http://localhost:8070/api/address", newAddress);
      setAddressList([...addressList, res.data]);
      setSelectedAddressId(res.data._id);
      alert("Address saved successfully!");
    } catch (error) {
      console.error("Failed to save address:", error);
      alert("Failed to save address");
    } finally {
      setIsSavingAddress(false);
    }
  };

  const handleProceedToPayment = () => {
    if (!selectedAddressId) {
      alert("Please select or save an address first!");
      return;
    }

    const selectedAddress = addressList.find(addr => addr._id === selectedAddressId);
    const orderDetails = {
      userId,
      customerName: selectedAddress.contactName,
      shippingAddress: selectedAddress,
      cartItems: cart,
      totalAmount: calculateTotal(),
    };

    localStorage.setItem("checkoutDetails", JSON.stringify(orderDetails));
    localStorage.setItem(`cart_${userId}`, JSON.stringify(cart));
    navigate("/payment");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-message">
          <p>Loading checkout...</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="checkout-page">
        <div className="checkout-header">
          <h2>Checkout</h2>
        </div>

        <div className="checkout-content">
          <div className="cart-summary">
            <h4>Order Summary</h4>
            <div className="summary-details">
              <p>Subtotal: LKR {cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2)}</p>
              <p>Shipping Fee: {cart.reduce((total, item) => total + item.price * item.quantity, 0) >= 5000 ? 
                <span style={{ color: "#4CAF50" }}>FREE</span> : 
                <>LKR 450.00</>
              }</p>
              {cart.reduce((total, item) => total + item.price * item.quantity, 0) < 5000 && (
                <p style={{ color: "#666", fontSize: "0.9em" }}>
                  Add LKR {(5000 - cart.reduce((total, item) => total + item.price * item.quantity, 0)).toFixed(2)} more to get free shipping!
                </p>
              )}
              <h4>Total: LKR {calculateTotal().toFixed(2)}</h4>
            </div>
          </div>

          <div className="shipping-section">
            <h3>Shipping Address</h3>
            
            <div className="saved-addresses">
              {addressList.length > 0 ? (
                <select
                  className="address-select"
                  value={selectedAddressId}
                  onChange={handleAddressChange}
                >
                  {addressList.map((addr) => (
                    <option key={addr._id} value={addr._id}>
                      {addr.contactName} - {addr.addressLine1}, {addr.city}
                    </option>
                  ))}
                </select>
              ) : (
                <p className="no-address-message">No saved addresses. Please add below 👇</p>
              )}
            </div>

            <form className="address-form">
              <div className="form-group">
                <label>Contact Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter contact name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter phone number"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Address Line 1</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter address line 1"
                  value={addressLine1}
                  onChange={(e) => setAddressLine1(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Address Line 2 (Optional)</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter address line 2"
                  value={addressLine2}
                  onChange={(e) => setAddressLine2(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter city"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Zip Code</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Enter zip code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  required
                />
              </div>

              <div className="button-group">
                <button
                  type="button"
                  className="save-address-btn"
                  onClick={handleSaveAddress}
                  disabled={isSavingAddress}
                >
                  {isSavingAddress ? "Saving..." : "Save Address"}
                </button>
              </div>
            </form>

            <button
              className="proceed-btn"
              onClick={handleProceedToPayment}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default CheckoutPage;
