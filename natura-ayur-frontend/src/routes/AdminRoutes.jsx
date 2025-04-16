import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectIsAdmin } from '../redux/selectors/authSelectors';

/**
 * Admin routes accessible only to authenticated users with admin role
 */
const AdminRoutes = () => {
  return (
    <Routes>
      <Route element={<AdminProtectedRoute />}>
        {/* Admin Layout would go here, but not implemented for this example */}
        {/* Example routes: */}
        <Route path="/admin/dashboard" element={<div>Admin Dashboard</div>} />
        <Route path="/admin/users" element={<div>User Management</div>} />
        <Route path="/admin/products" element={<div>Product Management</div>} />
        <Route path="/admin/orders" element={<div>Order Management</div>} />
        <Route path="/admin/settings" element={<div>Admin Settings</div>} />
      </Route>
    </Routes>
  );
};

/**
 * Protected route wrapper component that redirects to login if not authenticated
 * or home if not an admin
 */
const AdminProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isAdmin = useSelector(selectIsAdmin);
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Redirect to login with the location they tried to visit
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!isAdmin) {
    // Redirect to home if authenticated but not an admin
    return <Navigate to="/" replace />;
  }
  
  return <Route element={<Outlet />} />;
};

// Outlet component to render nested routes
const Outlet = () => {
  return <React.Fragment />;
};

export default AdminRoutes;