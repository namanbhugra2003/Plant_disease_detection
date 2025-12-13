import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Line } from "react-chartjs-2";
import { motion } from "framer-motion";
import { FaBug, FaClipboardCheck, FaHourglassHalf, FaSpinner, FaDownload } from "react-icons/fa";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReportPDF from "../components/ReportPDF";
import "chart.js/auto";

const ReportsTab = () => {
  const [stats, setStats] = useState(null);
  const [viewMode, setViewMode] = useState("weekly");
  const [lineData, setLineData] = useState({ labels: [], inquiries: [], replies: [] });
  const [refreshFlag, setRefreshFlag] = useState(false);

  // Refetch reports stats once on load
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    if (!token) return;

    const fetchStats = async () => {
      try {
        const res = await axios.get("http://localhost:5557/manager/reports", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, []);

  // Refetch line chart data
  useEffect(() => {
    const token = JSON.parse(localStorage.getItem("user"))?.token;
    if (!token) return;

    const fetchLineData = async () => {
      try {
        const endpoint =
          viewMode === "monthly"
            ? "http://localhost:5557/manager/reports/monthly"
            : "http://localhost:5557/manager/forms";

        const res = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (viewMode === "monthly") {
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
            "Aug", "Sep", "Oct", "Nov", "Dec"];
          const labels = res.data.map((r) => months[r._id - 1]);
          const inquiries = res.data.map((r) => r.total);
          const replies = res.data.map((r) => r.resolved || 0);
          setLineData({ labels, inquiries, replies });
        } else {
          const weeklyInquiries = Array(7).fill(0);
          const weeklyReplies = Array(7).fill(0);

          res.data.forEach((item) => {
            const date = new Date(item.requestDate);
            const day = date.getDay();
            const idx = day === 0 ? 6 : day - 1;
            weeklyInquiries[idx]++;
            if (item.reply?.trim()) weeklyReplies[idx]++;
          });

          setLineData({
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            inquiries: weeklyInquiries,
            replies: weeklyReplies,
          });
        }
      } catch (err) {
        console.error("Error fetching line chart data:", err);
      }
    };

    fetchLineData();
  }, [viewMode, refreshFlag]);

  // Auto-refresh if tab becomes active again (e.g., reply added from another tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setRefreshFlag((prev) => !prev);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  if (!stats) {
    return (
      <div className="flex justify-center items-center h-64 text-gray-500">
        <FaSpinner className="animate-spin mr-2" /> Loading reports...
      </div>
    );
  }

  const barChartData = {
    labels: stats.commonDiseases.map((d) => d._id),
    datasets: [
      {
        label: "Most Reported Diseases",
        data: stats.commonDiseases.map((d) => d.count),
        backgroundColor: [
          "#06b6d4", // Cyan-500
          "#6366f1", // Indigo-500
          "#eab308", // Yellow-500
          "#f43f5e", // Rose-500
          "#22c55e", // Green-500
        ],
        borderRadius: 10,
        barThickness: 70,
      },
    ],
  };

  const lineChartData = {
    labels: lineData.labels,
    datasets: [
      {
        label: "Inquiries",
        data: lineData.inquiries,
        fill: false,
        tension: 0.4,
        borderColor: "#3b82f6",
        backgroundColor: "#3b82f6",
        pointBackgroundColor: "#3b82f6",
        pointBorderColor: "#fff",
        pointRadius: 5,
        pointHoverRadius: 6,
      },
      {
        label: "Replies",
        data: lineData.replies,
        fill: false,
        tension: 0.4,
        borderColor: "#10b981",
        backgroundColor: "#10b981",
        pointBackgroundColor: "#10b981",
        pointBorderColor: "#fff",
        pointRadius: 5,
        pointHoverRadius: 6,
      },
    ],
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Reports Dashboard</h1>
        <p className="text-gray-500">Insight into reported crop issues and their resolution status.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Reports</p>
              <p className="text-3xl font-bold text-gray-800">{stats.totalReports}</p>
              <p className="text-green-500 text-sm mt-1">+{stats.totalReports} in total</p>
            </div>
            <div className="bg-blue-500 p-3 rounded-full text-white">
              <FaBug size={20} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Pending Reports</p>
              <p className="text-3xl font-bold text-gray-800">{stats.pendingReports}</p>
              <p className="text-red-500 text-sm mt-1">+{stats.pendingReports} pending</p>
            </div>
            <div className="bg-yellow-500 p-3 rounded-full text-white">
              <FaHourglassHalf size={20} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">Resolved Reports</p>
              <p className="text-3xl font-bold text-gray-800">{stats.resolvedReports}</p>
              <p className="text-green-500 text-sm mt-1">+{stats.resolvedReports} resolved</p>
            </div>
            <div className="bg-green-500 p-3 rounded-full text-white">
              <FaClipboardCheck size={20} />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-6 rounded-lg shadow-md hover:shadow-lg transition">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-1">In Progress</p>
              <p className="text-3xl font-bold text-gray-800">
                {stats.totalReports - stats.pendingReports - stats.resolvedReports}
              </p>
              <p className="text-indigo-500 text-sm mt-1">Currently processing</p>
            </div>
            <div className="bg-indigo-500 p-3 rounded-full text-white">
              <FaSpinner size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-white border rounded-2xl shadow-md p-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Most Common Diseases</h3>
              <span className="text-sm text-green-600">View All</span>
            </div>
            <div style={{ height: "300px" }}>
              <Bar
                data={barChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: { legend: { display: false } },
                  scales: {
                    y: { ticks: { beginAtZero: true, font: { size: 12 } } },
                    x: { ticks: { font: { size: 12 } } },
                  },
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* Line Chart */}
        <div className="bg-white border rounded-2xl shadow-md p-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Inquiry Trends</h3>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                className="border px-3 py-1 rounded-lg text-sm focus:outline-none focus:ring focus:border-green-400"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            <div style={{ height: "300px", width: "100%" }}>
              <Line
                data={lineChartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                      align: "end",
                      labels: { boxWidth: 20, font: { size: 12 } },
                    },
                  },
                  scales: {
                    y: { beginAtZero: true, ticks: { font: { size: 12 } } },
                    x: { ticks: { font: { size: 12 } } },
                  },
                }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Download Report Button */}
      <div className="mt-10 flex justify-center">
        <PDFDownloadLink
          document={<ReportPDF stats={stats} />}
          fileName="Crop_Disease_Report.pdf"
        >
          {({ loading }) =>
            loading ? (
              <button className="px-6 py-3 bg-gray-400 text-white font-bold rounded-lg">
                Generating PDF...
              </button>
            ) : (
              <button className="px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 flex items-center justify-center">
                <FaDownload className="mr-2" /> Download Report
              </button>
            )
          }
        </PDFDownloadLink>
      </div>
    </div>
  );
};

export default ReportsTab;
