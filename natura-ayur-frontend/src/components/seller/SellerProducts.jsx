import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchSellerProducts,
  deleteProductWithNotification
} from '../../redux/actions/productActions';
import { 
  selectSellerProducts,
  selectProductLoading
} from '../../redux/selectors/productSelectors';
import { openModal, closeModal } from '../../redux/slices/uiSlice';
import { selectModalOpen } from '../../redux/selectors/uiSelectors';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/dateUtils';
import Card from '../common/Card';
import Button from '../common/Button';
import { ContentLoading } from '../common/Loading';
import Modal, { ConfirmationModal } from '../common/Modal';

/**
 * Seller Products management component
 */
const SellerProducts = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const products = useSelector(selectSellerProducts);
  const loading = useSelector(selectProductLoading);
  const isConfirmModalOpen = useSelector(selectModalOpen('deleteConfirm'));
  
  // State for search and sorting
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  // State for product to delete
  const [productToDelete, setProductToDelete] = useState(null);
  
  // Fetch seller products on mount
  useEffect(() => {
    dispatch(fetchSellerProducts());
  }, [dispatch]);
  
  // Handle sort change
  const handleSortChange = (e) => {
    const [field, order] = e.target.value.split(':');
    setSortBy(field);
    setSortOrder(order);
  };
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle category filter change
  const handleCategoryFilterChange = (e) => {
    setCategoryFilter(e.target.value);
  };
  
  // Handle delete button click
  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    dispatch(openModal({ modalType: 'deleteConfirm' }));
  };
  
  // Handle confirm delete
  const handleConfirmDelete = async () => {
    if (productToDelete) {
      await dispatch(deleteProductWithNotification(productToDelete._id));
      setProductToDelete(null);
      dispatch(closeModal('deleteConfirm'));
    }
  };
  
  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      // Search filter
      const nameMatch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const descriptionMatch = product.description.toLowerCase().includes(searchTerm.toLowerCase());
      const brandMatch = product.brand.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const categoryMatch = categoryFilter === '' || product.category.toLowerCase() === categoryFilter.toLowerCase();
      
      return (nameMatch || descriptionMatch || brandMatch) && categoryMatch;
    })
    .sort((a, b) => {
      // Sort by selected field
      if (sortBy === 'name') {
        return sortOrder === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortBy === 'price') {
        return sortOrder === 'asc'
          ? a.price - b.price
          : b.price - a.price;
      } else if (sortBy === 'stock') {
        return sortOrder === 'asc'
          ? a.stock - b.stock
          : b.stock - a.stock;
      } else if (sortBy === 'soldStock') {
        return sortOrder === 'asc'
          ? (a.soldStock || 0) - (b.soldStock || 0)
          : (b.soldStock || 0) - (a.soldStock || 0);
      } else {
        // Default sort by creation date
        return sortOrder === 'asc'
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
  
  // Get unique categories for filter dropdown
  const categories = [...new Set(products.map(product => product.category))];
  
  if (loading && products.length === 0) {
    return <ContentLoading text="Loading products..." />;
  }
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
        
        <Button as={Link} to="/seller/products/add">
          <span className="flex items-center">
            <svg className="mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Product
          </span>
        </Button>
      </div>
      
      <Card>
        {/* Filter and Search Controls */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          
          {/* Category Filter */}
          <div>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              value={categoryFilter}
              onChange={handleCategoryFilterChange}
            >
              <option value="">All Categories</option>
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          
          {/* Sort */}
          <div>
            <select
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
              value={`${sortBy}:${sortOrder}`}
              onChange={handleSortChange}
            >
              <option value="createdAt:desc">Newest First</option>
              <option value="createdAt:asc">Oldest First</option>
              <option value="name:asc">Name (A-Z)</option>
              <option value="name:desc">Name (Z-A)</option>
              <option value="price:asc">Price (Low to High)</option>
              <option value="price:desc">Price (High to Low)</option>
              <option value="stock:desc">Stock (High to Low)</option>
              <option value="stock:asc">Stock (Low to High)</option>
              <option value="soldStock:desc">Best Selling</option>
            </select>
          </div>
        </div>
        
        {/* Products Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Price
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sold
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={product.images[0] || '/placeholder.jpg'}
                            alt={product.name}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 truncate max-w-xs">
                            {product.name}
                          </div>
                          <div className="text-sm text-gray-500">{product.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.stock > 0 ? (
                        product.stock
                      ) : (
                        <span className="text-red-600 font-medium">Out of Stock</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.soldStock || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(product.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex space-x-2 justify-end">
                        <Button
                          as={Link}
                          to={`/products/${product._id}`}
                          variant="text"
                          size="sm"
                        >
                          View
                        </Button>
                        <Button
                          as={Link}
                          to={`/seller/products/edit/${product._id}`}
                          variant="text"
                          size="sm"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="text"
                          size="sm"
                          className="text-red-600 hover:text-red-800"
                          onClick={() => handleDeleteClick(product)}
                        >
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-sm text-gray-500">
                    {products.length === 0
                      ? "You haven't added any products yet."
                      : "No products match your search criteria."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      {/* Confirmation Modal for Delete */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={() => dispatch(closeModal('deleteConfirm'))}
        confirmButtonType="danger"
      />
    </div>
  );
};

export default SellerProducts;