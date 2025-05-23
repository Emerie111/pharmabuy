"use client"

import { useParams } from "next/navigation"
import { ArrowLeft, ShieldCheck, Star, ShoppingCart, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useRef, useState } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BioequivalenceDetails } from "@/components/marketplace/bioequivalence-details"
import { useCartStore, type CartItem } from "@/components/marketplace/cartStore"
import Link from "next/link"
import { fetchBrandedProductDetails } from "@/lib/supabase-data-access"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import React from "react"

interface BrandedProductPageProps {
  params: {
    genericId: string
    brandId: string
  }
}

// Extended interfaces to match the structure from supabase-data-access.ts
// These should align with what fetchBrandedProductDetails returns.
export interface SupplierProduct {
  supplierId: string
  supplierName?: string
  supplierVerified?: boolean
  price: number
  stock: number
  minOrder?: number
  unitOfSale?: string
  // Add other fields from FrontendSupplierProduct or Supabase if needed
}

export interface BrandedProduct {
  id: string
  brandName: string
  genericName?: string
  manufacturer?: string
  strength?: string
  dosageForm?: string
  packSize?: string
  nafdacNumber?: string
  countryOfOrigin?: string
  image?: string
  rating?: number
  verified?: boolean
  type?: 'Rx' | 'otc'
  description?: string
  tags?: string[]
  suppliers: SupplierProduct[]
  bioequivalenceData?: any
  genericDrugId?: string
}

export default function BrandedProductPage({ params }: BrandedProductPageProps) {
  const suppliersRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<string>("suppliers")
  const [shouldScroll, setShouldScroll] = useState(false)
  
  // Destructure addItem from useCartStore
  const { addItem } = useCartStore()

  // Safely unwrap params
  const routeParams = useParams()
  const safeGenericId = typeof params.genericId === 'string' ? params.genericId : 
                         typeof routeParams.genericId === 'string' ? routeParams.genericId : ''
  const safeBrandId = typeof params.brandId === 'string' ? params.brandId : 
                      typeof routeParams.brandId === 'string' ? routeParams.brandId : ''
  
  const [product, setProduct] = useState<BrandedProduct | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasRedirected, setHasRedirected] = useState(false)

  // On mount, set tab based on hash
  useEffect(() => {
    if (window.location.hash === '#suppliers') {
      setActiveTab('suppliers')
      setShouldScroll(true)
    }
  }, [])

  // Scroll when suppliers tab is active and shouldScroll is true
  useEffect(() => {
    if (activeTab === 'suppliers' && shouldScroll && suppliersRef.current) {
      suppliersRef.current.scrollIntoView({ behavior: 'smooth' })
      setShouldScroll(false)
    }
  }, [activeTab, shouldScroll])

  useEffect(() => {
    if (!safeBrandId) {
      setError("No brand ID provided.")
      setIsLoading(false)
      return
    }
    const loadProduct = async () => {
      setIsLoading(true)
      setError(null)
      setProduct(null)
      try {
        // The fetchBrandedProductDetails should return a type compatible with local BrandedProduct
        const fetchedProduct = await fetchBrandedProductDetails(safeBrandId)
        if (!fetchedProduct) {
          setError("Product details not found.")
        } else {
          // Explicitly cast if necessary, but ideally types align
          setProduct(fetchedProduct as BrandedProduct)
          
          // Redirect to SEO-friendly URL if product is found and hasn't redirected yet
          if (fetchedProduct.brandName && !hasRedirected) {
            setHasRedirected(true)
            const seoURL = `/drugs/${encodeURIComponent(safeGenericId)}/${encodeURIComponent(safeBrandId)}/${encodeURIComponent(fetchedProduct.brandName)}${window.location.hash || ''}`
            window.location.href = seoURL
            return
          }
        }
      } catch (err) {
        console.error("Failed to fetch product details:", err)
        setError("Could not load product details. Please try again.")
      }
      setIsLoading(false)
    }
    loadProduct()
  }, [safeBrandId, safeGenericId, hasRedirected])

  // Show loading while we're redirecting or loading data
  if (hasRedirected || isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error && !product) {
    return (
      <div className="container mx-auto p-6">
        <Link href={`/drugs/${safeGenericId || ''}`} className="inline-block mb-4 text-blue-600 hover:underline">
          <Button variant="ghost"><ArrowLeft className="h-4 w-4 mr-2" />Back to Generic</Button>
        </Link>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Product</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto p-6">
        <Link href={`/drugs/${safeGenericId || ''}`} className="inline-block mb-4 text-blue-600 hover:underline">
            <Button variant="ghost"><ArrowLeft className="h-4 w-4 mr-2" />Back to Generic</Button>
        </Link>
        <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertTitle>Product Not Found</AlertTitle>
            <AlertDescription>The specific branded product (ID: {safeBrandId}) could not be found or there was an issue loading its details.</AlertDescription>
        </Alert>
      </div>
    )
  }

  // We shouldn't get here as we should have redirected to the SEO-friendly URL
  // But just in case, show a message that we're redirecting
  return (
    <div className="container mx-auto p-6 flex justify-center items-center flex-col min-h-[calc(100vh-200px)]">
      <LoadingSpinner />
      <p className="text-gray-500 mt-4">Redirecting to product details...</p>
    </div>
  )
} 