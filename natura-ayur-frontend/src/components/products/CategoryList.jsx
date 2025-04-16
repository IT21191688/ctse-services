import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCategories } from '../../redux/actions/productActions';
import { selectCategories, selectCategoriesWithSubcategories } from '../../redux/selectors/productSelectors';
import { selectProductLoading } from '../../redux/selectors/productSelectors';
import Card, { CardGrid } from '../common/Card';
import { ContentLoading } from '../common/Loading';
import { PLACEHOLDER_IMAGES } from '../../utils/constants';

const CategoryList = ({ 
  showSubcategories = true,
  layout = 'grid', // 'grid' or 'list'
  maxCategories,
  maxSubcategories = 5,
  imageSize = 'md', // 'sm', 'md', 'lg'
  columns = 3,
}) => {
  const dispatch = useDispatch();
  
  // Selectors
  const categories = useSelector(selectCategories);
  const categoriesWithSubs = useSelector(selectCategoriesWithSubcategories);
  const loading = useSelector(selectProductLoading);
  
  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);
  
  // Filter categories if maxCategories is set
  const displayCategories = maxCategories 
    ? categoriesWithSubs.slice(0, maxCategories) 
    : categoriesWithSubs;
  
  // Image size classes
  const imageSizeClasses = {
    sm: 'h-32',
    md: 'h-48',
    lg: 'h-64',
  };
  
  if (loading && categories.length === 0) {
    return <ContentLoading text="Loading categories..." />;
  }
  
  if (categories.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500">No categories found.</p>
      </div>
    );
  }
  
  // Grid layout
  if (layout === 'grid') {
    return (
      <CardGrid columns={columns}>
        {displayCategories.map((category) => (
          <CategoryCard 
            key={category._id} 
            category={category}
            showSubcategories={showSubcategories}
            maxSubcategories={maxSubcategories}
            imageSize={imageSizeClasses[imageSize]}
          />
        ))}
      </CardGrid>
    );
  }
  
  // List layout
  return (
    <div className="space-y-4">
      {displayCategories.map((category) => (
        <CategoryRow 
          key={category._id} 
          category={category} 
          showSubcategories={showSubcategories}
          maxSubcategories={maxSubcategories}
          imageSize={imageSizeClasses[imageSize]}
        />
      ))}
    </div>
  );
};

// Category Card Component
const CategoryCard = ({ 
  category, 
  showSubcategories,
  maxSubcategories,
  imageSize 
}) => {
  // Default image if none provided
  const categoryImage = category.image || PLACEHOLDER_IMAGES.CATEGORY;
  
  // Filter subcategories if maxSubcategories is set
  const displaySubcategories = maxSubcategories 
    ? category.subCategories?.slice(0, maxSubcategories) 
    : category.subCategories;
  
  // Show more count
  const moreCount = category.subCategories?.length - maxSubcategories;
  
  return (
    <Card className="h-full flex flex-col">
      <Link 
        to={`/products?cat=${category.name.toLowerCase()}`}
        className="block relative"
      >
        <div className={`${imageSize} overflow-hidden rounded-t-lg`}>
          <img 
            src={categoryImage} 
            alt={category.name} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black opacity-60"></div>
          <h3 className="absolute bottom-4 left-4 text-white text-xl font-bold">{category.name}</h3>
        </div>
      </Link>
      
      {showSubcategories && displaySubcategories && displaySubcategories.length > 0 && (
        <div className="p-4">
          <div className="flex flex-wrap gap-2">
            {displaySubcategories.map((subcategory, index) => (
              <Link 
                key={index}
                to={`/products?cat=${category.name.toLowerCase()}&subCat=${subcategory.toLowerCase()}`}
                className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full transition-colors"
              >
                {subcategory}
              </Link>
            ))}
            
            {/* Show "more" indicator if there are more subcategories */}
            {moreCount > 0 && (
              <Link 
                to={`/category/${category._id}`}
                className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full transition-colors"
              >
                +{moreCount} more
              </Link>
            )}
          </div>
        </div>
      )}
    </Card>
  );
};

// Category Row Component
const CategoryRow = ({ 
  category,
  showSubcategories,
  maxSubcategories,
  imageSize 
}) => {
  // Default image if none provided
  const categoryImage = category.image || PLACEHOLDER_IMAGES.CATEGORY;
  
  // Filter subcategories if maxSubcategories is set
  const displaySubcategories = maxSubcategories 
    ? category.subCategories?.slice(0, maxSubcategories) 
    : category.subCategories;
  
  // Show more count
  const moreCount = category.subCategories?.length - maxSubcategories;
  
  return (
    <div className="flex bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      {/* Category Image */}
      <Link 
        to={`/products?cat=${category.name.toLowerCase()}`}
        className="relative w-1/4 flex-shrink-0"
      >
        <div className="h-full overflow-hidden">
          <img 
            src={categoryImage} 
            alt={category.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black opacity-60"></div>
        </div>
      </Link>
      
      {/* Category Info */}
      <div className="w-3/4 p-4">
        <Link 
          to={`/products?cat=${category.name.toLowerCase()}`}
          className="inline-block mb-2"
        >
          <h3 className="text-xl font-bold text-gray-800 hover:text-green-600">
            {category.name}
          </h3>
        </Link>
        
        {showSubcategories && displaySubcategories && displaySubcategories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {displaySubcategories.map((subcategory, index) => (
              <Link 
                key={index}
                to={`/products?cat=${category.name.toLowerCase()}&subCat=${subcategory.toLowerCase()}`}
                className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full transition-colors"
              >
                {subcategory}
              </Link>
            ))}
            
            {/* Show "more" indicator if there are more subcategories */}
            {moreCount > 0 && (
              <Link 
                to={`/category/${category._id}`}
                className="inline-flex items-center bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm px-3 py-1 rounded-full transition-colors"
              >
                +{moreCount} more
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;