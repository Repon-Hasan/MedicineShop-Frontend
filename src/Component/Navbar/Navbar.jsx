import React, { useContext, useEffect, useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import logo from "../../assets/logo.png";
import { FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import AuthContext from '../../../AuthContext';
import axios from 'axios';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  const activeClass = "text-green-600 underline font-semibold";
  const linkClass = "hover:text-green-600 transition-colors duration-200 font-semibold";

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMenuOpen(false);
    navigate('/');
  };

  useEffect(() => {
    const fetchCartCount = () => {
      if (user?.email) {
        axios.get(`https://backend-nu-livid-37.vercel.app/selectedMedicines/${user.email}`)
          .then(res => setCartCount(res.data.length))
          .catch(err => {
            console.error("Error fetching cart items:", err);
            setCartCount(0);
          });
      }
    };

    fetchCartCount();
    const handleCartUpdate = () => fetchCartCount();

    window.addEventListener('cartUpdated', handleCartUpdate);
    return () => window.removeEventListener('cartUpdated', handleCartUpdate);
  }, [user]);

  const commonLinks = (
    <>
      <NavLink to="/" className={({ isActive }) => isActive ? activeClass : linkClass}>Home</NavLink>
      <NavLink to="/about" className={({ isActive }) => isActive ? activeClass : linkClass}>About</NavLink>
    </>
  );

  const loggedOutLinks = (
    <>
      {commonLinks}
      <NavLink to="/contact" className={({ isActive }) => isActive ? activeClass : linkClass}>Contact</NavLink>
    </>
  );

  const loggedInLinks = (
    <>
      {commonLinks}
      <NavLink to="/shop" className={({ isActive }) => isActive ? activeClass : linkClass}>Shop</NavLink>
      <NavLink to="/cart" className={({ isActive }) => isActive ? `${activeClass} relative flex items-center` : `relative flex items-center ${linkClass}`}>
        <FaShoppingCart className="text-xl" />
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
            {cartCount}
          </span>
        )}
      </NavLink>
  
      <NavLink to="/contact" className={({ isActive }) => isActive ? activeClass : linkClass}>Contact</NavLink>
    </>
  );

  return (
    <nav className="fixed top-0 left-0 w-full bg-green-50 shadow z-50">
      <div className="mx-auto px-2 py-3 flex justify-between items-center">
        <NavLink to="/" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="w-8 h-8 rounded-2xl" />
          <span className="font-bold text-xl text-green-600">MediMarket</span>
        </NavLink>

        <button className="md:hidden text-2xl" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FaTimes /> : <FaBars />}
        </button>

        <div className="hidden md:flex items-center gap-6">
          {!user ? loggedOutLinks : loggedInLinks}

          {!user ? (
            <NavLink to="/login" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold transition">Join Us</NavLink>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-8 h-8 rounded-full border overflow-hidden"
              >
                <img
                  key={user?.photoURL || "default"}
                  src={user.photoURL || "/default-profile.png"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white shadow rounded-md z-50">
                  <NavLink to="/update-profile" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 hover:bg-gray-100 font-medium">Update Profile</NavLink>
                  <NavLink to="/dashboard" onClick={() => setDropdownOpen(false)} className="block px-4 py-2 hover:bg-gray-100 font-medium">Dashboard</NavLink>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 hover:bg-red-100 text-red-600 font-medium">Logout</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-3 mt-2 px-4 pb-4 border-t pt-4 bg-white shadow-md">
          {!user ? loggedOutLinks : loggedInLinks}

          <select className="border rounded px-2 py-1 text-sm w-24 font-medium">
            <option value="en">EN</option>
            <option value="bn">BN</option>
          </select>

          {!user ? (
            <NavLink to="/login" onClick={() => setMenuOpen(false)} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-center font-semibold">Join Us</NavLink>
          ) : (
            <>
              <NavLink to="/update-profile" onClick={() => setMenuOpen(false)} className="hover:text-green-600 font-semibold">Update Profile</NavLink>
              <NavLink to="/dashboard" onClick={() => setMenuOpen(false)} className="hover:text-green-600 font-semibold">Dashboard</NavLink>
              <button onClick={handleLogout} className="text-left w-full text-red-600 hover:text-red-800 font-semibold">Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
