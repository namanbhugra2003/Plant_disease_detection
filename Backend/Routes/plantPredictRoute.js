import express from "express";
import multer from "multer";
import axios from "axios";

const router = express.Router();
const upload = multer(); // memory storage

router.post("/predict", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Image is required" });
    }

    const hfResponse = await axios.post(
      "https://api-inference.huggingface.co/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification?wait_for_model=true",
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
