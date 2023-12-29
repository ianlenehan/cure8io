export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      batches: {
        Row: {
          date: string
          id: string
          list_id: string
        }
        Insert: {
          date?: string
          id?: string
          list_id: string
        }
        Update: {
          date?: string
          id?: string
          list_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "batches_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          }
        ]
      }
      curated_links: {
        Row: {
          created_at: string
          description: string | null
          id: string
          issue_id: string | null
          newsletter_id: string | null
          status: string
          title: string
          url: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          issue_id?: string | null
          newsletter_id?: string | null
          status?: string
          title: string
          url: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          issue_id?: string | null
          newsletter_id?: string | null
          status?: string
          title?: string
          url?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "curated_links_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "curated_links_newsletter_id_fkey"
            columns: ["newsletter_id"]
            isOneToOne: false
            referencedRelation: "newsletters"
            referencedColumns: ["id"]
          }
        ]
      }
      email_addresses: {
        Row: {
          created_at: string
          email_address: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email_address: string
          id?: string
          user_id?: string
        }
        Update: {
          created_at?: string
          email_address?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      interactions: {
        Row: {
          action: string
          created_at: string
          id: string
          link_id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id: string
          link_id: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          link_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "interactions_link_id_fkey"
            columns: ["link_id"]
            isOneToOne: false
            referencedRelation: "curated_links"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "interactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      issues: {
        Row: {
          created_at: string
          date: string
          id: string
          issue_key: string
          issue_number: number | null
          newsletter_id: string | null
          web_link: string | null
        }
        Insert: {
          created_at?: string
          date: string
          id?: string
          issue_key: string
          issue_number?: number | null
          newsletter_id?: string | null
          web_link?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          id?: string
          issue_key?: string
          issue_number?: number | null
          newsletter_id?: string | null
          web_link?: string | null
        }
        Relationships: []
      }
      links: {
        Row: {
          created_at: string
          description: string | null
          id: string
          issue_id: string | null
          link_key: string | null
          newsletter_id: string
          title: string
          url: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          issue_id?: string | null
          link_key?: string | null
          newsletter_id: string
          title: string
          url: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          issue_id?: string | null
          link_key?: string | null
          newsletter_id?: string
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "links_issue_id_fkey"
            columns: ["issue_id"]
            isOneToOne: false
            referencedRelation: "issues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "links_newsletter_id_fkey"
            columns: ["newsletter_id"]
            isOneToOne: false
            referencedRelation: "newsletters"
            referencedColumns: ["id"]
          }
        ]
      }
      lists: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          user_id: string
          visibility: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          user_id: string
          visibility?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          user_id?: string
          visibility?: string
        }
        Relationships: [
          {
            foreignKeyName: "lists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      lists_tags: {
        Row: {
          id: string
          list_id: string
          tag_id: string
        }
        Insert: {
          id: string
          list_id: string
          tag_id: string
        }
        Update: {
          id?: string
          list_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lists_tags_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lists_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          }
        ]
      }
      newsletters: {
        Row: {
          created_at: string
          id: string
          name: string
          newsletter_key: string | null
          sender: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          newsletter_key?: string | null
          sender?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          newsletter_key?: string | null
          sender?: string | null
        }
        Relationships: []
      }
      organisation_users: {
        Row: {
          created_at: string
          id: string
          organisation_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id: string
          organisation_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          organisation_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "organisation_users_organisation_id_fkey"
            columns: ["organisation_id"]
            isOneToOne: false
            referencedRelation: "organisations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "organisation_users_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      organisations: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      posts: {
        Row: {
          author: string | null
          created_at: string
          description: string | null
          id: string
          list_id: string
          publish_date: string
          title: string
          url: string
        }
        Insert: {
          author?: string | null
          created_at?: string
          description?: string | null
          id?: string
          list_id: string
          publish_date?: string
          title: string
          url: string
        }
        Update: {
          author?: string | null
          created_at?: string
          description?: string | null
          id?: string
          list_id?: string
          publish_date?: string
          title?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          name: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          name?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      subscriptions: {
        Row: {
          created_at: string | null
          id: string
          list_id: string
          subscriber_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          list_id: string
          subscriber_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          list_id?: string
          subscriber_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_list_id_fkey"
            columns: ["list_id"]
            isOneToOne: false
            referencedRelation: "lists"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_subscriber_id_fkey"
            columns: ["subscriber_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      tags: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id?: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      test: {
        Row: {
          created_at: string | null
          id: number
          name: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          name?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          name?: string | null
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"] & Database["public"]["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"] &
      Database["public"]["Views"])
  ? (Database["public"]["Tables"] &
      Database["public"]["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database["public"]["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database["public"]["Tables"]
  ? Database["public"]["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database["public"]["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof Database["public"]["Enums"]
  ? Database["public"]["Enums"][PublicEnumNameOrOptions]
  : never
