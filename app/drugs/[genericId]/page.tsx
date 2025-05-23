"use client"

import { useParams, notFound } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductCard from "@/components/marketplace/product-card"
import { useEffect, useState } from "react"
import type { GenericDrug, BrandedProduct } from "@/components/marketplace/product-data"
import { fetchGenericDrugById } from "@/lib/supabase-data-access"

export default function ProductFamilyPage() {
  const params = useParams()
  const genericId = params.genericId as string

  const [drug, setDrug] = useState<GenericDrug | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!genericId) {
      setIsLoading(false)
      setError("No product ID provided.")
      return
    }

    const loadDrugDetails = async () => {
      setIsLoading(true)
      setError(null)
      setDrug(null)
      try {
        const fetchedDrug = await fetchGenericDrugById(genericId)
        if (!fetchedDrug) {
          setError("Product not found.")
        } else {
          setDrug(fetchedDrug)
        }
      } catch (err) {
        console.error("Failed to fetch drug details:", err)
        setError("Failed to load product details. Please try again later.")
      }
      setIsLoading(false)
    }

    loadDrugDetails()
  }, [genericId])

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 text-center">
        Loading product family details...
      </div>
    )
  }

  if (error && !drug) {
    return (
      <div className="container mx-auto p-6">
        <Link href="/product-marketplace" className="inline-block mb-6">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Product Marketplace
          </Button>
        </Link>
        <Card>
          <CardHeader><CardTitle className="text-red-600">Error</CardTitle></CardHeader>
          <CardContent className="p-6">
            <p className="text-gray-500">{error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!drug) {
    return (
      <div className="container mx-auto p-6">
        <Link href="/product-marketplace" className="inline-block mb-6">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Product Marketplace
          </Button>
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Product Not Found</CardTitle>
          </CardHeader>
          <CardContent><p>The requested product details could not be loaded.</p></CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/product-marketplace" className="inline-block mb-2">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Product Marketplace
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">{drug.name}</h1>
          <p className="text-gray-600 text-lg mt-1">{drug.description}</p>
        </div>
      </div>

      <Tabs defaultValue="brands" className="w-full">
        <TabsList>
          <TabsTrigger value="brands">Available Brands ({drug.brandProducts.length})</TabsTrigger>
          <TabsTrigger value="info">Drug Information</TabsTrigger>
        </TabsList>

        <TabsContent value="brands" className="mt-6">
          {drug.brandProducts.length === 0 ? (
            <p className="text-gray-500">(No brands found for this generic drug)</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {drug.brandProducts.map((brand: BrandedProduct) => (
                <ProductCard
                  key={brand.id}
                  brand={brand}
                  genericName={drug.name}
                  viewMode="grid"
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="info" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Detailed Information</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 mb-1">Category</h3>
                <p className="text-gray-600">{drug.category}</p>
              </div>
              <hr />
              <div>
                <h3 className="font-medium text-gray-700 mb-1">Description</h3>
                <p className="text-gray-600">{drug.description}</p>
              </div>
              <hr />
              <div>
                <h3 className="font-medium text-gray-700 mb-1">Indication</h3>
                <p className="text-gray-600">{drug.indication}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 