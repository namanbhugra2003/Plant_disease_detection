import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes, FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const FeaturePopup = ({ feature, onClose }) => {
  const getButtonText = (title) => {
    switch (title) {
      case "AI Detection":
        return "Detect Disease";
      case "Smart Treatments":
        return "Get Smart Treatments";
      case "Disease Mapping":
        return "View Disease Map";
      case "AgriStore":
        return "Visit AgriStore";
      case "Health Hub":
        return "Explore Health Hub";
      default:
        return "Learn More";
    }
  };

  const getButtonLink = (title) => {
    switch (title) {
      case "AI Detection":
        return "/detect-disease";
      case "Smart Treatments":
        return "/smart-treatments";
      case "Disease Mapping":
        return "/disease-map";
      case "AgriStore":
        return "/agri-store";
      case "Health Hub":
        return "/health-hub";
      default:
        return "/";
    }
  };

  const getKeyBenefits = (title) => {
    switch (title) {
      case "AI Detection":
        return [
          "Rapid disease identification",
          "Early detection of plant stress",
          "Customized treatment recommendations",
          "Reduced crop losses"
        ];
      case "Smart Treatments":
        return [
          "Targeted treatment plans",
          "Reduced pesticide usage",
          "Improved crop health",
          "Cost-effective solutions"
        ];
      case "Disease Mapping":
        return [
          "Real-time disease spread visualization",
          "Predictive outbreak modeling",
          "Regional risk assessment",
          "Collaborative data sharing"
        ];
      case "AgriStore":
        return [
          "Access to eco-friendly plant treatments",
          "Reduced reliance on harmful pesticides",
          "Expert-recommended products",
          "Cost savings on agricultural supplies"
        ];
        case "Health Hub":
            return [
              "Access to expert knowledge on plant health",
              "Learn about disease prevention and management",
              "Understand the effects of various pesticides",
              "Stay updated with latest agricultural practices"
            ]; 
      default:
        return [
          "Increased crop yield",
          "Sustainable farming practices",
          "Cost-effective agriculture",
          "Enhanced farm management"
        ];
    }
  };

  const BenefitCircle = ({ benefit }) => {
    return (
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="flex items-center space-x-3"
      >
        <motion.div
          initial={{ backgroundColor: "#4ade80" }}
          whileHover={{ backgroundColor: "#000000" }}
          transition={{ duration: 0.2 }}
          className="w-4 h-4 rounded-full flex-shrink-0"
        />
        <span>{benefit}</span>
      </motion.div>
    );
  };

  const getDidYouKnowFact = (title) => {
    // In a real-world scenario, you could fetch these facts from an API
    // For now, we'll use static facts that are more specific to each feature
    switch (title) {
      case "AI Detection":
        return "Our AI Detection system processes over 1 million plant images daily, continuously improving its accuracy.";
      case "Smart Treatments":
        return "Smart Treatments have contributed to a 35% reduction in overall pesticide use among our active users.";
      case "Disease Mapping":
        return "Our Disease Mapping feature has helped prevent crop losses worth $50 million in the last growing season.";
      case "AgriStore":
        return "AgriStore's eco-friendly products have helped reduce chemical pesticide usage by 40% among our customers.";
        case "Health Hub":
            return "Our Health Hub articles are read by over 100,000 farmers monthly, helping them make informed decisions about plant health management.";
      default:
        return "AgriGuard users report an average 25% increase in crop yield within the first year of adoption.";
    }
  };

  // Update feature descriptions and images
  const getUpdatedFeature = (feature) => {
    switch (feature.title) {
      case "AI Detection":
        return {
          ...feature,
          description: "Our advanced AI system quickly identifies plant diseases from images. Upload a photo of your plant, and get instant, accurate disease detection to take timely action.",
          image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        };
      case "Smart Treatments":
        return {
          ...feature,
          description: "Receive tailored treatment plans based on AI-detected diseases. Our system suggests eco-friendly solutions and precise application methods to effectively manage plant health.",
          image: "https://images.unsplash.com/photo-1574943320219-553eb213f72d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1632&q=80"
        };
      case "AgriStore":
        return {
          ...feature,
          description: "Access a curated selection of eco-friendly plant treatments and supplies. AgriStore helps you find effective, sustainable solutions to protect your crops while reducing reliance on harmful pesticides.",
          image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        };
      case "Disease Mapping":
        return {
          ...feature,
          image: "https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1474&q=80"
        };
      case "Health Hub":
        return {
          ...feature,
          description: "Access a wealth of agricultural knowledge shared by field experts. Learn about disease prevention, understand pesticide effects, and get valuable insights on plant health management.",
          image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80"
        };
      default:
        return feature;
    }
  };

  const updatedFeature = getUpdatedFeature(feature);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 500 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-5xl w-full mx-4 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors duration-300"
        >
          <FaTimes size={24} />
        </button>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <motion.h2 
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-4xl font-bold mb-4 text-green-600"
            >
              {updatedFeature.title}
            </motion.h2>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 mb-6 text-lg"
            >
              {updatedFeature.description}
            </motion.p>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-green-50 rounded-xl p-6 mb-6"
            >
              <h3 className="text-xl font-semibold mb-3 text-green-700">Key Benefits</h3>
              <ul className="list-none list-inside space-y-2 text-gray-700">
                {getKeyBenefits(updatedFeature.title).map((benefit, index) => (
                  <li key={index}>
                  <BenefitCircle benefit={benefit} />
                </li>
                ))}
              </ul>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                to={getButtonLink(updatedFeature.title)}
                className="inline-flex items-center bg-green-500 text-white font-semibold px-6 py-3 rounded-full hover:bg-green-600 transition duration-300"
              >
                {getButtonText(updatedFeature.title)} <FaArrowRight className="ml-2" />
              </Link>
            </motion.div>
          </div>
          
          <div className="md:w-1/2">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="relative h-96 rounded-2xl overflow-hidden shadow-lg"
            >
              <img 
                src={updatedFeature.image} 
                alt={updatedFeature.title} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-white text-xl font-semibold mb-2">Start using {updatedFeature.title} today</p>
                <p className="text-green-300">Join thousands of satisfied farmers</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 bg-gray-50 rounded-xl p-4"
            >
              <h3 className="text-lg font-semibold mb-2 text-gray-700">Did you know?</h3>
              <p className="text-gray-600">
                {getDidYouKnowFact(updatedFeature.title)}
              </p>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default FeaturePopup;