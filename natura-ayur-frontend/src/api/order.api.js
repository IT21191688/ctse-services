import api from "./index";

export const orderAPI = {
  // Create a new order
  createOrder: async (orderData) => {
    const response = await api.post("/api/orders", orderData);
    return response.data;
  },

  // Get an order by ID
  getOrderById: async (orderId) => {
    const response = await api.get(`/api/orders/id/${orderId}`);
    return response.data;
  },

  // Get an order by order ID (not MongoDB ID)
  getOrderByOrderId: async (orderId) => {
    const response = await api.get(`/api/orders/order-id/${orderId}`);
    return response.data;
  },

  // Get current user's orders
  getUserOrders: async () => {
    const response = await api.get("/api/orders/my-orders");
    return response.data;
  },

  // Cancel an order
  cancelOrder: async (orderId) => {
    const response = await api.post(`/api/orders/${orderId}/cancel`);
    return response.data;
  },

  // Admin/Seller: Get all orders
  getAllOrders: async (page = 1, limit = 10, status = "") => {
    const params = new URLSearchParams({
      page,
      limit,
    });

    if (status) {
      params.append("status", status);
    }

    const response = await api.get(`/api/orders?${params.toString()}`);
    return response.data;
  },

  // Admin/Seller: Update order status
  updateOrderStatus: async (orderId, status) => {
    const response = await api.patch(`/api/orders/${orderId}/status`, {
      status,
    });
    return response.data;
  },

  // Admin/Seller: Get order statistics
  getOrderStatistics: async () => {
    const response = await api.get("/api/orders/statistics");
    return response.data;
  },
};

export default orderAPI;
