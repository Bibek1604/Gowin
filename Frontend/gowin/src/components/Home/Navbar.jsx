// src/components/Navbar.js
import React, { useState } from 'react';
import { useAdminStore } from '../Store/AdminStore';
import gowin from '../../assets/gowin.jpg';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { isAdmin, login, logout } = useAdminStore();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (password) {
      login(password);
      setPassword('');
      setShowModal(false);
    }
  };

  return (
    <>
      {/* Sticky & Glassy Navbar */}
      <div className="sticky top-0 z-50 px-4">
        <div className="p-[1px] rounded-2xl bg-gradient-to-r from-white/20 to-white/5 shadow-xl">
          <nav className="w-full flex justify-between items-center px-6 py-4 
            bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl 
            text-gray-800">

            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img src={gowin} alt="gowin" className="h-10 w-10 rounded-full" />
              <div className="text-2xl font-bold">Gowin</div>
            </Link>

            {/* Navigation Links */}
            <div className="space-x-6">
              <a href="/" className="hover:text-black/90 transition-all duration-200">Home</a>
              <a href="/aboutus" className="hover:text-black/90 transition-all duration-200">About Us</a>
              <a href="/contactus" className="hover:text-black/90 transition-all duration-200">Contact</a>
              {isAdmin && <a href="/admin" className="hover:text-black/90 transition-all duration-200">Admin Panel</a>}
            </div>

            {/* Login/Logout Button */}
            <button
              onClick={isAdmin ? logout : () => setShowModal(true)}
              className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 
              backdrop-blur-md text-gray-800 font-semibold shadow-sm transition"
            >
              {isAdmin ? 'Logout' : 'Admin Login'}
            </button>
          </nav>
        </div>
      </div>

      {/* Modal (not shown here, but can be styled too if you want) */}
    </>
  );
};

export default Navbar;
