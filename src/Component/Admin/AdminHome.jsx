// src/pages/admin/AdminHome.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function StatCard({ title, value, color }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow text-center border">
      <h3 className="text-xl font-medium text-gray-700">{title}</h3>
      <p className={`text-3xl font-bold mt-2 ${color}`}>${parseFloat(value).toLocaleString()}</p>
    </div>
  );
}

function AdminHome() {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    paidTotal: 0,
    pendingTotal: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await axios.get('https://backend-nu-livid-37.vercel.app/admin/summary');
        setStats(res.data);
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
    return <div className="text-center text-lg text-gray-600">Loading admin stats...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      <StatCard title="Total Sales Revenue" value={stats.totalRevenue} color="text-blue-600" />
      <StatCard title="Paid Total" value={stats.paidTotal} color="text-green-600" />
      <StatCard title="Pending Total" value={stats.pendingTotal} color="text-yellow-600" />
    </div>
  );
}

export default AdminHome;
