// src/components/DeliveOrdersTable.js
import React, { useState, useEffect } from 'react';

const DeliveOrdersTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch orders from the backend
  const fetchOrders = async () => {
    try {
      const response = await fetch('http://localhost:8070/api/orders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders.');
      }
      const data = await response.json();
      setOrders(data);
      setLoading(false);
    } catch (err) {
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
      // Update the local state to reflect the new status
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error(err.message);
    }
  };

  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Orders</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Order ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Customer Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Shipping Region</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Created At</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Update Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order._id}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.customerName}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.shippingRegion}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{order.status}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {new Date(order.created_at).toLocaleString()}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <select
                  defaultValue={order.status}
                  onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                  style={{ padding: '5px' }}
                >
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
