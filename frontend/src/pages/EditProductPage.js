// src/pages/EditProductPage.js
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// make sure Bootstrap is installed: `npm install bootstrap`
// and that index.js or App.js imports it:
// import 'bootstrap/dist/css/bootstrap.min.css';

import './EditProductPage.css';

export default function EditProductPage() {
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
  const [newImage, setNewImage] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProduct = async () => {
    try {
      const { data } = await axios.get(`http://localhost:8070/api/products/${id}`);
      setProduct(data);
    } catch (err) {
      console.error('Error fetching product:', err);
    }
  };

  const handleChange = e =>
    setProduct({ ...product, [e.target.name]: e.target.value });

  const handleImageChange = e => {
    if (e.target.files?.[0]) {
      setNewImage(e.target.files[0]);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', product.name);
    formData.append('category', product.category);
    formData.append('price', product.price);
    formData.append('stockQuantity', product.stockQuantity);
    formData.append('description', product.description);
    if (newImage) formData.append('image', newImage);

    try {
      const res = await axios.put(
        `http://localhost:8070/api/products/${id}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setMessage(res.data.message);
      setTimeout(() => navigate('/products'), 1500);
    } catch (err) {
      console.error(err);
      setMessage('Error updating product');
    }
  };

  return (
    <div className="container edit-product-container py-4">
      <h2 className="mb-4">Edit Product</h2>

      {message && (
        <div className="alert alert-info message" role="alert">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="edit-product-form">
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Name</label>
          <input
            id="name"
            className="form-control"
            type="text"
            name="name"
            value={product.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="category" className="form-label">Category</label>
          <input
            id="category"
            className="form-control"
            type="text"
            name="category"
            value={product.category}
            onChange={handleChange}
            required
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label htmlFor="price" className="form-label">Price</label>
            <input
              id="price"
              className="form-control"
              type="number"
              name="price"
              min="0"
              value={product.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6 mb-3">
            <label htmlFor="stockQuantity" className="form-label">Stock Quantity</label>
            <input
              id="stockQuantity"
              className="form-control"
              type="number"
              name="stockQuantity"
              min="0"
              value={product.stockQuantity}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Current Image</label>
          {product.imageUrl && (
            <div>
              <img
                src={product.imageUrl}
                alt={product.name}
                className="img-thumbnail current-image"
              />
            </div>
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="image" className="form-label">Change Image</label>
          <input
            id="image"
            className="form-control"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            className="form-control"
            name="description"
            rows="4"
            value={product.description}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Update Product
        </button>
      </form>
    </div>
  );
}
