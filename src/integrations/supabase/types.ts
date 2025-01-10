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
      campaigns: {
        Row: {
          about: string | null
          amount: number
          application_end_date: string | null
          application_start_date: string | null
          base_commission: number
          brand_name: string
          brand_shop_link: string
          campaign_duration_days: number
          campaign_type: string
          category: string | null
          commission_boost: number
          created_at: string
          free_samples: boolean | null
          gmv_target: number[] | null
          id: string
          name: string
          platform: string
          prizes: boolean | null
          product_image_url: string | null
          product_name: string
          profile_id: string | null
          retainer_max: number | null
          retainer_min: number | null
          status: string
          tracking_link: string | null
          updated_at: string
          videos_per_day: number
        }
        Insert: {
          about?: string | null
          amount: number
          application_end_date?: string | null
          application_start_date?: string | null
          base_commission?: number
          brand_name?: string
          brand_shop_link?: string
          campaign_duration_days?: number
          campaign_type?: string
          category?: string | null
          commission_boost?: number
          created_at?: string
          free_samples?: boolean | null
          gmv_target?: number[] | null
          id?: string
          name: string
          platform?: string
          prizes?: boolean | null
          product_image_url?: string | null
          product_name?: string
          profile_id?: string | null
          retainer_max?: number | null
          retainer_min?: number | null
          status?: string
          tracking_link?: string | null
          updated_at?: string
          videos_per_day?: number
        }
        Update: {
          about?: string | null
          amount?: number
          application_end_date?: string | null
          application_start_date?: string | null
          base_commission?: number
          brand_name?: string
          brand_shop_link?: string
          campaign_duration_days?: number
          campaign_type?: string
          category?: string | null
          commission_boost?: number
          created_at?: string
          free_samples?: boolean | null
          gmv_target?: number[] | null
          id?: string
          name?: string
          platform?: string
          prizes?: boolean | null
          product_image_url?: string | null
          product_name?: string
          profile_id?: string | null
          retainer_max?: number | null
          retainer_min?: number | null
          status?: string
          tracking_link?: string | null
          updated_at?: string
          videos_per_day?: number
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      deliverables: {
        Row: {
          campaign_id: string | null
          created_at: string
          description: string | null
          due_date: string
          id: string
          profile_id: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          campaign_id?: string | null
          created_at?: string
          description?: string | null
          due_date: string
          id?: string
          profile_id?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          campaign_id?: string | null
          created_at?: string
          description?: string | null
          due_date?: string
          id?: string
          profile_id?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deliverables_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "deliverables_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          about: string | null
          created_at: string
          date_of_birth: string
          first_name: string
          gmv: number | null
          gmv_proof_url: string | null
          id: string
          instagram_url: string | null
          last_name: string
          profile_picture_url: string | null
          tier: Database["public"]["Enums"]["creator_tier"]
          updated_at: string
          user_id: string | null
        }
        Insert: {
          about?: string | null
          created_at?: string
          date_of_birth: string
          first_name: string
          gmv?: number | null
          gmv_proof_url?: string | null
          id?: string
          instagram_url?: string | null
          last_name: string
          profile_picture_url?: string | null
          tier?: Database["public"]["Enums"]["creator_tier"]
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          about?: string | null
          created_at?: string
          date_of_birth?: string
          first_name?: string
          gmv?: number | null
          gmv_proof_url?: string | null
          id?: string
          instagram_url?: string | null
          last_name?: string
          profile_picture_url?: string | null
          tier?: Database["public"]["Enums"]["creator_tier"]
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      tiktok_accounts: {
        Row: {
          created_at: string
          id: string
          niche: string
          profile_id: string | null
          updated_at: string
          url: string
        }
        Insert: {
          created_at?: string
          id?: string
          niche: string
          profile_id?: string | null
          updated_at?: string
          url: string
        }
        Update: {
          created_at?: string
          id?: string
          niche?: string
          profile_id?: string | null
          updated_at?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "tiktok_accounts_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_tier: {
        Args: {
          gmv: number
        }
        Returns: Database["public"]["Enums"]["creator_tier"]
      }
    }
    Enums: {
      creator_tier:
        | "bronze"
        | "silver"
        | "gold"
        | "platinum"
        | "diamond"
        | "elite"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

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
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

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
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
