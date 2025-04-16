// API Constants
export const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

// User Roles
export const USER_ROLES = {
  ADMIN: "admin",
  USER: "user",
  SELLER: "seller",
};

// Order Status
export const ORDER_STATUS = {
  NEW: "new",
  PENDING: "pending",
  PROCESSING: "processing",
  SHIPPED: "shipped",
  DELIVERED: "delivered",
  CANCELLED: "cancelled",
  REJECTED: "rejected",
  APPROVED: "approved",
};

// Order Status Display Names
export const ORDER_STATUS_DISPLAY = {
  [ORDER_STATUS.NEW]: "New",
  [ORDER_STATUS.PENDING]: "Pending",
  [ORDER_STATUS.PROCESSING]: "Processing",
  [ORDER_STATUS.SHIPPED]: "Shipped",
  [ORDER_STATUS.DELIVERED]: "Delivered",
  [ORDER_STATUS.CANCELLED]: "Cancelled",
  [ORDER_STATUS.REJECTED]: "Rejected",
  [ORDER_STATUS.APPROVED]: "Approved",
};

// Order Status Colors
export const ORDER_STATUS_COLORS = {
  [ORDER_STATUS.NEW]: "blue",
  [ORDER_STATUS.PENDING]: "yellow",
  [ORDER_STATUS.PROCESSING]: "orange",
  [ORDER_STATUS.SHIPPED]: "purple",
  [ORDER_STATUS.DELIVERED]: "green",
  [ORDER_STATUS.CANCELLED]: "red",
  [ORDER_STATUS.REJECTED]: "red",
  [ORDER_STATUS.APPROVED]: "green",
};

// Review Ratings
export const REVIEW_RATINGS = {
  POOR: 1,
  FAIR: 2,
  GOOD: 3,
  VERY_GOOD: 4,
  EXCELLENT: 5,
};

// Review Rating Display Names
export const REVIEW_RATING_DISPLAY = {
  [REVIEW_RATINGS.POOR]: "Poor",
  [REVIEW_RATINGS.FAIR]: "Fair",
  [REVIEW_RATINGS.GOOD]: "Good",
  [REVIEW_RATINGS.VERY_GOOD]: "Very Good",
  [REVIEW_RATINGS.EXCELLENT]: "Excellent",
};

// Review Types
export const REVIEW_TYPES = {
  PRODUCT: "product",
  SELLER: "seller",
};

// Payment Methods
export const PAYMENT_METHODS = {
  STRIPE: "stripe",
  COD: "cod",
};

// Payment Method Display Names
export const PAYMENT_METHOD_DISPLAY = {
  [PAYMENT_METHODS.STRIPE]: "Credit Card (Stripe)",
  [PAYMENT_METHODS.COD]: "Cash on Delivery",
};

// Sort Options
export const SORT_OPTIONS = [
  { label: "Newest First", value: "createdAt=-1" },
  { label: "Oldest First", value: "createdAt=1" },
  { label: "Price: Low to High", value: "price=1" },
  { label: "Price: High to Low", value: "price=-1" },
  { label: "Name: A to Z", value: "name=1" },
  { label: "Name: Z to A", value: "name=-1" },
  { label: "Popular", value: "soldStock=-1" },
  { label: "Top Rated", value: "rating=-1" },
];

// Products Per Page Options
export const PER_PAGE_OPTIONS = [
  { label: "12 per page", value: 12 },
  { label: "24 per page", value: 24 },
  { label: "36 per page", value: 36 },
  { label: "48 per page", value: 48 },
];

// Form Error Messages
export const ERROR_MESSAGES = {
  REQUIRED: "This field is required",
  EMAIL: "Please enter a valid email address",
  PASSWORD_MIN: "Password must be at least 6 characters long",
  PASSWORD_MATCH: "Passwords do not match",
  PHONE: "Please enter a valid 10-digit phone number",
  POSTAL_CODE: "Please enter a valid postal code",
};

// Local Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
  USER_PREFERENCES: "userPreferences",
  CART_ITEMS: "cartItems", // For guest cart
  THEME: "theme",
  RECENT_SEARCHES: "recentSearches",
  VIEWED_PRODUCTS: "viewedProducts",
};

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  VERIFY_EMAIL: "/verify/:token",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password/:token",
  PROFILE: "/profile",
  ORDERS: "/orders",
  ORDER_DETAIL: "/orders/:id",
  CART: "/cart",
  CHECKOUT: "/checkout",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: "/products/:id",
  CATEGORIES: "/categories",
  CATEGORY_DETAIL: "/categories/:id",
  ABOUT: "/about",
  CONTACT: "/contact",
  FAQ: "/faq",
  SHIPPING: "/shipping",
  RETURNS: "/returns",
  PRIVACY: "/privacy",
  TERMS: "/terms",
  SELLER_DASHBOARD: "/seller/dashboard",
  SELLER_PRODUCTS: "/seller/products",
  SELLER_ADD_PRODUCT: "/seller/products/add",
  SELLER_EDIT_PRODUCT: "/seller/products/edit/:id",
  SELLER_ORDERS: "/seller/orders",
  ADMIN_DASHBOARD: "/admin/dashboard",
  ADMIN_PRODUCTS: "/admin/products",
  ADMIN_CATEGORIES: "/admin/categories",
  ADMIN_ORDERS: "/admin/orders",
  ADMIN_USERS: "/admin/users",
};

// Placeholder Image URLs
export const PLACEHOLDER_IMAGES = {
  PRODUCT: "https://via.placeholder.com/300x300?text=No+Image",
  AVATAR: "https://via.placeholder.com/150x150?text=User",
  CATEGORY: "https://via.placeholder.com/300x200?text=Category",
  BANNER: "https://via.placeholder.com/1200x400?text=Banner",
};

export default {
  API_URL,
  USER_ROLES,
  ORDER_STATUS,
  ORDER_STATUS_DISPLAY,
  ORDER_STATUS_COLORS,
  REVIEW_RATINGS,
  REVIEW_RATING_DISPLAY,
  REVIEW_TYPES,
  PAYMENT_METHODS,
  PAYMENT_METHOD_DISPLAY,
  SORT_OPTIONS,
  PER_PAGE_OPTIONS,
  ERROR_MESSAGES,
  STORAGE_KEYS,
  ROUTES,
  PLACEHOLDER_IMAGES,
};
