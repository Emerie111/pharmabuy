import { createClient } from '@supabase/supabase-js'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_URL')
}
if (!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Database types
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
      generic_drugs: {
        Row: {
          id: string
          name: string
          category: string
          description: string
          indication: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          category: string
          description: string
          indication: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          category?: string
          description?: string
          indication?: string
          created_at?: string
          updated_at?: string
        }
      }
      branded_products: {
        Row: {
          id: string
          generic_id: string
          brand_name: string
          manufacturer: string
          strength: string
          dosage_form: string
          pack_size: string
          verified: boolean
          rating: number
          image: string
          bioequivalence: number | null
          nafdac_number: string
          type: 'prescription' | 'otc'
          date_added: string
          country_of_origin: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          generic_id: string
          brand_name: string
          manufacturer: string
          strength: string
          dosage_form: string
          pack_size: string
          verified?: boolean
          rating?: number
          image: string
          bioequivalence?: number | null
          nafdac_number: string
          type: 'prescription' | 'otc'
          date_added?: string
          country_of_origin: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          generic_id?: string
          brand_name?: string
          manufacturer?: string
          strength?: string
          dosage_form?: string
          pack_size?: string
          verified?: boolean
          rating?: number
          image?: string
          bioequivalence?: number | null
          nafdac_number?: string
          type?: 'prescription' | 'otc'
          date_added?: string
          country_of_origin?: string
          created_at?: string
          updated_at?: string
        }
      }
      suppliers: {
        Row: {
          id: string
          name: string
          description: string
          verified: boolean
          logo: string
          address: string
          phone: string
          email: string
          website: string | null
          founded_year: number
          certifications: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          description: string
          verified?: boolean
          logo: string
          address: string
          phone: string
          email: string
          website?: string | null
          founded_year: number
          certifications?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          verified?: boolean
          logo?: string
          address?: string
          phone?: string
          email?: string
          website?: string | null
          founded_year?: number
          certifications?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      supplier_products: {
        Row: {
          id: string
          supplier_id: string
          branded_product_id: string
          price: number
          stock: number
          location: string
          min_order: number
          bulk_discounts: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          supplier_id: string
          branded_product_id: string
          price: number
          stock: number
          location: string
          min_order: number
          bulk_discounts?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          supplier_id?: string
          branded_product_id?: string
          price?: number
          stock?: number
          location?: string
          min_order?: number
          bulk_discounts?: Json | null
          created_at?: string
          updated_at?: string
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
  }
} 