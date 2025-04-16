import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  submitReview,
  fetchReviewById,
  fetchProductReviews,
  fetchSellerReviews,
  updateUserReview,
  deleteUserReview,
  markReviewHelpful,
  fetchUserReviews,
  ReviewRating,
  ReviewType,
} from "../redux/actions/reviewActions";
import {
  selectCurrentReview,
  selectProductReviews,
  selectSellerReviews,
  selectUserReviews,
  selectProductReviewsSummary,
  selectSellerReviewsSummary,
  selectReviewLoading,
  selectReviewError,
  selectReviewSuccessMessage,
  selectProductAverageRating,
  selectSellerAverageRating,
  selectProductRatingDistribution,
  selectSellerRatingDistribution,
  selectHasUserReviewedProduct,
  selectHasUserReviewedSeller,
} from "../redux/selectors/reviewSelectors";
import { openModal } from "../redux/slices/uiSlice";
import { selectIsAuthenticated } from "../redux/selectors/authSelectors";

/**
 * Hook for review management functionality
 */
const useReviews = () => {
  const dispatch = useDispatch();

  // Selectors
  const currentReview = useSelector(selectCurrentReview);
  const productReviews = useSelector(selectProductReviews);
  const sellerReviews = useSelector(selectSellerReviews);
  const userReviews = useSelector(selectUserReviews);
  const productReviewsSummary = useSelector(selectProductReviewsSummary);
  const sellerReviewsSummary = useSelector(selectSellerReviewsSummary);
  const loading = useSelector(selectReviewLoading);
  const error = useSelector(selectReviewError);
  const successMessage = useSelector(selectReviewSuccessMessage);
  const productAverageRating = useSelector(selectProductAverageRating);
  const sellerAverageRating = useSelector(selectSellerAverageRating);
  const productRatingDistribution = useSelector(
    selectProductRatingDistribution
  );
  const sellerRatingDistribution = useSelector(selectSellerRatingDistribution);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Write a review
  const addReview = useCallback(
    (reviewData) => {
      if (!isAuthenticated) {
        // If not authenticated, show login modal
        dispatch(
          openModal({
            modalType: "login",
            props: {
              message: "Please log in to submit a review.",
              redirectAfterLogin: true,
            },
          })
        );
        return;
      }

      dispatch(submitReview(reviewData));
    },
    [dispatch, isAuthenticated]
  );

  // Get review by ID
  const getReviewById = useCallback(
    (reviewId) => {
      dispatch(fetchReviewById(reviewId));
    },
    [dispatch]
  );

  // Open the review form modal
  const openReviewForm = useCallback(
    (targetType, targetId, existingReview = null) => {
      dispatch(
        openModal({
          modalType: "reviewForm",
          props: {
            targetType,
            targetId,
            review: existingReview,
          },
        })
      );
    },
    [dispatch]
  );

  // Get reviews for a product
  const getProductReviews = useCallback(
    (productId, filters = {}) => {
      dispatch(fetchProductReviews({ productId, filters }));
    },
    [dispatch]
  );

  // Get reviews for a seller
  const getSellerReviews = useCallback(
    (sellerId, filters = {}) => {
      dispatch(fetchSellerReviews({ sellerId, filters }));
    },
    [dispatch]
  );

  // Get user's own reviews
  const getUserReviews = useCallback(
    (filters = {}) => {
      if (!isAuthenticated) return;
      dispatch(fetchUserReviews(filters));
    },
    [dispatch, isAuthenticated]
  );

  // Update an existing review
  const updateReview = useCallback(
    (reviewId, reviewData) => {
      dispatch(updateUserReview(reviewId, reviewData));
    },
    [dispatch]
  );

  // Delete a review
  const deleteReview = useCallback(
    (reviewId) => {
      dispatch(deleteUserReview(reviewId));
    },
    [dispatch]
  );

  // Mark a review as helpful
  const markAsHelpful = useCallback(
    (reviewId) => {
      dispatch(markReviewHelpful(reviewId));
    },
    [dispatch]
  );

  // Check if user has reviewed a product
  const hasUserReviewedProduct = useCallback((productId) => {
    return useSelector((state) =>
      selectHasUserReviewedProduct(state, productId)
    );
  }, []);

  // Check if user has reviewed a seller
  const hasUserReviewedSeller = useCallback((sellerId) => {
    return useSelector((state) => selectHasUserReviewedSeller(state, sellerId));
  }, []);

  // Convert rating number to display text
  const getRatingText = useCallback((rating) => {
    switch (rating) {
      case ReviewRating.POOR:
        return "Poor";
      case ReviewRating.FAIR:
        return "Fair";
      case ReviewRating.GOOD:
        return "Good";
      case ReviewRating.VERY_GOOD:
        return "Very Good";
      case ReviewRating.EXCELLENT:
        return "Excellent";
      default:
        return "Unknown";
    }
  }, []);

  return {
    // State
    currentReview,
    productReviews,
    sellerReviews,
    userReviews,
    productReviewsSummary,
    sellerReviewsSummary,
    loading,
    error,
    successMessage,
    productAverageRating,
    sellerAverageRating,
    productRatingDistribution,
    sellerRatingDistribution,

    // Actions
    addReview,
    getReviewById,
    openReviewForm,
    getProductReviews,
    getSellerReviews,
    getUserReviews,
    updateReview,
    deleteReview,
    markAsHelpful,
    hasUserReviewedProduct,
    hasUserReviewedSeller,
    getRatingText,

    // Constants
    ReviewRating,
    ReviewType,
  };
};

export default useReviews;
