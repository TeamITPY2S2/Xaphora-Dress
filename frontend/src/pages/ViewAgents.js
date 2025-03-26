import './ViewAgents.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';



const ViewAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch agents from backend API
  useEffect(() => {
    async function fetchAgents() {
      try {
        const response = await fetch('http://localhost:8070/api/delivery/agents');
        if (!response.ok) {
          throw new Error('Failed to fetch agents');
        }
        const data = await response.json();
        setAgents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchAgents();
  }, []);

  // Handler for updating an agent: navigates to an update page
  const handleUpdate = (agentId) => {
    // Ensure the route matches the one defined in your router configuration
    navigate(`/UpdateDeliveryAgent/${agentId}`);
  };

  // Handler for deleting an agent
  const handleDelete = async (agentId) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) return;
    try {
      const response = await fetch(`http://localhost:8070/api/delivery/agents/${agentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete agent');
      }
      // Remove the deleted agent from the state
      setAgents((prevAgents) => prevAgents.filter(agent => agent._id !== agentId));
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
  };

  if (loading) return <p>Loading agents...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Delivery Agents</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Contact</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Assigned Region</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Created At</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent._id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{agent.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{agent.contact}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{agent.email}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{agent.assignedRegion}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                {new Date(agent.createdAt).toLocaleString()}
              </td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    onClick={() => handleUpdate(agent._id)}
                    style={{ padding: '5px 10px', fontSize: '14px' }}
                  >
                    Update
                  </button>
                  <button 
                    onClick={() => handleDelete(agent._id)}
                    style={{ padding: '5px 10px', fontSize: '14px' }}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewAgents;
