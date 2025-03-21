// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

// Pages
import Home from './pages/Home';
import AddProductPage from './pages/AddProductPage';
import ProductListPage from './pages/ProductListPage';
import EditProductPage from './pages/EditProductPage';
import SellerDashboard from './pages/SellerDashboard';

// Components
import Navbar from './components/Navbar';
import './App.css';

const AppContent = () => {
  const location = useLocation();
  // Hide Navbar on Seller Dashboard page
  const hideNavbar = location.pathname === '/seller-dashboard';

  return (
    <div className="app-container">
      {!hideNavbar && <Navbar />}
      <div className="content-container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add-product" element={<AddProductPage />} />
          <Route path="/products" element={<ProductListPage />} />
          <Route path="/edit-product/:id" element={<EditProductPage />} />
          <Route path="/seller-dashboard" element={<SellerDashboard />} />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
