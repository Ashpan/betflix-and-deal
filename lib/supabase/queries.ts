import { createClient } from "@/utils/supabase/client";
import { ICreateSessionPayload, IUser } from "../types/types";

export const createSession = async (payload: ICreateSessionPayload) => {
  const supabase = createClient();
  const { data, error } = await supabase.from("sessions").insert([payload]);
  return { data, error };
};

export const getSessionMembers = async (lobbyCode: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_session_participants", {
    p_session_code: lobbyCode,
  });
  return { data, error };
};

export const getSessionMember = async (userId: string, sessionCode: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("get_session_member", {
    p_user_id: userId,
    p_session_code: sessionCode,
  });
  return { data, error };
};

export const getMember = async (userId: string, sessionCode: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("session_participants")
    .select(
      `
    sp_id:id,
    profiles!inner(
      avatar_url,
      display_name,
      email,
      id,
      username
    ),
    sessions!inner()
    `,
    )
    .eq("user_id", userId)
    .eq("sessions.code", sessionCode)
    .single();
  const transformedData = (
    data
      ? {
          sp_id: data.sp_id,
          ...data.profiles,
        }
      : null
  ) as IUser | null;
  return { data: transformedData, error };
};

export const getSession = async (lobbyCode: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("code", lobbyCode)
    .single();
  return { data, error };
};

export const isUserInSession = async (userId: string, lobbyCode: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("session_participants(id)")
    .eq("code", lobbyCode)
    .eq("session_participants.user_id", userId);
  if (error) {
    console.error(error);
    return false;
  }
  const members = data[0]?.session_participants;
  if (!members || members.length === 0) {
    console.error("User is not in session");
    return false;
  }
  return true;
};

export const joinSession = async (sessionCode: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("join_session", {
    p_session_code: sessionCode,
  });
  return { data, error };
};

export const leaveSession = async (sessionCode: string) => {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("leave_session", {
    p_session_code: sessionCode,
  });
  return { data, error };
};

export const getSessionDetails = async (sessionCode: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("code", sessionCode)
    .single();
  return { data, error };
};

export const getAllMembers = async () => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("id, username, display_name, email, avatar_url");
  return { data, error };
};

export const addMemberToSession = async (
  userId: string,
  sessionCode: string,
) => {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("add_member_to_session", {
    p_session_code: sessionCode,
    p_user_id: userId,
  });
  return { data, error };
};

export const kickMemberFromSession = async (
  userId: string,
  sessionCode: string,
) => {
  const supabase = createClient();
  const { data, error } = await supabase.rpc("delete_member_from_session", {
    p_session_code: sessionCode,
    p_user_id: userId,
  });
  return { data, error };
};
