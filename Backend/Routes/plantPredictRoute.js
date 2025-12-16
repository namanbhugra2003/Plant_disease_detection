import express from "express";
import multer from "multer";
import axios from "axios";
import authenticateToken, { authorize }
  from "../Middleware/authMiddleware.js";
const router = express.Router();
const upload = multer(); // memory storage
// 🔐 Sab article routes ke liye login required
router.use(authenticateToken);

router.post("/predict", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const hfResponse = await axios.post(
      "https://router.huggingface.co/hf-inference/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification",
      req.file.buffer,
      {
        headers: {
          Authorization: `Bearer ${process.env.HF_API_KEY}`,
          "Content-Type": "application/octet-stream",
        },
        timeout: 30000,
      }
    );

    const predictions = hfResponse.data;

    if (!Array.isArray(predictions) || predictions.length === 0) {
      return res.status(500).json({ message: "No prediction returned" });
    }

    const top = predictions[0];

    res.json({
      disease: top.label,
      confidence: `${(top.score * 100).toFixed(2)}%`,
    });
  } catch (error) {
    console.error("Prediction error:", error.response?.data || error.message);
    res.status(500).json({
      message: "Error predicting plant disease",
      error: error.message,
    });
  }
});

export default router;
