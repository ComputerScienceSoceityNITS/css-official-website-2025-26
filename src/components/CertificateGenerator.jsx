import React from "react";
import { Page, Text, Image, Document, StyleSheet } from "@react-pdf/renderer";
import { positionText } from "../utils/certificateUtils";
import certificateTemplate from "/images/certificate-template.png";

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
  name: positionText("name"),
  event: positionText("event"),
});

const CertificateGenerator = ({ name, event }) => (
  <Document>
    <Page size={[842, 595]} style={styles.page}>
      <Image src={certificateTemplate} style={styles.template} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.event}>{event}</Text>
    </Page>
  </Document>
);

export default CertificateGenerator;
