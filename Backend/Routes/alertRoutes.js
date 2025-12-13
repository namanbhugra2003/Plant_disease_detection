import express from 'express';
import Alert from '../Models/Alert.js';
import authenticateToken, { authorize } from '../Middleware/authMiddleware.js';

const router = express.Router();

// Create Alert
router.post('/', authenticateToken, authorize('manager'), async (req, res) => {
  try {
    const alert = await Alert.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(alert);
  } catch (error) {
    res.status(500).json({ message: 'Error creating alert', error });
  }
});

// Get All Alerts (for Farmers)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const alerts = await Alert.find().sort({ createdAt: -1 });
    res.status(200).json(alerts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching alerts', error });
  }
});

// Update Alert
router.put('/:id', authenticateToken, authorize('manager'), async (req, res) => {
  try {
    const updated = await Alert.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating alert', error });
  }
});

// Delete Alert
router.delete('/:id', authenticateToken, authorize('manager'), async (req, res) => {
  try {
    await Alert.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Alert deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting alert', error });
  }
});

export default router;
