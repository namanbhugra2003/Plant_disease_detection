import React, { useEffect, useState } from "react";
import axios from "axios";

const MyInquiriez = () => {
  const [inquiries, setInquiries] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAlerts, setShowAlerts] = useState(false);

  useEffect(() => {
    fetchData();
  }, [showAlerts]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("user"));
      const token = userData?.token;

      if (!token) {
        console.error("No token found");
        setLoading(false);
        return;
      }

      if (showAlerts) {
        const res = await axios.get("http://localhost:5557/alerts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setAlerts(res.data);
      } else {
        const res = await axios.get("http://localhost:5557/farmer", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setInquiries(res.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityLabel = (severity) => {
    const base = "px-3 py-1 rounded-full text-white";
    switch (severity) {
      case "Low":
        return `${base} bg-blue-500`;
      case "Medium":
        return `${base} bg-yellow-500`;
      case "High":
        return `${base} bg-orange-500`;
      case "Critical":
        return `${base} bg-red-600`;
      default:
        return `${base} bg-gray-500`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-700">
          {showAlerts ? "Disease Alerts" : "My Inquiries"}
        </h1>

        <div className="flex items-center gap-2">
          <label htmlFor="toggle" className="text-sm font-medium text-gray-600">
            {showAlerts ? "Show Inquiries" : "Show Alerts"}
          </label>
          <input
            type="checkbox"
            id="toggle"
            checked={showAlerts}
            onChange={() => setShowAlerts((prev) => !prev)}
            className="toggle-checkbox"
          />
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : showAlerts ? (
        alerts.length === 0 ? (
          <p>No alerts available.</p>
        ) : (
          <table className="w-full border-collapse bg-white rounded-lg shadow-lg">
            <thead>
              <tr className="bg-green-600 text-white">
                <th className="p-4 text-left">Disease</th>
                <th className="p-4 text-left">Location</th>
                <th className="p-4 text-left">Severity</th>
                <th className="p-4 text-left">Detected On</th>
                <th className="p-4 text-left">Description</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert._id} className="border-b">
                  <td className="p-4">{alert.diseaseName}</td>
                  <td className="p-4">{alert.location}</td>
                  <td className="p-4">
                    <span className={getSeverityLabel(alert.severity)}>
                      {alert.severity}
                    </span>
                  </td>
                  <td className="p-4">
                    {new Date(alert.dateDetected).toLocaleDateString()}
                  </td>
                  <td className="p-4">{alert.description || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )
      ) : inquiries.length === 0 ? (
        <p>No inquiries found.</p>
      ) : (
        <table className="w-full border-collapse bg-white rounded-lg shadow-lg">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="p-4 text-left">Plant</th>
              <th className="p-4 text-left">Issue</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Reply</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inq) => (
              <tr key={inq._id} className="border-b">
                <td className="p-4">{inq.plantName}</td>
                <td className="p-4">{inq.issueDescription}</td>
                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-white ${
                      inq.status === "Pending"
                        ? "bg-yellow-500"
                        : inq.status === "In Progress"
                        ? "bg-blue-500"
                        : "bg-green-600"
                    }`}
                  >
                    {inq.status}
                  </span>
                </td>
                <td className="p-4">{inq.reply || "No reply yet"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyInquiriez;
