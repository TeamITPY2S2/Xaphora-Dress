// src/pages/AddProductPage.js
import React, { useState } from 'react';
import axios from 'axios';
import './AddProductPage.css';

function AddProductPage() {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [image, setImage] = useState(null); // holds the file
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');

  // Handle file selection for the image
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create FormData and append fields
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("price", price);
    formData.append("stockQuantity", stockQuantity);
    formData.append("description", description);
    if (image) {
      formData.append("image", image); // 'image' field is processed by Multer
    }

    try {
      const response = await axios.post(
        'http://localhost:8070/api/products',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      setMessage(response.data.message);

      // Clear form fields
      setName('');
      setCategory('');
      setPrice('');
      setStockQuantity('');
      setImage(null);
      setDescription('');
      // Reset file input manually if needed
      document.getElementById('imageInput').value = "";
    } catch (error) {
      if (error.response && error.response.data) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Error adding product');
      }
    }
  };

  return (
    <div className="add-product-container">
      <h2>Add New Product</h2>
      {message && <p className="message">{message}</p>}

      <form onSubmit={handleSubmit} className="add-product-form">
        <div className="form-group">
          <label>Name:</label>
          <input 
            type="text" 
            placeholder="Enter product name" 
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <input 
            type="text" 
            placeholder="Enter product category" 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required 
          />
        </div>

        <div className="form-group">
          <label>Price:</label>
          <input 
            type="number"
            placeholder="Enter product price" 
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            min={1}
            required 
          />
        </div>

        <div className="form-group">
          <label>Stock Quantity:</label>
          <input 
            type="number"
            placeholder="Enter stock quantity" 
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            min={1}
            required 
          />
        </div>

        <div className="form-group">
          <label>Image:</label>
          <input 
            type="file" 
            id="imageInput"
            accept="image/*" 
            onChange={handleImageChange}
            required 
          />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea 
            placeholder="Enter product description" 
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required 
          />
        </div>

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProductPage;
