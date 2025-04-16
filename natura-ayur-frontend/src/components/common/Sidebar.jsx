import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarState } from '../../redux/slices/uiSlice';
import { selectSidebarOpen } from '../../redux/selectors/uiSelectors';
import { selectIsAuthenticated, selectUserRole } from '../../redux/selectors/authSelectors';
import { logoutUser } from '../../redux/actions/authActions';

const Sidebar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isOpen = useSelector(selectSidebarOpen);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const userRole = useSelector(selectUserRole);
  
  // Close sidebar when route changes
  useEffect(() => {
    dispatch(setSidebarState(false));
  }, [location.pathname, dispatch]);
  
  // When sidebar is open, prevent body scrolling
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup function
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  // Handle sidebar close
  const closeSidebar = () => {
    dispatch(setSidebarState(false));
  };
  
  // Handle logout
  const handleLogout = () => {
    dispatch(logoutUser());
    closeSidebar();
  };
  
  // Navigation links based on user role
  const getNavLinks = () => {
    const links = [
      { title: 'Home', path: '/', show: true, icon: homeIcon },
      { title: 'Shop All', path: '/products', show: true, icon: shopIcon },
      { title: 'Categories', path: '/categories', show: true, icon: categoriesIcon },
      { title: 'About Us', path: '/about', show: true, icon: aboutIcon },
      { title: 'Contact', path: '/contact', show: true, icon: contactIcon },
      { title: 'My Profile', path: '/profile', show: isAuthenticated, icon: profileIcon },
      { title: 'My Orders', path: '/orders', show: isAuthenticated, icon: ordersIcon },
      { title: 'Shopping Cart', path: '/cart', show: true, icon: cartIcon },
      { title: 'Seller Dashboard', path: '/seller/dashboard', show: userRole === 'seller', icon: dashboardIcon },
      { title: 'Admin Dashboard', path: '/admin/dashboard', show: userRole === 'admin', icon: adminIcon },
    ];
    
    return links.filter(link => link.show);
  };
  
  // Is the current path active?
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:hidden`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <Link to="/" className="text-xl font-bold text-green-700" onClick={closeSidebar}>
              NaturaAyur
            </Link>
            <button 
              className="p-2 rounded-md text-gray-600 hover:bg-gray-100 focus:outline-none"
              onClick={closeSidebar}
              aria-label="Close menu"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1">
              {getNavLinks().map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 ${
                      isActive(link.path) ? 'bg-green-50 text-green-600 border-l-4 border-green-600' : ''
                    }`}
                    onClick={closeSidebar}
                  >
                    <span className="mr-3">{link.icon}</span>
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            {isAuthenticated ? (
              <button 
                className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={handleLogout}
              >
                <span className="mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </span>
                Logout
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center w-full px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md"
                onClick={closeSidebar}
              >
                <span className="mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                </span>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

// Icons for sidebar navigation
const homeIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const shopIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const categoriesIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);
const aboutIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
    </svg>
  );
  
  const contactIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 2H8a2 2 0 00-2 2v16l6-3 6 3V4a2 2 0 00-2-2z" />
    </svg>
  );
  
  const profileIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A9.969 9.969 0 0112 15c2.21 0 4.243.715 5.879 1.804M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
  
  const ordersIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
    </svg>
  );
  
  const cartIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2 9m13-9l2 9M9 21h6" />
    </svg>
  );
  
  const dashboardIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h6v6H3V3zm0 12h6v6H3v-6zm12-12h6v6h-6V3zm0 12h6v6h-6v-6z" />
    </svg>
  );
  
  const adminIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2zM12 14c-2.21 0-4 1.79-4 4v1h8v-1c0-2.21-1.79-4-4-4z" />
    </svg>
  );
  