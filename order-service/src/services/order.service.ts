import mongoose from "mongoose";
import Order from "../models/order.model";
import { BadRequestError } from "../errors";
import {
  IOrder,
  IOrderInput,
  IStripeSession,
  OrderStatus,
  IOrderStatusUpdate,
} from "../types/order.types";
import { generateOrderId } from "../utils/order-id-generator";
import {
  reserveProductStock,
  confirmProductReservation,
  cancelProductReservation,
  clearUserCart,
  getUserDetails,
} from "../utils/service-clients";
import {
  generateOrderConfirmationEmail,
  generateOrderStatusUpdateEmail,
  generateOrderShippedEmail,
} from "../utils/email-templates";
import { sendEmail } from "./email.service";
import logger from "../config/logger.config";
import stripe from "../config/stripe.config";

// Create a new order
export async function createOrder(
  orderInput: IOrderInput,
  token: string
): Promise<{ order: IOrder; checkoutUrl: string }> {
  const mongoSession = await mongoose.startSession();
  mongoSession.startTransaction();

  try {
    const { userId, orderItems, shippingAddress, paymentMethod } = orderInput;

    // Generate a unique order ID
    const orderId = generateOrderId();

    // Reserve product stock
    const reserveResult = await reserveProductStock(
      orderItems.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      })),
      token
    );

    // Calculate prices
    const itemsPrice = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const taxPrice = itemsPrice * 0.15; // 15% tax
    const shippingPrice = itemsPrice > 100 ? 0 : 10; // Free shipping for orders over $100
    const totalPrice = itemsPrice + taxPrice + shippingPrice;

    // Create order in database
    const order = await Order.create({
      orderId,
      user: userId,
      orderItems: orderItems.map((item) => ({
        product: item.product,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: false,
      status: OrderStatus.NEW,
    });

    // Create a Stripe Checkout session
    const stripeItems = orderItems.map((item) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
            images: [item.image],
          },
          unit_amount: Math.round(item.price * 100), // Stripe uses cents
        },
        quantity: item.quantity,
      };
    });

    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: shippingPrice * 100,
              currency: "usd",
            },
            display_name: "Standard Shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 3,
              },
              maximum: {
                unit: "business_day",
                value: 5,
              },
            },
          },
        },
      ],
      line_items: stripeItems,
      mode: "payment",
      success_url: `${process.env.FRONTEND_URL}/order-success?orderId=${orderId}`,
      cancel_url: `${process.env.FRONTEND_URL}/cart?canceled=true`,
      metadata: {
        order_id: order._id.toString(),
        orderId: orderId,
      },
      // We'll fix this in the next step
    });

    await mongoSession.commitTransaction();

    // Clear the user's cart
    await clearUserCart(token);

    return {
      order,
      checkoutUrl: stripeSession.url || "",
    };
  } catch (error) {
    await mongoSession.abortTransaction();
    throw error;
  } finally {
    mongoSession.endSession();
  }
}

// Process the order payment
export async function processOrderPayment(
  sessionData: IStripeSession
): Promise<IOrder> {
  try {
    // Find the order
    const order = await Order.findOne({
      _id: sessionData.metadata.order_id,
    });

    if (!order) {
      throw new BadRequestError("Order not found");
    }

    // Update order with payment information
    order.isPaid = true;
    order.paidAt = new Date();
    order.status = OrderStatus.PROCESSING;
    order.paymentResult = {
      id: sessionData.id,
      status: sessionData.payment_status,
      update_time: new Date().toISOString(),
      email_address: sessionData.customer_email,
    };

    const updatedOrder = await order.save();

    // Confirm product reservation
    await confirmProductReservation(
      sessionData.metadata.orderId,
      order.orderItems.map((item) => ({
        product: item.product.toString(),
        quantity: item.quantity,
      })),
      "internal-token" // In a real system, use a service-to-service authentication token
    );

    // Fetch user details and send confirmation email
    const userDetails = await getUserDetails(
      order.user.toString(),
      "internal-token"
    );

    if (userDetails && userDetails.email) {
      const emailHtml = generateOrderConfirmationEmail(
        `${userDetails.firstName} ${userDetails.lastName}`,
        order.orderId,
        order.orderItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        order.totalPrice
      );

      await sendEmail({
        to: userDetails.email,
        subject: `Order Confirmation - ${order.orderId}`,
        html: emailHtml,
      });
    }

    return updatedOrder;
  } catch (error) {
    logger.error(`Error processing payment: ${error}`);
    throw error;
  }
}

// Get order by ID
export async function getOrderById(orderId: string): Promise<IOrder> {
  const order = await Order.findById(orderId).populate(
    "user",
    "firstName lastName email"
  );

  if (!order) {
    throw new BadRequestError("Order not found");
  }

  return order;
}

// Get order by order ID
export async function getOrderByOrderId(orderId: string): Promise<IOrder> {
  const order = await Order.findOne({ orderId }).populate(
    "user",
    "firstName lastName email"
  );

  if (!order) {
    throw new BadRequestError("Order not found");
  }

  return order;
}

// Get orders for a user
export async function getUserOrders(userId: string): Promise<IOrder[]> {
  return await Order.find({ user: userId }).sort({ createdAt: -1 });
}

// Get all orders (admin/seller only)
export async function getAllOrders(
  page: number = 1,
  limit: number = 10,
  status?: OrderStatus
): Promise<{ orders: IOrder[]; total: number; pages: number }> {
  const query = status ? { status } : {};
  const skip = (page - 1) * limit;

  const orders = await Order.find(query)
    .populate("user", "firstName lastName email")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit);

  const total = await Order.countDocuments(query);
  const pages = Math.ceil(total / limit);

  return { orders, total, pages };
}

// Update order status
export async function updateOrderStatus({
  orderId,
  status,
}: IOrderStatusUpdate): Promise<IOrder> {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new BadRequestError("Order not found");
  }

  order.status = status;

  // Additional status-specific updates
  if (status === OrderStatus.DELIVERED) {
    order.deliveredAt = new Date();
  }

  const updatedOrder = await order.save();

  // Fetch user details and send status update email
  try {
    const userDetails = await getUserDetails(
      order.user.toString(),
      "internal-token"
    );

    if (userDetails && userDetails.email) {
      let emailHtml;

      if (status === OrderStatus.SHIPPED) {
        emailHtml = generateOrderShippedEmail(
          `${userDetails.firstName} ${userDetails.lastName}`,
          order.orderId
        );
      } else {
        emailHtml = generateOrderStatusUpdateEmail(
          `${userDetails.firstName} ${userDetails.lastName}`,
          order.orderId,
          status
        );
      }

      await sendEmail({
        to: userDetails.email,
        subject: `Order Status Update - ${order.orderId}`,
        html: emailHtml,
      });
    }
  } catch (error) {
    // Log but don't fail the order update if email sending fails
    logger.error(`Failed to send order status email: ${error}`);
  }

  return updatedOrder;
}

// Cancel an order
export async function cancelOrder(orderId: string): Promise<IOrder> {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new BadRequestError("Order not found");
  }

  // Can only cancel orders that aren't delivered or shipped
  if ([OrderStatus.DELIVERED, OrderStatus.SHIPPED].includes(order.status)) {
    throw new BadRequestError(
      "Cannot cancel order that has been shipped or delivered"
    );
  }

  order.status = OrderStatus.CANCELLED;
  const updatedOrder = await order.save();

  // If order was paid, handle refund logic here
  // For now, we'll just restore product stock
  if (order.isPaid) {
    try {
      await cancelProductReservation(
        order.orderId,
        order.orderItems.map((item) => ({
          product: item.product.toString(),
          quantity: item.quantity,
        })),
        "internal-token"
      );
    } catch (error) {
      logger.error(`Failed to restore product stock: ${error}`);
    }
  }

  return updatedOrder;
}

// Get order statistics
export async function getOrderStatistics(): Promise<{
  totalOrders: number;
  totalRevenue: number;
  recentOrders: IOrder[];
  statusCounts: Record<OrderStatus, number>;
}> {
  // Get total number of orders
  const totalOrders = await Order.countDocuments({ isPaid: true });

  // Get total revenue from paid orders
  const revenueResult = await Order.aggregate([
    { $match: { isPaid: true } },
    { $group: { _id: null, total: { $sum: "$totalPrice" } } },
  ]);
  const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

  // Get recent orders
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("user", "firstName lastName");

  // Get counts by status
  const statusCounts: Partial<Record<OrderStatus, number>> = {};

  for (const status of Object.values(OrderStatus)) {
    const count = await Order.countDocuments({ status });
    statusCounts[status] = count;
  }

  return {
    totalOrders,
    totalRevenue,
    recentOrders,
    statusCounts: statusCounts as Record<OrderStatus, number>,
  };
}
