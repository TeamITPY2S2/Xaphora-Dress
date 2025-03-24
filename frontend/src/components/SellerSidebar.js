// src/components/SellerSidebar.js
import React from 'react';
import './SellerSidebar.css';

function SellerSidebar({ activeTab, setActiveTab }) {
  return (
    <div className="seller-sidebar">
      <h2>Seller Dashboard</h2>
      <ul>
        <li 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </li>
        <li 
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Order List
        </li>
        <li 
          className={activeTab === 'listings' ? 'active' : ''}
          onClick={() => setActiveTab('listings')}
        >
          Listings
        </li>
      </ul>
    </div>
  );
}

export default SellerSidebar;
