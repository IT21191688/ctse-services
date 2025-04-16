import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
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
} from "../redux/actions/authActions";
import {
  selectIsAuthenticated,
  selectUser,
  selectUserRole,
  selectAuthLoading,
  selectAuthError,
  selectAuthSuccessMessage,
  selectIsAdmin,
  selectIsSeller,
  selectUserFullName,
  selectUserAvatar,
} from "../redux/selectors/authSelectors";
import { addNotification } from "../redux/slices/uiSlice";

/**
 * Hook for authentication related functionality
 */
const useAuth = () => {
  const dispatch = useDispatch();

  // Selectors
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const userRole = useSelector(selectUserRole);
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const successMessage = useSelector(selectAuthSuccessMessage);
  const isAdmin = useSelector(selectIsAdmin);
  const isSeller = useSelector(selectIsSeller);
  const fullName = useSelector(selectUserFullName);
  const avatar = useSelector(selectUserAvatar);

  // Register a new user
  const register = useCallback(
    async (userData) => {
      try {
        const resultAction = await dispatch(registerUser(userData));
        if (registerUser.fulfilled.match(resultAction)) {
          dispatch(
            addNotification({
              type: "success",
              message:
                "Registration successful! Please check your email to verify your account.",
            })
          );
          return resultAction.payload;
        }
        return null;
      } catch (error) {
        dispatch(
          addNotification({
            type: "error",
            message: error.message || "Registration failed. Please try again.",
          })
        );
        return null;
      }
    },
    [dispatch]
  );

  // Login a user
  const login = useCallback(
    async (credentials) => {
      try {
        const resultAction = await dispatch(loginUser(credentials));
        if (loginUser.fulfilled.match(resultAction)) {
          dispatch(
            addNotification({
              type: "success",
              message: "Login successful! Welcome back.",
            })
          );

          // Fetch user profile after login
          dispatch(getUserProfile());

          return resultAction.payload;
        }
        return null;
      } catch (error) {
        dispatch(
          addNotification({
            type: "error",
            message:
              error.message || "Login failed. Please check your credentials.",
          })
        );
        return null;
      }
    },
    [dispatch]
  );

  // Logout the current user
  const logout = useCallback(() => {
    dispatch(logoutUser());
    dispatch(
      addNotification({
        type: "info",
        message: "You have been logged out successfully.",
      })
    );
  }, [dispatch]);

  // Get the current user's profile
  const getProfile = useCallback(() => {
    dispatch(getUserProfile());
  }, [dispatch]);

  // Update user profile
  const updateUserProfile = useCallback(
    async (profileData) => {
      try {
        const resultAction = await dispatch(updateProfile(profileData));
        if (updateProfile.fulfilled.match(resultAction)) {
          dispatch(
            addNotification({
              type: "success",
              message: "Profile updated successfully!",
            })
          );
          return resultAction.payload;
        }
        return null;
      } catch (error) {
        dispatch(
          addNotification({
            type: "error",
            message:
              error.message || "Failed to update profile. Please try again.",
          })
        );
        return null;
      }
    },
    [dispatch]
  );

  // Become a seller
  const becomeSellerAccount = useCallback(
    async (sellerData) => {
      try {
        const resultAction = await dispatch(becomeSeller(sellerData));
        if (becomeSeller.fulfilled.match(resultAction)) {
          dispatch(
            addNotification({
              type: "success",
              message: "Congratulations! You are now a seller.",
            })
          );
          return resultAction.payload;
        }
        return null;
      } catch (error) {
        dispatch(
          addNotification({
            type: "error",
            message:
              error.message || "Failed to become a seller. Please try again.",
          })
        );
        return null;
      }
    },
    [dispatch]
  );

  // Verify email
  const verifyUserEmail = useCallback(
    async (token) => {
      try {
        const resultAction = await dispatch(verifyEmail(token));
        if (verifyEmail.fulfilled.match(resultAction)) {
          dispatch(
            addNotification({
              type: "success",
              message: "Email verified successfully! You can now log in.",
            })
          );
          return resultAction.payload;
        }
        return null;
      } catch (error) {
        dispatch(
          addNotification({
            type: "error",
            message:
              error.message || "Failed to verify email. Please try again.",
          })
        );
        return null;
      }
    },
    [dispatch]
  );

  // Request password reset
  const requestPasswordReset = useCallback(
    async (email) => {
      try {
        const resultAction = await dispatch(forgotPassword(email));
        if (forgotPassword.fulfilled.match(resultAction)) {
          dispatch(
            addNotification({
              type: "success",
              message:
                "Password reset instructions have been sent to your email.",
            })
          );
          return resultAction.payload;
        }
        return null;
      } catch (error) {
        dispatch(
          addNotification({
            type: "error",
            message:
              error.message ||
              "Failed to request password reset. Please try again.",
          })
        );
        return null;
      }
    },
    [dispatch]
  );

  // Reset password
  const resetUserPassword = useCallback(
    async (token, password, confirmPassword) => {
      try {
        const resultAction = await dispatch(
          resetPassword({ token, password, confirmPassword })
        );
        if (resetPassword.fulfilled.match(resultAction)) {
          dispatch(
            addNotification({
              type: "success",
              message:
                "Password reset successfully! You can now log in with your new password.",
            })
          );
          return resultAction.payload;
        }
        return null;
      } catch (error) {
        dispatch(
          addNotification({
            type: "error",
            message:
              error.message || "Failed to reset password. Please try again.",
          })
        );
        return null;
      }
    },
    [dispatch]
  );

  // Clear auth errors
  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Clear auth success message
  const clearAuthSuccessMessage = useCallback(() => {
    dispatch(clearSuccessMessage());
  }, [dispatch]);

  return {
    // State
    isAuthenticated,
    user,
    userRole,
    loading,
    error,
    successMessage,
    isAdmin,
    isSeller,
    fullName,
    avatar,

    // Actions
    register,
    login,
    logout,
    getProfile,
    updateUserProfile,
    becomeSellerAccount,
    verifyUserEmail,
    requestPasswordReset,
    resetUserPassword,
    clearAuthError,
    clearAuthSuccessMessage,
  };
};

export default useAuth;
