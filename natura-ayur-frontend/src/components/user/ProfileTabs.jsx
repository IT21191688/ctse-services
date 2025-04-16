import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { 
  selectIsAuthenticated, 
  selectUserRole, 
  selectIsSeller
} from '../../redux/selectors/authSelectors';

/**
 * Profile navigation tabs component
 */
const ProfileTabs = () => {
  const location = useLocation();
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  const isSeller = useSelector(selectIsSeller);
  
  // Available tabs based on user role
  const [tabs, setTabs] = useState([]);
  
  // Set tabs based on user role
  useEffect(() => {
    if (isAuthenticated) {
      const userTabs = [
        { name: 'Profile', path: '/profile', icon: userIcon },
        { name: 'Orders', path: '/orders', icon: orderIcon },
        { name: 'Reviews', path: '/profile/reviews', icon: reviewIcon },
        { name: 'Saved Items', path: '/profile/saved', icon: savedIcon },
      ];
      
      // Add seller tabs if user is a seller
      if (isSeller) {
        userTabs.push(
          { name: 'Seller Dashboard', path: '/seller/dashboard', icon: dashboardIcon },
          { name: 'My Products', path: '/seller/products', icon: productIcon },
          { name: 'Seller Orders', path: '/seller/orders', icon: sellerOrderIcon }
        );
      } else {
        // Add become seller tab if user is not a seller
        userTabs.push({ name: 'Become a Seller', path: '/profile/become-seller', icon: becomeSeller });
      }
      
      // Add admin tabs if user is an admin
      if (userRole === 'admin') {
        userTabs.push(
          { name: 'Admin Dashboard', path: '/admin/dashboard', icon: adminIcon },
          { name: 'Manage Users', path: '/admin/users', icon: userManageIcon },
          { name: 'Manage Products', path: '/admin/products', icon: productManageIcon }
        );
      }
      
      setTabs(userTabs);
    }
  }, [isAuthenticated, userRole, isSeller]);
  
  // Check if a path is active
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };
  
  // If not authenticated, don't render tabs
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
      <div className="sm:hidden">
        {/* Mobile dropdown */}
        <select
          className="block w-full bg-white border-gray-300 rounded-md py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-green-500 focus:border-green-500"
          defaultValue={tabs.find(tab => isActive(tab.path))?.path || tabs[0]?.path}
          onChange={(e) => {
            window.location.href = e.target.value;
          }}
        >
          {tabs.map((tab) => (
            <option key={tab.path} value={tab.path}>
              {tab.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* Desktop tabs */}
      <div className="hidden sm:block">
        <nav className="flex px-4 overflow-x-auto" aria-label="Profile navigation">
          {tabs.map((tab) => (
            <Link
              key={tab.path}
              to={tab.path}
              className={`inline-flex items-center px-4 py-3 border-b-2 text-sm font-medium whitespace-nowrap ${
                isActive(tab.path)
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              aria-current={isActive(tab.path) ? 'page' : undefined}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

// Tab icons
const userIcon = (
  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const orderIcon = (
  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const reviewIcon = (
  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const savedIcon = (
  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const dashboardIcon = (
  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
  </svg>
);

const productIcon = (
  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const sellerOrderIcon = (
  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const becomeSeller = (
  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const adminIcon = (
  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
  </svg>
);

const userManageIcon = (
  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const productManageIcon = (
  <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
  </svg>
);

export default ProfileTabs;