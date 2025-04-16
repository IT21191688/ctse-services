import React, { useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectIsAuthenticated,
  selectUser,
  selectUserFullName,
  selectUserAvatar,
  selectIsSeller
} from '../redux/selectors/authSelectors';
import { getUserProfile } from '../redux/actions/authActions';

/**
 * Seller dashboard layout component
 * Used for seller dashboard, products, orders, and other seller-specific pages
 */
const SellerLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const isSeller = useSelector(selectIsSeller);
  const user = useSelector(selectUser);
  const fullName = useSelector(selectUserFullName);
  const avatar = useSelector(selectUserAvatar);
  
  // Redirect to login if not authenticated or to home if not a seller
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
    } else if (isAuthenticated && !isSeller) {
      navigate('/');
    }
  }, [isAuthenticated, isSeller, navigate, location]);
  
  // Fetch user profile data if needed
  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getUserProfile());
    }
  }, [isAuthenticated, user, dispatch]);
  
  // Navigation links for the seller dashboard
  const sellerLinks = [
    { name: 'Dashboard', path: '/seller/dashboard', icon: dashboardIcon },
    { name: 'Products', path: '/seller/products', icon: productsIcon },
    { name: 'Orders', path: '/seller/orders', icon: ordersIcon },
    { name: 'Reviews', path: '/seller/reviews', icon: reviewsIcon },
    { name: 'Settings', path: '/seller/settings', icon: settingsIcon },
  ];
  
  // Check if the current path matches the link path
  const isActive = (path) => {
    if (path === '/seller/dashboard') {
      return location.pathname === path;
    }
    
    if (path === '/seller/products' && location.pathname.includes('/seller/products/add')) {
      return true;
    }
    
    if (path === '/seller/products' && location.pathname.includes('/seller/products/edit')) {
      return true;
    }
    
    return location.pathname.startsWith(path);
  };
  
  if (!isAuthenticated || !isSeller) {
    return null; // Don't render anything while redirecting
  }
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64 bg-gray-800">
          {/* Logo and store info */}
          <div className="flex items-center h-16 px-4 bg-gray-900 text-white">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold">NaturaAyur</span>
            </Link>
          </div>
          
          {/* Store/Seller info */}
          <div className="flex flex-col items-center py-6 border-b border-gray-700">
            <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-700 mb-3">
              {avatar ? (
                <img src={avatar} alt={fullName} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full flex items-center justify-center bg-green-600 text-white">
                  {fullName ? fullName.charAt(0).toUpperCase() : 'S'}
                </div>
              )}
            </div>
            <h2 className="text-white font-medium">{fullName}</h2>
            <p className="text-gray-400 text-sm">
              {user?.seller?.storeName || "Seller Account"}
            </p>
          </div>
          
          {/* Navigation */}
          <div className="py-4 flex-1">
            <nav className="space-y-1 px-2">
              {sellerLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                    isActive(link.path)
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="mr-3 h-6 w-6">{link.icon}</span>
                  {link.name}
                </Link>
              ))}
            </nav>
          </div>
          
          {/* Bottom links */}
          <div className="py-4 border-t border-gray-700 px-2">
            <Link
              to="/profile"
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <span className="mr-3 h-6 w-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              My Account
            </Link>
            <Link
              to="/"
              className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <span className="mr-3 h-6 w-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </span>
              Storefront
            </Link>
          </div>
        </div>
      </div>
      
      {/* Mobile sidebar */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-gray-800 text-white flex items-center justify-between h-16 px-4">
        <Link to="/" className="text-xl font-bold">NaturaAyur</Link>
        
        {/* Mobile menu button */}
        <button className="text-white focus:outline-none">
          <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>
      
      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        <main className="flex-1 relative overflow-y-auto focus:outline-none py-6 md:py-6 bg-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

// Icons for the sidebar
const dashboardIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
  </svg>
);

const productsIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const ordersIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
  </svg>
);

const reviewsIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
  </svg>
);

const settingsIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export default SellerLayout;