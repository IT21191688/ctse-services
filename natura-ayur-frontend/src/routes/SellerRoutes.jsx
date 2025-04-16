import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated, selectIsSeller } from '../redux/selectors/authSelectors';

// Layouts
import SellerLayout from '../layouts/SellerLayout';

// Pages
import SellerDashboardPage from '../pages/SellerDashboardPage';
import SellerProductsPage from '../pages/SellerProductsPage';
import SellerAddProductPage from '../pages/SellerAddProductPage';
import SellerOrdersPage from '../pages/SellerOrdersPage';

/**
 * Seller routes accessible only to authenticated users with seller role
 */
const SellerRoutes = () => {
  return (
    <Routes>
      <Route element={<SellerProtectedRoute />}>
        <Route element={<SellerLayout />}>
          <Route path="/seller/dashboard" element={<SellerDashboardPage />} />
          <Route path="/seller/products" element={<SellerProductsPage />} />
          <Route path="/seller/products/add" element={<SellerAddProductPage />} />
          <Route path="/seller/products/edit/:id" element={<SellerAddProductPage />} />
          <Route path="/seller/orders" element={<SellerOrdersPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

/**
 * Protected route wrapper component that redirects to login if not authenticated
 * or home if not a seller
 */
const SellerProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isSeller = useSelector(selectIsSeller);
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Redirect to login with the location they tried to visit
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!isSeller) {
    // Redirect to home if authenticated but not a seller
    return <Navigate to="/" replace />;
  }
  
  return <Route element={<Outlet />} />;
};

// Outlet component to render nested routes
const Outlet = () => {
  return <React.Fragment />;
};

export default SellerRoutes;