"use client"

import { useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ProductCard from "@/components/marketplace/product-card"
import { getGenericDrugById } from "@/components/marketplace/product-data"

export default function ProductFamilyPage() {
  const params = useParams()
  const genericId = params.genericId as string
  const drug = getGenericDrugById(genericId)

  if (!drug) {
    return (
      <div className="p-6">
        <Link href="/product-marketplace" className="inline-block mb-6">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Product Marketplace
          </Button>
        </Link>
        <Card>
          <CardContent className="p-6">
            <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
            <p className="text-gray-500">The requested product could not be found.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/product-marketplace" className="inline-block mb-2">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Product Marketplace
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">{drug.name}</h1>
          <p className="text-gray-500">{drug.description}</p>
        </div>
      </div>

      <Tabs defaultValue="brands">
        <TabsList>
          <TabsTrigger value="brands">Available Brands ({drug.brandProducts.length})</TabsTrigger>
          <TabsTrigger value="info">Drug Information</TabsTrigger>
        </TabsList>

        <TabsContent value="brands" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {drug.brandProducts.map((brand) => (
              <ProductCard
                key={brand.id}
                brand={brand}
                genericName={drug.name}
                viewMode="grid"
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="info">
          <Card>
            <CardContent className="p-6 space-y-4">
              <div>
                <h3 className="font-medium mb-2">Category</h3>
                <p className="text-gray-600">{drug.category}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Description</h3>
                <p className="text-gray-600">{drug.description}</p>
              </div>
              <div>
                <h3 className="font-medium mb-2">Indication</h3>
                <p className="text-gray-600">{drug.indication}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 