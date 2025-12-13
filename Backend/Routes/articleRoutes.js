import express from 'express';
import Article from '../Models/Article.js';
import multer from 'multer';
import path from 'path';
import Activity from "../Models/Activity.js";


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'Backend/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


const router = express.Router();

router.post('/', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {

  try {
    const { title, content, link, image, video } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required' });
    }

    // No need to check file size here as multer will handle it


    const newArticle = new Article({
      title,
      content,
      link,
      image,
      video
    });

    await newArticle.save();

     // Log the activity
     const newActivity = new Activity({
      type: 'article',
      action: 'Article published',
      name: title,
      articleId: newArticle._id
    });
    
    await newActivity.save();

    return res.status(201).json({ message: 'Article created successfully', article: newArticle });


  } catch (error) {
    console.error('Error saving article:', error);
    res.status(500).json({ message: 'Error saving article', error: error.message });
  }
});

router.get('/count', async (req, res) => {
  try {
    const count = await Article.countDocuments();
    res.json({ count });
  } catch (error) {
    console.error('Error fetching article count:', error);
    res.status(500).json({ message: 'Error fetching article count', error: error.message });
  }
});

// GET route to fetch all articles
router.get('/', async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 }); // Sort by newest first
    return res.status(200).json({
      count: articles.length,
      data: articles,
    });
  } catch (error) {
    console.error('Error fetching articles:', error);
    res.status(500).json({ message: 'Error fetching articles', error: error.message });
  }
});

// GET route to fetch a single article by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    return res.status(200).json(article);
  } catch (error) {
    console.log(error.message);
    res.status(500).send({ message: error.message });
  }
});

// Update an article
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, link, image, video } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        message: 'Send all required fields: title, content',
      });
    }

    const result = await Article.findByIdAndUpdate(
      id, 
      { title, content, link, image, video, updatedAt: Date.now() },
      { new: true }
    );

     // Log the activity
     const updateActivity = new Activity({
      type: 'article',
      action: 'Article edited',
      name: title,
      articleId: id
    });
    
    await updateActivity.save();

    if (!result) {
      return res.status(404).json({ message: 'Article not found' });
    }

    return res.status(200).json({ message: 'Article updated successfully', article: result });
  } catch (error) {
    console.error('Error updating article:', error);
    res.status(500).json({ message: 'Error updating article', error: error.message });
  }
});
// DELETE route to delete an article
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Article.findByIdAndDelete(id);

    if (!result) {
      return res.status(404).json({ message: 'Article not found' });
    }

    return res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    console.error('Error deleting article:', error);
    res.status(500).json({ message: 'Error deleting article', error: error.message });
  }
});


// POST route to like an article
router.post('/:id/like', async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    article.likes += 1;
    await article.save();

    return res.status(200).json({ message: 'Article liked successfully', likes: article.likes });
  } catch (error) {
    console.error('Error liking article:', error);
    res.status(500).json({ message: 'Error liking article', error: error.message });
  }
});

// POST route to save an article
router.post('/:id/save', async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);

    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }

    article.saves += 1;
    await article.save();

    return res.status(200).json({ message: 'Article saved successfully', saves: article.saves });
  } catch (error) {
    console.error('Error saving article:', error);
    res.status(500).json({ message: 'Error saving article', error: error.message });
  }
});



export default router;