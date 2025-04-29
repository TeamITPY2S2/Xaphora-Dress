
// src/pages/AdminDashboardPage.js
import React from 'react';
import AdminDashboard from '../components/AdminDashboard';

const AdminDashboardPage = () => {
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
}

export default AdminDashboard;
