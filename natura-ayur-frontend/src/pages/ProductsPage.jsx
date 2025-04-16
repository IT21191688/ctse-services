import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { openModal } from '../redux/slices/uiSlice';
import ProductList from '../components/products/ProductList';
import ProductFilters from '../components/products/ProductFilters';
import Button from '../components/common/Button';
import { PageLoading } from '../components/common/Loading';
import { selectProductLoading } from '../redux/selectors/productSelectors';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get loading state
  const loading = useSelector(selectProductLoading);
  
  // Get filters from URL search params
  const searchParams = new URLSearchParams(location.search);
  
  // Local state for layout and filters
  const [layout, setLayout] = useState('grid'); // 'grid' or 'list'
  const [activeFilters, setActiveFilters] = useState({
    search: searchParams.get('search') || '',
    cat: searchParams.get('cat') || '',
    subCat: searchParams.getAll('subCat') || [],
    priceMin: searchParams.get('priceMin') || '',
    priceMax: searchParams.get('priceMax') || '',
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '12'),
    sortBy: searchParams.get('sortBy') || 'createdAt',
    order: searchParams.get('order') || '-1'
  });
  
  // Update URL when filters change
  useEffect(() => {
    const newSearchParams = new URLSearchParams();
    
    // Add non-empty filters to URL
    Object.entries(activeFilters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        if (Array.isArray(value)) {
          value.forEach(v => newSearchParams.append(key, v));
        } else {
          newSearchParams.set(key, value);
        }
      }
    });
    
    // Update URL without reloading page
    navigate({ search: newSearchParams.toString() }, { replace: true });
  }, [activeFilters, navigate]);
  
  // Handle filter changes
  const handleFilterChange = (newFilters) => {
    setActiveFilters(prevFilters => ({
      ...prevFilters,
      ...newFilters,
      page: 1 // Reset to first page when filters change
    }));
  };
  
  // Handle layout change
  const handleLayoutChange = (newLayout) => {
    setLayout(newLayout);
  };
  
  // Reset all filters
  const resetFilters = () => {
    setActiveFilters({
      search: '',
      cat: '',
      subCat: [],
      priceMin: '',
      priceMax: '',
      page: 1,
      limit: 12,
      sortBy: 'createdAt',
      order: '-1'
    });
  };
  
  return (
    <div className="bg-gray-50 py-6 min-h-screen">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {activeFilters.cat 
              ? `${activeFilters.cat.charAt(0).toUpperCase() + activeFilters.cat.slice(1)} Products` 
              : 'All Products'}
          </h1>
          
          {/* Search bar */}
          <div className="mt-4 mb-6 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={activeFilters.search || ''}
                onChange={(e) => handleFilterChange({ search: e.target.value })}
                className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Active filters summary */}
          {(activeFilters.cat || activeFilters.subCat.length > 0 || activeFilters.priceMin || activeFilters.priceMax || activeFilters.search) && (
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <span className="text-sm text-gray-600">Active filters:</span>
              
              {activeFilters.cat && (
                <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Category: {activeFilters.cat}
                  <button 
                    onClick={() => handleFilterChange({ cat: '', subCat: [] })}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              
              {activeFilters.subCat.map((subCat) => (
                <span key={subCat} className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  {subCat}
                  <button 
                    onClick={() => handleFilterChange({
                      subCat: activeFilters.subCat.filter(sc => sc !== subCat)
                    })}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              ))}
              
              {(activeFilters.priceMin || activeFilters.priceMax) && (
                <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Price: {activeFilters.priceMin || '0'} - {activeFilters.priceMax || '∞'}
                  <button 
                    onClick={() => handleFilterChange({ priceMin: '', priceMax: '' })}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              
              {activeFilters.search && (
                <span className="inline-flex items-center bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                  Search: {activeFilters.search}
                  <button 
                    onClick={() => handleFilterChange({ search: '' })}
                    className="ml-1 text-green-600 hover:text-green-800"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              
              <button 
                onClick={resetFilters}
                className="text-sm text-red-600 hover:text-red-800 ml-2"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar with filters */}
          <div className="lg:w-1/4">
            <ProductFilters
              initialFilters={activeFilters}
              onFilterChange={handleFilterChange}
              resetFilters={resetFilters}
              vertical={true}
              showMobileFilters={true}
            />
          </div>
          
          {/* Main content */}
          <div className="lg:w-3/4">
            {/* Layout control */}
            <div className="flex justify-end items-center mb-4">
              <div className="flex space-x-2">
                <button
                  onClick={() => handleLayoutChange('grid')}
                  className={`p-2 rounded-md ${
                    layout === 'grid' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label="Grid view"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => handleLayoutChange('list')}
                  className={`p-2 rounded-md ${
                    layout === 'list' 
                      ? 'bg-green-600 text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-100'
                  }`}
                  aria-label="List view"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
            
            {/* Product list */}
            <ProductList
              initialFilters={activeFilters}
              showSorting={true}
              showPerPage={true}
              layout={layout}
              columns={3}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;