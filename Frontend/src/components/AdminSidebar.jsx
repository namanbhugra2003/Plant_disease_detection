import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaHome, 
  FaUsers, 
  FaNewspaper, 
  FaChartBar, 
  FaCog, 
  FaSignOutAlt,
  FaBars,
  FaTimes
} from 'react-icons/fa';

const AdminSidebar = ({ user }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  
  const sidebarVariants = {
    expanded: { width: '250px' },
    collapsed: { width: '80px' }
  };

  const menuItems = [
    { path: '/admin', icon: <FaHome size={20} />, title: 'Dashboard' },
    { path: '/admin/users', icon: <FaUsers size={20} />, title: 'Users' },
    { path: '/admin/articles/create', icon: <FaNewspaper size={20} />, title: 'Create Article' },
    { path: '/admin/articles', icon: <FaChartBar size={20} />, title: 'Manage Articles' },
     { path: '/admin/viewarticle', icon: <FaNewspaper size={20} />, title: 'Articles' },
    { path: '/admin/settings', icon: <FaCog size={20} />, title: 'Settings' },
  ];

  const handleLogout = () => {
    sessionStorage.clear(); 
    localStorage.removeItem('token'); 
    localStorage.removeItem('user');
    localStorage.removeItem('authToken'); 
    window.location.href = '/login';
  };

  return (
    <motion.div 
      className="h-screen bg-white shadow-xl relative mt-20"
      variants={sidebarVariants}
      initial="expanded"
      animate={isCollapsed ? 'collapsed' : 'expanded'}
      transition={{ type: 'spring', stiffness: 100, damping: 20 }}
    >
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)} 
        className="absolute top-4 right-4 text-green-600 hover:text-green-800 z-10"
      >
        {isCollapsed ? <FaBars size={20} /> : <FaTimes size={20} />}
      </button>
      
      <div className="flex flex-col items-center py-8 border-b border-gray-200">
        <motion.div 
                  className={`rounded-full bg-green-100 overflow-hidden mb-3`}
                  animate={{ 
                    width: isCollapsed ? '48px' : '80px', 
                    height: isCollapsed ? '48px' : '80px' 
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
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center"
          > 
            <h3 className="font-semibold text-lg text-gray-800">
              {user?.fullName ? user.fullName.split(' ')[0] : user?.username || 'Admin'}
            </h3>            
            <p className="text-green-600 text-sm">Welcome back!</p>
          </motion.div>
        )}
      </div>
      
      <nav className="mt-8">
        <ul className="space-y-2 px-4">
          {menuItems.map((item, index) => (
            <motion.li 
              key={index}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <Link
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${
                  location.pathname === item.path 
                    ? 'bg-green-600 text-white' 
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
      
      <motion.button
        className="absolute bottom-8 w-full px-4 flex items-center p-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors duration-200"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleLogout}
      >
        <span className="mr-3"><FaSignOutAlt size={20} /></span>
        {!isCollapsed && <span>Logout</span>}
      </motion.button>
    </motion.div>
  );
};

export default AdminSidebar;