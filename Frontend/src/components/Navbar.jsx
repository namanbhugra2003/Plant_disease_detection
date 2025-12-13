import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCaretDown } from 'react-icons/fa';

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    let lastScrollY = window.pageYOffset;
    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      setIsVisible(currentScrollY <= 50 || currentScrollY < lastScrollY);
      setIsScrolled(currentScrollY > 50);
      lastScrollY = currentScrollY;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = location.pathname === '/';

  const navbarVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      }
    }
  };

  const linkVariants = {
    hover: { scale: 1.1, transition: { duration: 0.2 } }
  };

  if (!isHomePage) {
    return null;
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          key="navbar"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={navbarVariants}
          className={`fixed w-full z-30 transition-opacity duration-100 ${
            isScrolled 
              ? 'bg-black bg-opacity-20 backdrop-filter backdrop-blur-lg' 
              : 'bg-transparent'
          } text-white`}
        >
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">
              AgriGuard
            </Link>

            <div className="flex items-center space-x-8">
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center hover:text-green-500 font-semibold transition-colors duration-200"

                >
                  <span>Services</span>
                  <FaCaretDown />
                </button>
                {isDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
                  >
                    <Link to="/service1" className="block px-4 py-2 text-gray-800 hover:bg-green-100">Service 1</Link>
                    <Link to="/service2" className="block px-4 py-2 text-gray-800 hover:bg-green-100">Service 2</Link>
                    <Link to="/service3" className="block px-4 py-2 text-gray-800 hover:bg-green-100">Service 3</Link>
                  </motion.div>
                )}
              </div>
              
              <Link to="/login" className="hover:text-green-500 font-semibold">Sign In</Link>
              <Link to="/register" className="hover:text-green-500 font-semibold">Register</Link>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default Navbar;