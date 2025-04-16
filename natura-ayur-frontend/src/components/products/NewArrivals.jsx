import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNewArrivals } from '../../redux/actions/productActions';
import { selectNewArrivals } from '../../redux/selectors/productSelectors';
import { selectProductLoading } from '../../redux/selectors/productSelectors';
import ProductCard from './ProductCard';
import { ContentLoading } from '../common/Loading';
import Button from '../common/Button';

const NewArrivals = ({ 
  title = 'New Arrivals',
  subtitle = 'Check out our latest products',
  maxItems = 8,
  showViewAll = true,
  columns = 4,
}) => {
  const dispatch = useDispatch();
  
  // Selectors
  const products = useSelector(selectNewArrivals);
  const loading = useSelector(selectProductLoading);
  
  // Fetch new arrivals on mount
  useEffect(() => {
    dispatch(fetchNewArrivals());
  }, [dispatch]);
  
  // Filter products if maxItems is set
  const displayProducts = maxItems ? products.slice(0, maxItems) : products;
  
  // Grid columns classes
  const gridColumnsClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4'
  };
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        {/* Products Grid */}
        {loading ? (
          <ContentLoading text="Loading new arrivals..." />
        ) : (
          <>
            {displayProducts.length > 0 ? (
              <div className={`grid ${gridColumnsClass[columns]} gap-6`}>
                {displayProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No new products available at the moment.</p>
              </div>
            )}
            
            {/* View All Button */}
            {showViewAll && products.length > 0 && (
              <div className="text-center mt-10">
                <Button
                  variant="outline"
                  as={Link}
                  to="/products"
                >
                  View All Products
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

// Featured version of the component with a different layout
export const FeaturedProducts = ({ 
  title = 'Featured Products',
  subtitle = 'Hand-picked by our experts',
  products: customProducts,
  maxItems = 3,
}) => {
  const dispatch = useDispatch();
  
  // Selectors
  const newArrivals = useSelector(selectNewArrivals);
  const loading = useSelector(selectProductLoading);
  
  // Fetch new arrivals if no custom products are provided
  useEffect(() => {
    if (!customProducts) {
      dispatch(fetchNewArrivals());
    }
  }, [dispatch, customProducts]);
  
  // Use custom products or fallback to new arrivals
  const products = customProducts || newArrivals;
  
  // Filter products if maxItems is set
  const displayProducts = maxItems ? products.slice(0, maxItems) : products;
  
  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        {/* Products Layout */}
        {loading ? (
          <ContentLoading text="Loading featured products..." />
        ) : (
          <>
            {displayProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* First Product (Large) */}
                <div className="md:col-span-2">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
                    <div className="relative h-96">
                      <img 
                        src={displayProducts[0].images[0] || '/placeholder.jpg'} 
                        alt={displayProducts[0].name}
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Overlay with product info */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black opacity-80 flex flex-col justify-end p-6">
                        <h3 className="text-white text-2xl font-bold mb-2">{displayProducts[0].name}</h3>
                        <p className="text-white text-sm mb-4 line-clamp-2">{displayProducts[0].description}</p>
                        <Link 
                          to={`/products/${displayProducts[0]._id}`}
                          className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors inline-block w-max"
                        >
                          View Product
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Other Products (Smaller) */}
                <div className="flex flex-col space-y-6">
                  {displayProducts.slice(1, 3).map((product) => (
                    <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden h-full flex flex-col">
                      <div className="relative h-44">
                        <img 
                          src={product.images[0] || '/placeholder.jpg'} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        
                        {/* Overlay with product info */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black opacity-80 flex flex-col justify-end p-4">
                          <h3 className="text-white text-lg font-bold mb-1">{product.name}</h3>
                          <Link 
                            to={`/products/${product._id}`}
                            className="text-green-400 hover:text-green-300 transition-colors text-sm font-medium"
                          >
                            View Product
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No featured products available at the moment.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

// Popular Products version of the component
export const PopularProducts = ({ 
  title = 'Popular Products',
  subtitle = 'Our best-selling products',
  maxItems = 4,
  showViewAll = true,
}) => {
  const dispatch = useDispatch();
  
  // Use different action and selector for popular products
  const fetchPopularProducts = () => dispatch({ type: 'product/fetchPopularProducts' });
  const selectPopularProducts = (state) => state.product.popularProducts || [];
  
  // Selectors
  const products = useSelector(selectPopularProducts);
  const loading = useSelector(selectProductLoading);
  
  // Fetch popular products on mount
  useEffect(() => {
    fetchPopularProducts();
  }, []);
  
  // Filter products if maxItems is set
  const displayProducts = maxItems ? products.slice(0, maxItems) : products;
  
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">{title}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{subtitle}</p>
        </div>
        
        {/* Products Grid */}
        {loading ? (
          <ContentLoading text="Loading popular products..." />
        ) : (
          <>
            {displayProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {displayProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500">No popular products available at the moment.</p>
              </div>
            )}
            
            {/* View All Button */}
            {showViewAll && products.length > 0 && (
              <div className="text-center mt-10">
                <Button
                  variant="outline"
                  as={Link}
                  to="/products?sortBy=soldStock&order=-1"
                >
                  View All Popular Products
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;