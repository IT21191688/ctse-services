import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserOrders } from '../../redux/actions/orderActions';
import { selectUserOrders, selectOrderLoading } from '../../redux/selectors/orderSelectors';
import OrderItem from './OrderItem';
import Button from '../common/Button';
import { ContentLoading } from '../common/Loading';

/**
 * Component for displaying a list of user orders
 * 
 * @param {Object} props
 * @param {string} [props.status] - Filter orders by status
 * @param {number} [props.limit] - Limit the number of orders to display
 * @param {boolean} [props.showViewAll=false] - Whether to show a "View All" button
 * @param {string} [props.viewAllUrl="/orders"] - URL for the "View All" button
 */
const OrderList = ({ 
  status, 
  limit, 
  showViewAll = false,
  viewAllUrl = "/orders"
}) => {
  const dispatch = useDispatch();
  
  // Selectors
  const orders = useSelector(selectUserOrders);
  const loading = useSelector(selectOrderLoading);
  
  // State for filtered orders
  const [filteredOrders, setFilteredOrders] = useState([]);
  
  // Fetch orders on mount
  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);
  
  // Filter and limit orders when orders or filters change
  useEffect(() => {
    let result = [...orders];
    
    // Apply status filter
    if (status) {
      result = result.filter(order => order.status === status);
    }
    
    // Apply limit
    if (limit && result.length > limit) {
      result = result.slice(0, limit);
    }
    
    setFilteredOrders(result);
  }, [orders, status, limit]);
  
  if (loading && orders.length === 0) {
    return <ContentLoading text="Loading orders..." />;
  }
  
  if (filteredOrders.length === 0) {
    return (
      <div className="text-center py-8">
        <svg 
          className="w-12 h-12 text-gray-400 mx-auto mb-4" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={1.5} 
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
          />
        </svg>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
        <p className="text-gray-600">
          {status 
            ? `You don't have any orders with status "${status}".` 
            : "You haven't placed any orders yet."}
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {filteredOrders.map(order => (
        <OrderItem key={order._id} order={order} />
      ))}
      
      {/* Show View All button if needed */}
      {showViewAll && orders.length > filteredOrders.length && (
        <div className="text-center mt-6">
          <Button
            variant="outline"
            to={viewAllUrl}
          >
            View All Orders
          </Button>
        </div>
      )}
    </div>
  );
};

export default OrderList;