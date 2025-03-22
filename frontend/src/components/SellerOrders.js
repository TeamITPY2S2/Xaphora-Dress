// src/components/SellerOrders.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SellerOrders.css';

function SellerOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Fetch orders from backend (adjust endpoint as needed)
    axios.get('http://localhost:8070/api/orders')
      .then(response => {
        setOrders(response.data);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  }, []);

  return (
    <div className="seller-orders">
      <h2>Order List</h2>
      {orders.length > 0 ? (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total Amount</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.customerName}</td>
                <td>${order.totalAmount}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}

export default SellerOrders;
