import React, { useState, useEffect } from 'react';
import './DeliveOrdersTable.css';

const DeliveOrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');  // New state for search

  // Fetch orders 
  const fetchOrders = async () => {
    try {
      console.log('Fetching orders...'); // Added for debugging
      const response = await fetch('http://localhost:8070/api/orders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders.');
      }
      const data = await response.json();
      console.log('Orders received:', data); // Added for debugging
      setOrders(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching orders:', err); // Added for debugging
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filter orders based on search query
  const filteredOrders = orders.filter(order => 
    order._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8070/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) {
        throw new Error('Failed to update order status.');
      }
      
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error('Error updating order status:', err);
      alert('Failed to update order status: ' + err.message);
    }
  };

  if (loading) return (
    <div className="loading">Loading orders...</div>
  );
  
  if (error) return (
    <div className="error">
      <p>Error: {error}</p>
      <button className="retry-button" onClick={fetchOrders}>
        Retry
      </button>
    </div>
  );

  if (!orders || orders.length === 0) return (
    <div className="no-results">
      <p>No orders found.</p>
    </div>
  );

  return (
    <div className="orders-container">
      <h2>Orders</h2>
      
      {/* Search Bar */}
      <div className="search-container">
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search by Order ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        {searchQuery && (
          <button
            className="clear-button"
            onClick={() => setSearchQuery('')}
          >
            Clear
          </button>
        )}
      </div>

      {filteredOrders.length === 0 ? (
        <div className="no-results">
          No orders found matching your search.
        </div>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Shipping Region</th>
              <th>Status</th>
              <th>Created At</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.customerName}</td>
                <td>{order.shippingRegion}</td>
                <td>
                  <span className={`status-badge ${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </td>
                <td>{new Date(order.createdAt || order.created_at).toLocaleString()}</td>
                <td>
                  <select
                    className="status-select"
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  >
                    <option value="Processing">Processing</option>
                    <option value="Ordered">Ordered</option>
                    <option value="Packed">Packed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default DeliveOrdersTable;
