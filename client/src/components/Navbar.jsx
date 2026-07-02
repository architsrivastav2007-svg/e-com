import { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { FaBars, FaHeart, FaShoppingBag, FaTimes, FaUser, FaSearch } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext.jsx';
import { useCart } from '../context/CartContext.jsx';
import { useWishlist } from '../context/WishlistContext.jsx';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { user, isAuthenticated, logout } = useAuth();
  const { totalItems } = useCart();
  const { itemCount } = useWishlist();
  
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const handleToggle = () => setMenuOpen((current) => !current);
  const handleClose = () => setMenuOpen(false);
  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    handleClose();
    navigate('/login');
  };

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?keyword=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `text-sm font-medium tracking-wide transition-colors duration-300 ${
      isActive 
        ? 'text-[#d4b26f] font-semibold' 
        : 'text-neutral-400 hover:text-white'
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-4 py-2.5 rounded-xl text-base font-medium transition-colors duration-300 ${
      isActive 
        ? 'bg-[#121212] text-[#d4b26f] font-semibold' 
        : 'text-neutral-300 hover:bg-neutral-900 hover:text-white'
    }`;

  const categories = ['Clothing', 'Shoes', 'Bags', 'Accessories'];

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-900/60 bg-[#0a0a0a]/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        
        {/* Logo */}
        <NavLink to="/home" className="flex items-center gap-2" onClick={handleClose}>
          <span className="text-xl font-bold tracking-tight text-white font-luxury-sans">
            Shop<span className="text-[#d4b26f] font-luxury-serif italic font-medium ml-0.5">Sphere</span>
          </span>
        </NavLink>

        {/* Center Categories */}
        <nav className="hidden items-center gap-8 md:flex">
          {categories.map((category) => (
            <NavLink
              key={category}
              to={`/products?category=${category}`}
              className={({ isActive }) => 
                `text-sm font-medium tracking-wide transition-colors duration-300 ${
                  location.search.includes(`category=${category}`)
                    ? 'text-[#d4b26f] font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`
              }
            >
              {category}
            </NavLink>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden items-center gap-5 md:flex">
          
          {/* Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-44 rounded-full bg-neutral-900 border border-neutral-800 py-1.5 pl-9 pr-4 text-xs text-white placeholder-neutral-500 focus:w-60 focus:border-[#d4b26f]/60 focus:outline-none transition-all duration-300"
            />
            <FaSearch className="absolute left-3 top-2.5 text-neutral-500 text-xs" />
          </form>

          {/* Wishlist Icon */}
          <NavLink to="/wishlist" className="relative text-neutral-400 hover:text-white transition-colors duration-300" aria-label="Wishlist">
            <FaHeart className="text-lg" />
            {itemCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#d4b26f] text-[9px] font-bold text-black ring-1 ring-black">
                {itemCount}
              </span>
            )}
          </NavLink>

          {/* Cart Icon */}
          <NavLink to="/cart" className="relative text-neutral-400 hover:text-white transition-colors duration-300" aria-label="Cart">
            <FaShoppingBag className="text-lg" />
            {totalItems > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[#d4b26f] text-[9px] font-bold text-black ring-1 ring-black">
                {totalItems}
              </span>
            )}
          </NavLink>

          {/* Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            {isAuthenticated ? (
              <>
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors duration-300 focus:outline-none"
                  aria-label="User menu"
                >
                  <FaUser className="text-lg" />
                </button>
                
                {dropdownOpen && (
                  <div className="absolute right-0 mt-3.5 w-48 rounded-2xl border border-neutral-800 bg-[#0f0f0f] p-2 shadow-2xl ring-1 ring-black/80">
                    <div className="px-3 py-2 text-xs font-semibold text-neutral-400 border-b border-neutral-900 pb-2 mb-1">
                      Hi, {user?.name || 'User'}
                    </div>
                    <NavLink
                      to="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="block rounded-xl px-3 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-900 hover:text-[#d4b26f] transition-all"
                    >
                      My Profile
                    </NavLink>
                    <NavLink
                      to="/my-orders"
                      onClick={() => setDropdownOpen(false)}
                      className="block rounded-xl px-3 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-900 hover:text-[#d4b26f] transition-all"
                    >
                      My Orders
                    </NavLink>
                    {user?.role === 'admin' && (
                      <NavLink
                        to="/admin/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="block rounded-xl px-3 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-900 hover:text-[#d4b26f] transition-all"
                      >
                        Admin Dashboard
                      </NavLink>
                    )}
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left rounded-xl px-3 py-2 text-xs font-medium text-rose-400 hover:bg-neutral-900 hover:text-rose-300 transition-all"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <NavLink to="/login" className="text-neutral-400 hover:text-white transition-colors duration-300" aria-label="Login">
                <FaUser className="text-lg" />
              </NavLink>
            )}
          </div>

        </div>

        {/* Mobile menu toggle */}
        <button
          type="button"
          onClick={handleToggle}
          className="inline-flex items-center justify-center rounded-xl border border-neutral-800 p-2 text-neutral-400 transition hover:bg-neutral-900 hover:text-white md:hidden"
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <FaTimes className="text-lg" /> : <FaBars className="text-lg" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="border-t border-neutral-900/60 bg-[#0a0a0a] px-4 py-4 md:hidden space-y-4">
          
          {/* Mobile Search */}
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-full bg-neutral-900 border border-neutral-800 py-2 pl-10 pr-4 text-sm text-white placeholder-neutral-500 focus:border-[#d4b26f]/60 focus:outline-none"
            />
            <FaSearch className="absolute left-3.5 top-3.5 text-neutral-500 text-sm" />
          </form>

          <div className="space-y-1">
            {categories.map((category) => (
              <NavLink
                key={category}
                to={`/products?category=${category}`}
                className={mobileNavLinkClass}
                onClick={handleClose}
              >
                {category}
              </NavLink>
            ))}
          </div>

          <div className="border-t border-neutral-900/60 pt-4 space-y-2">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-1.5 text-xs font-semibold text-neutral-500">
                  Logged in as: {user?.name}
                </div>
                <NavLink to="/profile" className={mobileNavLinkClass} onClick={handleClose}>
                  My Profile
                </NavLink>
                <NavLink to="/cart" className={mobileNavLinkClass} onClick={handleClose}>
                  Cart ({totalItems})
                </NavLink>
                <NavLink to="/wishlist" className={mobileNavLinkClass} onClick={handleClose}>
                  Wishlist ({itemCount})
                </NavLink>
                <NavLink to="/my-orders" className={mobileNavLinkClass} onClick={handleClose}>
                  My Orders
                </NavLink>
                {user?.role === 'admin' && (
                  <NavLink to="/admin/dashboard" className={mobileNavLinkClass} onClick={handleClose}>
                    Admin Dashboard
                  </NavLink>
                )}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2.5 rounded-xl text-base font-medium text-rose-400 hover:bg-neutral-900 transition-colors duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={mobileNavLinkClass} onClick={handleClose}>
                  Login
                </NavLink>
                <NavLink to="/register" className={mobileNavLinkClass} onClick={handleClose}>
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
