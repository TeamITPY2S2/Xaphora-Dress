import './UpdateDeliveryAgent.css';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
        // Set state with fetched agent data
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
        navigate('/agents');
      }, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading agent details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Update Delivery Agent</h2>
      {success && <p style={{ color: 'green' }}>{success}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Name: </label>
          <input 
            type="text" 
            name="name" 
            value={agent.name} 
            onChange={handleChange} 
            required 
            style={{ padding: '8px', width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Contact: </label>
          <input 
            type="text" 
            name="contact" 
            value={agent.contact} 
            onChange={handleChange} 
            required 
            placeholder="10-digit number" 
            style={{ padding: '8px', width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Email: </label>
          <input 
            type="email" 
            name="email" 
            value={agent.email} 
            onChange={handleChange} 
            required 
            style={{ padding: '8px', width: '100%' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Assigned Region: </label>
          <input 
            type="text" 
            name="assignedRegion" 
            value={agent.assignedRegion} 
            onChange={handleChange} 
            required 
            style={{ padding: '8px', width: '100%' }}
          />
        </div>
        <button 
          type="submit" 
          style={{ padding: '10px 15px', fontSize: '16px', cursor: 'pointer' }}
        >
          Update Agent
        </button>
      </form>
    </div>
  );
};

export default UpdateDeliveryAgent;
