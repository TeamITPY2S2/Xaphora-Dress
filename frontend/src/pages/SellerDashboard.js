// src/pages/SellerDashboard.js
import React, { useState } from 'react';
import SellerOverview from '../components/SellerOverview';
import SellerOrders from '../components/SellerOrders';
import SellerListings from '../components/SellerListings';
import './SellerDashboard.css';

function SellerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <SellerOverview />;
      case 'orders':
        return <SellerOrders />;
      case 'listings':
        return <SellerListings />;
      default:
        return <SellerOverview />;
    }
  };

  return (
    <div className="seller-dashboard">
      <div className="dashboard-tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'orders' ? 'active' : ''}
          onClick={() => setActiveTab('orders')}
        >
          Orders
        </button>
        <button
          className={activeTab === 'listings' ? 'active' : ''}
          onClick={() => setActiveTab('listings')}
        >
          Listings
        </button>
      </div>
      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default SellerDashboard;
