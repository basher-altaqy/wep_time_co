/**
 * هذا الملف يُولّد تلقائيًا بأمر:
 *   npm run db:types
 * أو يدويًا عبر Supabase CLI:
 *   supabase gen types typescript --local > src/types/database.ts
 *
 * النسخة المؤقتة هنا تكفي ليعمل TypeScript حتى توليدها.
 */

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          user_id: string;
          display_name: string;
          headline: string | null;
          bio: string | null;
          skills: string[] | null;
          timezone: string | null;
          weekly_hours_available: number | null;
          hourly_value: number | null;
          links: Record<string, string> | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          user_id: string;
          display_name: string;
          headline?: string | null;
          bio?: string | null;
          skills?: string[] | null;
          timezone?: string | null;
          weekly_hours_available?: number | null;
          hourly_value?: number | null;
          links?: Record<string, string> | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      ventures: {
        Row: {
          id: string;
          slug: string;
          founder_id: string;
          title: string;
          thesis: string;
          problem: string | null;
          target_outcome: string | null;
          stage: "idea" | "validation" | "building" | "launched";
          team_size_target: number | null;
          weekly_hours_expected: number | null;
          compensation_mode: "equity" | "cash" | "hybrid" | "volunteer";
          required_skills: string[] | null;
          status: "draft" | "open" | "closed" | "archived";
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["ventures"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["ventures"]["Insert"]>;
        Relationships: [];
      };
      applications: {
        Row: {
          id: string;
          venture_id: string;
          applicant_id: string;
          mode: "capacity" | "outcome";
          role: string | null;
          weekly_hours: number | null;
          availability_start: string | null;
          hourly_rate_ref: number | null;
          deliverable: string | null;
          target_date: string | null;
          requested_amount: number | null;
          acceptance_criteria: string | null;
          what_i_offer: string;
          links: Array<{ label: string; url: string }> | null;
          status: "pending" | "accepted" | "rejected" | "withdrawn";
          founder_note: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<
          Database["public"]["Tables"]["applications"]["Row"],
          "id" | "created_at" | "updated_at"
        > & {
          id?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["applications"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      has_pending_application: {
        Args: { p_venture_id: string };
        Returns: boolean;
      };
    };
    Enums: {
      venture_stage: "idea" | "validation" | "building" | "launched";
      compensation_mode: "equity" | "cash" | "hybrid" | "volunteer";
      venture_status: "draft" | "open" | "closed" | "archived";
      application_mode: "capacity" | "outcome";
      application_status: "pending" | "accepted" | "rejected" | "withdrawn";
    };
    CompositeTypes: Record<string, never>;
  };
};
