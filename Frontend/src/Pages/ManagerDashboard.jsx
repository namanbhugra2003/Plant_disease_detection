import React, { useEffect, useState } from "react";
import axios from "axios";
import BubbleMap from "../components/BubbleMap";
import ReportsTab from "../components/ReportsTab";
import LogingNavBar from '../components/MNavigationBar ';

import {
  FaBars,
  FaTimes,
  FaSignOutAlt,
  FaChartPie,
  FaClipboardList,
  FaBug,
  FaTrash,
  FaEye,
  FaEdit,
} from "react-icons/fa";
import { motion } from "framer-motion";

const sidebarVariants = {
  expanded: { width: "260px" },
  collapsed: { width: "80px" },
};

const ManagerDashboard = () => {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedForm, setSelectedForm] = useState(null);
  const [reply, setReply] = useState("");
  const [activeTab, setActiveTab] = useState("all-inquiries");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [isViewMode, setIsViewMode] = useState(false);

  const userData = JSON.parse(localStorage.getItem("user"));
  const token = userData?.token;

  useEffect(() => {
    fetchForms();
  }, [statusFilter, searchQuery, searchDate]);

  const fetchForms = async () => {
    try {
      const response = await axios.get("http://localhost:5557/manager/forms", {
        headers: { Authorization: `Bearer ${token}` },
        params: { status: statusFilter, search: searchQuery, date: searchDate },
      });
      setForms(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching forms:", error);
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.put(
        `http://localhost:5557/manager/form/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchForms();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const submitReply = async (id) => {
    if (!reply.trim()) return;
    try {
      await axios.post(
        `http://localhost:5557/manager/form/${id}/reply`,
        { reply },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReply("");
      setSelectedForm(null);
      fetchForms();
    } catch (error) {
      console.error("Error sending reply:", error);
    }
  };

  const deleteReply = async (id) => {
    try {
      await axios.delete(`http://localhost:5557/manager/form/${id}/reply`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchForms();
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };

  const menuItems = [
    { title: "All Inquiries", icon: <FaClipboardList />, path: "all-inquiries" },
    { title: "Analytics", icon: <FaChartPie />, path: "analytics" },
    { title: "Reports", icon: <FaBug />, path: "reports" },
  ];

  return (
    <>
    <LogingNavBar />
    <div className="flex h-screen bg-gray-100"
    style={{
      backgroundImage:
        "url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
      backgroundColor: "rgba(243, 244, 246, 0.85)",
      backgroundBlendMode: "overlay",
    }}>
      
      {/* Sidebar */}
      <motion.div
        className="h-screen bg-white shadow-xl relative"
        variants={sidebarVariants}
        initial="expanded"
        animate={isCollapsed ? "collapsed" : "expanded"}
      >
        <div className="flex justify-end p-4">
          <button onClick={() => setIsCollapsed(!isCollapsed)} className="text-green-600 hover:text-green-800">
            {isCollapsed ? <FaBars size={20} /> : <FaTimes size={20} />}
          </button>
        </div>
        <div className="flex flex-col items-center py-6 border-b border-gray-200">
          <div className="w-20 h-20 rounded-full bg-green-600 text-white flex items-center justify-center text-2xl font-bold mb-3">
            M
          </div>
          {!isCollapsed && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
              <h3 className="font-semibold text-lg text-gray-800">Manager</h3>
              <p className="text-green-600 text-sm">Plant Guardian 🌿</p>
            </motion.div>
          )}
        </div>
        <nav className="mt-8">
          <ul className="space-y-2 px-4">
            {menuItems.map((item, index) => (
              <motion.li key={index} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <button
                  onClick={() => setActiveTab(item.path)}
                  className={`flex items-center p-3 w-full rounded-lg transition-colors duration-200 ${
                    activeTab === item.path
                      ? "bg-green-600 text-white"
                      : "text-gray-700 hover:bg-green-50 hover:text-green-600"
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {!isCollapsed && <span>{item.title}</span>}
                </button>
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
              sessionStorage.clear();
              localStorage.clear();
              window.location.href = "/login";
            }}
          >
            <span className="mr-3"><FaSignOutAlt size={20} /></span>
            {!isCollapsed && <span>Logout</span>}
          </motion.button>
        </div>
      </motion.div>

      {/* Main Panel */}
      <div className="flex-1 overflow-y-auto p-6">
      

        {activeTab === "all-inquiries" && (
          <>
            {/* Filters */}
            <div className="bg-white border border-green-400 p-6 rounded-xl shadow-lg flex flex-wrap items-center justify-between gap-4 mb-6">
              <div className="w-full sm:w-auto">
                <label className="block text-sm mb-1">Filter by Status</label>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-300 focus:outline-none"
                >
                  <option value="">All</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
              <div className="w-full sm:w-1/3">
                <label className="block text-sm mb-1">Search Keyword</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by crop, disease, or issue..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-300 focus:outline-none"
                />
              </div>
              <div className="w-full sm:w-auto">
                <label className="block text-sm mb-1">Filter by Date</label>
                <input
                  type="date"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-300 focus:outline-none"
                />
              </div>
              <button
                onClick={() => {
                  setStatusFilter("");
                  setSearchQuery("");
                  setSearchDate("");
                }}
                className="px-6 py-2 bg-red-100 text-red-600 font-semibold rounded-lg hover:bg-red-200 transition"
              >
                Clear
              </button>
            </div>

            {/* Table */}
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
                <table className="w-full min-w-[950px] border-collapse">
                  <thead>
                    <tr className="bg-green-600 text-white">
                      <th className="p-4 text-left">Farmer</th>
                      <th className="p-4 text-left">Plant</th>
                      <th className="p-4 text-left">Disease</th>
                      <th className="p-4 text-left">Issue</th>
                      
                      <th className="p-4 text-left"></th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-left">Action</th>
                    </tr>
                  </thead>
                  <tbody>
  {forms.map((form) => (
    <tr key={form._id} className="border-b hover:bg-gray-50">
      <td className="p-4">{form.fullname}</td>
      <td className="p-4">{form.plantName}</td>
      <td className="p-4">{form.diseaseName}</td>
      <td className="p-4">
        {form.issueDescription.length > 10
          ? `${form.issueDescription.slice(0, 10)}...`
          : form.issueDescription}
      </td>
      
      <td className="p-4 flex gap-2">
        {form.reply && (
          <>
            <button
              onClick={() => {
                setIsViewMode(true);
                setReply(form.reply);
                setSelectedForm(form);
              }}
              className="bg-blue-100 hover:bg-blue-200 text-blue-500 p-2 rounded-full"
              title="View Reply"
            >
              <FaEye size={12} />
            </button>
            <button
              onClick={() => {
                setIsViewMode(false);
                setReply(form.reply);
                setSelectedForm(form);
              }}
              className="bg-green-100 hover:bg-green-200 text-green-500 p-2 rounded-full"
              title="Edit Reply"
            >
              <FaEdit size={12} />
            </button>
            <button
              onClick={() => deleteReply(form._id)}
              className="bg-red-100 hover:bg-red-200 text-red-500 p-2 rounded-full"
              title="Delete Reply"
            >
              <FaTrash size={12} />
            </button>
          </>
        )}
      </td>
      <td className="p-4">
        <select
          value={form.status}
          onChange={(e) => updateStatus(form._id, e.target.value)}
          className={`px-3 py-2 rounded-lg shadow focus:outline-none transition duration-300 ${
            form.status === "Resolved"
              ? "bg-green-200 text-green-800 hover:bg-green-300"
              : form.status === "In Progress"
              ? "bg-yellow-200 text-yellow-800 hover:bg-yellow-300"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`}
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </td>
      <td className="p-4">
        <button
          onClick={() => {
            setIsViewMode(false);
            setReply("");
            setSelectedForm(form);
          }}
          className="px-4 py-2 bg-blue-100 text-blue-700 font-medium rounded-lg hover:bg-blue-200 transition"
        >
          Reply
        </button>
      </td>
    </tr>
  ))}
</tbody>

                </table>
              </div>
            )}

            {/* Reply Modal */}
            {selectedForm && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
                  <h2 className="text-lg font-bold mb-4">Reply to {selectedForm.fullname}</h2>
                  <div className="mb-4 p-3 bg-gray-100 rounded border border-gray-300 text-sm text-gray-700">
                    <strong>Issue Description:</strong>
                    <p className="mt-1">{selectedForm.issueDescription}</p>
                  </div>
                  <textarea
                    className="w-full p-2 border rounded"
                    placeholder="Type your reply..."
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    readOnly={isViewMode}
                  ></textarea>
                  <div className="flex justify-end mt-4">
                    {!isViewMode && (
                      <button
                        onClick={() => submitReply(selectedForm._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Submit Reply
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedForm(null);
                        setIsViewMode(false);
                      }}
                      className="ml-2 px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {activeTab === "analytics" && <BubbleMap />}
        {activeTab === "reports" && <ReportsTab />}
      </div>
    </div>
    </>
  );
};

export default ManagerDashboard;
