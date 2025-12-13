import express from 'express';
import Activity from '../Models/Activity.js';

const router = express.Router();

// Get recent activities
router.get('/recent', async (req, res) => {
  try {
    const activities = await Activity.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Format the time for each activity
    const formattedActivities = activities.map(activity => {
      const now = new Date();
      const activityTime = new Date(activity.createdAt);
      const diffMs = now - activityTime;
      const diffMins = Math.round(diffMs / 60000);
      const diffHours = Math.round(diffMs / 3600000);
      const diffDays = Math.round(diffMs / 86400000);
      
      let timeAgo;
      if (diffMins < 60) {
        timeAgo = `${diffMins} minutes ago`;
      } else if (diffHours < 24) {
        timeAgo = `${diffHours} hours ago`;
      } else {
        timeAgo = `${diffDays} days ago`;
      }
      
      return {
        id: activity._id,
        type: activity.type,
        action: activity.action,
        name: activity.name,
        time: timeAgo
      };
    });
    
    res.json(formattedActivities);
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({ message: 'Error fetching activities', error: error.message });
  }
});

// Create a new activity
router.post('/', async (req, res) => {
  try {
    const { type, action, name, userId, articleId } = req.body;
    
    const newActivity = new Activity({
      type,
      action,
      name,
      userId,
      articleId
    });
    
    await newActivity.save();
    res.status(201).json({ message: 'Activity logged successfully', activity: newActivity });
  } catch (error) {
    console.error('Error logging activity:', error);
    res.status(500).json({ message: 'Error logging activity', error: error.message });
  }
});

export default router;