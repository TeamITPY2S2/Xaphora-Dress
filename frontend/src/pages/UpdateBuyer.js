// src/pages/UpdateBuyer.js
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./UpdateBuyer.css";

function UpdateBuyer() {
  const { buyerId } = useParams();
  const navigate = useNavigate();

  const [buyerData, setBuyerData] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    // DEBUG: Log the buyerId from the URL
    console.log("DEBUG: buyerId from useParams:", buyerId);

    const token = localStorage.getItem("token");
    // DEBUG: Log the token from localStorage
    console.log("DEBUG: Token from localStorage:", token);

    if (!token) {
      setMessage("No token found. Please login.");
      return;
    }

    fetchBuyer(token);
  }, [buyerId, navigate]);

  const fetchBuyer = async (token) => {
    try {
      // DEBUG: Indicate we're about to fetch
      console.log(`DEBUG: Fetching buyer data for buyerId: ${buyerId}`);

      const res = await fetch(`http://localhost:8070/users/${buyerId}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();

      // DEBUG: Log the entire response data
      console.log("DEBUG: Response from server:", data);

      if (res.ok) {
        // If your server returns { user: { ... } }, we need to do:
        // setBuyerData({ ...data.user });
        // But let's assume your server returns the shape: { user: { ... } }
        setBuyerData({
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
        });
      } else {
        setMessage(data.message || "Error fetching buyer");
      }
    } catch (err) {
      console.error("Error fetching buyer:", err);
      setMessage("Error fetching buyer");
    }
  };

  const handleChange = (e) => {
    setBuyerData({ ...buyerData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No token found. Please login.");
      return;
    }

    // DEBUG: Log the data we're about to send
    console.log("DEBUG: Updating buyer with data:", buyerData);

    try {
      const res = await fetch(`http://localhost:8070/users/${buyerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(buyerData),
      });
      const data = await res.json();

      // DEBUG: Log the response from the update
      console.log("DEBUG: Update response:", data);

      if (res.ok) {
        setMessage("Buyer updated successfully!");
        navigate("/superadmin/buyers");
      } else {
        setMessage(data.message || "Error updating buyer");
      }
    } catch (err) {
      console.error("Error updating buyer:", err);
      setMessage("Error updating buyer");
    }
  };

  const handleBack = () => {
    navigate("/superadmin/buyers");
  };

  return (
    <div className="update-buyer-container">
      <h2>Update Buyer</h2>
      {message && <p className="error-message">{message}</p>}

      <form onSubmit={handleUpdate} className="update-form">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={buyerData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>First Name:</label>
          <input
            type="text"
            name="firstName"
            value={buyerData.firstName}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Last Name:</label>
          <input
            type="text"
            name="lastName"
            value={buyerData.lastName}
            onChange={handleChange}
            required
          />
        </div>

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

export default UpdateBuyer;