import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../redux/selectors/authSelectors';

// Layouts
import MainLayout from '../layouts/MainLayout';
// import ProfileLayout from '../layouts/ProfileLayout';

// Pages
import ProfilePage from '../pages/ProfilePage';
import OrdersPage from '../pages/OrdersPage';
import OrderDetailPage from '../pages/OrderDetailPage';
import CheckoutPage from '../pages/CheckoutPage';
import OrderSuccessPage from '../pages/OrderSuccessPage';

/**
 * Private routes accessible only to authenticated users
 */
const PrivateRoutes = () => {
  return (
    <Routes>
      <Route element={<ProtectedRoute />}>
        {/* Main Layout Protected Routes */}
        <Route element={<MainLayout />}>
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />
        </Route>
        
        {/* Profile Layout Routes */}
        <Route>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/orders/:id" element={<OrderDetailPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

/**
 * Protected route wrapper component that redirects to login if not authenticated
 */
const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Redirect to login with the location they tried to visit
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return <Route element={<Outlet />} />;
};

// Outlet component to render nested routes
const Outlet = () => {
  return <React.Fragment />;
};

export default PrivateRoutes;