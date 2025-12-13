import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLeaf, FaShieldAlt, FaSeedling } from 'react-icons/fa';

const AgriStoreHeader = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const slides = [

    {
      title: 'Premium Fertilizers',
      description: 'Boost your crop yield with our high-quality fertilizers'
    },
    {
      title: 'Effective Pesticides',
      description: 'Protect your crops from harmful pests and diseases'
    },
    {
      title: 'Organic Solutions',
      description: 'Eco-friendly products for sustainable agriculture'
    }
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gradient-to-b from-green-800 to-green-600 py-6">
      <div className="container ml-auto mx-auto px-96">
        <h1 className="text-5xl mt-8 ml-20 font-bold text-white flex items-center">
                    <FaLeaf className="mr-2 text-white" />
                    Buy Materials
                  </h1>

        

        <div className="max-w-4xl mx-auto bg-transparent rounded-lg  overflow-hidden">
          <div className="p-8 h-48 flex flex-col justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <h2 className="text-xl font-bold text-white mb-2">{slides[currentSlide].title}</h2>
                <p className="text-xl text-green-100">{slides[currentSlide].description}</p>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgriStoreHeader;