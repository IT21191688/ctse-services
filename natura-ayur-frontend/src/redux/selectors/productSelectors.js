import { createSelector } from "@reduxjs/toolkit";

// Basic selectors
export const selectProductState = (state) => state.product;
export const selectProducts = (state) => state.product.products;
export const selectTotalProducts = (state) => state.product.totalProducts;
export const selectCurrentProduct = (state) => state.product.product;
export const selectNewArrivals = (state) => state.product.newArrivals;
export const selectPopularProducts = (state) => state.product.popularProducts;
export const selectSellerProducts = (state) => state.product.sellerProducts;
export const selectCategories = (state) => state.product.categories;
export const selectSubCategories = (state) => state.product.subCategories;
export const selectPriceRange = (state) => state.product.priceRange;
export const selectProductLoading = (state) => state.product.loading;
export const selectProductError = (state) => state.product.error;
export const selectProductSuccessMessage = (state) =>
  state.product.successMessage;
export const selectProductForm = (state) => state.product.productForm;

// Complex selectors
export const selectProductById = createSelector(
  [selectProducts, (_, productId) => productId],
  (products, productId) => products.find((product) => product._id === productId)
);

export const selectCategoryById = createSelector(
  [selectCategories, (_, categoryId) => categoryId],
  (categories, categoryId) =>
    categories.find((category) => category._id === categoryId)
);

export const selectCategoryByName = createSelector(
  [selectCategories, (_, categoryName) => categoryName],
  (categories, categoryName) =>
    categories.find(
      (category) => category.name.toLowerCase() === categoryName.toLowerCase()
    )
);

export const selectSubCategoriesByCategoryId = createSelector(
  [selectSubCategories, (_, categoryId) => categoryId],
  (subCategories, categoryId) => subCategories[categoryId] || []
);

export const selectCategoriesWithSubcategories = createSelector(
  [selectCategories, selectSubCategories],
  (categories, subCategories) => {
    return categories.map((category) => ({
      ...category,
      subCategories: subCategories[category._id] || category.subCategory || [],
    }));
  }
);

export const selectFilteredProducts = createSelector(
  [
    selectProducts,
    (_, { categoryFilter, subCategoryFilter, priceRange, searchQuery }) => ({
      categoryFilter,
      subCategoryFilter,
      priceRange,
      searchQuery,
    }),
  ],
  (
    products,
    { categoryFilter, subCategoryFilter, priceRange, searchQuery }
  ) => {
    return products.filter((product) => {
      // Filter by category
      if (categoryFilter && product.category !== categoryFilter.toLowerCase()) {
        return false;
      }

      // Filter by subcategory
      if (subCategoryFilter && subCategoryFilter.length > 0) {
        const hasSubCategory = product.subCategory.some((sub) =>
          subCategoryFilter.includes(sub.toLowerCase())
        );
        if (!hasSubCategory) return false;
      }

      // Filter by price range
      if (priceRange) {
        if (product.price < priceRange.min || product.price > priceRange.max) {
          return false;
        }
      }

      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesDescription = product.description
          .toLowerCase()
          .includes(query);
        const matchesBrand = product.brand.toLowerCase().includes(query);

        if (!matchesName && !matchesDescription && !matchesBrand) {
          return false;
        }
      }

      return true;
    });
  }
);

export const selectProductsInStock = createSelector(
  [selectProducts],
  (products) => products.filter((product) => product.stock > 0)
);

export const selectProductFormStatus = createSelector(
  [selectProductForm],
  (productForm) => ({
    loading: productForm.loading,
    error: productForm.error,
    success: productForm.success,
  })
);

export const selectProductImages = createSelector(
  [selectCurrentProduct],
  (product) => product?.images || []
);

export const selectProductRating = createSelector(
  [selectCurrentProduct],
  (product) => ({
    rating: product?.rating || 0,
    numReviews: product?.numReviews || 0,
  })
);
