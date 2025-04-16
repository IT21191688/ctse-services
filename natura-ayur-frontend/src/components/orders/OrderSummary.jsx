import React from 'react';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/dateUtils';
import { 
  ORDER_STATUS_DISPLAY, 
  ORDER_STATUS_COLORS, 
  PAYMENT_METHOD_DISPLAY 
} from '../../utils/constants';

/**
 * Component for displaying an order summary with pricing details
 * 
 * @param {Object} props
 * @param {Object} props.order - Order data
 * @param {boolean} [props.showDetails=true] - Whether to show detailed information
 * @param {boolean} [props.showStatus=true] - Whether to show order status
 * @param {boolean} [props.showAddress=true] - Whether to show shipping address
 */
const OrderSummary = ({ 
  order, 
  showDetails = true,
  showStatus = true,
  showAddress = true
}) => {
  if (!order) return null;
  
  const {
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    isPaid,
    paidAt,
    status,
    deliveredAt,
    shippingAddress,
    paymentMethod,
    createdAt
  } = order;
  
  // Get status color
  const getStatusColor = (status) => {
    const colorClass = {
      'blue': 'bg-blue-100 text-blue-800',
      'yellow': 'bg-yellow-100 text-yellow-800',
      'orange': 'bg-orange-100 text-orange-800',
      'purple': 'bg-purple-100 text-purple-800',
      'green': 'bg-green-100 text-green-800',
      'red': 'bg-red-100 text-red-800',
    };
    
    return colorClass[ORDER_STATUS_COLORS[status] || 'blue'];
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-xl font-semibold text-gray-800">Order Summary</h2>
      </div>
      
      <div className="p-6">
        {/* Order Status */}
        {showStatus && status && (
          <div className="mb-6">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-600 mr-2">Status:</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
                {ORDER_STATUS_DISPLAY[status]}
              </span>
            </div>
            
            {/* Paid Status */}
            <div className="mt-2 flex items-center">
              <span className="text-sm font-medium text-gray-600 mr-2">Payment:</span>
              {isPaid ? (
                <span className="inline-flex items-center text-green-600 text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Paid on {formatDate(paidAt)}
                </span>
              ) : (
                <span className="inline-flex items-center text-red-600 text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Not Paid
                </span>
              )}
            </div>
            
            {/* Delivery Status */}
            {deliveredAt && (
              <div className="mt-2 flex items-center">
                <span className="text-sm font-medium text-gray-600 mr-2">Delivery:</span>
                <span className="inline-flex items-center text-green-600 text-sm">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Delivered on {formatDate(deliveredAt)}
                </span>
              </div>
            )}
          </div>
        )}
        
        {/* Order Date */}
        {createdAt && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Order Date: <span className="font-medium">{formatDate(createdAt)}</span>
            </p>
          </div>
        )}
        
        {/* Shipping Address */}
        {showAddress && shippingAddress && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-900 mb-2">Shipping Address</h3>
            <div className="bg-gray-50 rounded p-3 text-sm">
              <p>{shippingAddress.address}</p>
              <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
              <p>{shippingAddress.country}</p>
            </div>
          </div>
        )}
        
        {/* Payment Method */}
        {paymentMethod && (
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Payment Method: <span className="font-medium">{PAYMENT_METHOD_DISPLAY[paymentMethod] || paymentMethod}</span>
            </p>
          </div>
        )}
        
        {/* Price Summary */}
        <div className="border-t border-gray-200 pt-4 mt-4">
          {showDetails && (
            <>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Subtotal:</span>
                <span className="text-sm font-medium">{formatCurrency(itemsPrice)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Tax:</span>
                <span className="text-sm font-medium">{formatCurrency(taxPrice)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-600">Shipping:</span>
                <span className="text-sm font-medium">{formatCurrency(shippingPrice)}</span>
              </div>
              <div className="border-t border-gray-200 mt-2 pt-2"></div>
            </>
          )}
          
          <div className="flex justify-between py-2">
            <span className="text-base font-medium text-gray-900">Total:</span>
            <span className="text-base font-medium text-gray-900">{formatCurrency(totalPrice)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;