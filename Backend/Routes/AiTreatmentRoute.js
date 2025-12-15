import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Check API key
if (!process.env.GEMINI_API_KEY) {
  console.error("Error: GEMINI_API_KEY is not defined in .env");
}

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Use FREE & STABLE model
const model = genAI.getGenerativeModel({
  model: "models/gemini-1.0-pro",
  systemInstruction:
    "Generate AI-based treatment recommendations for plant diseases in JSON format. Use simple and clear English. Always return valid JSON only.",
});

router.post("/treatment", async (req, res) => {
  const {
    plantName,
    detectedDisease,
    observedSymptoms,
    affectedParts,
    severityLevel,
    spreadRate,
    weatherConditions,
    preferredTreatmentType,
    previousDiseaseHistory,
  } = req.body;

  try {
    // Validate required fields
    if (!plantName || !detectedDisease || !observedSymptoms) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = `
Based on the following input from a farmer, provide treatment recommendations strictly in JSON format.
Do NOT include markdown, explanations, or extra text.

Input Details:
- Plant Name: ${plantName}
- Detected Disease: ${detectedDisease}
- Observed Symptoms: ${observedSymptoms}
- Affected Parts: ${affectedParts}
- Severity Level: ${severityLevel}
- Spread Rate: ${spreadRate}
- Weather Conditions: ${weatherConditions}
- Preferred Treatment Type: ${preferredTreatmentType}
- Previous Disease History: ${previousDiseaseHistory}

Return ONLY this JSON structure:
{
  "disease_explanation": "",
  "treatment_recommendations": {
    "organic": "",
    "chemical": "",
    "both": ""
  },
  "preventive_measures": "",
  "best_recovery_practices": "",
  "expert_advice": ""
}
`;

    // Call Gemini
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    console.log("Raw AI Response:", responseText);

    // Clean & parse JSON safely
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(
        responseText.replace(/```json|```/g, "").trim()
      );
    } catch (err) {
      console.error("Invalid JSON from Gemini:", responseText);
      return res.status(500).json({
        message: "AI returned invalid JSON",
      });
    }

    res.json({ treatment: parsedResponse });
  } catch (error) {
    console.error("Error generating AI treatment:", error);
    res.status(500).json({
      message: "Error generating treatment recommendation",
      error: error.message,
    });
  }
});

export default router;
