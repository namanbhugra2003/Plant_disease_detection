import mongoose from "mongoose";


const aiRecommendationSchema = mongoose.Schema(
    {
    plantName: { 
        type: String, 
        required: true 
    },
    detectedDisease: { 
        type: String, 
        required: true
    },
    observedSymptoms: { 
        type: String,  
         required: true 
    },
    affectedParts: {
        type: String, 
        enum: ["Leaves", "Stem", "Roots", "Fruit"],
         required: true
    },
    severityLevel: { 
        type: String, 
        enum: ["Mild", "Moderate", "Severe"], 
        required: true 
    },
    spreadRate: { 
        type: String, 
        enum: ["Slow", "Moderate", "Fast"], 
        required: true
    },
    weatherConditions: { 
        type: String, 
        enum: ["Dry", "Humid", "Rainy", "Cold"], 
        required: true 
    },
    preferredTreatmentType: { 
        type: String, 
        enum: ["Organic", "Chemical", "Both"], 
        required: false 
    },
    previousDiseaseHistory: { 
        type: Boolean,
        required: false 
    },
    aiGeneratedTreatment: { 
        type: String, 
        required: false
     }, 
    createdAt: { 
        type: Date, 
        default: Date.now
    },
    }
);

export const AIRecommendation = mongoose.model("AIRecommendation", aiRecommendationSchema);