import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaHeart } from 'react-icons/fa';

const Wishlist = () => {
  const navigate = useNavigate();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:8070/api/wishlist', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWishlist(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch wishlist');
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [navigate]);

  const handleRemoveFromWishlist = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:8070/api/wishlist/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setWishlist(wishlist.filter(item => item._id !== productId));
    } catch (err) {
      console.error('Error removing from wishlist:', err);
      alert('Failed to remove from wishlist');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-5">
      <h2>My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty</p>
      ) : (
        <div className="row">
          {wishlist.map((item) => (
            <div key={item._id} className="col-md-4 mb-4">
              <div className="card">
                <img
                  src={item.image}
                  alt={item.name}
                  className="card-img-top"
                />
                <div className="card-body">
                  <h5 className="card-title">{item.name}</h5>
                  <p className="card-text">Rs {item.price}</p>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleRemoveFromWishlist(item._id)}
                  >
                    <FaHeart /> Remove from Wishlist
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist; 