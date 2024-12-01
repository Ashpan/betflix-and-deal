import { createClient as createCClient } from "@/utils/supabase/client";
import { ICreateSessionPayload } from "../types/types";
// import { createClient as createSClient } from "@/utils/supabase/server";

export const createSession = async (payload: ICreateSessionPayload) => {
  const supabase = createCClient();
  const { data, error } = await supabase.from("sessions").insert([payload]);
  return { data, error };
};
