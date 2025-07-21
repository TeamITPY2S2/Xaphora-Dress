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
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No token found. Please login.");
      return;
    }
    fetchBuyer(token);
  }, [buyerId]);

  
 const fetchBuyer = async (token) => {
  try {
    console.log(`DEBUG: Fetching buyer data for buyerId: ${buyerId}`);

    const res = await fetch(`http://localhost:8070/api/users/${buyerId}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    console.log("DEBUG: Response from server:", data);

    if (res.ok) {
      const user = data.user || data;

      setBuyerData({
        email: user.email || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
      });
    } else {
      setMessage(data.message || "Error fetching buyer");
    }
  } catch (err) {
    console.error("Error fetching buyer:", err);
    setMessage(
      err.message.startsWith("<")
        ? "Server returned HTML instead of JSON. Check your URL."
        : err.message
    );
  }
};

  const handleChange = (e) =>
    setBuyerData({ ...buyerData, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setMessage("No token found. Please login.");
      return;
    }

    try {

      const res = await fetch(`http://localhost:8070/api/users/${buyerId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(buyerData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Error updating buyer");
      navigate("/superadmin/buyers");
    } catch (err) {
      console.error("Error updating buyer:", err);
      setMessage(err.message);
    }
  };

  const handleBack = () => navigate("/superadmin/buyers");

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
          <button
            type="button"
            className="back-button"
            onClick={handleBack}
          >
            Back
          </button>
        </div>
      </form>
    </div>
  );
}

export default UpdateBuyer;
