// src/pages/AddBuyer.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddBuyer.css";

function AddBuyer() {
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8070/users", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          email,
          firstName,
          lastName,
          password,
          role: "buyer" // explicitly set role as buyer
        })
      });
      const data = await res.json();
      if (res.ok) {
        alert("Buyer created successfully");
        navigate("/superadmin/buyers");
      } else {
        setMessage(data.message || "Failed to create buyer");
      }
    } catch (error) {
      console.error("Error creating buyer:", error);
      setMessage("Error creating buyer");
    }
  };

  const handleBack = () => {
    navigate("/superadmin/buyers");
  };

  return (
    <div className="add-buyer-container">
      <button onClick={handleBack} className="back-button">Back</button>
      <h2>Add New Buyer</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}

      <form onSubmit={handleSubmit} className="add-buyer-form">
        <label>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>First Name</label>
        <input
          type="text"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />

        <label>Last Name</label>
        <input
          type="text"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />

        <label>Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" className="create-buyer-button">Create Buyer</button>
      </form>
    </div>
  );
}

export default AddBuyer;