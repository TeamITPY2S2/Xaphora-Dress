// src/pages/ProductDetail.jsx

import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8070/api/products/${id}`);
      setProduct(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load product details');
      console.error('Error fetching product:', err);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please login first!");
      navigate("/api/auth/login");
      return;
    }

    const cartItem = {
      userId: userId,
      productId: product._id,
      productName: product.name,
      price: product.price,
      quantity,
      size: selectedSize,
      imageUrl: product.imageUrl,
    };

    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    existingCart.push(cartItem);
    localStorage.setItem("cart", JSON.stringify(existingCart));

    alert("Product added to cart!");
    navigate("/cart"); // after adding, go to cart directly
  };

  if (loading) {
    return <div className="loading">Loading product details...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (!product) {
    return <div className="error-message">Product not found</div>;
  }

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  return (
    <div className="product-detail-container">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/products">Products</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="product-detail-grid">
        <div className="product-image-container">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-detail-image"
          />
        </div>

        <div className="product-info-container">
          <div className="product-header">
            <h1 className="product-name">{product.name}</h1>
            <div className="product-price">Rs {product.price.toFixed(2)}</div>
          </div>

          <p className="product-description">{product.description}</p>

          <div className="product-meta">
            <div className="product-meta-item">
              <span className="product-meta-label">SKU:</span>
              <span>{product.sku || 'N/A'}</span>
            </div>
            <div className="product-meta-item">
              <span className="product-meta-label">Category:</span>
              <span>{product.category}</span>
            </div>
          </div>

          <div className="size-section">
            <div className="size-label">
              <span>Select Size</span>
              <a href="#size-guide" className="size-guide-link">Size Guide</a>
            </div>
            <div className="size-options">
              {sizes.map((size) => (
                <button
                  key={size}
                  className={`size-button ${selectedSize === size ? 'selected' : ''}`}
                  onClick={() => handleSizeSelect(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="quantity-section">
            <div className="quantity-selector">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                -
              </button>
              <span>{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= 10}
              >
                +
              </button>
            </div>
          </div>

          <button
            className="add-to-cart-button"
            onClick={handleAddToCart}
            disabled={!selectedSize}
          >
            Add to Cart
          </button>

          <div className="product-details">
            <h3>Product Details</h3>
            <ul className="product-details-list">
              <li>• Material: {product.material || 'Cotton Rich'}</li>
              <li>• Weight: {product.weight || '200g'}</li>
              <li>• Care Instructions: Machine wash cold</li>
              <li>• Made in Sri Lanka</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
