import React, { useState, useCallback, useEffect } from "react";
import Spinner from "../components/Spinner";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useDropzone } from "react-dropzone";
import { FaSave, FaArrowLeft, FaArrowRight } from "react-icons/fa";
import ProgressBar from "../components/ProgressBar";
import SupplierSidebar from "../components/SupplierSidebar";
import ManagerNavBar from "../components/ManagerNavBar";

const CreateMaterial = () => {
  const [materialName, setMaterialName] = useState("");
  const [category, setCategory] = useState("");
  const [diseaseUsage, setDiseaseUsage] = useState([]);
  const [usageInstructions, setUsageInstructions] = useState("");
  const [unitType, setUnitType] = useState("");
  const [pricePerUnit, setPricePerUnit] = useState("");
  const [supplierName, setSupplierName] = useState("");
  const [supplierContact, setSupplierContact] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const diseaseOptions = ["Plant Growth", "Insect Control", "Weed Killers"];

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleDiseaseToggle = (disease) => {
    if (diseaseUsage.includes(disease)) {
      setDiseaseUsage(diseaseUsage.filter((d) => d !== disease));
    } else {
      setDiseaseUsage([...diseaseUsage, disease]);
    }
  };

  const handlePriceChange = (e) => {
    const value = e.target.value;
    if (value < 0) {
      setErrors((prev) => ({
        ...prev,
        pricePerUnit: "Price must be a positive number",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        pricePerUnit: "",
      }));
    }
    setPricePerUnit(value);
  };

  const handleSupplierContactChange = (e) => {
    const value = e.target.value;
    const phoneRegex = /^(07|08|01)\d{8}$/;
    if (!phoneRegex.test(value)) {
      setErrors((prev) => ({
        ...prev,
        supplierContact:
          "Please enter a valid 10-digit number starting with 07, 08 or 01",
      }));
    } else {
      setErrors((prev) => ({
        ...prev,
        supplierContact: "",
      }));
    }
    setSupplierContact(value);
  };

  const onDrop = useCallback(
    (acceptedFiles, fileRejections) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (file.size > 30720) {
          // 30KB = 30 * 1024 bytes
          enqueueSnackbar("Image size should not exceed 30KB", {
            variant: "warning",
          });
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          setImage(reader.result);
        };
        reader.readAsDataURL(file);
      }

      if (fileRejections.length > 0) {
        fileRejections.forEach((rejection) => {
          if (rejection.errors[0].code === "file-too-large") {
            enqueueSnackbar(`Max size is 30KB.`, { variant: "error" });
          }
        });
      }
    },
    [enqueueSnackbar]
  );

  const { getRootProps, getInputProps, fileRejections } = useDropzone({
    onDrop,
    accept: "image/*",
    maxSize: 30720, // 30KB
  });

  useEffect(() => {
    fileRejections.forEach((rejection) => {
      if (rejection.errors[0].code === "file-too-large") {
        enqueueSnackbar(`${rejection.file.name} is too large.`, {
          variant: "error",
        });
      }
    });
  }, [fileRejections, enqueueSnackbar]);

  const handleSaveMaterial = () => {
    const data = {
      materialName,
      category,
      diseaseUsage,
      usageInstructions,
      unitType,
      pricePerUnit,
      supplierName,
      supplierContact,
      image,
    };
    setLoading(true);
    axios
      .post("http://localhost:5557/materials", data)
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Material Created successfully", {
          variant: "success",
        });
        navigate(`/materials`);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error", { variant: "error" });
        console.log(error);
      });
  };

  const isFormValid = () => {
    return (
      materialName &&
      category &&
      unitType &&
      pricePerUnit &&
      supplierName &&
      supplierContact &&
      usageInstructions &&
      diseaseUsage.length > 0 &&
      !errors.pricePerUnit &&
      !errors.supplierContact &&
      image
    );
  };

  const renderFormSection = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="materialName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Material Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="materialName"
                  id="materialName"
                  value={materialName}
                  onChange={(e) => setMaterialName(e.target.value)}
                  className={`mt-1 block w-full border ${
                    errors.materialName ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                />
              </div>
              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700"
                >
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  id="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Category</option>
                  <option value="Fertilizer">Fertilizer</option>
                  <option value="Pesticide">Pesticide</option>
                  <option value="Herbicide">Herbicide</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="unitType"
                  className="block text-sm font-medium text-gray-700"
                >
                  Unit Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="unitType"
                  id="unitType"
                  value={unitType}
                  onChange={(e) => setUnitType(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                >
                  <option value="">Select Unit</option>
                  <option value="kg">kg</option>
                  <option value="liters">liters</option>
                  <option value="packs">packs</option>
                </select>
              </div>
              <div>
                <label
                  htmlFor="pricePerUnit"
                  className="block text-sm font-medium text-gray-700"
                >
                  Price Per Unit <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="pricePerUnit"
                  id="pricePerUnit"
                  value={pricePerUnit}
                  onChange={handlePriceChange}
                  className={`mt-1 block w-full border ${
                    errors.pricePerUnit ? "border-red-500" : "border-gray-300"
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                />
                {errors.pricePerUnit && (
                  <p className="text-xs text-red-500">{errors.pricePerUnit}</p>
                )}
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">Supplier Details</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="supplierName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Supplier Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="supplierName"
                  id="supplierName"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
                />
              </div>
              <div>
                <label
                  htmlFor="supplierContact"
                  className="block text-sm font-medium text-gray-700"
                >
                  Supplier Contact <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="supplierContact"
                  id="supplierContact"
                  value={supplierContact}
                  onChange={handleSupplierContactChange}
                  className={`mt-1 block w-full border ${
                    errors.supplierContact
                      ? "border-red-500"
                      : "border-gray-300"
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500`}
                />
                {errors.supplierContact && (
                  <p className="text-xs text-red-500">
                    {errors.supplierContact}
                  </p>
                )}
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">Usage Information</h2>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Disease Usage <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {diseaseOptions.map((disease) => (
                  <button
                    key={disease}
                    type="button"
                    onClick={() => handleDiseaseToggle(disease)}
                    className={`
                      px-3 py-1 rounded-full text-sm transition-all
                      ${
                        diseaseUsage.includes(disease)
                          ? "bg-emerald-500 text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }
                    `}
                  >
                    {disease}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label
                htmlFor="usageInstructions"
                className="block text-sm font-medium text-gray-700"
              >
                Usage Instructions <span className="text-red-500">*</span>
              </label>
              <textarea
                name="usageInstructions"
                id="usageInstructions"
                rows="3"
                value={usageInstructions}
                onChange={(e) => setUsageInstructions(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500"
              ></textarea>
            </div>
          </>
        );
      case 4:
        return (
          <>
            <h2 className="text-xl font-semibold mb-4">Image Upload</h2>
            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-700"
              >
                Material Image <span className="text-red-500">*</span>
              </label>
              <div
                {...getRootProps()}
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
              >
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-green-500"
                    >
                      <span>Upload a file</span>
                      <input
                        {...getInputProps()}
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, JPEG up to 20KB
                  </p>
                </div>
              </div>
            </div>
            {image && (
              <div className="mt-4">
                <img
                  src={image}
                  alt="Uploaded material"
                  className="h-32 w-32 object-cover rounded-md"
                />
              </div>
            )}
          </>
        );
      default:
        return null;
    }
  };

  return (
    
    <div className="flex h-screen bg-gray-100 ">
    <SupplierSidebar />
    <div className="flex-1 overflow-auto">
      <ManagerNavBar />
      <div className="min-h-screen relative bg-gray-100 py-28">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
            backgroundColor: "rgba(243, 244, 246, 0.9)",
            backgroundBlendMode: "overlay",
        }}
      ></div>

      <div className="absolute inset-0 bg-white opacity-0"></div>

      <div className="relative z-30">
        <div className="max-w-3xl mx-auto mt-28 bg-white bg-opacity-100 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg overflow-hidden">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (currentStep === totalSteps) {
                handleSaveMaterial();
              } else {
                nextStep();
              }
            }}
            className="px-4 py-5 sm:p-6"
          >
            {loading && <Spinner />}
            <ProgressBar currentStep={currentStep} totalSteps={totalSteps} />
            {renderFormSection()}

            <div className="mt-8 flex justify-between">
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <FaArrowLeft className="mr-2" />
                  Previous
                </button>
              )}
              <button
                type="submit"
                disabled={currentStep === totalSteps && !isFormValid()}
                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                  currentStep === totalSteps && !isFormValid()
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                }`}
              >
                {currentStep === totalSteps ? (
                  <>
                    <FaSave className="mr-2" />
                    Save Material
                  </>
                ) : (
                  <>
                    Next
                    <FaArrowRight className="ml-2" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default CreateMaterial;
