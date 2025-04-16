import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../redux/selectors/authSelectors';

/**
 * Authentication layout component
 * Used for login, register, reset password pages
 * Redirects to home if user is already authenticated
 */
const AuthLayout = () => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">NaturaAyur</h1>
          <p className="mt-2 text-sm text-gray-600">
            Natural Ayurvedic products for balanced living
          </p>
        </div>
        
        <Outlet />
        
        {/* Back to home link */}
        <div className="text-center mt-8">
          <a
            href="/"
            className="text-sm text-green-600 hover:text-green-500"
          >
            Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;