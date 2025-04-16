import { createSelector } from "@reduxjs/toolkit";

// Basic selectors
export const selectAuthState = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectAuthSuccessMessage = (state) => state.auth.successMessage;
export const selectEmailVerified = (state) => state.auth.emailVerified;
export const selectPasswordResetSuccess = (state) =>
  state.auth.passwordResetSuccess;

// Complex selectors
export const selectUserRole = createSelector(
  [selectUser],
  (user) => user?.role || null
);

export const selectIsAdmin = createSelector(
  [selectUserRole],
  (role) => role === "admin"
);

export const selectIsSeller = createSelector(
  [selectUserRole],
  (role) => role === "seller"
);

export const selectUserFullName = createSelector([selectUser], (user) => {
  if (!user) return "";
  return `${user.firstName || ""} ${user.lastName || ""}`.trim();
});

export const selectUserAvatar = createSelector(
  [selectUser],
  (user) => user?.avatar || null
);

export const selectUserAddress = createSelector(
  [selectUser],
  (user) => user?.address || null
);

export const selectSellerInfo = createSelector(
  [selectUser],
  (user) => user?.seller || null
);

export const selectHasAddress = createSelector(
  [selectUserAddress],
  (address) => {
    if (!address) return false;
    return !!(
      address.street &&
      address.city &&
      address.postalCode &&
      address.province
    );
  }
);
