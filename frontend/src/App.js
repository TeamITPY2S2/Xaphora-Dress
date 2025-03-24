import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SellerLogin from './components/SellerLogin';
import SellerSignup from './components/SellerSignup';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/seller/login" element={<SellerLogin />} />
          <Route path="/seller/signup" element={<SellerSignup />} />
          <Route path="/" element={<SellerLogin />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
