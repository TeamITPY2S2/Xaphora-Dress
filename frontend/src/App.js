
// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';
// src/index.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Pages (ensure these files exist)
import AddProductPage from './pages/AddProductPage';
import ProductListPage from './pages/ProductListPage';
import EditProductPage from './pages/EditProductPage';
import SellerDashboard from './pages/SellerDashboard';

import Login from "./pages/Login";
//import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import BuyerSignup from "./pages/BuyerSignup";
import SuperAdminDashboard from './pages/SuperAdminDashboard';

function App() {
  return (

    <Router>
      <div className="app-container">
        {/* You can remove the Navbar reference if it's not needed */}
        <div className="content-container">
          <Routes>
            {/* For example, we make the Seller Dashboard the default route */}
            <Route path="/" element={<SellerDashboard />} />
            <Route path="/add-product" element={<AddProductPage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/edit-product/:id" element={<EditProductPage />} />
            {/* Optionally, if you want a dedicated seller dashboard route */}
            <Route path="/seller-dashboard" element={<SellerDashboard />} />


            <Route path="/api/auth/login" element={<Login />} />
           {/*  <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
             <Route path="/dashboard" element={<Dashboard />} />
             <Route path="/signup" element={<BuyerSignup />} />
             <Route path="/superadmin" element={<SuperAdminDashboard />} />
          </Routes>
        </div>
      </div>
    </Router>

  );
}

export default App;
