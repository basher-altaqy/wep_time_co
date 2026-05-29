export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          acceptance_criteria: string | null
          applicant_id: string
          availability_start: string | null
          created_at: string
          deliverable: string | null
          founder_note: string | null
          hourly_rate_ref: number | null
          id: string
          links: Json | null
          mode: Database["public"]["Enums"]["application_mode"]
          requested_amount: number | null
          role: string | null
          status: Database["public"]["Enums"]["application_status"]
          target_date: string | null
          updated_at: string
          venture_id: string
          weekly_hours: number | null
          what_i_offer: string
        }
        Insert: {
          acceptance_criteria?: string | null
          applicant_id: string
          availability_start?: string | null
          created_at?: string
          deliverable?: string | null
          founder_note?: string | null
          hourly_rate_ref?: number | null
          id?: string
          links?: Json | null
          mode: Database["public"]["Enums"]["application_mode"]
          requested_amount?: number | null
          role?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          target_date?: string | null
          updated_at?: string
          venture_id: string
          weekly_hours?: number | null
          what_i_offer: string
        }
        Update: {
          acceptance_criteria?: string | null
          applicant_id?: string
          availability_start?: string | null
          created_at?: string
          deliverable?: string | null
          founder_note?: string | null
          hourly_rate_ref?: number | null
          id?: string
          links?: Json | null
          mode?: Database["public"]["Enums"]["application_mode"]
          requested_amount?: number | null
          role?: string | null
          status?: Database["public"]["Enums"]["application_status"]
          target_date?: string | null
          updated_at?: string
          venture_id?: string
          weekly_hours?: number | null
          what_i_offer?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_applicant_id_fkey"
            columns: ["applicant_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "applications_venture_id_fkey"
            columns: ["venture_id"]
            isOneToOne: false
            referencedRelation: "ventures"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          display_name: string
          headline: string | null
          hourly_value: number | null
          links: Json | null
          skills: string[] | null
          timezone: string | null
          updated_at: string
          user_id: string
          weekly_hours_available: number | null
        }
        Insert: {
          bio?: string | null
          created_at?: string
          display_name: string
          headline?: string | null
          hourly_value?: number | null
          links?: Json | null
          skills?: string[] | null
          timezone?: string | null
          updated_at?: string
          user_id: string
          weekly_hours_available?: number | null
        }
        Update: {
          bio?: string | null
          created_at?: string
          display_name?: string
          headline?: string | null
          hourly_value?: number | null
          links?: Json | null
          skills?: string[] | null
          timezone?: string | null
          updated_at?: string
          user_id?: string
          weekly_hours_available?: number | null
        }
        Relationships: []
      }
      ventures: {
        Row: {
          compensation_mode: Database["public"]["Enums"]["compensation_mode"]
          created_at: string
          founder_id: string
          id: string
          problem: string | null
          required_skills: string[] | null
          slug: string
          stage: Database["public"]["Enums"]["venture_stage"]
          status: Database["public"]["Enums"]["venture_status"]
          target_outcome: string | null
          team_size_target: number | null
          thesis: string
          title: string
          updated_at: string
          weekly_hours_expected: number | null
        }
        Insert: {
          compensation_mode?: Database["public"]["Enums"]["compensation_mode"]
          created_at?: string
          founder_id: string
          id?: string
          problem?: string | null
          required_skills?: string[] | null
          slug: string
          stage?: Database["public"]["Enums"]["venture_stage"]
          status?: Database["public"]["Enums"]["venture_status"]
          target_outcome?: string | null
          team_size_target?: number | null
          thesis: string
          title: string
          updated_at?: string
          weekly_hours_expected?: number | null
        }
        Update: {
          compensation_mode?: Database["public"]["Enums"]["compensation_mode"]
          created_at?: string
          founder_id?: string
          id?: string
          problem?: string | null
          required_skills?: string[] | null
          slug?: string
          stage?: Database["public"]["Enums"]["venture_stage"]
          status?: Database["public"]["Enums"]["venture_status"]
          target_outcome?: string | null
          team_size_target?: number | null
          thesis?: string
          title?: string
          updated_at?: string
          weekly_hours_expected?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "ventures_founder_id_fkey"
            columns: ["founder_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_pending_application: {
        Args: { p_venture_id: string }
        Returns: boolean
      }
    }
    Enums: {
      application_mode: "capacity" | "outcome"
      application_status: "pending" | "accepted" | "rejected" | "withdrawn"
      compensation_mode: "equity" | "cash" | "hybrid" | "volunteer"
      venture_stage: "idea" | "validation" | "building" | "launched"
      venture_status: "draft" | "open" | "closed" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      application_mode: ["capacity", "outcome"],
      application_status: ["pending", "accepted", "rejected", "withdrawn"],
      compensation_mode: ["equity", "cash", "hybrid", "volunteer"],
      venture_stage: ["idea", "validation", "building", "launched"],
      venture_status: ["draft", "open", "closed", "archived"],
    },
  },
} as const
