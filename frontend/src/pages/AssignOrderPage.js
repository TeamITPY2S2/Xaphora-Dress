import React, { useState, useEffect } from 'react';
import './AssignOrderPage.css';

const AssignOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [agents, setAgents] = useState([]);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    try {
      const oRes = await fetch('http://localhost:8070/api/orders');
      if (!oRes.ok) throw new Error('Failed to load orders');
      const oData = await oRes.json();
      setOrders(oData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
    async function fetchAgents() {
      try {
        const aRes = await fetch('http://localhost:8070/api/delivery/agents');
        if (!aRes.ok) throw new Error('Failed to load agents');
        const aData = await aRes.json();
        setAgents(aData);
      } catch (err) {
        setError(err.message);
      }
    }
    fetchAgents();
  }, []);

  // Assign an agent to an order
  const handleAssign = async (orderId, agentId) => {
    try {
      // If agentId is empty, set it to null (unassign)
      const payload = agentId ? { agentId } : { agentId: null };

      const res = await fetch(
        `http://localhost:8070/api/delivery/orders/${orderId}/manual-assign`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'Assignment failed');
      }
      alert(agentId ? 'Agent assigned!' : 'Agent unassigned!');
      fetchOrders(); // Re-fetch orders after assignment
    } catch (err) {
      alert(`Error: ${err.message}`);
      console.error('Assignment error:', err);
    }
  };

  if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

  return (
    <div className="assign-page">
      <h2>Assign Orders to Delivery Agents</h2>
      <table className="assign-table">
        <thead>
          <tr>
            <th>Order Details</th>
            <th>Assign Agent</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => {
            const filtered = agents.filter(
              a => a.assignedRegion === (order.shippingRegion || order.shippingAddress)
            );
            return (
              <tr key={order._id}>
                <td>
                  <strong>#{order._id}</strong><br/>
                  Customer: {order.customerName || order.customer}<br/>
                  Region: {order.shippingRegion || order.shippingAddress}<br/>
                  Status: {order.status}
                </td>
                <td>
                  <select
                    value={order.deliveryAgent || ''}
                    onChange={e => handleAssign(order._id, e.target.value)}
                  >
                    <option value="">-- select agent --</option>
                    {filtered.map(a => (
                      <option key={a._id} value={a._id}>
                        {a.name} — {a.assignedRegion}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AssignOrderPage;
