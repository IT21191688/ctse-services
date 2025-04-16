import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchAllOrders, 
  updateOrderStatusWithNotification, 
  OrderStatus 
} from '../../redux/actions/orderActions';
import { 
  selectOrders, 
  selectTotalOrders, 
  selectOrderPages, 
  selectOrderLoading 
} from '../../redux/selectors/orderSelectors';
import { formatDate, formatCurrency } from '../../utils/dateUtils';
import Button from '../common/Button';
import { ContentLoading } from '../common/Loading';

const SellerOrders = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const orders = useSelector(selectOrders);
  const totalOrders = useSelector(selectTotalOrders);
  const totalPages = useSelector(selectOrderPages);
  const loading = useSelector(selectOrderLoading);
  
  // Local state
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  
  // Fetch orders on mount and when filters change
  useEffect(() => {
    dispatch(fetchAllOrders({ 
      page: currentPage, 
      limit: 10,
      status: statusFilter
    }));
  }, [dispatch, currentPage, statusFilter]);
  
  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };
  
  // Handle status filter change
  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filter changes
  };
  
  // Handle status update
  const handleUpdateStatus = (orderId, currentStatus) => {
    // Determine next status based on current status
    let newStatus;
    switch (currentStatus) {
      case OrderStatus.NEW:
        newStatus = OrderStatus.PROCESSING;
        break;
      case OrderStatus.PROCESSING:
        newStatus = OrderStatus.SHIPPED;
        break;
      case OrderStatus.SHIPPED:
        newStatus = OrderStatus.DELIVERED;
        break;
      default:
        newStatus = currentStatus;
    }
    
    // Only update if status changed
    if (newStatus !== currentStatus) {
      dispatch(updateOrderStatusWithNotification(orderId, newStatus));
    }
  };
  
  // Toggle expanded order
  const toggleExpandOrder = (orderId) => {
    if (expandedOrderId === orderId) {
      setExpandedOrderId(null);
    } else {
      setExpandedOrderId(orderId);
    }
  };
  
  // Get status badge color
  const getStatusColor = (status) => {
    switch (status) {
      case OrderStatus.NEW:
        return 'bg-blue-100 text-blue-800';
      case OrderStatus.PROCESSING:
        return 'bg-yellow-100 text-yellow-800';
      case OrderStatus.SHIPPED:
        return 'bg-purple-100 text-purple-800';
      case OrderStatus.DELIVERED:
        return 'bg-green-100 text-green-800';
      case OrderStatus.CANCELLED:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Get next status button text
  const getNextStatusText = (currentStatus) => {
    switch (currentStatus) {
      case OrderStatus.NEW:
        return 'Start Processing';
      case OrderStatus.PROCESSING:
        return 'Mark as Shipped';
      case OrderStatus.SHIPPED:
        return 'Mark as Delivered';
      default:
        return 'Update Status';
    }
  };
  
  // Check if order can be updated
  const canUpdateOrder = (status) => {
    return [OrderStatus.NEW, OrderStatus.PROCESSING, OrderStatus.SHIPPED].includes(status);
  };
  
  if (loading && orders.length === 0) {
    return <ContentLoading text="Loading orders..." />;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Manage Orders</h2>
        
        {/* Filter dropdown */}
        <div className="flex items-center">
          <label htmlFor="statusFilter" className="mr-2 text-sm text-gray-600">Filter by status:</label>
          <select
            id="statusFilter"
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">All Orders</option>
            {Object.values(OrderStatus).map((status) => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      {orders.length > 0 ? (
        <>
          {/* Orders table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr className="hover:bg-gray-50 cursor-pointer" onClick={() => toggleExpandOrder(order._id)}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        {order.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {order.user?.firstName} {order.user?.lastName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {formatCurrency(order.totalPrice)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {canUpdateOrder(order.status) ? (
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleUpdateStatus(order._id, order.status);
                            }}
                          >
                            {getNextStatusText(order.status)}
                          </Button>
                        ) : (
                          <span className="text-sm text-gray-500">
                            {order.status === OrderStatus.DELIVERED ? 'Completed' : 'No actions'}
                          </span>
                        )}
                      </td>
                    </tr>
                    
                    {/* Expanded order details */}
                    {expandedOrderId === order._id && (
                      <tr>
                        <td colSpan="6" className="p-4 bg-gray-50">
                          <div className="border-t border-gray-200 pt-4">
                            <h4 className="text-sm font-semibold mb-2">Order Items</h4>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                              {order.orderItems.map((item) => (
                                <div 
                                  key={item._id} 
                                  className="flex items-center p-2 border border-gray-200 rounded-md"
                                >
                                  <div className="w-12 h-12 overflow-hidden rounded-md flex-shrink-0">
                                    <img 
                                      src={item.image} 
                                      alt={item.name} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div className="ml-3 flex-1">
                                    <p className="text-sm font-medium text-gray-800">{item.name}</p>
                                    <p className="text-sm text-gray-500">
                                      {item.quantity} x {formatCurrency(item.price)}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            {/* Shipping Address */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div>
                                <h4 className="text-sm font-semibold mb-2">Shipping Address</h4>
                                <div className="text-sm text-gray-600">
                                  <p>{order.shippingAddress.address}</p>
                                  <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                                  <p>{order.shippingAddress.country}</p>
                                </div>
                              </div>
                              
                              {/* Order Summary */}
                              <div>
                                <h4 className="text-sm font-semibold mb-2">Order Summary</h4>
                                <div className="text-sm">
                                  <div className="flex justify-between mb-1">
                                    <span className="text-gray-600">Items:</span>
                                    <span className="font-medium">{formatCurrency(order.itemsPrice)}</span>
                                  </div>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-gray-600">Shipping:</span>
                                    <span className="font-medium">{formatCurrency(order.shippingPrice)}</span>
                                  </div>
                                  <div className="flex justify-between mb-1">
                                    <span className="text-gray-600">Tax:</span>
                                    <span className="font-medium">{formatCurrency(order.taxPrice)}</span>
                                  </div>
                                  <div className="flex justify-between pt-2 border-t border-gray-200 mt-2">
                                    <span className="font-semibold">Total:</span>
                                    <span className="font-semibold">{formatCurrency(order.totalPrice)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Payment Info */}
                            <div className="mt-4">
                              <h4 className="text-sm font-semibold mb-2">Payment Information</h4>
                              <div className="text-sm text-gray-600">
                                <p>
                                  <span className="font-medium">Method:</span> {order.paymentMethod}
                                </p>
                                <p>
                                  <span className="font-medium">Status:</span> {order.isPaid ? 'Paid' : 'Not Paid'}
                                  {order.isPaid && order.paidAt && ` (${formatDate(order.paidAt)})`}
                                </p>
                              </div>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-6">
              <nav className="flex items-center space-x-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === 1
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-label="Previous page"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 rounded-md ${
                        page === currentPage
                          ? 'bg-green-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === totalPages
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  aria-label="Next page"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </nav>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-10">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
          <p className="text-gray-500">
            {statusFilter ? `No orders with status "${statusFilter}" found.` : 'You haven\'t received any orders yet.'}
          </p>
        </div>
      )}
    </div>
  );
};

export default SellerOrders;