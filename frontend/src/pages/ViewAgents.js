import './ViewAgents.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch agents 
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

  
  const handleUpdate = (agentId) => {
    navigate(`/UpdateDeliveryAgent/${agentId}`);
  };


  const handleDelete = async (agentId) => {
    if (!window.confirm("Are you sure you want to delete this agent?")) return;
    try {
      const response = await fetch(`http://localhost:8070/api/delivery/agents/${agentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete agent');
      }
      
      setAgents((prevAgents) => prevAgents.filter(agent => agent._id !== agentId));
    } catch (err) {
      console.error(err.message);
      setError(err.message);
    }
  };

  if (loading) return <p>Loading agents...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="view-agents-container">
      <h2>Delivery Agents</h2>
      <table className="view-agents-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Contact</th>
            <th>Email</th>
            <th>Assigned Region</th>
            <th>Created At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent._id}>
              <td>{agent.name}</td>
              <td>{agent.contact}</td>
              <td>{agent.email}</td>
              <td>{agent.assignedRegion}</td>
              <td>{new Date(agent.createdAt).toLocaleString()}</td>
              <td>
                <div className="action-buttons">
                  <button 
                    onClick={() => handleUpdate(agent._id)}
                    className="update-button"
                  >
                    Update
                  </button>
                  <button 
                    onClick={() => handleDelete(agent._id)}
                    className="delete-button"
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
