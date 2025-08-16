// src/components/SellerDashboard.jsx

import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import AuthContext from '../../AuthContext';
import './SellerDashboard.css';

// Chart colors
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE'];

const SellerDashboard = () => {
  const { user } = useContext(AuthContext);
  const [summary, setSummary] = useState({});
  const [topMedicines, setTopMedicines] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [revenueChartData, setRevenueChartData] = useState([]);
  const [ordersPieData, setOrdersPieData] = useState([]);

  useEffect(() => {
    if (!user?.email) return;

    axios
      .get(`https://backend-nu-livid-37.vercel.app/seller-dashboard/${user.email}`)
      .then((res) => {
        const { summary, topMedicines, recentOrders } = res.data;

        // Transform revenueTrend
        const trendMap = {};
        recentOrders.forEach(order => {
          const date = new Date(order.date).toISOString().split('T')[0];
          trendMap[date] = (trendMap[date] || 0) + parseFloat(order.total);
        });
        const transformedRevenue = Object.entries(trendMap).map(([date, revenue]) => ({
          date,
          revenue,
        }));

        // Transform orderStatus
        const pieMap = {};
        recentOrders.forEach(order => {
          const key = order.status;
          pieMap[key] = (pieMap[key] || 0) + 1;
        });
        const transformedPie = Object.entries(pieMap).map(([status, value]) => ({
          status,
          value,
        }));

        setSummary(summary);
        setTopMedicines(topMedicines || []);
        setRecentOrders(recentOrders || []);
        setRevenueChartData(transformedRevenue);
        setOrdersPieData(transformedPie);
      })
      .catch((err) => console.error('Dashboard error:', err));
  }, [user?.email]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-heading">Seller Dashboard</h1>

      {/* Overview Charts */}
      <div className="overview-section">
        <div className="chart-card fade-in">
          <h2>Total Revenue Over Time</h2>
          {revenueChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueChartData}>
                <CartesianGrid stroke="#f5f5f5" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8884d8" 
                  dot={false} 
                  isAnimationActive
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p>No revenue data to display.</p>
          )}
        </div>

        <div className="chart-card fade-in delay-1">
          <h2>Order Status Distribution</h2>
          {ordersPieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ordersPieData}
                  dataKey="value"
                  nameKey="status"
                  innerRadius={60}
                  outerRadius={100}
                  isAnimationActive
                  label
                >
                  {ordersPieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No order status data to display.</p>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-container fade-in delay-2">
        <StatCard label="Total Revenue" value={`$${(summary.totalRevenue || 0).toFixed(2)}`} />
        <StatCard label="Paid" value={`$${(summary.paidTotal || 0).toFixed(2)}`} />
        <StatCard label="Pending" value={`$${(summary.pendingTotal || 0).toFixed(2)}`} />
      </div>

      {/* Top Selling Medicines */}
      <section className="dashboard-section fade-in delay-3">
        <h2 className="dashboard-subheading">Top Selling Medicines</h2>
        <div className="table-wrapper">
          <table className="responsive-table">
            <thead>
              <tr>
                <th>Medicine</th>
                <th>Sold</th>
                <th>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topMedicines.length === 0 ? (
                <tr>
                  <td colSpan="3" className="no-data">
                    No data available
                  </td>
                </tr>
              ) : (
                topMedicines.map((med, idx) => (
                  <tr key={idx}>
                    <td>{med.name}</td>
                    <td>{med.sold}</td>
                    <td>${med.revenue.toFixed(2)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Recent Orders */}
      <section className="dashboard-section fade-in delay-4">
        <h2 className="dashboard-subheading">Recent Orders</h2>
        <div className="table-wrapper">
          <table className="responsive-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Items</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.length === 0 ? (
                <tr>
                  <td colSpan="5" className="no-data">
                    No recent orders
                  </td>
                </tr>
              ) : (
                recentOrders.map((order, idx) => (
                  <tr key={idx}>
                    <td>{order.email}</td>
                    <td>{order.cartItems.map((i) => i.name).join(', ')}</td>
                    <td>${parseFloat(order.total).toFixed(2)}</td>
                    <td>{order.status}</td>
                    <td>{new Date(order.date).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="stat-card">
    <h3 className="stat-label">{label}</h3>
    <p className="stat-value">{value}</p>
  </div>
);

export default SellerDashboard;
