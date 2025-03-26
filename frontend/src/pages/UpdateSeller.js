// src/pages/UpdateSeller.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./UpdateSeller.css";

function UpdateSeller() {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const [sellerData, setSellerData] = useState({
    name: "",
    email: "",
    storeName: "",
    fcmToken: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("DEBUG: sellerId from URL:", sellerId); // DEBUG: Log sellerId
    console.log("DEBUG: Token from localStorage:", token); // DEBUG: Log token
    if (!token) {
      setMessage("No token found. Please login.");
      return;
    }
    fetchSeller(token);
  }, [sellerId, navigate]);

  const fetchSeller = async (token) => {
    try {
      console.log(`DEBUG: Fetching seller data for sellerId: ${sellerId}`); // DEBUG
      const res = await fetch(`http://localhost:8070/api/sellers/${sellerId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      console.log("DEBUG: Fetched seller data:", data); // DEBUG
      if (res.ok) {
        setSellerData({
          name: data.name,
          email: data.email,
          storeName: data.storeName,
          fcmToken: data.fcmToken || "",
        });
      } else {
        setMessage(data.message || "Error fetching seller");
      }
    } catch (err) {
      console.error("Error fetching seller:", err);
      setMessage("Error fetching seller");
    }
  };

  const handleChange = (e) => {
    setSellerData({ ...sellerData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No token found. Please login.");
      return;
    }
    try {
      console.log("DEBUG: Updating seller with data:", sellerData); // DEBUG
      const res = await fetch(`http://localhost:8070/api/sellers/${sellerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(sellerData),
      });
      const data = await res.json();
      console.log("DEBUG: Update seller response:", data); // DEBUG
      if (res.ok) {
        setMessage("Seller updated successfully!");
        navigate("/superadmin/sellers");
      } else {
        setMessage(data.message || "Error updating seller");
      }
    } catch (err) {
      console.error("Error updating seller:", err);
      setMessage("Error updating seller");
    }
  };

  const handleBack = () => {
    navigate("/superadmin/sellers");
  };

  return (
    <div className="update-seller-container">
      <h2>Update Seller</h2>
      {message && <p className="error-message">{message}</p>}

      <form onSubmit={handleUpdate} className="update-form">
        <div className="form-group">
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={sellerData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={sellerData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Store Name:</label>
          <input
            type="text"
            name="storeName"
            value={sellerData.storeName}
            onChange={handleChange}
            required
          />
        </div>

        {/* <div className="form-group">
          <label>FCM Token:</label>
          <input
            type="text"
            name="fcmToken"
            value={sellerData.fcmToken}
            onChange={handleChange}
          />
        </div> */}

        <div className="button-group">
          <button type="submit" className="update-button">
            Update
          </button>
          <button type="button" className="back-button" onClick={handleBack}>
            Back
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateSeller;