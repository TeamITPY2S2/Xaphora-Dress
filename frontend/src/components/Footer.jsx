import React from "react";
import { FaFacebookF, FaInstagram, FaTiktok, FaYoutube } from "react-icons/fa";
import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Shop */}
        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li>Women</li>
            <li>Men</li>
            <li>Kids</li>
            <li>Mother &amp; Baby</li>
            <li>Home &amp; Lifestyle</li>
            <li>Health &amp; Beauty</li>
            <li>Avurudu</li>
            <li>Sale</li>
          </ul>
        </div>

        {/* Information */}
        <div className="footer-col">
          <h4>Information</h4>
          <ul>
            <li>Shipping Policy</li>
            <li>Returns &amp; Exchanges</li>
            <li>Terms &amp; Conditions</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* Company */}
        <div className="footer-col">
          <h4>Company</h4>
          <ul>
            <li>About Us</li>
            <li>Contact Us</li>
            <li>FAQs</li>
            <li>CSR</li>
            <li>Our Branches</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="footer-col">
          <h4>Newsletter Sign Up</h4>
          <p>Sign up for exclusive updates, new arrivals & insider discounts</p>
          <div className="newsletter">
            <input
              type="email"
              placeholder="Enter your email address"
            />
            <button>Submit</button>
          </div>
          <div className="social-icons">
            <FaFacebookF />
            <FaInstagram />
            <FaTiktok />
            <FaYoutube />
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        © {new Date().getFullYear()} Xaphora Dress. All Rights Reserved |
        Designed by ------- | E‑commerce Solution by ------
      </div>
    </footer>
  );
}