import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { submitReview, updateUserReview, ReviewRating, ReviewType } from '../../redux/actions/reviewActions';
import { closeModal } from '../../redux/slices/uiSlice';
import { selectCurrentModalProps } from '../../redux/selectors/uiSelectors';
import { selectReviewLoading, selectReviewError, selectCurrentReview } from '../../redux/selectors/reviewSelectors';
import Input, { Textarea } from '../common/Input';
import Button from '../common/Button';
import RatingStars from './RatingStars';

/**
 * Review form component for adding or editing reviews
 * 
 * @param {Object} props
 * @param {Object} [props.product] - Product being reviewed (for product reviews)
 * @param {Object} [props.seller] - Seller being reviewed (for seller reviews)
 * @param {Object} [props.review] - Existing review (for edit mode)
 * @param {Function} [props.onSuccess] - Callback function on successful submission
 * @param {Function} [props.onCancel] - Callback function on cancel
 */
const ReviewForm = ({ product, seller, review, onSuccess, onCancel }) => {
  const dispatch = useDispatch();
  
  // Get modal props if opened via modal
  const modalProps = useSelector(selectCurrentModalProps);
  const loading = useSelector(selectReviewLoading);
  const error = useSelector(selectReviewError);
  const currentReview = useSelector(selectCurrentReview);
  
  // Use props from modal if available
  const reviewProduct = product || modalProps?.product;
  const reviewSeller = seller || modalProps?.seller;
  const editReview = review || modalProps?.review || currentReview;
  
  // Determine review type
  const reviewType = reviewProduct 
    ? ReviewType.PRODUCT 
    : reviewSeller 
      ? ReviewType.SELLER 
      : null;
  
  // Form state
  const [formData, setFormData] = useState({
    rating: ReviewRating.GOOD,
    title: '',
    comment: '',
    images: []
  });
  
  // Form validation state
  const [formErrors, setFormErrors] = useState({});
  
  // Set form data from existing review if in edit mode
  useEffect(() => {
    if (editReview) {
      setFormData({
        rating: editReview.review?.rating || formData.rating,
        title: editReview.review?.title || '',
        comment: editReview.review?.comment || '',
        images: editReview.review?.images || []
      });
    }
  }, [editReview]);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  // Handle rating change
  const handleRatingChange = (rating) => {
    setFormData((prev) => ({
      ...prev,
      rating
    }));
    
    // Clear rating error
    if (formErrors.rating) {
      setFormErrors((prev) => ({
        ...prev,
        rating: null
      }));
    }
  };
  
  // Handle image upload
  const handleImageUpload = (e) => {
    // Implementation for image uploads would go here
    // This would likely involve FileReader and potentially
    // uploading to a server/S3 bucket
    
    // For now, we'll just show a placeholder message
    alert('Image upload functionality would be implemented here.');
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    // Rating is required
    if (!formData.rating) {
      errors.rating = 'Please select a rating';
    }
    
    // Comment is required
    if (!formData.comment.trim()) {
      errors.comment = 'Please enter a review comment';
    } else if (formData.comment.length < 10) {
      errors.comment = 'Comment must be at least 10 characters';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    // Prepare review data
    const reviewData = {
      targetId: reviewProduct?._id || reviewSeller?._id,
      targetType: reviewType,
      ...formData
    };
    
    try {
      if (editReview) {
        // Update existing review
        await dispatch(updateUserReview(editReview.review._id, reviewData));
      } else {
        // Submit new review
        await dispatch(submitReview(reviewData));
      }
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
      
      // Close modal if this is in a modal
      dispatch(closeModal('reviewForm'));
    } catch (error) {
      console.error('Review submission failed:', error);
    }
  };
  
  // Handle cancel
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      dispatch(closeModal('reviewForm'));
    }
  };
  
  // If no product or seller is provided, show an error
  if (!reviewProduct && !reviewSeller) {
    return (
      <div className="text-center p-6">
        <p className="text-red-600">Error: No product or seller to review.</p>
        <Button 
          className="mt-4" 
          variant="outline" 
          onClick={handleCancel}
        >
          Close
        </Button>
      </div>
    );
  }
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">
        {editReview ? 'Edit Review' : 'Write a Review'}
      </h2>
      
      {/* Target information */}
      <div className="flex items-center mb-6 bg-gray-50 p-4 rounded-md">
        <div className="w-16 h-16 flex-shrink-0 mr-4">
          <img 
            src={reviewProduct?.images?.[0] || reviewSeller?.logo || '/placeholder.jpg'} 
            alt={reviewProduct?.name || reviewSeller?.storeName || 'Review target'} 
            className="w-full h-full object-cover rounded-md"
          />
        </div>
        <div>
          <p className="font-medium text-gray-900">
            {reviewProduct?.name || reviewSeller?.storeName}
          </p>
          <p className="text-sm text-gray-500">
            {reviewProduct 
              ? `Product by ${reviewProduct.brand}` 
              : `Seller on NaturaAyur`}
          </p>
        </div>
      </div>
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-4">
          {error}
        </div>
      )}
      
      {/* Review form */}
      <form onSubmit={handleSubmit}>
        {/* Rating */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rating <span className="text-red-500">*</span>
          </label>
          
          <RatingStars 
            rating={formData.rating} 
            onRatingChange={handleRatingChange}
            size="lg"
            interactive
          />
          
          {formErrors.rating && (
            <p className="mt-1 text-sm text-red-600">
              {formErrors.rating}
            </p>
          )}
        </div>
        
        {/* Review Title */}
        <Input
          name="title"
          label="Review Title"
          placeholder="Summarize your experience"
          value={formData.title}
          onChange={handleChange}
          error={formErrors.title}
        />
        
        {/* Review Comment */}
        <Textarea
          name="comment"
          label="Review Comment"
          placeholder="Share your experience in detail. What did you like or dislike? Would you recommend this to others?"
          rows={5}
          value={formData.comment}
          onChange={handleChange}
          error={formErrors.comment}
          required
        />
        
        {/* Image Upload (optional) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Add Photos (Optional)
          </label>
          
          <div className="mt-1 flex items-center">
            {/* Display existing images */}
            {formData.images && formData.images.length > 0 ? (
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative w-16 h-16 rounded-md overflow-hidden">
                    <img 
                      src={image} 
                      alt={`Review image ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                      onClick={() => {
                        const newImages = [...formData.images];
                        newImages.splice(index, 1);
                        setFormData({ ...formData, images: newImages });
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
            
            {/* Upload button */}
            <label className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500">
              <svg className="h-5 w-5 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Photos
              <input
                type="file"
                className="sr-only"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
              />
            </label>
            
            <span className="ml-2 text-xs text-gray-500">
              (Max 5 images, 5MB each)
            </span>
          </div>
        </div>
        
        {/* Buttons */}
        <div className="flex justify-end space-x-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
          >
            Cancel
          </Button>
          
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
          >
            {editReview ? 'Update Review' : 'Submit Review'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;