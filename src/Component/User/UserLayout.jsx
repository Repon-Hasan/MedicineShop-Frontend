import React, { useState, useEffect, useContext, useRef } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import AuthContext from '../../../AuthContext.js';

function UserLayout() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [menuOpen, setMenuOpen] = useState(false);

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!user?.email) return;

    const controller = new AbortController();
    const signal = controller.signal;

    const fetchPayments = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `https://backend-nu-livid-37.vercel.app/user/payments/${user.email}`,
          { signal }
        );
        if (!res.ok) {
          throw new Error(`Error fetching payments: ${res.status}`);
        }
        const data = await res.json();
        if (mounted.current) {
          setPayments(data);
        }
      } catch (err) {
        if (err.name !== 'AbortError' && mounted.current) {
          setError(err.message);
        }
      } finally {
        if (mounted.current) {
          setLoading(false);
        }
      }
    };

    fetchPayments();

    return () => {
      controller.abort();
    };
  }, [user?.email]);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setMenuOpen(false);
  };

  // 📊 Chart Data Generator
  function generateChartData(payments) {
    const monthlyStats = {};

    payments.forEach(payment => {
      const date = new Date(payment.date);
      const month = date.toLocaleString('default', { month: 'short' });

      if (!monthlyStats[month]) {
        monthlyStats[month] = { sales: 0, users: 0 };
      }

      monthlyStats[month].sales += parseFloat(payment.total);
      monthlyStats[month].users += 1;
    });

    const MONTH_ORDER = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const salesData = MONTH_ORDER
      .filter(month => monthlyStats[month])
      .map(month => ({
        month,
        sales: parseFloat(monthlyStats[month].sales.toFixed(2))
      }));

    const usersData = MONTH_ORDER
      .filter(month => monthlyStats[month])
      .map(month => ({
        month,
        users: monthlyStats[month].users
      }));

    return { salesData, usersData };
  }

  // ⚠️ Generate data before rendering charts
  const { salesData, usersData } = generateChartData(payments);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 mt-10">
      <Helmet>
        <title>User Dashboard | MediShop</title>
        <meta name="description" content="User dashboard with overview, profile, stats, and payments." />
      </Helmet>

      {/* Mobile Header */}
      <div className="flex justify-between items-center bg-white shadow-md p-4 md:hidden">
        <h2 className="text-xl font-bold text-green-700">User Dashboard</h2>
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-700 text-2xl">
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-white shadow-md md:shadow-lg w-full md:w-64 md:block ${
          menuOpen ? 'block' : 'hidden'
        } md:relative fixed top-16 z-50 md:top-0 md:z-0 p-6 space-y-4`}
      >
        <nav className="space-y-2">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'profile', label: 'Profile' },
            { key: 'payments', label: 'Payments' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => handleTabClick(item.key)}
              className={`block w-full text-left px-4 py-2 rounded ${activeTab === item.key ? 'bg-green-600 text-white' : 'hover:bg-gray-200'}`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 mt-16 md:mt-0 ml-0 md:ml-64">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-green-700 mb-6">Overview</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded shadow">
                  <h3 className="font-semibold mb-4">Monthly Sales</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={salesData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="sales" stroke="#4ade80" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded shadow">
                  <h3 className="font-semibold mb-4">New Users This Month</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={usersData}>
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="users" fill="#60a5fa" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
  <motion.div
  initial={{ opacity: 0, y: 30 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
  className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto space-y-6"
>
  {/* Profile Header */}
  <div className="  space-x-6">
    <img
      src={user?.photoURL || '/default-profile.png'}
      alt="Profile"
      className="w-24 h-24 rounded-full object-cover border-4 border-green-100 shadow-md mx-auto"
    />
    <div>
      <h3 className="text-2xl font-semibold text-gray-800">{user?.displayName || 'Your Name'}</h3>
      <p className="text-gray-500 text-sm">{user?.email}</p>
        <span className="mt-2 px-4 py-1 rounded-full text-sm bg-green-100 text-green-700">
          Role: "User"
        </span>
    </div>
  </div>

  {/* Profile Details */}
  <div className="space-y-3 text-gray-700">
    <div className="flex items-center justify-between">
      <span className="font-medium">Phone</span>
      <span>{user?.phoneNumber || '01317954146'}</span>
    </div>
    <div className="flex items-center justify-between">
      <span className="font-medium">Address</span>
      <span className="text-right">{user?.address || 'Dhaka'}</span>
    </div>
  </div>
</motion.div>


          )}

          {activeTab === 'payments' && (
            <motion.div
              key="payments"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-green-700 mb-6">My Payments</h2>
              <div className="bg-white p-6 rounded shadow">
                {loading && <p>Loading payments...</p>}
                {error && <p className="text-red-600">Error: {error}</p>}
                {!loading && !error && (
                  payments.length > 0 ? (
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b">
                          <th className="py-2">Date</th>
                          <th className="py-2">Amount</th>
                          <th className="py-2">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((p) => (
                          <tr key={p.id} className="border-b hover:bg-gray-100">
                            <td className="py-2">{new Date(p.date).toLocaleDateString()}</td>
                            <td className="py-2">${p.total}</td>
                            <td className="py-2">{p.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p>No payments found.</p>
                  )
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default UserLayout;
