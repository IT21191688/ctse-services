import React, { useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { selectIsAuthenticated } from '../redux/selectors/authSelectors';
import { selectCheckoutUrl } from '../redux/selectors/orderSelectors'; 
import { clearCheckoutUrl } from '../redux/actions/orderActions';
import { fetchOrderByOrderId } from '../redux/actions/orderActions';
import { clearCart } from '../redux/actions/cartActions';
import Button from '../components/common/Button';

/**
 * Order success page shown after checkout
 */
const OrderSuccessPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get state from redux
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const checkoutUrl = useSelector(selectCheckoutUrl);
  
  // Get order ID from URL params
  const searchParams = new URLSearchParams(location.search);
  const orderId = searchParams.get('orderId');
  
  // Redirect to homepage if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);
  
  // Fetch order details if orderId is available
  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderByOrderId(orderId));
    }
  }, [dispatch, orderId]);
  
  // Redirect to checkout URL if available
  useEffect(() => {
    if (checkoutUrl) {
      window.location.href = checkoutUrl;
      dispatch(clearCheckoutUrl());
    }
  }, [checkoutUrl, dispatch]);
  
  // Clear cart on success page view
  useEffect(() => {
    dispatch(clearCart());
  }, [dispatch]);
  
  return (
    <div className="bg-gray-50 min-h-screen flex items-center">
      <Helmet>
        <title>Order Success | NaturaAyur</title>
        <meta name="description" content="Your order has been placed successfully at NaturaAyur." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
          {/* Success Icon */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <svg 
              className="w-10 h-10 text-green-600" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You for Your Order!</h1>
          
          {orderId ? (
            <p className="text-lg text-gray-600 mb-6">
              Your order <span className="font-semibold text-gray-800">{orderId}</span> has been placed successfully.
            </p>
          ) : (
            <p className="text-lg text-gray-600 mb-6">
              Your order has been placed successfully.
            </p>
          )}
          
          <p className="text-gray-600 mb-8">
            We've sent a confirmation to your email address. You can track your order status in your account.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {orderId && (
              <Button 
                as={Link}
                to={`/orders/${orderId}`}
                size="lg"
              >
                View Order Details
              </Button>
            )}
            
            <Button 
              as={Link}
              to="/orders"
              variant="outline"
              size="lg"
            >
              View All Orders
            </Button>
            
            <Button 
              as={Link}
              to="/products"
              variant="outline"
              size="lg"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;