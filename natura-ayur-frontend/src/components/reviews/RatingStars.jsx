import React, { useState } from 'react';
import { REVIEW_RATING_DISPLAY } from '../../utils/constants';

/**
 * Rating stars component for displaying and selecting ratings
 * 
 * @param {Object} props
 * @param {number} [props.rating=0] - Current rating (1-5)
 * @param {Function} [props.onRatingChange] - Callback when rating changes
 * @param {boolean} [props.interactive=false] - Whether the stars are interactive
 * @param {string} [props.size='md'] - Size of stars ('sm', 'md', 'lg')
 * @param {boolean} [props.showLabel=false] - Whether to show rating label
 * @param {string} [props.className] - Additional class names
 */
const RatingStars = ({
  rating = 0,
  onRatingChange,
  interactive = false,
  size = 'md',
  showLabel = false,
  className = '',
}) => {
  // Local state for hover effect when interactive
  const [hoverRating, setHoverRating] = useState(0);
  
  // Size classes for stars
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };
  
  // Container class based on size
  const containerClass = {
    sm: 'space-x-1',
    md: 'space-x-1',
    lg: 'space-x-2',
  };
  
  // Get the star size class
  const starSize = sizeClasses[size] || sizeClasses.md;
  
  // Render the appropriate star based on state
  const renderStar = (index) => {
    // For interactive stars, use hover rating when available
    const activeRating = interactive && hoverRating > 0 ? hoverRating : rating;
    const isFilled = index <= activeRating;
    
    return (
      <svg
        key={index}
        className={`${starSize} ${isFilled ? 'text-yellow-400' : 'text-gray-300'} ${
          interactive ? 'cursor-pointer' : ''
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
        onClick={() => interactive && onRatingChange && onRatingChange(index)}
        onMouseEnter={() => interactive && setHoverRating(index)}
        onMouseLeave={() => interactive && setHoverRating(0)}
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    );
  };
  
  // Get display text for rating
  const getRatingText = () => {
    if (rating === 0) return 'Not Rated';
    return REVIEW_RATING_DISPLAY[rating] || 'Invalid Rating';
  };
  
  return (
    <div className={`flex items-center ${className}`}>
      <div className={`flex ${containerClass[size] || containerClass.md}`} role="group" aria-label={`Rating: ${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((index) => renderStar(index))}
      </div>
      
      {showLabel && (
        <span className={`ml-2 ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'} text-gray-600`}>
          {getRatingText()}
        </span>
      )}
      
      {interactive && (
        <span className={`ml-2 ${size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-base' : 'text-sm'} text-gray-600`}>
          {hoverRating > 0 ? REVIEW_RATING_DISPLAY[hoverRating] : getRatingText()}
        </span>
      )}
    </div>
  );
};

/**
 * Star rating display with count (e.g. "4.5 (123 reviews)")
 */
export const RatingWithCount = ({ rating = 0, count = 0, size = 'sm' }) => {
  return (
    <div className="flex items-center">
      <RatingStars rating={Math.round(rating)} size={size} />
      
      <div className="ml-2 text-sm text-gray-500">
        <span className="font-medium">{rating.toFixed(1)}</span>
        <span className="mx-1">•</span>
        <span>
          {count} {count === 1 ? 'review' : 'reviews'}
        </span>
      </div>
    </div>
  );
};

/**
 * Component to show rating distribution (bars showing count per rating)
 */
export const RatingDistribution = ({ distribution = {}, totalCount = 0 }) => {
  // Sort ratings from highest to lowest
  const sortedRatings = Object.entries(distribution)
    .map(([rating, count]) => ({ rating: Number(rating), count }))
    .sort((a, b) => b.rating - a.rating);
  
  return (
    <div className="space-y-2">
      {sortedRatings.map(({ rating, count }) => {
        // Calculate percentage
        const percentage = totalCount > 0 ? Math.round((count / totalCount) * 100) : 0;
        
        return (
          <div key={rating} className="flex items-center">
            <div className="flex items-center w-16 mr-2">
              <span className="text-sm text-gray-700 mr-1">{rating}</span>
              <svg className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </div>
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-400"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            <div className="w-10 text-right text-xs text-gray-500 ml-2">
              {count}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RatingStars;