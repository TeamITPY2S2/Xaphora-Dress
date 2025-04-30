import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Components
import SellerLogin from './components/SellerLogin';
import SellerSignup from './components/SellerSignup';
import AdminSidebar from './components/AdminSidebar';
import DeliveOrdersTable from './components/DeliveOrdersTable';
import Layout from './components/Layout';

// Pages
import Home from './pages/home';
import XaphoraChatbot from './pages/XaphoraChatbot';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
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
import UpdateBuyerProfile from './pages/UpdateBuyerProfile';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import ChangePassword from './pages/ChangePassword';
import AddProductPage from './pages/AddProductPage';
import ProductListPage from './pages/ProductListPage';
import ProductDetail from './pages/ProductDetail';
import EditProductPage from './pages/EditProductPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentPage from './pages/PaymentPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import OrdersPage from './pages/OrdersPage';
import CardInfoPage from './pages/CardInfoPage';
import SellerDashboard from './pages/SellerDashboard';
import AddDeliveryAgent from './pages/addDeliveryAgent';
import AdminDashboard from './pages/AdminDashboard';
import ViewDeliveOrderDetails from './pages/ViewDeliveOrderDetails';
import UserOrderDetails from './pages/UserOrderDetails';
import ViewAgents from './pages/ViewAgents';
import UpdateDeliveryAgent from './pages/UpdateDeliveryAgent';
import AssignOrderPage from './pages/AssignOrderPage';
import AdminOrdersDashboard from './pages/AdminOrdersDashboard';
import AdminViewOrderDetails from './pages/AdminViewOrderDetails';
import AddressPage from './pages/AddressPage';


function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/chatbot" element={<XaphoraChatbot />} />
        <Route path="/api/auth/login" element={<Login />} />
        <Route path="/login" element={<Navigate to="/api/auth/login" replace />} />
        <Route path="/signup" element={<BuyerSignup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />

        {/* Buyer Routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/update-profile" element={<UpdateBuyerProfile />} />
        <Route path="/address" element={<AddressPage />} />

        {/* Product Routes */}
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/add-product" element={<AddProductPage />} />
        <Route path="/edit-product/:id" element={<EditProductPage />} />

        {/* Cart and Orders */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
        <Route path="/my-orders" element={<OrdersPage />} />
        <Route path="/cardinfo" element={<CardInfoPage />} />

        {/* Seller Routes */}
        <Route path="/seller/login" element={<SellerLogin />} />
        <Route path="/seller/signup" element={<SellerSignup />} />
        <Route path="/seller-dashboard" element={<SellerDashboard />} />

        {/* Admin Dashboard Routes */}
        <Route path="/admin-dashboard" element={<Layout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="addDeliveryAgent" element={<AddDeliveryAgent />} />
          <Route path="agents" element={<ViewAgents />} />
          <Route path="assign-orders" element={<AssignOrderPage />} />
          <Route path="order" element={<DeliveOrdersTable />} />
        </Route>

        {/* SuperAdmin Routes */}
        <Route path="/superadmin" element={<SuperAdminDashboard />} />
        <Route path="/superadmin/admins" element={<AdminsList />} />
        <Route path="/superadmin/add-admin" element={<AddAdmin />} />
        <Route path="/superadmin/update-admin/:adminId" element={<UpdateAdmin />} />
        <Route path="/superadmin/buyers" element={<BuyersList />} />
        <Route path="/superadmin/add-buyer" element={<AddBuyer />} />
        <Route path="/superadmin/update-buyer/:buyerId" element={<UpdateBuyer />} />
        <Route path="/superadmin/sellers" element={<SellersList />} />
        <Route path="/superadmin/add-seller" element={<AddSeller />} />
        <Route path="/superadmin/update-seller/:sellerId" element={<UpdateSeller />} />

        {/* Order Management Admin Routes */}
        <Route path="/admin-orders" element={<AdminOrdersDashboard />} />
        <Route path="/api/admin/orders/:orderId" element={<AdminViewOrderDetails />} />

        {/* Order Details Routes */}
        <Route path="/order/:orderId" element={<UserOrderDetails />} />
        <Route path="/vieworder/:orderId" element={<ViewDeliveOrderDetails />} />
        <Route path="/UpdateDeliveryAgent/:agentId" element={<UpdateDeliveryAgent />} />
      </Routes>
    </Router>
  );
}

export default App;
