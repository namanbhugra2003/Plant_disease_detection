import React, { useState, useEffect } from "react";
import { Bar, Line } from "react-chartjs-2";
import SupplierSidebar from "../components/SupplierSidebar";
import { FaBoxes, FaUsers, FaChartLine, FaDownload } from "react-icons/fa";
import {
  Page,
  Text,
  View,
  Document,
  StyleSheet,
  PDFDownloadLink,
  Image,
} from "@react-pdf/renderer";
import { Chart as ChartJS } from "chart.js/auto";
import ManagerNavBar from "../components/ManagerNavBar";

// PDF styles
const styles = StyleSheet.create({
  page: { padding: 30, backgroundColor: "#f3f4f6" },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
    color: "#1f2937",
  },
  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    width: "30%",
  },
  cardTitle: { fontSize: 14, color: "#4b5563", marginBottom: 5 },
  cardValue: { fontSize: 18, fontWeight: "bold", color: "#111827" },
  chartContainer: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1f2937",
    marginBottom: 10,
  },
  chart: { height: 200, width: "100%" },
  header: {
    fontSize: 12,
    marginBottom: 20,
    textAlign: "right",
    color: "#4b5563",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: "center",
    color: "#4b5563",
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
  },
});

// PDF Document component
const SupplierAnalyticsPDF = ({
  analyticsData,
  barChartImage,
  lineChartImage,
}) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <Text style={styles.header}>
        Generated on: {new Date().toLocaleString()}
      </Text>

      <Text style={styles.title}>Supplier Analytics Report</Text>

      <View style={styles.cardContainer}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Most Sold Supplier</Text>
          <Text style={styles.cardValue}>
            {analyticsData.mostSoldSupplier.name}
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Units Sold</Text>
          <Text style={styles.cardValue}>
            {analyticsData.mostSoldMaterial.reduce(
              (acc, item) => acc + item.unitsSold,
              0
            )}
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Total Orders</Text>
          <Text style={styles.cardValue}>
            {analyticsData.mostSoldMaterial.reduce(
              (acc, item) => acc + item.unitsSold,
              0
            )}
          </Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Most Sold Materials</Text>
        <Image style={styles.chart} src={barChartImage} />
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Sales Trend</Text>
        <Image style={styles.chart} src={lineChartImage} />
      </View>

      {/* Footer */}
      <Text style={styles.footer}>
        © 2023 SMART AGRIGUARD. All rights reserved.
      </Text>
    </Page>
  </Document>
);

const SupplierAnalytics = () => {
  const [barChartImage, setBarChartImage] = useState(null);
  const [lineChartImage, setLineChartImage] = useState(null);
  const [pdfReady, setPdfReady] = useState(false);

  // Dummy data for analytics
  const analyticsData = {
    mostSoldMaterial: [
      { name: "Fertilizer A", unitsSold: 150 },
      { name: "Pesticide B", unitsSold: 120 },
      { name: "Seed C", unitsSold: 90 },
    ],
    mostSoldSupplier: { name: "Supplier X" },
    salesTrend: [100, 120, 150, 130, 170, 160], // Example sales trend data
  };

  const { mostSoldMaterial, mostSoldSupplier, salesTrend } = analyticsData;

  const barChartData = {
    labels: mostSoldMaterial.map((item) => item.name),
    datasets: [
      {
        label: "Units Sold",
        data: mostSoldMaterial.map((item) => item.unitsSold),
        backgroundColor: "rgba(59, 130, 246, 0.6)",
      },
    ],
  };

  const lineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Sales Trend",
        data: salesTrend,
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  const generateChartImages = () => {
    const chartOptions = {
      responsive: false,
      animation: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
        },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    const barCanvas = document.createElement("canvas");
    barCanvas.width = 600;
    barCanvas.height = 300;
    new ChartJS(barCanvas, {
      type: "bar",
      data: barChartData,
      options: { ...chartOptions, maintainAspectRatio: false },
    });
    setBarChartImage(barCanvas.toDataURL());

    const lineCanvas = document.createElement("canvas");
    lineCanvas.width = 600;
    lineCanvas.height = 300;
    new ChartJS(lineCanvas, {
      type: "line",
      data: lineChartData,
      options: { ...chartOptions, maintainAspectRatio: false },
    });
    setLineChartImage(lineCanvas.toDataURL());
  };

  useEffect(() => {
    generateChartImages();
  }, []);

  useEffect(() => {
    if (barChartImage && lineChartImage) {
      setPdfReady(true);
    }
  }, [barChartImage, lineChartImage]);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')",
        backgroundColor: "rgba(243, 244, 246, 1.2)",
        backgroundBlendMode: "overlay",
      }}
    >
      <ManagerNavBar />
      <div className="flex h-screen">
        <SupplierSidebar />
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto px-4 py-28">
            <div className="flex justify-between items-center mb-12">
              <h1 className="text-3xl font-bold text-gray-700">
                Supplier Analytics
              </h1>
              {pdfReady ? (
                <PDFDownloadLink
                  document={
                    <SupplierAnalyticsPDF
                      analyticsData={analyticsData}
                      barChartImage={barChartImage}
                      lineChartImage={lineChartImage}
                    />
                  }
                  fileName="supplier_analytics.pdf"
                >
                  {({ blob, url, loading, error }) => (
                    <button
                      className="bg-green-700 hover:bg-green-900 text-white font-bold py-2 px-4 rounded flex items-center"
                      disabled={loading}
                    >
                      <FaDownload className="mr-2" />
                      {loading ? "Loading document..." : "Download PDF"}
                    </button>
                  )}
                </PDFDownloadLink>
              ) : (
                <button
                  className="bg-gray-400 text-white font-bold py-2 px-4 rounded flex items-center"
                  disabled
                >
                  <FaDownload className="mr-2" />
                  Preparing PDF...
                </button>
              )}
            </div>

            {/* Cards for Key Statistics */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Most Sold Supplier"
                value={mostSoldSupplier.name}
                icon={<FaUsers className="text-blue-500" size={24} />}
              />
              <StatCard
                title="Total Units Sold"
                value={mostSoldMaterial.reduce(
                  (acc, item) => acc + item.unitsSold,
                  0
                )}
                icon={<FaBoxes className="text-green-500" size={24} />}
              />
              <StatCard
                title="Total Orders"
                value={mostSoldMaterial.reduce(
                  (acc, item) => acc + item.unitsSold,
                  0
                )}
                icon={<FaChartLine className="text-purple-500" size={24} />}
              />
            </div>

            {/* Charts */}
           {/* Charts */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
  <ChartCard title="Most Sold Material">
    <Bar
      data={{
        ...barChartData,
        datasets: [
          {
            ...barChartData.datasets[0],
            backgroundColor: [
              "rgba(246, 189, 96, 0.9)",  // Golden yellow
              "rgba(77, 182, 172, 0.9)",  // Teal
              "rgba(229, 115, 115, 0.9)",  // Light red
            ],
            borderColor: [
              "rgba(246, 189, 96, 1)",
              "rgba(77, 182, 172, 1)",
              "rgba(229, 115, 115, 1)",
            ],
            borderWidth: 0,
            borderRadius: 6,
            maxBarThickness: 50,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            titleColor: "#333",
            bodyColor: "#333",
            borderColor: "#ddd",
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
            titleFont: {
              size: 14,
              weight: "bold",
            },
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#555", font: { size: 12 } },
          },
          y: {
            grid: { color: "rgba(0, 0, 0, 0.05)" },
            ticks: { color: "#555", font: { size: 12 } },
          },
        },
      }}
    />
  </ChartCard>
  <ChartCard title="Sales Trend">
    <Line
      data={{
        ...lineChartData,
        datasets: [
          {
            ...lineChartData.datasets[0],
            label: "Online Sales",
            borderColor: "rgba(33, 150, 243, 1)",  // Blue
            backgroundColor: "rgba(33, 150, 243, 0.1)",
            pointBackgroundColor: "rgba(33, 150, 243, 1)",
            pointBorderColor: "#fff",
            borderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.4,
            fill: true,
          },
          {
            label: "Offline Sales",
            data: [80, 110, 70, 130, 90, 120],
            borderColor: "rgba(255, 152, 0, 1)",  // Orange
            backgroundColor: "rgba(255, 152, 0, 0.1)",
            pointBackgroundColor: "rgba(255, 152, 0, 1)",
            pointBorderColor: "#fff",
            borderWidth: 3,
            pointRadius: 4,
            pointHoverRadius: 6,
            tension: 0.4,
            fill: true,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "top",
            align: "end",
            labels: {
              boxWidth: 12,
              usePointStyle: true,
              pointStyle: "circle",
              padding: 20,
              color: "#555",
              font: {
                size: 12,
              },
            },
          },
          tooltip: {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            titleColor: "#333",
            bodyColor: "#333",
            borderColor: "#ddd",
            borderWidth: 1,
            padding: 12,
            cornerRadius: 8,
          },
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#555", font: { size: 12 } },
          },
          y: {
            grid: { color: "rgba(0, 0, 0, 0.05)" },
            ticks: { color: "#555", font: { size: 12 } },
          },
        },
      }}
    />
  </ChartCard>
</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-1">{title}</h3>
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
      </div>
      <div className="bg-blue-50 p-3 rounded-full">
        {React.cloneElement(icon, { className: "text-blue-500" })}
      </div>
    </div>
    <div className="mt-4 flex items-center">
      <span className="text-green-500 text-sm font-medium">+12.5%</span>
      <span className="text-gray-500 text-sm ml-2">from last month</span>
    </div>
  </div>
);

const ChartCard = ({ title, children }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
    <div className="flex justify-between items-center mb-6">
      <h2 className="text-lg font-medium text-gray-700">{title}</h2>
      <button className="text-gray-400 hover:text-gray-600">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM16 12a2 2 0 100-4 2 2 0 000 4z" />
        </svg>
      </button>
    </div>
    <div className="h-64">{children}</div>
  </div>
);

export default SupplierAnalytics;
