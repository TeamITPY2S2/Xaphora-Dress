// src/pages/BuyerSignup.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function BuyerSignup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send signup request to the backend (ensure endpoint exists)
      const response = await fetch("/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password })
      });
      const data = await response.json();
      if (response.ok) {
        // Assuming the backend returns a token and sets userType as "buyer"
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", data.userType || "buyer");
        setMessage("Signup successful!");
        // Redirect to dashboard with the new buyer's details
        navigate("/dashboard");
      } else {
        setMessage(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Buyer Signup</h2>
      {message && <p style={{ color: "red" }}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>First Name</label>
        <br />
        <input
          type="text"
          required
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <br /><br />
        <label>Last Name</label>
        <br />
        <input
          type="text"
          required
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <br /><br />
        <label>Email</label>
        <br />
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br /><br />
        <label>Password</label>
        <br />
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <br /><br />
        <button type="submit">Sign Up</button>
      </form>
      <p style={{ marginTop: "10px" }}>
        Already registered? <Link to="/api/auth/login">Login here</Link>
      </p>
    </div>
  );
}

export default BuyerSignup;