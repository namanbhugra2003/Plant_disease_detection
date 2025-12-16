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
        const response = await axios.get('https://plant-disease-detection-5ysx.onrender.com/materials');
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

    // First scan: YOUR backend (Hugging Face)
    const formData = new FormData();
    formData.append('image', image); // ✅ FIX 1: correct field name

    try {
      const response = await axios.post(
        'https://plant-disease-detection-5ysx.onrender.com/predict',
        formData // ✅ FIX 3: no manual headers
      );

      setPrediction(response.data.disease); // ✅ FIX 2: correct response field
      setScanCount(1);
    } catch (error) {
      console.error('Error uploading image:', error);
      setPrediction('Error');
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
          "url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=2070&q=80')"
      }}
    >
      <LogingNavBar />
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

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
          Harness the power of AI to protect your crops.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToScan}
          className="bg-green-500 text-white px-8 py-4 rounded-full text-xl font-semibold flex items-center"
        >
          <FaLeaf className="mr-2" /> Scan Disease
        </motion.button>

        <motion.div className="absolute bottom-8">
          <FaArrowDown className="text-4xl animate-bounce" />
        </motion.div>
      </div>

      <div ref={scanRef} className="min-h-screen bg-gray-100 flex items-center justify-center p-8">
        <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-7xl">
          <h2 className="text-4xl font-bold mb-8 text-center text-green-600">
            AI Scan Your Plant
          </h2>

          <div className="flex items-center justify-center mb-8">
            <div
              onClick={() => setShowScanModal(true)}
              className="w-64 h-64 bg-green-100 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
            >
              <FaCamera className="text-6xl text-green-500" />
            </div>
          </div>

          <p className="text-center text-gray-600 mb-12">
            Click on the circle above or upload your plant image.
          </p>

          {prediction && (
            <div className="text-center mt-4 text-2xl text-red-600 font-semibold">
              Predicted Disease: {prediction}
              <button onClick={handleRetry} className="ml-4 text-blue-500 hover:underline">
                <FaRedo className="inline mr-1" /> Retry
              </button>
            </div>
          )}
          {/* Feature cards */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
  {[
    {
      icon: FaCamera,
      title: 'Quick Detection',
      description: 'Instant disease detection from plant images.'
    },
    {
      icon: FaRobot,
      title: 'AI Powered Analysis',
      description: 'Accurate prediction using AI models.'
    },
    {
      icon: FaLeaf,
      title: 'Treatment Suggestions',
      description: 'Actionable treatment recommendations.'
    }
  ].map((feature, index) => (
    <motion.div
      key={index}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="bg-green-50 p-6 rounded-xl text-center shadow-md"
    >
      <feature.icon className="text-4xl text-green-500 mb-4 mx-auto" />
      <h3 className="text-xl font-semibold mb-2 text-green-700">
        {feature.title}
      </h3>
      <p className="text-gray-600">{feature.description}</p>
    </motion.div>
  ))}
</div>

        </div>
      </div>
      {/* Featured Plant Medicines */}
<div className="bg-gray-100 py-16">
  <div className="container mx-auto px-4">
    <h2 className="text-4xl font-bold text-center mb-12 text-green-600">
      Featured Plant Medicines
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto">
      {materials.slice(0, 4).map((material, index) => (
        <motion.div
          key={material._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-lg shadow-md overflow-hidden text-center"
        >
          <div className="bg-green-100 p-4 flex justify-center">
            <img
              src={material.image || 'https://via.placeholder.com/100'}
              alt={material.materialName}
              className="w-32 h-32 rounded-full object-cover"
            />
          </div>

          <div className="p-6">
            <h3 className="text-xl font-semibold text-green-700 mb-2">
              {material.materialName}
            </h3>
            <p className="text-gray-600">Category: {material.category}</p>
            <p className="text-gray-600 mb-4">
              Usage: {material.diseaseUsage}
            </p>
            <span className="font-bold text-green-600">
              ${material.pricePerUnit}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
</div>


      <AnimatePresence>
        {showScanModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={() => setShowScanModal(false)}
          >
            <motion.div
              className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold mb-4 text-green-600">Scan Your Plant</h3>

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
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
                >
                  <FaCloudUploadAlt className="mr-2" />
                  {loading ? 'Processing...' : 'Upload Image'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomeAfterLogin;
