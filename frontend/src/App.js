// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

// Pages
import Home from './pages/Home';
import AddProductPage from './pages/AddProductPage';
import ProductListPage from './pages/ProductListPage';
import EditProductPage from './pages/EditProductPage'; // new

// Components
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <div className="content-container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-product" element={<AddProductPage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/edit-product/:id" element={<EditProductPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
