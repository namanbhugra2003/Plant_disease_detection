import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Models/User.js";
import { JWT_SECRET } from "../config.js";
import authenticateToken from "../Middleware/authMiddleware.js";
import Activity from "../Models/Activity.js";

const router = express.Router();

// User Registration Route
router.post("/register", async (req, res) => {
  try {
    const { username, email, password, role, fullName, phoneNumber, location } = req.body;

    // Check if user already exists by email or username
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken" });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      role: role || "farmer", // Default role if not provided
      fullName,
      phoneNumber,
      location,
    });

    await newUser.save();

     // Log the activity
     const newActivity = new Activity({
      type: 'user',
      action: 'New user registered',
      name: username,
      userId: newUser._id
    });
    
    await newActivity.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error in registration:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// User Login Route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare entered password with hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, userId: user._id, username: user.username, role: user.role });
  } catch (error) {
    console.error("Error in login:", error);
    res.status(500).json({ message: "Server error" });
  }
});//user count
router.get('/count', async (req, res) => {
  try {
    const count = await User.countDocuments();
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user count', error: error.message });
  }
});



// User Registration Stats Route
router.get('/registration-stats', async (req, res) => {
  try {
    const users = await User.find({}, 'createdAt');
    const stats = {};

    users.forEach(user => {
      const date = user.createdAt.toISOString().split('T')[0]; // Get date in YYYY-MM-DD format
      stats[date] = (stats[date] || 0) + 1;
    });

    const sortedDates = Object.keys(stats).sort();
    const labels = sortedDates;
    const values = sortedDates.map(date => stats[date]);

    res.json({ labels, values });
  } catch (error) {
    console.error('Error fetching user registration stats:', error);
    res.status(500).json({ message: 'Error fetching user registration stats' });
  }
});

/// Get all users (no authentication required)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

// Delete user (no authentication required)
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
});


// Update user
router.put('/:id', async (req, res) => {
  try {
    const { username, email, role } = req.body;
    const userId = req.params.id;

    // Check if the email is already in use by another user
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use by another user" });
    }

    // Check if the username is already taken by another user
    const existingUsername = await User.findOne({ username, _id: { $ne: userId } });
    if (existingUsername) {
      return res.status(400).json({ message: "Username already taken by another user" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { username, email, role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User updated successfully', user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
});

export default router;