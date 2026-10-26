import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminStore } from '../Store/AdminStore';
import { PageSpinner } from '../ui/Skeleton';

/** Gate for /admin routes: waits for the session, then requires an allow-listed admin. */
const ProtectedRoute = ({ children }) => {
  const { isAdmin, isLoading } = useAdminStore();
  const location = useLocation();
  if (isLoading) return <PageSpinner label="Checking your session" />;
  if (!isAdmin) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
};

export default ProtectedRoute;
