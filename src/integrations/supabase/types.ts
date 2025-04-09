export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          created_at: string
          driver_id: string
          email: string
          first_name: string
          id: string
          last_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          driver_id: string
          email: string
          first_name: string
          id?: string
          last_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          driver_id?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      company_settings: {
        Row: {
          banner_url: string | null
          created_at: string
          driver_id: string
          font_family: string | null
          id: string
          is_trial: boolean | null
          logo_url: string | null
          primary_color: string | null
          secondary_color: string | null
          updated_at: string
        }
        Insert: {
          banner_url?: string | null
          created_at?: string
          driver_id: string
          font_family?: string | null
          id?: string
          is_trial?: boolean | null
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string
        }
        Update: {
          banner_url?: string | null
          created_at?: string
          driver_id?: string
          font_family?: string | null
          id?: string
          is_trial?: boolean | null
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_settings_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      distance_pricing_tiers: {
        Row: {
          created_at: string
          driver_id: string
          id: string
          max_km: number | null
          min_km: number
          price_per_km: number
          updated_at: string
          vehicle_id: string | null
          vehicle_type_id: string | null
        }
        Insert: {
          created_at?: string
          driver_id: string
          id?: string
          max_km?: number | null
          min_km: number
          price_per_km: number
          updated_at?: string
          vehicle_id?: string | null
          vehicle_type_id?: string | null
        }
        Update: {
          created_at?: string
          driver_id?: string
          id?: string
          max_km?: number | null
          min_km?: number
          price_per_km?: number
          updated_at?: string
          vehicle_id?: string | null
          vehicle_type_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "distance_pricing_tiers_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "distance_pricing_tiers_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "distance_pricing_tiers_vehicle_type_id_fkey"
            columns: ["vehicle_type_id"]
            isOneToOne: false
            referencedRelation: "vehicle_types"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing: {
        Row: {
          base_fare: number
          created_at: string
          driver_id: string
          holiday_sunday_percentage: number | null
          id: string
          min_fare: number
          minimum_trip_fare: number | null
          minimum_trip_minutes: number | null
          night_rate_enabled: boolean | null
          night_rate_end: string | null
          night_rate_percentage: number | null
          night_rate_start: string | null
          price_per_km: number
          service_area: string | null
          updated_at: string
          vehicle_id: string | null
          wait_night_enabled: boolean | null
          wait_night_end: string | null
          wait_night_percentage: number | null
          wait_night_start: string | null
          wait_price_per_15min: number | null
          waiting_fee_per_minute: number
        }
        Insert: {
          base_fare: number
          created_at?: string
          driver_id: string
          holiday_sunday_percentage?: number | null
          id?: string
          min_fare: number
          minimum_trip_fare?: number | null
          minimum_trip_minutes?: number | null
          night_rate_enabled?: boolean | null
          night_rate_end?: string | null
          night_rate_percentage?: number | null
          night_rate_start?: string | null
          price_per_km: number
          service_area?: string | null
          updated_at?: string
          vehicle_id?: string | null
          wait_night_enabled?: boolean | null
          wait_night_end?: string | null
          wait_night_percentage?: number | null
          wait_night_start?: string | null
          wait_price_per_15min?: number | null
          waiting_fee_per_minute: number
        }
        Update: {
          base_fare?: number
          created_at?: string
          driver_id?: string
          holiday_sunday_percentage?: number | null
          id?: string
          min_fare?: number
          minimum_trip_fare?: number | null
          minimum_trip_minutes?: number | null
          night_rate_enabled?: boolean | null
          night_rate_end?: string | null
          night_rate_percentage?: number | null
          night_rate_start?: string | null
          price_per_km?: number
          service_area?: string | null
          updated_at?: string
          vehicle_id?: string | null
          wait_night_enabled?: boolean | null
          wait_night_end?: string | null
          wait_night_percentage?: number | null
          wait_night_start?: string | null
          wait_price_per_15min?: number | null
          waiting_fee_per_minute?: number
        }
        Relationships: [
          {
            foreignKeyName: "pricing_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pricing_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quotes: {
        Row: {
          amount: number
          arrival_location: string
          client_id: string
          created_at: string
          departure_location: string
          driver_id: string
          id: string
          quote_pdf: string | null
          ride_date: string
          status: string
          updated_at: string
          vehicle_id: string | null
        }
        Insert: {
          amount: number
          arrival_location: string
          client_id: string
          created_at?: string
          departure_location: string
          driver_id: string
          id?: string
          quote_pdf?: string | null
          ride_date: string
          status?: string
          updated_at?: string
          vehicle_id?: string | null
        }
        Update: {
          amount?: number
          arrival_location?: string
          client_id?: string
          created_at?: string
          departure_location?: string
          driver_id?: string
          id?: string
          quote_pdf?: string | null
          ride_date?: string
          status?: string
          updated_at?: string
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_types: {
        Row: {
          created_at: string
          driver_id: string
          icon: string | null
          id: string
          is_default: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          driver_id: string
          icon?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          driver_id?: string
          icon?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_types_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          capacity: number
          created_at: string
          driver_id: string
          id: string
          image_url: string | null
          is_active: boolean | null
          is_luxury: boolean | null
          model: string
          name: string
          updated_at: string
          vehicle_type_id: string | null
          vehicle_type_name: string | null
        }
        Insert: {
          capacity: number
          created_at?: string
          driver_id: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_luxury?: boolean | null
          model: string
          name: string
          updated_at?: string
          vehicle_type_id?: string | null
          vehicle_type_name?: string | null
        }
        Update: {
          capacity?: number
          created_at?: string
          driver_id?: string
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_luxury?: boolean | null
          model?: string
          name?: string
          updated_at?: string
          vehicle_type_id?: string | null
          vehicle_type_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_vehicle_type_id_fkey"
            columns: ["vehicle_type_id"]
            isOneToOne: false
            referencedRelation: "vehicle_types"
            referencedColumns: ["id"]
          },
        ]
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
