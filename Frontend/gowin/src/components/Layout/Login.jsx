// src/components/LoginButton.js
import { useAdminStore } from '../Store/AdminStore'
import React from 'react'

const LoginButton = () => {
  const { isAdmin, login, logout } = useAdminStore()

  const handleLogin = () => {
    const password = prompt('Enter admin password:')
    login(password)
  }

  return (
    <button
      onClick={isAdmin ? logout : handleLogin}
      className="px-4 py-2 rounded bg-white/20 text-white backdrop-blur-md hover:bg-white/30 transition"
    >
      {isAdmin ? 'Logout Admin' : 'Login as Admin'}
    </button>
  )
}

export default LoginButton
