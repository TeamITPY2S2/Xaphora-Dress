import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const OrderHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:8070/api/orders', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch orders');
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="container mt-5">
      <h2>Order History</h2>
      {orders.length === 0 ? (
        <p>No orders found</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  <td>Rs {order.total}</td>
                  <td>
                    <span className={`badge bg-${order.status === 'completed' ? 'success' : 'warning'}`}>
                      {order.status}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => navigate(`/order/${order._id}`)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistory; 