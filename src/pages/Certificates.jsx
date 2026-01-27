import React, { useState } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CertificateGenerator from "../components/CertificateGenerator";
import { saveCertificate } from "../services/certificateService";

const Certificates = () => {
  const [name, setName] = useState("");
  const [event, setEvent] = useState("");

  const handleSave = async () => {
    await saveCertificate({ name, event });
    alert("Certificate metadata saved to Supabase!");
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Generate Certificate</h1>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 w-full rounded"
        />
        <input
          type="text"
          placeholder="Enter Event"
          value={event}
          onChange={(e) => setEvent(e.target.value)}
          className="border p-2 w-full rounded"
        />
      </form>

      <div className="mt-6 space-x-4">
        {name && event ? (
          <PDFDownloadLink
            document={<CertificateGenerator name={name} event={event} />}
            fileName={`${name}-certificate.pdf`}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {({ loading }) =>
              loading ? "Generating PDF..." : "Download Certificate"
            }
          </PDFDownloadLink>
        ) : (
          <button
            className="inline-block px-4 py-2 bg-gray-400 text-white rounded cursor-not-allowed"
            disabled
          >
            Download Certificate (Fill all fields)
          </button>
        )}

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Save to Supabase
        </button>
      </div>
    </div>
  );
};

export default Certificates;
