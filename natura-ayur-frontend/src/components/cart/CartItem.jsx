import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { updateCartItemQuantity, removeItemFromCart } from '../../redux/actions/cartActions';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../common/Button';

/**
 * Component for displaying and managing a single item in the cart
 * 
 * @param {Object} props
 * @param {Object} props.item - Cart item data
 * @param {boolean} [props.editable=true] - Whether the item can be edited (quantity changes, removal)
 * @param {Function} [props.onQuantityChange] - Optional callback for quantity changes
 */
const CartItem = ({ item, editable = true, onQuantityChange }) => {
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  // Handle quantity change
  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1 || newQuantity > 99) return;
    
    setQuantity(newQuantity);
    
    // If updating directly (not in checkout form)
    if (editable) {
      setIsUpdating(true);
      
      dispatch(updateCartItemQuantity(item.product, newQuantity))
        .finally(() => {
          setIsUpdating(false);
        });
    }
    
    // Call optional callback
    if (onQuantityChange) {
      onQuantityChange(item.product, newQuantity);
    }
  };

  // Handle item removal
  const handleRemoveItem = () => {
    if (editable) {
      dispatch(removeItemFromCart(item.product));
    }
  };

  return (
    <div className="flex flex-col sm:flex-row border-b border-gray-200 py-4 gap-4">
      {/* Product Image */}
      <div className="w-full sm:w-24 h-24 flex-shrink-0">
        <img 
          src={item.image} 
          alt={item.name}
          className="w-full h-full object-cover rounded-md"
        />
      </div>
      
      {/* Product Information */}
      <div className="flex-grow flex flex-col sm:flex-row justify-between">
        <div className="flex-grow">
          <h3 className="text-lg font-medium text-gray-800">{item.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{item.price ? formatCurrency(item.price) : ''}</p>
          
          {/* Quantity Selector */}
          {editable ? (
            <div className="flex items-center space-x-2 mt-2">
              <button
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1 || isUpdating}
              >
                <span className="text-gray-600">-</span>
              </button>
              
              <input
                type="number"
                min="1"
                max="99"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="w-12 h-8 text-center border border-gray-300 rounded-md"
                disabled={isUpdating}
              />
              
              <button
                className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                onClick={() => handleQuantityChange(quantity + 1)}
                disabled={quantity >= 99 || isUpdating}
              >
                <span className="text-gray-600">+</span>
              </button>
              
              {isUpdating && (
                <span className="text-sm text-gray-500 ml-2">Updating...</span>
              )}
            </div>
          ) : (
            <div className="mt-2">
              <span className="text-sm text-gray-700">Quantity: {quantity}</span>
            </div>
          )}
        </div>
        
        <div className="flex flex-col justify-between items-end mt-4 sm:mt-0">
          {/* Item Total */}
          <div className="text-lg font-semibold text-gray-900">
            {formatCurrency(item.price * quantity)}
          </div>
          
          {/* Remove Button */}
          {editable && (
            <Button
              variant="text"
              size="sm"
              onClick={handleRemoveItem}
              className="text-red-600 hover:text-red-800"
            >
              Remove
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItem;