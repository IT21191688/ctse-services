import { createSlice } from "@reduxjs/toolkit";

// Initial state
const initialState = {
  notifications: [],
  modals: {
    login: false,
    register: false,
    forgotPassword: false,
    addToCart: false,
    quickView: false,
    deleteConfirm: false,
    becomeSellerForm: false,
    reviewForm: false,
  },
  currentModalProps: {},
  globalLoading: false,
  maintenanceMode: false,
  sidebarOpen: false,
  searchOpen: false,
  filtersOpen: false,
  theme: "light",
};

// Helper function to generate unique IDs for notifications
const generateId = () => Math.random().toString(36).substr(2, 9);

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    // Notification actions
    addNotification: (state, action) => {
      const notification = {
        id: generateId(),
        type: action.payload.type || "info",
        message: action.payload.message,
        autoClose: action.payload.autoClose !== false,
        duration: action.payload.duration || 5000,
      };
      state.notifications.push(notification);
    },
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        (notification) => notification.id !== action.payload
      );
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },

    // Modal actions
    openModal: (state, action) => {
      const { modalType, props = {} } = action.payload;
      if (state.modals[modalType] !== undefined) {
        state.modals[modalType] = true;
        state.currentModalProps = props;
      }
    },
    closeModal: (state, action) => {
      const modalType = action.payload;
      if (state.modals[modalType] !== undefined) {
        state.modals[modalType] = false;
      }
    },
    closeAllModals: (state) => {
      Object.keys(state.modals).forEach((modal) => {
        state.modals[modal] = false;
      });
      state.currentModalProps = {};
    },

    // Loading state
    setGlobalLoading: (state, action) => {
      state.globalLoading = action.payload;
    },

    // Maintenance mode
    setMaintenanceMode: (state, action) => {
      state.maintenanceMode = action.payload;
    },

    // Sidebar state
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarState: (state, action) => {
      state.sidebarOpen = action.payload;
    },

    // Search bar state
    toggleSearch: (state) => {
      state.searchOpen = !state.searchOpen;
    },
    setSearchState: (state, action) => {
      state.searchOpen = action.payload;
    },

    // Filter panel state
    toggleFilters: (state) => {
      state.filtersOpen = !state.filtersOpen;
    },
    setFiltersState: (state, action) => {
      state.filtersOpen = action.payload;
    },

    // Theme toggle
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
    setTheme: (state, action) => {
      state.theme = action.payload;
    },
  },
});

export const {
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  closeAllModals,
  setGlobalLoading,
  setMaintenanceMode,
  toggleSidebar,
  setSidebarState,
  toggleSearch,
  setSearchState,
  toggleFilters,
  setFiltersState,
  toggleTheme,
  setTheme,
} = uiSlice.actions;

export default uiSlice.reducer;
