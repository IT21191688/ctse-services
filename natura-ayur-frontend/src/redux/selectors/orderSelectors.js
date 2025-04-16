import { createSelector } from "@reduxjs/toolkit";
import { OrderStatus } from "../slices/orderSlice";

// Basic selectors
export const selectOrderState = (state) => state.order;
export const selectCurrentOrder = (state) => state.order.order;
export const selectOrders = (state) => state.order.orders;
export const selectUserOrders = (state) => state.order.userOrders;
export const selectTotalOrders = (state) => state.order.totalOrders;
export const selectOrderPages = (state) => state.order.pages;
export const selectOrderStatistics = (state) => state.order.orderStatistics;
export const selectCheckoutUrl = (state) => state.order.checkoutUrl;
export const selectOrderLoading = (state) => state.order.loading;
export const selectOrderError = (state) => state.order.error;
export const selectOrderSuccessMessage = (state) => state.order.successMessage;

// Complex selectors
export const selectOrderById = createSelector(
  [selectOrders, (_, orderId) => orderId],
  (orders, orderId) => orders.find((order) => order._id === orderId)
);

export const selectUserOrderById = createSelector(
  [selectUserOrders, (_, orderId) => orderId],
  (userOrders, orderId) => userOrders.find((order) => order._id === orderId)
);

export const selectOrderByOrderId = createSelector(
  [selectOrders, (_, orderId) => orderId],
  (orders, orderId) => orders.find((order) => order.orderId === orderId)
);

export const selectUserOrderByOrderId = createSelector(
  [selectUserOrders, (_, orderId) => orderId],
  (userOrders, orderId) => userOrders.find((order) => order.orderId === orderId)
);

export const selectOrdersByStatus = createSelector(
  [selectOrders, (_, status) => status],
  (orders, status) => orders.filter((order) => order.status === status)
);

export const selectUserOrdersByStatus = createSelector(
  [selectUserOrders, (_, status) => status],
  (userOrders, status) => userOrders.filter((order) => order.status === status)
);

export const selectRecentOrders = createSelector([selectOrders], (orders) => {
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );
  return sortedOrders.slice(0, 5);
});

export const selectPendingOrders = createSelector([selectOrders], (orders) =>
  orders.filter(
    (order) =>
      order.status === OrderStatus.NEW || order.status === OrderStatus.PENDING
  )
);

export const selectProcessingOrders = createSelector([selectOrders], (orders) =>
  orders.filter((order) => order.status === OrderStatus.PROCESSING)
);

export const selectShippedOrders = createSelector([selectOrders], (orders) =>
  orders.filter((order) => order.status === OrderStatus.SHIPPED)
);

export const selectDeliveredOrders = createSelector([selectOrders], (orders) =>
  orders.filter((order) => order.status === OrderStatus.DELIVERED)
);

export const selectCancelledOrders = createSelector([selectOrders], (orders) =>
  orders.filter((order) => order.status === OrderStatus.CANCELLED)
);

export const selectOrderItemsCount = createSelector(
  [selectCurrentOrder],
  (order) => order?.orderItems?.length || 0
);

export const selectOrderTotalItems = createSelector(
  [selectCurrentOrder],
  (order) => {
    if (!order || !order.orderItems) return 0;
    return order.orderItems.reduce((total, item) => total + item.quantity, 0);
  }
);

export const selectOrderSummary = createSelector(
  [selectCurrentOrder],
  (order) => {
    if (!order) return null;

    return {
      itemsPrice: order.itemsPrice,
      taxPrice: order.taxPrice,
      shippingPrice: order.shippingPrice,
      totalPrice: order.totalPrice,
      isPaid: order.isPaid,
      paidAt: order.paidAt,
      status: order.status,
      deliveredAt: order.deliveredAt,
    };
  }
);

export const selectOrderStatusCounts = createSelector(
  [selectOrderStatistics],
  (statistics) => statistics?.statusCounts || {}
);
