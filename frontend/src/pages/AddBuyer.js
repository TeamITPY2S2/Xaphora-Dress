// src/pages/AddBuyer.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SuperAdminSidebar from "../components/SuperAdminSidebar";

import "./AdminsList.css";
import "./AddBuyer.css";

const BACKEND_URL = "http://localhost:8070/api";

export default function AddBuyer() {
  const navigate = useNavigate();

  // existing buyers (for summary)
  const [buyers, setBuyers] = useState([]);

  // form data
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  // per-field validation errors
  const [errors, setErrors] = useState({});
  // server or submission error
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  // fetch existing buyers for summary
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${BACKEND_URL}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const onlyBuyers = res.data.users.filter((u) => u.role === "buyer");
        setBuyers(onlyBuyers);
      } catch (err) {
        console.error("Error fetching buyers", err);
      }
    })();
  }, []);

  // simple email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // validate all fields, return an object of { field: message }
  const validate = () => {
    const newErrors = {};

    // firstName
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (!/^[A-Za-z]+$/.test(formData.firstName.trim())) {
      newErrors.firstName = "First name must be letters only";
    }

    // lastName
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (!/^[A-Za-z]+$/.test(formData.lastName.trim())) {
      newErrors.lastName = "Last name must be letters only";
    }

    // email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    // password
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
    // clear any existing error on this field
    setErrors((prev) => ({ ...prev, [name]: undefined }));
    setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    // run validation
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${BACKEND_URL}/users`,
        { ...formData, role: "buyer" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Buyer added!");
      navigate("/superadmin/buyers");
    } catch (err) {
      setServerError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="superadmin-layout">
      <SuperAdminSidebar />

      <main className="superadmin-main">
        <div className="add-buyer-content">
          <form className="formCard" onSubmit={handleSubmit}>
            <h2 className="title">Add New Buyer</h2><br />

            {serverError && <div className="error">{serverError}</div>}

            {/* First Name */}
            <div className="inputGroup">
              <label>First Name</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter buyer's first name"
              />
              {errors.firstName && (
                <p className="errorText">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="inputGroup">
              <label>Last Name</label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter buyer's last name"
              />
              {errors.lastName && (
                <p className="errorText">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div className="inputGroup">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter buyer's email"
              />
              {errors.email && <p className="errorText">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="inputGroup">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
              />
              {errors.password && (
                <p className="errorText">{errors.password}</p>
              )}
            </div>

            <button type="submit" className="button" disabled={loading}>
              {loading ? "Creating..." : "Create Buyer"}
            </button>
          </form>

          <div className="buyers-summary">
            <h3>📊 Total Buyers: {buyers.length}</h3>
            <ol>
              {buyers.map((b) => (
                <li key={b._id}>
                  {b.firstName} {b.lastName}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
}