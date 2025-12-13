import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaHeart, FaRegHeart, FaBookmark, FaRegBookmark, FaSearch, FaFilter, FaSpinner, FaSortAmountDown, FaCalendarAlt } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import UserTopNavbar from './UserTopNavbar';

const API_BASE_URL = 'http://localhost:5557';

const ArticleView = () => {
  const [articles, setArticles] = useState([]);
  const [error, setError] = useState(null);
  const [expandedArticles, setExpandedArticles] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [dateFilter, setDateFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_BASE_URL}/api/articles`);
      setArticles(response.data.data);
    } catch (error) {
      console.error('Error fetching articles:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (articleId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/articles/${articleId}/like`);
      setArticles(prevArticles => prevArticles.map(article =>
        article._id === articleId ? { ...article, likes: response.data.likes } : article
      ));
    } catch (error) {
      console.error('Error liking article:', error);
    }
  };

  const handleSave = async (articleId) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/api/articles/${articleId}/save`);
      setArticles(prevArticles => prevArticles.map(article =>
        article._id === articleId ? { ...article, saves: response.data.saves } : article
      ));
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  const toggleExpand = (articleId) => {
    setExpandedArticles(prev => ({ ...prev, [articleId]: !prev[articleId] }));
  };

  const stripHtmlTags = (html) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const categories = ['All', ...new Set(articles.map(article => article.category))];

  const filteredArticles = articles
    .filter(article =>
      (selectedCategory === 'All' || article.category === selectedCategory) &&
      (article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stripHtmlTags(article.content).toLowerCase().includes(searchTerm.toLowerCase())) &&
      (dateFilter === 'all' || 
       (dateFilter === 'lastWeek' && new Date(article.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
       (dateFilter === 'lastMonth' && new Date(article.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)))
    )
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'mostLiked') return b.likes - a.likes;
      return 0;
    });

  const topPicks = articles.sort((a, b) => b.likes - a.likes).slice(0, 3);

  return (
    <div className="bg-green-50 min-h-screen">
      <UserTopNavbar />
      <header className="bg-gradient-to-r from-green-600 to-green-800 text-white py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-4">Agricultural Insights</h1>
          <p className="text-xl mb-8">Cultivating knowledge for a greener tomorrow</p>
          <div className="relative w-2/3 mx-auto">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-6 py-3 rounded-full text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 shadow-lg"
            />
            <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-green-800">Latest Articles</h2>
          <div className="flex space-x-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 rounded-full bg-green-600 text-white hover:bg-green-700 transition duration-300"
            >
              <FaFilter />
            </motion.button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white text-green-600 px-4 py-2 rounded-full border border-green-600"
            >
              <option value="newest">Newest</option>
              <option value="mostLiked">Most Liked</option>
            </select>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white p-4 rounded-lg shadow-md mb-6"
            >
              <div className="flex flex-wrap gap-3 mb-4">
                <h3 className="w-full text-lg font-semibold mb-2">Categories:</h3>
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full ${selectedCategory === category ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'} transition duration-300`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-3">
                <h3 className="w-full text-lg font-semibold mb-2">Date Filter:</h3>
                <button
                  onClick={() => setDateFilter('all')}
                  className={`px-4 py-2 rounded-full ${dateFilter === 'all' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'} transition duration-300`}
                >
                  All Time
                </button>
                <button
                  onClick={() => setDateFilter('lastWeek')}
                  className={`px-4 py-2 rounded-full ${dateFilter === 'lastWeek' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'} transition duration-300`}
                >
                  Last Week
                </button>
                <button
                  onClick={() => setDateFilter('lastMonth')}
                  className={`px-4 py-2 rounded-full ${dateFilter === 'lastMonth' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700'} transition duration-300`}
                >
                  Last Month
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {loading ? (
          <div className="flex justify-center items-center min-h-[300px]">
            <FaSpinner className="text-green-600 text-4xl animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="col-span-2">
              {filteredArticles.map((article) => {
                const content = stripHtmlTags(article.content);
                const paragraphs = content.split('\n').filter(p => p.trim().length > 0);
                const preview = paragraphs.slice(0, 2).join('\n');

                return (
                  <motion.div
                    key={article._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg shadow-lg overflow-hidden mb-8"
                  >
                    {article.image && <img src={article.image} alt={article.title} className="w-full h-64 object-cover" />}
                    <div className="p-6">
                      <h3 className="text-2xl font-bold mb-2 text-green-800">{article.title}</h3>
                      <p className="text-gray-600 mb-4">
                        {expandedArticles[article._id] ? content : `${preview}...`}
                      </p>
                      <button onClick={() => toggleExpand(article._id)} className="text-green-600 hover:text-green-800">
                        {expandedArticles[article._id] ? 'Read less' : 'Read more'}
                      </button>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-sm text-gray-500">{new Date(article.createdAt).toLocaleDateString()}</span>
                        <div className="flex space-x-4">
                          <button onClick={() => handleLike(article._id)} className="flex items-center space-x-1">
                            {article.likes > 0 ? <FaHeart className="text-green-500" /> : <FaRegHeart />}
                            <span>{article.likes || 0}</span>
                          </button>
                          <button onClick={() => handleSave(article._id)} className="flex items-center space-x-1">
                            {article.saves > 0 ? <FaBookmark className="text-green-500" /> : <FaRegBookmark />}
                            <span>{article.saves || 0}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold mb-6 text-green-800">Top Picks</h2>
                {topPicks.map((article) => (
                  <motion.div
                    key={article._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg shadow-md p-4 mb-4"
                  >
                    <h3 className="text-lg font-semibold text-green-700 mb-2">{article.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{stripHtmlTags(article.content).slice(0, 100)}...</p>
                    <div className="flex justify-between items-center text-sm text-gray-500">
                      <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                      <div className="flex items-center space-x-2">
                        <FaHeart className="text-red-500" />
                        <span>{article.likes}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <div>
                <h2 className="text-3xl font-bold mb-6 text-green-800">Categories</h2>
                <div className="bg-white rounded-lg shadow-md p-4">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`block w-full text-left px-4 py-2 rounded ${
                        selectedCategory === category ? 'bg-green-100 text-green-800' : 'hover:bg-gray-100'
                      } transition duration-300 mb-2`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold mb-6 text-green-800">Newsletter</h2>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <p className="text-gray-600 mb-4">Stay updated with our latest agricultural insights!</p>
                  <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                    <input
                      type="email"
                      placeholder="Your email address"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                    <button
                      type="submit"
                      className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition duration-300"
                    >
                      Subscribe
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="text-center text-red-600 mt-8">
            <p>Error: {error}</p>
            <button
              onClick={fetchArticles}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition duration-300"
            >
              Try Again
            </button>
          </div>
        )}

        {filteredArticles.length === 0 && !loading && !error && (
          <div className="text-center text-gray-600 mt-8">
            <p>No articles found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticleView;