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
      completed_orders: {
        Row: {
          id: number
          order_id: string
          student_id: string
          student_name: string
          timestamp: string
        }
        Insert: {
          id?: number
          order_id: string
          student_id: string
          student_name: string
          timestamp?: string
        }
        Update: {
          id?: number
          order_id?: string
          student_id?: string
          student_name?: string
          timestamp?: string
        }
        Relationships: []
      }
      print_configs: {
        Row: {
          color: string
          copies: number
          id: string
          order_id: string
          sides: string
        }
        Insert: {
          color: string
          copies?: number
          id?: string
          order_id: string
          sides: string
        }
        Update: {
          color?: string
          copies?: number
          id?: string
          order_id?: string
          sides?: string
        }
        Relationships: [
          {
            foreignKeyName: "print_configs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "print_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      print_file_groups: {
        Row: {
          config_color: string
          config_copies: number
          config_group: string
          config_sides: string
          created_at: string
          id: string
          merged_file_path: string | null
          order_id: string
        }
        Insert: {
          config_color: string
          config_copies: number
          config_group: string
          config_sides: string
          created_at?: string
          id?: string
          merged_file_path?: string | null
          order_id: string
        }
        Update: {
          config_color?: string
          config_copies?: number
          config_group?: string
          config_sides?: string
          created_at?: string
          id?: string
          merged_file_path?: string | null
          order_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "print_file_groups_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "print_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      print_files: {
        Row: {
          config_color: string | null
          config_copies: number | null
          config_group: string | null
          config_sides: string | null
          file_name: string
          file_size: number
          file_type: string
          id: string
          order_id: string
          page_count: number
          storage_path: string
        }
        Insert: {
          config_color?: string | null
          config_copies?: number | null
          config_group?: string | null
          config_sides?: string | null
          file_name: string
          file_size: number
          file_type: string
          id?: string
          order_id: string
          page_count?: number
          storage_path: string
        }
        Update: {
          config_color?: string | null
          config_copies?: number | null
          config_group?: string | null
          config_sides?: string | null
          file_name?: string
          file_size?: number
          file_type?: string
          id?: string
          order_id?: string
          page_count?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "print_files_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "print_orders"
            referencedColumns: ["id"]
          },
        ]
      }
      print_orders: {
        Row: {
          additional_details: string | null
          amount: number
          id: string
          is_active: boolean
          status: string
          student_id: string
          student_name: string
          timestamp: string
        }
        Insert: {
          additional_details?: string | null
          amount: number
          id?: string
          is_active?: boolean
          status?: string
          student_id: string
          student_name: string
          timestamp?: string
        }
        Update: {
          additional_details?: string | null
          amount?: number
          id?: string
          is_active?: boolean
          status?: string
          student_id?: string
          student_name?: string
          timestamp?: string
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
