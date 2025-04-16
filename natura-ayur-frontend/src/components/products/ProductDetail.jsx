import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addItemToCart } from '../../redux/actions/cartActions';
import { fetchProductById } from '../../redux/actions/productActions';
import { fetchProductReviews } from '../../redux/actions/reviewActions';
import { openModal } from '../../redux/slices/uiSlice';
import { 
  selectCurrentProduct, 
  selectProductLoading 
} from '../../redux/selectors/productSelectors';
import {
  selectProductReviews,
  selectProductReviewsSummary,
  selectReviewLoading
} from '../../redux/selectors/reviewSelectors';
import { formatCurrency } from '../../utils/formatCurrency';
import { PLACEHOLDER_IMAGES, REVIEW_RATING_DISPLAY } from '../../utils/constants';
import Button from '../common/Button';
import { ContentLoading } from '../common/Loading';

const ProductDetail = ({ productId }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Selectors
  const product = useSelector(selectCurrentProduct);
  const productLoading = useSelector(selectProductLoading);
  const reviews = useSelector(selectProductReviews);
  const reviewsSummary = useSelector(selectProductReviewsSummary);
  const reviewsLoading = useSelector(selectReviewLoading);
  
  // Local state
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  
  // Fetch product details and reviews
  useEffect(() => {
    if (productId) {
      dispatch(fetchProductById(productId));
      dispatch(fetchProductReviews({ productId }));
    }
  }, [dispatch, productId]);
  
  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
    setCurrentImageIndex(0);
  }, [product]);
  
  if (productLoading) {
    return <ContentLoading text="Loading product details..." />;
  }
  
  if (!product) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">
          Sorry, we couldn't find the product you're looking for.
        </p>
        <Button
          onClick={() => navigate('/products')}
        >
          Browse All Products
        </Button>
      </div>
    );
  }
  
  // Calculate discount percentage if applicable
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) 
    : 0;
  
  // Get product images with fallback
  const images = product.images && product.images.length > 0 
    ? product.images 
    : [PLACEHOLDER_IMAGES.PRODUCT];
  
  // Handle quantity change
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const increaseQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };
  
  // Handle add to cart
  const handleAddToCart = () => {
    dispatch(addItemToCart(product._id, quantity));
  };
  
  // Handle buy now
  const handleBuyNow = () => {
    dispatch(addItemToCart(product._id, quantity));
    navigate('/cart');
  };
  
  // Handle image zoom
  const toggleImageZoom = () => {
    setIsImageZoomed(!isImageZoomed);
  };
  
  // Handle image change
  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
    setIsImageZoomed(false);
  };
  
  // Handle write review
  const handleWriteReview = () => {
    dispatch(openModal({ 
      modalType: 'reviewForm',
      props: { product }
    }));
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
        {/* Product Images */}
        <div className="relative">
          {/* Main Image */}
          <div 
            className={`relative overflow-hidden rounded-lg border border-gray-200 ${
              isImageZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            onClick={toggleImageZoom}
          >
            <img 
              src={images[currentImageIndex]} 
              alt={product.name}
              className={`w-full h-auto object-cover transition-transform duration-300 ${
                isImageZoomed ? 'scale-150' : 'scale-100'
              }`}
            />
            
            {/* Discount Badge */}
            {hasDiscount && (
              <span className="absolute top-4 left-4 bg-red-500 text-white text-sm font-semibold px-2 py-1 rounded">
                {discountPercent}% OFF
              </span>
            )}
          </div>
          
          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-5 gap-2">
              {images.map((image, index) => (
                <div 
                  key={index}
                  className={`relative rounded-md overflow-hidden border-2 cursor-pointer ${
                    index === currentImageIndex 
                      ? 'border-green-500' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => handleImageChange(index)}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} - thumbnail ${index + 1}`}
                    className="w-full h-16 object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Product Details */}
        <div className="flex flex-col">
          {/* Title and Brand */}
          <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.name}</h1>
          
          <div className="flex items-center mb-4">
            <span className="text-gray-600 mr-4">Brand: {product.brand}</span>
            
            {/* Stock Status */}
            {product.stock > 0 ? (
              <span className="text-green-600 font-medium">In Stock ({product.stock} available)</span>
            ) : (
              <span className="text-red-600 font-medium">Out of Stock</span>
            )}
          </div>
          
          {/* Rating */}
          <div className="flex items-center mb-4">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <svg 
                  key={i} 
                  className={`h-5 w-5 ${i < Math.round(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor" 
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            
            <span className="text-gray-600 ml-2">
              {product.rating ? product.rating.toFixed(1) : '0.0'} ({product.numReviews} reviews)
            </span>
            
            <button 
              className="text-green-600 hover:text-green-700 text-sm font-medium ml-4"
              onClick={handleWriteReview}
            >
              Write a Review
            </button>
          </div>
          
          {/* Price */}
          <div className="mb-6">
            <div className="flex items-center">
              <span className="text-3xl font-bold text-gray-900">
                {formatCurrency(product.price)}
              </span>
              
              {hasDiscount && (
                <span className="text-gray-500 text-lg line-through ml-3">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
            
            {hasDiscount && (
              <p className="text-green-600 text-sm mt-1">
                You save {formatCurrency(product.originalPrice - product.price)} ({discountPercent}%)
              </p>
            )}
          </div>
          
          {/* Description */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
            <p className="text-gray-600">{product.description}</p>
          </div>
          
          {/* Category */}
          <div className="mb-6">
            <span className="text-gray-600">
              Category: <span className="font-medium">{product.category}</span>
            </span>
            
            {product.subCategory && product.subCategory.length > 0 && (
              <div className="mt-1 flex flex-wrap">
                <span className="text-gray-600 mr-1">Subcategories:</span>
                {product.subCategory.map((sub, index) => (
                  <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-xs ml-1 mb-1">
                    {sub}
                  </span>
                ))}
              </div>
            )}
          </div>
          
          {/* Quantity and Add to Cart */}
          <div className="mt-auto">
            {product.stock > 0 ? (
              <>
                <div className="flex items-center mb-4">
                  <span className="text-gray-700 mr-4">Quantity:</span>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <button
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      onClick={decreaseQuantity}
                      disabled={quantity === 1}
                    >
                      -
                    </button>
                    <span className="px-4 py-1 text-gray-800 font-medium">
                      {quantity}
                    </span>
                    <button
                      className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      onClick={increaseQuantity}
                      disabled={quantity === product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    fullWidth
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                  
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={handleBuyNow}
                  >
                    Buy Now
                  </Button>
                </div>
              </>
            ) : (
              <div className="bg-red-50 text-red-600 p-4 rounded-md">
                <p className="font-medium">This product is currently out of stock.</p>
                <p className="mt-1 text-sm">Please check back later or browse our other products.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Reviews Section */}
      <div className="border-t border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Customer Reviews</h2>
        
        {reviewsLoading ? (
          <div className="text-center py-6">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mb-2"></div>
            <p className="text-gray-600">Loading reviews...</p>
          </div>
        ) : (
          <>
            {/* Reviews Summary */}
            {reviewsSummary && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Average Rating */}
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="text-center">
                    <div className="text-4xl font-bold text-gray-900 mb-2">
                      {reviewsSummary.averageRating.toFixed(1)}
                    </div>
                    <div className="flex justify-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <svg 
                          key={i} 
                          className={`h-5 w-5 ${i < Math.round(reviewsSummary.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                          fill="currentColor" 
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <div className="text-gray-600">
                      Based on {reviewsSummary.totalReviews} reviews
                    </div>
                  </div>
                </div>
                
                {/* Rating Distribution */}
                <div className="bg-gray-50 p-6 rounded-lg md:col-span-2">
                  <div className="space-y-2">
                    {Object.entries(reviewsSummary.ratingDistribution)
                      .sort((a, b) => Number(b[0]) - Number(a[0]))
                      .map(([rating, count]) => {
                        const percentage = reviewsSummary.totalReviews > 0 
                          ? Math.round((count / reviewsSummary.totalReviews) * 100) 
                          : 0;
                          
                        return (
                          <div key={rating} className="flex items-center">
                            <div className="w-32 flex-shrink-0">
                              <div className="flex items-center">
                                <span className="text-sm text-gray-700 mr-1">{rating}</span>
                                <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-xs text-gray-500 ml-1">({count})</span>
                              </div>
                            </div>
                            <div className="flex-1 h-4 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-yellow-400" 
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <div className="w-12 text-right text-xs text-gray-500">
                              {percentage}%
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}
            
            {/* Review List */}
            {reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((reviewData) => (
                  <div key={reviewData.review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex justify-between mb-2">
                      <div className="flex items-center">
                        {/* User Avatar */}
                        <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
                          {reviewData.userAvatar ? (
                            <img 
                              src={reviewData.userAvatar} 
                              alt={reviewData.userName} 
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-600">
                              {reviewData.userName.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        
                        {/* User Name and Review Date */}
                        <div>
                          <h4 className="font-medium text-gray-900">{reviewData.userName}</h4>
                          <p className="text-xs text-gray-500">
                            {new Date(reviewData.review.createdAt).toLocaleDateString()}
                            {reviewData.review.isEdited && (
                              <span className="ml-2 italic">(edited)</span>
                            )}
                          </p>
                        </div>
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <svg 
                              key={i} 
                              className={`h-4 w-4 ${i < reviewData.review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              fill="currentColor" 
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                        <span className="ml-1 text-gray-600 text-sm">
                          {REVIEW_RATING_DISPLAY[reviewData.review.rating]}
                        </span>
                      </div>
                    </div>
                    
                    {/* Review Title and Content */}
                    {reviewData.review.title && (
                      <h3 className="font-semibold text-gray-900 mb-2">{reviewData.review.title}</h3>
                    )}
                    
                    <p className="text-gray-700 mb-3">{reviewData.review.comment}</p>
                    
                    {/* Review Images */}
                    {reviewData.review.images && reviewData.review.images.length > 0 && (
                      <div className="flex flex-wrap mb-4 gap-2">
                        {reviewData.review.images.map((image, index) => (
                          <div 
                            key={index} 
                            className="h-20 w-20 rounded-md overflow-hidden border border-gray-200"
                          >
                            <img 
                              src={image} 
                              alt={`Review image ${index + 1}`} 
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Verified Purchase Badge */}
                    {reviewData.review.isVerifiedPurchase && (
                      <div className="flex items-center text-green-600 text-sm mb-3">
                        <svg 
                          className="h-4 w-4 mr-1" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M5 13l4 4L19 7" 
                          />
                        </svg>
                        Verified Purchase
                      </div>
                    )}
                    
                    {/* Helpful Votes */}
                    <div className="flex items-center text-sm text-gray-500">
                      <button 
                        className="flex items-center text-gray-500 hover:text-gray-700"
                       // onClick={() => dispatch(markReviewHelpful(reviewData.review._id))}
                      >
                        <svg 
                          className="h-4 w-4 mr-1" 
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905C11 5.056 10.448 6 9.5 6H8c-.552 0-1-.672-1-1.5v-1c0-.828-.432-1.5-1-1.5h-.59a2 2 0 00-1.664.89l-.805 1.21A1.5 1.5 0 003 5v1" 
                          />
                        </svg>
                        Helpful
                      </button>
                      
                      {reviewData.review.helpfulVotes > 0 && (
                        <span className="ml-2">
                          {reviewData.review.helpfulVotes} 
                          {reviewData.review.helpfulVotes === 1 ? ' person' : ' people'} found this helpful
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 bg-gray-50 rounded-lg">
                <svg 
                  className="w-12 h-12 text-gray-400 mx-auto mb-3" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={1.5} 
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
                  />
                </svg>
                <h3 className="text-lg font-medium text-gray-900">No reviews yet</h3>
                <p className="mt-1 text-gray-500 mb-4">Be the first to review this product!</p>
                <Button 
                  variant="outline"
                  onClick={handleWriteReview}
                >
                  Write a Review
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;