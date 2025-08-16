// src/layouts/AdminLayout.jsx
import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa';
import AdminHome from './AdminHome';
import ManageUsers from './ManageUsers';
import ManageCategories from './ManageCategories';
import ManagePayments from './ManagePayments';
import SalesReport from './SalesReport';
import ManageBanners from './ManageBanners';
import { Helmet } from 'react-helmet-async';
import AdmineProfile from './AdmineProfile';

function AdminLayout() {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const buttonClass = (tab) =>
    `block w-full text-left px-4 py-2 rounded ${
      activeTab === tab ? 'bg-blue-600 text-white' : 'hover:bg-gray-200'
    }`;

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100 mt-8">
      {/* Mobile Toggle Button */}
            <Helmet>
              <title>AdminDashboard | MediShop</title>
              <meta name="description" content="Browse and search medicines by name, generic, company. Add items to your cart easily." />
            </Helmet>
      <div className="md:hidden flex items-center justify-between bg-white px-4 py-3 shadow">
        <h2 className="text-xl font-bold text-blue-700">Admin Panel</h2>
        <button onClick={toggleSidebar} className="text-2xl">
          {isSidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`bg-white shadow-lg p-6 space-y-4 md:w-64 w-full md:block ${
          isSidebarOpen ? 'block' : 'hidden'
        } md:static fixed z-40 top-14 left-0 h-full md:h-auto transition-all duration-300`}
      >
        <h2 className="text-2xl font-bold text-blue-700 mb-6 hidden md:block">Admin Panel</h2>
        <nav className="space-y-2">
          <button onClick={() => { setActiveTab('home'); setIsSidebarOpen(false); }} className={buttonClass('home')}>
            Dashboard Overview
          </button>
          <button onClick={() => { setActiveTab('users'); setIsSidebarOpen(false); }} className={buttonClass('users')}>
            Manage Users
          </button>
          <button onClick={() => { setActiveTab('categories'); setIsSidebarOpen(false); }} className={buttonClass('categories')}>
            Manage Categories
          </button>
          <button onClick={() => { setActiveTab('payments'); setIsSidebarOpen(false); }} className={buttonClass('payments')}>
            Payment Management
          </button>
          <button onClick={() => { setActiveTab('reports'); setIsSidebarOpen(false); }} className={buttonClass('reports')}>
            Sales Report
          </button>
          <button onClick={() => { setActiveTab('ads'); setIsSidebarOpen(false); }} className={buttonClass('ads')}>
            Manage Banner Ads
          </button>
          <button onClick={() => { setActiveTab('profile'); setIsSidebarOpen(false); }} className={buttonClass('profile')}>
            Profile
          </button>
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto mt-4 md:mt-0">
        {activeTab === 'home' && <AdminHome />}
        {activeTab === 'users' && <ManageUsers />}
        {activeTab === 'categories' && <ManageCategories />}
        {activeTab === 'payments' && <ManagePayments />}
        {activeTab === 'reports' && <SalesReport />}
        {activeTab === 'ads' && <ManageBanners />}
        {activeTab === 'profile' && <AdmineProfile/>}
      </main>
    </div>
  );
}

export default AdminLayout;
