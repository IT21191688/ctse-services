import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  fetchCategories, 
  fetchSubCategories 
} from '../../redux/actions/productActions';
import { toggleFilters } from '../../redux/slices/uiSlice';
import { 
  selectCategories, 
  selectPriceRange 
} from '../../redux/selectors/productSelectors';
import { selectFiltersOpen } from '../../redux/selectors/uiSelectors';
import Button from '../common/Button';
import { Checkbox, RadioGroup } from '../common/Input';
import { formatCurrency } from '../../utils/formatCurrency';

const ProductFilters = ({ 
  initialFilters = {}, 
  onFilterChange,
  vertical = true,
  showMobileFilters = true,
  resetFilters,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Selectors
  const categories = useSelector(selectCategories);
  const priceRange = useSelector(selectPriceRange);
  const isFiltersOpen = useSelector(selectFiltersOpen);
  
  // Filter state
  const [filters, setFilters] = useState({
    cat: '',
    subCat: [],
    priceMin: priceRange.min,
    priceMax: priceRange.max,
    ...initialFilters
  });
  
  // Selected category state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  
  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  
  // Update filters from initialFilters or URL params
  useEffect(() => {
    // Get filters from URL search params
    const searchParams = new URLSearchParams(location.search);
    
    const urlFilters = {
      cat: searchParams.get('cat') || initialFilters.cat || '',
      subCat: searchParams.getAll('subCat') || initialFilters.subCat || [],
      priceMin: searchParams.get('priceMin') || initialFilters.priceMin || priceRange.min,
      priceMax: searchParams.get('priceMax') || initialFilters.priceMax || priceRange.max,
    };
    
    setFilters(urlFilters);
    
    // Set selected category if category filter is present
    if (urlFilters.cat && categories.length > 0) {
      const category = categories.find(c => c.name.toLowerCase() === urlFilters.cat.toLowerCase());
      setSelectedCategory(category);
    }
  }, [initialFilters, location.search, categories, priceRange]);
  
  // Fetch subcategories when selected category changes
  useEffect(() => {
    if (selectedCategory) {
      dispatch(fetchSubCategories(selectedCategory._id))
        .then((action) => {
          if (action.payload) {
            setSubCategories(action.payload.subCategories);
          }
        });
    } else {
      setSubCategories([]);
    }
  }, [dispatch, selectedCategory]);
  
  // Handle category change
  const handleCategoryChange = (categoryId) => {
    const category = categories.find(c => c._id === categoryId);
    
    // If selecting the same category, clear it
    if (selectedCategory && selectedCategory._id === categoryId) {
      setSelectedCategory(null);
      
      // Update filters
      setFilters(prev => ({
        ...prev,
        cat: '',
        subCat: []
      }));
      
      // Notify parent component
      if (onFilterChange) {
        onFilterChange({
          ...filters,
          cat: '',
          subCat: []
        });
      }
    } else {
      setSelectedCategory(category);
      
      // Update filters
      setFilters(prev => ({
        ...prev,
        cat: category ? category.name.toLowerCase() : '',
        subCat: []
      }));
      
      // Notify parent component
      if (onFilterChange) {
        onFilterChange({
          ...filters,
          cat: category ? category.name.toLowerCase() : '',
          subCat: []
        });
      }
    }
  };
  
  // Handle subcategory change
  const handleSubCategoryChange = (subcategory) => {
    setFilters(prev => {
      const newSubCat = prev.subCat.includes(subcategory)
        ? prev.subCat.filter(sc => sc !== subcategory)
        : [...prev.subCat, subcategory];
      
      const newFilters = {
        ...prev,
        subCat: newSubCat
      };
      
      // Notify parent component
      if (onFilterChange) {
        onFilterChange(newFilters);
      }
      
      return newFilters;
    });
  };
  
  // Handle price change
  const handlePriceChange = (type, value) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [type]: value
      };
      
      // Notify parent component
      if (onFilterChange) {
        onFilterChange(newFilters);
      }
      
      return newFilters;
    });
  };
  
  // Handle price range change
  const handlePriceRangeChange = (min, max) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        priceMin: min,
        priceMax: max
      };
      
      // Notify parent component
      if (onFilterChange) {
        onFilterChange(newFilters);
      }
      
      return newFilters;
    });
  };
  
  // Handle filter reset
  const handleResetFilters = () => {
    setFilters({
      cat: '',
      subCat: [],
      priceMin: priceRange.min,
      priceMax: priceRange.max
    });
    
    setSelectedCategory(null);
    
    // Call parent reset function if provided
    if (resetFilters) {
      resetFilters();
    }
    
    // Notify parent component
    if (onFilterChange) {
      onFilterChange({
        cat: '',
        subCat: [],
        priceMin: priceRange.min,
        priceMax: priceRange.max
      });
    }
  };
  
  // Handle mobile filters toggle
  const handleToggleFilters = () => {
    dispatch(toggleFilters());
  };
  
  // Filter content
  const renderFilterContent = () => (
    <>
      {/* Categories */}
      <div className="mb-6">
        <h3 className="text-gray-800 font-semibold mb-3">Categories</h3>
        <div className="space-y-2">
          {categories.map(category => (
            <div key={category._id} className="flex items-center">
              <Checkbox
                name={`category-${category._id}`}
                checked={selectedCategory && selectedCategory._id === category._id}
                onChange={() => handleCategoryChange(category._id)}
                label={category.name}
              />
            </div>
          ))}
        </div>
      </div>
      
      {/* Subcategories (when a category is selected) */}
      {selectedCategory && subCategories.length > 0 && (
        <div className="mb-6">
          <h3 className="text-gray-800 font-semibold mb-3">Subcategories</h3>
          <div className="space-y-2">
            {subCategories.map((subcat, index) => (
              <div key={`${subcat}-${index}`} className="flex items-center">
                <Checkbox
                  name={`subcat-${index}`}
                  checked={filters.subCat.includes(subcat)}
                  onChange={() => handleSubCategoryChange(subcat)}
                  label={subcat}
                />
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Price Range */}
      <div className="mb-6">
        <h3 className="text-gray-800 font-semibold mb-3">Price Range</h3>
        <div className="space-y-3">
          <div className="flex space-x-2">
            <div className="w-1/2">
              <label className="block text-sm text-gray-600 mb-1">Min</label>
              <input
                type="number"
                value={filters.priceMin}
                onChange={(e) => handlePriceChange('priceMin', Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                min={priceRange.min}
                max={filters.priceMax}
              />
            </div>
            <div className="w-1/2">
              <label className="block text-sm text-gray-600 mb-1">Max</label>
              <input
                type="number"
                value={filters.priceMax}
                onChange={(e) => handlePriceChange('priceMax', Math.max(filters.priceMin, parseInt(e.target.value) || priceRange.min))}
                className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm"
                min={filters.priceMin}
                max={priceRange.max}
              />
            </div>
          </div>
          
          <div className="px-2">
            <div className="h-2 bg-gray-200 rounded-full mt-4 mb-2">
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{
                  width: `${((filters.priceMax - filters.priceMin) / (priceRange.max - priceRange.min)) * 100}%`,
                  marginLeft: `${((filters.priceMin - priceRange.min) / (priceRange.max - priceRange.min)) * 100}%`
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>{formatCurrency(priceRange.min)}</span>
              <span>{formatCurrency(priceRange.max)}</span>
            </div>
          </div>
          
          {/* Price preset ranges */}
          <div className="flex flex-wrap gap-2 mt-2">
            <button
              className={`text-xs px-2 py-1 rounded-md ${
                filters.priceMin === priceRange.min && filters.priceMax === priceRange.max
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
              onClick={() => handlePriceRangeChange(priceRange.min, priceRange.max)}
            >
              All
            </button>
            
            <button
              className={`text-xs px-2 py-1 rounded-md ${
                filters.priceMin === priceRange.min && filters.priceMax === 100
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
              onClick={() => handlePriceRangeChange(priceRange.min, 100)}
            >
              Under {formatCurrency(100)}
            </button>
            
            <button
              className={`text-xs px-2 py-1 rounded-md ${
                filters.priceMin === 100 && filters.priceMax === 500
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
              onClick={() => handlePriceRangeChange(100, 500)}
            >
              {formatCurrency(100)} - {formatCurrency(500)}
            </button>
            
            <button
              className={`text-xs px-2 py-1 rounded-md ${
                filters.priceMin === 500 && filters.priceMax === priceRange.max
                  ? 'bg-green-100 text-green-700 border border-green-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
              onClick={() => handlePriceRangeChange(500, priceRange.max)}
            >
              Over {formatCurrency(500)}
            </button>
          </div>
        </div>
      </div>
      
      {/* Reset Filters Button */}
      <div className="mt-8">
        <Button
          variant="outline"
          fullWidth
          onClick={handleResetFilters}
        >
          Reset Filters
        </Button>
      </div>
    </>
  );
  
  // Mobile filter version
  if (!vertical && showMobileFilters) {
    return (
      <>
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-6">
          <Button
            fullWidth
            variant="outline"
            onClick={handleToggleFilters}
          >
            <span className="flex items-center justify-center">
              <svg 
                className="h-5 w-5 mr-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" 
                />
              </svg>
              Filters
            </span>
          </Button>
        </div>
        
        {/* Mobile Filter Drawer */}
        <div className={`fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden transition-opacity duration-300 ${
          isFiltersOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}>
          <div className={`fixed inset-y-0 left-0 max-w-xs w-full bg-white shadow-xl transform transition-transform duration-300 z-50 ${
            isFiltersOpen ? 'translate-x-0' : '-translate-x-full'
          }`}>
            {/* Filter Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-800">Filters</h2>
              <button 
                className="text-gray-500 hover:text-gray-700"
                onClick={handleToggleFilters}
              >
                <svg 
                  className="h-6 w-6" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              </button>
            </div>
            
            {/* Filter Content */}
            <div className="p-4 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 56px)' }}>
              {renderFilterContent()}
            </div>
          </div>
        </div>
        
        {/* Desktop Filter Panel */}
        <div className="hidden lg:block">
          {renderFilterContent()}
        </div>
      </>
    );
  }
  
  // Vertical (desktop) filter version
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-6">Filters</h2>
      {renderFilterContent()}
    </div>
  );
};

export default ProductFilters;