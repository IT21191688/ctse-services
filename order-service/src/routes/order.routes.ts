import express from "express";
import { validateUserRoleAndToken } from "../middleware/auth.middleware";
import { ROLES } from "../types/order.types";
import validate from "../middleware/schemavalidator.middleware";
import {
  createOrderSchema,
  updateOrderStatusSchema,
  getOrderSchema,
  getOrderByOrderIdSchema,
  getAllOrdersSchema,
} from "../schema/order.schema";
import {
  createOrder,
  getOrderById,
  getOrderByOrderId,
  getUserOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  getOrderStatistics,
} from "../controllers/order.controller";
import { handleStripeWebhook } from "../controllers/webhook.controller";
import bodyParser from "body-parser";

const router = express.Router();

// Stripe webhook endpoint - no auth, raw body
router.post(
  "/webhook",
  bodyParser.raw({ type: "application/json" }),
  handleStripeWebhook
);

// User routes
router.post(
  "/",
  validateUserRoleAndToken(),
  validate(createOrderSchema),
  createOrder
);

router.get("/my-orders", validateUserRoleAndToken(), getUserOrders);

router.get(
  "/id/:id",
  validateUserRoleAndToken(),
  validate(getOrderSchema),
  getOrderById
);

router.get(
  "/order-id/:orderId",
  validateUserRoleAndToken(),
  validate(getOrderByOrderIdSchema),
  getOrderByOrderId
);

router.post(
  "/:id/cancel",
  validateUserRoleAndToken(),
  validate(getOrderSchema),
  cancelOrder
);

// Admin/Seller routes
router.get(
  "/",
  validateUserRoleAndToken([ROLES.ADMIN, ROLES.SELLER]),
  validate(getAllOrdersSchema),
  getAllOrders
);

router.patch(
  "/:id/status",
  validateUserRoleAndToken([ROLES.ADMIN, ROLES.SELLER]),
  validate(updateOrderStatusSchema),
  updateOrderStatus
);

router.get(
  "/statistics",
  validateUserRoleAndToken([ROLES.ADMIN, ROLES.SELLER]),
  getOrderStatistics
);

export default router;
