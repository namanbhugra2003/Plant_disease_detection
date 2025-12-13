import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import {
  FaEdit,
  FaBox,
  FaDollarSign,
  FaPhone,
  FaTint,
  FaUser,
  FaBook,
  FaSave,
  FaTimesCircle,
  FaTimes,
} from "react-icons/fa";

const EditMaterial = ({ id, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    materialName: "",
    category: "",
    diseaseUsage: [],
    usageInstructions: "",
    unitType: "",
    pricePerUnit: "",
    supplierName: "",
    supplierContact: "",
    image: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const [diseaseOptions] = useState([
    "Plant Growth",
    "Insect Control",
    "Weed Killers",
  ]);
  const [unitTypeOptions] = useState(["kg", "liters", "packs"]);
  const [categoryOptions] = useState(["Fertilizer", "Pesticide", "Herbicide"]);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5557/materials/${id}`)
      .then((response) => {
        setFormData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching material:", error);
        setLoading(false);
        enqueueSnackbar("Error fetching material details", {
          variant: "error",
        });
      });
  }, [id, enqueueSnackbar]);

  // Direct input handling without custom components
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear any errors for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleDiseaseChange = (e) => {
    const { value, checked } = e.target;
    const updatedDiseaseUsage = checked
      ? [...formData.diseaseUsage, value]
      : formData.diseaseUsage.filter((disease) => disease !== value);

    setFormData({
      ...formData,
      diseaseUsage: updatedDiseaseUsage,
    });

    if (errors.diseaseUsage) {
      setErrors({
        ...errors,
        diseaseUsage: "",
      });
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;

    setFormData({
      ...formData,
      pricePerUnit: value,
    });

    if (value < 0) {
      setErrors({
        ...errors,
        pricePerUnit: "Price must be a positive number",
      });
    } else if (errors.pricePerUnit) {
      setErrors({
        ...errors,
        pricePerUnit: "",
      });
    }
  };

  const handleSupplierContactChange = (e) => {
    const value = e.target.value;
    const phoneRegex = /^(07|08|01)\d{8}$/;

    setFormData({
      ...formData,
      supplierContact: value,
    });

    if (value && !phoneRegex.test(value)) {
      setErrors({
        ...errors,
        supplierContact:
          "Please enter a valid 10-digit number starting with 07, 08 or 01",
      });
    } else if (errors.supplierContact) {
      setErrors({
        ...errors,
        supplierContact: "",
      });
    }
  };

  const isFormValid = () => {
    return (
      formData.materialName &&
      formData.category &&
      formData.unitType &&
      formData.pricePerUnit &&
      formData.supplierName &&
      formData.supplierContact &&
      formData.usageInstructions &&
      formData.diseaseUsage.length > 0 &&
      !errors.pricePerUnit &&
      !errors.supplierContact &&
      formData.image
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      enqueueSnackbar("Please correct the errors in the form", { variant: "error" });
      return;
    }
    setLoading(true);

    try {
      const response = await axios.put(`http://localhost:5557/materials/${id}`, formData);
      setLoading(false);
      enqueueSnackbar("Material updated successfully", { variant: "success" });
      
      // Make sure we're passing the complete updated material data to the parent
      if (onUpdate && typeof onUpdate === 'function') {
        onUpdate(response.data.data || response.data);
      }
      
      onClose(); // Close the popup
    } catch (error) {
      console.error("Error updating material:", error);
      setLoading(false);
      enqueueSnackbar("Error updating material", { variant: "error" });
    }
  };

  if (loading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-2xl font-semibold text-gray-800">
            Edit Material
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes size={24} />
          </button>
        </div>

        <div className="mt-4 max-h-[70vh] overflow-y-auto">
          <form onSubmit={handleSubmit} className="space-y-6 ">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="p-4 rounded-lg shadow-lg">
                  <div className="flex items-center justify-center">
                    <img
                      src={formData.image}
                      alt={formData.materialName}
                      className="w-50 h-48 object-cover rounded-lg mb-4"
                    />
                  </div>
                  <div className="space-y-4">
                    {/* Direct input fields without custom components */}
                    <div>
                      <label
                        htmlFor="materialName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Material Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="materialName"
                        name="materialName"
                        value={formData.materialName || ""}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full border ${
                          errors.materialName
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                      {errors.materialName && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.materialName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="category"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="category"
                        name="category"
                        value={formData.category || ""}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full border ${
                          errors.category ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                      >
                        <option value="">Select Category</option>
                        {categoryOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.category}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="pricePerUnit"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Price per Unit <span className="text-red-500">*</span>
                      </label>
                      <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <FaDollarSign className="text-gray-400" />
                        </div>
                        <input
                          type="number"
                          id="pricePerUnit"
                          name="pricePerUnit"
                          value={formData.pricePerUnit || ""}
                          onChange={handlePriceChange}
                          className={`block w-full pl-10 pr-12 border ${
                            errors.pricePerUnit
                              ? "border-red-500"
                              : "border-gray-300"
                          } rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                        />
                      </div>
                      {errors.pricePerUnit && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.pricePerUnit}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="unitType"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Unit Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="unitType"
                        name="unitType"
                        value={formData.unitType || ""}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full border ${
                          errors.unitType ? "border-red-500" : "border-gray-300"
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                      >
                        <option value="">Select Unit Type</option>
                        {unitTypeOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                      {errors.unitType && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.unitType}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 space-y-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                    <FaBook className="mr-2 text-orange-500" />
                    Usage Instructions
                  </h3>
                  <textarea
                    id="usageInstructions"
                    name="usageInstructions"
                    value={formData.usageInstructions || ""}
                    onChange={handleInputChange}
                    rows="4"
                    className={`mt-1 block w-full border ${
                      errors.usageInstructions
                        ? "border-red-500"
                        : "border-gray-300"
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  ></textarea>
                  {errors.usageInstructions && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.usageInstructions}
                    </p>
                  )}
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                    <FaUser className="mr-2 text-indigo-500" />
                    Supplier Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="supplierName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Supplier Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="supplierName"
                        name="supplierName"
                        value={formData.supplierName || ""}
                        onChange={handleInputChange}
                        className={`mt-1 block w-full border ${
                          errors.supplierName
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                      {errors.supplierName && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.supplierName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="supplierContact"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Contact Information{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="supplierContact"
                        name="supplierContact"
                        value={formData.supplierContact || ""}
                        onChange={handleSupplierContactChange}
                        className={`mt-1 block w-full border ${
                          errors.supplierContact
                            ? "border-red-500"
                            : "border-gray-300"
                        } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                      />
                      {errors.supplierContact && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.supplierContact}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
                    <FaTint className="mr-2 text-green-500" />
                    Disease Usage
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {diseaseOptions.map((option) => (
                      <div key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          id={option}
                          value={option}
                          checked={
                            formData.diseaseUsage?.includes(option) || false
                          }
                          onChange={handleDiseaseChange}
                          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                        />
                        <label
                          htmlFor={option}
                          className="ml-2 block text-sm text-gray-900"
                        >
                          {option}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.diseaseUsage && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.diseaseUsage}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <FaTimesCircle className="inline-block mr-2" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isFormValid()}
                className={`px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white ${
                  isFormValid()
                    ? "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    : "bg-green-400 cursor-not-allowed"
                }`}
              >
                <FaSave className="inline-block mr-2" />
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditMaterial;
