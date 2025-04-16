import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductReviews, fetchSellerReviews } from '../../redux/actions/reviewActions';
import { 
  selectProductReviews, 
  selectSellerReviews,
  selectProductReviewsSummary,
  selectSellerReviewsSummary,
  selectTotalReviews,
  selectReviewPages,
  selectReviewLoading
} from '../../redux/selectors/reviewSelectors';
import { openModal } from '../../redux/slices/uiSlice';
import { REVIEW_RATINGS, REVIEW_TYPES } from '../../utils/constants';
import ReviewItem from './ReviewItem';
import Button from '../common/Button';
import { ContentLoading } from '../common/Loading';

/**
 * Component for displaying a list of reviews
 * 
 * @param {Object} props
 * @param {string} props.targetId - ID of the product or seller
 * @param {string} props.targetType - Type of target (product or seller)
 * @param {number} [props.limit] - Limit the number of reviews to display
 * @param {boolean} [props.showFilters=true] - Whether to show review filters
 * @param {boolean} [props.showSummary=true] - Whether to show reviews summary
 * @param {boolean} [props.showAddReview=true] - Whether to show add review button
 */
const ReviewList = ({ 
  targetId, 
  targetType, 
  limit,
  showFilters = true,
  showSummary = true,
  showAddReview = true
}) => {
  const dispatch = useDispatch();
  
  // Selectors
  const productReviews = useSelector(selectProductReviews);
  const sellerReviews = useSelector(selectSellerReviews);
  const productSummary = useSelector(selectProductReviewsSummary);
  const sellerSummary = useSelector(selectSellerReviewsSummary);
  const totalReviews = useSelector(selectTotalReviews);
  const totalPages = useSelector(selectReviewPages);
  const loading = useSelector(selectReviewLoading);
  
  // State for filters
  const [filters, setFilters] = useState({
    rating: 0,
    sortBy: 'createdAt',
    order: '-1',
    page: 1,
    limit: limit || 10
  });
  
  // Get the appropriate reviews and summary based on target type
  const reviews = targetType === REVIEW_TYPES.PRODUCT ? productReviews : sellerReviews;
  const summary = targetType === REVIEW_TYPES.PRODUCT ? productSummary : sellerSummary;
  
  // Fetch reviews when component mounts or filters change
  useEffect(() => {
    if (targetId && targetType) {
      if (targetType === REVIEW_TYPES.PRODUCT) {
        dispatch(fetchProductReviews({ productId: targetId, filters }));
      } else if (targetType === REVIEW_TYPES.SELLER) {
        dispatch(fetchSellerReviews({ sellerId: targetId, filters }));
      }
    }
  }, [dispatch, targetId, targetType, filters]);
  
  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }));
  };
  
  // Handle rating filter
  const handleRatingFilter = (rating) => {
    handleFilterChange({ 
      rating: filters.rating === rating ? 0 : rating 
    });
  };
  
  // Handle sort change
  const handleSortChange = (e) => {
    const [sortBy, order] = e.target.value.split('=');
    handleFilterChange({ sortBy, order });
  };
  
  // Handle page change
  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
    
    // Scroll to top of reviews section
    window.scrollTo({
      top: document.getElementById('reviews-section')?.offsetTop - 100 || 0,
      behavior: 'smooth'
    });
  };
  
  // Open review form modal
  const handleAddReview = () => {
    dispatch(openModal({ 
      modalType: 'reviewForm',
      props: { 
        targetId, 
        targetType 
      }
    }));
  };
  
  // Open edit review form modal
  const handleEditReview = (review) => {
    dispatch(openModal({ 
      modalType: 'reviewForm',
      props: { 
        targetId, 
        targetType,
        review,
        isEdit: true
      }
    }));
  };
  
  if (loading && reviews.length === 0) {
    return <ContentLoading text="Loading reviews..." />;
  }
  
  return (
    <div id="reviews-section" className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Customer Reviews
            {totalReviews > 0 && (
              <span className="ml-2 text-sm text-gray-600">({totalReviews})</span>
            )}
          </h2>
          
          {showAddReview && (
            <Button
              onClick={handleAddReview}
              size="sm"
            >
              Write a Review
            </Button>
          )}
        </div>
      </div>
      
      {/* Reviews Summary */}
      {showSummary && summary && (
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Average Rating */}
            <div className="bg-white p-6 rounded-lg">
              <div className="text-center">
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {summary.averageRating.toFixed(1)}
                </div>
                <div className="flex justify-center mb-2">
                  {[...Array(5)].map((_, i) => (
                    <svg 
                      key={i} 
                      className={`h-5 w-5 ${i < Math.round(summary.averageRating) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <div className="text-gray-600">
                  Based on {summary.totalReviews} reviews
                </div>
              </div>
            </div>
            
            {/* Rating Distribution */}
            <div className="bg-white p-6 rounded-lg md:col-span-2">
              <div className="space-y-2">
                {Object.entries(summary.ratingDistribution)
                  .sort((a, b) => Number(b[0]) - Number(a[0]))
                  .map(([rating, count]) => {
                    const percentage = summary.totalReviews > 0 
                      ? Math.round((count / summary.totalReviews) * 100) 
                      : 0;
                      
                    return (
                      <button 
                        key={rating} 
                        className="w-full flex items-center"
                        onClick={() => handleRatingFilter(Number(rating))}
                      >
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
                            className={`h-full ${Number(rating) === filters.rating ? 'bg-green-500' : 'bg-yellow-400'}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="w-12 text-right text-xs text-gray-500">
                          {percentage}%
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Filters */}
      {showFilters && (
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            {/* Active filters */}
            <div className="flex items-center">
              {filters.rating > 0 && (
                <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full mr-2">
                  {filters.rating} Stars
                  <button 
                    onClick={() => handleFilterChange({ rating: 0 })}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              
              {(filters.rating > 0) && (
                <button 
                  className="text-sm text-green-600 hover:text-green-700"
                  onClick={() => handleFilterChange({ rating: 0 })}
                >
                  Clear filters
                </button>
              )}
            </div>
            
            {/* Sort dropdown */}
            <div className="flex items-center">
              <label htmlFor="reviewSort" className="text-sm text-gray-600 mr-2">
                Sort by:
              </label>
              <select
                id="reviewSort"
                value={`${filters.sortBy}=${filters.order}`}
                onChange={handleSortChange}
                className="text-sm border border-gray-300 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="createdAt=-1">Newest First</option>
                <option value="createdAt=1">Oldest First</option>
                <option value="helpfulVotes=-1">Most Helpful</option>
                <option value="rating=-1">Highest Rating</option>
                <option value="rating=1">Lowest Rating</option>
              </select>
            </div>
          </div>
        </div>
      )}
      
      {/* Reviews List */}
      <div className="p-6">
        {reviews.length > 0 ? (
          <div className="space-y-6">
            {reviews.map((reviewData) => (
              <ReviewItem 
                key={reviewData.review._id} 
                reviewData={reviewData} 
                onEdit={handleEditReview}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <svg 
              className="w-12 h-12 text-gray-400 mx-auto mb-4" 
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
            <p className="mt-1 text-gray-500 mb-4">Be the first to review this {targetType}!</p>
            {showAddReview && (
              <Button 
                variant="outline"
                onClick={handleAddReview}
              >
                Write a Review
              </Button>
            )}
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-1">
              {/* Previous */}
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className={`px-3 py-1 rounded-md ${
                  filters.page === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                aria-label="Previous page"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Page numbers */}
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i + 1}
                  onClick={() => handlePageChange(i + 1)}
                  className={`px-3 py-1 rounded-md ${
                    i + 1 === filters.page
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              
              {/* Next */}
              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === totalPages}
                className={`px-3 py-1 rounded-md ${
                  filters.page === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                aria-label="Next page"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewList;