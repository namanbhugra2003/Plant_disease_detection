import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { useSnackbar } from 'notistack';
import {
  FaUser,
  FaEnvelope,
  FaCalendar,
  FaMapMarkerAlt,
  FaPhone,
  FaLeaf,
  FaPencilAlt,
  FaCamera,
  FaChartLine,
  FaMedal,
  FaSeedling,
  FaThumbsUp,
  FaComments
} from "react-icons/fa";
import UserdashboardContent from "../components/UserDashboardContent";

const UserProfile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData || !userData.token) {
      enqueueSnackbar("No valid user session found.", { variant: "error" });
      setLoading(false);
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5557/api/test/profile', {
          headers: { Authorization: `Bearer ${userData.token}` }
        });
        setUserProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch user profile');
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [enqueueSnackbar]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (!userProfile) return <ErrorMessage message="No user data found" />;

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" 
    style={{ 
      backgroundImage: "url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
      backgroundColor: "rgba(243, 244, 246, 1.2)",
      backgroundBlendMode: "overlay"
    }}>
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-2">
        </div>
        <motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  className="bg-white shadow-2xl rounded-3xl overflow-hidden"
>
  <div className="p-8">
    {/* Weather Information */}
    <div className="mb-8">
      <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-3xl p-6 shadow-lg max-w-6xl mx-auto">
        <h4 className="text-2xl font-semibold text-gray-700 mb-8 text-center">Current Weather</h4>
        <UserdashboardContent />
      </div>
    </div>

    {/* User Info and Recent Activity */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Recent Activity */}
      
      <div className="bg-gradient-to-r from-green-100 to-green-50 rounded-3xl p-6 shadow-lg">
  <div className="bg-green-200 rounded-t-2xl -mx-6 -mt-6 mb-6 p-4">
    <h4 className="text-xl font-semibold text-green-800 text-center">Recent Activity</h4>
  </div>
  <ActivityList activities={[
    { type: 'inquiry', text: 'Posted a new inquiry about tomato plants', date: '2 days ago' },
    { type: 'achievement', text: 'Earned "Green Thumb" badge', date: '1 week ago' },
    { type: 'comment', text: 'Commented on "How to care for orchids"', date: '2 weeks ago' },
  ]} />
</div>

      {/* User Info */}
      <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-3xl p-6 text-white shadow-lg">
        <div className="flex flex-col items-center">
          <div className="relative mb-4">
            <div className="h-32 w-32 rounded-full bg-white border-4 border-white shadow-lg overflow-hidden">
              {userProfile.profilePic ? (
                <img
                  src={userProfile.profilePic}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-300 text-gray-500">
                  <FaUser size={48} />
                </div>
              )}
            </div>
            <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg">
              <FaCamera className="text-green-500" />
            </button>
          </div>
          <h2 className="text-2xl font-semibold text-center">{userProfile.name}</h2>
          <p className="text-white text-lg font-bold mb-4 text-center">Plant Enthusiast</p>
          <div className="grid grid-cols-1 gap-4 w-full">
            <ProfileItem icon={FaEnvelope} value={userProfile.email} />
            <ProfileItem icon={FaPhone} value={userProfile.phoneNumber} />
            <ProfileItem icon={FaMapMarkerAlt} value={userProfile.location} />
            <ProfileItem icon={FaCalendar} value={new Date(userProfile.joinDate).toLocaleDateString()} />
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="mt-6 bg-white text-green-500 hover:bg-green-50 px-6 py-2 rounded-full transition duration-300 flex items-center justify-center"
          >
            <FaPencilAlt className="mr-2" />
            {isEditing ? "Save Changes" : "Edit Profile"}
          </button>
        </div>
      </div>
    </div>
  </div>
</motion.div>
      </div>
    </div>
    </div>
  );
};
const ProfileItem = ({ icon: Icon, value }) => (
  <div className="flex items-center space-x-3">
    <Icon className="text-green-200" />
    <span>{value}</span>
  </div>
);

const StatCard = ({ icon: Icon, value, label }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white p-4 rounded-xl shadow-md flex items-center space-x-4"
  >
    <div className="bg-green-100 p-3 rounded-full">
      <Icon className="text-green-500 text-xl" />
    </div>
    <div>
      <div className="text-2xl font-bold text-gray-800">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  </motion.div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full"
    />
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="flex justify-center items-center h-screen bg-red-100">
    <p className="text-red-600 text-xl font-semibold">{message}</p>
  </div>
);

const ActivityList = ({ activities }) => (
  <ul className="space-y-6 mt-8">
    {activities.map((activity, index) => (
      <li key={index} className="flex items-start space-x-3">
        <ActivityIcon type={activity.type} />
        <div>
          <p className="text-gray-700">{activity.text}</p>
          <p className="text-xs text-gray-500">{activity.date}</p>
        </div>
      </li>
    ))}
  </ul>
);

const ActivityIcon = ({ type }) => {
  const iconClass = "text-green-500";
  switch (type) {
    case 'inquiry':
      return <FaLeaf className={iconClass} />;
    case 'achievement':
      return <FaMedal className={iconClass} />;
    case 'comment':
      return <FaComments className={iconClass} />;
    default:
      return <FaUser className={iconClass} />;
  }
};

export default UserProfile;