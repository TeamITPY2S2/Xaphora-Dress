// src/components/SellerOverview.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SellerOverview.css';

function SellerOverview() {
  const [productCount, setProductCount] = useState(0);

  useEffect(() => {
    // Fetch product count from the backend
    axios.get('http://localhost:8070/api/products')
      .then(response => {
        setProductCount(response.data.length);
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  }, []);

  return (
    <div className="seller-overview">
      <h2>Overview</h2>
      <div className="overview-cards">
        <div className="card">
          <h3>Total Products</h3>
          <p>{productCount}</p>
        </div>
        <div className="card">
          <h3>Total Orders</h3>
          <p>Placeholder</p>
        </div>
        <div className="card">
          <h3>Total Listings</h3>
          <p>{productCount}</p>
        </div>
      </div>
    </div>
  );
}

export default SellerOverview;
