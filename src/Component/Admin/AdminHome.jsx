// src/pages/admin/AdminHome.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

// Stat card component
function StatCard({ title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow text-center border transform transition duration-300 hover:scale-105">
      <h3 className="text-lg sm:text-xl font-medium text-gray-700">{title}</h3>
      <p className={`text-3xl font-bold mt-2 ${color}`}>${parseFloat(value).toLocaleString()}</p>
    </div>
  );
}

// Main Admin Home
function AdminHome() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    paidTotal: 0,
    pendingTotal: 0,
    recentOrders: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [barChartData, setBarChartData] = useState([]);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get('https://backend-nu-livid-37.vercel.app/admin/summary');
        const { totalRevenue, paidTotal, pendingTotal, recentOrders = [] } = res.data;

        // Prepare line chart data
        const trendMap = {};
        recentOrders.forEach((order) => {
          const date = new Date(order.date).toISOString().split('T')[0];
          trendMap[date] = (trendMap[date] || 0) + parseFloat(order.total);
        });
        const trendData = Object.entries(trendMap).map(([date, revenue]) => ({
          date,
          revenue,
        }));

        // Bar chart data
        const barData = [
          {
            name: 'Revenue Summary',
            TotalRevenue: totalRevenue,
            PaidTotal: paidTotal,
            PendingTotal: pendingTotal,
          },
        ];
 {console.log('Revenue Data:', trendData)}
        setStats({ totalRevenue, paidTotal, pendingTotal, recentOrders });
        setRevenueData(trendData);
        setBarChartData(barData);
      } catch (err) {
        console.error(err);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  if (loading) {
    return <div className="text-center text-lg text-gray-600 animate-pulse">Loading admin stats...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="p-4 md:p-8 space-y-10">
      <h1 className="text-2xl md:text-3xl font-semibold text-center mb-4 animate-fade-in">Admin Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 animate-fade-in-up">
        <StatCard title="Total Sales Revenue" value={stats.totalRevenue} color="text-blue-600" />
        <StatCard title="Paid Total" value={stats.paidTotal} color="text-green-600" />
        <StatCard title="Pending Total" value={stats.pendingTotal} color="text-yellow-600" />
      </div>

      {/* Bar Chart */}
      <div className="bg-white p-6 rounded-lg shadow border animate-fade-in-up delay-100">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Revenue Comparison</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={barChartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="TotalRevenue" fill="#3b82f6" name="Total Revenue" />
            <Bar dataKey="PaidTotal" fill="#22c55e" name="Paid Total" />
            <Bar dataKey="PendingTotal" fill="#facc15" name="Pending Total" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Line Chart */}
      {/* <div className="bg-white p-6 rounded-lg shadow border animate-fade-in-up delay-200">
       
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Revenue Over Time</h2>
        {revenueData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          
          <p className="text-gray-500">No revenue data available.</p>
        )}
      </div> */}
    </div>
  );
}

export default AdminHome;
