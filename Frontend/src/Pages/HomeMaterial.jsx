import React, { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "../components/Spinner";
import { MdSearch } from "react-icons/md";
import { FaSort, FaEye, FaTrash } from "react-icons/fa";
import SupplierSidebar from "../components/SupplierSidebar";
import { motion, AnimatePresence } from "framer-motion";
import ShowMaterial from "./ShowMaterial";
import { Link } from "react-router-dom";
import { FaEdit } from "react-icons/fa";
import EditMaterial from "./EditMaterial";
import ManagerNavBar from "../components/ManagerNavBar";

const HomeMaterial = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState("materialName");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filterCategory, setFilterCategory] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [editingMaterial, setEditingMaterial] = useState(null);

  const fetchMaterials = () => {
    setLoading(true);
    axios
      .get("http://localhost:5557/materials")
      .then((response) => {
        setMaterials(response.data.data);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const openEditModal = (materialId) => {
    setEditingMaterial(materialId);
  };

  const closeEditModal = () => {
    setEditingMaterial(null);
  };

  // Update the handleMaterialUpdate function
const handleMaterialUpdate = (updatedMaterial) => {
  console.log("Updated material received:", updatedMaterial); // Add this for debugging
  
  // Refresh the entire materials list to ensure we have the latest data
  fetchMaterials();
  
  // Close the edit modal
  closeEditModal();
};

  const openDeleteModal = (materialId) => {
    setMaterialToDelete(materialId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setMaterialToDelete(null);
  };

  const handleDelete = async () => {
    if (materialToDelete) {
      try {
        await axios.delete(
          `http://localhost:5557/materials/${materialToDelete}`
        );
        setMaterials(
          materials.filter((material) => material._id !== materialToDelete)
        );
        closeDeleteModal();
      } catch (error) {
        console.error("Error deleting material:", error);
      }
    }
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const getCategoryColor = (category) => {
    switch (category.toLowerCase()) {
      case "fertilizer":
        return "bg-blue-400 text-white";
      case "pesticide":
        return "bg-red-400 text-white";
      case "herbicide":
        return "bg-green-400 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const openMaterialDetails = (materialId) => {
    setSelectedMaterial(materialId);
  };

  const closeMaterialDetails = () => {
    setSelectedMaterial(null);
  };

  const filteredAndSortedMaterials = materials
    .filter(
      (material) =>
        material.materialName
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) &&
        (filterCategory === "" || material.category === filterCategory)
    )
    .sort((a, b) => {
      if (a[sortField] < b[sortField]) return sortOrder === "asc" ? -1 : 1;
      if (a[sortField] > b[sortField]) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
          backgroundColor: "rgba(243, 244, 246, 1.2)",
          backgroundBlendMode: "overlay",
        }}
      ></div>
      <ManagerNavBar />
      <div className="flex flex-1 overflow-hidden relative z-10">
        <SupplierSidebar />
        <div className="flex-1 overflow-auto p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-800 mt-20 mb-8">
              Materials
            </h1>
            <div className="bg-white bg-opacity-30 backdrop-filter backdrop-blur-sm rounded-lg shadow-md p-6 mb-8">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div className="flex-1 min-w-[200px] relative">
                  <input
                    type="text"
                    placeholder="Search materials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full p-3 pl-10 border-2 border-green-400 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  />
                  <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
                </div>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="p-3 border border-green-300 rounded-md text-sm bg-green-100"
                >
                  <option value="">All Categories</option>
                  <option value="Fertilizer">Fertilizer</option>
                  <option value="Pesticide">Pesticide</option>
                  <option value="Herbicide">Herbicide</option>
                </select>
                <button
                  onClick={() => handleSort("materialName")}
                  className="p-3 bg-green-100 text-gray-700 rounded-md hover:bg-green-500 hover:text-white transition-colors flex items-center text-sm"
                >
                  <FaSort className="mr-2" />
                  Sort by Name
                </button>
                <button
                  onClick={() => handleSort("pricePerUnit")}
                  className="p-3 bg-green-100 text-gray-700 rounded-md hover:bg-green-500 hover:text-white transition-colors flex items-center text-sm"
                >
                  <FaSort className="mr-2" />
                  Sort by Price
                </button>
              </div>

              {loading ? (
                <Spinner />
              ) : (
                <section className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-4 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-3 ml-3 mr-3">
                  {filteredAndSortedMaterials.map((material) => (
                    <div
                      key={material._id}
                      className="w-72 bg-white bg-opacity-80 backdrop-filter backdrop-blur-sm shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl transition-all relative"
                    >
                      <img
                        src={
                          material.image ||
                          "https://via.placeholder.com/300x200?text=No+Image"
                        }
                        alt={material.materialName}
                        className="h-80 w-72 object-cover rounded-t-xl"
                      />
                      <div className="px-4 py-3 w-72">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                            material.category
                          )}`}
                        >
                          {material.category}
                        </span>
                        <h3 className="text-base font-semibold text-gray-800 truncate block capitalize mt-2">
                          {material.materialName}
                        </h3>
                        <p className="text-lg font-bold text-gray-800 mt-3 mb-10">
                          Rs.{material.pricePerUnit.toFixed(2)} /{" "}
                          <span className="text-sm font-normal text-gray-600">
                            {material.unitType}
                          </span>
                        </p>
                      </div>
                      <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                        <button
                          onClick={() => openMaterialDetails(material._id)}
                          className="flex items-center text-green-600 px-3 rounded-full transition-colors text-sm hover:text-green-700"
                        >
                          <FaEye className="mr-1.5" />
                          <span>View Details</span>
                        </button>
                        <button
                          onClick={() => openEditModal(material._id)}
                          className="flex items-center text-blue-600 px-3 rounded-full transition-colors text-sm hover:text-blue-700"
                        >
                          <FaEdit className="mr-1.5" />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => openDeleteModal(material._id)}
                          className="flex items-center text-red-600 px-3 rounded-full transition-colors text-sm hover:text-red-700"
                        >
                          <FaTrash className="mr-1.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </section>
              )}

              {!loading && filteredAndSortedMaterials.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-xl text-gray-600">
                    No materials found. Start by adding a new material.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
      {editingMaterial && (
        <EditMaterial 
          id={editingMaterial} 
          onClose={closeEditModal} 
          onUpdate={handleMaterialUpdate} 
        />
      )}
      </AnimatePresence>

      {/* Material Details Popup */}
      <AnimatePresence>
        {selectedMaterial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-60 backdrop-filter backdrop-blur-md flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg p-8 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
              <ShowMaterial
                id={selectedMaterial}
                onClose={closeMaterialDetails}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-filter backdrop-blur-md flex items-center justify-center z-50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg p-8 max-w-md w-full mx-4"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Delete Confirmation
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this material? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeDeleteModal}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default HomeMaterial;
