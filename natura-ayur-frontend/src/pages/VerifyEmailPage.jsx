import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../components/common/Button';
import useAuth from '../hooks/useAuth';

const VerifyEmailPage = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const { verifyUserEmail, loading, error, successMessage } = useAuth();
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState({
    success: false,
    message: '',
    error: false
  });
  
  // Verify email on component mount
  useEffect(() => {
    if (token) {
      const verifyEmail = async () => {
        try {
          setIsVerifying(true);
          const result = await verifyUserEmail(token);
          
          if (result) {
            setVerificationStatus({
              success: true,
              message: 'Your email has been verified successfully!',
              error: false
            });
          } else {
            setVerificationStatus({
              success: false,
              message: 'Failed to verify email. Please try again or contact support.',
              error: true
            });
          }
        } catch (error) {
          setVerificationStatus({
            success: false,
            message: error.message || 'An error occurred during verification.',
            error: true
          });
        } finally {
          setIsVerifying(false);
        }
      };
      
      verifyEmail();
    } else {
      setIsVerifying(false);
      setVerificationStatus({
        success: false,
        message: 'Invalid verification token.',
        error: true
      });
    }
  }, [token, verifyUserEmail]);
  
  // Navigate to login
  const handleGoToLogin = () => {
    navigate('/login', { 
      state: { 
        message: 'Your email has been verified. You can now log in with your credentials.' 
      } 
    });
  };
  
  // Navigate to home
  const handleGoToHome = () => {
    navigate('/');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h1 className="text-center text-3xl font-extrabold text-gray-900">NaturaAyur</h1>
        <h2 className="mt-2 text-center text-xl font-semibold text-gray-600">Email Verification</h2>
      </div>
      
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow sm:rounded-lg sm:px-10">
          {isVerifying || loading ? (
            <div className="text-center py-6">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-4"></div>
              <p className="text-gray-700">Verifying your email address...</p>
            </div>
          ) : (
            <div className="text-center">
              {verificationStatus.success || successMessage ? (
                <div className="py-6">
                  <div className="rounded-full h-16 w-16 bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Email Verified!</h3>
                  <p className="text-gray-600 mb-6">
                    {verificationStatus.message || successMessage}
                  </p>
                  <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
                    <Button onClick={handleGoToLogin}>
                      Log In
                    </Button>
                    <Button variant="outline" onClick={handleGoToHome}>
                      Go to Home
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-6">
                  <div className="rounded-full h-16 w-16 bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Verification Failed</h3>
                  <p className="text-gray-600 mb-6">
                    {verificationStatus.message || error}
                  </p>
                  <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3 justify-center">
                    <Button variant="outline" onClick={handleGoToHome}>
                      Go to Home
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailPage;