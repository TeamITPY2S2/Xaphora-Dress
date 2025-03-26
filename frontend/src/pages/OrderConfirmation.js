import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle } from 'react-icons/fa';

const OrderConfirmation = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/order-history');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8 text-center">
          <FaCheckCircle className="text-success" style={{ fontSize: '5rem' }} />
          <h2 className="mt-4">Order Confirmed!</h2>
          <p className="lead">Thank you for your purchase.</p>
          <p>Your order has been successfully placed.</p>
          <p>You will be redirected to your order history in a few seconds...</p>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation; 