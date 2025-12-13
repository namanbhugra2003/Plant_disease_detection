import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from "notistack";
import { MdOutlineHealthAndSafety, MdOutlineSpeed, MdOutlineTipsAndUpdates } from "react-icons/md";
import { BiLoaderCircle } from "react-icons/bi";
import { FaLeaf, FaVirus, FaThermometerHalf, FaCloudRain, FaHistory, FaShieldAlt, FaSeedling, FaDownload  } from 'react-icons/fa';
import { FaRedo } from 'react-icons/fa';
import { Page, Text, View, Document, StyleSheet, PDFDownloadLink, Image } from "@react-pdf/renderer";

// PDF styles
const styles = StyleSheet.create({
  page: { 
    padding: 30, 
    backgroundColor: '#f8faf8' 
  },
  header: { 
    fontSize: 12, 
    marginBottom: 10, 
    textAlign: "right", 
    color: '#4b5563' 
  },
  title: { 
    fontSize: 24, 
    marginBottom: 10, 
    textAlign: "center", 
    color: '#166534',
    fontWeight: 'bold'
  },
  subtitle: { 
    fontSize: 16, 
    marginBottom: 20, 
    textAlign: "center", 
    color: '#4b5563' 
  },
  section: { 
    marginBottom: 20, 
    padding: 15, 
    backgroundColor: 'white', 
    borderRadius: 8 
  },
  sectionTitle: { 
    fontSize: 16, 
    marginBottom: 10, 
    color: '#166534',
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 5
  },
  fieldContainer: {
    marginBottom: 10
  },
  fieldLabel: {
    fontSize: 12,
    color: '#4b5563',
    marginBottom: 2
  },
  fieldValue: {
    fontSize: 14,
    color: '#1f2937'
  },
  treatmentSection: {
    marginBottom: 15,
    padding: 10,
    borderLeftWidth: 4,
    borderLeftColor: '#16a34a',
    backgroundColor: '#f0fdf4',
    borderRadius: 4
  },
  treatmentTitle: {
    fontSize: 14,
    color: '#166534',
    marginBottom: 5,
    fontWeight: 'bold'
  },
  treatmentText: {
    fontSize: 12,
    color: '#374151'
  },
  footer: { 
    position: 'absolute', 
    bottom: 30, 
    left: 0, 
    right: 0, 
    textAlign: 'center', 
    color: '#4b5563', 
    paddingTop: 10, 
    borderTopWidth: 1, 
    borderColor: '#e5e7eb',
    fontSize: 10
  },
  logo: {
    width: 50,
    height: 50,
    alignSelf: 'center',
    marginBottom: 10
  }
});

// PDF Document component
const TreatmentReportPDF = ({ formData, treatment }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <Text style={styles.header}>Generated on: {new Date().toLocaleString()}</Text>
      
      {/* Title */}
      <Text style={styles.title}>Plant Disease Treatment Report</Text>
      <Text style={styles.subtitle}>AI-Generated Treatment Recommendations</Text>
      
      {/* Plant & Disease Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Plant & Disease Information</Text>
        
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Plant Name:</Text>
          <Text style={styles.fieldValue}>{formData.plantName}</Text>
        </View>
        
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Detected Disease:</Text>
          <Text style={styles.fieldValue}>{formData.detectedDisease}</Text>
        </View>
        
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Affected Parts:</Text>
          <Text style={styles.fieldValue}>{formData.affectedParts || "Not specified"}</Text>
        </View>
        
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Severity Level:</Text>
          <Text style={styles.fieldValue}>{formData.severityLevel}</Text>
        </View>
        
        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Spread Rate:</Text>
          <Text style={styles.fieldValue}>{formData.spreadRate}</Text>
        </View>
      </View>
      
      {/* Disease Explanation */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Disease Explanation</Text>
        <Text style={styles.treatmentText}>{treatment.disease_explanation}</Text>
      </View>
      
      {/* Treatment Recommendations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Treatment Recommendations</Text>
        
        {treatment.treatment_recommendations.organic && (
          <View style={styles.treatmentSection}>
            <Text style={styles.treatmentTitle}>Organic Treatment</Text>
            <Text style={styles.treatmentText}>{treatment.treatment_recommendations.organic}</Text>
          </View>
        )}
        
        {treatment.treatment_recommendations.chemical && (
          <View style={styles.treatmentSection}>
            <Text style={styles.treatmentTitle}>Chemical Treatment</Text>
            <Text style={styles.treatmentText}>{treatment.treatment_recommendations.chemical}</Text>
          </View>
        )}
        
        {treatment.treatment_recommendations.both && (
          <View style={styles.treatmentSection}>
            <Text style={styles.treatmentTitle}>Combined Approach</Text>
            <Text style={styles.treatmentText}>{treatment.treatment_recommendations.both}</Text>
          </View>
        )}
      </View>
      
      {/* Preventive Measures */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preventive Measures</Text>
        <Text style={styles.treatmentText}>{treatment.preventive_measures}</Text>
      </View>
      
      {/* Recovery Practices */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Best Recovery Practices</Text>
        <Text style={styles.treatmentText}>{treatment.best_recovery_practices}</Text>
      </View>
      
      {/* Expert Advice */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Expert Advice</Text>
        <Text style={styles.treatmentText}>{treatment.expert_advice}</Text>
      </View>
      
      {/* Footer */}
      <Text style={styles.footer}>© {new Date().getFullYear()} SMART AGRIGUARD. All rights reserved.</Text>
    </Page>
  </Document>

      );

const AiTreatmentForm = () => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [treatment, setTreatment] = useState(null);
  
  const [formData, setFormData] = useState({
    plantName: "",
    detectedDisease: "",
    observedSymptoms: "",
    affectedParts: "",
    severityLevel: "Medium",
    spreadRate: "Moderate",
    weatherConditions: "",
    preferredTreatmentType: "Both",
    previousDiseaseHistory: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.plantName || !formData.detectedDisease || !formData.observedSymptoms) {
      enqueueSnackbar("Please fill in all required fields", { variant: "error" });
      return;
    }
    
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5557/ai/treatment", formData);
      setTreatment(response.data.treatment);
      enqueueSnackbar("Treatment recommendation generated successfully!", { variant: "success" });
      setLoading(false);
    } catch (error) {
      console.error("Error fetching treatment:", error);
      enqueueSnackbar("Failed to generate treatment recommendation", { variant: "error" });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed" 
    style={{ 
      backgroundImage: "url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
      backgroundColor: "rgba(243, 244, 246, 0.85)",
      backgroundBlendMode: "overlay"
    }}>
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="h-20 w-20 rounded-full bg-green-100 flex items-center justify-center">
              <FaLeaf className="h-10 w-10 text-green-600" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            AI Plant Treatment
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Get personalized treatment recommendations for your plant diseases using advanced AI technology
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Form Section */}
          <div className="lg:w-1/2">
            <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4">
                <h2 className="text-xl font-bold text-white">Disease Information</h2>
                <p className="text-green-100">Fill in the details about your plant's condition</p>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FaLeaf className="mr-2 text-green-500" />
                      Plant Name <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="plantName"
                      value={formData.plantName}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="e.g., Rice, Tomato, Potato"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FaVirus className="mr-2 text-green-500" />
                      Detected Disease <span className="text-red-500 ml-1">*</span>
                    </label>
                    <input
                      type="text"
                      name="detectedDisease"
                      value={formData.detectedDisease}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="e.g., Leaf Blight, Powdery Mildew"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <MdOutlineHealthAndSafety className="mr-2 text-green-500" />
                      Observed Symptoms <span className="text-red-500 ml-1">*</span>
                    </label>
                    <textarea
                      name="observedSymptoms"
                      value={formData.observedSymptoms}
                      onChange={handleChange}
                      rows="3"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Describe the symptoms you've observed..."
                      required
                    ></textarea>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Affected Parts
                    </label>
                    <select
                      name="affectedParts"
                      value={formData.affectedParts}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    >
                      <option value="">Select affected parts</option>
                      <option value="Leaves">Leaves</option>
                      <option value="Stem">Stem</option>
                      <option value="Roots">Roots</option>
                      <option value="Fruits">Fruits</option>
                      <option value="Flowers">Flowers</option>
                      <option value="Whole Plant">Whole Plant</option>
                      <option value="Multiple Parts">Multiple Parts</option>
                    </select>
                  </div>
                </div>
                
                {/* Additional Information */}
                <div className="pt-4 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaThermometerHalf className="mr-2 text-green-500" />
                        Severity Level
                      </label>
                      <select
                        name="severityLevel"
                        value={formData.severityLevel}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                        <option value="Severe">Severe</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <MdOutlineSpeed className="mr-2 text-green-500" />
                        Spread Rate
                      </label>
                      <select
                        name="spreadRate"
                        value={formData.spreadRate}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      >
                        <option value="Slow">Slow</option>
                        <option value="Moderate">Moderate</option>
                        <option value="Fast">Fast</option>
                        <option value="Very Fast">Very Fast</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <FaCloudRain className="mr-2 text-green-500" />
                        Weather Conditions
                      </label>
                      <input
                        type="text"
                        name="weatherConditions"
                        value={formData.weatherConditions}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                        placeholder="e.g., Rainy, Hot and Humid"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                        <MdOutlineTipsAndUpdates className="mr-2 text-green-500" />
                        Preferred Treatment
                      </label>
                      <select
                        name="preferredTreatmentType"
                        value={formData.preferredTreatmentType}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      >
                        <option value="Organic">Organic</option>
                        <option value="Chemical">Chemical</option>
                        <option value="Both">Both</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center">
                      <FaHistory className="mr-2 text-green-500" />
                      Previous Disease History
                    </label>
                    <textarea
                      name="previousDiseaseHistory"
                      value={formData.previousDiseaseHistory}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                      placeholder="Any previous disease history of this plant..."
                    ></textarea>
                  </div>
                </div>
                
                <div className="pt-5">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white ${
                      loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
                    } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200`}
                  >
                    {loading ? (
                      <>
                        <BiLoaderCircle className="animate-spin mr-2" />
                        Generating Treatment...
                      </>
                    ) : (
                      "Get Treatment Recommendation"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          {/* Results Section */}
          <div className="lg:w-1/2">
            {treatment ? (
              <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4">
                  <h2 className="text-xl font-bold text-white">Treatment Recommendation</h2>
                  <p className="text-green-100">AI-generated treatment plan for your plant</p>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Disease Explanation */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                        <FaVirus className="h-4 w-4 text-green-600" />
                      </div>
                      Disease Explanation
                    </h3>
                    <div className="mt-2 p-4 bg-green-50 rounded-lg">
                      <p className="text-gray-700">{treatment.disease_explanation}</p>
                    </div>
                  </div>
                  
                                  {/* Treatment Recommendations */}
                                  <div>
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                        <MdOutlineHealthAndSafety className="h-4 w-4 text-green-600" />
                      </div>
                      Treatment Recommendations
                    </h3>
                    
                    <div className="mt-3 space-y-4">
                      {treatment.treatment_recommendations.organic && (
                        <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                          <h4 className="font-medium text-green-700 mb-2">Organic Treatment</h4>
                          <p className="text-gray-700">{treatment.treatment_recommendations.organic}</p>
                        </div>
                      )}
                      
                      {treatment.treatment_recommendations.chemical && (
                        <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                          <h4 className="font-medium text-blue-700 mb-2">Chemical Treatment</h4>
                          <p className="text-gray-700">{treatment.treatment_recommendations.chemical}</p>
                        </div>
                      )}
                      
                      {treatment.treatment_recommendations.both && (
                        <div className="p-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                          <h4 className="font-medium text-purple-700 mb-2">Combined Approach</h4>
                          <p className="text-gray-700">{treatment.treatment_recommendations.both}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Preventive Measures */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                        <FaShieldAlt className="h-4 w-4 text-green-600" />
                      </div>
                      Preventive Measures
                    </h3>
                    <div className="mt-2 p-4 bg-green-50 rounded-lg">
                      <p className="text-gray-700">{treatment.preventive_measures}</p>
                    </div>
                  </div>
                  
                  {/* Recovery Practices */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                        <FaSeedling className="h-4 w-4 text-green-600" />
                      </div>
                      Best Recovery Practices
                    </h3>
                    <div className="mt-2 p-4 bg-green-50 rounded-lg">
                      <p className="text-gray-700">{treatment.best_recovery_practices}</p>
                    </div>
                  </div>
                  
                  {/* Expert Advice */}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 flex items-center">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-2">
                        <MdOutlineTipsAndUpdates className="h-4 w-4 text-green-600" />
                      </div>
                      Expert Advice
                    </h3>
                    <div className="mt-2 p-4 bg-green-50 rounded-lg">
                      <p className="text-gray-700">{treatment.expert_advice}</p>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="pt-4 border-t border-gray-200 flex flex-wrap gap-4">
                    <PDFDownloadLink
                      document={<TreatmentReportPDF formData={formData} treatment={treatment} />}
                      fileName={`${formData.plantName}_Treatment_Report.pdf`}
                      className="flex-1"
                    >
                      {({ blob, url, loading, error }) => (
                        <button
                          className={`w-full flex justify-center items-center py-3 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white ${
                            loading ? "bg-green-400" : "bg-green-600 hover:bg-green-700"
                          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200`}
                          disabled={loading}
                        >
                          <FaDownload className="mr-2" />
                          {loading ? "Preparing PDF..." : "Download Report"}
                        </button>
                      )}
                    </PDFDownloadLink>
                    
                    <button
                      onClick={() => {
                        setTreatment(null);
                        setFormData({
                          plantName: "",
                          detectedDisease: "",
                          observedSymptoms: "",
                          affectedParts: "",
                          severityLevel: "Medium",
                          spreadRate: "Moderate",
                          weatherConditions: "",
                          preferredTreatmentType: "Both",
                          previousDiseaseHistory: "",
                        });
                      }}
                      className="flex-1 flex justify-center items-center py-3 px-6 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
                    >
                      <FaRedo className="mr-2" />
                      Start New Analysis
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white shadow-xl rounded-2xl overflow-hidden h-full">
                <div className="bg-gradient-to-r from-green-600 to-green-500 px-6 py-4">
                  <h2 className="text-xl font-bold text-white">Treatment Results</h2>
                  <p className="text-green-100">Your AI-generated recommendations will appear here</p>
                </div>
                
                <div className="p-6 flex flex-col items-center justify-center h-[500px] text-center">
                  <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-6">
                    <FaLeaf className="h-12 w-12 text-green-500" />
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No Treatment Generated Yet</h3>
                  <p className="text-gray-500 max-w-md mb-8">
                    Fill out the form with details about your plant's condition to receive AI-powered treatment recommendations.
                  </p>
                  
                  <div className="space-y-4 w-full max-w-md">
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <span className="text-green-600 font-bold">1</span>
                      </div>
                      <p className="text-gray-700 text-left">Enter plant and disease information</p>
                    </div>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <span className="text-green-600 font-bold">2</span>
                      </div>
                      <p className="text-gray-700 text-left">Provide additional details about the condition</p>
                    </div>
                    <div className="flex items-center">
                      <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <span className="text-green-600 font-bold">3</span>
                      </div>
                      <p className="text-gray-700 text-left">Get personalized treatment recommendations</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiTreatmentForm;