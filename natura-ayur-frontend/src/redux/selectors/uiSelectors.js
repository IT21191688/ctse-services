import { createSelector } from "@reduxjs/toolkit";

// Basic selectors
export const selectUiState = (state) => state.ui;
export const selectNotifications = (state) => state.ui.notifications;
export const selectModals = (state) => state.ui.modals;
export const selectCurrentModalProps = (state) => state.ui.currentModalProps;
export const selectGlobalLoading = (state) => state.ui.globalLoading;
export const selectMaintenanceMode = (state) => state.ui.maintenanceMode;
export const selectSidebarOpen = (state) => state.ui.sidebarOpen;
export const selectSearchOpen = (state) => state.ui.searchOpen;
export const selectFiltersOpen = (state) => state.ui.filtersOpen;
export const selectTheme = (state) => state.ui.theme;

// Modal selectors
export const selectModalOpen = (modalType) =>
  createSelector([selectModals], (modals) => modals[modalType] || false);

export const selectLoginModalOpen = createSelector(
  [selectModals],
  (modals) => modals.login || false
);

export const selectRegisterModalOpen = createSelector(
  [selectModals],
  (modals) => modals.register || false
);

export const selectForgotPasswordModalOpen = createSelector(
  [selectModals],
  (modals) => modals.forgotPassword || false
);

export const selectAddToCartModalOpen = createSelector(
  [selectModals],
  (modals) => modals.addToCart || false
);

export const selectQuickViewModalOpen = createSelector(
  [selectModals],
  (modals) => modals.quickView || false
);

export const selectDeleteConfirmModalOpen = createSelector(
  [selectModals],
  (modals) => modals.deleteConfirm || false
);

export const selectBecomeSellerFormModalOpen = createSelector(
  [selectModals],
  (modals) => modals.becomeSellerForm || false
);

export const selectReviewFormModalOpen = createSelector(
  [selectModals],
  (modals) => modals.reviewForm || false
);

// Notifications selector
export const selectLatestNotification = createSelector(
  [selectNotifications],
  (notifications) => notifications[0] || null
);

// Theme selector
export const selectIsDarkTheme = createSelector(
  [selectTheme],
  (theme) => theme === "dark"
);

// Global state selectors
export const selectIsAnyModalOpen = createSelector([selectModals], (modals) =>
  Object.values(modals).some((isOpen) => isOpen)
);

export const selectAppState = createSelector(
  [selectGlobalLoading, selectMaintenanceMode, selectIsDarkTheme],
  (globalLoading, maintenanceMode, isDarkTheme) => ({
    globalLoading,
    maintenanceMode,
    isDarkTheme,
  })
);
