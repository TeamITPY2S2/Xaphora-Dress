// src/pages/BuyerSignup.js
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./BuyerSignup.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function BuyerSignup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [message, setMessage]     = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Single fetch call to your signup endpoint:
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userType", data.userType || "buyer");
        setMessage("Signup successful!");
        // Navigate to your client-side login route:
        navigate("/login");
      } else {
        setMessage(data.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="signup-container">
        <h2 className="signup-title">Buyer Signup</h2>
        {message && <p className="signup-message">{message}</p>}
        <form className="signup-form" onSubmit={handleSubmit}>
          {/* firstName, lastName, email, password inputs */}
          <button type="submit" className="signup-button">Sign Up</button>
        </form>
        <p className="signup-footer">
          Already registered?{" "}
          <Link to="/login" className="signup-link">Login here</Link>
        </p>
        <p className="login-footer">
          <Link to="/seller/signup" className="login-link">
            Signup as a <b>Seller</b>
          </Link>
        </p>
      </div>
      <Footer />
    </>
  );
}

export default BuyerSignup;