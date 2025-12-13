import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";
import LogingNavBar from '../components/MNavigationBar ';

const severityLevels = ["Low", "Medium", "High", "Critical"];
const alertsPerPage = 4;

const tagColors = {
  Low: "bg-blue-100 text-blue-600",
  Medium: "bg-yellow-100 text-yellow-600",
  High: "bg-orange-100 text-orange-600",
  Critical: "bg-red-100 text-red-600",
};

const UpdateAlerts = () => {
  const [alerts, setAlerts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editedAlert, setEditedAlert] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { enqueueSnackbar } = useSnackbar();

  const fetchAlerts = async () => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData?.token) return;

    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5557/alerts", {
        headers: { Authorization: `Bearer ${userData.token}` },
      });

      const ownAlerts = res.data.filter(
        (alert) =>
          alert.createdBy === userData._id || alert.createdBy?._id === userData._id
      );

      setAlerts(ownAlerts);
    } catch (err) {
      enqueueSnackbar("Failed to load alerts", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleDelete = async (id) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData?.token) return;

    if (!window.confirm("Are you sure you want to delete this alert?")) return;

    try {
      await axios.delete(`http://localhost:5557/alerts/${id}`, {
        headers: { Authorization: `Bearer ${userData.token}` },
      });
      enqueueSnackbar("Alert deleted", { variant: "success" });
      fetchAlerts();
    } catch (err) {
      enqueueSnackbar("Delete failed", { variant: "error" });
    }
  };

  const handleEdit = (alert) => {
    setEditingId(alert._id);
    setEditedAlert({ ...alert });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedAlert({ ...editedAlert, [name]: value });
  };

  const handleSave = async (id) => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData?.token) return;

    try {
      await axios.put(`http://localhost:5557/alerts/${id}`, editedAlert, {
        headers: { Authorization: `Bearer ${userData.token}` },
      });
      enqueueSnackbar("Alert updated successfully", { variant: "success" });
      setEditingId(null);
      setEditedAlert({});
      fetchAlerts();
    } catch (err) {
      enqueueSnackbar("Failed to update alert", { variant: "error" });
    }
  };

  const indexOfLast = currentPage * alertsPerPage;
  const indexOfFirst = indexOfLast - alertsPerPage;
  const currentAlerts = alerts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(alerts.length / alertsPerPage);

  return (
    <>
    <LogingNavBar />
    <div className="min-h-screen bg-cover bg-center bg-fixed" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
          backgroundColor: "rgba(243, 244, 246, 0.85)",
          backgroundBlendMode: "overlay"
        }}>
        <div className="p-6">
      <h1 className="text-4xl text-center font-bold text-gray-800 ml-7 mb-9 mt-5">All Alerts</h1>

      {loading ? (
        <p className="text-gray-500 text-center">Loading alerts...</p>
      ) : currentAlerts.length === 0 ? (
        <p className="text-gray-600 text-center">No alerts found.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 justify-items-center">
            {currentAlerts.map((alert) => {
              const isEditing = editingId === alert._id;
              const data = isEditing ? editedAlert : alert;

              return (
                <div
                  key={alert._id}
                  className="bg-white w-[320px] rounded-xl shadow-md border relative"
                >
                  {/* Tag in top-right corner */}
                  <div className="absolute top-3 right-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${tagColors[data.severity]}`}
                    >
                      {data.severity}
                    </span>
                  </div>

                  <div className="p-4 space-y-3 text-sm mt-10">
                    <div>
                      <label className="block font-medium mb-1">Disease Name</label>
                      <input
                        name="diseaseName"
                        value={data.diseaseName}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-1.5 border rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">Location</label>
                      <input
                        name="location"
                        value={data.location}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-1.5 border rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">Severity</label>
                      <select
                        name="severity"
                        value={data.severity}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-1.5 border rounded-md"
                      >
                        <option value="">Select Severity</option>
                        {severityLevels.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium mb-1">Number of Reports</label>
                      <input
                        name="numberOfReports"
                        type="number"
                        min="0"
                        value={data.numberOfReports}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-1.5 border rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">Date Detected</label>
                      <input
                        name="dateDetected"
                        type="date"
                        value={data.dateDetected?.split("T")[0]}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-1.5 border rounded-md"
                      />
                    </div>

                    <div>
                      <label className="block font-medium mb-1">Description</label>
                      <textarea
                        name="description"
                        rows="2"
                        value={data.description}
                        onChange={handleChange}
                        disabled={!isEditing}
                        className="w-full px-3 py-1.5 border rounded-md"
                      />
                    </div>

                    <div className="flex justify-center gap-4 mt-4">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleSave(alert._id)}
                            className="bg-green-600 text-white px-5 py-1.5 rounded-md hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(null);
                              setEditedAlert({});
                            }}
                            className="bg-gray-400 text-white px-5 py-1.5 rounded-md hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => handleEdit(alert)}
                            className="bg-green-600 text-white px-5 py-1.5 rounded-md hover:bg-green-700"
                          >
                            Update
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(alert._id)}
                            className="bg-red-100 text-red-600 px-5 py-1.5 rounded-md hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center mt-6 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 rounded-md border ${
                    currentPage === i + 1
                      ? "bg-green-600 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
    </div>
    </>
  );
};

export default UpdateAlerts;
