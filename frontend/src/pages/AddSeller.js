// src/pages/AddSeller.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getMessaging, getToken } from 'firebase/messaging';
import './AddSeller.css';

const BACKEND_URL = 'http://localhost:8070';

export default function AddSeller() {
  const navigate = useNavigate();

  // form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    storeName: '',
  });

  // validation errors per field
  const [errors, setErrors] = useState({});
  // server/submission error
  const [serverError, setServerError] = useState('');
  const [loading, setLoading] = useState(false);

  // simple email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // validate all fields
  const validate = () => {
    const newErrors = {};

    // Full Name: required, letters + spaces only
    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (!/^[A-Za-z ]+$/.test(formData.name.trim())) {
      newErrors.name = 'Name must contain only letters and spaces';
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

    // Store Name: required
    if (!formData.storeName.trim()) {
      newErrors.storeName = 'Store name is required';
    }

    return newErrors;
  };

  // get FCM token
  const getFCMToken = async () => {
    try {
      const messaging = getMessaging();
      const token = await getToken(messaging, {
        vapidKey:
          'BI4dyJq3nAjbdYTMoxTECj_mo0HdYYxeji4a-q5uiZHrq9Fapd-blaSGZTu9RCBDzob8M-WPnYt8f2xhjuFyT4',
      });
      return token;
    } catch (err) {
      console.error('FCM token error:', err);
      return null;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
    // clear field error
    setErrors(errs => ({ ...errs, [name]: undefined }));
    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    // client-side validation
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const fcmToken = await getFCMToken();
      await axios.post(
        `${BACKEND_URL}/api/sellers`,
        { ...formData, role: 'seller', fcmToken },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      alert('Seller created successfully');
      navigate('/superadmin/sellers');
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
        <h2 className="title">Add New Seller</h2>

        {serverError && <div className="error">{serverError}</div>}

        <form className="form" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="inputGroup">
            <label htmlFor="name" className="label">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              className={`input ${errors.name ? 'inputError' : ''}`}
              placeholder="Enter seller's full name"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && <p className="errorText">{errors.name}</p>}
          </div>

          {/* Email */}
          <div className="inputGroup">
            <label htmlFor="email" className="label">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              className={`input ${errors.email ? 'inputError' : ''}`}
              placeholder="Enter seller's email"
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

          {/* Store Name */}
          <div className="inputGroup">
            <label htmlFor="storeName" className="label">Store Name</label>
            <input
              id="storeName"
              name="storeName"
              type="text"
              className={`input ${errors.storeName ? 'inputError' : ''}`}
              placeholder="Enter seller's store name"
              value={formData.storeName}
              onChange={handleChange}
            />
            {errors.storeName && <p className="errorText">{errors.storeName}</p>}
          </div>

          <button type="submit" disabled={loading} className="button">
            {loading ? (
              <span className="spinnerWrapper">
                <svg
                  className="spinner"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  width="20"
                  height="20"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating…
              </span>
            ) : (
              'Create Seller'
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p className="subtitle">
            Already added?{' '}
            <button onClick={() => navigate('/superadmin/sellers')} className="link">
              View Sellers
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}