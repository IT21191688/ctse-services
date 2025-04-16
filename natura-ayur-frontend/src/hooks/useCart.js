import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  clearEntireCart,
  fetchCartSummary,
} from "../redux/actions/cartActions";
import {
  selectCartItems,
  selectCartTotalPrice,
  selectCartItemCount,
  selectCartLoading,
  selectCartError,
  selectCartSuccessMessage,
  selectIsCartEmpty,
  selectCartSubtotal,
  selectCartTax,
  selectCartShipping,
  selectCartTotal,
  selectCartForCheckout,
} from "../redux/selectors/cartSelectors";
import { openModal } from "../redux/slices/uiSlice";
import { selectIsAuthenticated } from "../redux/selectors/authSelectors";

/**
 * Hook for cart management functionality
 */
const useCart = () => {
  const dispatch = useDispatch();

  // Selectors
  const items = useSelector(selectCartItems);
  const totalPrice = useSelector(selectCartTotalPrice);
  const itemCount = useSelector(selectCartItemCount);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const successMessage = useSelector(selectCartSuccessMessage);
  const isEmpty = useSelector(selectIsCartEmpty);
  const subtotal = useSelector(selectCartSubtotal);
  const tax = useSelector(selectCartTax);
  const shipping = useSelector(selectCartShipping);
  const total = useSelector(selectCartTotal);
  const checkoutData = useSelector(selectCartForCheckout);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // Load cart data
  const loadCart = useCallback(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // Add item to cart
  const addToCart = useCallback(
    (productId, quantity = 1) => {
      if (!isAuthenticated) {
        // If not authenticated, show login modal
        dispatch(
          openModal({
            modalType: "login",
            props: {
              message: "Please log in to add items to your cart.",
              redirectAfterLogin: true,
            },
          })
        );
        return;
      }

      dispatch(addItemToCart(productId, quantity));
    },
    [dispatch, isAuthenticated]
  );

  // Update item quantity
  const updateQuantity = useCallback(
    (productId, quantity) => {
      dispatch(updateCartItemQuantity(productId, quantity));
    },
    [dispatch]
  );

  // Remove item from cart
  const removeItem = useCallback(
    (productId) => {
      dispatch(removeItemFromCart(productId));
    },
    [dispatch]
  );

  // Clear entire cart
  const clearCart = useCallback(() => {
    dispatch(clearEntireCart());
  }, [dispatch]);

  // Get cart summary
  const getCartSummary = useCallback(() => {
    dispatch(fetchCartSummary());
  }, [dispatch]);

  // Proceed to checkout
  const proceedToCheckout = useCallback(() => {
    if (!isAuthenticated) {
      // If not authenticated, show login modal
      dispatch(
        openModal({
          modalType: "login",
          props: {
            message: "Please log in to checkout.",
            redirectAfterLogin: true,
          },
        })
      );
      return;
    }

    // Navigate to checkout
    window.location.href = "/checkout";
  }, [dispatch, isAuthenticated]);

  return {
    // State
    items,
    totalPrice,
    itemCount,
    loading,
    error,
    successMessage,
    isEmpty,
    subtotal,
    tax,
    shipping,
    total,
    checkoutData,

    // Actions
    loadCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    getCartSummary,
    proceedToCheckout,
  };
};

export default useCart;
