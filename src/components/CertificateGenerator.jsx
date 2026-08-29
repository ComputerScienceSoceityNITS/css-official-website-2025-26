import React from "react";
import { Page, Text, Image, Document, StyleSheet } from "@react-pdf/renderer";
import defaultTemplate from "/images/certificate-template.png";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#fff",
  },
  template: {
    position: "absolute",
    width: 842,
    height: 595,
  },
  name: {
    position: "absolute",
    top: 250,
    left: 50,
    right: 50,
    textAlign: "center",
    fontSize: 26,
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
    color: "#1e1b18"
  },
  scholarId: {
    position: "absolute",
    top: 295,
    left: 50,
    right: 50,
    textAlign: "center",
    fontSize: 12,
    fontFamily: "Helvetica",
    color: "#6e6a64"
  },
  event: {
    position: "absolute",
    top: 345,
    left: 50,
    right: 50,
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "Helvetica-Bold",
    color: "#1e1b18"
  },
});

const CertificateGenerator = ({ name, scholarId, event, templateUrl }) => (
  <Document>
    <Page size={[842, 595]} style={styles.page}>
      <Image src={templateUrl || defaultTemplate} style={styles.template} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.scholarId}>Scholar ID: {scholarId}</Text>
      <Text style={styles.event}>{event}</Text>
    </Page>
  </Document>
);

export default CertificateGenerator;
