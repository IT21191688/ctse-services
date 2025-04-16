import api from "./index";

export const authAPI = {
  // Register a new user
  register: async (userData) => {
    const formData = new FormData();

    // Append user data to form data
    Object.keys(userData).forEach((key) => {
      if (key === "avatar" && userData[key] instanceof File) {
        formData.append(key, userData[key]);
      } else {
        formData.append(key, userData[key]);
      }
    });

    const response = await api.post("/api/auth/signup", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Login a user
  login: async (credentials) => {
    const response = await api.post("/api/auth/signin", credentials);
    return response.data;
  },

  // Verify email
  verifyEmail: async (token) => {
    const response = await api.get(`/api/auth/verify/${token}`);
    return response.data;
  },

  // Forgot password
  forgotPassword: async (email) => {
    const response = await api.post("/api/auth/forgot-password", { email });
    return response.data;
  },

  // Reset password
  resetPassword: async (token, password, confirmPassword) => {
    const response = await api.post(`/api/auth/reset-password/${token}`, {
      password,
      confirmPassword,
    });
    return response.data;
  },

  // Get user profile
  getProfile: async () => {
    const response = await api.get("/api/auth/profile");
    return response.data;
  },

  // Update user profile
  updateProfile: async (profileData) => {
    const formData = new FormData();

    // Append profile data to form data
    Object.keys(profileData).forEach((key) => {
      if (key === "avatar" && profileData[key] instanceof File) {
        formData.append(key, profileData[key]);
      } else if (key === "address" && typeof profileData[key] === "object") {
        // Handle address object
        Object.keys(profileData[key]).forEach((addressKey) => {
          formData.append(
            `address[${addressKey}]`,
            profileData[key][addressKey]
          );
        });
      } else {
        formData.append(key, profileData[key]);
      }
    });

    const response = await api.patch("/api/auth/profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Update user to seller
  updateToSeller: async (userId, sellerData) => {
    const formData = new FormData();

    // Append seller data to form data
    Object.keys(sellerData).forEach((key) => {
      if (key === "logo" && sellerData[key] instanceof File) {
        formData.append(key, sellerData[key]);
      } else {
        formData.append(key, sellerData[key]);
      }
    });

    const response = await api.patch(
      `/api/auth/update-role/${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  // Admin: Get all users
  getAllUsers: async () => {
    const response = await api.get("/api/auth/users");
    return response.data;
  },

  // Refresh the auth token
  refreshToken: async () => {
    const response = await api.get("/api/auth/refresh");
    return response.data;
  },
};

export default authAPI;
