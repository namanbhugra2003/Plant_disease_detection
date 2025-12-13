import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaEdit,
  FaTrash,
  FaEye,
  FaPlus,
  FaTimes,
  FaCalendar,
  FaMapMarkerAlt,
  FaLeaf,
  FaVirus,
  FaSort
} from "react-icons/fa";
import { MdSearch } from "react-icons/md";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import CreateForm from "../Pages/CreateForm";
import UpdateSubmittedForm from "./UpdateSubmittedForm";
import DeleteSubmittedForm from "./DeleteSubmittedForm";

const placeholderImages = [
  "https://thumbs.dreamstime.com/b/plant-disease-mango-laves-disease-fungi-plant-disease-100851421.jpg?w=360",
  "https://thumbs.dreamstime.com/b/plant-disease-powdery-mildew-melon-leaves-fungal-108034120.jpg?w=360",
  "https://thumbs.dreamstime.com/b/plant-disease-symptom-citrus-fruit-canker-major-308756561.jpg?w=360",
  "https://thumbs.dreamstime.com/b/plant-disease-rice-leaves-blight-micro-organism-plant-disease-rice-105425383.jpg?w=360",
  "https://thumbs.dreamstime.com/b/rust-disease-symptom-cowpea-leaf-rust-disease-symptom-cowpea-leaf-plant-disease-fungi-308528446.jpg?w=360",
];

const MyInquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedInquiryForUpdate, setSelectedInquiryForUpdate] =
    useState(null);
  const [showDeleteForm, setShowDeleteForm] = useState(false);
  const [selectedInquiryForDelete, setSelectedInquiryForDelete] =
    useState(null);


   // Add new state variables for search and filter
   const [searchTerm, setSearchTerm] = useState('');
   const [sortField, setSortField] = useState('requestDate');
   const [sortOrder, setSortOrder] = useState('desc');
   const [filterStatus, setFilterStatus] = useState('');
  
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      if (!userData || !userData.token) {
        throw new Error("No user data found");
      }

      const response = await axios.get("http://localhost:5557/farmer", {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      });

      if (response.data && Array.isArray(response.data.data)) {
        setInquiries(response.data.data);
      } else {
        throw new Error("Received invalid data format");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching inquiries:", error);
      setError(error.message || "Failed to load inquiries");
      enqueueSnackbar("Failed to load inquiries", { variant: "error" });
      setLoading(false);
    }
  };

  const handleCreateInquiry = () => {
    setShowCreateForm(true);
  };

  const handleDelete = (inquiry) => {
    setSelectedInquiryForDelete(inquiry);
    setShowDeleteForm(true);
  };

  // Add sort handler
  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // Filter and sort inquiries
  const filteredAndSortedInquiries = inquiries
    .filter((inquiry) => {
      const matchesSearch = 
        inquiry.plantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.diseaseName.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        filterStatus === '' || inquiry.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      if (sortField === 'requestDate') {
        const dateA = new Date(a[sortField]);
        const dateB = new Date(b[sortField]);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      } else {
        if (a[sortField] < b[sortField]) return sortOrder === 'asc' ? -1 : 1;
        if (a[sortField] > b[sortField]) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      }
    });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-green border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-red-100">
        <p className="text-red-600 text-xl font-semibold">{error}</p>
      </div>
    );
  }

  return (
       <div className="min-h-screen bg-cover bg-center bg-fixed" 
    style={{ 
      backgroundImage: "url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
      backgroundColor: "rgba(243, 244, 246, 1.2)",
      backgroundBlendMode: "overlay"
    }}>
       <div className="container mx-auto px-4 py-12 ">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 ">Your Inquiries</h1>
        <button
          onClick={handleCreateInquiry}
          className="bg-green-600 hover:bg-green-800 text-white text-lg font-bold py-2 px-4 mr-3 mt-4 flex items-center transition duration-300"
        >
          <FaPlus className="mr-2" /> Create Inquiry
        </button>
      </div>
      </motion.div>

      {/* Add search and filter section */}
      <div className="bg-white rounded-lg p-4 mb-8 shadow-md">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[200px] relative">
              <input
                type="text"
                placeholder="Search by plant or disease name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-2 pl-10 border-2 border-green-400 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
              />
              <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 text-sm"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
            
            <button
              onClick={() => handleSort('plantName')}
              className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center text-sm"
            >
              <FaSort className="mr-1" />
              Plant Name
            </button>
            
            <button
              onClick={() => handleSort('requestDate')}
              className="p-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors flex items-center text-sm"
            >
              <FaSort className="mr-1" />
              Date
            </button>
          </div>
        </div>


      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAndSortedInquiries.map((inquiry, index) => (
          <motion.div
            key={inquiry._id}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden flex flex-col"
          >
            <div className="h-48 bg-green-100 relative">
              <img
                src={inquiry.image? inquiry.image : placeholderImages[index % placeholderImages.length]}
                alt={`Plant disease: ${inquiry.diseaseName}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
                <h2 className="text-2xl font-bold text-white mb-1">
                  {inquiry.plantName}
                </h2>
              </div>
              <span
                className={`absolute top-3 right-3 px-2 py-1 text-sm font-semibold rounded-full ${
                  inquiry.status === "Pending"
                    ? "bg-yellow-200 text-yellow-800"
                    : inquiry.status === "In Progress"
                    ? "bg-blue-200 text-blue-800"
                    : "bg-green-200 text-green-800"
                }`}
              >
                {inquiry.status}
              </span>
            </div>
            <div className="p-4 flex-grow flex flex-col justify-between">
    <div>
      <p className="text-gray-700 mb-4 flex items-center">
        Disease: {inquiry.diseaseName}
      </p>
      <p className="text-gray-500 text-sm mb-4 flex items-center">
        <FaCalendar className="mr-2 text-gray-500" />
        {new Date(inquiry.requestDate).toLocaleDateString()}
      </p>
      <p className="text-gray-700 text-sm line-clamp-3">
        {inquiry.issueDescription}
      </p>
    </div>
    <div className="flex justify-between items-center mt-4 pt-2 border-t border-gray-200">
  <button
    onClick={() => setSelectedInquiry(inquiry)}
    className="flex items-center text-green-600 hover:text-green-800 transition duration-300"
    title="View Full Details"
  >
    <FaEye className="mr-2" />
    View Full Details
  </button>
  <div className="flex space-x-3">
    <button
      onClick={() => {
        setSelectedInquiryForUpdate(inquiry);
        setShowUpdateForm(true);
      }}
      className="text-yellow-700 hover:text-yellow-900 transition duration-300"
      title="Edit Inquiry"
    >
      <FaEdit className="text-lg" />
    </button>
    <button
      onClick={() => handleDelete(inquiry)}
      className="text-red-900 hover:text-red-950 transition duration-300"
      title="Delete Inquiry"
    >
      <FaTrash className="text-sm" />
    </button>
  </div>
</div>
</div>
          </motion.div>
        ))}
      </div>
      
       {/* Show message when no inquiries match the filters */}
       {filteredAndSortedInquiries.length === 0 && !loading && (
          <div className="text-center py-8 mt-4">
            <p className="text-xl text-gray-600">No inquiries found matching your criteria.</p>
          </div>
        )}
      

      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="p-8 max-w-2xl w-full">
            <CreateForm
              onClose={() => setShowCreateForm(false)}
              onSubmitSuccess={() => {
                setShowCreateForm(false);
                fetchInquiries();
              }}
            />
          </div>
        </div>
      )}

      {selectedInquiry && (
        <InquiryDetailsPopup
          inquiry={selectedInquiry}
          onClose={() => setSelectedInquiry(null)}
        />
      )}

      {showUpdateForm && selectedInquiryForUpdate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
            <UpdateSubmittedForm
              inquiryId={selectedInquiryForUpdate._id}
              onClose={() => {
                setShowUpdateForm(false);
                setSelectedInquiryForUpdate(null);
              }}
              onUpdateSuccess={() => {
                setShowUpdateForm(false);
                setSelectedInquiryForUpdate(null);
                fetchInquiries();
              }}
            />
          </div>
        </div>
      )}

      {showDeleteForm && selectedInquiryForDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
            <DeleteSubmittedForm
              inquiryId={selectedInquiryForDelete._id}
              onClose={() => {
                setShowDeleteForm(false);
                setSelectedInquiryForDelete(null);
              }}
              onDeleteSuccess={() => {
                setShowDeleteForm(false);
                setSelectedInquiryForDelete(null);
                fetchInquiries();
              }}
            />
          </div>
        </div>
      )}
      </div>
      </div>
  );
 
};

const InquiryDetailsPopup = ({ inquiry, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-80 backdrop-blur-sm flex justify-center items-center p-4 z-50"
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full"
      >
        <div className="flex">
          {/* Left side - Image */}
          <div className="w-2/5 bg-green-100">
            <img
              src={inquiry.image? inquiry.image : placeholderImages[index % placeholderImages.length]}
              alt={inquiry.plantName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right side - Details */}
          <div className="w-3/5 p-8 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes size={24} />
            </button>

            <h2 className="text-3xl font-bold text-green-600 mb-6">
              {inquiry.plantName}
            </h2>

            <div className="space-y-4">
              <DetailItem
                icon={FaVirus}
                label="Disease"
                value={inquiry.diseaseName}
              />
              <DetailItem
                icon={FaCalendar}
                label="Submitted on"
                value={new Date(inquiry.requestDate).toLocaleDateString()}
              />
              <DetailItem
                icon={FaMapMarkerAlt}
                label="Location"
                value={inquiry.location}
              />
              <DetailItem icon={FaLeaf} label="Status" value={inquiry.status} />
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Issue Description
              </h3>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
                {inquiry.issueDescription}
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-center">
    <Icon className="text-green-500 mr-2" size={20} />
    <span className="text-gray-700 font-medium">{label}:</span>
    <span className="ml-2 text-gray-600">{value}</span>
  </div>
);

export default MyInquiries;
