import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Helmet } from 'react-helmet';
import { fetchCart } from '../redux/slices/cartSlice';
import { selectCartLoading, selectCartError } from '../redux/selectors/cartSelectors';
import CartList from '../components/cart/CartList';
import CartSummary from '../components/cart/CartSummary';
import { ContentLoading } from '../components/common/Loading';

/**
 * Shopping cart page component
 */
const CartPage = () => {
  const dispatch = useDispatch();
  
  // Get cart state from redux
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  
  // Fetch cart on mount
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);
  
  // Handle cart error
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          <h3 className="text-lg font-medium">Error loading your cart</h3>
          <p>{error}</p>
          <button 
            className="mt-2 text-red-700 underline"
            onClick={() => dispatch(fetchCart())}
          >
            Try again
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50">
      <Helmet>
        <title>Your Cart | NaturaAyur</title>
        <meta name="description" content="View and manage items in your shopping cart at NaturaAyur." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Shopping Cart</h1>
        
        {loading && !error ? (
          <ContentLoading text="Loading your cart..." />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items - Takes up 2/3 of the space on large screens */}
            <div className="lg:col-span-2">
              <CartList loading={loading} />
            </div>
            
            {/* Cart Summary - Takes up 1/3 of the space on large screens */}
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;