import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getMessaging, getToken } from 'firebase/messaging';
import styles from './SellerLogin.module.css';

// Define the backend URL
const BACKEND_URL = 'http://localhost:8070';

const SellerLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getFCMToken = async () => {
    try {
      const messaging = getMessaging();
      const currentToken = await getToken(messaging, {
        vapidKey: "BI4dyJq3nAjbdYTMoxTECj_mo0HdYYxeji4a-q5uiZHrq9Fapd-blaSGZTu9RCBDzobx8M-WPnYt8f2xhjuFyT4",
      });
      return currentToken;
    } catch (error) {
      console.error('Error getting FCM token:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // First, get the seller by email
      const sellerResponse = await axios.get(`${BACKEND_URL}/api/sellers?email=${formData.email}`);
      const seller = sellerResponse.data.find(s => s.email === formData.email);

      if (!seller) {
        throw new Error('Invalid email or password');
      }

      // Update the seller's FCM token
      const fcmToken = await getFCMToken();
      if (fcmToken) {
        await axios.put(`${BACKEND_URL}/api/sellers/${seller._id}`, {
          fcmToken,
        });
      }

      // Store the authentication token
      localStorage.setItem('seller_token', 'your_jwt_token_here'); // Replace with actual JWT token
      localStorage.setItem('seller_id', seller._id);

      // Navigate to dashboard
      navigate('/seller-dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.formCard}>
        <h2 className={styles.title}>Welcome Back!</h2>
        <p className={styles.subtitle}>Sign in to manage your store</p>
        
        <form className={styles.form} onSubmit={handleSubmit}>
          {error && (
            <div className={styles.error}>
              <p>Error</p>
              <p>{error}</p>
            </div>
          )}
          
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
              placeholder="Enter your email"
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
              placeholder="Enter your password"
              value={formData.password}
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
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p className={styles.subtitle}>
            Don't have an account?{' '}
            <button
              onClick={() => navigate('/seller/signup')}
              className={styles.link}
            >
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerLogin; 