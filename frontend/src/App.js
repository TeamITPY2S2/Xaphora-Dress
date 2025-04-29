// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import AdminDashboard from './pages/AdminDashboard';
import AddDeliveryAgent from './pages/addDeliveryAgent';
import ViewAgents from './pages/ViewAgents';
import AssignOrderPage from './pages/AssignOrderPage';
import Login from './pages/Login';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Pages
import AddProductPage from './pages/AddProductPage';
import ProductListPage from './pages/ProductListPage';
import EditProductPage from './pages/EditProductPage';
import SellerDashboard from './pages/SellerDashboard';
import ViewDeliveOrderDetails from './pages/ViewDeliveOrderDetails';
import UserOrderDetails from './pages/UserOrderDetails';
import DeliveOrdersTable from './components/DeliveOrdersTable';
import Home from './pages/home';
import XaphoraChatbot from './pages/XaphoraChatbot';
import BuyerSignup from './pages/BuyerSignup';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import AdminsList from './pages/AdminsList';
import AddAdmin from './pages/AddAdmin';
import UpdateAdmin from './pages/UpdateAdmin';
import BuyersList from './pages/BuyersList';
import UpdateBuyer from './pages/UpdateBuyer';
import AddBuyer from './pages/AddBuyer';
import SellersList from './pages/SellersList';
import UpdateSeller from './pages/UpdateSeller';
import AddSeller from './pages/AddSeller';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes */}
        <Route path="/admin-dashboard" element={<Layout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="addDeliveryAgent" element={<AddDeliveryAgent />} />
          <Route path="agents" element={<ViewAgents />} />
          <Route path="assign-orders" element={<AssignOrderPage />} />
          <Route path="order" element={<DeliveOrdersTable />} />
        </Route>

        {/* Order Details Routes */}
        <Route path="/order/:orderId" element={<UserOrderDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
