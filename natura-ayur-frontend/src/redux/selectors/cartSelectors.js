import { createSelector } from "@reduxjs/toolkit";

// Basic selectors
export const selectCartState = (state) => state.cart;
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotalPrice = (state) => state.cart.totalPrice;
export const selectCartItemCount = (state) => state.cart.itemCount;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;
export const selectCartSuccessMessage = (state) => state.cart.successMessage;

// Complex selectors
export const selectCartItemById = createSelector(
  [selectCartItems, (_, productId) => productId],
  (items, productId) =>
    items.find((item) => item.product.toString() === productId)
);

export const selectCartItemQuantity = createSelector(
  [selectCartItemById],
  (item) => item?.quantity || 0
);

export const selectIsCartEmpty = createSelector(
  [selectCartItems],
  (items) => items.length === 0
);

export const selectCartSubtotal = createSelector([selectCartItems], (items) =>
  items.reduce((sum, item) => sum + item.price * item.quantity, 0)
);

export const selectCartTax = createSelector(
  [selectCartSubtotal],
  (subtotal) => Math.round(subtotal * 0.15 * 100) / 100 // 15% tax
);

export const selectCartShipping = createSelector(
  [selectCartSubtotal],
  (subtotal) => (subtotal > 100 ? 0 : 10) // Free shipping over $100
);

export const selectCartTotal = createSelector(
  [selectCartSubtotal, selectCartTax, selectCartShipping],
  (subtotal, tax, shipping) => subtotal + tax + shipping
);

export const selectCartForCheckout = createSelector(
  [selectCartItems, selectCartTotal, selectCartTax, selectCartShipping],
  (items, total, tax, shipping) => ({
    orderItems: items.map((item) => ({
      product: item.product,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: item.quantity,
    })),
    itemsPrice: total - tax - shipping,
    taxPrice: tax,
    shippingPrice: shipping,
    totalPrice: total,
  })
);
