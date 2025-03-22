// src/pages/EditProductPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './EditProductPage.css';

function EditProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    category: '',
    price: '',
    stockQuantity: '',
    imageUrl: '',
    description: ''
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:8070/api/products/${id}`);
      setProduct(response.data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:8070/api/products/${id}`, product);
      setMessage(response.data.message);
      // Optionally navigate back after successful update
      setTimeout(() => {
        navigate('/products');
      }, 1500);
    } catch (error) {
      console.error('Error updating product:', error);
      setMessage('Error updating product');
    }
  };

  return (
    <div className="edit-product-container">
      <h2>Edit Product</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit} className="edit-product-form">
        <div className="form-group">
          <label>Name:</label>
          <input 
            type="text" 
            name="name" 
            value={product.name} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <input 
            type="text" 
            name="category" 
            value={product.category} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Price:</label>
          <input 
            type="number" 
            name="price" 
            value={product.price} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Stock Quantity:</label>
          <input 
            type="number" 
            name="stockQuantity" 
            value={product.stockQuantity} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Image URL:</label>
          <input 
            type="text" 
            name="imageUrl" 
            value={product.imageUrl} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea 
            name="description" 
            value={product.description} 
            onChange={handleChange} 
            required 
          />
        </div>

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
}

export default EditProductPage;
