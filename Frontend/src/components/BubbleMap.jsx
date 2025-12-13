import React, { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, Circle, Popup, useMap } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

// Reset helper component
const ResetMapView = ({ trigger, coords, zoom }) => {
  const map = useMap();
  useEffect(() => {
    if (trigger) {
      map.setView(coords, zoom);
    }
  }, [trigger, coords, zoom, map]);
  return null;
};

// Zoom when selecting disease
const ZoomToDisease = ({ coords }) => {
  const map = useMap();
  useEffect(() => {
    if (coords) {
      map.flyTo(coords, 9, { duration: 1.5 });
    }
  }, [coords, map]);
  return null;
};

const BubbleMap = () => {
  const [farmers, setFarmers] = useState([]);
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [resetTrigger, setResetTrigger] = useState(false);
  const [mapStyle, setMapStyle] = useState("carto"); // default style

  const defaultCenter = [7.8731, 80.7718];
  const defaultZoom = 6.5;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        const token = userData?.token;
        if (!token) return;

        const response = await axios.get("http://localhost:5557/farmer/all", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFarmers(response.data.data || []);
      } catch (error) {
        console.error("Error fetching farmers:", error);
      }
    };

    fetchFarmers();
  }, []);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const getNearbyCount = (targetFarmer) => {
    return farmers.filter((f) => {
      if (
        f._id !== targetFarmer._id &&
        f.latitude &&
        f.longitude &&
        targetFarmer.latitude &&
        targetFarmer.longitude
      ) {
        return getDistance(
          targetFarmer.latitude,
          targetFarmer.longitude,
          f.latitude,
          f.longitude
        ) <= 2;
      }
      return false;
    }).length;
  };

  const getBubbleColor = (nearbyCount) => {
    if (nearbyCount >= 5) return "#ec3c4c"; // red ec3c4c
    if (nearbyCount >= 3) return "#d97706"; // orange d97706
    if (nearbyCount >= 1) return "#60a5fa"; // blue
    return "#4ade80"; // green
  };

  const getBubbleSize = (nearbyCount) => {
    if (nearbyCount >= 5) return 15000;
    if (nearbyCount >= 3) return 10000;
    if (nearbyCount >= 1) return 8000;
    return 5000;
  };

  const groupedDiseases = {};
  let totalReports = 0;
  farmers.forEach((f) => {
    if (f.diseaseName) {
      totalReports++;
      groupedDiseases[f.diseaseName] = (groupedDiseases[f.diseaseName] || 0) + 1;
    }
  });

  const filteredFarmers = selectedDisease
    ? farmers.filter((f) => f.diseaseName === selectedDisease)
    : farmers;

  const diseaseToCoords = {};
  farmers.forEach((f) => {
    if (f.diseaseName && f.latitude && f.longitude) {
      if (!diseaseToCoords[f.diseaseName]) {
        diseaseToCoords[f.diseaseName] = [f.latitude, f.longitude];
      }
    }
  });

  const handleReset = () => {
    setSelectedDisease(null);
    setResetTrigger((prev) => !prev);
  };

  const toggleMapStyle = () => {
    setMapStyle((prev) => (prev === "carto" ? "osm" : "carto"));
  };

  const tileLayerUrl =
    mapStyle === "carto"
      ? "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";

  const tileAttribution =
    mapStyle === "carto"
      ? '&copy; <a href="https://carto.com">CARTO</a> & contributors'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

  return (
    <div className="w-full bg-white rounded-lg shadow-xl p-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-2xl font-bold text-gray-800 mb-5">🌍 Disease Distribution Map</h2>
        <span className="text-sm text-gray-500 bg-green-100 px-3 py-1 rounded-full">Live Data</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Map Section */}
        <div className="w-full h-[500px] rounded-lg overflow-hidden relative shadow">
          <div className="absolute z-[1000] right-3 top-3">
            <button
              onClick={toggleMapStyle}
              className="bg-green-100 hover:bg-green-200 text-green-700 px-3 py-1 rounded-full text-sm font-medium shadow-sm transition"
            >
              {mapStyle === "carto" ? "Switch to OSM" : "Switch to Carto"}
            </button>
          </div>
          <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            scrollWheelZoom={false}
            className="w-full h-full"
          >
            <TileLayer url={tileLayerUrl} attribution={tileAttribution} />

            {filteredFarmers.map((farmer, i) => {
              if (!farmer.latitude || !farmer.longitude) return null;
              const nearbyCount = getNearbyCount(farmer);
              const color = getBubbleColor(nearbyCount);
              const radius = getBubbleSize(nearbyCount);
              const animate = nearbyCount >= 3;

              return (
                <Circle
                  key={i}
                  center={[farmer.latitude, farmer.longitude]}
                  radius={radius}
                  pathOptions={{
                    fillColor: color,
                    fillOpacity: 0.7,
                    stroke: false,
                    className: animate ? "pulse-bubble" : "",
                  }}
                >
                  <Popup>
                    <div>
                      <h3 className="font-bold">{farmer.fullname}</h3>
                      <p><strong>Plant:</strong> {farmer.plantName}</p>
                      <p><strong>Disease:</strong> {farmer.diseaseName}</p>
                      <p><strong>Location:</strong> {farmer.location}</p>
                      <p><strong>Nearby Farmers:</strong> {nearbyCount}</p>
                    </div>
                  </Popup>
                </Circle>
              );
            })}

            {selectedDisease && diseaseToCoords[selectedDisease] && (
              <ZoomToDisease coords={diseaseToCoords[selectedDisease]} />
            )}
            <ResetMapView trigger={resetTrigger} coords={defaultCenter} zoom={defaultZoom} />
          </MapContainer>
        </div>

        {/* Disease Panel */}
        <div
          className="bg-white border rounded-lg p-4 shadow-xl h-[500px] overflow-y-auto"
          
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-700">Reported Diseases</h3>
            <button
              onClick={handleReset}
              className="bg-blue-100 text-blue-600 px-3 py-1 rounded-md font-semibold hover:bg-blue-200 transition"
            >
              Reset 
            </button>
          </div>

          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search disease..."
            className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-300"
          />

          {Object.entries(groupedDiseases)
            .filter(([name]) => name.toLowerCase().includes(searchQuery.toLowerCase()))
            .sort((a, b) => b[1] - a[1])
            .map(([name, count], i) => {
              const percent = ((count / totalReports) * 100).toFixed(0);
              return (
                <div
                  key={i}
                  onClick={() => setSelectedDisease(name)}
                  className={`mb-3 cursor-pointer rounded-lg p-3 transition ${
                    selectedDisease === name ? "bg-green-100" : "hover:bg-gray-100"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <div className="font-semibold text-gray-800">🦠 {name}</div>
                    <div className="text-sm font-bold text-gray-700">{percent}%</div>
                  </div>
                  <p className="text-sm text-gray-500 mb-1">{count} Reports</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-green-500 h-2 rounded-full"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* --- Alert Management Cards --- */}
      <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
  <div
    onClick={() => navigate("/alert")}
    title="Create a new alert for disease outbreak"
    className="flex items-center p-6 bg-white rounded-xl shadow-md cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-transform duration-200"
  >
    <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-green-100 text-green-600 mr-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
      </svg>
    </div>
    <div>
      <h4 className="text-lg font-semibold text-gray-800">Create New Alert</h4>
      <p className="text-sm text-gray-500">Add a new alert for disease outbreaks</p>
    </div>
  </div>

  <div
    onClick={() => navigate("/manager/alerts/manage")}
    title="View, update, or delete existing alerts"
    className="flex items-center p-6 bg-white rounded-xl shadow-md cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-transform duration-200"
  >
    <div className="flex items-center justify-center w-14 h-14 rounded-lg bg-blue-100 text-blue-600 mr-4">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5h6m-6 4h6m-6 4h6m-6 4h6M5 7h.01M5 11h.01M5 15h.01M5 19h.01" />
      </svg>
    </div>
    <div>
      <h4 className="text-lg font-semibold text-gray-800">Manage Alerts</h4>
      <p className="text-sm text-gray-500">View or update existing alerts</p>
    </div>
  </div>
</div>



      {/* Pulse Animation */}
      <style>{`
        .pulse-bubble {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { r: 0; opacity: 0.8; }
          50% { r: 10; opacity: 0.3; }
          100% { r: 0; opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default BubbleMap;
