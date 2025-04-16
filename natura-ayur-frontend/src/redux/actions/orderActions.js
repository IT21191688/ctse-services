import {
  createOrder,
  fetchOrderById,
  fetchOrderByOrderId,
  fetchUserOrders,
  cancelOrder,
  fetchAllOrders,
  updateOrderStatus,
  fetchOrderStatistics,
  clearOrderError,
  clearOrderSuccessMessage,
  resetOrderState,
  clearCheckoutUrl,
  OrderStatus,
} from "../slices/orderSlice";

// Export all order thunks and actions for easier access
export {
  createOrder,
  fetchOrderById,
  fetchOrderByOrderId,
  fetchUserOrders,
  cancelOrder,
  fetchAllOrders,
  updateOrderStatus,
  fetchOrderStatistics,
  clearOrderError,
  clearOrderSuccessMessage,
  resetOrderState,
  clearCheckoutUrl,
  OrderStatus,
};

// Action to create order and handle checkout redirect
export const createOrderAndCheckout = (orderData) => async (dispatch) => {
  try {
    const resultAction = await dispatch(createOrder(orderData));
    if (createOrder.fulfilled.match(resultAction)) {
      const { checkoutUrl } = resultAction.payload;

      // If we have a checkout URL, redirect to it
      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        dispatch({
          type: "ui/addNotification",
          payload: {
            type: "success",
            message: "Order created successfully",
          },
        });
      }
    }
    return resultAction;
  } catch (error) {
    dispatch({
      type: "ui/addNotification",
      payload: {
        type: "error",
        message: error.message || "Failed to create order",
      },
    });
    throw error;
  }
};

// Action to cancel an order with notification
export const cancelUserOrder = (orderId) => async (dispatch) => {
  try {
    const resultAction = await dispatch(cancelOrder(orderId));
    if (cancelOrder.fulfilled.match(resultAction)) {
      dispatch({
        type: "ui/addNotification",
        payload: {
          type: "success",
          message: "Order cancelled successfully",
        },
      });
    }
    return resultAction;
  } catch (error) {
    dispatch({
      type: "ui/addNotification",
      payload: {
        type: "error",
        message: error.message || "Failed to cancel order",
      },
    });
    throw error;
  }
};

// Action to update order status with notification
export const updateOrderStatusWithNotification =
  (orderId, status) => async (dispatch) => {
    try {
      const resultAction = await dispatch(
        updateOrderStatus({ orderId, status })
      );
      if (updateOrderStatus.fulfilled.match(resultAction)) {
        dispatch({
          type: "ui/addNotification",
          payload: {
            type: "success",
            message: `Order status updated to ${status}`,
          },
        });
      }
      return resultAction;
    } catch (error) {
      dispatch({
        type: "ui/addNotification",
        payload: {
          type: "error",
          message: error.message || "Failed to update order status",
        },
      });
      throw error;
    }
  };

// Action to load orders dashboard data (for sellers/admins)
export const loadOrdersDashboard = () => async (dispatch) => {
  try {
    // Fetch initial order data and statistics
    await Promise.all([
      dispatch(fetchAllOrders({ page: 1, limit: 10 })),
      dispatch(fetchOrderStatistics()),
    ]);
  } catch (error) {
    dispatch({
      type: "ui/addNotification",
      payload: {
        type: "error",
        message: "Failed to load orders dashboard",
      },
    });
  }
};

// Helper function to get the next order status based on current status
export const getNextOrderStatus = (currentStatus) => {
  switch (currentStatus) {
    case OrderStatus.NEW:
      return OrderStatus.PROCESSING;
    case OrderStatus.PROCESSING:
      return OrderStatus.SHIPPED;
    case OrderStatus.SHIPPED:
      return OrderStatus.DELIVERED;
    default:
      return currentStatus;
  }
};
