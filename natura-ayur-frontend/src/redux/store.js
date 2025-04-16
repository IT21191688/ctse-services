import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import productReducer from "./slices/productSlice";
import orderReducer from "./slices/orderSlice";
import reviewReducer from "./slices/reviewSlice";
import uiReducer from "./slices/uiSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    product: productReducer,
    order: orderReducer,
    review: reviewReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: [
          "auth/registerUser/fulfilled",
          "auth/updateProfile/fulfilled",
        ],
        // Ignore these field paths in state
        ignoredPaths: ["auth.user.avatar", "product.productForm.images"],
      },
    }),
});

export default store;
