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
          amount_ht: number | null
          arrival_coordinates: number[] | null
          arrival_location: string
          client_id: string
          created_at: string
          custom_return_address: string | null
          day_hours: number | null
          day_km: number | null
          day_percentage: number | null
          day_price: number | null
          departure_coordinates: number[] | null
          departure_location: string
          distance_km: number | null
          driver_id: string
          duration_minutes: number | null
          has_night_rate: boolean | null
          has_return_trip: boolean | null
          has_waiting_time: boolean | null
          id: string
          is_return_night_rate: boolean | null
          is_sunday_holiday: boolean | null
          night_hours: number | null
          night_km: number | null
          night_percentage: number | null
          night_price: number | null
          night_rate_percentage: number | null
          night_surcharge: number | null
          one_way_price: number | null
          one_way_price_ht: number | null
          quote_pdf: string | null
          return_coordinates: number[] | null
          return_day_hours: number | null
          return_day_km: number | null
          return_day_percentage: number | null
          return_day_price: number | null
          return_distance_km: number | null
          return_duration_minutes: number | null
          return_night_hours: number | null
          return_night_km: number | null
          return_night_percentage: number | null
          return_night_price: number | null
          return_night_surcharge: number | null
          return_price: number | null
          return_price_ht: number | null
          return_to_same_address: boolean | null
          ride_date: string
          status: string
          sunday_holiday_percentage: number | null
          sunday_holiday_surcharge: number | null
          total_ht: number | null
          total_km: number | null
          total_ttc: number | null
          total_vat: number | null
          updated_at: string
          vat: number | null
          vehicle_id: string | null
          wait_price_day: number | null
          wait_price_night: number | null
          wait_time_day: number | null
          wait_time_night: number | null
          waiting_time_minutes: number | null
          waiting_time_price: number | null
        }
        Insert: {
          amount: number
          amount_ht?: number | null
          arrival_coordinates?: number[] | null
          arrival_location: string
          client_id: string
          created_at?: string
          custom_return_address?: string | null
          day_hours?: number | null
          day_km?: number | null
          day_percentage?: number | null
          day_price?: number | null
          departure_coordinates?: number[] | null
          departure_location: string
          distance_km?: number | null
          driver_id: string
          duration_minutes?: number | null
          has_night_rate?: boolean | null
          has_return_trip?: boolean | null
          has_waiting_time?: boolean | null
          id?: string
          is_return_night_rate?: boolean | null
          is_sunday_holiday?: boolean | null
          night_hours?: number | null
          night_km?: number | null
          night_percentage?: number | null
          night_price?: number | null
          night_rate_percentage?: number | null
          night_surcharge?: number | null
          one_way_price?: number | null
          one_way_price_ht?: number | null
          quote_pdf?: string | null
          return_coordinates?: number[] | null
          return_day_hours?: number | null
          return_day_km?: number | null
          return_day_percentage?: number | null
          return_day_price?: number | null
          return_distance_km?: number | null
          return_duration_minutes?: number | null
          return_night_hours?: number | null
          return_night_km?: number | null
          return_night_percentage?: number | null
          return_night_price?: number | null
          return_night_surcharge?: number | null
          return_price?: number | null
          return_price_ht?: number | null
          return_to_same_address?: boolean | null
          ride_date: string
          status?: string
          sunday_holiday_percentage?: number | null
          sunday_holiday_surcharge?: number | null
          total_ht?: number | null
          total_km?: number | null
          total_ttc?: number | null
          total_vat?: number | null
          updated_at?: string
          vat?: number | null
          vehicle_id?: string | null
          wait_price_day?: number | null
          wait_price_night?: number | null
          wait_time_day?: number | null
          wait_time_night?: number | null
          waiting_time_minutes?: number | null
          waiting_time_price?: number | null
        }
        Update: {
          amount?: number
          amount_ht?: number | null
          arrival_coordinates?: number[] | null
          arrival_location?: string
          client_id?: string
          created_at?: string
          custom_return_address?: string | null
          day_hours?: number | null
          day_km?: number | null
          day_percentage?: number | null
          day_price?: number | null
          departure_coordinates?: number[] | null
          departure_location?: string
          distance_km?: number | null
          driver_id?: string
          duration_minutes?: number | null
          has_night_rate?: boolean | null
          has_return_trip?: boolean | null
          has_waiting_time?: boolean | null
          id?: string
          is_return_night_rate?: boolean | null
          is_sunday_holiday?: boolean | null
          night_hours?: number | null
          night_km?: number | null
          night_percentage?: number | null
          night_price?: number | null
          night_rate_percentage?: number | null
          night_surcharge?: number | null
          one_way_price?: number | null
          one_way_price_ht?: number | null
          quote_pdf?: string | null
          return_coordinates?: number[] | null
          return_day_hours?: number | null
          return_day_km?: number | null
          return_day_percentage?: number | null
          return_day_price?: number | null
          return_distance_km?: number | null
          return_duration_minutes?: number | null
          return_night_hours?: number | null
          return_night_km?: number | null
          return_night_percentage?: number | null
          return_night_price?: number | null
          return_night_surcharge?: number | null
          return_price?: number | null
          return_price_ht?: number | null
          return_to_same_address?: boolean | null
          ride_date?: string
          status?: string
          sunday_holiday_percentage?: number | null
          sunday_holiday_surcharge?: number | null
          total_ht?: number | null
          total_km?: number | null
          total_ttc?: number | null
          total_vat?: number | null
          updated_at?: string
          vat?: number | null
          vehicle_id?: string | null
          wait_price_day?: number | null
          wait_price_night?: number | null
          wait_time_day?: number | null
          wait_time_night?: number | null
          waiting_time_minutes?: number | null
          waiting_time_price?: number | null
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
            foreignKeyName: "vehicle_pricing_settings_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
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
