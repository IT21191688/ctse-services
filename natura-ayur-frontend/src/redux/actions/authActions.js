import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateProfile,
  becomeSeller,
  verifyEmail,
  forgotPassword,
  resetPassword,
  clearError,
  clearSuccessMessage,
  resetAuthState,
} from "../slices/authSlice";

// Export all auth thunks and actions for easier access
export {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateProfile,
  becomeSeller,
  verifyEmail,
  forgotPassword,
  resetPassword,
  clearError,
  clearSuccessMessage,
  resetAuthState,
};

// Convenience action creator for error handling
export const handleAuthError = (error, dispatch) => {
  if (error && error.message) {
    dispatch({
      type: "ui/addNotification",
      payload: { type: "error", message: error.message },
    });
  }
  return dispatch(clearError());
};

// Convenience action creator for success messaging
export const handleAuthSuccess = (message, dispatch) => {
  if (message) {
    dispatch({
      type: "ui/addNotification",
      payload: { type: "success", message },
    });
  }
  return dispatch(clearSuccessMessage());
};
