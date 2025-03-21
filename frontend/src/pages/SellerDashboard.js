// src/pages/SellerDashboard.js
import React, { useState } from 'react';
import SellerSidebar from '../components/SellerSidebar';
import SellerOverview from '../components/SellerOverview';
import SellerOrders from '../components/SellerOrders';
import SellerListings from '../components/SellerListings';
import './SellerDashboard.css';

function SellerDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderContent = () => {
    switch(activeTab) {
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
      <SellerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="dashboard-content">
        {renderContent()}
      </div>
    </div>
  );
}

export default SellerDashboard;
