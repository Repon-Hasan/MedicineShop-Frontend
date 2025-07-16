import React, { useState } from 'react';
import DashboardOverview from './DashboardOverview';
import ManageMedicines from './ManageMedicines';
import PaymentHistory from './PaymentHistory';
import Advertisement from './Advertisement';
import { FaBars, FaTimes } from 'react-icons/fa';
import { Helmet } from 'react-helmet-async';

function SellerLayout() {
  const [activeTab, setActiveTab] = useState('overview');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    setMenuOpen(false); // Close menu on mobile after selecting
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Header */}
            <Helmet>
              <title>SellerDashboard | MediShop</title>
              <meta name="description" content="Browse and search medicines by name, generic, company. Add items to your cart easily." />
            </Helmet>
      <div className="flex justify-between items-center bg-white shadow-md p-4 md:hidden">
        <h2 className="text-xl font-bold text-green-700">Seller Panel</h2>
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-gray-700 text-2xl focus:outline-none"
        >
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
            { key: 'overview', label: 'Sales Overview' },
            { key: 'medicines', label: 'Manage Medicines' },
            { key: 'payments', label: 'Payment History' },
            { key: 'ads', label: 'Ask For Advertisement' },
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => handleTabClick(item.key)}
              className={`block w-full text-left px-4 py-2 rounded ${
                activeTab === item.key
                  ? 'bg-green-600 text-white'
                  : 'hover:bg-gray-200'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 mt-16 md:mt-0">
        {activeTab === 'overview' && <DashboardOverview />}
        {activeTab === 'medicines' && <ManageMedicines />}
        {activeTab === 'payments' && <PaymentHistory />}
        {activeTab === 'ads' && <Advertisement />}
      </main>
    </div>
  );
}

export default SellerLayout;
