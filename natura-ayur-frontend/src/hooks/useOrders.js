import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createOrderAndCheckout,
  fetchOrderById,
  fetchOrderByOrderId,
  fetchUserOrders,
  cancelUserOrder,
  fetchAllOrders,
  updateOrderStatusWithNotification,
  fetchOrderStatistics,
  OrderStatus,
} from "../redux/actions/orderActions";
import {
  selectCurrentOrder,
  selectOrders,
  selectUserOrders,
  selectOrderLoading,
  selectOrderError,
  selectOrderSuccessMessage,
  selectCheckoutUrl,
  selectTotalOrders,
  selectOrderPages,
  selectOrderStatistics,
  selectOrdersByStatus,
  selectPendingOrders,
  selectProcessingOrders,
  selectShippedOrders,
  selectDeliveredOrders,
} from "../redux/selectors/orderSelectors";
import { clearCart } from "../redux/actions/cartActions";

/**
 * Hook for order management functionality
 */
const useOrders = () => {
  const dispatch = useDispatch();

  // Selectors
  const currentOrder = useSelector(selectCurrentOrder);
  const orders = useSelector(selectOrders);
  const userOrders = useSelector(selectUserOrders);
  const loading = useSelector(selectOrderLoading);
  const error = useSelector(selectOrderError);
  const successMessage = useSelector(selectOrderSuccessMessage);
  const checkoutUrl = useSelector(selectCheckoutUrl);
  const totalOrders = useSelector(selectTotalOrders);
  const totalPages = useSelector(selectOrderPages);
  const statistics = useSelector(selectOrderStatistics);
  const pendingOrders = useSelector(selectPendingOrders);
  const processingOrders = useSelector(selectProcessingOrders);
  const shippedOrders = useSelector(selectShippedOrders);
  const deliveredOrders = useSelector(selectDeliveredOrders);

  // Create new order
  const createOrder = useCallback(
    async (orderData) => {
      try {
        const result = await dispatch(
          createOrderAndCheckout(orderData)
        ).unwrap();

        // Clear cart after successful order
        if (result && !result.error) {
          dispatch(clearCart());
        }

        return result;
      } catch (error) {
        return { error: error.message || "Failed to create order" };
      }
    },
    [dispatch]
  );

  // Get order by ID (MongoDB ID)
  const getOrderById = useCallback(
    (orderId) => {
      dispatch(fetchOrderById(orderId));
    },
    [dispatch]
  );

  // Get order by order ID (custom order ID format)
  const getOrderByOrderId = useCallback(
    (orderId) => {
      dispatch(fetchOrderByOrderId(orderId));
    },
    [dispatch]
  );

  // Get current user's orders
  const getUserOrders = useCallback(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  // Cancel an order
  const cancelOrder = useCallback(
    (orderId) => {
      dispatch(cancelUserOrder(orderId));
    },
    [dispatch]
  );

  // Get all orders (for admin/seller)
  const getAllOrders = useCallback(
    (page = 1, limit = 10, status) => {
      dispatch(fetchAllOrders({ page, limit, status }));
    },
    [dispatch]
  );

  // Update order status
  const updateOrderStatus = useCallback(
    (orderId, status) => {
      dispatch(updateOrderStatusWithNotification(orderId, status));
    },
    [dispatch]
  );

  // Get order statistics
  const getOrderStatistics = useCallback(() => {
    dispatch(fetchOrderStatistics());
  }, [dispatch]);

  // Get orders by status
  const getOrdersByStatus = useCallback((status) => {
    return useSelector((state) => selectOrdersByStatus(state, status));
  }, []);

  // Calculate the next status for an order
  const getNextStatus = useCallback((currentStatus) => {
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
  }, []);

  return {
    // State
    currentOrder,
    orders,
    userOrders,
    loading,
    error,
    successMessage,
    checkoutUrl,
    totalOrders,
    totalPages,
    statistics,
    pendingOrders,
    processingOrders,
    shippedOrders,
    deliveredOrders,

    // Actions
    createOrder,
    getOrderById,
    getOrderByOrderId,
    getUserOrders,
    cancelOrder,
    getAllOrders,
    updateOrderStatus,
    getOrderStatistics,
    getOrdersByStatus,
    getNextStatus,

    // Constants
    OrderStatus,
  };
};

export default useOrders;
