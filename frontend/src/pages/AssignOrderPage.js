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
      console.log('Orders with addresses:', oData); // For debugging
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
        console.log('Delivery agents:', aData); // For debugging
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
            // Case-insensitive comparison of regions
            const filtered = agents.filter(agent => {
              const agentRegion = (agent.assignedRegion || '').toLowerCase().trim();
              const orderRegion = (order.shippingRegion || '').toLowerCase().trim();
              console.log(`Comparing regions for order ${order._id}:`);
              console.log(`Agent region: "${agentRegion}", Order region: "${orderRegion}"`);
              return agentRegion === orderRegion;
            });

            return (
              <tr key={order._id}>
                <td>
                  <strong>#{order._id}</strong><br/>
                  Customer: {order.customerName}<br/>
                  Region: <span style={{ fontWeight: order.shippingRegion === 'Unknown' ? 'bold' : 'normal', color: order.shippingRegion === 'Unknown' ? 'red' : 'inherit' }}>
                    {order.shippingRegion}
                  </span><br/>
                  Status: {order.status}
                </td>
                <td>
                  {order.shippingRegion === 'Unknown' ? (
                    <div style={{ color: 'red' }}>Cannot assign - Unknown region</div>
                  ) : (
                    <>
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
                      {filtered.length === 0 && (
                        <div style={{ color: 'orange', fontSize: '0.8em', marginTop: '5px' }}>
                          No agents available for {order.shippingRegion}
                        </div>
                      )}
                    </>
                  )}
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
