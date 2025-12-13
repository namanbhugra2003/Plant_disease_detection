import React, { useState, forwardRef  } from 'react';
import { motion } from 'framer-motion';
import { FaLeaf, FaFlask, FaMapMarkedAlt, FaStore, FaBook } from 'react-icons/fa';
import FeaturePopup from './FeaturePopup';

const FeatureCircle = ({ Icon, title, description, onClick }) => {
  return (
    <motion.div 
      className="flex flex-col items-center p-6 space-y-4 cursor-pointer"
      whileHover={{ scale: 1.05 }}
      onClick={onClick}
    >
      <motion.div 
        className="w-24 h-24 rounded-full bg-green-500 flex items-center justify-center"
        whileHover={{ backgroundColor: "#000000" }}
        transition={{ duration: 0.2 }}
      >
        <Icon className="text-white text-4xl" />
      </motion.div>
      <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      <p className="text-gray-600 text-center">{description}</p>
    </motion.div>
  );
};

const WhatWeOffer = forwardRef((props, ref) => {
  const [selectedFeature, setSelectedFeature] = useState(null);

  const features = [
    {
      icon: FaLeaf,
      title: "AI Detection",
      description: "Instantly identify plant diseases with our advanced AI technology."
    },
    {
      icon: FaFlask,
      title: "Smart Treatments",
      description: "Get personalized, eco-friendly treatment plans for your crops."
    },
    {
      icon: FaMapMarkedAlt,
      title: "Disease Mapping",
      description: "Visualize and track disease spread in your region."
    },
    {
      icon: FaStore,
      title: "AgriStore",
      description: "Access a curated selection of sustainable agricultural products."
    },
    {
      icon: FaBook,
      title: "Health Hub",
      description: "Learn from experts about plant health and disease prevention."
    }
  ];

  return (
    <section ref={ref} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">What We Offer</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
          {features.map((feature, index) => (
            <FeatureCircle 
              key={index}
              Icon={feature.icon}
              title={feature.title}
              description={feature.description}
              onClick={() => setSelectedFeature(feature)}
            />
          ))}
        </div>
      </div>
      {selectedFeature && (
        <FeaturePopup
          feature={selectedFeature}
          onClose={() => setSelectedFeature(null)}
        />
      )}
    </section>
  );
});

export default WhatWeOffer;