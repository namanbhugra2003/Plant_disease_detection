import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLeaf, FaArrowDown, FaCamera, FaCloudUploadAlt, FaRobot, FaBullhorn, FaRedo } from 'react-icons/fa';
import axios from 'axios';
import LogingNavBar from '../components/LogingNavBar';

const HomeAfterLogin = () => {
  const scanRef = useRef(null);
  const [showScanModal, setShowScanModal] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scanCount, setScanCount] = useState(0);

  const scrollToScan = () => {
    scanRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get('http://localhost:5557/materials');
        setMaterials(response.data.data);
      } catch (error) {
        console.error('Error fetching materials:', error);
      }
    };
    fetchMaterials();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
    setPrediction(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    if (scanCount === 0) {
      // First scan: local model
      const formData = new FormData();
      formData.append('file', image);
      try {
        const response = await axios.post(
          'http://localhost:5000/predict',
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        setPrediction(response.data.predicted_label);
        setScanCount(1);
      } catch (error) {
        console.error('Error uploading image to local model:', error);
        setPrediction('Error');
      }
    } else {
      // Retry: external API
      const reader = new FileReader();
      reader.readAsDataURL(image);
      reader.onloadend = async () => {
        const base64Image = reader.result.split(',')[1];
        try {
          const response = await axios.post(
            'https://crop.kindwise.com/api/v1/identification',
            { images: [base64Image] },
            {
              headers: {
                'Content-Type': 'application/json',
                'Api-Key': 'w9dI5ltIik0SAYqj4soymqYV2zMsiY6VsqxnpMhlXWS1OjcSSj'
              }
            }
          );
          const topSuggestion = response.data.result.disease.suggestions[0];
          setPrediction(topSuggestion.name);
        } catch (error) {
          console.error('Retry API failed:', error);
          setPrediction('Error');
        }
      };
    }
    setLoading(false);
    setShowScanModal(false);
  };

  const handleRetry = () => {
    setImage(null);
    setPrediction(null);
    setShowScanModal(true);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
      }}
    >
      <LogingNavBar />
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="absolute top-0 left-8 text-white font-bold text-4xl"
      ></motion.div>

      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="absolute top-16 right-8 bg-yellow-400 text-black p-3 rounded-lg shadow-lg max-w-xs"
      >
        <h3 className="text-sm font-bold mb-1 flex items-center">
          <FaBullhorn className="mr-2" /> New Feature
        </h3>
        <p className="text-xs">Advanced disease prediction model now available!</p>
      </motion.div>

      <div className="relative z-10 flex flex-col items-center justify-center h-screen text-white">
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl font-bold mb-8 text-center"
        >
          Identify Plant Diseases
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-xl mb-8 text-center max-w-2xl"
        >
          Harness the power of AI to protect your crops. Quick, accurate, and easy-to-use plant disease detection at your fingertips.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToScan}
          className="bg-green-500 text-white px-8 py-4 rounded-full text-xl font-semibold hover:bg-green-600 transition duration-300 flex items-center"
        >
          <FaLeaf className="mr-2" /> Scan Disease
        </motion.button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-8"
        >
          <FaArrowDown className="text-4xl animate-bounce" />
        </motion.div>
      </div>

      <div ref={scanRef} className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-7xl"
        >
          <h2 className="text-4xl font-bold mb-8 text-center text-green-600">AI Scan Your Plant</h2>

          <div className="flex items-center justify-center mb-8">
            <motion.div
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowScanModal(true)}
              className="w-64 h-64 bg-green-100 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
            >
              <FaCamera className="text-6xl text-green-500" />
            </motion.div>
          </div>

          <p className="text-center text-gray-600 mb-12">
            Click on the circle above or drag and drop your plant image here to start AI scanning.
          </p>

          {/* Display AI prediction result here */}
          {prediction && (
            <div className="text-center mt-4 text-2xl text-red-600 font-semibold">
              Predicted Disease: {prediction}
              <button onClick={handleRetry} className="ml-4 text-blue-500 hover:underline">
                <FaRedo className="inline mr-1" /> Retry
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 mt-12">
            {[
              { icon: FaCamera, title: 'Quick Detection', description: 'Instant results with our advanced image recognition.' },
              { icon: FaRobot, title: 'AI-Powered Analysis', description: 'Cutting-edge AI algorithms for accurate diagnosis.' },
              { icon: FaLeaf, title: 'Treatment Recommendations', description: 'Get tailored advice to treat plant diseases effectively.' }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index, duration: 0.5 }}
                className="bg-green-50 p-6 rounded-xl text-center shadow-md"
              >
                <feature.icon className="text-4xl text-green-500 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-2 text-green-700">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-green-600">Featured Plant Medicines</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {materials.slice(0, 4).map((material, index) => (
              <motion.div
                key={material._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col items-center"
              >
                <div className="w-full bg-green-100 flex items-center justify-center p-4">
                  <img
                    src={material.image || 'https://via.placeholder.com/100x100'}
                    alt={material.materialName}
                    className="w-32 h-32 object-cover rounded-full"
                  />
                </div>
                <div className="w-full p-6 text-center">
                  <h3 className="text-2xl font-semibold mb-2 text-green-700">{material.materialName}</h3>
                  <p className="text-gray-600 mb-1 mt-10 text-md">Category: {material.category}</p>
                  <p className="text-gray-600 mb-7 text-md">Usage: {material.diseaseUsage}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">${material.pricePerUnit}</span>
                    <button className="bg-green-500 text-white mb-5 px-4 py-2 rounded-full text-sm hover:bg-green-600 transition duration-300">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-transparent border-2 border-green-600 text-green-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-600 hover:text-white transition duration-300"
            >
              Explore All Medicines
            </motion.button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showScanModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowScanModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, rotateY: 90 }}
              animate={{ scale: 1, rotateY: 0 }}
              exit={{ scale: 0.8, rotateY: 90 }}
              transition={{ type: 'spring', damping: 15 }}
              className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-4 text-green-600">Scan Your Plant</h3>
              <p className="text-gray-600 mb-6">Choose a method to upload your plant image for analysis</p>
              <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <input type="file" onChange={handleImageChange} className="mb-4" />
                {image && (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Selected"
                    className="w-32 h-32 object-cover rounded-full mb-4"
                  />
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center mb-4"
                >
                  {loading ? 'Processing...' : <><FaCloudUploadAlt className="mr-2" /> Upload Image</>}
                </motion.button>
                {prediction !== null && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRetry}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <FaRedo className="mr-2" /> Retry
                  </motion.button>
                )}
              </form>
              {prediction !== null && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-green-600">Prediction: {prediction}</h3>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomeAfterLogin;