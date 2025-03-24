import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SellerLogin from './components/SellerLogin';
import SellerSignup from './components/SellerSignup';
import './App.css';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  // Add your authentication logic here
  const isAuthenticated = localStorage.getItem('seller_token'); // You'll need to set this during login
  
  if (!isAuthenticated) {
    return <Navigate to="/seller/login" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes */}
          <Route path="/seller/login" element={<SellerLogin />} />
          <Route path="/seller/signup" element={<SellerSignup />} />
          
          {/* Protected seller routes */}
          <Route 
            path="/seller/dashboard/*" 
            element={
              <ProtectedRoute>
                <div>Dashboard will go here</div>
              </ProtectedRoute>
            } 
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/seller/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
