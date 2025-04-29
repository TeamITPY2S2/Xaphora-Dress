// src/pages/AdminDashboardPage.js
import React, { useState, useEffect } from 'react';
import AdminDashboard from '../components/AdminDashboard';

const AdminDashboardPage = () => {
  // State management
  const [orders, setOrders] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all');
  const [filteredOrders, setFilteredOrders] = useState([]);

  // Helper functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateTotal = (items) => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedOrders = orders.map(order => 
          order._id === orderId ? { ...order, status: newStatus } : order
        );
        setOrders(updatedOrders);
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('/api/orders');
        const data = await response.json();
        setOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  }, []);

  // Filter orders when filterStatus changes
  useEffect(() => {
    const filtered = filterStatus === 'all' 
      ? orders 
      : orders.filter(order => order.status === filterStatus);
    setFilteredOrders(filtered);
  }, [filterStatus, orders]);

  return (
    <div className="admin-dashboard">
      <h1>Order Management Dashboard</h1>
      
      <div className="dashboard-controls">
        <div className="filter-controls">
          <label>Filter by Status:</label>
          <select 
            value={filterStatus} 
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="orders-list">
        {filteredOrders.map(order => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <h3>Order #{order._id.slice(-6)}</h3>
              <span className={`status-badge ${order.status}`}>
                {order.status}
              </span>
            </div>

            <div className="order-details">
              <div className="customer-info">
                <h4>Customer Information</h4>
                <p>Name: {order.shippingAddress.fullName}</p>
                <p>Email: {order.user.email}</p>
                <p>Phone: {order.shippingAddress.phone}</p>
                <p>Address: {order.shippingAddress.address}</p>
              </div>

              <div className="order-items">
                <h4>Order Items</h4>
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img src={item.imageUrl} alt={item.name} />
                    <div className="item-details">
                      <p>{item.name}</p>
                      <p>Size: {item.size}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: Rs. {item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-summary">
                <h4>Order Summary</h4>
                <p>Order Date: {formatDate(order.createdAt)}</p>
                <p>Payment Method: {order.paymentMethod}</p>
                <p>Total Amount: Rs. {calculateTotal(order.items)}</p>
              </div>
            </div>

            <div className="order-actions">
              <select
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
