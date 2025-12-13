import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['user', 'article'],
    required: true
  },
  action: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  articleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Activity = mongoose.model('Activity', activitySchema);

export default Activity;