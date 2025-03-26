// src/pages/AddSeller.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getMessaging, getToken } from 'firebase/messaging';
import styles from './AddSeller.css';

// Define the backend URL (adjust if necessary)
const BACKEND_URL = 'http://localhost:8070';

const AddSeller = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    storeName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle input field changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Get the FCM token automatically using Firebase Messaging
  const getFCMToken = async () => {
    try {
      const messaging = getMessaging();
      const currentToken = await getToken(messaging, {
        // Replace with your actual VAPID key
        vapidKey: "BI4dyJq3nAjbdYTMoxTECj_mo0HdYYxeji4a-q5uiZHrq9Fapd-blaSGZTu9RCBDzobx8M-WPnYt8f2xhjuFyT4",
      });
      return currentToken;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Automatically generate FCM token
      const fcmToken = await getFCMToken();
      // Send a POST request to create a new seller with role "seller" and the FCM token
      const response = await axios.post(`${BACKEND_URL}/api/sellers`, {
        ...formData,
        role: 'seller',
        fcmToken,
      });

      if (response.data) {
        alert("Seller created successfully");
        navigate('/superadmin/sellers');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.signupContainer}>
      <div className={styles.formCard}>
        <h2 className={styles.title}>Add New Seller</h2>
        <p className={styles.subtitle}>Fill in the details below</p>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          {error && (
            <div className={styles.error}>
              <p>Error</p>
              <p>{error}</p>
            </div>
          )}
          
          <div className={styles.inputGroup}>
            <label htmlFor="name" className={styles.label}>
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className={styles.input}
              placeholder="Enter seller's full name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
    
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className={styles.input}
              placeholder="Enter seller's email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
    
          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className={styles.input}
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
    
          <div className={styles.inputGroup}>
            <label htmlFor="storeName" className={styles.label}>
              Store Name
            </label>
            <input
              id="storeName"
              name="storeName"
              type="text"
              required
              className={styles.input}
              placeholder="Enter seller's store name"
              value={formData.storeName}
              onChange={handleChange}
            />
          </div>
    
          <button
            type="submit"
            disabled={loading}
            className={styles.button}
          >
            {loading ? (
              <>
                <svg className={styles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </>
            ) : (
              'Create Seller'
            )}
          </button>
        </form>
    
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p className={styles.subtitle}>
            Already added?{' '}
            <button
              onClick={() => navigate('/superadmin/sellers')}
              className={styles.link}
            >
              View Sellers
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddSeller;