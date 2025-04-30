// src/pages/AddAdmin.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddAdmin.css'; // Your existing styles

const BACKEND_URL = 'http://localhost:8070';

const AddAdmin = () => {
  const navigate = useNavigate();

  // form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    adminType: 'regular',
  });

  // per-field errors
  const [errors, setErrors] = useState({});
  // server or submission error
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  // simple email regexp
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const newErrors = {};

    // First name: required, letters only
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (!/^[A-Za-z]+$/.test(formData.firstName.trim())) {
      newErrors.firstName = 'First name must contain only letters';
    }

    // Last name: required, letters only
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (!/^[A-Za-z]+$/.test(formData.lastName.trim())) {
      newErrors.lastName = 'Last name must contain only letters';
    }

    // Email: required, valid format
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email address';
    }

    // Password: required, min length 8
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    // adminType: required (always present from select)

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // update field
    setFormData(prev => ({ ...prev, [name]: value }));
    // clear any existing error on this field
    setErrors(prev => ({ ...prev, [name]: undefined }));
    // clear server errors
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // run client-side validations
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await axios.post(`${BACKEND_URL}/api/admins`, formData);
      alert('Admin created successfully');
      navigate('/superadmin/admins');
    } catch (err) {
      console.error(err);
      setServerError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signupContainer">
      <div className="formCard">
        <h2 className="title">Add New Admin</h2>
        <form className="form" onSubmit={handleSubmit}>
          {serverError && (
            <div className="error">
              <p>{serverError}</p>
            </div>
          )}

          {/* First Name */}
          <div className="inputGroup">
            <label htmlFor="firstName" className="label">First Name</label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              className={`input ${errors.firstName ? 'inputError' : ''}`}
              placeholder="Enter admin's first name"
              value={formData.firstName}
              onChange={handleChange}
            />
            {errors.firstName && <p className="errorText">{errors.firstName}</p>}
          </div>

          {/* Last Name */}
          <div className="inputGroup">
            <label htmlFor="lastName" className="label">Last Name</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              className={`input ${errors.lastName ? 'inputError' : ''}`}
              placeholder="Enter admin's last name"
              value={formData.lastName}
              onChange={handleChange}
            />
            {errors.lastName && <p className="errorText">{errors.lastName}</p>}
          </div>

          {/* Email */}
          <div className="inputGroup">
            <label htmlFor="email" className="label">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              className={`input ${errors.email ? 'inputError' : ''}`}
              placeholder="Enter admin's email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="errorText">{errors.email}</p>}
          </div>

          {/* Password */}
          <div className="inputGroup">
            <label htmlFor="password" className="label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              className={`input ${errors.password ? 'inputError' : ''}`}
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="errorText">{errors.password}</p>}
          </div>

          {/* Admin Type */}
          <div className="inputGroup">
            <label htmlFor="adminType" className="label">Admin Type</label>
            <select
              id="adminType"
              name="adminType"
              className="input"
              value={formData.adminType}
              onChange={handleChange}
            >
              <option value="super-admin">Super Admin</option>
              <option value="delivery-management">Delivery Management</option>
              <option value="inventory-management">Inventory Management</option>
              <option value="order-management">Order Management</option>
              <option value="reviews-management">Reviews Management</option>
              <option value="user-management">User Management</option>
              <option value="regular">Regular</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="button">
            {loading ? (
              <span className="spinnerWrapper">
                <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating…
              </span>
            ) : (
              'Create Admin'
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p className="subtitle">
            Already added?{' '}
            <button onClick={() => navigate('/superadmin/admins')} className="link">
              View Admins
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddAdmin;