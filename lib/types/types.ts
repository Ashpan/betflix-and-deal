export interface ICreateSessionPayload {
  name: string;
  buy_in_amount: number;
  code: string;
  created_by: string;
}

export interface IUser extends IMember {
  spId: string;
  isOwner: boolean;
}

export interface ISessionParticipant {
  id: string;
  session_id: string;
  user_id: string;
  buy_ins: number;
  final_stack: number | null;
  status: "invited" | "accepted" | "declined" | "completed";
  created_at: string | null;
  updated_at: string | null;
}

export interface ISessionParticipantProfile extends ISessionParticipant {
  profiles: IMember;
}

export interface IMember {
  id: string;
  username: string;
  display_name: string | null;
  email: string;
  avatar_url: string | null;
}

export interface ISessionDetails {
  id: string;
  code: string;
  name: string;
  created_by: string;
  status: "pending" | "active" | "completed" | "cancelled";
  buy_in_amount: number;
  ended_at: string | null;
  notes: string | null;
  session_participants: ISessionParticipantProfile[];
}

export interface IGameHistory {
  id: string;
  name: string;
  code: string;
  created_at: string;
  ended_at: string;
  status: string;
  buy_ins: number;
  final_stack: number | null;
  profit: number;
}

export interface IGameSession {
  name: string;
  players: ISessionMemberHistory[];
}

export interface ISessionMemberHistory {
  buy_ins: number;
  final_stack: number | null;
  profit: number | null;
  username: string;
  avatar_url: string | null;
  display_name: string | null;
}
