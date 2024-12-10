export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string | null;
          display_name: string | null;
          email: string;
          id: string;
          updated_at: string | null;
          username: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string | null;
          display_name?: string | null;
          email: string;
          id: string;
          updated_at?: string | null;
          username: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string | null;
          display_name?: string | null;
          email?: string;
          id?: string;
          updated_at?: string | null;
          username?: string;
        };
        Relationships: [];
      };
      session_participants: {
        Row: {
          buy_ins: number;
          created_at: string | null;
          final_stack: number | null;
          id: string;
          session_id: string;
          status: string | null;
          updated_at: string | null;
          user_id: string;
        };
        Insert: {
          buy_ins: number;
          created_at?: string | null;
          final_stack?: number | null;
          id?: string;
          session_id: string;
          status?: string | null;
          updated_at?: string | null;
          user_id: string;
        };
        Update: {
          buy_ins?: number;
          created_at?: string | null;
          final_stack?: number | null;
          id?: string;
          session_id?: string;
          status?: string | null;
          updated_at?: string | null;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "session_participants_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "sessions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "session_participants_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "player_stats";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "session_participants_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      sessions: {
        Row: {
          buy_in_amount: number;
          code: string;
          created_at: string | null;
          created_by: string;
          ended_at: string | null;
          id: string;
          name: string | null;
          notes: string | null;
          status: string | null;
        };
        Insert: {
          buy_in_amount: number;
          code: string;
          created_at?: string | null;
          created_by: string;
          ended_at?: string | null;
          id?: string;
          name?: string | null;
          notes?: string | null;
          status?: string | null;
        };
        Update: {
          buy_in_amount?: number;
          code?: string;
          created_at?: string | null;
          created_by?: string;
          ended_at?: string | null;
          id?: string;
          name?: string | null;
          notes?: string | null;
          status?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "sessions_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "player_stats";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "sessions_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      settlements: {
        Row: {
          amount: number;
          created_at: string | null;
          id: string;
          payee_id: string;
          payer_id: string;
          session_id: string;
          settled_at: string | null;
          status: string | null;
        };
        Insert: {
          amount: number;
          created_at?: string | null;
          id?: string;
          payee_id: string;
          payer_id: string;
          session_id: string;
          settled_at?: string | null;
          status?: string | null;
        };
        Update: {
          amount?: number;
          created_at?: string | null;
          id?: string;
          payee_id?: string;
          payer_id?: string;
          session_id?: string;
          settled_at?: string | null;
          status?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "settlements_payee_id_fkey";
            columns: ["payee_id"];
            isOneToOne: false;
            referencedRelation: "player_stats";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "settlements_payee_id_fkey";
            columns: ["payee_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "settlements_payer_id_fkey";
            columns: ["payer_id"];
            isOneToOne: false;
            referencedRelation: "player_stats";
            referencedColumns: ["user_id"];
          },
          {
            foreignKeyName: "settlements_payer_id_fkey";
            columns: ["payer_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "settlements_session_id_fkey";
            columns: ["session_id"];
            isOneToOne: false;
            referencedRelation: "sessions";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      player_stats: {
        Row: {
          avg_profit_per_session: number | null;
          display_name: string | null;
          net_profit: number | null;
          total_sessions: number | null;
          user_id: string | null;
        };
        Relationships: [];
      };
    };
    Functions: {
      add_member_to_session: {
        Args: {
          p_session_code: string;
          p_user_id: string;
        };
        Returns: boolean;
      };
      calculate_session_settlements: {
        Args: {
          p_session_id: string;
        };
        Returns: {
          payer_id: string;
          payee_id: string;
          amount: number;
        }[];
      };
      delete_member_from_session: {
        Args: {
          p_session_code: string;
          p_user_id: string;
        };
        Returns: boolean;
      };
      get_session_member: {
        Args: {
          p_user_id: string;
          p_session_code: string;
        };
        Returns: Json;
      };
      get_session_participants: {
        Args: {
          p_session_code: string;
        };
        Returns: Json;
      };
      get_user_settlements: {
        Args: {
          p_user_id: string;
        };
        Returns: {
          session_id: string;
          session_name: string;
          session_code: string;
          other_user_id: string;
          other_user_name: string;
          amount: number;
          is_payer: boolean;
          status: string;
          created_at: string;
        }[];
      };
      join_session: {
        Args: {
          p_session_code: string;
        };
        Returns: Json;
      };
      leave_session: {
        Args: {
          p_session_code: string;
        };
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;
