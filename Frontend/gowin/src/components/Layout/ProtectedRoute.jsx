// src/components/Layout/ProtectedRoute.js
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAdminStore } from '../Store/AdminStore'

const ProtectedRoute = ({ children }) => {
  const { isAdmin } = useAdminStore()

  if (!isAdmin) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
