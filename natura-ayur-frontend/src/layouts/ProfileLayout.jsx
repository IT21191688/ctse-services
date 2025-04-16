import React, { useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  selectIsAuthenticated, 
  selectUser, 
  selectUserFullName, 
  selectUserAvatar 
} from '../redux/selectors/authSelectors';
import { getUserProfile } from '../redux/actions/authActions';
import Card from '../components/common/Card';

/**
 * Profile layout component
 * Used for user profile, orders, and other user-specific pages
 * Includes a sidebar with navigation links
 */
const ProfileLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const fullName = useSelector(selectUserFullName);
  const avatar = useSelector(selectUserAvatar);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
    }
  }, [isAuthenticated, navigate, location]);
  
  // Fetch user profile data if needed
  useEffect(() => {
    if (isAuthenticated && !user) {
      dispatch(getUserProfile());
    }
  }, [isAuthenticated, user, dispatch]);
  
  // Navigation links for the profile sidebar
  const profileLinks = [
    { name: 'Profile Details', path: '/profile', icon: userIcon },
    { name: 'My Orders', path: '/orders', icon: orderIcon },
    { name: 'Addresses', path: '/profile/addresses', icon: locationIcon },
    { name: 'Payment Methods', path: '/profile/payment', icon: cardIcon },
    { name: 'Reviews', path: '/profile/reviews', icon: reviewIcon },
  ];
  
  // Check if the current path matches the link path
  const isActive = (path) => {
    if (path === '/profile') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  if (!isAuthenticated) {
    return null; // Don't render anything while redirecting
  }
  
  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              {/* User info */}
              <div className="flex items-center p-4 border-b border-gray-200">
                <div className="h-12 w-12 rounded-full overflow-hidden bg-gray-300">
                  {avatar ? (
                    <img src={avatar} alt={fullName} className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-green-600 text-white">
                      {fullName ? fullName.charAt(0).toUpperCase() : 'U'}
                    </div>
                  )}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-800">{fullName}</h3>
                  <p className="text-sm text-gray-600">{user?.email}</p>
                </div>
              </div>
              
              {/* Navigation links */}
              <nav className="p-4">
                <ul className="space-y-1">
                  {profileLinks.map((link) => (
                    <li key={link.path}>
                      <Link
                        to={link.path}
                        className={`flex items-center px-4 py-2 rounded-md ${
                          isActive(link.path)
                            ? 'bg-green-50 text-green-700 font-medium'
                            : 'text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <span className="mr-3">{link.icon}</span>
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              
              {/* Become a seller (if not already) */}
              {user?.role !== 'seller' && user?.role !== 'admin' && (
                <div className="p-4 border-t border-gray-200">
                  <Link
                    to="/profile/become-seller"
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-center justify-center"
                  >
                    <span className="mr-2">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </span>
                    Become a Seller
                  </Link>
                </div>
              )}
              
              {/* Seller/Admin dashboard link */}
              {(user?.role === 'seller' || user?.role === 'admin') && (
                <div className="p-4 border-t border-gray-200">
                  <Link
                    to={user?.role === 'admin' ? '/admin/dashboard' : '/seller/dashboard'}
                    className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900 transition-colors text-center justify-center"
                  >
                    <span className="mr-2">
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </span>
                    {user?.role === 'admin' ? 'Admin Dashboard' : 'Seller Dashboard'}
                  </Link>
                </div>
              )}
            </Card>
          </div>
          
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

// Icons for the sidebar
const userIcon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const orderIcon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const locationIcon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const cardIcon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);

const reviewIcon = (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);