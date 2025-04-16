import {
  fetchProducts,
  fetchProductById,
  fetchNewArrivals,
  fetchPopularProducts,
  fetchSellerProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  fetchCategories,
  fetchSubCategories,
  clearProductError,
  clearProductSuccessMessage,
  resetProductState,
  resetProductForm,
  setProductFormImages,
} from "../slices/productSlice";

// Export all product thunks and actions for easier access
export {
  fetchProducts,
  fetchProductById,
  fetchNewArrivals,
  fetchPopularProducts,
  fetchSellerProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  fetchCategories,
  fetchSubCategories,
  clearProductError,
  clearProductSuccessMessage,
  resetProductState,
  resetProductForm,
  setProductFormImages,
};

// Action to load initial home page data
export const loadHomePageData = () => async (dispatch) => {
  try {
    // Fetch categories, new arrivals, and popular products in parallel
    await Promise.all([
      dispatch(fetchCategories()),
      dispatch(fetchNewArrivals()),
      dispatch(fetchPopularProducts()),
    ]);
  } catch (error) {
    dispatch({
      type: "ui/addNotification",
      payload: {
        type: "error",
        message: "Failed to load home page data",
      },
    });
  }
};

// Action to create a new product with notification
export const createProduct = (productData) => async (dispatch) => {
  try {
    const resultAction = await dispatch(addProduct(productData));
    if (addProduct.fulfilled.match(resultAction)) {
      dispatch({
        type: "ui/addNotification",
        payload: {
          type: "success",
          message: "Product created successfully",
        },
      });
      dispatch(resetProductForm());
    }
    return resultAction;
  } catch (error) {
    dispatch({
      type: "ui/addNotification",
      payload: {
        type: "error",
        message: error.message || "Failed to create product",
      },
    });
    throw error;
  }
};

// Action to update product with notification
export const updateProductWithNotification =
  (productId, productData) => async (dispatch) => {
    try {
      const resultAction = await dispatch(
        updateProduct({ productId, productData })
      );
      if (updateProduct.fulfilled.match(resultAction)) {
        dispatch({
          type: "ui/addNotification",
          payload: {
            type: "success",
            message: "Product updated successfully",
          },
        });
      }
      return resultAction;
    } catch (error) {
      dispatch({
        type: "ui/addNotification",
        payload: {
          type: "error",
          message: error.message || "Failed to update product",
        },
      });
      throw error;
    }
  };

// Action to delete product with notification
export const deleteProductWithNotification =
  (productId) => async (dispatch) => {
    try {
      const resultAction = await dispatch(deleteProduct(productId));
      if (deleteProduct.fulfilled.match(resultAction)) {
        dispatch({
          type: "ui/addNotification",
          payload: {
            type: "success",
            message: "Product deleted successfully",
          },
        });
      }
      return resultAction;
    } catch (error) {
      dispatch({
        type: "ui/addNotification",
        payload: {
          type: "error",
          message: error.message || "Failed to delete product",
        },
      });
      throw error;
    }
  };

// Action to handle image upload preview
export const handleImageUpload = (files) => (dispatch, getState) => {
  const { product } = getState();
  const currentImages = [...product.productForm.images];

  // Create URL objects for preview
  const newImages = Array.from(files).map((file) => ({
    file,
    preview: URL.createObjectURL(file),
  }));

  dispatch(setProductFormImages([...currentImages, ...newImages]));
};
