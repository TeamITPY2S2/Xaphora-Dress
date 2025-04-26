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
  const [newImage, setNewImage] = useState(null); // optional new file
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
    setProduct({
      ...product,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData and add updated fields
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("category", product.category);
    formData.append("price", product.price);
    formData.append("stockQuantity", product.stockQuantity);
    formData.append("description", product.description);

    // If a new image file is selected, append it to FormData
    if (newImage) {
      formData.append("image", newImage);
    }

    try {
      const response = await axios.put(`http://localhost:8070/api/products/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setMessage(response.data.message);
      // Optionally navigate back after a short delay
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
          <label>Current Image:</label>
          {product.imageUrl && (
            <img src={product.imageUrl} alt={product.name} style={{ width: '200px' }} />
          )}
        </div>

        <div className="form-group">
          <label>Change Image:</label>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleImageChange} 
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
