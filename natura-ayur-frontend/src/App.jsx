import React, { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUserProfile } from './redux/actions/authActions';
import { selectIsAuthenticated } from './redux/selectors/authSelectors';
import { selectGlobalLoading } from './redux/selectors/uiSelectors';

// Routes
import PublicRoutes from './routes/PublicRoutes';
import PrivateRoutes from './routes/PrivateRoutes';
import SellerRoutes from './routes/SellerRoutes';
import AdminRoutes from './routes/AdminRoutes';

// Components
import { PageLoading } from './components/common/Loading';
// import NotificationManager from './components/common/NotificationManager';
// import ModalManager from './components/common/ModalManager';

/**
 * Root application component
 * Handles global app state and renders route components
 */
const App = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const globalLoading = useSelector(selectGlobalLoading);
  
  // Fetch user profile on app initialization if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUserProfile());
    }
  }, [dispatch, isAuthenticated]);
  
  // Show loading screen if global loading state is true
  if (globalLoading) {
    return <PageLoading />;
  }
  
  return (
    <Router>
      {/* Notification Manager */}
      {/* <NotificationManager />
      
      {/* Modal Manager */}
      {/* <ModalManager /> */}
      
      {/* Routes */}
      <PublicRoutes />
      <PrivateRoutes />
      <SellerRoutes />
      <AdminRoutes />
    </Router>
  );
};

export default App;