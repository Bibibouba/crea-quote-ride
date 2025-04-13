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
      admin_users: {
        Row: {
          email: string
          id: string
          mot_de_passe_hash: string
          role: string | null
        }
        Insert: {
          email: string
          id?: string
          mot_de_passe_hash: string
          role?: string | null
        }
        Update: {
          email?: string
          id?: string
          mot_de_passe_hash?: string
          role?: string | null
        }
        Relationships: []
      }
      applications: {
        Row: {
          afficher_accueil: boolean
          date_creation: string
          description_courte: string | null
          famille_id: string | null
          id: string
          lien_site: string | null
          logo_url: string | null
          nom: string
          prix_annuel: number | null
          prix_mensuel: number | null
        }
        Insert: {
          afficher_accueil?: boolean
          date_creation?: string
          description_courte?: string | null
          famille_id?: string | null
          id?: string
          lien_site?: string | null
          logo_url?: string | null
          nom: string
          prix_annuel?: number | null
          prix_mensuel?: number | null
        }
        Update: {
          afficher_accueil?: boolean
          date_creation?: string
          description_courte?: string | null
          famille_id?: string | null
          id?: string
          lien_site?: string | null
          logo_url?: string | null
          nom?: string
          prix_annuel?: number | null
          prix_mensuel?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "applications_famille_id_fkey"
            columns: ["famille_id"]
            isOneToOne: false
            referencedRelation: "familles"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          client_type: string | null
          date_inscription: string
          driver_id: string | null
          email: string
          entreprise: string | null
          first_name: string | null
          full_name: string
          id: string
          last_name: string | null
          mot_de_passe_hash: string | null
        }
        Insert: {
          client_type?: string | null
          date_inscription?: string
          driver_id?: string | null
          email: string
          entreprise?: string | null
          first_name?: string | null
          full_name: string
          id?: string
          last_name?: string | null
          mot_de_passe_hash?: string | null
        }
        Update: {
          client_type?: string | null
          date_inscription?: string
          driver_id?: string | null
          email?: string
          entreprise?: string | null
          first_name?: string | null
          full_name?: string
          id?: string
          last_name?: string | null
          mot_de_passe_hash?: string | null
        }
        Relationships: []
      }
      company_settings: {
        Row: {
          banner_url: string | null
          created_at: string | null
          driver_id: string | null
          font_family: string | null
          id: string
          logo_url: string | null
          primary_color: string | null
          secondary_color: string | null
          updated_at: string | null
        }
        Insert: {
          banner_url?: string | null
          created_at?: string | null
          driver_id?: string | null
          font_family?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string | null
        }
        Update: {
          banner_url?: string | null
          created_at?: string | null
          driver_id?: string | null
          font_family?: string | null
          id?: string
          logo_url?: string | null
          primary_color?: string | null
          secondary_color?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      distance_pricing_tiers: {
        Row: {
          created_at: string | null
          driver_id: string | null
          id: string
          max_km: number | null
          min_km: number
          price_per_km: number
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          driver_id?: string | null
          id?: string
          max_km?: number | null
          min_km: number
          price_per_km: number
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          driver_id?: string | null
          id?: string
          max_km?: number | null
          min_km?: number
          price_per_km?: number
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: []
      }
      familles: {
        Row: {
          date_creation: string
          id: string
          nom: string
        }
        Insert: {
          date_creation?: string
          id?: string
          nom: string
        }
        Update: {
          date_creation?: string
          id?: string
          nom?: string
        }
        Relationships: []
      }
      paiements: {
        Row: {
          application_id: string
          client_id: string
          date_paiement: string
          id: string
          montant: number
          periode: Database["public"]["Enums"]["periode_paiement_type"]
          statut: Database["public"]["Enums"]["statut_paiement_type"] | null
          type_paiement: Database["public"]["Enums"]["type_paiement_type"]
        }
        Insert: {
          application_id: string
          client_id: string
          date_paiement?: string
          id?: string
          montant: number
          periode: Database["public"]["Enums"]["periode_paiement_type"]
          statut?: Database["public"]["Enums"]["statut_paiement_type"] | null
          type_paiement: Database["public"]["Enums"]["type_paiement_type"]
        }
        Update: {
          application_id?: string
          client_id?: string
          date_paiement?: string
          id?: string
          montant?: number
          periode?: Database["public"]["Enums"]["periode_paiement_type"]
          statut?: Database["public"]["Enums"]["statut_paiement_type"] | null
          type_paiement?: Database["public"]["Enums"]["type_paiement_type"]
        }
        Relationships: [
          {
            foreignKeyName: "paiements_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "paiements_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing: {
        Row: {
          base_fare: number | null
          created_at: string | null
          driver_id: string | null
          id: string
          min_fare: number | null
          night_rate_enabled: boolean | null
          night_rate_end: string | null
          night_rate_percentage: number | null
          night_rate_start: string | null
          price_per_km: number | null
          updated_at: string | null
          wait_night_enabled: boolean | null
          wait_night_end: string | null
          wait_night_percentage: number | null
          wait_night_start: string | null
          wait_price_per_15min: number | null
          waiting_fee_per_minute: number | null
        }
        Insert: {
          base_fare?: number | null
          created_at?: string | null
          driver_id?: string | null
          id?: string
          min_fare?: number | null
          night_rate_enabled?: boolean | null
          night_rate_end?: string | null
          night_rate_percentage?: number | null
          night_rate_start?: string | null
          price_per_km?: number | null
          updated_at?: string | null
          wait_night_enabled?: boolean | null
          wait_night_end?: string | null
          wait_night_percentage?: number | null
          wait_night_start?: string | null
          wait_price_per_15min?: number | null
          waiting_fee_per_minute?: number | null
        }
        Update: {
          base_fare?: number | null
          created_at?: string | null
          driver_id?: string | null
          id?: string
          min_fare?: number | null
          night_rate_enabled?: boolean | null
          night_rate_end?: string | null
          night_rate_percentage?: number | null
          night_rate_start?: string | null
          price_per_km?: number | null
          updated_at?: string | null
          wait_night_enabled?: boolean | null
          wait_night_end?: string | null
          wait_night_percentage?: number | null
          wait_night_start?: string | null
          wait_price_per_15min?: number | null
          waiting_fee_per_minute?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
        }
        Insert: {
          company_name?: string | null
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
        }
        Update: {
          company_name?: string | null
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
        }
        Relationships: []
      }
      quotes: {
        Row: {
          amount: number
          arrival_coordinates: number[]
          arrival_location: string
          client_id: string | null
          created_at: string | null
          custom_return_address: string | null
          departure_coordinates: number[]
          departure_location: string
          distance_km: number
          driver_id: string | null
          duration_minutes: number
          has_return_trip: boolean | null
          has_waiting_time: boolean | null
          id: string
          quote_pdf: string | null
          return_coordinates: number[] | null
          return_distance_km: number | null
          return_duration_minutes: number | null
          return_to_same_address: boolean | null
          ride_date: string
          status: string | null
          updated_at: string | null
          vehicle_id: string | null
          waiting_time_minutes: number | null
          waiting_time_price: number | null
        }
        Insert: {
          amount: number
          arrival_coordinates: number[]
          arrival_location: string
          client_id?: string | null
          created_at?: string | null
          custom_return_address?: string | null
          departure_coordinates: number[]
          departure_location: string
          distance_km: number
          driver_id?: string | null
          duration_minutes: number
          has_return_trip?: boolean | null
          has_waiting_time?: boolean | null
          id?: string
          quote_pdf?: string | null
          return_coordinates?: number[] | null
          return_distance_km?: number | null
          return_duration_minutes?: number | null
          return_to_same_address?: boolean | null
          ride_date: string
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
          waiting_time_minutes?: number | null
          waiting_time_price?: number | null
        }
        Update: {
          amount?: number
          arrival_coordinates?: number[]
          arrival_location?: string
          client_id?: string | null
          created_at?: string | null
          custom_return_address?: string | null
          departure_coordinates?: number[]
          departure_location?: string
          distance_km?: number
          driver_id?: string | null
          duration_minutes?: number
          has_return_trip?: boolean | null
          has_waiting_time?: boolean | null
          id?: string
          quote_pdf?: string | null
          return_coordinates?: number[] | null
          return_distance_km?: number | null
          return_duration_minutes?: number | null
          return_to_same_address?: boolean | null
          ride_date?: string
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
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
        ]
      }
      utilisations: {
        Row: {
          application_id: string
          client_id: string
          date_debut_essai: string
          date_fin_essai: string | null
          id: string
          statut_essai: Database["public"]["Enums"]["statut_essai_type"] | null
          temps_utilisation: number | null
        }
        Insert: {
          application_id: string
          client_id: string
          date_debut_essai?: string
          date_fin_essai?: string | null
          id?: string
          statut_essai?: Database["public"]["Enums"]["statut_essai_type"] | null
          temps_utilisation?: number | null
        }
        Update: {
          application_id?: string
          client_id?: string
          date_debut_essai?: string
          date_fin_essai?: string | null
          id?: string
          statut_essai?: Database["public"]["Enums"]["statut_essai_type"] | null
          temps_utilisation?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "utilisations_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "utilisations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_types: {
        Row: {
          created_at: string | null
          driver_id: string | null
          icon: string | null
          id: string
          is_default: boolean | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          driver_id?: string | null
          icon?: string | null
          id?: string
          is_default?: boolean | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          driver_id?: string | null
          icon?: string | null
          id?: string
          is_default?: boolean | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          capacity: number
          created_at: string | null
          driver_id: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_luxury: boolean | null
          model: string
          name: string
          updated_at: string | null
          vehicle_type_id: string | null
          vehicle_type_name: string | null
        }
        Insert: {
          capacity: number
          created_at?: string | null
          driver_id?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_luxury?: boolean | null
          model: string
          name: string
          updated_at?: string | null
          vehicle_type_id?: string | null
          vehicle_type_name?: string | null
        }
        Update: {
          capacity?: number
          created_at?: string | null
          driver_id?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_luxury?: boolean | null
          model?: string
          name?: string
          updated_at?: string | null
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
      [_ in never]: never
    }
    Enums: {
      periode_paiement_type: "mensuel" | "annuel"
      statut_essai_type: "en_cours" | "expiré" | "converti" | "actif"
      statut_paiement_type: "payé" | "échoué" | "en_attente"
      type_paiement_type: "Stripe" | "PayPal" | "CB"
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
      periode_paiement_type: ["mensuel", "annuel"],
      statut_essai_type: ["en_cours", "expiré", "converti", "actif"],
      statut_paiement_type: ["payé", "échoué", "en_attente"],
      type_paiement_type: ["Stripe", "PayPal", "CB"],
    },
  },
} as const
