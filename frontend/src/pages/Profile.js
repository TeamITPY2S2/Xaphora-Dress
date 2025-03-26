import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: ''
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:8070/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        setFormData({
          ...formData,
          name: response.data.name,
          email: response.data.email
        });
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user profile');
        setLoading(false);
      }
    };

    fetchUser();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.put('http://localhost:8070/api/users/profile', {
        name: formData.name,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Profile updated successfully');
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: ''
      });
    } catch (err) {
      setError('Failed to update profile');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Profile</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    disabled
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Update Profile
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile; 