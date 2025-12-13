import React, { useState } from "react";
import axios from "axios";

function DiseaseIdentifier() {
  const [topDisease, setTopDisease] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const identifyDisease = async () => {
    if (!selectedFile) return alert("Please select an image.");

    const reader = new FileReader();
    reader.readAsDataURL(selectedFile);
    reader.onloadend = async () => {
      const base64Image = reader.result.split(",")[1]; // Remove data URI prefix

      try {
        const response = await axios.post(
          "https://crop.kindwise.com/api/v1/identification",
          {
            images: [base64Image],
          },
          {
            headers: {
              "Content-Type": "application/json",
              "Api-Key": "w9dI5ltIik0SAYqj4soymqYV2zMsiY6VsqxnpMhlXWS1OjcSSj",
            },
          }
        );

        const topSuggestion = response.data.result.disease.suggestions[0];
        setTopDisease(topSuggestion.name);
      } catch (error) {
        console.error("Identification failed:", error);
        alert("Failed to identify disease. Check console for details.");
      }
    };
  };

  return (
    <div>
      <h2>Identify Plant Disease</h2>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => setSelectedFile(e.target.files[0])}
      />
      <button onClick={identifyDisease}>Identify</button>

      {topDisease && (
        <div>
          <h3>Most Likely Disease:</h3>
          <p>{topDisease}</p>
        </div>
      )}
    </div>
  );
}

export default DiseaseIdentifier;
