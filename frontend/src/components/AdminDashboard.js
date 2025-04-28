// src/components/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [agents, setAgents] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');
  const [performance, setPerformance] = useState(null);
  const navigate = useNavigate();

  // Fetch agents list
  useEffect(() => {
    async function fetchAgents() {
      try {
        const res = await fetch('http://localhost:8070/api/delivery/agents');
        if (!res.ok) throw new Error('Failed to fetch agents');
        setAgents(await res.json());
      } catch (err) {
        console.error(err);
      }
    }
    fetchAgents();
  }, []);

  // Handler to load one agent's performance
  const handleAgentChange = async (e) => {
    const agentId = e.target.value;
    setSelectedAgent(agentId);
    setPerformance(null);

    if (!agentId) return;

    try {
      const res = await fetch(
        `http://localhost:8070/api/admin/agent-performance/${agentId}`
      );
      if (!res.ok) throw new Error('Failed to fetch performance');
      const { report } = await res.json();
      setPerformance(report);
    } catch (err) {
      console.error(err);
      setPerformance({ error: 'Could not load performance' });
    }
  };

  // Build the textarea content
  const performanceText = React.useMemo(() => {
    if (!selectedAgent) return '';
    if (performance?.error) return performance.error;
    if (!performance) return '';

    const lines = [
      `ID: ${performance._id}`,
      `Name: ${performance.name}`,
      `Region: ${performance.assignedRegion}`,
      `Total Orders: ${performance.totalOrders}`,
      `Delivered Orders: ${performance.deliveredOrders}`
    ];

    if (performance.orderDetails?.length) {
      lines.push('', 'Order Details:');
      performance.orderDetails.forEach(o => {
        lines.push(`  • ${o.orderId} — ${o.customerName}`);
      });
    }

    return lines.join('\n');
  }, [performance, selectedAgent]);

  // PDF download handler
  const handleDownloadReport = () => {
    if (!performance) return;

    const doc = new jsPDF();

    // Title
    doc.setFontSize(18);
    doc.text('Agent Performance Report', 10, 15);

    // Agent Info
    doc.setFontSize(12);
    doc.text(`ID: ${performance._id}`, 10, 30);
    doc.text(`Name: ${performance.name}`, 10, 38);
    doc.text(`Region: ${performance.assignedRegion}`, 10, 46);
    doc.text(`Total Orders: ${performance.totalOrders}`, 10, 54);
    doc.text(`Delivered Orders: ${performance.deliveredOrders}`, 10, 62);

    // Order Details Table
    if (performance.orderDetails && performance.orderDetails.length > 0) {
      doc.setFontSize(14);
      doc.text('Order Details:', 10, 75);
      doc.setFontSize(12);

      let y = 83;
      doc.text('Order ID', 10, y);
      doc.text('Customer Name', 70, y);

      y += 7;
      performance.orderDetails.forEach((order, idx) => {
        doc.text(String(order.orderId), 10, y);
        doc.text(String(order.customerName), 70, y);
        y += 7;
        // Add new page if needed
        if (y > 280) {
          doc.addPage();
          y = 15;
        }
      });
    }

    doc.save(`agent_performance_${performance.name || selectedAgent}.pdf`);
  };

  return (
    <div className="admin-dashboard">
      {/* Top Bar */}
      <div className="top">
        <button className="assign-order-button" onClick={() => navigate('/assign-orders')}>
          Assign Order
        </button>
        <div className="top-right-buttons">
          <button
            className="add-agent-button"
            onClick={() => navigate('/addDeliveryAgent')}
          >
            Add Agent
          </button>
          <button
            className="view-agent-button"
            onClick={() => navigate('/agents')}
          >
            View Agent
          </button>
        </div>
      </div>

      {/* Agent Performance Section */}
      <div className="agent-performance">
        <label>Agent Performance:</label>
        <select
          value={selectedAgent}
          onChange={handleAgentChange}
        >
          <option value="">Select an Agent</option>
          {agents.map(agent => (
            <option key={agent._id} value={agent._id}>
              {agent.name}
            </option>
          ))}
        </select>

        <textarea
          className="agent-performance-text"
          readOnly
          value={performanceText}
          placeholder="Agent performance details will be displayed here..."
        />
        {performance && (
          <button
            className="download-report-button"
            onClick={handleDownloadReport}
            style={{ marginTop: '10px' }}
          >
            Download report
          </button>
        )}
      </div>

      {/* View Order & Tracking */}
      <div className="order-tracking">
        <button
          className="order-tracking-button"
          onClick={() => navigate('/Order')}
        >
          View Order & Tracking
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
