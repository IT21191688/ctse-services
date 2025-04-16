import axios from "axios";
import { getLocalStorage } from "../utils/localStorage";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = getLocalStorage("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error is 401 Unauthorized and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Try to refresh the token
        const refreshToken = getLocalStorage("refreshToken");
        if (refreshToken) {
          const response = await axios.get(`${API_URL}/api/auth/refresh`, {
            withCredentials: true,
          });

          if (response.data.accessToken) {
            // Save the new token
            localStorage.setItem("accessToken", response.data.accessToken);

            // Retry the original request with the new token
            originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
            return axios(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Redirect to login if refresh fails
        window.location.href = "/login?session=expired";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
