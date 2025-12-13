import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon, color, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.03, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }}
      whileTap={{ scale: 0.97 }}
      className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-3xl font-bold mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${color}`}>
          {icon}
        </div>
      </div>
    </motion.div>
  );
};

export default StatsCard;