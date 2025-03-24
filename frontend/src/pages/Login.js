// src/pages/Login.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Adjust the URL if you are not using a proxy in package.json
      const response = await fetch("http://localhost:8070/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage("Login successful!");
        // Save the JWT token to localStorage for future requests
        localStorage.setItem("token", data.token);
        
        // Redirect based on userType returned by your backend
        if (data.userType === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        // Show error message returned from the server
        setMessage(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "20px" }}>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label><br />
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </div>
        <div style={{ marginTop: "15px" }}>
          <label htmlFor="password">Password:</label><br />
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </div>
        <div style={{ marginTop: "20px" }}>
          <button type="submit" style={{ padding: "10px 20px" }}>Login</button>
        </div>
      </form>
      {message && (
        <div style={{ marginTop: "10px", color: "red" }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default Login;