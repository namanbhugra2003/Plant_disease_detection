import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';
import Spinner from './Spinner';

const MaterialDetailsModal = ({ 
  selectedMaterial, 
  materialDetails, 
  loadingDetails, 
  closeMaterialDetails, 
  handleQuantityChange,
  cart 
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-xl overflow-hidden max-w-5xl w-full max-h-[90vh] flex flex-col md:flex-row"
      >
        {loadingDetails ? (
          <div className="flex justify-center items-center p-8 w-full">
            <Spinner />
          </div>
        ) : materialDetails ? (
          <>
            {/* Left side - Image */}
            <div className="md:w-1/2 bg-gray-100 relative">
              <button 
                onClick={closeMaterialDetails}
                className="absolute top-4 left-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
              >
                <FaTimes className="text-gray-600" />
              </button>
              <div className="h-full flex items-center justify-center p-8">
                <img 
                  src={materialDetails.image} 
                  alt={materialDetails.materialName} 
                  className="max-h-[400px] max-w-full object-contain"
                />
              </div>
            </div>
            
            {/* Right side - Details */}
            <div className="md:w-1/2 p-8 flex flex-col">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{materialDetails.materialName}</h2>
              <p className="text-lg font-semibold text-gray-700 mb-6">Rs. {materialDetails.pricePerUnit.toFixed(2)}</p>
              
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Uasage</h3>
              <p className="text-gray-600 mb-8">{materialDetails.usageInstructions || 'No description available.'}</p>
              
              <div className="flex flex-col space-y-6 mb-8">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Category</h3>
                  <p className="text-gray-800">{materialDetails.category}</p>
                </div>
                
               
                {materialDetails.diseaseUsage && materialDetails.diseaseUsage.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Recommended For</h3>
                    <div className="flex flex-wrap gap-2">
                      {materialDetails.diseaseUsage.map((disease, index) => (
                        <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                          {disease}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-auto">
                <div className="flex items-center space-x-4 mb-6">
                  <button 
                    onClick={() => handleQuantityChange(materialDetails._id, -1)}
                    className="bg-gray-200 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-300"
                  >
                    <FaMinus />
                  </button>
                  <span className="text-xl font-semibold">{cart[materialDetails._id] || 0}</span>
                  <button 
                    onClick={() => handleQuantityChange(materialDetails._id, 1)}
                    className="bg-gray-200 text-gray-700 rounded-full w-8 h-8 flex items-center justify-center hover:bg-gray-300"
                  >
                    <FaPlus />
                  </button>
                </div>
                
                <button 
                  onClick={() => {
                    handleQuantityChange(materialDetails._id, 1);
                    closeMaterialDetails();
                  }}
                  className="w-full bg-green-600 text-white py-3 rounded-md hover:bg-green-700 transition-colors flex items-center justify-center"
                >
                   Add to Cart
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center p-8 w-full">
            <p className="text-gray-600">Failed to load material details.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default MaterialDetailsModal;