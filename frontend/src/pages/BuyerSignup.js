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
  const [errors, setErrors]       = useState({});
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};

    // First Name validation
    if (!firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (!/^[A-Za-z]+$/.test(firstName.trim())) {
      newErrors.firstName = "First name can only contain letters";
    }

    // Last Name validation
    if (!lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (!/^[A-Za-z]+$/.test(lastName.trim())) {
      newErrors.lastName = "Last name can only contain letters";
    }

    // Email validation
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      newErrors.email = "Email is not valid";
    }

    // Password validation (min 8 chars, at least one number and one special symbol)
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/\d/.test(password)) {
      newErrors.password = "Password must include at least one number";
    } else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
      newErrors.password = "Password must include at least one special character";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
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
        navigate("/api/auth/login");
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

        <form className="signup-form" onSubmit={handleSubmit} noValidate>
          <label className="signup-label">First Name</label>
          <input
            type="text"
            className={`signup-input ${errors.firstName ? 'invalid' : ''}`}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          {errors.firstName && <span className="error-text">{errors.firstName}</span>}

          <label className="signup-label">Last Name</label>
          <input
            type="text"
            className={`signup-input ${errors.lastName ? 'invalid' : ''}`}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
          {errors.lastName && <span className="error-text">{errors.lastName}</span>}

          <label className="signup-label">Email</label>
          <input
            type="email"
            className={`signup-input ${errors.email ? 'invalid' : ''}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="error-text">{errors.email}</span>}

          <label className="signup-label">Password</label>
          <input
            type="password"
            className={`signup-input ${errors.password ? 'invalid' : ''}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span className="error-text">{errors.password}</span>}

          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>

        <p className="signup-footer">
          Already registered?{' '}
          <Link to="/api/auth/login" className="signup-link">
            Login here
          </Link>
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
