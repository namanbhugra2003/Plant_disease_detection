import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaTimes, FaEdit, FaTrash, FaEye, FaArrowLeft, FaSearch, 
  FaBold, FaItalic, FaUnderline, FaCode, FaListUl, FaListOl, FaQuoteRight 
} from 'react-icons/fa';
import axios from 'axios';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';

const MenuBar = ({ editor }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4 bg-green-50 p-3 rounded-md shadow-sm">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`p-2 rounded-md transition-all ${editor.isActive('bold') ? 'bg-green-200 text-green-800' : 'bg-white text-gray-700 hover:bg-green-100'}`}
        title="Bold"
      >
        <FaBold />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`p-2 rounded-md transition-all ${editor.isActive('italic') ? 'bg-green-200 text-green-800' : 'bg-white text-gray-700 hover:bg-green-100'}`}
        title="Italic"
      >
        <FaItalic />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded-md transition-all ${editor.isActive('underline') ? 'bg-green-200 text-green-800' : 'bg-white text-gray-700 hover:bg-green-100'}`}
        title="Underline"
      >
        <FaUnderline />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleCode().run()}
        className={`p-2 rounded-md transition-all ${editor.isActive('code') ? 'bg-green-200 text-green-800' : 'bg-white text-gray-700 hover:bg-green-100'}`}
        title="Code"
      >
        <FaCode />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded-md transition-all ${editor.isActive('bulletList') ? 'bg-green-200 text-green-800' : 'bg-white text-gray-700 hover:bg-green-100'}`}
        title="Bullet List"
      >
        <FaListUl />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded-md transition-all ${editor.isActive('orderedList') ? 'bg-green-200 text-green-800' : 'bg-white text-gray-700 hover:bg-green-100'}`}
        title="Ordered List"
      >
        <FaListOl />
      </button>
      <button
        onClick={() => editor.chain().focus().toggleBlockquote().run()}
        className={`p-2 rounded-md transition-all ${editor.isActive('blockquote') ? 'bg-green-200 text-green-800' : 'bg-white text-gray-700 hover:bg-green-100'}`}
        title="Blockquote"
      >
        <FaQuoteRight />
      </button>
    </div>
  );
};

const ArticleManagement = ({ isOpen, onClose }) => {
  const [articles, setArticles] = useState([]);
  const [filteredArticles, setFilteredArticles] = useState([]);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [editingArticle, setEditingArticle] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const editor = useEditor({
    extensions: [StarterKit, Underline],
    content: '',
  });

  useEffect(() => {
    if (isOpen) {
      fetchArticles();
    }
  }, [isOpen]);

  useEffect(() => {
    if (Array.isArray(articles)) {
      const results = articles.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredArticles(results);
    }
  }, [searchTerm, articles]);

  useEffect(() => {
    if (editor && editingArticle) {
      editor.commands.setContent(editingArticle.content);
    }
  }, [editingArticle, editor]);

  const fetchArticles = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5557/api/articles');
      console.log('Fetch response:', response);

      if (response.data && Array.isArray(response.data)) {
        setArticles(response.data);
        setFilteredArticles(response.data);
      } else if (response.data && response.data.data && Array.isArray(response.data.data)) {
        setArticles(response.data.data);
        setFilteredArticles(response.data.data);
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError('Failed to fetch articles. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleView = (article) => {
    setSelectedArticle(article);
    setEditingArticle(null);
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setSelectedArticle(null);
  };

  const handleDeleteConfirmation = (id) => {
    setDeleteConfirmation(id);
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5557/api/articles/${id}`);
      console.log('Delete response:', response);
  
      if (response.status === 200) {
        setArticles(articles.filter(article => article._id !== id));
        setFilteredArticles(filteredArticles.filter(article => article._id !== id));
        setSelectedArticle(null);
        setEditingArticle(null);
        setDeleteConfirmation(null);
      } else {
        console.error('Unexpected response status:', response.status);
      }
    } catch (error) {
      console.error('Error deleting article:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
    }
  };
  
  const handleSave = async () => {
    try {
      const response = await axios.put(`http://localhost:5557/api/articles/${editingArticle._id}`, {
        title: editingArticle.title,
        content: editor.getHTML()
      });
      console.log('Update response:', response);
  
      if (response.status === 200 && response.data) {
        const updatedArticle = response.data.article || response.data;
        const updatedArticles = articles.map(a => a._id === updatedArticle._id ? updatedArticle : a);
        setArticles(updatedArticles);
        setFilteredArticles(updatedArticles);
        setEditingArticle(null);
      } else {
        console.error('Unexpected response status or data:', response.status, response.data);
      }
    } catch (error) {
      console.error('Error saving article:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
      }
    }
  };

  const handleBack = () => {
    setSelectedArticle(null);
    setEditingArticle(null);
  };

  if (!isOpen) return null;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const truncateHTML = (html, maxLength = 150) => {
    // Create a temporary div to parse the HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    const text = tempDiv.textContent || tempDiv.innerText || '';
    
    if (text.length <= maxLength) {
      return html;
    }
    
    return text.substring(0, maxLength) + '...';
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-xl p-6 w-[90vw] h-[90vh] max-w-7xl overflow-hidden flex flex-col shadow-2xl"
        >
          <div className="flex justify-between items-center mb-6 border-b border-green-100 pb-4">
            <h2 className="text-3xl font-bold text-green-800">
              {selectedArticle ? 'View Article' : 
               editingArticle ? 'Edit Article' : 
               'Manage Articles'}
            </h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-green-700 transition-colors p-2 rounded-full hover:bg-green-50"
            >
              <FaTimes size={24} />
            </button>
          </div>
          
          {!selectedArticle && !editingArticle && (
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-full border border-green-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent shadow-sm"
              />
              <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-green-500" size={16} />
            </div>
          )}

          <div className="flex-grow overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500 font-medium">{error}</p>
                <button 
                  onClick={fetchArticles}
                  className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {!selectedArticle && !editingArticle ? (
                  <motion.div
                    key="article-list"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  >
                    {filteredArticles.length === 0 ? (
                      <div className="col-span-full text-center py-12">
                        <p className="text-gray-500 text-lg">No articles found</p>
                      </div>
                    ) : (
                      filteredArticles.map((article) => (
                        <motion.div
                          key={article._id}
                          layout
                          whileHover={{ y: -4 }}
                          className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg border border-green-100 transition-all duration-300"
                        >
                          <h3 className="font-semibold text-xl mb-2 text-green-800">{article.title}</h3>
                          <p className="text-sm text-gray-500 mb-4 flex items-center">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                            {formatDate(article.createdAt)}
                          </p>
                          <div className="text-gray-600 mb-6 line-clamp-3 overflow-hidden h-20" 
                               dangerouslySetInnerHTML={{ __html: truncateHTML(article.content) }} />
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => handleView(article)}
                              className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors"
                              title="View article"
                            >
                              <FaEye size={18} />
                            </button>
                            <button
                              onClick={() => handleEdit(article)}
                              className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                              title="Edit article"
                            >
                              <FaEdit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteConfirmation(article._id)}
                              className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                              title="Delete article"
                            >
                              <FaTrash size={18} />
                            </button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </motion.div>
                ) : (
                  <motion.div
                    key="article-detail"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-white rounded-xl w-full"
                  >
                    <button 
                      onClick={handleBack} 
                      className="mb-6 text-green-600 hover:text-green-800 flex items-center font-medium transition-colors"
                    >
                      <FaArrowLeft className="mr-2" /> Back to Articles
                    </button>
                    
                    {selectedArticle && (
                      <div className="p-6 bg-white rounded-xl border border-green-100 shadow-sm">
                        <h3 className="text-3xl font-bold mb-4 text-green-800">{selectedArticle.title}</h3>
                        <div className="prose max-w-none my-8" dangerouslySetInnerHTML={{ __html: selectedArticle.content }} />
                        <div className="flex items-center justify-between mt-8 pt-4 border-t border-green-100">
                          <p className="text-sm text-gray-500">
                            Published on: <span className="font-medium">{formatDate(selectedArticle.createdAt)}</span>
                          </p>
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEdit(selectedArticle)}
                              className="flex items-center px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                            >
                              <FaEdit className="mr-2" /> Edit
                            </button>
                            <button
                              onClick={() => handleDeleteConfirmation(selectedArticle._id)}
                              className="flex items-center px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                            >
                              <FaTrash className="mr-2" /> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {editingArticle && (
                      <div className="p-6 bg-white rounded-xl border border-green-100 shadow-sm">
                        <input
                          type="text"
                          value={editingArticle.title}
                          onChange={(e) => setEditingArticle({...editingArticle, title: e.target.value})}
                          className="w-full p-3 mb-6 border border-green-200 rounded-lg text-xl font-bold focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                          placeholder="Article Title"
                        />
                        <MenuBar editor={editor} />
                        <EditorContent 
                          editor={editor} 
                          className="prose max-w-none mb-6 p-4 border border-green-200 rounded-lg min-h-[300px] focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent" 
                        />
                        <div className="flex justify-end space-x-4 mt-4">
                          <button
                            onClick={handleBack}
                            className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={handleSave}
                            className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition-colors font-medium"
                          >
                            Save Changes
                          </button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </motion.div>

        <AnimatePresence>
          {deleteConfirmation && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-8 max-w-md w-full shadow-2xl"
              >
                <div className="flex items-center mb-6 text-red-500">
                  <FaTrash size={24} className="mr-3" />
                  <h3 className="text-2xl font-bold text-gray-800">Confirm Deletion</h3>
                </div>
                <p className="text-gray-600 mb-8">Are you sure you want to delete this article? This action cannot be undone.</p>
                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => setDeleteConfirmation(null)}
                    className="bg-gray-200 text-gray-700 px-5 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(deleteConfirmation)}
                    className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );
};

export default ArticleManagement;