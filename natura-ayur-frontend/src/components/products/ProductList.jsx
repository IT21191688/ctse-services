import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts } from '../../redux/actions/productActions';
import { selectProducts, selectTotalProducts } from '../../redux/selectors/productSelectors';
import { selectProductLoading } from '../../redux/selectors/productSelectors';
import ProductCard from './ProductCard';
import { ContentLoading } from '../common/Loading';
import { SORT_OPTIONS, PER_PAGE_OPTIONS } from '../../utils/constants';

const ProductList = ({ 
  initialFilters = {},
  showSorting = true,
  showPerPage = true,
  layout = 'grid', // 'grid' or 'list'
  columns = 3,
  children
}) => {
  const dispatch = useDispatch();
  const products = useSelector(selectProducts);
  const totalProducts = useSelector(selectTotalProducts);
  const loading = useSelector(selectProductLoading);
  
  // State for current filters
  const [filters, setFilters] = useState({
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    order: '-1',
    ...initialFilters
  });
  
  // Load products when filters change
  useEffect(() => {
    dispatch(fetchProducts(filters));
  }, [dispatch, filters]);
  
  // Handle page change
  const handlePageChange = (newPage) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
    
    // Scroll to top
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Handle sorting change
  const handleSortChange = (e) => {
    const [sortBy, order] = e.target.value.split('=');
    setFilters((prev) => ({ ...prev, sortBy, order, page: 1 }));
  };
  
  // Handle per page change
  const handlePerPageChange = (e) => {
    setFilters((prev) => ({ 
      ...prev, 
      limit: parseInt(e.target.value),
      page: 1
    }));
  };
  
  // Pagination
  const totalPages = Math.ceil(totalProducts / filters.limit);
  const displayPages = totalPages > 5 ? 5 : totalPages;
  const startPage = Math.max(1, filters.page - Math.floor(displayPages / 2));
  const endPage = Math.min(totalPages, startPage + displayPages - 1);
  
  // Grid columns classes
  const gridColumnsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  };
  
  if (loading && products.length === 0) {
    return <ContentLoading text="Loading products..." />;
  }
  
  return (
    <div>
      {/* Top controls */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        {/* Product count */}
        <div className="text-gray-600 mb-4 sm:mb-0">
          Showing {Math.min((filters.page - 1) * filters.limit + 1, totalProducts)} - 
          {Math.min(filters.page * filters.limit, totalProducts)} of {totalProducts} products
        </div>
        
        {/* Sorting and per page */}
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          {showSorting && (
            <div className="flex items-center">
              <label htmlFor="sort" className="text-gray-700 mr-2 text-sm whitespace-nowrap">
                Sort by:
              </label>
              <select
                id="sort"
                value={`${filters.sortBy}=${filters.order}`}
                onChange={handleSortChange}
                className="border border-gray-300 text-gray-700 rounded-md text-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
          
          {showPerPage && (
            <div className="flex items-center">
              <label htmlFor="perPage" className="text-gray-700 mr-2 text-sm whitespace-nowrap">
                Show:
              </label>
              <select
                id="perPage"
                value={filters.limit}
                onChange={handlePerPageChange}
                className="border border-gray-300 text-gray-700 rounded-md text-sm px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                {PER_PAGE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>
      
      {/* Render children if provided (for custom layouts) */}
      {children}
      
      {/* Product grid */}
      {!children && (
        <>
          {layout === 'grid' ? (
            <div className={`grid ${gridColumnsClass[columns]} gap-6`}>
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <svg 
                    className="w-16 h-16 text-gray-400 mx-auto mb-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                  <p className="mt-1 text-gray-500">
                    Try adjusting your filters to find what you're looking for.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard 
                    key={product._id} 
                    product={product} 
                    horizontal={true}
                  />
                ))
              ) : (
                <div className="text-center py-16">
                  <svg 
                    className="w-16 h-16 text-gray-400 mx-auto mb-4" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={1.5} 
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" 
                    />
                  </svg>
                  <h3 className="text-lg font-medium text-gray-900">No products found</h3>
                  <p className="mt-1 text-gray-500">
                    Try adjusting your filters to find what you're looking for.
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-1">
            {/* Previous */}
            <button
              onClick={() => handlePageChange(filters.page - 1)}
              disabled={filters.page === 1}
              className={`px-3 py-1 rounded-md ${
                filters.page === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Previous page"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            
            {/* Page numbers */}
            {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-md ${
                  page === filters.page
                    ? 'bg-green-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
            
            {/* Next */}
            <button
              onClick={() => handlePageChange(filters.page + 1)}
              disabled={filters.page === totalPages}
              className={`px-3 py-1 rounded-md ${
                filters.page === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              aria-label="Next page"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ProductList;