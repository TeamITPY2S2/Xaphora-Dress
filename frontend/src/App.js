// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import SellerLogin from './components/SellerLogin';
import SellerSignup from './components/SellerSignup';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Pages
import AddProductPage from './pages/AddProductPage';
import ProductListPage from './pages/ProductListPage';
import EditProductPage from './pages/EditProductPage';
import SellerDashboard from './pages/SellerDashboard';
import Home from './pages/home';
import XaphoraChatbot from './pages/XaphoraChatbot'; 
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import BuyerSignup from "./pages/BuyerSignup";
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AdminsList from "./pages/AdminsList";
import AddAdmin from "./pages/AddAdmin";
import UpdateAdmin from "./pages/UpdateAdmin";
import BuyersList from './pages/BuyersList';
import UpdateBuyer from './pages/UpdateBuyer';
import AddBuyer from './pages/AddBuyer';
import Signin from './pages/Signin';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import ItemProfile from './pages/ItemProfile';
import AddFinancial from './pages/AddItem';
import UpdateItem from './pages/UpdateItem'

// Example protected route
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('seller_token');
  if (!isAuthenticated) {
    return <Navigate to="/seller/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/buyer-signup" element={<BuyerSignup />} />
            <Route path="/super-admin-dashboard" element={<SuperAdminDashboard />} />
            <Route path="/admins-list" element={<AdminsList />} />
            <Route path="/add-admin" element={<AddAdmin />} />
            <Route path="/update-admin/:id" element={<UpdateAdmin />} />
            <Route path="/buyers-list" element={<BuyersList />} />
            <Route path="/update-buyer/:id" element={<UpdateBuyer />} />
            <Route path="/add-buyer" element={<AddBuyer />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/sign-in" element={<Signin />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/itemprofile" element={<ItemProfile />} />
            <Route path="/add-item" element={<AddFinancial />} />
            <Route path="/update-item/:id" element={<UpdateItem />} />
            <Route path="/chatbot" element={<XaphoraChatbot />} />
            <Route path="/seller-login" element={<SellerLogin />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;