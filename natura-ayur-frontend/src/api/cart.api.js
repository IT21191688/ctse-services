import api from "./index";

export const cartAPI = {
  // Get the user's cart
  getCart: async () => {
    const response = await api.get("/api/cart");
    return response.data;
  },

  // Add an item to the cart
  addToCart: async (productId, quantity) => {
    const response = await api.post("/api/cart/add", {
      productId,
      quantity,
    });
    return response.data;
  },

  // Update a cart item's quantity
  updateCartItem: async (productId, quantity) => {
    const response = await api.patch("/api/cart/update", {
      productId,
      quantity,
    });
    return response.data;
  },

  // Remove an item from the cart
  removeFromCart: async (productId) => {
    const response = await api.delete(`/api/cart/remove/${productId}`);
    return response.data;
  },

  // Clear the entire cart
  clearCart: async () => {
    const response = await api.delete("/api/cart/clear");
    return response.data;
  },

  // Get cart summary (count and total)
  getCartSummary: async () => {
    const response = await api.get("/api/cart/summary");
    return response.data;
  },
};

export default cartAPI;
