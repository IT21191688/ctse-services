import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  createProduct,
  fetchCategories,
  fetchSubCategories,
  resetProductForm,
  setProductFormImages
} from '../../redux/actions/productActions';
import { 
  selectCategories,
  selectSubCategories,
  selectProductLoading,
  selectProductError,
  selectProductSuccessMessage,
  selectProductForm
} from '../../redux/selectors/productSelectors';
import Input, { Textarea, Select } from '../../components/common/Input';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

/**
 * Add/Edit Product Form component
 * 
 * @param {Object} props
 * @param {Object} [props.product] - Existing product for editing
 * @param {boolean} [props.isEdit=false] - Whether this is an edit form
 */
const AddProductForm = ({ product, isEdit = false }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Selectors
  const categories = useSelector(selectCategories);
  const subCategoriesMap = useSelector(selectSubCategories);
  const loading = useSelector(selectProductLoading);
  const error = useSelector(selectProductError);
  const successMessage = useSelector(selectProductSuccessMessage);
  const formState = useSelector(selectProductForm);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    subCategory: [],
    brand: '',
    images: []
  });
  
  // Selected category state
  const [selectedCategory, setSelectedCategory] = useState('');
  const [subCategories, setSubCategories] = useState([]);
  
  // Preview images state
  const [imagePreviews, setImagePreviews] = useState([]);
  
  // Form validation state
  const [formErrors, setFormErrors] = useState({});
  
  // Fetch categories on mount
  useEffect(() => {
    dispatch(fetchCategories());
    
    // Reset form state when component unmounts
    return () => {
      dispatch(resetProductForm());
    };
  }, [dispatch]);
  
  // If editing, populate form with product data
  useEffect(() => {
    if (isEdit && product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
        category: product.category || '',
        subCategory: product.subCategory || [],
        brand: product.brand || '',
        images: []
      });
      
      setSelectedCategory(product.category || '');
      
      // Set image previews for existing product images
      if (product.images && product.images.length > 0) {
        setImagePreviews(product.images.map(image => ({
          url: image,
          isExisting: true,
          original: image
        })));
      }
    }
  }, [isEdit, product]);
  
  // Fetch subcategories when selected category changes
  useEffect(() => {
    if (selectedCategory) {
      const categoryObj = categories.find(
        cat => cat.name.toLowerCase() === selectedCategory.toLowerCase()
      );
      
      if (categoryObj) {
        dispatch(fetchSubCategories(categoryObj._id));
      }
    }
  }, [selectedCategory, categories, dispatch]);
  
  // Update subcategories when category or subcategories map changes
  useEffect(() => {
    if (selectedCategory) {
      const categoryObj = categories.find(
        cat => cat.name.toLowerCase() === selectedCategory.toLowerCase()
      );
      
      if (categoryObj && subCategoriesMap[categoryObj._id]) {
        setSubCategories(subCategoriesMap[categoryObj._id]);
      } else if (categoryObj && categoryObj.subCategory) {
        setSubCategories(categoryObj.subCategory);
      } else {
        setSubCategories([]);
      }
    } else {
      setSubCategories([]);
    }
  }, [selectedCategory, categories, subCategoriesMap]);
  
  // Navigate on successful submission
  useEffect(() => {
    if (successMessage && !loading) {
      // Redirect after success with short delay
      const timer = setTimeout(() => {
        navigate('/seller/products');
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [successMessage, loading, navigate]);
  
  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (name === 'images' && files) {
      // Handle image upload
      const fileArray = Array.from(files);
      
      // Create preview URLs and update form data
      const newPreviews = fileArray.map(file => ({
        file,
        url: URL.createObjectURL(file),
        isExisting: false
      }));
      
      setImagePreviews(prev => [...prev, ...newPreviews]);
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...fileArray]
      }));
      
      // Update form images in Redux (for potential persistence)
      dispatch(setProductFormImages([...formData.images, ...fileArray]));
    } else if (name === 'category') {
      // Handle category change
      setSelectedCategory(value);
      setFormData(prev => ({
        ...prev,
        [name]: value,
        subCategory: [] // Reset subcategories when category changes
      }));
    } else if (name === 'subCategory') {
      // Handle multi-select for subcategories
      const options = e.target.options;
      const selected = [];
      
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selected.push(options[i].value);
        }
      }
      
      setFormData(prev => ({
        ...prev,
        [name]: selected
      }));
    } else if (type === 'number') {
      // Handle number inputs
      setFormData(prev => ({
        ...prev,
        [name]: value !== '' ? Number(value) : ''
      }));
    } else {
      // Handle text inputs
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear field error on change
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  // Handle remove image
  const handleRemoveImage = (index) => {
    const newPreviews = [...imagePreviews];
    const removedPreview = newPreviews.splice(index, 1)[0];
    
    // Revoke object URL to prevent memory leaks
    if (!removedPreview.isExisting) {
      URL.revokeObjectURL(removedPreview.url);
    }
    
    setImagePreviews(newPreviews);
    
    // If the image is a new upload (not existing), remove it from formData
    if (!removedPreview.isExisting) {
      const newImages = formData.images.filter(
        (_, i) => i !== formData.images.findIndex(img => 
          img === removedPreview.file || 
          (img.name === removedPreview.file?.name && 
          img.size === removedPreview.file?.size)
        )
      );
      
      setFormData(prev => ({
        ...prev,
        images: newImages
      }));
      
      dispatch(setProductFormImages(newImages));
    }
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Product name is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (!formData.price) {
      errors.price = 'Price is required';
    } else if (isNaN(formData.price) || formData.price <= 0) {
      errors.price = 'Price must be a positive number';
    }
    
    if (!formData.stock) {
      errors.stock = 'Stock quantity is required';
    } else if (isNaN(formData.stock) || formData.stock < 0) {
      errors.stock = 'Stock must be a non-negative number';
    }
    
    if (!formData.category) {
      errors.category = 'Category is required';
    }
    
    if (!formData.subCategory || formData.subCategory.length === 0) {
      errors.subCategory = 'At least one subcategory is required';
    }
    
    if (!formData.brand.trim()) {
      errors.brand = 'Brand name is required';
    }
    
    if (imagePreviews.length === 0 && !isEdit) {
      errors.images = 'At least one product image is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    // Create form data for image upload
    const productData = new FormData();
    
    // Add form fields to FormData
    productData.append('name', formData.name);
    productData.append('description', formData.description);
    productData.append('price', formData.price);
    productData.append('stock', formData.stock);
    productData.append('category', formData.category);
    productData.append('brand', formData.brand);
    
    // Add subCategories as array
    formData.subCategory.forEach(subCat => {
      productData.append('subCategory', subCat);
    });
    
    // Add new images
    formData.images.forEach(image => {
      productData.append('images', image);
    });
    
    // If editing, add existing images that weren't removed
    if (isEdit) {
      const existingImages = imagePreviews
        .filter(preview => preview.isExisting)
        .map(preview => preview.original);
      
      if (existingImages.length > 0) {
        productData.append('existingImages', JSON.stringify(existingImages));
      }
      
      // Update product
      // Implementation for update would go here
      alert('Product update functionality would be implemented here.');
    } else {
      // Create new product
      dispatch(createProduct(productData));
    }
  };
  
  // Clean up preview URLs when component unmounts
  useEffect(() => {
    return () => {
      imagePreviews.forEach(preview => {
        if (!preview.isExisting && preview.url) {
          URL.revokeObjectURL(preview.url);
        }
      });
    };
  }, [imagePreviews]);
  
  return (
    <Card title={isEdit ? 'Edit Product' : 'Add New Product'}>
      {/* Success message */}
      {successMessage && (
        <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
          {successMessage}
        </div>
      )}
      
      {/* Error message */}
      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          {error}
        </div>
      )}
      
      {/* Form validation errors */}
      {Object.keys(formErrors).length > 0 && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
          <p className="font-medium">Please correct the following errors:</p>
          <ul className="list-disc list-inside mt-2">
            {Object.values(formErrors).map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          {/* Basic Product Information */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                name="name"
                label="Product Name"
                placeholder="Enter product name"
                value={formData.name}
                onChange={handleChange}
                error={formErrors.name}
                required
              />
              
              <Input
                name="brand"
                label="Brand"
                placeholder="Enter brand name"
                value={formData.brand}
                onChange={handleChange}
                error={formErrors.brand}
                required
              />
            </div>
            
            <div className="mt-4">
              <Textarea
                name="description"
                label="Product Description"
                placeholder="Enter detailed product description"
                value={formData.description}
                onChange={handleChange}
                error={formErrors.description}
                rows={4}
                required
              />
            </div>
          </div>
          
          {/* Category and Subcategory */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Category</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Select
                name="category"
                label="Category"
                value={formData.category}
                onChange={handleChange}
                error={formErrors.category}
                required
                options={categories.map(category => ({
                  value: category.name.toLowerCase(),
                  label: category.name
                }))}
              />
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subcategories <span className="text-red-500">*</span>
                </label>
                <select
                  name="subCategory"
                  multiple
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md"
                  value={formData.subCategory}
                  onChange={handleChange}
                >
                  {subCategories.map((subCategory, index) => (
                    <option key={index} value={subCategory.toLowerCase()}>
                      {subCategory}
                    </option>
                  ))}
                </select>
                {formErrors.subCategory && (
                  <p className="mt-1 text-sm text-red-600">{formErrors.subCategory}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Hold Ctrl (or Cmd) to select multiple options
                </p>
              </div>
            </div>
          </div>
          
          {/* Pricing and Inventory */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pricing & Inventory</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                name="price"
                label="Price"
                type="number"
                placeholder="0.00"
                min="0.01"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                error={formErrors.price}
                required
              />
              
              <Input
                name="stock"
                label="Stock Quantity"
                type="number"
                placeholder="0"
                min="0"
                step="1"
                value={formData.stock}
                onChange={handleChange}
                error={formErrors.stock}
                required
              />
            </div>
          </div>
          
          {/* Product Images */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Product Images</h3>
            
            {/* Image previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200">
                      <img
                        src={preview.url}
                        alt={`Product image ${index + 1}`}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <button
                      type="button"
                      className="absolute top-1 right-1 h-6 w-6 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 focus:outline-none"
                      onClick={() => handleRemoveImage(index)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            {/* Image upload */}
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Images
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="images"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                    >
                      <span>Upload images</span>
                      <input
                        id="images"
                        name="images"
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        multiple
                        onChange={handleChange}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PNG, JPG, JPEG up to 5MB each</p>
                </div>
              </div>
              {formErrors.images && (
                <p className="mt-1 text-sm text-red-600">{formErrors.images}</p>
              )}
            </div>
          </div>
          
          {/* Form Actions */}
          <div className="flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/seller/products')}
            >
              Cancel
            </Button>
            
            <Button
              type="submit"
              loading={loading}
              disabled={loading}
            >
              {isEdit ? 'Update Product' : 'Add Product'}
            </Button>
          </div>
        </div>
      </form>
    </Card>
  );
};

export default AddProductForm;