import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DeliveryDashboard.css';

const DeliveryDashboard = () => {
    const [stats, setStats] = useState({
        totalOrders: 0,
        deliveredOrders: 0,
        recentOrders: [],
        agentPerformance: []
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const response = await axios.get('http://localhost:8070/api/dashboard/delivery');
            setStats(response.data);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    return (
        <div className="delivery-dashboard">
            {/* Stats Cards */}
            <div className="stats-container">
                <div className="stat-card">
                    <div className="stat-icon orders-icon">
                        <i className="bi bi-box-seam"></i>
                    </div>
                    <div className="stat-details">
                        <h3>{stats.totalOrders}</h3>
                        <p>Total Orders</p>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon delivered-icon">
                        <i className="bi bi-check-circle"></i>
                    </div>
                    <div className="stat-details">
                        <h3>{stats.deliveredOrders}</h3>
                        <p>Delivered Orders</p>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="recent-orders-section">
                <h2>Recent Orders</h2>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Date</th>
                                <th>Status</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentOrders.map((order) => (
                                <tr key={order._id}>
                                    <td>{order._id}</td>
                                    <td>{order.customerName}</td>
                                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge ${order.status.toLowerCase()}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>${order.totalAmount}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Agent Performance */}
            <div className="agent-performance-section">
                <h2>Agent Performance</h2>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Agent</th>
                                <th>Orders Delivered</th>
                                <th>On-Time Delivery</th>
                                <th>Rating</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.agentPerformance.map((agent) => (
                                <tr key={agent._id}>
                                    <td>{agent.name}</td>
                                    <td>{agent.ordersDelivered}</td>
                                    <td>{agent.onTimeDelivery}%</td>
                                    <td>
                                        <div className="rating">
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <i 
                                                    key={i}
                                                    className={`bi ${i < Math.floor(agent.rating) 
                                                        ? 'bi-star-fill' 
                                                        : 'bi-star'}`}
                                                ></i>
                                            ))}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DeliveryDashboard; 