// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, isAuthenticated, userRole, allowedRoles }) {
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;
