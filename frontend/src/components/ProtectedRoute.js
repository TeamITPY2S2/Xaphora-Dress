import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userType = localStorage.getItem('userType');

  if (!token) {
    // No token, redirect to login
    return <Navigate to="/login" replace />;
  }

  // Check if the user has the correct role for the route
  const path = window.location.pathname;
  
  if (path.startsWith('/admin') && userType !== 'admin' && userType !== 'super-admin') {
    return <Navigate to="/login" replace />;
  }
  
  if (path.startsWith('/superadmin') && userType !== 'super-admin') {
    return <Navigate to="/login" replace />;
  }
  
  if (path.startsWith('/admin-orders') && userType !== 'order-management' && userType !== 'super-admin') {
    return <Navigate to="/login" replace />;
  }

  // If all checks pass, render the protected content
  return children;
};

export default ProtectedRoute; 