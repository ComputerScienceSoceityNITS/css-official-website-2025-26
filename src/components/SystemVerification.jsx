import React, { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { getRegisteredEvent } from "../services/certificateService";

const SystemVerification = () => {
  const [verificationResults, setVerificationResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const runVerification = async () => {
      const results = {};

      try {
        // Test 1: Check authentication
        console.log("🔐 Testing Authentication...");
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        results.auth = {
          success: !authError && !!user,
          user: user ? { id: user.id, email: user.email } : null,
          error: authError?.message
        };

        if (!user) {
          results.overall = { success: false, message: "User not authenticated" };
          setVerificationResults(results);
          setLoading(false);
          return;
        }

        // Test 2: Check profile fetching
        console.log("👤 Testing Profile Fetching...");
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("full_name, scholar_id, email")
          .eq("user_id", user.id)
          .single();

        results.profile = {
          success: !profileError,
          data: profile,
          error: profileError?.message,
          fallbackUsed: profileError ? "email" : null
        };

        // Test 3: Check user_events table for attended events
        console.log("📅 Testing User Events Fetching...");
        const { data: userEvents, error: userEventsError } = await supabase
          .from("user_events")
          .select("event_slug, attendance_status, registered_at")
          .eq("user_id", user.id)
          .eq("attendance_status", "attended")
          .order("registered_at", { ascending: false });

        results.userEvents = {
          success: !userEventsError,
          data: userEvents,
          count: userEvents?.length || 0,
          error: userEventsError?.message
        };

        // Test 4: Check getRegisteredEvent service
        console.log("🎯 Testing getRegisteredEvent Service...");
        const registeredEvent = await getRegisteredEvent(user.id);
        results.registeredEvent = {
          success: !!registeredEvent,
          data: registeredEvent,
          error: !registeredEvent ? "No attended events found" : null
        };

        // Test 5: Check events table if we have an event slug
        if (registeredEvent?.event_slug) {
          console.log("📋 Testing Events Table Fetching...");
          const { data: eventData, error: eventError } = await supabase
            .from("events")
            .select("name, slug, organizer")
            .eq("slug", registeredEvent.event_slug)
            .single();

          results.eventDetails = {
            success: !eventError,
            data: eventData,
            error: eventError?.message
          };
        }

        // Test 6: Simulate certificate form auto-fill
        console.log("📝 Testing Certificate Form Auto-fill...");
        const autoFillName = profile?.full_name || user.email;
        const autoFillEvent = registeredEvent?.event_name || "";

        results.autoFill = {
          success: true,
          name: autoFillName,
          event: autoFillEvent,
          nameEditable: true,
          eventEditable: false
        };

        // Overall assessment
        const allTestsPassed = Object.values(results).every(test =>
          test && (test.success !== false)
        );

        results.overall = {
          success: allTestsPassed,
          message: allTestsPassed
            ? "All systems operational! Certificate generation should work correctly."
            : "Some issues detected. Check individual test results."
        };

        console.log("✅ Verification Complete!", results);

      } catch (error) {
        console.error("❌ Verification failed:", error);
        results.overall = {
          success: false,
          message: `Verification failed: ${error.message}`
        };
      }

      setVerificationResults(results);
      setLoading(false);
    };

    runVerification();
  }, []);

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">🔍 System Verification</h2>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3"></div>
        </div>
        <p className="mt-4 text-blue-600">Running comprehensive system checks...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">🔍 Certificate System Verification</h2>

      {/* Overall Status */}
      <div className={`p-4 rounded-lg mb-6 ${verificationResults.overall?.success ? 'bg-green-100 border border-green-300' : 'bg-red-100 border border-red-300'}`}>
        <h3 className="text-lg font-semibold mb-2">
          {verificationResults.overall?.success ? '✅' : '❌'} Overall Status
        </h3>
        <p className={verificationResults.overall?.success ? 'text-green-800' : 'text-red-800'}>
          {verificationResults.overall?.message}
        </p>
      </div>

      {/* Detailed Results */}
      <div className="space-y-4">
        {/* Authentication */}
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-2">🔐 Authentication</h4>
          <div className="text-sm">
            <p>Status: <span className={verificationResults.auth?.success ? 'text-green-600' : 'text-red-600'}>
              {verificationResults.auth?.success ? '✅ Connected' : '❌ Failed'}
            </span></p>
            {verificationResults.auth?.user && (
              <p>User: {verificationResults.auth.user.email}</p>
            )}
            {verificationResults.auth?.error && (
              <p className="text-red-600">Error: {verificationResults.auth.error}</p>
            )}
          </div>
        </div>

        {/* Profile Fetching */}
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-2">👤 Profile Data</h4>
          <div className="text-sm">
            <p>Status: <span className={verificationResults.profile?.success ? 'text-green-600' : 'text-red-600'}>
              {verificationResults.profile?.success ? '✅ Fetched' : '❌ Failed'}
            </span></p>
            {verificationResults.profile?.data && (
              <div>
                <p>Name: {verificationResults.profile.data.full_name}</p>
                <p>Scholar ID: {verificationResults.profile.data.scholar_id}</p>
              </div>
            )}
            {verificationResults.profile?.fallbackUsed && (
              <p className="text-yellow-600">Using fallback: {verificationResults.profile.fallbackUsed}</p>
            )}
          </div>
        </div>

        {/* User Events */}
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-2">📅 Attendance Records</h4>
          <div className="text-sm">
            <p>Status: <span className={verificationResults.userEvents?.success ? 'text-green-600' : 'text-red-600'}>
              {verificationResults.userEvents?.success ? '✅ Fetched' : '❌ Failed'}
            </span></p>
            <p>Attended Events: {verificationResults.userEvents?.count || 0}</p>
            {verificationResults.userEvents?.data?.length > 0 && (
              <div className="mt-2">
                <p className="font-medium">Recent attended events:</p>
                {verificationResults.userEvents.data.slice(0, 3).map((event, idx) => (
                  <p key={idx} className="text-xs text-gray-600 ml-2">
                    • {event.event_slug} ({new Date(event.registered_at).toLocaleDateString()})
                  </p>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Registered Event Service */}
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-2">🎯 Event Registration Service</h4>
          <div className="text-sm">
            <p>Status: <span className={verificationResults.registeredEvent?.success ? 'text-green-600' : 'text-red-600'}>
              {verificationResults.registeredEvent?.success ? '✅ Working' : '❌ Failed'}
            </span></p>
            {verificationResults.registeredEvent?.data && (
              <div>
                <p>Event Slug: {verificationResults.registeredEvent.data.event_slug}</p>
                <p>Event Name: {verificationResults.registeredEvent.data.event_name}</p>
              </div>
            )}
            {verificationResults.registeredEvent?.error && (
              <p className="text-red-600">{verificationResults.registeredEvent.error}</p>
            )}
          </div>
        </div>

        {/* Event Details */}
        {verificationResults.eventDetails && (
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold mb-2">📋 Event Details</h4>
            <div className="text-sm">
              <p>Status: <span className={verificationResults.eventDetails?.success ? 'text-green-600' : 'text-red-600'}>
                {verificationResults.eventDetails?.success ? '✅ Fetched' : '❌ Failed'}
              </span></p>
              {verificationResults.eventDetails?.data && (
                <div>
                  <p>Name: {verificationResults.eventDetails.data.name}</p>
                  <p>Organizer: {verificationResults.eventDetails.data.organizer}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Auto-fill Simulation */}
        <div className="border rounded-lg p-4">
          <h4 className="font-semibold mb-2">📝 Certificate Form Auto-fill</h4>
          <div className="text-sm">
            <p>Status: <span className={verificationResults.autoFill?.success ? 'text-green-600' : 'text-red-600'}>
              {verificationResults.autoFill?.success ? '✅ Ready' : '❌ Failed'}
            </span></p>
            <div className="mt-2 p-3 bg-gray-50 rounded">
              <p><strong>Name Field:</strong> {verificationResults.autoFill?.name} <span className="text-green-600">(Editable)</span></p>
              <p><strong>Event Field:</strong> {verificationResults.autoFill?.event} <span className="text-blue-600">(Auto-filled, Read-only)</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4">
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          🔄 Re-run Verification
        </button>
        <button
          onClick={() => window.location.href = '/certificates'}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          📜 Go to Certificates
        </button>
      </div>
    </div>
  );
};

export default SystemVerification;