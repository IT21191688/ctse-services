import api from "./index";

export const reviewAPI = {
  // Add a new review
  addReview: async (reviewData) => {
    const response = await api.post("/api/reviews", reviewData);
    return response.data;
  },

  // Get a review by ID
  getReviewById: async (reviewId) => {
    const response = await api.get(`/api/reviews/${reviewId}`);
    return response.data;
  },

  // Get reviews for a product
  getProductReviews: async (productId, filters = {}) => {
    const params = new URLSearchParams();

    // Add filters to query params
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== null) {
        params.append(key, filters[key]);
      }
    });

    const response = await api.get(
      `/api/reviews/product/${productId}?${params.toString()}`
    );
    return response.data;
  },

  // Get reviews for a seller
  getSellerReviews: async (sellerId, filters = {}) => {
    const params = new URLSearchParams();

    // Add filters to query params
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== null) {
        params.append(key, filters[key]);
      }
    });

    const response = await api.get(
      `/api/reviews/seller/${sellerId}?${params.toString()}`
    );
    return response.data;
  },

  // Update a review
  updateReview: async (reviewId, reviewData) => {
    const response = await api.patch(`/api/reviews/${reviewId}`, reviewData);
    return response.data;
  },

  // Delete a review
  deleteReview: async (reviewId) => {
    const response = await api.delete(`/api/reviews/${reviewId}`);
    return response.data;
  },

  // Mark a review as helpful
  markReviewAsHelpful: async (reviewId) => {
    const response = await api.post(`/api/reviews/helpful/${reviewId}`);
    return response.data;
  },

  // Get current user's reviews
  getUserReviews: async (filters = {}) => {
    const params = new URLSearchParams();

    // Add filters to query params
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== null) {
        params.append(key, filters[key]);
      }
    });

    const response = await api.get(
      `/api/reviews/user/my-reviews?${params.toString()}`
    );
    return response.data;
  },
};

export default reviewAPI;
