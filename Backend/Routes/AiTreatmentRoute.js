import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("Error: GEMINI_API_KEY is not defined in .env");
}

const genAI = new GoogleGenerativeAI(apiKey);

// Initialize Gemini model
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
  systemInstruction: "Generate AI-based treatment recommendations for plant diseases in JSON format. Use simple and clear English.",
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
    // Ensure required fields are present
    if (!plantName || !detectedDisease || !observedSymptoms) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const prompt = `
     Based on the following input from a farmer, provide treatment recommendations strictly in JSON format. Ensure the output is always valid JSON without any extra text or markdown formatting.

      **Input Details:**
      - **Plant Name:** ${plantName}
      - **Detected Disease:** ${detectedDisease}
      - **Observed Symptoms:** ${observedSymptoms}
      - **Affected Parts:** ${affectedParts}
      - **Severity Level:** ${severityLevel}
      - **Spread Rate:** ${spreadRate}
      - **Weather Conditions:** ${weatherConditions}
      - **Preferred Treatment Type:** ${preferredTreatmentType}
      - **Previous Disease History:** ${previousDiseaseHistory}

      **Expected JSON Output Format:**
      {
        "disease_explanation": "<Brief explanation of the disease>",
        "treatment_recommendations": {
          "organic": "<Organic treatment options (if applicable)>",
          "chemical": "<Chemical treatment options (if applicable)>",
          "both": "<Both organic and chemical treatment options>"
        },
        "preventive_measures": "<Preventive measures to avoid future outbreaks>",
        "best_recovery_practices": "<Best practices for plant recovery>",
        "expert_advice": "<Any additional expert advice>"
      }
    `;

    // Call Gemini AI
    let aiResponse = await model.generateContent(prompt); // Use 'let' instead of 'const'
    aiResponse = await aiResponse.response.text();

    console.log("Raw AI Response:", aiResponse); // Debugging: log response

    // Clean up markdown formatting if present
    aiResponse = aiResponse.replace(/```json|```/g, "").trim();

    // Parse JSON safely
    const parsedResponse = JSON.parse(aiResponse);

    res.json({  treatment: parsedResponse }); // Ensure valid JSON response
  } catch (error) {
    console.error("Error generating AI treatment:", error);
    res.status(500).json({ message: "Error generating treatment recommendation", error: error.message });
  }
});

export default router;
