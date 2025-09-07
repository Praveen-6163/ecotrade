import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          name: string
          email: string
          credits_owned: number
          total_co2_offset: number
          badges: string[]
          created_at: string
        }
        Insert: {
          id: string
          name: string
          email: string
          credits_owned?: number
          total_co2_offset?: number
          badges?: string[]
        }
        Update: {
          name?: string
          email?: string
          credits_owned?: number
          total_co2_offset?: number
          badges?: string[]
        }
      }
      projects: {
        Row: {
          id: string
          name: string
          type: string
          price_per_credit: number
          description: string
          image_url: string
          created_at: string
        }
      }
      transactions: {
        Row: {
          id: string
          user_id: string
          project_id: string
          type: 'buy' | 'sell'
          quantity: number
          total_cost: number
          created_at: string
        }
        Insert: {
          user_id: string
          project_id: string
          type: 'buy' | 'sell'
          quantity: number
          total_cost: number
        }
      }
    }
  }
}