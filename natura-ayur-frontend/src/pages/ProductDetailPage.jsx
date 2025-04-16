import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById } from '../redux/actions/productActions';
import { selectCurrentProduct, selectProductLoading } from '../redux/selectors/productSelectors';
import ProductDetail from '../components/products/ProductDetail';
import NewArrivals from '../components/products/NewArrivals';
import { PageLoading } from '../components/common/Loading';
import Button from '../components/common/Button';

const ProductDetailPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  
  // Selectors
  const product = useSelector(selectCurrentProduct);
  const loading = useSelector(selectProductLoading);
  
  // Fetch product details
  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id]);
  
  if (loading) {
    return <PageLoading />;
  }
  
  if (!product && !loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center py-12 px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button
            onClick={() => navigate('/products')}
          >
            Browse All Products
          </Button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="mb-6 text-sm">
          <ol className="flex items-center space-x-2">
            <li>
              <button
                onClick={() => navigate('/')}
                className="text-gray-500 hover:text-gray-700"
              >
                Home
              </button>
            </li>
            <li>
              <span className="text-gray-500">/</span>
            </li>
            <li>
              <button
                onClick={() => navigate('/products')}
                className="text-gray-500 hover:text-gray-700"
              >
                Products
              </button>
            </li>
            {product?.category && (
              <>
                <li>
                  <span className="text-gray-500">/</span>
                </li>
                <li>
                  <button
                    onClick={() => navigate(`/products?cat=${product.category.toLowerCase()}`)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {product.category}
                  </button>
                </li>
              </>
            )}
            <li>
              <span className="text-gray-500">/</span>
            </li>
            <li className="text-gray-900 font-medium truncate max-w-xs">
              {product?.name}
            </li>
          </ol>
        </nav>
        
        {/* Product Detail */}
        <ProductDetail productId={id} />
        
        {/* Related Products */}
        <div className="mt-16">
          <NewArrivals 
            title="You May Also Like" 
            subtitle="Products similar to this one" 
            maxItems={4} 
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;