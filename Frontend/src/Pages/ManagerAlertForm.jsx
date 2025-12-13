import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";


const ManagerAlertForm = () => {
  const [diseaseName, setDiseaseName] = useState("");
  const [location, setLocation] = useState("");
  const [severity, setSeverity] = useState("Select Severity");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [numberOfReports, setNumberOfReports] = useState("");
  const [dateDetected, setDateDetected] = useState("");
  const [description, setDescription] = useState("");
  const [showBadge, setShowBadge] = useState(false);

  const [diseaseNameError, setDiseaseNameError] = useState("");
  const [locationError, setLocationError] = useState("");
  const [severityError, setSeverityError] = useState("");
  const [dateError, setDateError] = useState("");
  const [numberError, setNumberError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();


  const diseaseRef = useRef(null);
  const locationRef = useRef(null);
  const numberRef = useRef(null);
  const dateRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDropdownSelect = (value) => {
    setSeverity(value);
    setSeverityError("");
    setDropdownOpen(false);
  };

  const handlePreview = () => {
    let hasError = false;

    if (!diseaseName.trim()) {
      setDiseaseNameError("Disease name is required.");
      diseaseRef.current?.focus();
      hasError = true;
    }

    if (!location.trim()) {
      setLocationError("Location is required.");
      if (!hasError) locationRef.current?.focus();
      hasError = true;
    }

    if (severity === "Select Severity") {
      setSeverityError("Severity is required.");
      hasError = true;
    }

    if (dateDetected && new Date(dateDetected) > new Date()) {
      setDateError("Date cannot be in the future.");
      if (!hasError) dateRef.current?.focus();
      hasError = true;
    } else {
      setDateError("");
    }

    if (numberOfReports && parseInt(numberOfReports) < 0) {
      setNumberError("Number of reports cannot be negative.");
      if (!hasError) numberRef.current?.focus();
      hasError = true;
    } else {
      setNumberError("");
    }

    if (hasError) {
      enqueueSnackbar("Please fill in all required fields correctly.", { variant: "error" });
      return;
    }

    setShowPreview(true);
  };

  const handleSubmit = async () => {
    setShowPreview(false);
    const data = {
      diseaseName,
      location,
      severity,
      numberOfReports: parseInt(numberOfReports) || 0,
      dateDetected,
      description,
      showBadge,
    };

    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData || !userData.token) {
      enqueueSnackbar("No valid user session found.", { variant: "error" });
      return;
    }

    setLoading(true);
    try {
      await axios.post("http://localhost:5557/alerts", data, {
        headers: { Authorization: `Bearer ${userData.token}` },
      });
      enqueueSnackbar("Alert created successfully!", { variant: "success" });

      setDiseaseName("");
      setLocation("");
      setSeverity("Select Severity");
      setNumberOfReports("");
      setDateDetected("");
      setDescription("");
      setShowBadge(false);

      navigate("/manager-dashboard");
    } catch (error) {
      console.error("Error creating alert:", error);
      enqueueSnackbar("Error submitting alert.", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        backgroundColor: "rgba(243, 244, 246, 0.85)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-green-600 py-6 px-4 sm:px-6">
          <h1 className="text-center text-white text-3xl font-bold tracking-tight">
            Create Disease Alert
          </h1>
          <p className="text-center text-green-100 mt-2">
            Notify farmers about outbreaks in specific areas
          </p>
        </div>

        <div className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Disease Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                ref={diseaseRef}
                value={diseaseName}
                onChange={(e) => {
                  setDiseaseName(e.target.value);
                  setDiseaseNameError(!e.target.value.trim() ? "Disease name is required." : "");
                }}
                className={`w-full px-4 py-2 rounded-lg border ${
                  diseaseNameError ? "border-red-500" : "border-gray-300 focus:border-green-500"
                } focus:ring-2 focus:ring-green-200 focus:outline-none`}
                placeholder="Enter disease name"
              />
              {diseaseNameError && (
                <p className="mt-1 text-sm text-red-500">{diseaseNameError}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                ref={locationRef}
                value={location}
                onChange={(e) => {
                  setLocation(e.target.value);
                  setLocationError(!e.target.value.trim() ? "Location is required." : "");
                }}
                className={`w-full px-4 py-2 rounded-lg border ${
                  locationError ? "border-red-500" : "border-gray-300 focus:border-green-500"
                } focus:ring-2 focus:ring-green-200 focus:outline-none`}
                placeholder="Affected area"
              />
              {locationError && (
                <p className="mt-1 text-sm text-red-500">{locationError}</p>
              )}
            </div>

            <div ref={dropdownRef} className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Severity <span className="text-red-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className={`w-full px-4 py-2 rounded-lg border text-left flex justify-between items-center ${
                  severity !== "Select Severity"
                    ? "border-green-500"
                    : severityError
                    ? "border-red-500"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-green-200 focus:outline-none bg-white text-gray-700 hover:bg-green-50`}
              >
                {severity}
                <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute mt-1 z-10 bg-white border border-gray-200 rounded-lg shadow-lg w-full">
                  <ul className="py-2 text-base text-gray-700">
                    {["Low", "Medium", "High", "Critical"].map((level) => (
                      <li key={level}>
                        <button
                          type="button"
                          onClick={() => handleDropdownSelect(level)}
                          className="block w-full text-left px-4 py-2 hover:bg-green-100 hover:text-gray-900"
                        >
                          {level}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {severityError && <p className="mt-1 text-sm text-red-500">{severityError}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Number of Reports
              </label>
              <input
                type="number"
                ref={numberRef}
                value={numberOfReports}
                onChange={(e) => {
                  const val = e.target.value;
                  setNumberOfReports(val);
                  if (val && parseInt(val) < 0) {
                    setNumberError("Number of reports cannot be negative.");
                  } else {
                    setNumberError("");
                  }
                }}
                className={`w-full px-4 py-2 rounded-lg border ${
                  numberError ? "border-red-500" : "border-gray-300 focus:border-green-500"
                } focus:ring-2 focus:ring-green-200 focus:outline-none`}
                placeholder="Number of similar reports"
              />
              {numberError && <p className="mt-1 text-sm text-red-500">{numberError}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Detected
              </label>
              <input
                type="date"
                ref={dateRef}
                value={dateDetected}
                max={new Date().toISOString().split("T")[0]}
                onChange={(e) => {
                  const value = e.target.value;
                  setDateDetected(value);
                  if (new Date(value) > new Date()) {
                    setDateError("Date cannot be in the future.");
                  } else {
                    setDateError("");
                  }
                }}
                className={`w-full px-4 py-2 rounded-lg border ${
                  dateError ? "border-red-500" : "border-gray-300 focus:border-green-500"
                } focus:ring-2 focus:ring-green-200 focus:outline-none`}
              />
              {dateError && <p className="mt-1 text-sm text-red-500">{dateError}</p>}
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Additional Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 focus:outline-none"
              placeholder="Symptoms, notes, or suggestions..."
            ></textarea>

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={showBadge}
                onChange={() => setShowBadge(!showBadge)}
                className="mr-2"
              />
              <label className="text-sm text-gray-700">Show Alert Badge to Farmers</label>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              onClick={handlePreview}
              disabled={loading}
              className="px-8 py-3 rounded-lg text-white font-medium text-lg bg-green-600 hover:bg-green-700 shadow-md hover:shadow-lg transition-transform hover:scale-105"
            >
              Preview Alert
            </button>
          </div>
        </div>
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Preview Alert Details</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li><strong>Disease:</strong> {diseaseName}</li>
              <li><strong>Location:</strong> {location}</li>
              <li><strong>Severity:</strong> {severity}</li>
              <li><strong>Reports:</strong> {numberOfReports || 0}</li>
              <li><strong>Date:</strong> {dateDetected || "N/A"}</li>
              <li><strong>Badge:</strong> {showBadge ? "Yes" : "No"}</li>
              <li><strong>Description:</strong> {description || "N/A"}</li>
            </ul>

            <div className="flex justify-end mt-4 gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                onClick={() => setShowPreview(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={handleSubmit}
              >
                Confirm & Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerAlertForm;
