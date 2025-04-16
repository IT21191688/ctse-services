import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import useAuth from '../hooks/useAuth';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Handle message if passed as state (e.g., from registration success)
  const message = location.state?.message;
  
  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Handle successful login
  const handleLoginSuccess = () => {
    // Navigate to the home page or the page user was trying to access
    const from = location.state?.from?.pathname || '/';
    navigate(from, { replace: true });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">NaturaAyur</h1>
        <h2 className="mt-2 text-center text-xl font-semibold text-gray-600">Sign in to your account</h2>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        {/* Display message if any */}
        {message && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded relative">
            {message}
          </div>
        )}
        
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LoginForm onSuccess={handleLoginSuccess} />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;