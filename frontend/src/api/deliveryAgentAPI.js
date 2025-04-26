// api/deliveryAgentAPI.js
export const createDeliveryAgent = async (agentData) => {
    try {
      const response = await fetch('http://localhost:8070/api/delivery/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(agentData)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }
      return data;
    } catch (error) {
      throw error;
    }
  };
  