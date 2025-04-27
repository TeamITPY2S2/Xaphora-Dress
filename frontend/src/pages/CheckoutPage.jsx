// src/pages/CheckoutPage.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    if (storedCart.length === 0) {
      navigate("/cart");
    } else {
      setCart(storedCart);
    }

    if (userId) {
      axios.get(`http://localhost:8070/api/address/user/${userId}`)
        .then(res => {
          setAddressList(res.data);
          if (res.data.length > 0) {
            const defaultAddr = res.data.find(a => a.isDefault) || res.data[0];
            setSelectedAddressId(defaultAddr._id);
            fillAddressFields(defaultAddr);
          }
        })
        .catch(err => console.error("Failed to load addresses:", err));
    }
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

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const handleSaveAddress = async () => {
    if (!contactName || !phoneNumber || !addressLine1 || !city || !state || !zipCode) {
      alert("Please fill all address fields!");
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
      shippingAddress: selectedAddress.addressLine1,
      cartItems: cart,
      totalAmount: totalPrice,
    };

    localStorage.setItem("checkoutDetails", JSON.stringify(orderDetails));
    navigate("/payment");
  };

  return (
    <div className="checkout-page" style={{ padding: "20px" }}>
      <h2>Checkout</h2>

      {cart.length === 0 ? (
        <p>Loading cart...</p>
      ) : (
        <>
          <h4>Cart Total: LKR {totalPrice.toFixed(2)}</h4>

          <div style={{ margin: "20px 0" }}>
            <h3>Saved Addresses</h3>
            {addressList.length > 0 ? (
              <select
                value={selectedAddressId}
                onChange={handleAddressChange}
                style={{ width: "100%", padding: "8px", marginBottom: "10px" }}
              >
                {addressList.map((addr) => (
                  <option key={addr._id} value={addr._id}>
                    {addr.contactName} - {addr.addressLine1}, {addr.city}
                  </option>
                ))}
              </select>
            ) : (
              <p>No saved addresses. Please add below 👇</p>
            )}
          </div>

          <h3>New Shipping Address</h3>
          <form>
            <input
              type="text"
              placeholder="Contact Name"
              value={contactName}
              onChange={(e) => setContactName(e.target.value)}
              style={{ width: "100%", marginBottom: "10px" }}
              required
            />
            <input
              type="text"
              placeholder="Phone Number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              style={{ width: "100%", marginBottom: "10px" }}
              required
            />
            <input
              type="text"
              placeholder="Address Line 1"
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              style={{ width: "100%", marginBottom: "10px" }}
              required
            />
            <input
              type="text"
              placeholder="Address Line 2 (optional)"
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              style={{ width: "100%", marginBottom: "10px" }}
            />
            <input
              type="text"
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={{ width: "100%", marginBottom: "10px" }}
              required
            />
            <input
              type="text"
              placeholder="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              style={{ width: "100%", marginBottom: "10px" }}
              required
            />
            <input
              type="text"
              placeholder="Zip Code"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              style={{ width: "100%", marginBottom: "20px" }}
              required
            />

            <button
              type="button"
              onClick={handleSaveAddress}
              disabled={isSavingAddress}
              style={{ padding: "10px 20px", marginRight: "10px" }}
            >
              Save Address
            </button>
          </form>

          <button
            onClick={handleProceedToPayment}
            style={{ marginTop: "20px", padding: "10px 20px" }}
          >
            Proceed to Payment
          </button>
        </>
      )}
    </div>
  );
};

export default CheckoutPage;
