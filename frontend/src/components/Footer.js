import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3 bg-light">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>About Us</h5>
            <p>Xaphora Dress - Your one-stop shop for fashionable clothing.</p>
          </div>
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/categories">Categories</Link></li>
              <li><Link to="/contact">Contact</Link></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Contact Info</h5>
            <ul className="list-unstyled">
              <li>Email: info@xaphoradress.com</li>
              <li>Phone: +1234567890</li>
              <li>Address: 123 Fashion Street, City</li>
            </ul>
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-12 text-center">
            <p className="mb-0">&copy; 2024 Xaphora Dress. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 