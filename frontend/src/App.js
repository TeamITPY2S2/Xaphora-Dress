import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SellerLogin from './components/SellerLogin';
import SellerSignup from './components/SellerSignup';
import './App.css';
// src/index.js
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Pages (ensure these files exist)
import AddProductPage from './pages/AddProductPage';
import ProductListPage from './pages/ProductListPage';
import EditProductPage from './pages/EditProductPage';
import SellerDashboard from './pages/SellerDashboard';
import Home from './pages/home';
import XaphoraChatbot from './pages/XaphoraChatbot'; 

import Login from "./pages/Login";
//import AdminDashboard from "./pages/AdminDashboard";
import Dashboard from "./pages/Dashboard";
import BuyerSignup from "./pages/BuyerSignup";
import SuperAdminDashboard from './pages/SuperAdminDashboard';

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
      <div className="app-container">
        {/* You can remove the Navbar reference if it's not needed */}
        <div className="content-container">
          <Routes>
            {/* For example, we make the Seller Dashboard the default route */}
            <Route path="/" element={<Home />} />
            <Route path="/add-product" element={<AddProductPage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/edit-product/:id" element={<EditProductPage />} />
            {/* Optionally, if you want a dedicated seller dashboard route */}
            <Route path="/seller-dashboard" element={<SellerDashboard />} />
            <Route path="/seller/login" element={<SellerLogin />} />
          <Route path="/seller/signup" element={<SellerSignup />} />

          <Route 
            path="/seller/dashboard/*" 
            element={
              <ProtectedRoute>
                <div>Dashboard will go here</div>
              </ProtectedRoute>
            } 
          />

            <Route path="/api/auth/login" element={<Login />} />
           {/*  <Route path="/admin/dashboard" element={<AdminDashboard />} /> */}
             <Route path="/dashboard" element={<Dashboard />} />
             <Route path="/signup" element={<BuyerSignup />} />
             <Route path="/superadmin" element={<SuperAdminDashboard />} />
            <Route path='/home'element = {<Home/>}/>
            <Route path = '/chatbot' element = {<XaphoraChatbot/>}/>
             <Route path='/seller-login' element ={<SellerLogin/>}/>
          </Routes>
        </div>
      </div>
    </Router>

  );
}

export default App;
