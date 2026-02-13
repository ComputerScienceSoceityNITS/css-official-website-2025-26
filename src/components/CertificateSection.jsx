// components/CertificateSection.jsx
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabaseClient";

const CertificateSection = () => {
  const [showCertificate, setShowCertificate] = useState(false);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const checkAttendanceStatus = async () => {
      try {
        if (!user) return;

        // Check if user has any attended events
        const { data, error } = await supabase
          .from("user_events")
          .select("attendance_status")
          .eq("user_id", user.id)
          .eq("attendance_status", "attended");

        if (error) {
          console.error("Error checking attendance:", error);
          setError("Failed to check certificate status");
          return;
        }

        // Show certificate if user has attended any event
        if (data && data.length > 0) {
          setShowCertificate(true);
        }
      } catch (err) {
        console.error("Error in checkAttendanceStatus:", err);
        setError("An error occurred while checking certificates");
      }
    };

    checkAttendanceStatus();
  }, [user]);


  console.log("CertificateSection: Component rendered", { user: !!user, error, showCertificate });

  if (error) {
    console.error("Certificate error:", error);
    return (
      <div className="mt-6">
        <p className="text-red-400 text-sm">
          Certificate check failed: {error}
        </p>
      </div>
    );
  }

  if (!showCertificate) {
    return (
      <div className="mt-6">
        <p className="text-gray-600 text-sm">
          No certificates for download 
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold text-green-700 mb-2">
        🎉 You attended the event!
      </h2>
      <a
        href="/certificates"
        className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Download Your Certificate
      </a>
    </div>
  );
};

export default CertificateSection;
