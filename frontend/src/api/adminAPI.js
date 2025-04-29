
// Fetch the list of delivery agents
export async function getAgents() {
    const response = await fetch('http://localhost:8070/api/delivery/agents');
    if (!response.ok) {
      throw new Error('Error fetching agents');
    }
    return await response.json();
  }
  
  export async function getAgentPerformance(agentId) {
    
    const response = await fetch(`http://localhost:8070/api/admin/agent-performance?agentId=${agentId}`);
    if (!response.ok) {
      throw new Error('Error fetching agent performance');
    }
    return await response.json();
  }
  