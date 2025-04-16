import { z } from "zod";
import mongoose from "mongoose";
import { OrderStatus } from "../types/order.types";

// Helper function to check if a string is a valid MongoDB ObjectId
const isValidObjectId = (id: string): boolean => {
  return mongoose.Types.ObjectId.isValid(id);
};

export const createOrderSchema = z.object({
  body: z.object({
    orderItems: z
      .array(
        z.object({
          product: z
            .string()
            .refine(isValidObjectId, { message: "Invalid product ID" }),
          name: z.string().min(1, "Product name is required"),
          price: z.number().positive("Price must be positive"),
          image: z.string().url("Image must be a valid URL"),
          quantity: z
            .number()
            .int()
            .positive("Quantity must be a positive integer"),
        })
      )
      .min(1, "Order must contain at least one item"),

    shippingAddress: z.object({
      address: z.string().min(5, "Address must be at least 5 characters"),
      city: z.string().min(2, "City must be at least 2 characters"),
      postalCode: z
        .string()
        .min(3, "Postal code must be at least 3 characters"),
      country: z.string().min(2, "Country must be at least 2 characters"),
    }),

    paymentMethod: z.string().min(2, "Payment method is required"),

    // Optional email for guest checkout
    customerEmail: z.string().email("Invalid email address").optional(),
  }),
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    id: z.string().refine(isValidObjectId, { message: "Invalid order ID" }),
  }),
  body: z.object({
    status: z.enum(Object.values(OrderStatus) as [string, ...string[]], {
      errorMap: () => ({ message: "Invalid order status" }),
    }),
  }),
});

export const getOrderSchema = z.object({
  params: z.object({
    id: z.string().refine(isValidObjectId, { message: "Invalid order ID" }),
  }),
});

export const getOrderByOrderIdSchema = z.object({
  params: z.object({
    orderId: z.string().min(10, "Invalid order ID"),
  }),
});

export const getAllOrdersSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).optional(),
    limit: z.string().regex(/^\d+$/).transform(Number).optional(),
    status: z
      .enum(Object.values(OrderStatus) as [string, ...string[]])
      .optional(),
  }),
});
