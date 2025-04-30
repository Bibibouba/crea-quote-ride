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
          address: string | null
          birth_date: string | null
          business_type: string | null
          client_code: string | null
          client_type: string
          comments: string | null
          company_name: string | null
          created_at: string
          driver_id: string
          email: string
          first_name: string
          gender: string | null
          id: string
          last_name: string
          phone: string | null
          siret: string | null
          updated_at: string
          vat_number: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          birth_date?: string | null
          business_type?: string | null
          client_code?: string | null
          client_type?: string
          comments?: string | null
          company_name?: string | null
          created_at?: string
          driver_id: string
          email: string
          first_name: string
          gender?: string | null
          id?: string
          last_name: string
          phone?: string | null
          siret?: string | null
          updated_at?: string
          vat_number?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          birth_date?: string | null
          business_type?: string | null
          client_code?: string | null
          client_type?: string
          comments?: string | null
          company_name?: string | null
          created_at?: string
          driver_id?: string
          email?: string
          first_name?: string
          gender?: string | null
          id?: string
          last_name?: string
          phone?: string | null
          siret?: string | null
          updated_at?: string
          vat_number?: string | null
          website?: string | null
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          bank_details: string | null
          banner_url: string | null
          company_address: string | null
          company_name: string | null
          company_type: string | null
          contact_email: string | null
          contact_first_name: string | null
          contact_last_name: string | null
          created_at: string
          discount_conditions: string | null
          driver_id: string
          font_family: string | null
          id: string
          invoice_prefix: string | null
          is_trial: boolean | null
          is_vat_exempt: boolean | null
          late_payment_rate: number | null
          legal_notices: string | null
          logo_url: string | null
          next_invoice_number: number | null
          payment_delay_days: number | null
          primary_color: string | null
          rcs_number: string | null
          registration_city: string | null
          secondary_color: string | null
          siret: string | null
          updated_at: string
          vat_number: string | null
        }
        Insert: {
          bank_details?: string | null
          banner_url?: string | null
          company_address?: string | null
          company_name?: string | null
          company_type?: string | null
          contact_email?: string | null
          contact_first_name?: string | null
          contact_last_name?: string | null
          created_at?: string
          discount_conditions?: string | null
          driver_id: string
          font_family?: string | null
          id?: string
          invoice_prefix?: string | null
          is_trial?: boolean | null
          is_vat_exempt?: boolean | null
          late_payment_rate?: number | null
          legal_notices?: string | null
          logo_url?: string | null
          next_invoice_number?: number | null
          payment_delay_days?: number | null
          primary_color?: string | null
          rcs_number?: string | null
          registration_city?: string | null
          secondary_color?: string | null
          siret?: string | null
          updated_at?: string
          vat_number?: string | null
        }
        Update: {
          bank_details?: string | null
          banner_url?: string | null
          company_address?: string | null
          company_name?: string | null
          company_type?: string | null
          contact_email?: string | null
          contact_first_name?: string | null
          contact_last_name?: string | null
          created_at?: string
          discount_conditions?: string | null
          driver_id?: string
          font_family?: string | null
          id?: string
          invoice_prefix?: string | null
          is_trial?: boolean | null
          is_vat_exempt?: boolean | null
          late_payment_rate?: number | null
          legal_notices?: string | null
          logo_url?: string | null
          next_invoice_number?: number | null
          payment_delay_days?: number | null
          primary_color?: string | null
          rcs_number?: string | null
          registration_city?: string | null
          secondary_color?: string | null
          siret?: string | null
          updated_at?: string
          vat_number?: string | null
        }
        Relationships: []
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
            foreignKeyName: "distance_pricing_tiers_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_preferences: {
        Row: {
          apply_holiday_rate: boolean
          apply_minimum_fare: boolean
          apply_night_rate: boolean
          apply_sunday_rate: boolean | null
          created_at: string
          driver_id: string
          id: string
          updated_at: string
        }
        Insert: {
          apply_holiday_rate?: boolean
          apply_minimum_fare?: boolean
          apply_night_rate?: boolean
          apply_sunday_rate?: boolean | null
          created_at?: string
          driver_id: string
          id?: string
          updated_at?: string
        }
        Update: {
          apply_holiday_rate?: boolean
          apply_minimum_fare?: boolean
          apply_night_rate?: boolean
          apply_sunday_rate?: boolean | null
          created_at?: string
          driver_id?: string
          id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_preferences_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      driver_vehicles: {
        Row: {
          apply_holiday_rate: boolean | null
          apply_minimum_distance: boolean | null
          apply_minimum_fare: boolean | null
          apply_night_rate: boolean | null
          apply_sunday_rate: boolean | null
          created_at: string
          custom_rate_per_km: number
          driver_id: string
          id: string
          updated_at: string
          vehicle_type_id: string
        }
        Insert: {
          apply_holiday_rate?: boolean | null
          apply_minimum_distance?: boolean | null
          apply_minimum_fare?: boolean | null
          apply_night_rate?: boolean | null
          apply_sunday_rate?: boolean | null
          created_at?: string
          custom_rate_per_km: number
          driver_id: string
          id?: string
          updated_at?: string
          vehicle_type_id: string
        }
        Update: {
          apply_holiday_rate?: boolean | null
          apply_minimum_distance?: boolean | null
          apply_minimum_fare?: boolean | null
          apply_night_rate?: boolean | null
          apply_sunday_rate?: boolean | null
          created_at?: string
          custom_rate_per_km?: number
          driver_id?: string
          id?: string
          updated_at?: string
          vehicle_type_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "driver_vehicles_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "driver_vehicles_vehicle_type_id_fkey"
            columns: ["vehicle_type_id"]
            isOneToOne: false
            referencedRelation: "vehicle_types"
            referencedColumns: ["id"]
          },
        ]
      }
      global_settings: {
        Row: {
          apply_holiday_rate: boolean | null
          apply_sunday_rate: boolean | null
          holiday_rate_increase: number
          id: string
          minimum_distance_km: number
          minimum_fare: number
          night_end_hour: number
          night_end_minute: number
          night_rate_increase: number
          night_start_hour: number
          night_start_minute: number
          sunday_rate_increase: number | null
          updated_at: string
          updated_by: string | null
          waiting_rate_per_minute: number | null
        }
        Insert: {
          apply_holiday_rate?: boolean | null
          apply_sunday_rate?: boolean | null
          holiday_rate_increase?: number
          id?: string
          minimum_distance_km?: number
          minimum_fare?: number
          night_end_hour?: number
          night_end_minute?: number
          night_rate_increase?: number
          night_start_hour?: number
          night_start_minute?: number
          sunday_rate_increase?: number | null
          updated_at?: string
          updated_by?: string | null
          waiting_rate_per_minute?: number | null
        }
        Update: {
          apply_holiday_rate?: boolean | null
          apply_sunday_rate?: boolean | null
          holiday_rate_increase?: number
          id?: string
          minimum_distance_km?: number
          minimum_fare?: number
          night_end_hour?: number
          night_end_minute?: number
          night_rate_increase?: number
          night_start_hour?: number
          night_start_minute?: number
          sunday_rate_increase?: number | null
          updated_at?: string
          updated_by?: string | null
          waiting_rate_per_minute?: number | null
        }
        Relationships: []
      }
      jours_feries: {
        Row: {
          created_at: string | null
          date_ferie: string
          id: string
          label: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_ferie: string
          id?: string
          label?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_ferie?: string
          id?: string
          label?: string | null
          updated_at?: string | null
        }
        Relationships: []
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
          ride_vat_rate: number | null
          service_area: string | null
          updated_at: string
          vehicle_id: string | null
          wait_night_enabled: boolean | null
          wait_night_end: string | null
          wait_night_percentage: number | null
          wait_night_start: string | null
          wait_price_per_15min: number | null
          waiting_fee_per_minute: number
          waiting_vat_rate: number | null
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
          ride_vat_rate?: number | null
          service_area?: string | null
          updated_at?: string
          vehicle_id?: string | null
          wait_night_enabled?: boolean | null
          wait_night_end?: string | null
          wait_night_percentage?: number | null
          wait_night_start?: string | null
          wait_price_per_15min?: number | null
          waiting_fee_per_minute: number
          waiting_vat_rate?: number | null
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
          ride_vat_rate?: number | null
          service_area?: string | null
          updated_at?: string
          vehicle_id?: string | null
          wait_night_enabled?: boolean | null
          wait_night_end?: string | null
          wait_night_percentage?: number | null
          wait_night_start?: string | null
          wait_price_per_15min?: number | null
          waiting_fee_per_minute?: number
          waiting_vat_rate?: number | null
        }
        Relationships: [
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
          created_at: string
          email: string
          first_name: string
          id: string
          is_approved: boolean
          last_name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          email: string
          first_name: string
          id: string
          is_approved?: boolean
          last_name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          is_approved?: boolean
          last_name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          arrival_location: string | null
          base_fare: number
          client_id: string | null
          created_at: string
          departure_datetime: string
          departure_location: string | null
          driver_id: string | null
          holiday_surcharge: number | null
          id: string
          include_return: boolean | null
          night_surcharge: number | null
          outbound_duration_minutes: number
          quote_pdf: string | null
          return_duration_minutes: number | null
          status: string
          sunday_surcharge: number | null
          total_distance: number
          total_fare: number
          updated_at: string
          vehicle_type_id: string | null
          waiting_fare: number | null
          waiting_time_minutes: number | null
        }
        Insert: {
          arrival_location?: string | null
          base_fare: number
          client_id?: string | null
          created_at?: string
          departure_datetime: string
          departure_location?: string | null
          driver_id?: string | null
          holiday_surcharge?: number | null
          id?: string
          include_return?: boolean | null
          night_surcharge?: number | null
          outbound_duration_minutes: number
          quote_pdf?: string | null
          return_duration_minutes?: number | null
          status?: string
          sunday_surcharge?: number | null
          total_distance: number
          total_fare: number
          updated_at?: string
          vehicle_type_id?: string | null
          waiting_fare?: number | null
          waiting_time_minutes?: number | null
        }
        Update: {
          arrival_location?: string | null
          base_fare?: number
          client_id?: string | null
          created_at?: string
          departure_datetime?: string
          departure_location?: string | null
          driver_id?: string | null
          holiday_surcharge?: number | null
          id?: string
          include_return?: boolean | null
          night_surcharge?: number | null
          outbound_duration_minutes?: number
          quote_pdf?: string | null
          return_duration_minutes?: number | null
          status?: string
          sunday_surcharge?: number | null
          total_distance?: number
          total_fare?: number
          updated_at?: string
          vehicle_type_id?: string | null
          waiting_fare?: number | null
          waiting_time_minutes?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "quotes_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quotes_vehicle_type_id_fkey"
            columns: ["vehicle_type_id"]
            isOneToOne: false
            referencedRelation: "vehicle_types"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_pricing_settings: {
        Row: {
          created_at: string
          driver_id: string
          holiday_sunday_percentage: number | null
          id: string
          min_trip_distance: number | null
          minimum_trip_fare: number | null
          night_rate_enabled: boolean | null
          night_rate_end: string | null
          night_rate_percentage: number | null
          night_rate_start: string | null
          price_per_km: number | null
          updated_at: string
          vehicle_id: string
          wait_night_enabled: boolean | null
          wait_night_end: string | null
          wait_night_percentage: number | null
          wait_night_start: string | null
          wait_price_per_15min: number | null
        }
        Insert: {
          created_at?: string
          driver_id: string
          holiday_sunday_percentage?: number | null
          id?: string
          min_trip_distance?: number | null
          minimum_trip_fare?: number | null
          night_rate_enabled?: boolean | null
          night_rate_end?: string | null
          night_rate_percentage?: number | null
          night_rate_start?: string | null
          price_per_km?: number | null
          updated_at?: string
          vehicle_id: string
          wait_night_enabled?: boolean | null
          wait_night_end?: string | null
          wait_night_percentage?: number | null
          wait_night_start?: string | null
          wait_price_per_15min?: number | null
        }
        Update: {
          created_at?: string
          driver_id?: string
          holiday_sunday_percentage?: number | null
          id?: string
          min_trip_distance?: number | null
          minimum_trip_fare?: number | null
          night_rate_enabled?: boolean | null
          night_rate_end?: string | null
          night_rate_percentage?: number | null
          night_rate_start?: string | null
          price_per_km?: number | null
          updated_at?: string
          vehicle_id?: string
          wait_night_enabled?: boolean | null
          wait_night_end?: string | null
          wait_night_percentage?: number | null
          wait_night_start?: string | null
          wait_price_per_15min?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_pricing_settings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: true
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_types: {
        Row: {
          created_at: string
          default_rate_per_km: number
          driver_id: string | null
          icon: string | null
          id: string
          is_default: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          default_rate_per_km: number
          driver_id?: string | null
          icon?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          default_rate_per_km?: number
          driver_id?: string | null
          icon?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
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
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_schema_info_function: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      schema_info: {
        Args: { table_name: string }
        Returns: {
          column_name: string
          data_type: string
          is_nullable: boolean
          column_default: string
        }[]
      }
    }
    Enums: {
      user_role: "admin" | "driver" | "client"
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
    Enums: {
      user_role: ["admin", "driver", "client"],
    },
  },
} as const
