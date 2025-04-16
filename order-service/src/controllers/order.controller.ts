import { Request, Response } from "express";
import * as OrderService from "../services/order.service";
import logger from "../config/logger.config";
import { BadRequestError } from "../errors";
import { OrderStatus } from "../types/order.types";

// Create a new order
export const createOrder = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized: User not authenticated",
      });
    }

    const token = req.headers.authorization?.split(" ")[1] || "";

    // Add user ID to the order input
    const orderInput = {
      ...req.body,
      userId: user.id,
      customerEmail: user.email || req.body.customerEmail,
    };

    const result = await OrderService.createOrder(orderInput, token);

    return res.status(201).json({
      message: "Order created successfully",
      order: result.order,
      checkoutUrl: result.checkoutUrl,
    });
  } catch (error: any) {
    logger.error(`Error creating order: ${error.message}`);
    return res.status(400).json({ message: error.message });
  }
};

// Get order by ID
export const getOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await OrderService.getOrderById(id);

    return res.status(200).json({
      order,
    });
  } catch (error: any) {
    logger.error(`Error getting order: ${error.message}`);
    return res.status(400).json({ message: error.message });
  }
};

// Get order by order ID
export const getOrderByOrderId = async (req: Request, res: Response) => {
  try {
    const { orderId } = req.params;
    const order = await OrderService.getOrderByOrderId(orderId);

    return res.status(200).json({
      order,
    });
  } catch (error: any) {
    logger.error(`Error getting order: ${error.message}`);
    return res.status(400).json({ message: error.message });
  }
};

// Get orders for current user
export const getUserOrders = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(401).json({
        message: "Unauthorized: User not authenticated",
      });
    }

    const orders = await OrderService.getUserOrders(user.id);

    return res.status(200).json({
      count: orders.length,
      orders,
    });
  } catch (error: any) {
    logger.error(`Error getting user orders: ${error.message}`);
    return res.status(400).json({ message: error.message });
  }
};

// Get all orders (admin/seller only)
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status as OrderStatus;

    const result = await OrderService.getAllOrders(page, limit, status);

    return res.status(200).json({
      orders: result.orders,
      page,
      pages: result.pages,
      total: result.total,
    });
  } catch (error: any) {
    logger.error(`Error getting all orders: ${error.message}`);
    return res.status(400).json({ message: error.message });
  }
};

// Update order status
export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!Object.values(OrderStatus).includes(status)) {
      throw new BadRequestError("Invalid order status");
    }

    const updatedOrder = await OrderService.updateOrderStatus({
      orderId: id,
      status,
    });

    return res.status(200).json({
      message: `Order status updated to ${status}`,
      order: updatedOrder,
    });
  } catch (error: any) {
    logger.error(`Error updating order status: ${error.message}`);
    return res.status(400).json({ message: error.message });
  }
};

// Cancel an order
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const order = await OrderService.cancelOrder(id);

    return res.status(200).json({
      message: "Order cancelled successfully",
      order,
    });
  } catch (error: any) {
    logger.error(`Error cancelling order: ${error.message}`);
    return res.status(400).json({ message: error.message });
  }
};

// Get order statistics
export const getOrderStatistics = async (req: Request, res: Response) => {
  try {
    const statistics = await OrderService.getOrderStatistics();

    return res.status(200).json({
      statistics,
    });
  } catch (error: any) {
    logger.error(`Error getting order statistics: ${error.message}`);
    return res.status(400).json({ message: error.message });
  }
};
