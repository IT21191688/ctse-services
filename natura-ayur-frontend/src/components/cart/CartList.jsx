import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectCartItems, selectIsCartEmpty } from '../../redux/selectors/cartSelectors';
import { clearEntireCart } from '../../redux/actions/cartActions';
import CartItem from './CartItem';
import Button from '../common/Button';
import { ContentLoading } from '../common/Loading';

/**
 * Component for displaying all items in the cart
 * 
 * @param {Object} props
 * @param {boolean} [props.editable=true] - Whether cart items can be edited
 * @param {boolean} [props.showClearCart=true] - Whether to show the clear cart button
 * @param {boolean} [props.showContinueShopping=true] - Whether to show continue shopping button
 * @param {boolean} [props.loading=false] - Loading state
 * @param {Function} [props.onQuantityChange] - Optional callback for quantity changes
 */
const CartList = ({ 
  editable = true, 
  showClearCart = true,
  showContinueShopping = true,
  loading = false,
  onQuantityChange 
}) => {
  const dispatch = useDispatch();
  const cartItems = useSelector(selectCartItems);
  const isCartEmpty = useSelector(selectIsCartEmpty);
  
  // Handle clearing the cart
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear all items from your cart?')) {
      dispatch(clearEntireCart());
    }
  };
  
  // Loading state
  if (loading) {
    return <ContentLoading text="Loading your cart..." />;
  }
  
  // Empty cart state
  if (isCartEmpty) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm">
        <div className="flex justify-center mb-4">
          <svg className="w-16 h-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Your cart is empty</h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Looks like you haven't added any products to your cart yet. Browse our products and find something you'll love.
        </p>
        {showContinueShopping && (
          <Button
            as={Link}
            to="/products"
            size="lg"
          >
            Start Shopping
          </Button>
        )}
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Your Cart ({cartItems.length} items)</h2>
        
        <div className="flex gap-4">
          {showClearCart && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearCart}
              className="text-red-600 border-red-600 hover:bg-red-50"
            >
              Clear Cart
            </Button>
          )}
          
          {showContinueShopping && (
            <Button
              as={Link}
              to="/products"
              variant="outline"
              size="sm"
            >
              Continue Shopping
            </Button>
          )}
        </div>
      </div>
      
      {/* Cart Items */}
      <div className="divide-y divide-gray-200">
        {cartItems.map((item) => (
          <CartItem 
            key={item.product} 
            item={item} 
            editable={editable}
            onQuantityChange={onQuantityChange}
          />
        ))}
      </div>
    </div>
  );
};

export default CartList;