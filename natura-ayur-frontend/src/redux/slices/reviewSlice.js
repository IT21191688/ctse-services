import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { reviewAPI } from "../../api/review.api";

// Review rating enum
export const ReviewRating = {
  POOR: 1,
  FAIR: 2,
  GOOD: 3,
  VERY_GOOD: 4,
  EXCELLENT: 5,
};

// Review type enum
export const ReviewType = {
  PRODUCT: "product",
  SELLER: "seller",
};

// Async thunks
export const addReview = createAsyncThunk(
  "review/addReview",
  async (reviewData, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.addReview(reviewData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add review"
      );
    }
  }
);

export const fetchReviewById = createAsyncThunk(
  "review/fetchReviewById",
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.getReviewById(reviewId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch review"
      );
    }
  }
);

export const fetchProductReviews = createAsyncThunk(
  "review/fetchProductReviews",
  async ({ productId, filters }, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.getProductReviews(productId, filters);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product reviews"
      );
    }
  }
);

export const fetchSellerReviews = createAsyncThunk(
  "review/fetchSellerReviews",
  async ({ sellerId, filters }, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.getSellerReviews(sellerId, filters);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch seller reviews"
      );
    }
  }
);

export const updateReview = createAsyncThunk(
  "review/updateReview",
  async ({ reviewId, reviewData }, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.updateReview(reviewId, reviewData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update review"
      );
    }
  }
);

export const deleteReview = createAsyncThunk(
  "review/deleteReview",
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.deleteReview(reviewId);
      return { reviewId, message: response.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete review"
      );
    }
  }
);

export const markReviewAsHelpful = createAsyncThunk(
  "review/markReviewAsHelpful",
  async (reviewId, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.markReviewAsHelpful(reviewId);
      return { reviewId, helpfulVotes: response.helpfulVotes };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to mark review as helpful"
      );
    }
  }
);

export const fetchUserReviews = createAsyncThunk(
  "review/fetchUserReviews",
  async (filters, { rejectWithValue }) => {
    try {
      const response = await reviewAPI.getUserReviews(filters);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user reviews"
      );
    }
  }
);

// Initial state
const initialState = {
  review: null,
  productReviews: [],
  sellerReviews: [],
  userReviews: [],
  productReviewsSummary: null,
  sellerReviewsSummary: null,
  totalReviews: 0,
  pages: 1,
  loading: false,
  error: null,
  successMessage: null,
};

// Slice
const reviewSlice = createSlice({
  name: "review",
  initialState,
  reducers: {
    clearReviewError: (state) => {
      state.error = null;
    },
    clearReviewSuccessMessage: (state) => {
      state.successMessage = null;
    },
    resetReviewState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Add Review
      .addCase(addReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        state.review = action.payload.review;

        // Add to appropriate reviews list
        if (action.payload.review.targetType === ReviewType.PRODUCT) {
          state.productReviews.unshift(action.payload);
        } else if (action.payload.review.targetType === ReviewType.SELLER) {
          state.sellerReviews.unshift(action.payload);
        }

        // Add to user reviews
        state.userReviews.unshift(action.payload);

        state.successMessage = "Review added successfully";
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Review by ID
      .addCase(fetchReviewById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewById.fulfilled, (state, action) => {
        state.loading = false;
        state.review = action.payload.review;
      })
      .addCase(fetchReviewById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Product Reviews
      .addCase(fetchProductReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.productReviews = action.payload.reviews;
        state.productReviewsSummary = action.payload.summary;
        state.totalReviews = action.payload.total;
        state.pages = action.payload.pages;
      })
      .addCase(fetchProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Seller Reviews
      .addCase(fetchSellerReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.sellerReviews = action.payload.reviews;
        state.sellerReviewsSummary = action.payload.summary;
        state.totalReviews = action.payload.total;
        state.pages = action.payload.pages;
      })
      .addCase(fetchSellerReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Review
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        state.review = action.payload.review;

        // Update in product reviews if present
        const productReviewIndex = state.productReviews.findIndex(
          (r) => r.review._id === action.payload.review._id
        );
        if (productReviewIndex !== -1) {
          state.productReviews[productReviewIndex] = action.payload;
        }

        // Update in seller reviews if present
        const sellerReviewIndex = state.sellerReviews.findIndex(
          (r) => r.review._id === action.payload.review._id
        );
        if (sellerReviewIndex !== -1) {
          state.sellerReviews[sellerReviewIndex] = action.payload;
        }

        // Update in user reviews if present
        const userReviewIndex = state.userReviews.findIndex(
          (r) => r.review._id === action.payload.review._id
        );
        if (userReviewIndex !== -1) {
          state.userReviews[userReviewIndex] = action.payload;
        }

        state.successMessage = "Review updated successfully";
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;

        // Remove from product reviews if present
        state.productReviews = state.productReviews.filter(
          (r) => r.review._id !== action.payload.reviewId
        );

        // Remove from seller reviews if present
        state.sellerReviews = state.sellerReviews.filter(
          (r) => r.review._id !== action.payload.reviewId
        );

        // Remove from user reviews if present
        state.userReviews = state.userReviews.filter(
          (r) => r.review._id !== action.payload.reviewId
        );

        state.successMessage = action.payload.message;
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mark Review as Helpful
      .addCase(markReviewAsHelpful.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markReviewAsHelpful.fulfilled, (state, action) => {
        state.loading = false;

        // Update helpful votes in current review if present
        if (state.review && state.review._id === action.payload.reviewId) {
          state.review.helpfulVotes = action.payload.helpfulVotes;
        }

        // Update in product reviews if present
        const productReviewIndex = state.productReviews.findIndex(
          (r) => r.review._id === action.payload.reviewId
        );
        if (productReviewIndex !== -1) {
          state.productReviews[productReviewIndex].review.helpfulVotes =
            action.payload.helpfulVotes;
        }

        // Update in seller reviews if present
        const sellerReviewIndex = state.sellerReviews.findIndex(
          (r) => r.review._id === action.payload.reviewId
        );
        if (sellerReviewIndex !== -1) {
          state.sellerReviews[sellerReviewIndex].review.helpfulVotes =
            action.payload.helpfulVotes;
        }

        // Update in user reviews if present
        const userReviewIndex = state.userReviews.findIndex(
          (r) => r.review._id === action.payload.reviewId
        );
        if (userReviewIndex !== -1) {
          state.userReviews[userReviewIndex].review.helpfulVotes =
            action.payload.helpfulVotes;
        }

        state.successMessage = "Review marked as helpful";
      })
      .addCase(markReviewAsHelpful.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch User Reviews
      .addCase(fetchUserReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.userReviews = action.payload.reviews;
        state.totalReviews = action.payload.total;
        state.pages = action.payload.pages;
      })
      .addCase(fetchUserReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReviewError, clearReviewSuccessMessage, resetReviewState } =
  reviewSlice.actions;

export default reviewSlice.reducer;
