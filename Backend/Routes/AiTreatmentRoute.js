import express from "express";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

if (!process.env.OPENAI_API_KEY) {
  console.error("Error: OPENAI_API_KEY is not defined in .env");
}

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
Ensure the output is always valid JSON without any extra text or markdown formatting.

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

Expected JSON Output Format:
{
  "disease_explanation": "Brief explanation of the disease",
  "treatment_recommendations": {
    "organic": "Organic treatment options (if applicable)",
    "chemical": "Chemical treatment options (if applicable)",
    "both": "Both organic and chemical treatment options"
  },
  "preventive_measures": "Preventive measures to avoid future outbreaks",
  "best_recovery_practices": "Best practices for plant recovery",
  "expert_advice": "Any additional expert advice"
}
`;

    // Call OpenAI
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "Generate AI-based treatment recommendations for plant diseases in JSON format. Use simple and clear English. Always return valid JSON only.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.3,
    });

    const responseText = aiResponse.choices[0].message.content;
    console.log("Raw AI Response:", responseText);

    // Remove possible markdown
    const cleanResponse = responseText.replace(/```json|```/g, "").trim();

    // Parse JSON
    const parsedResponse = JSON.parse(cleanResponse);

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
