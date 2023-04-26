export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
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
      }
      interactions: {
        Row: {
          action: string
          created_at: string
          id: string
          list_id: string
          post_id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          list_id: string
          post_id: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          list_id?: string
          post_id?: string
          user_id?: string
        }
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string
          user_id?: string
        }
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
      }
      profiles: {
        Row: {
          created_at: string | null
          id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
        }
        Update: {
          created_at?: string | null
          id?: string
        }
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
