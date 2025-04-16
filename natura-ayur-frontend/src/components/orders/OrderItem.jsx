import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/dateUtils';
import { 
  ORDER_STATUS, 
  ORDER_STATUS_DISPLAY, 
  ORDER_STATUS_COLORS 
} from '../../utils/constants';

/**
 * Component to display a single order item in a list
 * 
 * @param {Object} props
 * @param {Object} props.order - Order data
 * @param {boolean} [props.showDetails=true] - Whether to show the "View Details" link
 */
const OrderItem = ({ order, showDetails = true }) => {
  const {
    _id,
    orderId,
    orderItems = [],
    createdAt,
    status,
    totalPrice,
    isPaid,
    paidAt,
    deliveredAt,
  } = order;
  
  // Calculate total items
  const totalItems = orderItems.reduce((total, item) => total + item.quantity, 0);
  
  // Get status color
  const getStatusColor = () => {
    const colors = {
      [ORDER_STATUS.NEW]: 'blue',
      [ORDER_STATUS.PENDING]: 'yellow',
      [ORDER_STATUS.PROCESSING]: 'indigo',
      [ORDER_STATUS.SHIPPED]: 'purple',
      [ORDER_STATUS.DELIVERED]: 'green',
      [ORDER_STATUS.CANCELLED]: 'red',
    };
    
    return colors[status] || 'gray';
  };
  
  // Status color class mappings
  const statusColorClasses = {
    blue: 'bg-blue-100 text-blue-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    purple: 'bg-purple-100 text-purple-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800',
  };
  
  // Get status class
  const statusClass = statusColorClasses[getStatusColor()];
  
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Order Header with ID and Date */}
      <div className="bg-gray-50 px-4 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h3 className="font-medium text-gray-900">
            Order #{orderId}
          </h3>
          <p className="text-sm text-gray-500">
            Placed on {formatDate(createdAt)}
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Status Badge */}
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusClass}`}>
            {ORDER_STATUS_DISPLAY[status] || status}
          </span>
          
          {/* Payment Status */}
          {isPaid ? (
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
              Paid{paidAt && ` on ${formatDate(paidAt)}`}
            </span>
          ) : (
            <span className="text-xs text-yellow-600 bg-yellow-50 px-2 py-1 rounded-full">
              Payment Pending
            </span>
          )}
        </div>
      </div>
      
      {/* Order Summary */}
      <div className="p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          {/* Order Items Preview */}
          <div className="flex-grow">
            <div className="flex items-center gap-4 mb-3">
              {/* Show first 3 product images */}
              <div className="flex -space-x-2">
                {orderItems.slice(0, 3).map((item, index) => (
                  <div 
                    key={index} 
                    className="w-12 h-12 rounded-md overflow-hidden border border-gray-200 bg-gray-50"
                  >
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                
                {/* Show count of remaining items if more than 3 */}
                {orderItems.length > 3 && (
                  <div className="w-12 h-12 rounded-md bg-gray-100 flex items-center justify-center border border-gray-200">
                    <span className="text-xs text-gray-600 font-medium">
                      +{orderItems.length - 3}
                    </span>
                  </div>
                )}
              </div>
              
              <div>
                <p className="text-sm text-gray-900 font-medium">
                  {totalItems} {totalItems === 1 ? 'item' : 'items'}
                </p>
                <p className="text-sm text-gray-500">
                  {orderItems.slice(0, 2).map(item => item.name).join(', ')}
                  {orderItems.length > 2 && ', ...'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Order Total and Actions */}
          <div className="flex flex-col sm:items-end justify-between gap-3">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(totalPrice)}
              </p>
            </div>
            
            {/* Action Buttons */}
            {showDetails && (
              <Link
                to={`/orders/${_id}`}
                className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                View Details
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderItem;