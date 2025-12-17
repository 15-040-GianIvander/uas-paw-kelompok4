import React from 'react';
import { Navigate } from 'react-router-dom';

// This page was removed in favor of the Organizer dashboard.
// Redirecting to /organizer/dashboard to avoid duplicate admin pages.

export default function DashboardAdmin() {
  return <Navigate to="/organizer/dashboard" replace />;
}
 
