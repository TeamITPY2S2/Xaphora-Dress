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
import AddDeliveryAgent from './pages/addDeliveryAgent';
import AdminDashboard from './pages/AdminDashboard';
import ViewDeliveOrderDetails from './pages/ViewDeliveOrderDetails';
import ViewAgents from './pages/ViewAgents';
import UpdateDeliveryAgent from './pages/UpdateDeliveryAgent';
import DeliveOrdersTable from './components/DeliveOrdersTable';

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
            <Route path="/addDeliveryAgent" element={<AddDeliveryAgent />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/order/:orderId" element={<ViewDeliveOrderDetails />} />
            <Route path="/Order" element={<DeliveOrdersTable />} />
            <Route path="/agents" element={<ViewAgents />} />
            {/* Updated route: now matches the URL pattern used in ViewAgents.js */}
            <Route path="/UpdateDeliveryAgent/:agentId" element={<UpdateDeliveryAgent />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
