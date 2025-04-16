import axios from "axios";
import logger from "../config/logger.config";
import { BadRequestError } from "../errors";

const PRODUCT_SERVICE_URL =
  process.env.PRODUCT_SERVICE_URL || "http://localhost:8003";
const CART_SERVICE_URL =
  process.env.CART_SERVICE_URL || "http://localhost:8002";
const USER_SERVICE_URL =
  process.env.USER_SERVICE_URL || "http://localhost:8001";

// Function to get product details from the Product Service
export async function getProductDetails(productId: string, token: string) {
  try {
    const response = await axios.get(
      `${PRODUCT_SERVICE_URL}/api/v1/products/${productId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.product;
  } catch (error: any) {
    logger.error(`Error getting product details: ${error.message}`);
    throw new BadRequestError(
      error.response?.data?.error || "Failed to get product details"
    );
  }
}

// Function to clear the cart after creating an order
export async function clearUserCart(token: string) {
  try {
    await axios.delete(`${CART_SERVICE_URL}/api/v1/cart/clear`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return true;
  } catch (error: any) {
    logger.error(`Error clearing user cart: ${error.message}`);
    // Don't throw error here, just log it
    return false;
  }
}

// Function to get user details from the Auth Service
export async function getUserDetails(userId: string, token: string) {
  try {
    const response = await axios.get(
      `${USER_SERVICE_URL}/api/v1/user/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.user;
  } catch (error: any) {
    logger.error(`Error getting user details: ${error.message}`);
    throw new BadRequestError(
      error.response?.data?.error || "Failed to get user details"
    );
  }
}

// Function to reserve product stock
export async function reserveProductStock(
  items: { product: string; quantity: number }[],
  token: string
) {
  try {
    const response = await axios.post(
      `${PRODUCT_SERVICE_URL}/api/v1/products/internal/reserve`,
      { items },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    logger.error(`Error reserving product stock: ${error.message}`);
    throw new BadRequestError(
      error.response?.data?.error || "Failed to reserve product stock"
    );
  }
}

// Function to confirm product stock reservation
export async function confirmProductReservation(
  reservationId: string,
  items: { product: string; quantity: number }[],
  token: string
) {
  try {
    const response = await axios.post(
      `${PRODUCT_SERVICE_URL}/api/v1/products/internal/confirm-reservation/${reservationId}`,
      { items },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    logger.error(`Error confirming product reservation: ${error.message}`);
    // Don't throw error here, just log it
    return false;
  }
}

// Function to cancel product stock reservation
export async function cancelProductReservation(
  reservationId: string,
  items: { product: string; quantity: number }[],
  token: string
) {
  try {
    const response = await axios.delete(
      `${PRODUCT_SERVICE_URL}/api/v1/products/internal/reservation/${reservationId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { items },
      }
    );

    return response.data;
  } catch (error: any) {
    logger.error(`Error cancelling product reservation: ${error.message}`);
    // Don't throw error here, just log it
    return false;
  }
}
