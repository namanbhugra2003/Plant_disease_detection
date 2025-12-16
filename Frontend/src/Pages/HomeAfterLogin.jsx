import React, { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaLeaf,
  FaArrowDown,
  FaCamera,
  FaCloudUploadAlt,
  FaRobot,
  FaBullhorn,
  FaRedo,
} from "react-icons/fa";
import axios from "axios";
import LogingNavBar from "../components/LogingNavBar";

const HomeAfterLogin = () => {
  const scanRef = useRef(null);
  const [showScanModal, setShowScanModal] = useState(false);
  const [materials, setMaterials] = useState([]);
  const [image, setImage] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  const scrollToScan = () => {
    scanRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get(
          "https://plant-disease-detection-5ysx.onrender.com/materials"
        );
        setMaterials(response.data.data);
      } catch (error) {
        console.error("Error fetching materials:", error);
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

    const formData = new FormData();
    formData.append("image", image); // ✅ IMPORTANT

    try {
      const response = await axios.post(
        "https://plant-disease-detection-5ysx.onrender.com/predict",
        formData
      );

      setPrediction(response.data.disease); // ✅ IMPORTANT
    } catch (error) {
      console.error("Prediction error:", error);
      setPrediction("Error");
    } finally {
      setLoading(false);
      setShowScanModal(false);
    }
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
          "url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2')",
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
          AI-powered plant disease detection with instant results.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={scrollToScan}
          className="bg-green-500 px-8 py-4 rounded-full text-xl font-semibold flex items-center"
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

          <div className="flex justify-center mb-8">
            <div
              onClick={() => setShowScanModal(true)}
              className="w-64 h-64 bg-green-100 rounded-full flex items-center justify-center cursor-pointer shadow-lg"
            >
              <FaCamera className="text-6xl text-green-500" />
            </div>
          </div>

          {prediction && (
            <div className="text-center text-2xl text-red-600 font-semibold">
              Predicted Disease: {prediction}
              <button onClick={handleRetry} className="ml-4 text-blue-500">
                <FaRedo className="inline mr-1" /> Retry
              </button>
            </div>
          )}
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
              <h3 className="text-2xl font-bold mb-4 text-green-600">
                Scan Your Plant
              </h3>

              <form onSubmit={handleSubmit}>
                <input type="file" onChange={handleImageChange} className="mb-4" />

                {image && (
                  <img
                    src={URL.createObjectURL(image)}
                    alt="Preview"
                    className="w-32 h-32 rounded-full mx-auto mb-4"
                  />
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center mx-auto"
                >
                  <FaCloudUploadAlt className="mr-2" />
                  {loading ? "Processing..." : "Upload Image"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HomeAfterLogin;
