import React, { useState, useEffect } from "react";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CertificateGenerator from "../components/CertificateGenerator";
import { saveCertificate, getRegisteredEvent } from "../services/certificateService";
import { supabase } from "../supabaseClient";

const Certificates = () => {
  const [name, setName] = useState("");
  const [event, setEvent] = useState("");
  const [eventSlug, setEventSlug] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (!user) {
        setStatus("unauthenticated");
        setLoading(false);
        return;
      }

      // Fetch user profile data
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("user_id", user.id)
        .single();

      if (profileError) {
        console.error("Error fetching profile:", profileError);
        setName(user.email); // Fallback to email
      } else {
        setName(profile?.full_name || user.email);
      }

      // Fetch attended event
      const registeredEvent = await getRegisteredEvent(user.id);
      if (registeredEvent) {
        setEvent(registeredEvent.event_name);
        setEventSlug(registeredEvent.event_slug);
        setStatus("attended"); // If we got an attended event, status is attended
      } else {
        setStatus("not_attended");
      }

      setLoading(false);
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    await saveCertificate({ name, event });
    alert("Certificate metadata saved to Supabase!");
  };

  if (loading) {
    return <p className="text-center mt-6">Loading certificate data...</p>;
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Generate Certificate</h1>

      {status === "attended" ? (
        <>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name (Editable)
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2 w-full rounded bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name for the certificate"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Event (Auto-filled)
              </label>
              <input
                type="text"
                value={event}
                readOnly
                className="border p-2 w-full rounded bg-gray-100 cursor-not-allowed"
              />
            </div>
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
                Download Certificate (Waiting for data)
              </button>
            )}

            <button
              onClick={handleSave}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Save to Supabase
            </button>
          </div>
        </>
      ) : status === "unauthenticated" ? (
        <p className="text-center text-red-600 font-semibold">
          Please log in to access your certificate.
        </p>
      ) : (
        <p className="text-center text-red-600 font-semibold">
          You can only download a certificate after attending the event.
        </p>
      )}
    </div>
  );
};

export default Certificates;
