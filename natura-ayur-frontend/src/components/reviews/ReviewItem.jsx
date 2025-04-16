import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { markReviewHelpful, deleteUserReview } from '../../redux/actions/reviewActions';
import { selectIsAuthenticated } from '../../redux/selectors/authSelectors';
import { formatDate, formatRelativeTime } from '../../utils/dateUtils';
import { REVIEW_RATING_DISPLAY } from '../../utils/constants';
import RatingStars from './RatingStars';
import Button from '../common/Button';

/**
 * Component for displaying a single review
 * 
 * @param {Object} props
 * @param {Object} props.reviewData - Review data with review object and user info
 * @param {boolean} [props.showActions=true] - Whether to show action buttons
 * @param {Function} [props.onEdit] - Edit handler
 */
const ReviewItem = ({ reviewData, showActions = true, onEdit }) => {
  const dispatch = useDispatch();
  
  // Get auth state
  const isAuthenticated = useSelector(selectIsAuthenticated);
  
  if (!reviewData || !reviewData.review) return null;
  
  const { review, userName, userAvatar } = reviewData;
  
  // Handle marking review as helpful
  const handleMarkHelpful = () => {
    dispatch(markReviewHelpful(review._id));
  };
  
  // Handle deleting review
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      dispatch(deleteUserReview(review._id));
    }
  };
  
  // Check if current user is the review author
  const isAuthor = useSelector(state => {
    const userId = state.auth.user?._id;
    return userId && userId === review.user;
  });
  
  return (
    <div className="border-b border-gray-200 py-6 last:border-b-0">
      <div className="flex justify-between mb-2">
        <div className="flex items-center">
          {/* User Avatar */}
          <div className="h-10 w-10 rounded-full overflow-hidden mr-3">
            {userAvatar ? (
              <img 
                src={userAvatar} 
                alt={userName} 
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-200 text-gray-600">
                {userName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          
          {/* User Name and Review Date */}
          <div>
            <h4 className="font-medium text-gray-900">{userName}</h4>
            <p className="text-xs text-gray-500">
              {formatDate(review.createdAt)}
              {review.isEdited && (
                <span className="ml-2 italic">(edited)</span>
              )}
            </p>
          </div>
        </div>
        
        {/* Rating */}
        <div className="flex items-center">
          <RatingStars rating={review.rating} size="sm" />
          <span className="ml-1 text-gray-600 text-sm">
            {REVIEW_RATING_DISPLAY[review.rating]}
          </span>
        </div>
      </div>
      
      {/* Review Title and Content */}
      {review.title && (
        <h3 className="font-semibold text-gray-900 mb-2">{review.title}</h3>
      )}
      
      <p className="text-gray-700 mb-3">{review.comment}</p>
      
      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex flex-wrap mb-4 gap-2">
          {review.images.map((image, index) => (
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
      {review.isVerifiedPurchase && (
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
      
      {/* Actions */}
      {showActions && (
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center text-sm text-gray-500">
            <button 
              className="flex items-center text-gray-500 hover:text-gray-700"
              onClick={handleMarkHelpful}
              disabled={!isAuthenticated}
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
            
            {review.helpfulVotes > 0 && (
              <span className="ml-2">
                {review.helpfulVotes} 
                {review.helpfulVotes === 1 ? ' person' : ' people'} found this helpful
              </span>
            )}
          </div>
          
          {/* Edit/Delete buttons for author */}
          {isAuthor && (
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEdit && onEdit(review)}
              >
                Edit
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleDelete}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewItem;