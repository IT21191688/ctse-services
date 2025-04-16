import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import useAuth from '../hooks/useAuth';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Handle successful registration
  const handleRegisterSuccess = () => {
    // Navigate to login page with success message
    navigate('/login', { 
      replace: true,
      state: { 
        message: 'Registration successful! Please check your email to verify your account before logging in.' 
      } 
    });
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">NaturaAyur</h1>
        <h2 className="mt-2 text-center text-xl font-semibold text-gray-600">Create your account</h2>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RegisterForm onSuccess={handleRegisterSuccess} />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;