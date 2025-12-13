import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUsers, FaNewspaper, FaChartPie, FaEye, FaPlus, FaEdit } from 'react-icons/fa';
import AdminSidebar from '../components/AdminSidebar';
import StatsCard from '../components/StatsCard';
import UserStatsChart from '../components/UserStatsChart';
import ArticleCreation from '../components/ArticleCreation';
import ArticleManagement from '../components/ArticleManagement';
import ManagerTopNavBar from '../components/ManagerNavBar';
import axios from 'axios';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    users: 0,
    articles: 0,
    views: 0,
    engagement: 0
  });
  const [loading, setLoading] = useState(true);
  const [recentActivities, setRecentActivities] = useState([]);
  const [showArticleCreation, setShowArticleCreation] = useState(false);
  const [showArticleManagement, setShowArticleManagement] = useState(false);
  const [userCount, setUserCount] = useState(0);
  const [articleCount, setArticleCount] = useState(0);
  const [userRegistrationData, setUserRegistrationData] = useState({ labels: [], values: [] });
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    console.log("Raw user data:", localStorage.getItem('user'));
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log("Parsed user data:", userData);
  
    if (!userData || (userData.role !== 'admin')) {
      console.log("Redirecting to login. Reason:", !userData ? "No user data" : "Not admin role");
      navigate('/login');
      return;
    }
     
    setUser(userData);

    // Fetch dashboard stats from API
    const fetchStats = async () => {
      try {
        // API call here
        // For now, we'll keep using the mock data for these stats
        setStats({
          articles: 48,
          views: 21,
          engagement: 83.4
        });
        
        // Fetch real activities
        await fetchRecentActivities();
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [navigate]);

  // Fetch recent activities
  const fetchRecentActivities = async () => {
    try {
      const response = await axios.get('http://localhost:5557/api/activities/recent');
      setRecentActivities(response.data);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      // Fallback to mock data if API fails
      setRecentActivities([
        { id: 1, type: 'user', action: 'New user registered', name: 'John Doe', time: '2 hours ago' },
        { id: 2, type: 'article', action: 'Article published', name: 'Plant Disease Prevention Tips', time: '5 hours ago' },
        { id: 3, type: 'user', action: 'User updated profile', name: 'Sarah Johnson', time: '1 day ago' },
        { id: 4, type: 'article', action: 'Article edited', name: 'Organic Farming Methods', time: '2 days ago' },
        { id: 5, type: 'user', action: 'New user registered', name: 'Michael Brown', time: '3 days ago' }
      ]);
    }
  };

  //fetch user count
  const fetchUserCount = async () => {
    try {
      const response = await axios.get('http://localhost:5557/api/users/count');
      setUserCount(response.data.count);
    } catch (error) {
      console.error('Error fetching user count:', error);
    }
  };

  //Fetch Article Count
  const fetchArticleCount = async () => {
    try {
      const response = await axios.get('http://localhost:5557/api/articles/count');
      setArticleCount(response.data.count);
    } catch (error) {
      console.error('Error fetching article count:', error);
    }
  };

  useEffect(() => {
    fetchUserCount();
    fetchArticleCount();
    fetchUserRegistrationData();
  }, []);

  //fetch user registration data for chart
  const fetchUserRegistrationData = async () => {
    try {
      const response = await axios.get('http://localhost:5557/api/users/registration-stats');
      console.log('User registration data:', response.data);
      
      if (response.data && Array.isArray(response.data.labels) && Array.isArray(response.data.values)) {
        setUserRegistrationData({
          labels: response.data.labels,
          values: response.data.values
        });
      } else {
        console.error('Unexpected data structure:', response.data);
        setUserRegistrationData({ labels: [], values: [] });
      }
    } catch (error) {
      console.error('Error fetching user registration data:', error);
      setUserRegistrationData({ labels: [], values: [] });
    }
  };
  
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <AdminSidebar user={user} />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
      <ManagerTopNavBar/>
        <div className="p-8 mt-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
            <p className="text-gray-600 mb-8">Welcome, {user?.username || 'Admin'}!</p>
          </motion.div>
          
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard 
              title="Total Users" 
              value={userCount} 
              icon={<FaUsers size={24} className="text-white" />} 
              color="bg-green-600"
              onClick={() => navigate('/admin/users')}
            />
            <StatsCard 
              title="Articles Published" 
              value={articleCount} 
              icon={<FaNewspaper size={24} className="text-white" />} 
              color="bg-blue-600"
              onClick={() => navigate('/admin/articles')}
            />
            <StatsCard 
              title="Total Views" 
              value={stats.views.toLocaleString()} 
              icon={<FaEye size={24} className="text-white" />} 
              color="bg-purple-600"
              onClick={() => navigate('/admin/analytics')}
            />
            <StatsCard 
              title="Engagement Rate" 
              value={`${stats.engagement}%`} 
              icon={<FaChartPie size={24} className="text-white" />} 
              color="bg-yellow-500"
              onClick={() => navigate('/admin/analytics')}
            />
          </div>
          
          {/* Charts and Additional Content */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">User Growth</h3>
                <button className="text-sm text-green-600 hover:text-green-800">View All</button>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-lg" style={{ height: '500px' }}>
               <UserStatsChart data={userRegistrationData} />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold text-gray-800">Recent Activities</h3>
                <button className="text-sm text-green-600 hover:text-green-800" onClick={fetchRecentActivities}>Refresh</button>
              </div>
              <div className="space-y-4">
                {recentActivities.map((activity) => (
                  <motion.div 
                    key={activity.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center p-3 border-b border-gray-100 hover:bg-gray-50 rounded-lg"
                  >
                    <div className={`p-2 rounded-full mr-4 ${activity.type === 'user' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                      {activity.type === 'user' ? <FaUsers size={16} /> : <FaNewspaper size={16} />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800">{activity.action}</p>
                      <p className="text-xs text-gray-500">{activity.name}</p>
                    </div>
                    <span className="text-xs text-gray-400">{activity.time}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white p-6 rounded-xl shadow-lg"
              onClick={() => setShowArticleCreation(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center cursor-pointer">
                <div className="p-4 bg-green-100 rounded-lg mr-4">
                  <FaPlus className="text-green-600" size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">Create New Article</h3>
                  <p className="text-sm text-gray-500">Add new content to your platform</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white p-6 rounded-xl shadow-lg"
              onClick={() => setShowArticleManagement(true)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center cursor-pointer">
                  <div className="p-4 bg-blue-100 rounded-lg mr-4">
                    <FaEdit className="text-blue-600" size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Manage Articles</h3>
                    <p className="text-sm text-gray-500">Edit or delete existing articles</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
          
          {/* Footer */}
          <footer className="p-6 text-center text-gray-500 text-sm">
            <p>© 2023 AgriGuard Admin Dashboard. All rights reserved.</p>
          </footer>
        </div>
  
        {/* Article Creation Modal */}
        <ArticleCreation
          isOpen={showArticleCreation}
          onClose={() => setShowArticleCreation(false)}
        />
  
        {/* Article Management Modal */}
        <ArticleManagement
          isOpen={showArticleManagement}
          onClose={() => setShowArticleManagement(false)}
        />
      </div>
    );
  };
  
  export default AdminDashboard;