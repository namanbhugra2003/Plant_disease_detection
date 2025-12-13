import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaChartBar,
  FaPlusCircle,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaHome,
  FaShoppingCart
} from 'react-icons/fa';

const SupplierSidebar = ({ user }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isCollapsed, setIsCollapsed] = useState(
    localStorage.getItem('sidebarCollapsed') === 'true'
  );

  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', isCollapsed);
  }, [isCollapsed]);

  const toggleSidebar = () => {
    setIsCollapsed((prev) => !prev);
  };

  const sidebarVariants = {
    expanded: { width: '250px', transition: { type: 'spring', stiffness: 100, damping: 20 } },
    collapsed: { width: '75px', transition: { type: 'spring', stiffness: 100, damping: 20 } },
  };

  const menuItems = [
    { path: '/materials', icon: <FaHome size={20} />, title: 'Materials' },
    { path: '/materials/create', icon: <FaPlusCircle size={20} />, title: 'Add a new material' },
    { path: '/materials/analytics', icon: <FaChartBar size={20} />, title: 'Analytics' },
    // { path: '/orders', icon: <FaShoppingCart size={20} />, title: 'Orders' }
    
];


  return (
    <motion.div 
      className="h-screen bg-white shadow-xl relative"
      variants={sidebarVariants}
      initial="expanded"
      animate={isCollapsed ? 'collapsed' : 'expanded'}
    >
      <div className="flex justify-center p-4 mt-16">
        <button onClick={toggleSidebar} className="text-green-600 hover:text-green-800">
          {isCollapsed ? <FaBars size={20} /> : <FaTimes size={20} />}
        </button>
      </div>
      
      <div className="flex flex-col items-center py-6 border-b border-gray-200">
        <motion.div 
          className="rounded-full bg-green-100 overflow-hidden mb-3"
          animate={{ 
            width: isCollapsed ? '40px' : '80px', 
            height: isCollapsed ? '40px' : '80px' 
          }}
          transition={{ duration: 0.3 }}
        >
          {user?.profilePic ? (
            <img src={user.profilePic} alt="User" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-green-600 text-white font-bold"
                 style={{ fontSize: isCollapsed ? '16px' : '24px' }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
          )}
        </motion.div>
        
        {!isCollapsed && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-center">
            <h3 className="font-semibold text-lg text-gray-800">
              {user?.fullName ? user.fullName.split(' ')[0] : user?.username || 'Supplier'}
            </h3>            
            <p className="text-green-600 text-sm">Supplier Management</p>
          </motion.div>
        )}
      </div>
      
      <nav className="mt-8">
        <ul className="space-y-2 px-4">
          {menuItems.map((item, index) => (
            <motion.li key={index} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  location.pathname === item.path 
                    ? 'bg-green-600 opacity-45 text-white' 
                    : 'text-gray-700 hover:bg-green-50 hover:text-green-600'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {!isCollapsed && <span>{item.title}</span>}
              </Link>
            </motion.li>
          ))}
        </ul>
      </nav>
      
      <div className="absolute bottom-8 w-full px-4">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex items-center p-3 w-full rounded-lg text-red-500 hover:bg-red-50 transition-colors duration-200"
          onClick={() => {
            localStorage.removeItem('token');
            navigate('/login');
          }}
        >
          <span className="mr-3"><FaSignOutAlt size={20} /></span>
          {!isCollapsed && <span>Logout</span>}
        </motion.button>
      </div>
    </motion.div>
  );
};

export default SupplierSidebar;
