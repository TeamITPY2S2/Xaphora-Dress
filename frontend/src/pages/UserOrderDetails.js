// src/pages/UserOrderDetails.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const UserOrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await fetch(`http://localhost:8070/api/orders/${orderId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }
        const data = await response.json();
        console.log(data)
        setOrder(data);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (error) {
    return <p style={{ color: 'red' }}>Error: {error}</p>;
  }

  if (!order) {
    return <p>Loading order details...</p>;
  }

  // Example statuses array for your timeline
  const statuses = ['Ordered', 'Packed', 'Shipped', 'Delivered'];
  const currentIndex = statuses.indexOf(order.status);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Order Details (Order #{orderId})</h2>

      {/* Timeline / Status Bar */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        {statuses.map((status, idx) => {
          const isActive = idx <= currentIndex;
          return (
            <React.Fragment key={status}>
              <div style={{ textAlign: 'center', width: '100px' }}>
                <div
                  style={{
                    backgroundColor: isActive ? 'green' : '#ccc',
                    color: '#fff',
                    borderRadius: '50%',
                    width: '30px',
                    height: '30px',
                    margin: '0 auto',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {idx + 1}
                </div>
                <p style={{ marginTop: '5px', color: isActive ? 'green' : '#666' }}>
                  {status}
                </p>
                {/* Show placedDate if relevant */}
                {idx === 0 && isActive && (
                  <p style={{ fontSize: '12px', color: '#444' }}>
                    {new Date(order.placedDate).toLocaleString()}
                  </p>
                )}
              </div>
              {idx < statuses.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: '2px',
                    backgroundColor: idx < currentIndex ? 'green' : '#ccc',
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Delivery Details */}
      <div style={{ marginBottom: '20px' }}>
        <h3>Delivery Information</h3>
        <p><strong>Customer Name:</strong> {order.customerName}</p>
        <p><strong>Shipping Address:</strong> {order.shippingAddress}</p>
        <p><strong>Order Status:</strong> {order.status}</p>
        <p><strong>Payment Status:</strong> {order.paymentStatus}</p>
        <p><strong>Total Amount:</strong> ${order.totalAmount?.toFixed(2)}</p>
      </div>

      {/* Items List */}
      {order.items && order.items.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Order Items</h3>
          <ul>
            {order.items.map((item, idx) => (
              <li key={idx} style={{ marginBottom: '5px' }}>
                <strong>Product ID:</strong> {item.shippingRegion} |{' '}
                <strong>Quantity:</strong> {item.quantity} |{' '}
                <strong>Price:</strong> ${item.price}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserOrderDetails;
