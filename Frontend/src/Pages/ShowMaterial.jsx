import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  FaUser,
  FaBook,
  FaLeaf,
  FaDollarSign,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";
import { useSnackbar } from "notistack";
import Spinner from "../components/Spinner";
import { motion, AnimatePresence } from "framer-motion";

const ShowMaterial = ({ id, onClose }) => {
  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showUsageModal, setShowUsageModal] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const InfoItem = ({ icon, label, value }) => (
    <div className="flex items-center">
      {icon}
      <div className="ml-3">
        <p className="text-sm font-medium text-gray-500">{label}</p>
        <p className="text-lg font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5557/materials/${id}`)
      .then((response) => {
        setMaterial(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        enqueueSnackbar("Error fetching material details", { variant: "error" });
      });
  }, [id, enqueueSnackbar]);

  if (loading) return <Spinner />;
  if (!material) return <div>Material not found</div>;

  return (
    <div className="relative max-w-3xl mx-auto rounded-lg shadow-lg overflow-hidden">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
      >
        <FaTimes size={24} />
      </button>
      <div className="md:flex">
        <div className="md:w-1/2 relative overflow-hidden">
          <img
            className="h-64 w-full object-cover md:h-full"
            src={material.image}
            alt={material.materialName}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
          <div className="absolute bottom-0 left-0 p-4">
            <p className="text-white text-xs font-semibold uppercase tracking-wider mb-1">
              {material.category}
            </p>
            <h2 className="text-2xl font-bold text-white leading-tight">
              {material.materialName}
            </h2>
          </div>
        </div>
  
        <div className="md:w-1/2 p-6">
          <div className="h-full flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center mb-4">
                <FaDollarSign className="text-yellow-500 w-8 h-8 mr-2" />
                <p className="text-2xl font-bold text-black-600">
                  Rs.{material.pricePerUnit.toFixed(2)}
                </p>
              </div>
            </div>
  
            <div className="space-y-4">
              <InfoItem
                icon={<FaLeaf className="text-green-500 w-6 h-6" />}
                label="Disease Usage"
                value={material.diseaseUsage.join(", ")}
              />
  
              <InfoItem
                icon={<FaUser className="text-indigo-500 w-5 h-5" />}
                label="Supplier Name"
                value={material.supplierName}
              />
              <InfoItem
                icon={<FaInfoCircle className="text-blue-500 w-5 h-5" />}
                label="Contact Info"
                value={material.supplierContact}
              />
            </div>
  
            <div className="mt-4">
              <button
                onClick={() => setShowUsageModal(true)}
                className="w-full rounded-full bg-green-600 py-2 px-4 text-sm font-semibold text-white transition-all duration-300 shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-700 focus:ring-opacity-50 active:bg-green-700"
                type="button"
              >
                View Usage Instructions
              </button>
            </div>
          </div>
        </div>
      </div>
  
      {/* Usage Instructions Modal */}
      <AnimatePresence>
        {showUsageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                <FaBook className="mr-2 text-orange-500" />
                Usage Instructions
              </h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                {material.usageInstructions}
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowUsageModal(false)}
                  className="px-4 py-2 bg-green-600 text-white text-sm rounded-full hover:bg-green-700 transition-colors duration-200 transform hover:scale-105"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShowMaterial;