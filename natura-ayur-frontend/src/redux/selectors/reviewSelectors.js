import { createSelector } from "@reduxjs/toolkit";
import { ReviewRating, ReviewType } from "../slices/reviewSlice";

// Basic selectors
export const selectReviewState = (state) => state.review;
export const selectCurrentReview = (state) => state.review.review;
export const selectProductReviews = (state) => state.review.productReviews;
export const selectSellerReviews = (state) => state.review.sellerReviews;
export const selectUserReviews = (state) => state.review.userReviews;
export const selectProductReviewsSummary = (state) =>
  state.review.productReviewsSummary;
export const selectSellerReviewsSummary = (state) =>
  state.review.sellerReviewsSummary;
export const selectTotalReviews = (state) => state.review.totalReviews;
export const selectReviewPages = (state) => state.review.pages;
export const selectReviewLoading = (state) => state.review.loading;
export const selectReviewError = (state) => state.review.error;
export const selectReviewSuccessMessage = (state) =>
  state.review.successMessage;

// Complex selectors
export const selectReviewById = createSelector(
  [
    selectProductReviews,
    selectSellerReviews,
    selectUserReviews,
    (_, reviewId) => reviewId,
  ],
  (productReviews, sellerReviews, userReviews, reviewId) => {
    // Check in product reviews
    const productReview = productReviews.find((r) => r.review._id === reviewId);
    if (productReview) return productReview;

    // Check in seller reviews
    const sellerReview = sellerReviews.find((r) => r.review._id === reviewId);
    if (sellerReview) return sellerReview;

    // Check in user reviews
    const userReview = userReviews.find((r) => r.review._id === reviewId);
    if (userReview) return userReview;

    return null;
  }
);

export const selectProductReviewByProductId = createSelector(
  [selectProductReviews, (_, productId) => productId],
  (productReviews, productId) =>
    productReviews.filter(
      (review) =>
        review.review.targetId === productId &&
        review.review.targetType === ReviewType.PRODUCT
    )
);

export const selectSellerReviewBySellerId = createSelector(
  [selectSellerReviews, (_, sellerId) => sellerId],
  (sellerReviews, sellerId) =>
    sellerReviews.filter(
      (review) =>
        review.review.targetId === sellerId &&
        review.review.targetType === ReviewType.SELLER
    )
);

export const selectUserReviewsForProduct = createSelector(
  [selectUserReviews, (_, productId) => productId],
  (userReviews, productId) =>
    userReviews.filter(
      (review) =>
        review.review.targetId === productId &&
        review.review.targetType === ReviewType.PRODUCT
    )
);

export const selectUserReviewsForSeller = createSelector(
  [selectUserReviews, (_, sellerId) => sellerId],
  (userReviews, sellerId) =>
    userReviews.filter(
      (review) =>
        review.review.targetId === sellerId &&
        review.review.targetType === ReviewType.SELLER
    )
);

export const selectHasUserReviewedProduct = createSelector(
  [selectUserReviewsForProduct],
  (reviews) => reviews.length > 0
);

export const selectHasUserReviewedSeller = createSelector(
  [selectUserReviewsForSeller],
  (reviews) => reviews.length > 0
);

export const selectProductAverageRating = createSelector(
  [selectProductReviewsSummary],
  (summary) => summary?.averageRating || 0
);

export const selectSellerAverageRating = createSelector(
  [selectSellerReviewsSummary],
  (summary) => summary?.averageRating || 0
);

export const selectProductRatingDistribution = createSelector(
  [selectProductReviewsSummary],
  (summary) => {
    if (!summary) return null;

    const { ratingDistribution, totalReviews } = summary;

    // Calculate percentages
    return Object.entries(ratingDistribution).map(([rating, count]) => ({
      rating: parseInt(rating),
      count,
      percentage:
        totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0,
    }));
  }
);

export const selectSellerRatingDistribution = createSelector(
  [selectSellerReviewsSummary],
  (summary) => {
    if (!summary) return null;

    const { ratingDistribution, totalReviews } = summary;

    // Calculate percentages
    return Object.entries(ratingDistribution).map(([rating, count]) => ({
      rating: parseInt(rating),
      count,
      percentage:
        totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0,
    }));
  }
);

export const selectProductReviewsFiltered = createSelector(
  [selectProductReviews, (_, rating) => rating],
  (reviews, rating) => {
    if (!rating) return reviews;
    return reviews.filter((review) => review.review.rating === rating);
  }
);

export const selectSellerReviewsFiltered = createSelector(
  [selectSellerReviews, (_, rating) => rating],
  (reviews, rating) => {
    if (!rating) return reviews;
    return reviews.filter((review) => review.review.rating === rating);
  }
);

export const selectTopProductReviews = createSelector(
  [selectProductReviews],
  (reviews) => {
    // Sort by helpful votes and then by newest
    return [...reviews]
      .sort((a, b) => {
        if (b.review.helpfulVotes !== a.review.helpfulVotes) {
          return b.review.helpfulVotes - a.review.helpfulVotes;
        }
        return new Date(b.review.createdAt) - new Date(a.review.createdAt);
      })
      .slice(0, 3);
  }
);
