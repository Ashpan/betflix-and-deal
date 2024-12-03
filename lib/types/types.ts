export interface ICreateSessionPayload {
  name: string;
  buy_in_amount: number;
  code: string;
  created_by: string;
}

export interface IProfile {
  id: string;
  email: string;
  username: string;
  avatar_url: string | null;
  display_name: string | null;
}

export interface IUser extends IProfile {
  sp_id: string;
}

export interface ISessionParticipantProfile {
  id: string;
  profiles: IProfile[];
}
