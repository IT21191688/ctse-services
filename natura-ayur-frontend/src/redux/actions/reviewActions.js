import {
  addReview,
  fetchReviewById,
  fetchProductReviews,
  fetchSellerReviews,
  updateReview,
  deleteReview,
  markReviewAsHelpful,
  fetchUserReviews,
  clearReviewError,
  clearReviewSuccessMessage,
  resetReviewState,
  ReviewRating,
  ReviewType,
} from "../slices/reviewSlice";

// Export all review thunks and actions for easier access
export {
  addReview,
  fetchReviewById,
  fetchProductReviews,
  fetchSellerReviews,
  updateReview,
  deleteReview,
  markReviewAsHelpful,
  fetchUserReviews,
  clearReviewError,
  clearReviewSuccessMessage,
  resetReviewState,
  ReviewRating,
  ReviewType,
};

// Action to add review with notification
export const submitReview = (reviewData) => async (dispatch) => {
  try {
    const resultAction = await dispatch(addReview(reviewData));
    if (addReview.fulfilled.match(resultAction)) {
      dispatch({
        type: "ui/addNotification",
        payload: {
          type: "success",
          message: "Review submitted successfully",
        },
      });

      // Close review modal if open
      dispatch({ type: "ui/closeModal", payload: "reviewForm" });
    }
    return resultAction;
  } catch (error) {
    dispatch({
      type: "ui/addNotification",
      payload: {
        type: "error",
        message: error.message || "Failed to submit review",
      },
    });
    throw error;
  }
};

// Action to update review with notification
export const updateUserReview = (reviewId, reviewData) => async (dispatch) => {
  try {
    const resultAction = await dispatch(updateReview({ reviewId, reviewData }));
    if (updateReview.fulfilled.match(resultAction)) {
      dispatch({
        type: "ui/addNotification",
        payload: {
          type: "success",
          message: "Review updated successfully",
        },
      });

      // Close review modal if open
      dispatch({ type: "ui/closeModal", payload: "reviewForm" });
    }
    return resultAction;
  } catch (error) {
    dispatch({
      type: "ui/addNotification",
      payload: {
        type: "error",
        message: error.message || "Failed to update review",
      },
    });
    throw error;
  }
};

// Action to delete review with notification
export const deleteUserReview = (reviewId) => async (dispatch) => {
  try {
    const resultAction = await dispatch(deleteReview(reviewId));
    if (deleteReview.fulfilled.match(resultAction)) {
      dispatch({
        type: "ui/addNotification",
        payload: {
          type: "success",
          message: "Review deleted successfully",
        },
      });
    }
    return resultAction;
  } catch (error) {
    dispatch({
      type: "ui/addNotification",
      payload: {
        type: "error",
        message: error.message || "Failed to delete review",
      },
    });
    throw error;
  }
};

// Action to mark review as helpful with notification
export const markReviewHelpful = (reviewId) => async (dispatch) => {
  try {
    const resultAction = await dispatch(markReviewAsHelpful(reviewId));
    if (markReviewAsHelpful.fulfilled.match(resultAction)) {
      dispatch({
        type: "ui/addNotification",
        payload: {
          type: "success",
          message: "Review marked as helpful. Thank you for your feedback!",
        },
      });
    }
    return resultAction;
  } catch (error) {
    // For this action, we don't show error notifications as it's not critical
    console.error("Failed to mark review as helpful:", error);
  }
};

// Action to load product reviews with default filters
export const loadProductReviews = (productId) => async (dispatch) => {
  try {
    await dispatch(
      fetchProductReviews({
        productId,
        filters: { sortBy: "createdAt", order: "-1" },
      })
    );
  } catch (error) {
    dispatch({
      type: "ui/addNotification",
      payload: {
        type: "error",
        message: "Failed to load product reviews",
      },
    });
  }
};

// Action to load seller reviews with default filters
export const loadSellerReviews = (sellerId) => async (dispatch) => {
  try {
    await dispatch(
      fetchSellerReviews({
        sellerId,
        filters: { sortBy: "createdAt", order: "-1" },
      })
    );
  } catch (error) {
    dispatch({
      type: "ui/addNotification",
      payload: {
        type: "error",
        message: "Failed to load seller reviews",
      },
    });
  }
};
