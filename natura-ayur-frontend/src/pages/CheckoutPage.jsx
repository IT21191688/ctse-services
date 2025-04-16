import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { fetchCart } from '../redux/actions/cartActions';
import { selectIsAuthenticated } from '../redux/selectors/authSelectors';
import { selectIsCartEmpty, selectCartLoading } from '../redux/selectors/cartSelectors';
import CheckoutForm from '../components/cart/CheckoutForm';
import CartSummary from '../components/cart/CartSummary';
import { PageLoading } from '../components/common/Loading';

/**
 * Checkout page component
 */
const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get state from redux
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isCartEmpty = useSelector(selectIsCartEmpty);
  const loading = useSelector(selectCartLoading);
  
  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    }
  }, [isAuthenticated, navigate]);
  
  // Redirect if cart is empty
  useEffect(() => {
    if (!loading && isCartEmpty) {
      navigate('/cart');
    }
  }, [isCartEmpty, loading, navigate]);
  
  // Fetch cart on mount
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);
  
  // Show loading while checking auth and cart
  if (loading || !isAuthenticated) {
    return <PageLoading />;
  }
  
  return (
    <div className="bg-gray-50">
      <Helmet>
        <title>Checkout | NaturaAyur</title>
        <meta name="description" content="Complete your order at NaturaAyur." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form - Takes up 2/3 of the space on large screens */}
          <div className="lg:col-span-2">
            <CheckoutForm />
          </div>
          
          {/* Order Summary - Takes up 1/3 of the space on large screens */}
          <div className="lg:col-span-1">
            <CartSummary isCheckout={true} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;