import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectCartForCheckout, selectIsCartEmpty } from '../../redux/selectors/cartSelectors';
import { selectUser, selectUserAddress } from '../../redux/selectors/authSelectors';
import { createOrderAndCheckout } from '../../redux/actions/orderActions';
import Button from '../common/Button';
import Input, { Select } from '../common/Input';
import AddressForm from '../user/AddressForm';
import { PAYMENT_METHODS, PAYMENT_METHOD_DISPLAY } from '../../utils/constants';

/**
 * Checkout form component with address and payment method inputs
 */
const CheckoutForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // Get data from redux
  const user = useSelector(selectUser);
  const userAddress = useSelector(selectUserAddress);
  const cartData = useSelector(selectCartForCheckout);
  const isCartEmpty = useSelector(selectIsCartEmpty);
  
  // Form state
  const [shippingAddress, setShippingAddress] = useState({
    address: userAddress?.street || '',
    city: userAddress?.city || '',
    postalCode: userAddress?.postalCode || '',
    country: userAddress?.province || 'India', // Default country
  });
  
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS.STRIPE);
  const [useExistingAddress, setUseExistingAddress] = useState(!!userAddress);
  const [formErrors, setFormErrors] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Update address when user data loads or changes
  useEffect(() => {
    if (userAddress && useExistingAddress) {
      setShippingAddress({
        address: userAddress.street || '',
        city: userAddress.city || '',
        postalCode: userAddress.postalCode || '',
        country: userAddress.province || 'India',
      });
    }
  }, [userAddress, useExistingAddress]);
  
  // Redirect if cart is empty
  useEffect(() => {
    if (isCartEmpty) {
      navigate('/cart');
    }
  }, [isCartEmpty, navigate]);
  
  // Handle toggle for using existing address
  const handleToggleExistingAddress = () => {
    setUseExistingAddress(!useExistingAddress);
  };
  
  // Handle shipping address change
  const handleAddressChange = (newAddress) => {
    setShippingAddress(newAddress);
    setFormErrors({});
  };
  
  // Handle payment method change
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };
  
  // Validate form
  const validateForm = () => {
    const errors = {};
    
    // Validate address fields
    if (!shippingAddress.address) {
      errors.address = 'Address is required';
    }
    
    if (!shippingAddress.city) {
      errors.city = 'City is required';
    }
    
    if (!shippingAddress.postalCode) {
      errors.postalCode = 'Postal code is required';
    }
    
    if (!shippingAddress.country) {
      errors.country = 'Country is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsProcessing(true);
      
      // Create order with data
      const orderData = {
        orderItems: cartData.orderItems,
        shippingAddress,
        paymentMethod,
      };
      
      const result = await dispatch(createOrderAndCheckout(orderData));
      
      // If order created successfully, redirect
      if (result) {
        navigate('/order-success');
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsProcessing(false);
    }
  };
  
  // Payment method options
  const paymentOptions = Object.entries(PAYMENT_METHOD_DISPLAY).map(([value, label]) => ({
    value,
    label
  }));
  
  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Shipping Address Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Shipping Address</h2>
        
        {/* Toggle for using saved address (if available) */}
        {userAddress && (
          <div className="mb-6">
            <div className="flex items-center mb-4">
              <input
                id="use-existing-address"
                type="checkbox"
                checked={useExistingAddress}
                onChange={handleToggleExistingAddress}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <label htmlFor="use-existing-address" className="ml-2 block text-sm text-gray-700">
                Use my address on file
              </label>
            </div>
            
            {useExistingAddress && (
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="text-gray-700">{userAddress.street}</p>
                <p className="text-gray-700">{userAddress.city}, {userAddress.postalCode}</p>
                <p className="text-gray-700">{userAddress.province}</p>
              </div>
            )}
          </div>
        )}
        
        {/* Address Form */}
        {!useExistingAddress && (
          <AddressForm 
            initialAddress={shippingAddress}
            onChange={handleAddressChange}
            errors={formErrors}
          />
        )}
      </div>
      
      {/* Payment Method Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Payment Method</h2>
        
        <div className="mb-4">
          <Select
            name="paymentMethod"
            label="Select Payment Method"
            value={paymentMethod}
            onChange={handlePaymentMethodChange}
            options={paymentOptions}
            required
          />
        </div>
        
        {/* Payment method specific information */}
        {paymentMethod === PAYMENT_METHODS.STRIPE && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-4 text-sm text-blue-800">
            <p>You will be redirected to our secure payment gateway to complete your purchase after review.</p>
          </div>
        )}
        
        {paymentMethod === PAYMENT_METHODS.COD && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-sm text-yellow-800">
            <p>You will pay for your order when it is delivered to your address. Additional fees may apply.</p>
          </div>
        )}
      </div>
      
      {/* Submit Button */}
      <div className="flex justify-end pt-6">
        <Button
          type="submit"
          size="lg"
          loading={isProcessing}
          disabled={isProcessing || isCartEmpty}
        >
          {isProcessing ? 'Processing...' : 'Complete Order'}
        </Button>
      </div>
    </form>
  );
};

export default CheckoutForm;