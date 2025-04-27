// src/pages/AddProductPage.js
import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './AddProductPage.css';

function AddProductPage() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [image, setImage] = useState(null);
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  const handlePriceChange = (e) => {
    const val = e.target.value;
    if (val === '' || (!isNaN(val) && Number(val) >= 1)) {
      setPrice(val);
      setMessage('');
    } else {
      setMessage('❗ Price must be at least 1');
    }
  };

  const handleStockQuantityChange = (e) => {
    const val = e.target.value;
    if (val === '' || (!isNaN(val) && Number(val) >= 1)) {
      setStockQuantity(val);
      setMessage('');
    } else {
      setMessage('❗ Stock Quantity must be at least 1');
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!price || Number(price) < 1) {
      setMessage('❗ Please enter a valid price (≥ 1)');
      return;
    }
    if (!stockQuantity || Number(stockQuantity) < 1) {
      setMessage('❗ Please enter a valid stock quantity (≥ 1)');
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("stockQuantity", stockQuantity);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      const { data } = await axios.post(
        'http://localhost:8070/api/products',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setMessage(data.message);
      // reset
      setName(''); setCategory(''); setPrice(''); setStockQuantity('');
      setImage(null); setDescription('');
      document.getElementById('imageInput').value = "";
    } catch (err) {
      setMessage(err.response?.data?.message || 'Error adding product');
    }
  };

  return (
    <div className="container mt-5 add-product-container">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white">
          <h2 className="mb-0"><i className="bi bi-plus-circle me-2"/>Add New Product</h2>
        </div>
        <div className="card-body">
          {message && <div className="alert alert-info">{message}</div>}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter product name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter product category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
              />
            </div>

            <div className="row">
              <div className="mb-3 col-md-6">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter product price"
                  value={price}
                  onChange={handlePriceChange}
                  min={1}
                  required
                />
              </div>
              <div className="mb-3 col-md-6">
                <label className="form-label">Stock Quantity</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Enter stock quantity"
                  value={stockQuantity}
                  onChange={handleStockQuantityChange}
                  min={1}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Image</label>
              <input
                type="file"
                id="imageInput"
                className="form-control"
                accept="image/*"
                onChange={handleImageChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="4"
                placeholder="Enter product description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-success w-100">
              <i className="bi bi-check-circle me-2" />Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProductPage;
