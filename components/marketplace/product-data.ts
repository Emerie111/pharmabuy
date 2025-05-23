export interface SupplierProduct {
  supplierId: string
  supplierName?: string
  supplierVerified?: boolean
  price: number
  stock: number
  location: string
  minOrder: number
  unitOfSale?: string
  bulkDiscounts?: {
    quantity: number
    discount: number
  }[]
}

export interface BrandedProduct {
  id: string // e.g., "amoxicillin/floximox"
  brandName: string
  manufacturer: string
  strength: string
  dosageForm: string // e.g., "tablet", "capsule", "suspension"
  packSize: string
  verified: boolean
  rating: number
  image: string
  bioequivalence: number | "pending" | "N/A"
  nafdacNumber: string
  type: "prescription" | "otc"
  dateAdded: string
  countryOfOrigin: string
  suppliers: SupplierProduct[]
  description?: string
  tags?: string[]
  genericDrugId?: string
}

export interface GenericDrug {
  id: string // e.g., "amoxicillin"
  name: string
  category: string
  description: string
  indication: string
  brandProducts: BrandedProduct[]
}

export interface Product {
  id: string
  name: string
  genericName: string
  referenceBrand: string
  category: string
  unit: string
  verified: boolean
  rating: number
  image: string
  bioequivalence: number | "pending" | "N/A"
  nafdacNumber: string
  type: "prescription" | "otc"
  dateAdded: string
  suppliers: SupplierProduct[]
  price?: number
  stock?: number
  location?: string
  supplier?: string
  minOrder?: number
  supplierVerified?: boolean
}

export interface Supplier {
  name: string
  description: string
  verified: boolean
  logo: string
  address: string
  phone: string
  email: string
  website?: string
  foundedYear?: number
  certifications?: string[]
}

// Hardcoded data and old functions are removed as data is now fetched from Supabase.
// This file will now primarily serve for type definitions related to marketplace products.
