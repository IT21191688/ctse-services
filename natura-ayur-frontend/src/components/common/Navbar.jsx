import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/actions/authActions';
import { fetchCartSummary } from '../../redux/actions/cartActions';
import { toggleSidebar, toggleSearch, openModal } from '../../redux/slices/uiSlice';
import { 
  selectIsAuthenticated, 
  selectUser, 
  selectUserRole 
} from '../../redux/selectors/authSelectors';
import { selectCartItemCount } from '../../redux/selectors/cartSelectors';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const user = useSelector(selectUser);
  const userRole = useSelector(selectUserRole);
  const cartItemCount = useSelector(selectCartItemCount);
  
  const [isScrolled, setIsScrolled] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Fetch cart summary when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCartSummary());
    }
  }, [dispatch, isAuthenticated]);
  
  // Handle logout
  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/');
    setShowUserMenu(false);
  };
  
  // Handle search toggle
  const handleSearchToggle = () => {
    dispatch(toggleSearch());
  };
  
  // Handle sidebar toggle
  const handleSidebarToggle = () => {
    dispatch(toggleSidebar());
  };
  
  // Open login modal
  const handleOpenLogin = () => {
    dispatch(openModal({ modalType: 'login' }));
  };
  
  // Is the current path the one provided?
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };
  
  // Navigation links based on user role
  const getNavLinks = () => {
    const links = [
      { title: 'Home', path: '/', show: true },
      { title: 'Shop', path: '/products', show: true },
      { title: 'About', path: '/about', show: true },
      { title: 'Contact', path: '/contact', show: true },
      { title: 'Orders', path: '/orders', show: isAuthenticated },
      { title: 'Dashboard', path: '/seller/dashboard', show: userRole === 'seller' },
      { title: 'Admin', path: '/admin/dashboard', show: userRole === 'admin' }
    ];
    
    return links.filter(link => link.show);
  };
  
  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
    }`}>
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between">
          {/* Mobile Menu Button */}
          <button 
            className="lg:hidden p-2 rounded-md text-gray-700 focus:outline-none"
            onClick={handleSidebarToggle}
            aria-label="Open menu"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-green-700">
            NaturaAyur
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {getNavLinks().map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-medium text-base hover:text-green-600 transition-colors ${
                  isActive(link.path) ? 'text-green-600' : 'text-gray-700'
                }`}
              >
                {link.title}
              </Link>
            ))}
          </div>
          
          {/* Right Navigation */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <button
              className="p-2 rounded-full text-gray-700 hover:bg-gray-100 focus:outline-none"
              onClick={handleSearchToggle}
              aria-label="Search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
            
            {/* Cart */}
            <Link
              to="/cart"
              className="p-2 rounded-full text-gray-700 hover:bg-gray-100 focus:outline-none relative"
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Link>
            
            {/* User Account */}
            {isAuthenticated ? (
              <div className="relative">
                <button
                  className="flex items-center space-x-1 focus:outline-none"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  aria-expanded={showUserMenu}
                  aria-haspopup="true"
                >
                  <div className="h-8 w-8 rounded-full bg-gray-300 overflow-hidden">
                    {user?.avatar ? (
                      <img src={user.avatar} alt="User avatar" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-green-600 text-white">
                        {user?.firstName?.charAt(0)}
                      </div>
                    )}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {user?.firstName}
                  </span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                    <Link
                      to="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/orders"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowUserMenu(false)}
                    >
                      Orders
                    </Link>
                    {userRole === 'seller' && (
                      <Link
                        to="/seller/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Seller Dashboard
                      </Link>
                    )}
                    {userRole === 'admin' && (
                      <Link
                        to="/admin/dashboard"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setShowUserMenu(false)}
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition-colors"
                onClick={handleOpenLogin}
              >
                Login
              </button>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;