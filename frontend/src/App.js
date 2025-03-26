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
import AddDeliveryAgent from './pages/addDeliveryAgent';
import AdminDashboard from './pages/AdminDashboard';
import ViewDeliveOrderDetails from './pages/ViewDeliveOrderDetails';
import ViewAgents from './pages/ViewAgents';
import UpdateDeliveryAgent from './pages/UpdateDeliveryAgent';
import DeliveOrdersTable from './components/DeliveOrdersTable';
import UserOrderDetails from './pages/UserOrderDetails';

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
import SellersList from "./pages/SellersList";
import UpdateSeller from './pages/UpdateSeller';
import AddSeller from './pages/AddSeller';
import CategoryProducts from './pages/CategoryProducts';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Register from './pages/Register';
import Wishlist from './pages/Wishlist';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import OrderHistory from './pages/OrderHistory';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Logout from './pages/Logout';
import NotFound from './pages/NotFound';
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

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
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/category/:categoryId" element={
              <PrivateRoute>
                <CategoryProducts />
              </PrivateRoute>
            } />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/order-history" element={<OrderHistory />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="*" element={<NotFound />} />

            {/* Seller product routes */}
            <Route path="/add-product" element={<AddProductPage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/edit-product/:id" element={<EditProductPage />} />

            {/* Seller login & signup */}
            <Route path="/seller-dashboard" element={<SellerDashboard />} />
            <Route path="/addDeliveryAgent" element={<AddDeliveryAgent />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/vieworder/:orderId" element={<ViewDeliveOrderDetails />} />
            <Route path="/Order" element={<DeliveOrdersTable />} />
            <Route path="/agents" element={<ViewAgents />} />
            {/* Updated route: now matches the URL pattern used in ViewAgents.js */}
            <Route path="/UpdateDeliveryAgent/:agentId" element={<UpdateDeliveryAgent />} />
            <Route path="/Order/:orderId" element={<UserOrderDetails />} />
            <Route path="/seller/login" element={<SellerLogin />} />
            <Route path="/seller/signup" element={<SellerSignup />} />

            {/* Protected seller route */}
            <Route 
              path="/seller/dashboard/*"
              element={
                <ProtectedRoute>
                  <div>Seller Dashboard Protected Content</div>
                </ProtectedRoute>
              }
            />

            {/* Auth & user routes */}
            <Route path="/api/auth/login" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/signup" element={<BuyerSignup />} />

            {/* Super admin routes */}
            <Route path="/superadmin" element={<SuperAdminDashboard />} />
            <Route path="/superadmin/admins" element={<AdminsList />} />
            <Route path="/superadmin/add-admin" element={<AddAdmin />} />
            <Route path="/superadmin/update-admin/:adminId" element={<UpdateAdmin />} />
            <Route path="/superadmin/buyers" element={<BuyersList />} />
            <Route path="/superadmin/update-buyer/:buyerId" element={<UpdateBuyer />} />
            <Route path="/superadmin/add-buyer" element={<AddBuyer />} />
            <Route path="/superadmin/sellers" element={<SellersList />} />
            <Route path="/superadmin/update-seller/:sellerId" element={<UpdateSeller />} />
            <Route path="/superadmin/add-seller" element={<AddSeller />} />
            

            {/* Additional pages */}
            <Route path="/home" element={<Home />} />
            <Route path="/chatbot" element={<XaphoraChatbot />} />
            <Route path="/seller-login" element={<SellerLogin />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;