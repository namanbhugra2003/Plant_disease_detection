import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaImage, FaVideo, FaLink, FaUpload, FaTrash, FaBold, FaItalic, FaUnderline, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';

const ArticleCreation = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [link, setLink] = useState('');
  const [imagePreview, setImagePreview] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [showLargeImage, setShowLargeImage] = useState(false);
  const [showLargeVideo, setShowLargeVideo] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [formErrors, setFormErrors] = useState({});
  const [fileUploadProgress, setFileUploadProgress] = useState(0);

  const contentRef = useRef(null);

  useEffect(() => {
    const words = content.trim().split(/\s+/);
    setWordCount(words.length);
  }, [content]);

  const clearForm = () => {
    setTitle('');
    setContent('');
    setImage(null);
    setVideo(null);
    setLink('');
    setImagePreview(null);
    setVideoPreview(null);
    setUploadProgress(0);
    setPublishError(null);
    setFormErrors({});
    setFileUploadProgress(0);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadstart = () => setFileUploadProgress(0);
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setFileUploadProgress(Math.round(progress));
        }
      };
      reader.onloadend = () => {
        setImage(reader.result);
        setImagePreview(reader.result);
        setFileUploadProgress(100);
        setTimeout(() => setFileUploadProgress(0), 1000); // Reset progress after 1 second
      };
      reader.readAsDataURL(file);
    } else {
      setImage(null);
      setImagePreview(null);
    }
  };

  

  const handleVideoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadstart = () => setFileUploadProgress(0);
      reader.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = (event.loaded / event.total) * 100;
          setFileUploadProgress(Math.round(progress));
        }
      };
      reader.onloadend = () => {
        setVideo(reader.result);
        setVideoPreview(URL.createObjectURL(file));
        setFileUploadProgress(100);
        setTimeout(() => setFileUploadProgress(0), 1000); // Reset progress after 1 second
      };
      reader.readAsDataURL(file);
    } else {
      setVideo(null);
      setVideoPreview(null);
    }
  };

  const removeFile = (type) => {
    if (type === 'image') {
      setImage(null);
      setImagePreview(null);
    } else {
      setVideo(null);
      setVideoPreview(null);
    }
  };

  const handleTextFormat = (command) => {
    document.execCommand(command, false, null);
    contentRef.current.focus();
  };

  const validateForm = () => {
  const errors = {};
  if (!title.trim()) errors.title = "Title is required";
  else if (title.trim().length < 5) errors.title = "Title must be at least 5 characters";
  else if (title.trim().length > 100) errors.title = "Title must be less than 100 characters";
  if (wordCount < 20) errors.content = "Content must be at least 20 words";
  setFormErrors(errors);
  return Object.keys(errors).length === 0;
};

  const handlePublish = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
  
    setIsPublishing(true);
    setPublishError(null);
    setUploadProgress(0);
    
    const articleData = {
      title,
      content,
      link,
      image,
      video
    };
  
    try {
      const response = await axios.post('http://localhost:5557/api/articles', articleData, {
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        },
        timeout: 30000 // Set a timeout of 30 seconds
      });
  
      console.log('Article published:', response.data);
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
        onClose();
        clearForm();
      }, 3000);
    } catch (error) {
      console.error('Error publishing article:', error);
      let errorMessage = 'Failed to publish article. Please try again.';
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      } else if (error.request) {
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        errorMessage = error.message;
      }
      setPublishError(errorMessage);
    } finally {
      setIsPublishing(false);
    }
  };
  
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-lg p-8 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Create New Article</h2>
                <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                  <FaTimes size={24} />
                </button>
              </div>
              <form onSubmit={handlePublish}>
                <input
  type="text"
  placeholder="Article Title"
  className={`w-full p-2 mb-2 border rounded ${formErrors.title ? 'border-red-500' : ''}`}
  value={title}
  onChange={(e) => setTitle(e.target.value)}
  required
/>
{formErrors.title && <p className="text-red-500 text-sm mb-2">{formErrors.title}</p>}
{title.length > 0 && title.length < 5 && (
  <p className="text-red-500 text-sm mb-2">{5 - title.length} more characters needed</p>
)}
                <div className="mb-2 flex space-x-2">
                  <button type="button" onClick={() => handleTextFormat('bold')} className="p-1 border rounded">
                    <FaBold />
                  </button>
                  <button type="button" onClick={() => handleTextFormat('italic')} className="p-1 border rounded">
                    <FaItalic />
                  </button>
                  <button type="button" onClick={() => handleTextFormat('underline')} className="p-1 border rounded">
                    <FaUnderline />
                  </button>
                </div>
                <div className="relative">
                  <div
                    ref={contentRef}
                    contentEditable
                     className={`w-full p-2 mb-2 border rounded min-h-[200px] ${formErrors.content ? 'border-red-500' : ''}`}
                     onInput={(e) => setContent(e.target.innerHTML)}
                  />

                  <div className="absolute bottom-2 right-2 text-sm text-gray-500">
                    {wordCount} words
                  </div>
                </div>
                {formErrors.content && <p className="text-red-500 text-sm mb-2">{formErrors.content}</p>}
                <div className="flex flex-wrap space-x-4 mb-4">
                  <label className="flex items-center space-x-2 cursor-pointer mb-2">
                    <FaImage className="text-green-500" />
                    <span>Add Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer mb-2">
                    <FaVideo className="text-blue-500" />
                    <span>Add Video</span>
                    <input
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={handleVideoChange}
                    />
                  </label>
                  <div className="flex items-center space-x-2 mb-2">
                    <FaLink className="text-purple-500" />
                    <input
                      type="url"
                      placeholder="Add Link"
                      className="p-1 border rounded"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                    />
                  </div>
                </div>
                {fileUploadProgress > 0 && fileUploadProgress < 100 && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                      style={{width: `${fileUploadProgress}%`}}
                    ></div>
                  </div>
                )}
                <div className="flex space-x-4 mb-4">
                  {imagePreview && (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-32 h-32 object-cover cursor-pointer"
                        onClick={() => setShowLargeImage(true)}
                      />
                      <button
                        type="button"
                        onClick={() => removeFile('image')}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  )}
                  {videoPreview && (
                    <div className="relative">
                      <video
                        src={videoPreview}
                        className="w-32 h-32 object-cover cursor-pointer"
                        onClick={() => setShowLargeVideo(true)}
                      />
                      <button
                        type="button"
                        onClick={() => removeFile('video')}
                        className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                      >
                        <FaTrash size={12} />
                      </button>
                    </div>
                  )}
                </div>
                {(isPublishing || uploadProgress > 0) && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4">
                    <div 
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
                      style={{width: `${uploadProgress}%`}}
                    ></div>
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition duration-300 flex items-center justify-center"
                  disabled={isPublishing}
                >
                  {isPublishing ? (
                    'Publishing...'
                  ) : (
                    <>
                      <FaUpload className="mr-2" />
                      Publish Article
                    </>
                  )}
                </button>
                {publishError && (
                  <p className="text-red-500 mt-2">{publishError}</p>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLargeImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setShowLargeImage(false)}
          >
            <img
              src={imagePreview}
              alt="Large Preview"
              className="max-w-full max-h-full object-contain"
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showLargeVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
            onClick={() => setShowLargeVideo(false)}
          >
            <video
              src={videoPreview}
              className="max-w-full max-h-full"
              controls
              autoPlay
            />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center z-60"
          >
            <div className="bg-white rounded-lg p-8 shadow-xl flex flex-col items-center">
              <FaCheckCircle className="text-green-500 text-5xl mb-4" />
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Article Successfully Created!</h2>
              <p className="text-gray-600">Your article has been published.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ArticleCreation;