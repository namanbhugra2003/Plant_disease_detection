import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaTimes, FaCalendar, FaLeaf, FaVirus, FaFileAlt, FaDownload } from 'react-icons/fa';
import axios from 'axios';
import { PDFDownloadLink, Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// PDF styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#f0fdf4',
    fontFamily: 'Helvetica',
  },
  header: {
    fontSize: 10,
    marginBottom: 8,
    textAlign: "right",
    color: '#4b5563',
  },
  logo: {
    width: 60,
    height: 60,
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    marginBottom: 22,
    textAlign: "center",
    color: '#166534',
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  section: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    border: '1 solid #d1fae5',
  },
  sectionTitle: {
    fontSize: 16,
    marginBottom: 14,
    color: '#065f46',
    fontWeight: 'bold',
    borderBottom: '1 solid #d1d5db',
    paddingBottom: 5,
  },
  fieldContainer: {
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 11,
    color: '#374151',
    fontWeight: 'bold',
    marginBottom: 2,
  },
  fieldValue: {
    fontSize: 13,
    color: '#111827',
    paddingLeft: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#6b7280',
    fontSize: 9,
    borderTopWidth: 1,
    borderColor: '#e5e7eb',
    paddingTop: 8,
  }
});

// Enhanced PDF Document component
const InquiryReportPDF = ({ inquiry }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.header}>Generated on: {new Date().toLocaleString()}</Text>
      <Text style={styles.title}>Inquiry Report</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inquiry Details</Text>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Plant Name</Text>
          <Text style={styles.fieldValue}>{inquiry.plantName}</Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Disease Name</Text>
          <Text style={styles.fieldValue}>{inquiry.diseaseName}</Text>
        </View>

        <View style={styles.fieldContainer}>
          <Text style={styles.fieldLabel}>Manager's Response</Text>
          <Text style={styles.fieldValue}>{inquiry.reply}</Text>
        </View>
      </View>

      <Text style={styles.footer}>© {new Date().getFullYear()} SMART AGRIGUARD. Confidential Report. All rights reserved.</Text>
    </Page>
  </Document>
);


const ManagerResponses = () => {
  const [inquiries, setInquiries] = useState([]);
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInquiries();
  }, []);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.token;

      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      const res = await axios.get('http://localhost:5557/farmer', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const inquiriesData = res.data.data || [];
      const inquiriesWithResponse = inquiriesData.filter(inquiry => inquiry.reply && inquiry.reply.trim() !== '');
      setInquiries(inquiriesWithResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        backgroundColor: "rgba(243, 244, 246, 1.2)",
        backgroundBlendMode: "overlay"
      }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto px-4 py-14 "
      >
        <h1 className="text-3xl font-bold text-gray-800 mb-12">Manager Responses</h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div>Loading...</div>
          ) : (
            inquiries.map((inquiry, index) => (
              <motion.div
                key={inquiry._id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className="h-48 bg-green-100 relative">
                  <img
                    src={index === 0 
                      ? 'https://thumbs.dreamstime.com/b/tomato-plant-disease-greenhouse-74286976.jpg?w=768' 
                      : 'https://thumbs.dreamstime.com/b/roses-petal-damage-plant-disease-roses-petal-damage-plant-disease-high-quality-photo-ai-generated-363975468.jpg?w=992'}
                    alt={inquiry.plantName}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                    <h2 className="text-2xl font-bold text-white">{inquiry.plantName}</h2>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 mb-4">Disease: {inquiry.diseaseName}</p>
                  <p className="text-gray-500 mb-4 flex items-center">
                    <FaCalendar className="mr-2" />
                    {new Date(inquiry.requestDate).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700 mb-4 line-clamp-3">{inquiry.reply}</p>
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => setSelectedInquiry(inquiry)}
                      className="flex items-center text-green-600 hover:text-green-800 transition-colors duration-300"
                    >
                      <FaEye className="mr-2" />
                      View Full Details
                    </button>
                    <PDFDownloadLink
                      document={<InquiryReportPDF inquiry={inquiry} />}
                      fileName="Inquiry_Report.pdf"
                      className="flex items-center text-blue-600 hover:text-blue-800 transition-colors duration-300"
                    >
                      <FaDownload className="mr-2" />
                      Download Report
                    </PDFDownloadLink>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
        {selectedInquiry && (
          <InquiryDetailsPopup
            inquiry={selectedInquiry}
            onClose={() => setSelectedInquiry(null)}
          />
        )}
      </motion.div>
    </div>
  );
};

const InquiryDetailsPopup = ({ inquiry, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center p-4 z-50 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="bg-white rounded-xl shadow-2xl overflow-hidden max-w-4xl w-full"
      >
        <div className="flex flex-col md:flex-row">
          <div className="md:w-2/5 bg-green-100">
            <img
              src={inquiry.diseaseName === 'Early Blight' 
                ? 'https://thumbs.dreamstime.com/b/roses-petal-damage-plant-disease-roses-petal-damage-plant-disease-high-quality-photo-ai-generated-363975468.jpg?w=992' 
                : 'https://thumbs.dreamstime.com/b/tomato-plant-disease-greenhouse-74286976.jpg?w=768'}
              alt={inquiry.plantName}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="md:w-3/5 p-8 relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FaTimes size={24} />
            </button>
            <h2 className="text-3xl font-bold text-green-600 mb-6">{inquiry.plantName}</h2>
            <div className="space-y-4 mb-6">
              <DetailItem icon={FaVirus} label="Disease" value={inquiry.diseaseName} />
              <DetailItem
                icon={FaCalendar}
                label="Responded on"
                value={new Date(inquiry.updatedAt).toLocaleDateString()}
              />
              <DetailItem icon={FaLeaf} label="Status" value="Resolved" />
            </div>
            <div className="mt-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-2">Manager's Response</h3>
              <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">{inquiry.reply}</p>
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

export default ManagerResponses;