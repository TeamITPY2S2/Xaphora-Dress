import React, { useState, useEffect } from 'react';

const DeliveOrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <p>Loading orders...</p>
    </div>
  );
  
  if (error) return (
    <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
      <p>Error: {error}</p>
      <button 
        onClick={fetchOrders}
        style={{
          padding: '8px 16px',
          marginTop: '10px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Retry
      </button>
    </div>
  );

  if (!orders || orders.length === 0) return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <p>No orders found.</p>
    </div>
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Orders</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f4f4f4' }}>Order ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f4f4f4' }}>Customer Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f4f4f4' }}>Shipping Region</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f4f4f4' }}>Status</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f4f4f4' }}>Created At</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', backgroundColor: '#f4f4f4' }}>Update Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order._id}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.customerName}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.shippingAddress?.state || 'Unknown'}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <span style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  backgroundColor: 
                    order.status === 'Delivered' ? '#4CAF50' :
                    order.status === 'Shipped' ? '#2196F3' :
                    order.status === 'Packed' ? '#FF9800' :
                    order.status === 'Ordered' ? '#9E9E9E' :
                    '#E91E63', // Pink color for Processing
                  color: 'white'
                }}>
                  {order.status}
                </span>
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {new Date(order.createdAt || order.created_at).toLocaleString()}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <select
                  value={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  style={{ 
                    padding: '5px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
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
    </div>
  );
};

export default DeliveOrdersTable;
