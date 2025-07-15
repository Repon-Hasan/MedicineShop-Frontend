import React, { useContext, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import logo from "../../assets/logo.png";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import AuthContext from '../../../AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const activeClass = "text-green-600 underline";

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md px-4 py-3 z-50 relative">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <NavLink to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-8 h-8" />
          <span className="font-bold text-xl text-green-600">MediMarket</span>
        </NavLink>

        <button className="md:hidden text-xl" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" className={({ isActive }) => isActive ? activeClass : "hover:text-green-600"}>Home</NavLink>
          <NavLink to="/shop" className={({ isActive }) => isActive ? activeClass : "hover:text-green-600"}>Shop</NavLink>
          <NavLink to="/cart" className={({ isActive }) => isActive ? `${activeClass} flex items-center` : "hover:text-green-600 flex items-center"}>
            <FaShoppingCart className="text-xl" />
          </NavLink>

          <select className="border rounded px-2 py-1 text-sm">
            <option value="en">EN</option>
            <option value="bn">BN</option>
          </select>

          {!user ? (
            <NavLink to="/login" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
              Join Us
            </NavLink>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-8 h-8 rounded-full border overflow-hidden"
              >
                <img
                  key={user?.photoURL || "default"} // force re-render when photoURL changes
                  src={user.photoURL || "/default-profile.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow rounded-md z-50">
                  <NavLink to="/update-profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 hover:bg-gray-100">Update Profile</NavLink>
                  <NavLink to="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 hover:bg-gray-100">Dashboard</NavLink>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600">Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden flex flex-col gap-3 mt-4 px-2 pb-4 border-t pt-4">
          <NavLink to="/" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? activeClass : "hover:text-green-600"}>Home</NavLink>
          <NavLink to="/shop" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? activeClass : "hover:text-green-600"}>Shop</NavLink>
          <NavLink to="/cart" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? `${activeClass} flex items-center gap-1` : "hover:text-green-600 flex items-center gap-1"}>
            <FaShoppingCart /> Cart
          </NavLink>
          <select className="border rounded px-2 py-1 text-sm w-24">
            <option value="en">EN</option>
            <option value="bn">BN</option>
          </select>

          {!user ? (
            <NavLink to="/login" onClick={() => setMenuOpen(false)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center">Join Us</NavLink>
          ) : (
            <>
              <NavLink to="/update-profile" onClick={() => setMenuOpen(false)} className="hover:text-green-600">Update Profile</NavLink>
              <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} className="hover:text-green-600">Dashboard</NavLink>
              <button onClick={handleLogout} className="text-left w-full text-red-600 hover:text-red-800">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
