// components/DeliveryAgentForm.js
import React, { useState } from 'react';
import { createDeliveryAgent } from '../api/deliveryAgentAPI';
import './deliveryAgentForm.css'; // Import your CSS file

const DeliveryAgentForm = () => {
  const [agent, setAgent] = useState({
    name: '',
    contact: '',
    email: '',
    assignedRegion: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    setAgent({ ...agent, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const result = await createDeliveryAgent(agent);
      setSuccess(result.message);
      setAgent({ name: '', contact: '', email: '', assignedRegion: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="form-container">
      <h4>Add Delivery Agent</h4>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input 
            type="text" 
            name="name" 
            value={agent.name} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Contact:</label>
          <input 
            type="text" 
            name="contact" 
            value={agent.contact} 
            onChange={handleChange} 
            required 
            placeholder="10-digit number" 
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={agent.email} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Assigned Region:</label>
          <input 
            type="text" 
            name="assignedRegion" 
            value={agent.assignedRegion} 
            onChange={handleChange} 
            required 
          />
        </div>
        <button type="submit" className="button">Add Agent</button>
      </form>
    </div>
  );
};

export default DeliveryAgentForm;
