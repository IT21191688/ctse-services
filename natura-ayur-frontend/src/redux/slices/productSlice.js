import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productAPI } from "../../api/product.api";

// Async thunks
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (filters = {}, { rejectWithValue }) => {
    try {
      const response = await productAPI.getAllProducts(filters);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productAPI.getProductById(productId);
      return response.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

export const fetchNewArrivals = createAsyncThunk(
  "product/fetchNewArrivals",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productAPI.getNewArrivals();
      return response.products;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch new arrivals"
      );
    }
  }
);

export const fetchPopularProducts = createAsyncThunk(
  "product/fetchPopularProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productAPI.getPopularProducts();
      return response.products;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch popular products"
      );
    }
  }
);

export const fetchSellerProducts = createAsyncThunk(
  "product/fetchSellerProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productAPI.getSellerProducts();
      return response.products;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch seller products"
      );
    }
  }
);

export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await productAPI.addProduct(productData);
      return response.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add product"
      );
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async ({ productId, productData }, { rejectWithValue }) => {
    try {
      const response = await productAPI.updateProduct(productId, productData);
      return response.product;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await productAPI.deleteProduct(productId);
      return response.product._id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "product/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productAPI.getAllCategories();
      return response.categories;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

export const fetchSubCategories = createAsyncThunk(
  "product/fetchSubCategories",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await productAPI.getCategorySubCategories(categoryId);
      return { categoryId, subCategories: response.subCategories };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subcategories"
      );
    }
  }
);

// Initial state
const initialState = {
  products: [],
  totalProducts: 0,
  product: null,
  newArrivals: [],
  popularProducts: [],
  sellerProducts: [],
  categories: [],
  subCategories: {},
  priceRange: {
    min: 0,
    max: 10000,
  },
  loading: false,
  error: null,
  successMessage: null,
  productForm: {
    images: [],
    loading: false,
    error: null,
    success: false,
  },
};

// Slice
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
    clearProductSuccessMessage: (state) => {
      state.successMessage = null;
    },
    resetProductState: (state) => {
      return { ...initialState, categories: state.categories };
    },
    resetProductForm: (state) => {
      state.productForm = initialState.productForm;
    },
    setProductFormImages: (state, action) => {
      state.productForm.images = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.totalProducts = action.payload.total;
        state.priceRange = {
          min: action.payload.minProductsPrice || 0,
          max: action.payload.maxProductsPrice || 10000,
        };
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.product = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch New Arrivals
      .addCase(fetchNewArrivals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewArrivals.fulfilled, (state, action) => {
        state.loading = false;
        state.newArrivals = action.payload;
      })
      .addCase(fetchNewArrivals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Popular Products
      .addCase(fetchPopularProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.popularProducts = action.payload;
      })
      .addCase(fetchPopularProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Seller Products
      .addCase(fetchSellerProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.sellerProducts = action.payload;
      })
      .addCase(fetchSellerProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Product
      .addCase(addProduct.pending, (state) => {
        state.productForm.loading = true;
        state.productForm.error = null;
        state.productForm.success = false;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.productForm.loading = false;
        state.productForm.success = true;
        state.sellerProducts.push(action.payload);
        state.successMessage = "Product added successfully";
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.productForm.loading = false;
        state.productForm.error = action.payload;
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.productForm.loading = true;
        state.productForm.error = null;
        state.productForm.success = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.productForm.loading = false;
        state.productForm.success = true;
        // Update in products array if exists
        const index = state.sellerProducts.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.sellerProducts[index] = action.payload;
        }
        // Update current product if matches
        if (state.product && state.product._id === action.payload._id) {
          state.product = action.payload;
        }
        state.successMessage = "Product updated successfully";
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.productForm.loading = false;
        state.productForm.error = action.payload;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.sellerProducts = state.sellerProducts.filter(
          (p) => p._id !== action.payload
        );
        state.successMessage = "Product deleted successfully";
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch SubCategories
      .addCase(fetchSubCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.subCategories = {
          ...state.subCategories,
          [action.payload.categoryId]: action.payload.subCategories,
        };
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearProductError,
  clearProductSuccessMessage,
  resetProductState,
  resetProductForm,
  setProductFormImages,
} = productSlice.actions;

export default productSlice.reducer;
