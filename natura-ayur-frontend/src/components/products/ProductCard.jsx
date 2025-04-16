import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItemToCart } from '../../redux/actions/cartActions';
import { openModal } from '../../redux/slices/uiSlice';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../common/Button';
import { PLACEHOLDER_IMAGES } from '../../utils/constants';

/**
 * Product Card component for displaying products in a grid
 * 
 * @param {Object} props
 * @param {Object} props.product - Product data
 * @param {string} [props.size='md'] - Card size (sm, md, lg)
 * @param {boolean} [props.horizontal=false] - Whether to display card horizontally
 * @param {Function} [props.onQuickView] - Quick view handler
 */
const ProductCard = ({ 
  product, 
  size = 'md', 
  horizontal = false,
  onQuickView
}) => {
  const dispatch = useDispatch();
  
  // Default image if none provided
  const productImage = product.images && product.images.length > 0 
    ? product.images[0] 
    : PLACEHOLDER_IMAGES.PRODUCT;
  
  // Calculate discount percentage if applicable
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;
  
  // Handle add to cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addItemToCart(product._id, 1));
  };
  
  // Handle quick view
  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onQuickView) {
      onQuickView(product);
    } else {
      dispatch(openModal({ 
        modalType: 'quickView',
        props: { product }
      }));
    }
  };
  
  // Size classes
  const sizeClasses = {
    sm: {
      card: 'max-w-xs',
      image: 'h-48',
      title: 'text-sm',
      price: 'text-sm'
    },
    md: {
      card: 'max-w-sm',
      image: 'h-64',
      title: 'text-base',
      price: 'text-base'
    },
    lg: {
      card: 'max-w-md',
      image: 'h-80',
      title: 'text-lg',
      price: 'text-lg'
    }
  };
  
  // Horizontal layout
  if (horizontal) {
    return (
      <div className="flex bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        {/* Product Image */}
        <Link 
          to={`/products/${product._id}`}
          className="relative w-1/3 flex-shrink-0"
        >
          <img 
            src={productImage} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          
          {/* Discount Badge */}
          {hasDiscount && (
            <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
              {discountPercent}% OFF
            </span>
          )}
          
          {/* Out of Stock Overlay */}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded">
                Out of Stock
              </span>
            </div>
          )}
        </Link>
        
        {/* Product Info */}
        <div className="w-2/3 p-4 flex flex-col">
          <div className="flex-1">
            <h3 className="text-gray-900 font-semibold mb-1">
              <Link to={`/products/${product._id}`} className="hover:text-green-600">
                {product.name}
              </Link>
            </h3>
            
            <p className="text-gray-500 text-sm mb-2">
              {product.brand}
            </p>
            
            {/* Rating */}
            {product.rating > 0 && (
              <div className="flex items-center mb-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`h-4 w-4 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">
                  ({product.numReviews} {product.numReviews === 1 ? 'review' : 'reviews'})
                </span>
              </div>
            )}
            
            {/* Price */}
            <div className="flex items-center mb-3">
              <span className="text-gray-900 font-semibold">
                {formatCurrency(product.price)}
              </span>
              
              {hasDiscount && (
                <span className="text-gray-500 text-sm line-through ml-2">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            
            {/* Description */}
            <p className="text-gray-600 text-sm line-clamp-2 mb-3">
              {product.description}
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex space-x-2">
            <Button 
              size="sm" 
              fullWidth
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              Add to Cart
            </Button>
            
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleQuickView}
            >
              Quick View
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Default vertical layout
  return (
    <div className={`${sizeClasses[size].card} bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300`}>
      {/* Product Image */}
      <Link 
        to={`/products/${product._id}`}
        className="relative block"
      >
        <div className={`${sizeClasses[size].image} overflow-hidden group`}>
          <img 
            src={productImage} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          
          {/* Quick View Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black bg-opacity-20">
            <button
              onClick={handleQuickView}
              className="bg-white text-gray-800 rounded-full p-2 hover:bg-gray-100 transform hover:scale-105 transition-transform duration-200"
              aria-label="Quick view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          </div>
        </div>
        
        {/* Discount Badge */}
        {hasDiscount && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded">
            {discountPercent}% OFF
          </span>
        )}
        
        {/* Out of Stock Overlay */}
        {product.stock <= 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded">
              Out of Stock
            </span>
          </div>
        )}
      </Link>
      
      {/* Product Info */}
      <div className="p-4">
        <h3 className={`text-gray-900 font-semibold mb-1 ${sizeClasses[size].title}`}>
          <Link to={`/products/${product._id}`} className="hover:text-green-600">
            {product.name}
          </Link>
        </h3>
        
        <p className="text-gray-500 text-sm mb-2">
          {product.brand}
        </p>
        
        {/* Rating */}
        {product.rating > 0 && (
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`h-4 w-4 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-xs text-gray-500 ml-1">
              ({product.numReviews})
            </span>
          </div>
        )}
        
        {/* Price */}
        <div className="flex items-center mb-3">
          <span className={`text-gray-900 font-semibold ${sizeClasses[size].price}`}>
            {formatCurrency(product.price)}
          </span>
          
          {hasDiscount && (
            <span className="text-gray-500 text-sm line-through ml-2">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>
        
        {/* Add to Cart Button */}
        <Button 
          fullWidth
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
        >
          Add to Cart
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;