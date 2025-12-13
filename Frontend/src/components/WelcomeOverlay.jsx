import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLeaf, FaSeedling } from 'react-icons/fa';

const WelcomeOverlay = ({ show, userData, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  const formatName = (name) => name.split(' ').map(capitalize).join(' ');

  return (
    <AnimatePresence onExitComplete={onClose}>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center z-50"
          aria-label="Welcome overlay"
          role="dialog"
        >
          <motion.div 
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 1 }}
          >
            {[...Array(20)].map((_, i) => (
              <FaLeaf 
                key={i} 
                className="absolute text-green-200" 
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  fontSize: `${Math.random() * 30 + 10}px`,
                  transform: `rotate(${Math.random() * 360}deg)`,
                }}
              />
            ))}
          </motion.div>
          
          <div className="text-center z-10 bg-white bg-opacity-90 p-12 rounded-xl shadow-2xl">
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="flex items-center justify-center mb-8"
            >
              <FaSeedling className="text-green-7 text-5xl mr-4" />
              <h2 className="text-4xl font-semibold text-green-700 font-sans">
                Welcome to AgriGuard
              </h2>
            </motion.div>
            
            <motion.p 
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-4xl mb-6 font-sans"
            >
              <span className="font-bold text-green-700">{formatName(userData?.name || '')}</span>
            </motion.p>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.6, type: "spring", stiffness: 120 }}
              className="inline-block bg-green-100 px-6 py-3 rounded-full shadow-md"
            >
              <span className="text-2xl font-semibold text-green-800">
                {capitalize(userData?.role || '')}
              </span>
            </motion.div>
            
            <motion.div
              className="w-64 h-1 bg-green-600 mt-8 mx-auto overflow-hidden rounded-full"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
            />
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="mt-8 text-gray-600 italic"
            >
              "Cultivating a greener future, one plant at a time."
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeOverlay;