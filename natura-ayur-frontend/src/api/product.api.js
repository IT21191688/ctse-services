import api from "./index";

export const productAPI = {
  // Get all products with filter
  getAllProducts: async (filters = {}) => {
    const params = new URLSearchParams();

    // Add filters to query params
    Object.keys(filters).forEach((key) => {
      if (filters[key] !== undefined && filters[key] !== null) {
        if (Array.isArray(filters[key])) {
          filters[key].forEach((value) => {
            params.append(key, value);
          });
        } else {
          params.append(key, filters[key]);
        }
      }
    });

    const response = await api.get(`/api/products?${params.toString()}`);
    return response.data;
  },

  // Get a product by ID
  getProductById: async (productId) => {
    const response = await api.get(`/api/products/${productId}`);
    return response.data;
  },

  // Get new arrivals
  getNewArrivals: async () => {
    const response = await api.get("/api/products/newArrivals");
    return response.data;
  },

  // Get popular products
  getPopularProducts: async () => {
    const response = await api.get("/api/products/popular");
    return response.data;
  },

  // Seller: Get products by seller
  getSellerProducts: async () => {
    const response = await api.get("/api/products/seller/products");
    return response.data;
  },

  // Seller/Admin: Add a new product
  addProduct: async (productData) => {
    const formData = new FormData();

    // Append product data to form data
    Object.keys(productData).forEach((key) => {
      if (key === "images" && Array.isArray(productData[key])) {
        productData[key].forEach((image) => {
          if (image instanceof File) {
            formData.append("images", image);
          }
        });
      } else if (key === "subCategory" && Array.isArray(productData[key])) {
        productData[key].forEach((cat) => {
          formData.append("subCategory", cat);
        });
      } else {
        formData.append(key, productData[key]);
      }
    });

    const response = await api.post("/api/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  // Seller/Admin: Update a product
  updateProduct: async (productId, productData) => {
    const response = await api.patch(`/api/products/${productId}`, productData);
    return response.data;
  },

  // Seller/Admin: Delete a product
  deleteProduct: async (productId) => {
    const response = await api.delete(`/api/products/${productId}`);
    return response.data;
  },

  // Category related endpoints
  getAllCategories: async () => {
    const response = await api.get("/api/categories");
    return response.data;
  },

  getCategoryById: async (categoryId) => {
    const response = await api.get(`/api/categories/${categoryId}`);
    return response.data;
  },

  getCategorySubCategories: async (categoryId) => {
    const response = await api.get(`/api/categories/sub/${categoryId}`);
    return response.data;
  },

  // Admin/Seller: Add a new category
  addCategory: async (categoryData) => {
    const response = await api.post("/api/categories", categoryData);
    return response.data;
  },

  // Admin/Seller: Add a subcategory to a category
  addSubCategory: async (categoryId, name) => {
    const response = await api.post(`/api/categories/sub/${categoryId}`, {
      name,
    });
    return response.data;
  },
};

export default productAPI;
