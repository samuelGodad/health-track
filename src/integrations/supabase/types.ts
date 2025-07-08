export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      blood_test_metadata: {
        Row: {
          category: string
          created_at: string | null
          description: string | null
          id: string
          reference_max: number | null
          reference_min: number | null
          test_code: string
          test_name: string
          unit: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description?: string | null
          id?: string
          reference_max?: number | null
          reference_min?: number | null
          test_code: string
          test_name: string
          unit?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string | null
          id?: string
          reference_max?: number | null
          reference_min?: number | null
          test_code?: string
          test_name?: string
          unit?: string | null
        }
        Relationships: []
      }
      blood_test_results: {
        Row: {
          category: string
          created_at: string
          file_hash: string | null
          id: string
          notes: string | null
          processed_by_ai: boolean | null
          reference_max: number | null
          reference_min: number | null
          result: number
          source_file_hash: string | null
          source_file_path: string | null
          source_file_type: string | null
          source_file_url: string | null
          status: string | null
          test_code: string | null
          test_date: string
          test_name: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          file_hash?: string | null
          id?: string
          notes?: string | null
          processed_by_ai?: boolean | null
          reference_max?: number | null
          reference_min?: number | null
          result: number
          source_file_hash?: string | null
          source_file_path?: string | null
          source_file_type?: string | null
          source_file_url?: string | null
          status?: string | null
          test_code?: string | null
          test_date: string
          test_name: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          file_hash?: string | null
          id?: string
          notes?: string | null
          processed_by_ai?: boolean | null
          reference_max?: number | null
          reference_min?: number | null
          result?: number
          source_file_hash?: string | null
          source_file_path?: string | null
          source_file_type?: string | null
          source_file_url?: string | null
          status?: string | null
          test_code?: string | null
          test_date?: string
          test_name?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_metrics: {
        Row: {
          created_at: string
          date: string
          id: string
          metric_name: string
          notes: string | null
          user_id: string
          value: number
        }
        Insert: {
          created_at?: string
          date?: string
          id?: string
          metric_name: string
          notes?: string | null
          user_id: string
          value: number
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          metric_name?: string
          notes?: string | null
          user_id?: string
          value?: number
        }
        Relationships: []
      }
      "Health App": {
        Row: {
          created_at: string
          id: number
        }
        Insert: {
          created_at?: string
          id?: number
        }
        Update: {
          created_at?: string
          id?: number
        }
        Relationships: []
      }
      processed_files: {
        Row: {
          created_at: string
          file_hash: string
          file_name: string
          id: string
          processed_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          file_hash: string
          file_name: string
          id?: string
          processed_at: string
          user_id: string
        }
        Update: {
          created_at?: string
          file_hash?: string
          file_name?: string
          id?: string
          processed_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          date_of_birth: string | null
          ethnicity: string | null
          first_name: string | null
          gender: string | null
          gets_bloods_tested: boolean | null
          height_cm: number | null
          height_unit: string | null
          id: string
          last_name: string | null
          takes_peds: boolean | null
          takes_supplements: boolean | null
          updated_at: string
          weekly_data_day: string | null
          weight: number | null
          weight_unit: string | null
        }
        Insert: {
          created_at?: string
          date_of_birth?: string | null
          ethnicity?: string | null
          first_name?: string | null
          gender?: string | null
          gets_bloods_tested?: boolean | null
          height_cm?: number | null
          height_unit?: string | null
          id: string
          last_name?: string | null
          takes_peds?: boolean | null
          takes_supplements?: boolean | null
          updated_at?: string
          weekly_data_day?: string | null
          weight?: number | null
          weight_unit?: string | null
        }
        Update: {
          created_at?: string
          date_of_birth?: string | null
          ethnicity?: string | null
          first_name?: string | null
          gender?: string | null
          gets_bloods_tested?: boolean | null
          height_cm?: number | null
          height_unit?: string | null
          id?: string
          last_name?: string | null
          takes_peds?: boolean | null
          takes_supplements?: boolean | null
          updated_at?: string
          weekly_data_day?: string | null
          weight?: number | null
          weight_unit?: string | null
        }
        Relationships: []
      }
      user_metric_preferences: {
        Row: {
          created_at: string
          id: string
          metric_name: string
          tracking_frequency: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          metric_name: string
          tracking_frequency: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          metric_name?: string
          tracking_frequency?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_targets: {
        Row: {
          created_at: string
          frequency: string
          id: string
          target_name: string
          target_value: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          frequency: string
          id?: string
          target_name: string
          target_value: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          frequency?: string
          id?: string
          target_name?: string
          target_value?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
