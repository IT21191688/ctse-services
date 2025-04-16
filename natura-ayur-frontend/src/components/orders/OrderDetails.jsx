import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { cancelUserOrder } from '../../redux/actions/orderActions';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/dateUtils';
import Button from '../common/Button';
import { 
  ORDER_STATUS, 
  ORDER_STATUS_DISPLAY,
  ORDER_STATUS_COLORS,
  PAYMENT_METHOD_DISPLAY 
} from '../../utils/constants';

/**
 * Component to display detailed information about an order
 * 
 * @param {Object} props
 * @param {Object} props.order - Order data
 */
const OrderDetails = ({ order }) => {
  const dispatch = useDispatch();
  
  // Cancel order handler
  const handleCancelOrder = () => {
    if (window.confirm('Are you sure you want to cancel this order? This action cannot be undone.')) {
      dispatch(cancelUserOrder(order._id));
    }
  };
  
  // Check if order can be cancelled
  const canBeCancelled = ![
    ORDER_STATUS.DELIVERED, 
    ORDER_STATUS.SHIPPED, 
    ORDER_STATUS.CANCELLED
  ].includes(order.status);
  
  // Get status color classes
  const getStatusClasses = (status) => {
    const colorKey = ORDER_STATUS_COLORS[status] || 'gray';
    const colors = {
      blue: 'bg-blue-100 text-blue-800',
      yellow: 'bg-yellow-100 text-yellow-800',
      indigo: 'bg-indigo-100 text-indigo-800', 
      purple: 'bg-purple-100 text-purple-800',
      green: 'bg-green-100 text-green-800',
      red: 'bg-red-100 text-red-800',
      gray: 'bg-gray-100 text-gray-800',
    };
    
    return colors[colorKey];
  };
  
  // Return null if no order
  if (!order) return null;
  
  return (
    <div className="space-y-8">
      {/* Order Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {/* Order ID and Date */}
          <div>
            <h2 className="text-xl font-bold text-gray-900">Order #{order.orderId}</h2>
            <p className="text-gray-600">Placed on {formatDate(order.createdAt)}</p>
          </div>
          
          {/* Order Status */}
          <div className="flex flex-col md:items-end">
            <div className="flex items-center gap-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusClasses(order.status)}`}>
                {ORDER_STATUS_DISPLAY[order.status] || order.status}
              </span>
            </div>
            
            {/* Payment Status */}
            <p className="text-gray-600 mt-1">
              {order.isPaid ? (
                <>Payment completed {order.paidAt && `on ${formatDate(order.paidAt)}`}</>
              ) : (
                'Payment pending'
              )}
            </p>
          </div>
        </div>
        
        {/* Action Buttons */}
        {canBeCancelled && (
          <div className="mt-6 flex justify-end">
            <Button
              variant="outline"
              className="text-red-600 border-red-600 hover:bg-red-50"
              onClick={handleCancelOrder}
            >
              Cancel Order
            </Button>
          </div>
        )}
      </div>
      
      {/* Order Items */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
        
        <div className="divide-y divide-gray-200">
          {order.orderItems.map((item, index) => (
            <div key={index} className="py-4 flex flex-col sm:flex-row gap-4">
              {/* Product Image */}
              <div className="w-full sm:w-20 h-20 flex-shrink-0">
                <img 
                  src={item.image} 
                  alt={item.name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              
              <div className="flex-grow flex flex-col sm:flex-row justify-between">
                {/* Product Info */}
                <div>
                  <h4 className="font-medium text-gray-900">
                    <Link to={`/products/${item.product}`} className="hover:text-green-600">
                      {item.name}
                    </Link>
                  </h4>
                  <p className="text-gray-600 text-sm">
                    {formatCurrency(item.price)} × {item.quantity}
                  </p>
                </div>
                
                {/* Item Total */}
                <div className="text-right mt-2 sm:mt-0">
                  <p className="font-medium text-gray-900">
                    {formatCurrency(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Order Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping & Payment Info */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping & Payment</h3>
          
          <div className="space-y-4">
            {/* Shipping Address */}
            <div>
              <h4 className="font-medium text-gray-900">Shipping Address</h4>
              <address className="text-gray-600 not-italic mt-1">
                {order.shippingAddress.address}<br />
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}
              </address>
            </div>
            
            {/* Delivery Status */}
            <div>
              <h4 className="font-medium text-gray-900">Delivery Status</h4>
              <p className="text-gray-600 mt-1">
                {order.status === ORDER_STATUS.DELIVERED ? (
                  <>Delivered {order.deliveredAt && `on ${formatDate(order.deliveredAt)}`}</>
                ) : order.status === ORDER_STATUS.SHIPPED ? (
                  'Shipped and on the way'
                ) : (
                  'Not yet shipped'
                )}
              </p>
            </div>
            
            {/* Payment Method */}
            <div>
              <h4 className="font-medium text-gray-900">Payment Method</h4>
              <p className="text-gray-600 mt-1">
                {PAYMENT_METHOD_DISPLAY[order.paymentMethod] || order.paymentMethod}
              </p>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="text-gray-900">{formatCurrency(order.itemsPrice)}</span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Shipping</span>
              <span className="text-gray-900">
                {order.shippingPrice === 0 ? 'Free' : formatCurrency(order.shippingPrice)}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="text-gray-600">Tax</span>
              <span className="text-gray-900">{formatCurrency(order.taxPrice)}</span>
            </div>
            
            <div className="border-t border-gray-200 pt-3 mt-3">
              <div className="flex justify-between font-semibold">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">{formatCurrency(order.totalPrice)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Order Notes (if any) */}
      {order.notes && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Order Notes</h3>
          <p className="text-gray-600">{order.notes}</p>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;