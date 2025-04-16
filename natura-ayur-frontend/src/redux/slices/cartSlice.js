import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartAPI } from "../../api/cart.api";

// Async thunks
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.getCart();
      return response.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart"
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.addToCart(productId, quantity);
      return response.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add to cart"
      );
    }
  }
);

export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const response = await cartAPI.updateCartItem(productId, quantity);
      return response.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update cart item"
      );
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await cartAPI.removeFromCart(productId);
      return response.cart;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove cart item"
      );
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.clearCart();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to clear cart"
      );
    }
  }
);

export const fetchCartSummary = createAsyncThunk(
  "cart/fetchCartSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await cartAPI.getCartSummary();
      return response.summary;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch cart summary"
      );
    }
  }
);

// Initial state
const initialState = {
  items: [],
  totalPrice: 0,
  itemCount: 0,
  loading: false,
  error: null,
  successMessage: null,
};

// Slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCartError: (state) => {
      state.error = null;
    },
    clearCartSuccessMessage: (state) => {
      state.successMessage = null;
    },
    resetCartState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.items = action.payload.items || [];
          state.totalPrice = action.payload.totalPrice || 0;
          state.itemCount = state.items.reduce(
            (count, item) => count + item.quantity,
            0
          );
        }
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalPrice = action.payload.totalPrice || 0;
        state.itemCount = state.items.reduce(
          (count, item) => count + item.quantity,
          0
        );
        state.successMessage = "Item added to cart successfully";
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalPrice = action.payload.totalPrice || 0;
        state.itemCount = state.items.reduce(
          (count, item) => count + item.quantity,
          0
        );
        state.successMessage = "Cart updated successfully";
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Remove Cart Item
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalPrice = action.payload.totalPrice || 0;
        state.itemCount = state.items.reduce(
          (count, item) => count + item.quantity,
          0
        );
        state.successMessage = "Item removed from cart successfully";
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.totalPrice = 0;
        state.itemCount = 0;
        state.successMessage = "Cart cleared successfully";
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Cart Summary
      .addCase(fetchCartSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCartSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.itemCount = action.payload.itemCount || 0;
        state.totalPrice = action.payload.totalPrice || 0;
      })
      .addCase(fetchCartSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCartError, clearCartSuccessMessage, resetCartState } =
  cartSlice.actions;

export default cartSlice.reducer;
