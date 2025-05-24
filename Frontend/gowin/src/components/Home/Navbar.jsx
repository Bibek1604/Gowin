// src/components/Navbar.js
import React, { useState } from 'react'
import { useAdminStore } from '../Store/AdminStore'
import gowin from '../../assets/gowin.jpg'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const { isAdmin, login, logout } = useAdminStore()
  const [showModal, setShowModal] = useState(false)
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    if (password) {
      login(password)
      setPassword('')
      setShowModal(false)
    }
  }

  return (
    <>
      {/* Navbar */}
      <nav className="w-full flex justify-between items-center px-6 py-4 bg-white/10 backdrop-blur-md shadow-lg rounded-2xl text-gray-800">
        {/* Logo */}
        <Link t0="/" className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <img src={gowin} alt="gowin" className="h-10 w-10 rounded-full" />
          <div className="text-2xl font-bold">Gowin</div>
        </div>
        </Link>

        {/* Navigation Links */}
        <div className="space-x-6">
          <a href="#home" className="hover:text-gray/90">Home</a>
          <a href="#about" className="hover:text-gray/90">About Us</a>
          <a href="#places" className="hover:text-gray/90">Places</a>
          <a href="#contact" className="hover:text-gray/90">Contact</a>
          {isAdmin && <a href="/admin" className="hover:text-gray/90">Admin Panel</a>}
        </div>

        {/* Login Button */}
        <button
          onClick={isAdmin ? logout : () => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-gray-800 font-semibold shadow-sm transition"
        >
          {isAdmin ? 'Logout' : 'Admin Login'}
        </button>
      </nav>

      {/* Modal for Admin Login */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-6 rounded-2xl w-full max-w-sm text-gray-800">
            <h2 className="text-xl font-semibold mb-4">🔐 Admin Login</h2>
            <input
              type="password"
              placeholder="Enter admin password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 rounded bg-white/20 text-white placeholder-white/60 outline-none mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleLogin}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded text-white"
              >
                Login
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
