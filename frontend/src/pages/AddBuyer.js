import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddBuyer.css'; // Regular CSS import

// Define the backend URL (adjust if necessary)
const BACKEND_URL = 'http://localhost:8070';

const AddBuyer = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // POST request to create a new buyer (role = "buyer")
      const response = await axios.post(`${BACKEND_URL}/users`, {
        ...formData,
        role: 'buyer',
      });

      if (response.data) {
        alert('Buyer created successfully');
        navigate('/superadmin/buyers');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signupContainer">
      <div className="formCard">
        <h2 className="title">Add New Buyer</h2>
        <p className="subtitle">Fill in the details below</p>
        
        <form className="form" onSubmit={handleSubmit}>
          {error && (
            <div className="error">
              <p>Error</p>
              <p>{error}</p>
            </div>
          )}

          <div className="inputGroup">
            <label htmlFor="firstName" className="label">
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              required
              className="input"
              placeholder="Enter buyer's first name"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label htmlFor="lastName" className="label">
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              required
              className="input"
              placeholder="Enter buyer's last name"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label htmlFor="email" className="label">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input"
              placeholder="Enter buyer's email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="inputGroup">
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="input"
              placeholder="Create a password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="button"
          >
            {loading ? (
              <>
                <svg className="spinner" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Creating account...
              </>
            ) : (
              'Create Buyer'
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <p className="subtitle">
            Already added?{' '}
            <button
              onClick={() => navigate('/superadmin/buyers')}
              className="link"
            >
              View Buyers
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddBuyer;