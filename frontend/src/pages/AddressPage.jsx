import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import './AddressPage.css';

const AddressPage = () => {
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [formData, setFormData] = useState({
    contactName: '',
    phoneNumber: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    isDefault: false
  });

  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    fetchAddresses();
  }, [userId, navigate]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8070/api/address/user/${userId}`);
      setAddresses(response.data);
    } catch (err) {
      setError('Failed to fetch addresses');
      console.error('Error fetching addresses:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8070/api/address', {
        ...formData,
        userId
      });
      setAddresses([...addresses, response.data]);
      setIsAddingAddress(false);
      setFormData({
        contactName: '',
        phoneNumber: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        isDefault: false
      });
    } catch (err) {
      setError('Failed to add address');
      console.error('Error adding address:', err);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    
    try {
      await axios.delete(`http://localhost:8070/api/address/${addressId}`);
      setAddresses(addresses.filter(addr => addr._id !== addressId));
    } catch (err) {
      setError('Failed to delete address');
      console.error('Error deleting address:', err);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await axios.put(`http://localhost:8070/api/address/${addressId}/default`);
      setAddresses(addresses.map(addr => ({
        ...addr,
        isDefault: addr._id === addressId
      })));
    } catch (err) {
      setError('Failed to set default address');
      console.error('Error setting default address:', err);
    }
  };

  const formatAddress = (address) => {
    const parts = [
      address.addressLine1,
      address.addressLine2,
      `${address.city}, ${address.state} ${address.zipCode}`
    ].filter(Boolean);
    return parts.join(', ');
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="address-page">
          <div className="loading-message">Loading addresses...</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="address-page">
        <div className="address-header">
          <h1>My Addresses</h1>
          <button 
            className="add-address-btn"
            onClick={() => setIsAddingAddress(true)}
          >
            Add New Address
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        {isAddingAddress && (
          <div className="address-form-container">
            <h2>Add New Address</h2>
            <form onSubmit={handleAddAddress} className="address-form">
              <div className="form-group">
                <label>Contact Name</label>
                <input
                  type="text"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Address Line 1</label>
                <input
                  type="text"
                  name="addressLine1"
                  value={formData.addressLine1}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Address Line 2 (Optional)</label>
                <input
                  type="text"
                  name="addressLine2"
                  value={formData.addressLine2}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>State</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Zip Code</label>
                <input
                  type="text"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group checkbox">
                <label>
                  <input
                    type="checkbox"
                    name="isDefault"
                    checked={formData.isDefault}
                    onChange={handleInputChange}
                  />
                  Set as default address
                </label>
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">Save Address</button>
                <button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setIsAddingAddress(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="saved-addresses-section">
          <h2>Saved Addresses</h2>
          {addresses.length > 0 ? (
            <div className="addresses-grid">
              {addresses.map(address => (
                <div key={address._id} className="address-card">
                  {address.isDefault && (
                    <span className="default-badge">Default</span>
                  )}
                  <div className="address-content">
                    <div className="address-header-info">
                      <h3>{address.contactName}</h3>
                      <span className="phone-number">{address.phoneNumber}</span>
                    </div>
                    <div className="address-details">
                      <p className="address-text">{formatAddress(address)}</p>
                    </div>
                  </div>
                  <div className="address-actions">
                    {!address.isDefault && (
                      <button
                        className="set-default-btn"
                        onClick={() => handleSetDefault(address._id)}
                      >
                        Set as Default
                      </button>
                    )}
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteAddress(address._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-addresses">
              <p>You haven't added any addresses yet.</p>
              <button 
                className="add-first-address-btn"
                onClick={() => setIsAddingAddress(true)}
              >
                Add Your First Address
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AddressPage;