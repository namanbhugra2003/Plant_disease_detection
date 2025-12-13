import React from "react";
import { Page, Text, View, Document, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: "Helvetica" },
  header: { fontSize: 24, textAlign: "center", marginBottom: 20, fontWeight: "bold" },
  section: { marginBottom: 15 },
  label: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  value: { fontSize: 14, marginBottom: 4 },
  tableHeader: {
    flexDirection: "row",
    borderBottom: "1px solid #444",
    backgroundColor: "#e0e0e0",
    paddingVertical: 6,
  },
  tableRow: {
    flexDirection: "row",
    borderBottom: "1px solid #ccc",
    paddingVertical: 4,
  },
  cell: { width: "50%", fontSize: 12, textAlign: "center" },
});

const ReportPDF = ({ stats }) => (
  <Document>
    <Page style={styles.page}>
      <Text style={styles.header}>Crop Disease Report Summary</Text>

      {/* 🧾 Report Stats */}
      <View style={styles.section}>
        <Text style={styles.label}>Overview</Text>
        <Text style={styles.value}>Total Reports: {stats.totalReports}</Text>
        <Text style={styles.value}>Pending Reports: {stats.pendingReports}</Text>
        <Text style={styles.value}>Resolved Reports: {stats.resolvedReports}</Text>
      </View>

      {/* 🦠 Disease Table */}
      <View style={styles.section}>
        <Text style={styles.label}>Most Common Diseases</Text>
        <View style={styles.tableHeader}>
          <Text style={styles.cell}>Disease</Text>
          <Text style={styles.cell}>Reported Cases</Text>
        </View>
        {stats.commonDiseases.map((disease, i) => (
          <View key={i} style={styles.tableRow}>
            <Text style={styles.cell}>{disease._id}</Text>
            <Text style={styles.cell}>{disease.count}</Text>
          </View>
        ))}
      </View>

      {/* Summary */}
      <View style={styles.section}>
        <Text style={styles.label}>Summary</Text>
        <Text style={styles.value}>
          This report reflects patterns in crop disease submissions. Use this information to monitor
          trends, take proactive measures, and assist farmers efficiently.
        </Text>
      </View>
    </Page>
  </Document>
);

export default ReportPDF;
