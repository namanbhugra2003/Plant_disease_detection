import express from "express";
import authenticateToken from '../Middleware/authMiddleware.js';
import User from '../Models/User.js';

const router = express.Router();

router.get("/profile", authenticateToken, async (req, res) => {
  try {
    // Assuming authenticateToken middleware adds user info to req.user
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.error("Error fetching user profile:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;