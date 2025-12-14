import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCaretDown } from 'react-icons/fa';

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);

  /* ---------- Hide / show navbar on scroll ---------- */
  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      setIsVisible(currentScrollY <= 50 || currentScrollY < lastScrollY);
      setIsScrolled(currentScrollY > 50);
      lastScrollY = currentScrollY;
      setIsDropdownOpen(false);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* ---------- Close dropdown on route change ---------- */
  useEffect(() => {
    setIsDropdownOpen(false);
  }, [location.pathname]);

  /* ---------- Close dropdown when clicking outside ---------- */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isHomePage = location.pathname === '/';
  if (!isHomePage) return null;

  const navbarVariants = {
    hidden: { opacity: 0, y: -40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 120, damping: 16 }
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.nav
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={navbarVariants}
          className={`fixed top-0 w-full z-30 transition-all duration-200 ${
            isScrolled
              ? 'bg-black bg-opacity-30 backdrop-blur-lg'
              : 'bg-transparent'
          } text-white`}
        >
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="text-2xl font-bold tracking-wide">
              AgriGuard
            </Link>

            
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Auth links */}
              <Link
                to="/login"
                className="font-semibold hover:text-green-400 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="font-semibold hover:text-green-400 transition"
              >
                Register
              </Link>
            </div>
          </div>
        </motion.nav>
      )}
    </AnimatePresence>
  );
};

export default Navbar;
