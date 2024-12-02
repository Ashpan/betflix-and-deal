import { createClient } from "@/utils/supabase/client";
import {
  ICreateSessionPayload,
  IUser,
  ISessionParticipantProfile,
} from "../types/types";

export const createSession = async (payload: ICreateSessionPayload) => {
  const supabase = createClient();
  const { data, error } = await supabase.from("sessions").insert([payload]);
  return { data, error };
};

export const getMembers = async (lobbyCode: string) => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("sessions")
    .select(
      `
      id,
      session_participants (
      id,
      profiles (
        id,
        avatar_url,
        email,
        username,
        display_name
        )
      )`,
    )
    .eq("code", lobbyCode)
    .single();

  const transformedData = (
    data
      ? data.session_participants.map((member: ISessionParticipantProfile) => {
          return { ...member.profiles, sp_id: member.id };
        })
      : null
  ) as IUser[] | null;
  return { data: transformedData, error };
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
