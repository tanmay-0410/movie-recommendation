import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Search, LogOut, X, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  if (!user) return null;

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/search', label: 'Explore' },
    { to: '/watchlist', label: 'Watchlist' },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className={`fixed w-full z-50 transition-all duration-500 ease-cinematic px-4 md:px-12 py-3
          ${isScrolled
            ? 'bg-cine-black/90 backdrop-blur-xl border-b border-white/5 shadow-lg shadow-black/20'
            : 'bg-gradient-to-b from-cine-black/80 via-cine-black/40 to-transparent'
          }`}
      >
        <div className="flex items-center justify-between max-w-[1920px] mx-auto">
          {/* Left: Logo + Nav Links */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-1 group">
              <span className="text-2xl md:text-3xl font-black tracking-wider text-gradient
                             transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(229,9,20,0.5)]">
                CINE
              </span>
              <span className="text-2xl md:text-3xl font-black tracking-wider text-white
                             transition-all duration-300">
                SCOPE
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition-all duration-300 relative
                    ${location.pathname === link.to
                      ? 'text-white'
                      : 'text-cine-gray-200 hover:text-white'
                    }`}
                >
                  {link.label}
                  {location.pathname === link.to && (
                    <motion.div
                      layoutId="navIndicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cine-red rounded-full"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>
          </div>

          {/* Right: Search + User */}
          <div className="flex items-center gap-4">
            {/* Search */}
            <AnimatePresence>
              {searchOpen ? (
                <motion.form
                  onSubmit={handleSearch}
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 260, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="flex items-center overflow-hidden"
                >
                  <input
                    autoFocus
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search movies..."
                    className="w-full bg-cine-dark/80 border border-white/10 text-white text-sm
                             px-4 py-2 rounded-l-lg focus:outline-none focus:border-cine-red/50
                             placeholder:text-cine-gray-300 backdrop-blur-sm"
                  />
                  <button
                    type="button"
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    className="bg-cine-dark/80 border border-l-0 border-white/10 text-cine-gray-200
                             px-3 py-2 rounded-r-lg hover:text-white transition-colors"
                  >
                    <X size={16} />
                  </button>
                </motion.form>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSearchOpen(true)}
                  className="text-cine-gray-200 hover:text-white transition-colors duration-300"
                >
                  <Search size={20} />
                </motion.button>
              )}
            </AnimatePresence>

            {/* User info */}
            <Link to="/profile" className="hidden md:flex items-center gap-3 group hover:opacity-80 transition-opacity" title="View Profile">
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-cine-red to-cine-red-dark
                            flex items-center justify-center text-sm font-bold border border-transparent group-hover:border-white/50 transition-colors">
                {(user.full_name || user.email)?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="text-sm text-cine-gray-100 font-medium max-w-[120px] truncate group-hover:text-white transition-colors">
                {user.full_name || user.email}
              </span>
            </Link>

            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleLogout}
              className="hidden md:flex text-cine-gray-300 hover:text-cine-red transition-colors duration-300"
              title="Sign out"
            >
              <LogOut size={18} />
            </motion.button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-white"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="fixed top-14 left-0 right-0 z-40 glass-strong p-6 md:hidden"
          >
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-base font-medium transition-colors
                    ${location.pathname === link.to ? 'text-white' : 'text-cine-gray-200'}`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-white/10 pt-4 flex flex-col gap-4">
                <Link to="/profile" className="flex items-center gap-3 text-white" onClick={() => setMobileMenuOpen(false)}>
                  <div className="w-8 h-8 rounded-md bg-gradient-to-br from-cine-red to-cine-red-dark flex items-center justify-center text-sm font-bold">
                    {(user.full_name || user.email)?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-base font-medium">My Profile</span>
                </Link>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-cine-gray-200">{user.full_name || user.email}</span>
                  <button onClick={handleLogout} className="text-cine-red text-sm font-medium">
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
