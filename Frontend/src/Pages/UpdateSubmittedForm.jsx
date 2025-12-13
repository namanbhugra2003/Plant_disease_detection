import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";

export const UpdateSubmittedForm = ({ inquiryId, onClose, onUpdateSuccess }) => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [plantName, setPlantName] = useState("");
  const [diseaseName, setDiseaseName] = useState("");
  const [issueDescription, setIssueDescription] = useState("");

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const [fullnameError, setFullnameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [contactNumberError, setContactNumberError] = useState("");

  useEffect(() => {
    console.log("Form ID:", inquiryId);

    if (!inquiryId) {
      console.error("No inquiry ID provided");
      enqueueSnackbar("No inquiry ID provided", { variant: "error" });
      onClose();
      return;
    }
    
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData.token) {
      enqueueSnackbar("No valid user session found. Please login again.", { variant: "error" });
      navigate("/login");
      return;
    }

    setLoading(true);
    axios
      .get(`http://localhost:5557/farmer/${inquiryId}`, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
      .then((response) => {
        console.log(response.data);
        const farmerData = response.data.farmer;
        setFullname(farmerData.fullname);
        setEmail(farmerData.email);
        setLocation(farmerData.location);
        setContactNumber(farmerData.contactNumber);
        setPlantName(farmerData.plantName);
        setDiseaseName(farmerData.diseaseName);
        setIssueDescription(farmerData.issueDescription);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error fetching data: " + error.message, { variant: "error" });
        console.error(error);
      });
  }, [inquiryId, enqueueSnackbar, navigate, onClose]);

  const handleSaveForm = () => {
    if (
      !fullname ||
      !email ||
      !location ||
      !contactNumber ||
      !plantName ||
      !diseaseName ||
      !issueDescription ||
      fullnameError ||
      emailError ||
      locationError ||
      contactNumberError
    ) {
      enqueueSnackbar("Please fill in all required fields correctly.", {
        variant: "error",
      });
      return;
    }

    const data = {
      fullname,
      email,
      location,
      contactNumber,
      plantName,
      diseaseName,
      issueDescription,
    };

    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData.token) {
      enqueueSnackbar("No valid user session found.", { variant: "error" });
      navigate("/login");
      return;
    }

    setLoading(true);
    axios
      .put(`http://localhost:5557/farmer/${inquiryId}`, data, {
        headers: {
          Authorization: `Bearer ${userData.token}`,
        },
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Form updated successfully!", {
          variant: "success",
        });
        onUpdateSuccess();
        onClose();
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error updating form: " + error.message, { variant: "error" });
        console.error(error);
      });
  };


  const handleFullnameChange = (e) => {
    const { value } = e.target;
    setFullname(value);

    // Validate fullname (letters only)
    if (!/^[a-zA-Z\s]+$/.test(value)) {
      setFullnameError("Fullname should contain only letters and spaces.");
    } else {
      setFullnameError("");
    }
  };

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setEmail(value);

    // Validate email
    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
      setEmailError("Email should be in the format example@domain.com.");
    } else {
      setEmailError("");
    }
  };

  const handleLocationChange = (e) => {
    const { value } = e.target;
    setLocation(value);

    // Validate location (ensure it's not empty)
    if (!value.trim()) {
      setLocationError("Location is required.");
    } else {
      setLocationError("");
    }
  };

  const handleContactNumberChange = (e) => {
    const { value } = e.target;
    setContactNumber(value);

    // Validate contact number (must be 10 digits)
    if (!/^[0-9]{10}$/.test(value)) {
      setContactNumberError("Contact Number should be a 10-digit number.");
    } else {
      setContactNumberError("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        <div className="bg-green-600 py-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors duration-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <h1 className="text-center text-white text-4xl font-bold tracking-tight">
            Update Farmer Assistance Form
          </h1>
          <p className="text-center text-green-100 mt-2">
            Update your previous submission
          </p>
        </div>

        <div className="flex-grow overflow-y-auto p-8">
          {/* Personal Information Section */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-gray-800 border-b border-green-200 pb-2 mb-6 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Personal Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={fullname}
                  onChange={handleFullnameChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    fullnameError
                      ? "border-red-500"
                      : "border-yellow-500 focus:border-green-500"
                  } focus:ring-2 focus:ring-green-200 focus:outline-none transition-colors shadow-sm`}
                  placeholder="Enter your full name"
                />
                {fullnameError && (
                  <p className="mt-1 text-sm text-red-500">{fullnameError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={handleEmailChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    emailError
                      ? "border-red-500"
                      : "border-yellow-500 focus:border-green-500"
                  } focus:ring-2 focus:ring-green-200 focus:outline-none transition-colors shadow-sm`}
                  placeholder="example@email.com"
                />
                {emailError && (
                  <p className="mt-1 text-sm text-red-500">{emailError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={handleLocationChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    locationError
                      ? "border-red-500"
                      : "border-yellow-500 focus:border-green-500"
                  } focus:ring-2 focus:ring-green-200 focus:outline-none transition-colors shadow-sm`}
                  placeholder="Your location"
                />
                {locationError && (
                  <p className="mt-1 text-sm text-red-500">{locationError}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={contactNumber}
                  onChange={handleContactNumberChange}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    contactNumberError
                      ? "border-red-500"
                      : "border-yellow-500 focus:border-green-500"
                  } focus:ring-2 focus:ring-green-200 focus:outline-none transition-colors shadow-sm`}
                  placeholder="10-digit phone number"
                />
                {contactNumberError && (
                  <p className="mt-1 text-sm text-red-500">
                    {contactNumberError}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Plant Information Section */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-gray-800 border-b border-green-200 pb-2 mb-6 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Plant Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plant Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={plantName}
                  onChange={(e) => setPlantName(e.target.value)}
                 className="w-full px-4 py-2 rounded-lg border border-yellow-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-colors shadow-sm"
                  placeholder="Enter plant name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Disease Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={diseaseName}
                  onChange={(e) => setDiseaseName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-yellow-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-colors shadow-sm"
                  placeholder="Enter disease name (if known)"
                />
              </div>
            </div>
          </div>

          {/* Issue Description Section */}
          <div className="mb-10">
            <h2 className="text-lg font-semibold text-gray-800 border-b border-green-200 pb-2 mb-6 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2z"
                />
              </svg>
              Issue Description
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Describe the Issue <span className="text-red-500">*</span>
              </label>
              <textarea
                value={issueDescription}
                onChange={(e) => setIssueDescription(e.target.value)}
                rows="4"
                className="w-full px-4 py-2 rounded-lg border border-yellow-500 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none transition-colors shadow-sm"
                placeholder="Please describe the issue you're experiencing with your plant in detail..."
              ></textarea>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handleSaveForm}
              disabled={
                loading ||
                fullnameError ||
                emailError ||
                locationError ||
                contactNumberError
              }
              className={`px-8 py-3 rounded-lg text-white font-medium text-lg shadow-md transition-all transform hover:scale-105 ${
                loading ||
                fullnameError ||
                emailError ||
                locationError ||
                contactNumberError
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 hover:shadow-lg"
              }`}
            >
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Updating...
                </span>
              ) : (
                "Update Form"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateSubmittedForm;