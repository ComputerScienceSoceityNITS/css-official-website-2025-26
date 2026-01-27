import { supabase } from "../supabaseClient";

// Save certificate metadata
export const saveCertificate = async ({ name, event }) => {
  const { data, error } = await supabase
    .from("certificates")
    .insert([{ name, event }]);

  if (error) {
    console.error("Error saving certificate:", error.message);
    throw error;
  }
  return data;
};

// Fetch all certificates
export const getCertificates = async () => {
  const { data, error } = await supabase.from("certificates").select("*");
  if (error) {
    console.error("Error fetching certificates:", error.message);
    throw error;
  }
  return data;
};

// Fetch registered event for a user
export const getRegisteredEvent = async (userId) => {
  // Get the most recent attended user_event
  const { data: userEvent, error: userError } = await supabase
    .from("user_events")
    .select("event_slug")
    .eq("user_id", userId)
    .eq("attendance_status", "attended")
    .order("registered_at", { ascending: false })
    .limit(1)
    .single();

  if (userError || !userEvent) {
    console.error("Error fetching attended event:", userError?.message);
    return null;
  }

  // Get the event details from events table
  const { data: eventData, error: eventError } = await supabase
    .from("events")
    .select("name, slug")
    .eq("slug", userEvent.event_slug)
    .single();

  if (eventError || !eventData) {
    console.error("Error fetching event details:", eventError?.message);
    return null;
  }

  return {
    event_slug: userEvent.event_slug,
    event_name: eventData.name
  };
};
