// src/components/Layout/ProtectedRoute.js
import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAdminStore } from '../Store/AdminStore'

const ProtectedRoute = ({ children }) => {
  const { isAdmin, isLoading } = useAdminStore()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
