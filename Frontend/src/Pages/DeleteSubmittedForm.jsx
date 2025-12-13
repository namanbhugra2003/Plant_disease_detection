import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSnackbar } from "notistack";

const DeleteSubmittedForm = ({inquiryId, onClose, onDeleteSuccess}) => {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData.token) {
      enqueueSnackbar("No valid user session found. Please login again.", { variant: "error" });
      onClose();
      return;
    }
  
    setLoading(true);
    axios
      .get(`http://localhost:5557/farmer/${inquiryId}`, {
        headers: {
          Authorization: `Bearer ${userData.token}`, // Add token to the header
        },
      })
      .then((response) => {
        setFormData(response.data.farmer); // Update formData after successful fetch
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error fetching form data", { variant: "error" });
        console.log(error);
        onClose()
      });
  }, [inquiryId, enqueueSnackbar, navigate, onClose]);
  

  const handleDelete = () => {
    setLoading(true);
  
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData.token) {
      enqueueSnackbar("No valid user session found. Please login again.", { variant: "error" });
      onClose();
      return;
    }
  
    axios
      .delete(`http://localhost:5557/farmer/${inquiryId}`, {
        headers: {
          Authorization: `Bearer ${userData.token}`, // Add the token to the header
        },
      })
      .then(() => {
        setLoading(false);
        enqueueSnackbar("Form deleted successfully", { variant: "success" });
        onDeleteSuccess();
      })
      .catch((error) => {
        setLoading(false);
        enqueueSnackbar("Error deleting form", { variant: "error" });
        console.log(error);
      });
  };
  
  const handleCancel = () => {
    onClose();
  };

  if (loading && !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-700">Loading form data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {!confirmDelete ? (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-red-600 py-4">
              <h1 className="text-center text-white text-3xl font-bold tracking-tight">
                Delete Form Submission
              </h1>
              <p className="text-center text-red-100 mt-2">
                Review the information before deleting
              </p>
            </div>
            
            <div className="pt-3 p-8">
              {formData && (
                <div className="space-y-6">
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="text-red-700 font-medium">
                        You are about to delete this form submission. This action cannot be undone.
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Personal Information
                      </h3>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Full Name</p>
                          <p className="text-base text-gray-900">{formData.fullname}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Email</p>
                          <p className="text-base text-gray-900">{formData.email}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Location</p>
                          <p className="text-base text-gray-900">{formData.location}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Contact Number</p>
                          <p className="text-base text-gray-900">{formData.contactNumber}</p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Plant Information
                      </h3>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Plant Name</p>
                          <p className="text-base text-gray-900">{formData.plantName}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Disease Name</p>
                          <p className="text-base text-gray-900">{formData.diseaseName}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2 mb-3 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Issue Description
                    </h3>
                    
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-800">{formData.issueDescription}</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-center space-x-4 mt-8">
                    <button
                      onClick={handleCancel}
                      className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium shadow-md hover:bg-gray-300 transition-all transform hover:scale-105"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => setConfirmDelete(true)}
                      className="px-6 py-2 rounded-lg bg-red-600 text-white font-medium shadow-md hover:bg-red-700 transition-all transform hover:scale-105"
                    >
                      Delete Form
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-8">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Confirm Deletion</h3>
                <p className="text-gray-600 mb-8">
                  Are you absolutely sure you want to delete this form submission? 
                  This action cannot be undone.
                </p>
                
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium shadow-md hover:bg-gray-300 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={loading}
                    className="px-6 py-2 rounded-lg bg-red-600 text-white font-medium shadow-md hover:bg-red-700 transition-all"
                  >
                    {loading ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Deleting...
                      </span>
                    ) : (
                      "Yes, Delete Form"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeleteSubmittedForm;