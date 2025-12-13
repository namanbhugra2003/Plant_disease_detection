import React, { useEffect, useState } from "react";
import axios from "axios";
import { PDFDownloadLink } from "@react-pdf/renderer";
import ReportPDF from "../components/ReportPDF";
import { FaDownload } from "react-icons/fa";

const ReportsPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("user"));
        const token = userData?.token;

        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get("http://localhost:5557/manager/reports", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setStats(response.data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  if (!stats) return <p className="text-center text-gray-600">Loading report...</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="p-6 bg-white rounded-lg shadow-lg text-center w-1/2">
        <h2 className="text-3xl font-bold text-green-700 mb-6">📑 Generate Report</h2>

        {/* ✅ Centered Download Button */}
        <div className="flex justify-center">
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
    </div>
  );
};

export default ReportsPage;
