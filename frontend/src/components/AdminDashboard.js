// src/components/AdminDashboard.js
import './AdminDashboard.css';
import React, { useState, useEffect } from 'react';
import { getAgents, getAgentPerformance } from '../api/adminAPI';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [performance, setPerformance] = useState('');
  const navigate = useNavigate();

  // Fetch agents when the component mounts
  useEffect(() => {
    async function fetchAgents() {
      try {
        const data = await getAgents();
        setAgents(data);
      } catch (error) {
        console.error('Error fetching agents:', error);
      }
    }
    fetchAgents();
  }, []);

  const handleAgentChange = async (e) => {
    const agentId = e.target.value;
    setSelectedAgent(agentId);
    if (agentId) {
      try {
        const response = await fetch(`http://localhost:8070/api/admin/agent-performance?agentId=${agentId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch performance');
        }
        const result = await response.json();
        // Assuming result.report is an array of objects; format it using JSON.stringify
        setPerformance(JSON.stringify(result.report, null, 2) || 'Performance details not available');
      } catch (error) {
        console.error('Error fetching performance:', error);
        setPerformance('Error fetching performance');
      }
    } else {
      setPerformance('');
    }
  };
  

  return (
    <div className="admin-dashboard" style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Top Bar */}
      <div className="top-bar" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <button className="assign-order-button" style={{ padding: '10px 15px', fontSize: '16px' }}>
          Assign Order
        </button>
        <div className="top-right-buttons">
          <button 
            className="add-agent-button" 
            style={{ padding: '10px 15px', marginRight: '10px', fontSize: '16px' }}
            onClick={() => navigate('/addDeliveryAgent')}
          >
            Add Agent
          </button>
          <button 
            className="view-agent-button" 
            style={{ padding: '10px 15px', fontSize: '16px' }}
            onClick={() => navigate('/agents')}
          >
            View Agent
          </button>
        </div>
      </div>

      {/* Agent Performance Section */}
      <div className="agent-performance" style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
          Agent Performance:
        </label>
        <select 
          value={selectedAgent} 
          onChange={handleAgentChange} 
          style={{ padding: '8px', width: '100%', marginBottom: '10px' }}
        >
          <option value="">Select an Agent</option>
          {agents.map(agent => (
            <option key={agent._id} value={agent._id}>
              {agent.name}
            </option>
          ))}
        </select>
        <textarea
          readOnly
          value={performance}
          placeholder="Agent performance details will be displayed here..."
          style={{ padding: '10px', width: '100%', height: '100px', resize: 'none' }}
        />
      </div>

      {/* View Order & Order Tracking Button */}
      <div className="order-tracking">
        <button 
          className="order-tracking-button" 
          style={{ padding: '10px 15px', fontSize: '16px' }}
          onClick={() => navigate('/Order')}
        >
          View Order & Order Tracking
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
