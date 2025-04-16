import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI } from "../../api/auth.api";
import {
  setLocalStorage,
  removeLocalStorage,
  getLocalStorage,
} from "../../utils/localStorage";

// Async thunks
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await authAPI.register(userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await authAPI.login(credentials);

      // Store tokens in localStorage
      setLocalStorage("accessToken", response.accessToken);
      if (response.refreshToken) {
        setLocalStorage("refreshToken", response.refreshToken);
      }

      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Login failed");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, { rejectWithValue }) => {
    try {
      // Remove tokens from localStorage
      removeLocalStorage("accessToken");
      removeLocalStorage("refreshToken");

      return true;
    } catch (error) {
      return rejectWithValue("Logout failed");
    }
  }
);

export const getUserProfile = createAsyncThunk(
  "auth/getUserProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authAPI.getProfile();
      return response.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to get user profile"
      );
    }
  }
);

export const updateProfile = createAsyncThunk(
  "auth/updateProfile",
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await authAPI.updateProfile(profileData);
      return response.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update profile"
      );
    }
  }
);

export const becomeSeller = createAsyncThunk(
  "auth/becomeSeller",
  async (sellerData, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const response = await authAPI.updateToSeller(auth.user._id, sellerData);
      return response.user;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to become a seller"
      );
    }
  }
);

export const verifyEmail = createAsyncThunk(
  "auth/verifyEmail",
  async (token, { rejectWithValue }) => {
    try {
      const response = await authAPI.verifyEmail(token);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Email verification failed"
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await authAPI.forgotPassword(email);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Forgot password request failed"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async ({ token, password, confirmPassword }, { rejectWithValue }) => {
    try {
      const response = await authAPI.resetPassword(
        token,
        password,
        confirmPassword
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Password reset failed"
      );
    }
  }
);

// Initial state
const initialState = {
  user: null,
  isAuthenticated: !!getLocalStorage("accessToken"),
  loading: false,
  error: null,
  successMessage: null,
  emailVerified: false,
  passwordResetSuccess: false,
};

// Slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    resetAuthState: (state) => {
      state.emailVerified = false;
      state.passwordResetSuccess = false;
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = {
          firstName: action.payload.firstName,
          lastName: action.payload.lastName,
          role: action.payload.role,
        };
        state.successMessage = action.payload.message;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.successMessage = "Logged out successfully";
      })

      // Get User Profile
      .addCase(getUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        // If we get a 401, clear auth state
        if (
          action.payload === "Token expired" ||
          action.payload === "Invalid token"
        ) {
          state.isAuthenticated = false;
          state.user = null;
        }
      })

      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.successMessage = "Profile updated successfully";
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Become Seller
      .addCase(becomeSeller.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(becomeSeller.fulfilled, (state, action) => {
        state.loading = false;
        if (state.user) {
          state.user.role = action.payload.role;
          state.user.seller = action.payload.seller;
        }
        state.successMessage = "You are now a seller!";
      })
      .addCase(becomeSeller.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.loading = false;
        state.emailVerified = true;
        state.successMessage = action.payload.message;
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.passwordResetSuccess = true;
        state.successMessage = action.payload.message;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSuccessMessage, resetAuthState } =
  authSlice.actions;

export default authSlice.reducer;
