import './UpdateDeliveryAgent.css';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

const UpdateDeliveryAgent = () => {
  const { agentId } = useParams();
  const navigate = useNavigate();
  
  const [agent, setAgent] = useState({
    name: '',
    contact: '',
    email: '',
    assignedRegion: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState('');

  // Fetch the current agent details 
  useEffect(() => {
    async function fetchAgentDetails() {
      try {
        const response = await fetch(`http://localhost:8070/api/delivery/agents/${agentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch agent details');
        }
        const data = await response.json();
        setAgent({
          name: data.name,
          contact: data.contact,
          email: data.email,
          assignedRegion: data.assignedRegion,
        });
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    }
    fetchAgentDetails();
  }, [agentId]);

  const handleChange = (e) => {
    setAgent({ ...agent, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      const response = await fetch(`http://localhost:8070/api/delivery/agents/${agentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agent),
      });
      if (!response.ok) {
        throw new Error('Failed to update agent');
      }
      const result = await response.json();
      setSuccess(result.message || 'Agent updated successfully');
      
      setTimeout(() => {
        navigate('/admin-dashboard/agents');
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <p>Loading agent details...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <p>Error: {error}</p>
      </div>
    </div>
  );

  return (
    <div className="admin-layout">
      <Sidebar />
      <div className="main-content">
        <div className="update-agent-container">
          <h2>Update Delivery Agent</h2>
          {success && <p className="success-message">{success}</p>}
          {error && <p className="error-message">{error}</p>}
          <form onSubmit={handleSubmit} className="update-form">
            <div className="form-group">
              <label>Name: </label>
              <input 
                type="text" 
                name="name" 
                value={agent.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Contact: </label>
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
              <label>Email: </label>
              <input 
                type="email" 
                name="email" 
                value={agent.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label>Assigned Region: </label>
              <input 
                type="text" 
                name="assignedRegion" 
                value={agent.assignedRegion} 
                onChange={handleChange} 
                required 
              />
            </div>
            <button type="submit" className="update-button">
              Update Agent
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateDeliveryAgent;
