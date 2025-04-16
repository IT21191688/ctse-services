import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  fetchProductById,
  fetchNewArrivals,
  fetchPopularProducts,
  fetchSellerProducts,
  createProduct,
  updateProductWithNotification,
  deleteProductWithNotification,
  fetchCategories,
  fetchSubCategories,
  handleImageUpload,
} from "../redux/actions/productActions";
import {
  selectProducts,
  selectCurrentProduct,
  selectTotalProducts,
  selectNewArrivals,
  selectPopularProducts,
  selectSellerProducts,
  selectCategories,
  selectProductLoading,
  selectProductError,
  selectProductSuccessMessage,
  selectPriceRange,
  selectProductForm,
  selectCategoriesWithSubcategories,
} from "../redux/selectors/productSelectors";

/**
 * Hook for product management functionality
 */
const useProducts = () => {
  const dispatch = useDispatch();

  // Selectors
  const products = useSelector(selectProducts);
  const currentProduct = useSelector(selectCurrentProduct);
  const totalProducts = useSelector(selectTotalProducts);
  const newArrivals = useSelector(selectNewArrivals);
  const popularProducts = useSelector(selectPopularProducts);
  const sellerProducts = useSelector(selectSellerProducts);
  const categories = useSelector(selectCategories);
  const categoriesWithSubs = useSelector(selectCategoriesWithSubcategories);
  const loading = useSelector(selectProductLoading);
  const error = useSelector(selectProductError);
  const successMessage = useSelector(selectProductSuccessMessage);
  const priceRange = useSelector(selectPriceRange);
  const productForm = useSelector(selectProductForm);

  // Get products with filters
  const getProducts = useCallback(
    (filters) => {
      dispatch(fetchProducts(filters));
    },
    [dispatch]
  );

  // Get product by ID
  const getProductById = useCallback(
    (productId) => {
      dispatch(fetchProductById(productId));
    },
    [dispatch]
  );

  // Get new arrivals
  const getNewArrivals = useCallback(() => {
    dispatch(fetchNewArrivals());
  }, [dispatch]);

  // Get popular products
  const getPopularProducts = useCallback(() => {
    dispatch(fetchPopularProducts());
  }, [dispatch]);

  // Get seller products
  const getSellerProducts = useCallback(() => {
    dispatch(fetchSellerProducts());
  }, [dispatch]);

  // Add new product
  const addProduct = useCallback(
    (productData) => {
      dispatch(createProduct(productData));
    },
    [dispatch]
  );

  // Update product
  const updateProduct = useCallback(
    (productId, productData) => {
      dispatch(updateProductWithNotification(productId, productData));
    },
    [dispatch]
  );

  // Delete product
  const deleteProduct = useCallback(
    (productId) => {
      dispatch(deleteProductWithNotification(productId));
    },
    [dispatch]
  );

  // Get all categories
  const getCategories = useCallback(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Get subcategories for a category
  const getSubCategories = useCallback(
    (categoryId) => {
      dispatch(fetchSubCategories(categoryId));
    },
    [dispatch]
  );

  // Handle product image upload
  const uploadProductImages = useCallback(
    (files) => {
      dispatch(handleImageUpload(files));
    },
    [dispatch]
  );

  // Get filtered products
  const getFilteredProducts = useCallback(
    (filters) => {
      const {
        search = "",
        category = "",
        subCategory = [],
        minPrice = 0,
        maxPrice = Number.MAX_SAFE_INTEGER,
        sortBy = "createdAt",
        sortOrder = "desc",
        page = 1,
        limit = 10,
      } = filters || {};

      // Format filter parameters for API
      const apiFilters = {
        search,
        cat: category,
        subCat: Array.isArray(subCategory) ? subCategory : [subCategory],
        priceMin: minPrice,
        priceMax: maxPrice,
        sortBy,
        order: sortOrder === "desc" ? "-1" : "1",
        page,
        limit,
      };

      dispatch(fetchProducts(apiFilters));
    },
    [dispatch]
  );

  // Load initial homepage data
  const loadHomePageData = useCallback(() => {
    dispatch(fetchCategories());
    dispatch(fetchNewArrivals());
    dispatch(fetchPopularProducts());
  }, [dispatch]);

  return {
    // State
    products,
    currentProduct,
    totalProducts,
    newArrivals,
    popularProducts,
    sellerProducts,
    categories,
    categoriesWithSubs,
    loading,
    error,
    successMessage,
    priceRange,
    productForm,

    // Actions
    getProducts,
    getProductById,
    getNewArrivals,
    getPopularProducts,
    getSellerProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    getCategories,
    getSubCategories,
    uploadProductImages,
    getFilteredProducts,
    loadHomePageData,
  };
};

export default useProducts;
