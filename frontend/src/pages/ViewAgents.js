import './ViewAgents.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ViewAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Fetch agents from backend
  const fetchAgents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8070/api/delivery/agents');
      setAgents(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch agents. Please try again later.');
      console.error('Error fetching agents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleUpdate = async (agentId) => {
    try {
      navigate(`/UpdateDeliveryAgent/${agentId}`);
      console.log('Update agent:', agentId);
    } catch (err) {
      console.error('Error updating agent:', err);
      toast.error('Failed to update agent');
    }
  };

  const handleDelete = async (agentId) => {
    if (window.confirm('Are you sure you want to delete this agent?')) {
      try {
        await axios.delete(`http://localhost:8070/api/delivery/agents/${agentId}`);
        toast.success('Agent deleted successfully');
        fetchAgents(); // Refresh the list
      } catch (err) {
        console.error('Error deleting agent:', err);
        toast.error('Failed to delete agent');
      }
    }
  };

  // Filter agents based on search query
  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="view-agents-container">
      <h2>View Delivery Agents</h2>
      
      {/* Search Container */}
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search by agent name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            className="clear-button"
            onClick={() => setSearchQuery('')}
          >
            Clear
          </button>
        )}
      </div>

      {filteredAgents.length === 0 ? (
        <div className="no-results">
          No agents found matching your search.
        </div>
      ) : (
        <table className="view-agents-table">
          <thead>
            <tr>
              <th>Agent ID</th>
              <th>Name</th>
              <th>Contact Number</th>
              <th>Vehicle Number</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAgents.map((agent) => (
              <tr key={agent._id}>
                <td>{agent._id}</td>
                <td>{agent.name}</td>
                <td>{agent.contact}</td>
                <td>{agent.assignedRegion}</td>
                <td className="action-buttons">
                  <button
                    className="update-button"
                    onClick={() => handleUpdate(agent._id)}
                  >
                    Update
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDelete(agent._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewAgents;
