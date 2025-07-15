import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AuthContext from '../../AuthContext';
import './SellerDashboard.css';

const SellerDashboard = () => {
  const [summary, setSummary] = useState({});
  const [topMedicines, setTopMedicines] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (!user?.email) return;

    axios.get(`https://backend-nu-livid-37.vercel.app/seller-dashboard/${user.email}`)
      .then(res => {
        setSummary(res.data.summary);
        setTopMedicines(res.data.topMedicines);
        setRecentOrders(res.data.recentOrders);
      })
      .catch(err => console.error("Dashboard error:", err));
  }, [user?.email]);

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-heading">Seller Dashboard</h1>

      <div className="stats-container">
        <StatCard label="Total Revenue" value={`$${summary.totalRevenue?.toFixed(2) || '0.00'}`} />
        <StatCard label="Paid" value={`$${summary.paidTotal?.toFixed(2) || '0.00'}`} />
        <StatCard label="Pending" value={`$${summary.pendingTotal?.toFixed(2) || '0.00'}`} />
      </div>

      <section className="dashboard-section">
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
                  <td colSpan="3" className="no-data">No data available</td>
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

      <section className="dashboard-section">
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
                  <td colSpan="5" className="no-data">No recent orders</td>
                </tr>
              ) : (
                recentOrders.map((order, idx) => (
                  <tr key={idx}>
                    <td>{order.email}</td>
                    <td>{order.cartItems.map(i => i.name).join(', ')}</td>
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
