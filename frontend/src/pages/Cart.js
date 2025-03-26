import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaTrash } from 'react-icons/fa';

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
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

  const handleUpdateQuantity = async (productId, newQuantity) => {
    try {
      const token = localStorage.getItem('token');
      const updatedItems = cart.items.map(item =>
        item.productId === productId
          ? { ...item, quantity: newQuantity }
          : item
      );

      await axios.put(`http://localhost:8070/api/cart/${cart._id}`, {
        items: updatedItems
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCart({ ...cart, items: updatedItems });
    } catch (err) {
      console.error('Error updating quantity:', err);
      alert('Failed to update quantity');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const updatedItems = cart.items.filter(item => item.productId !== productId);

      await axios.put(`http://localhost:8070/api/cart/${cart._id}`, {
        items: updatedItems
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setCart({ ...cart, items: updatedItems });
    } catch (err) {
      console.error('Error removing item:', err);
      alert('Failed to remove item');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!cart) return <div>Cart not found</div>;

  const total = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="container mt-5">
      <h2>Shopping Cart</h2>
      {cart.items.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {cart.items.map((item) => (
                  <tr key={item.productId}>
                    <td>{item.name}</td>
                    <td>Rs {item.price}</td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleUpdateQuantity(item.productId, parseInt(e.target.value))}
                        className="form-control"
                        style={{ width: '80px' }}
                      />
                    </td>
                    <td>Rs {item.price * item.quantity}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveItem(item.productId)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="text-end">
            <h4>Total: Rs {total}</h4>
            <button
              className="btn btn-primary"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart; 