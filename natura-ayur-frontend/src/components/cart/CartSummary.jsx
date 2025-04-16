import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  selectCartSubtotal, 
  selectCartTax, 
  selectCartShipping, 
  selectCartTotal,
  selectIsCartEmpty
} from '../../redux/selectors/cartSelectors';
import { selectIsAuthenticated } from '../../redux/selectors/authSelectors';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../common/Button';

/**
 * Component for displaying the cart order summary and checkout button
 * 
 * @param {Object} props
 * @param {boolean} [props.isCheckout=false] - Whether this summary is on the checkout page
 * @param {Function} [props.onCheckout] - Optional callback for checkout button click
 */
const CartSummary = ({ isCheckout = false, onCheckout }) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isCartEmpty = useSelector(selectIsCartEmpty);
  
  // Get cart totals from redux
  const subtotal = useSelector(selectCartSubtotal);
  const tax = useSelector(selectCartTax);
  const shipping = useSelector(selectCartShipping);
  const total = useSelector(selectCartTotal);
  
  // Determine free shipping threshold
  const freeShippingThreshold = 100;
  const amountToFreeShipping = freeShippingThreshold - subtotal;
  
  // Handle checkout button click
  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else if (!isAuthenticated) {
      navigate('/login', { state: { from: '/cart' } });
    } else {
      navigate('/checkout');
    }
  };
  
  // Summary content
  const summaryContent = (
    <>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Subtotal</span>
          <span className="text-gray-800 font-medium">{formatCurrency(subtotal)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Tax (15%)</span>
          <span className="text-gray-800 font-medium">{formatCurrency(tax)}</span>
        </div>
        
        <div className="flex justify-between">
          <span className="text-gray-600">Shipping</span>
          <span className="text-gray-800 font-medium">
            {shipping === 0 ? 'Free' : formatCurrency(shipping)}
          </span>
        </div>
        
        {amountToFreeShipping > 0 && shipping > 0 && (
          <div className="text-green-600 text-sm">
            Add {formatCurrency(amountToFreeShipping)} more for free shipping!
          </div>
        )}
        
        <div className="border-t border-gray-200 pt-4 mt-4">
          <div className="flex justify-between">
            <span className="text-gray-800 font-semibold">Total</span>
            <span className="text-gray-900 font-bold text-xl">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
      
      {!isCheckout && (
        <div className="mt-6">
          <Button 
            fullWidth
            size="lg"
            onClick={handleCheckout}
            disabled={isCartEmpty}
          >
            {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
          </Button>
          
          {!isAuthenticated && (
            <p className="text-sm text-gray-600 mt-2 text-center">
              You'll need to sign in to complete your purchase
            </p>
          )}
        </div>
      )}
    </>
  );
  
  // If on checkout page, render simple div
  if (isCheckout) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
        {summaryContent}
      </div>
    );
  }
  
  // Otherwise render with more options
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-6">Order Summary</h2>
      {summaryContent}
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <h3 className="font-medium text-gray-800 mb-2">Accepted Payment Methods</h3>
        <div className="flex gap-2">
          <div className="bg-gray-100 p-2 rounded-md">
            <svg className="h-6 w-12" viewBox="0 0 48 24" fill="none">
              <rect width="48" height="24" rx="4" fill="#F3F4F6" />
              <path d="M16 12H32" stroke="#374151" strokeWidth="2" />
              <path d="M16 16H24" stroke="#374151" strokeWidth="2" />
            </svg>
          </div>
          <div className="bg-gray-100 p-2 rounded-md">
            <svg className="h-6 w-12" viewBox="0 0 48 24" fill="none">
              <rect width="48" height="24" rx="4" fill="#F3F4F6" />
              <circle cx="24" cy="12" r="6" stroke="#374151" strokeWidth="2" />
            </svg>
          </div>
          <div className="bg-gray-100 p-2 rounded-md">
            <svg className="h-6 w-12" viewBox="0 0 48 24" fill="none">
              <rect width="48" height="24" rx="4" fill="#F3F4F6" />
              <path d="M16 8H32V16H16V8Z" stroke="#374151" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-sm text-gray-600">
        <p>Need help? <Link to="/contact" className="text-green-600 hover:text-green-700">Contact our support team</Link></p>
      </div>
    </div>
  );
};

export default CartSummary;