import { supabase } from "../supabaseClient";

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

export const getCertificates = async () => {
  const { data, error } = await supabase.from("certificates").select("*");
  if (error) {
    console.error("Error fetching certificates:", error.message);
    throw error;
  }
  return data;
};
