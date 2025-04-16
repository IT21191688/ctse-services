import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { orderAPI } from "../../api/order.api";

// Async thunks
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await orderAPI.createOrder(orderData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create order"
      );
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "order/fetchOrderById",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getOrderById(orderId);
      return response.order;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order"
      );
    }
  }
);

export const fetchOrderByOrderId = createAsyncThunk(
  "order/fetchOrderByOrderId",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getOrderByOrderId(orderId);
      return response.order;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order"
      );
    }
  }
);

export const fetchUserOrders = createAsyncThunk(
  "order/fetchUserOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getUserOrders();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user orders"
      );
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "order/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await orderAPI.cancelOrder(orderId);
      return response.order;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel order"
      );
    }
  }
);

export const fetchAllOrders = createAsyncThunk(
  "order/fetchAllOrders",
  async ({ page, limit, status }, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getAllOrders(page, limit, status);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch all orders"
      );
    }
  }
);

export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const response = await orderAPI.updateOrderStatus(orderId, status);
      return response.order;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update order status"
      );
    }
  }
);

export const fetchOrderStatistics = createAsyncThunk(
  "order/fetchOrderStatistics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await orderAPI.getOrderStatistics();
      return response.statistics;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order statistics"
      );
    }
  }
);

// Order statuses enum
export const OrderStatus = {
  NEW: "new",
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  REJECTED: "rejected",
  APPROVED: "approved",
};

// Initial state
const initialState = {
  order: null,
  orders: [],
  userOrders: [],
  totalOrders: 0,
  pages: 1,
  orderStatistics: null,
  checkoutUrl: null,
  loading: false,
  error: null,
  successMessage: null,
};

// Slice
const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null;
    },
    clearOrderSuccessMessage: (state) => {
      state.successMessage = null;
    },
    resetOrderState: () => initialState,
    clearCheckoutUrl: (state) => {
      state.checkoutUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Order
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload.order;
        state.checkoutUrl = action.payload.checkoutUrl;
        state.successMessage = "Order created successfully";
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Order by Order ID
      .addCase(fetchOrderByOrderId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderByOrderId.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(fetchOrderByOrderId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch User Orders
      .addCase(fetchUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload.orders;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Cancel Order
      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;

        // Update the order in userOrders if present
        const orderIndex = state.userOrders.findIndex(
          (o) => o._id === action.payload._id
        );
        if (orderIndex !== -1) {
          state.userOrders[orderIndex] = action.payload;
        }

        state.successMessage = "Order cancelled successfully";
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch All Orders (Admin/Seller)
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.total;
        state.pages = action.payload.pages;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Order Status
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;

        // Update in current order if present
        if (state.order && state.order._id === action.payload._id) {
          state.order = action.payload;
        }

        // Update in orders list if present
        const orderIndex = state.orders.findIndex(
          (o) => o._id === action.payload._id
        );
        if (orderIndex !== -1) {
          state.orders[orderIndex] = action.payload;
        }

        // Update in user orders if present
        const userOrderIndex = state.userOrders.findIndex(
          (o) => o._id === action.payload._id
        );
        if (userOrderIndex !== -1) {
          state.userOrders[userOrderIndex] = action.payload;
        }

        state.successMessage = `Order status updated to ${action.payload.status}`;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Order Statistics
      .addCase(fetchOrderStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.orderStatistics = action.payload;
      })
      .addCase(fetchOrderStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearOrderError,
  clearOrderSuccessMessage,
  resetOrderState,
  clearCheckoutUrl,
} = orderSlice.actions;

export default orderSlice.reducer;
