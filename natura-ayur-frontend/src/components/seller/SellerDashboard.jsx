import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  fetchOrderStatistics, 
  OrderStatus 
} from '../../redux/actions/orderActions';
import { fetchSellerProducts } from '../../redux/actions/productActions';
import { 
  selectOrderStatistics, 
  selectRecentOrders,
  selectOrderStatusCounts
} from '../../redux/selectors/orderSelectors';
import {
  selectSellerProducts,
  selectProductLoading
} from '../../redux/selectors/productSelectors';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/dateUtils';
import Card from '../common/Card';
import Button from '../common/Button';
import { ContentLoading } from '../common/Loading';

/**
 * Seller Dashboard component
 */
const SellerDashboard = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const orderStats = useSelector(selectOrderStatistics);
  const recentOrders = useSelector(selectRecentOrders);
  const statusCounts = useSelector(selectOrderStatusCounts);
  const products = useSelector(selectSellerProducts);
  const loading = useSelector(selectProductLoading);
  
  // State for date range selection
  const [dateRange, setDateRange] = useState('week');
  
  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchOrderStatistics());
    dispatch(fetchSellerProducts());
  }, [dispatch]);
  
  // Status color classes
  const statusColors = {
    [OrderStatus.NEW]: 'bg-blue-100 text-blue-800',
    [OrderStatus.PENDING]: 'bg-yellow-100 text-yellow-800',
    [OrderStatus.PROCESSING]: 'bg-orange-100 text-orange-800',
    [OrderStatus.SHIPPED]: 'bg-purple-100 text-purple-800',
    [OrderStatus.DELIVERED]: 'bg-green-100 text-green-800',
    [OrderStatus.CANCELLED]: 'bg-red-100 text-red-800',
  };
  
  if (loading && !products.length) {
    return <ContentLoading text="Loading dashboard data..." />;
  }
  
  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>
        
        <div className="flex items-center">
          {/* Date range selector */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-sm"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Revenue */}
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-200 bg-opacity-50 mr-4">
              <svg className="h-6 w-6 text-green-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-green-800">Total Revenue</p>
              <h3 className="text-xl font-bold text-gray-900">{formatCurrency(orderStats?.totalRevenue || 0)}</h3>
            </div>
          </div>
        </Card>
        
        {/* Orders */}
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-200 bg-opacity-50 mr-4">
              <svg className="h-6 w-6 text-blue-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-blue-800">Total Orders</p>
              <h3 className="text-xl font-bold text-gray-900">{orderStats?.totalOrders || 0}</h3>
            </div>
          </div>
        </Card>
        
        {/* Products */}
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-200 bg-opacity-50 mr-4">
              <svg className="h-6 w-6 text-purple-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-purple-800">Active Products</p>
              <h3 className="text-xl font-bold text-gray-900">{products.length}</h3>
            </div>
          </div>
        </Card>
        
        {/* Pending Orders */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-200 bg-opacity-50 mr-4">
              <svg className="h-6 w-6 text-orange-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-orange-800">Pending Orders</p>
              <h3 className="text-xl font-bold text-gray-900">{(statusCounts?.[OrderStatus.NEW] || 0) + (statusCounts?.[OrderStatus.PROCESSING] || 0)}</h3>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card title="Recent Orders">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recentOrders && recentOrders.length > 0 ? (
                  recentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                        <Link to={`/seller/orders/${order._id}`} className="text-green-600 hover:text-green-900">
                          {order.orderId}
                        </Link>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusColors[order.status]}`}>
                          {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        {formatCurrency(order.totalPrice)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-500">
                      No recent orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button variant="outline" as={Link} to="/seller/orders">
              View All Orders
            </Button>
          </div>
        </Card>
        
        {/* Top Products */}
        <Card title="Top Products">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sold
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products && products.length > 0 ? (
                  // Sort by sold stock and slice top 5
                  [...products]
                    .sort((a, b) => (b.soldStock || 0) - (a.soldStock || 0))
                    .slice(0, 5)
                    .map((product) => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 whitespace-nowrap">
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
                                <Link 
                                  to={`/seller/products/edit/${product._id}`} 
                                  className="hover:text-green-600"
                                >
                                  {product.name}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {formatCurrency(product.price)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {product.stock}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                          {product.soldStock || 0}
                        </td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-4 text-center text-sm text-gray-500">
                      No products found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button variant="outline" as={Link} to="/seller/products">
              View All Products
            </Button>
          </div>
        </Card>
      </div>
      
      {/* Order Status Overview */}
      <Card title="Order Status Overview">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {Object.entries(OrderStatus).map(([key, status]) => (
            <div key={status} className="bg-white p-4 rounded-lg border border-gray-200 text-center">
              <div className={`inline-flex items-center justify-center h-8 w-8 rounded-full ${statusColors[status]} mb-2`}>
                <span className="text-xs font-medium">{String(statusCounts?.[status] || 0)}</span>
              </div>
              <p className="text-xs font-medium text-gray-500">{key}</p>
            </div>
          ))}
        </div>
      </Card>
      
      {/* Quick Actions */}
      <Card title="Quick Actions">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <Button as={Link} to="/seller/products/add" className="flex items-center justify-center">
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Product
          </Button>
          
          <Button as={Link} to="/seller/orders" variant="outline" className="flex items-center justify-center">
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Manage Orders
          </Button>
          
          <Button as={Link} to="/seller/profile" variant="outline" className="flex items-center justify-center">
            <svg className="h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Store Settings
          </Button>
        </div>
      </Card>
    </div>
    )
}