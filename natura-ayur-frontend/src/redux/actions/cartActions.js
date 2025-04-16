import {
  fetchCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  fetchCartSummary,
  clearCartError,
  clearCartSuccessMessage,
  resetCartState,
} from "../slices/cartSlice";

// Export all cart thunks and actions for easier access
export {
  fetchCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  fetchCartSummary,
  clearCartError,
  clearCartSuccessMessage,
  resetCartState,
};

// Action to add item to cart with UI notification
export const addItemToCart =
  (productId, quantity = 1) =>
  async (dispatch) => {
    try {
      const resultAction = await dispatch(addToCart({ productId, quantity }));
      if (addToCart.fulfilled.match(resultAction)) {
        dispatch({
          type: "ui/addNotification",
          payload: {
            type: "success",
            message: "Item added to cart successfully",
          },
        });
      }
      return resultAction;
    } catch (error) {
      dispatch({
        type: "ui/addNotification",
        payload: {
          type: "error",
          message: error.message || "Failed to add item to cart",
        },
      });
      throw error;
    }
  };

// Action to remove item from cart with UI notification
export const removeItemFromCart = (productId) => async (dispatch) => {
  try {
    const resultAction = await dispatch(removeCartItem(productId));
    if (removeCartItem.fulfilled.match(resultAction)) {
      dispatch({
        type: "ui/addNotification",
        payload: {
          type: "success",
          message: "Item removed from cart",
        },
      });
    }
    return resultAction;
  } catch (error) {
    dispatch({
      type: "ui/addNotification",
      payload: {
        type: "error",
        message: error.message || "Failed to remove item from cart",
      },
    });
    throw error;
  }
};

// Action to update cart item quantity with UI notification
export const updateCartItemQuantity =
  (productId, quantity) => async (dispatch) => {
    try {
      const resultAction = await dispatch(
        updateCartItem({ productId, quantity })
      );
      if (updateCartItem.fulfilled.match(resultAction)) {
        dispatch({
          type: "ui/addNotification",
          payload: {
            type: "success",
            message: "Cart updated successfully",
          },
        });
      }
      return resultAction;
    } catch (error) {
      dispatch({
        type: "ui/addNotification",
        payload: {
          type: "error",
          message: error.message || "Failed to update cart",
        },
      });
      throw error;
    }
  };

// Action to clear the entire cart with UI notification
export const clearEntireCart = () => async (dispatch) => {
  try {
    const resultAction = await dispatch(clearCart());
    if (clearCart.fulfilled.match(resultAction)) {
      dispatch({
        type: "ui/addNotification",
        payload: {
          type: "success",
          message: "Cart cleared successfully",
        },
      });
    }
    return resultAction;
  } catch (error) {
    dispatch({
      type: "ui/addNotification",
      payload: {
        type: "error",
        message: error.message || "Failed to clear cart",
      },
    });
    throw error;
  }
};
