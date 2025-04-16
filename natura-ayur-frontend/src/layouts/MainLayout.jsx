import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';
import Sidebar from '../components/common/Sidebar';
import { setSidebarState, setSearchState } from '../redux/slices/uiSlice';
import { fetchCartSummary } from '../redux/actions/cartActions';
import { selectIsAuthenticated } from '../redux/selectors/authSelectors';

/**
 * Main layout component that wraps most of the application pages
 * Includes Navbar, Sidebar and Footer
 */
const MainLayout = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Close sidebar and search when route changes
  useEffect(() => {
    dispatch(setSidebarState(false));
    dispatch(setSearchState(false));
  }, [location.pathname, dispatch]);
  
  // Fetch cart summary when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartSummary());
    }
  }, [isAuthenticated, dispatch]);
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <Navbar />
      
      {/* Sidebar (mobile navigation) */}
      <Sidebar />
      
      {/* Main Content */}
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;