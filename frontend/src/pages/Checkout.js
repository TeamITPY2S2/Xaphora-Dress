import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [formData, setFormData] = useState({
    address: '',
    city: '',
    postalCode: '',
    paymentMethod: 'card'
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:8070/api/cart', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCart(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch cart');
        setLoading(false);
      }
    };

    fetchCart();
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
      await axios.post('http://localhost:8070/api/orders', {
        items: cart.items,
        shippingAddress: formData,
        paymentMethod: formData.paymentMethod
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      navigate('/order-confirmation');
    } catch (err) {
      setError('Failed to place order');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!cart) return <div>Cart not found</div>;

  const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="container mt-5">
      <h2>Checkout</h2>
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h3 className="card-title">Shipping Information</h3>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Address</label>
                  <textarea
                    className="form-control"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-control"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Postal Code</label>
                  <input
                    type="text"
                    className="form-control"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Payment Method</label>
                  <select
                    className="form-select"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleChange}
                  >
                    <option value="card">Credit Card</option>
                    <option value="cash">Cash on Delivery</option>
                  </select>
                </div>
                <button type="submit" className="btn btn-primary">
                  Place Order
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h3 className="card-title">Order Summary</h3>
              {cart.items.map((item) => (
                <div key={item.productId} className="d-flex justify-content-between mb-2">
                  <span>{item.name} x {item.quantity}</span>
                  <span>Rs {item.price * item.quantity}</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total</strong>
                <strong>Rs {total}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout; 