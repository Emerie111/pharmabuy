"use client"

import { notFound } from "next/navigation"
import { ArrowLeft, ShieldCheck, Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BioequivalenceInfo from "@/components/marketplace/bioequivalence-info"
import { getGenericDrugById, getAllGenericDrugs } from "@/components/marketplace/product-data"
import { Suspense } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BioequivalenceDetails } from "@/components/marketplace/bioequivalence-details"

interface BrandedProductPageProps {
  params: {
    genericId: string
    brandId: string
  }
}

// Add interface for supplier type
interface Supplier {
  supplierId: string
  price: number
  stock: number
  location: string
  minOrder: number
  bulkDiscounts?: Array<{
    quantity: number
    discount: number
  }>
}

interface BrandedProduct {
  id: string
  brandName: string
  manufacturer: string
  strength: string
  packSize: string
  type: "prescription" | "otc"
  image: string
  rating: number
  verified: boolean
  bioequivalence: number | "pending" | "unavailable"
  nafdacNumber: string
  countryOfOrigin: string
  dosageForm: string
  suppliers: Supplier[]
}

interface GenericDrug {
  id: string
  name: string
  description: string
  indication: string
  brandProducts: BrandedProduct[]
}

export default async function BrandedProductPage({ params }: BrandedProductPageProps) {
  // Wrap data fetching in try-catch
  try {
    const drug = await getGenericDrugById(params.genericId) || 
      (await getAllGenericDrugs()).find(d => 
        d.name.toLowerCase() === params.genericId.toLowerCase()
      )

    const brand = drug?.brandProducts.find(b => 
      b.brandName.toLowerCase() === params.brandId.toLowerCase() ||
      b.id.toLowerCase() === `${params.genericId}/${params.brandId}`.toLowerCase()
    )

    if (!drug || !brand) {
      notFound()
    }

    // Get price range from suppliers
    const prices = brand.suppliers.map(s => s.price)
    const minPrice = Math.min(...prices)
    const maxPrice = Math.max(...prices)

    return (
      <div className="min-h-screen bg-gray-50">
        <Suspense fallback={<LoadingSpinner />}>
          <div className="bg-white border-b">
            <div className="container mx-auto px-4 py-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.history.back()}
                className="mb-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to {drug.name}
              </Button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative bg-white p-4 rounded-lg border">
                  <div className="aspect-square relative">
                    <img
                      src={brand.image}
                      alt={brand.brandName}
                      className="absolute inset-0 w-full h-full object-contain"
                    />
                    {brand.verified && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1.5 rounded-full flex items-center">
                          <ShieldCheck className="h-4 w-4 mr-2" />
                          NAFDAC Verified
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-6 bg-white p-6 rounded-lg border">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h1 className="text-3xl font-bold">{brand.brandName}</h1>
                      <Badge variant={brand.type === "prescription" ? "destructive" : "secondary"}>
                        {brand.type === "prescription" ? "Rx" : "OTC"}
                      </Badge>
                    </div>
                    <p className="text-xl text-gray-600">{drug.name} {brand.strength}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                      <span className="font-medium text-lg">{brand.rating}</span>
                    </div>
                    <div className="text-2xl font-bold">
                      ₦{minPrice.toLocaleString()}
                      {maxPrice > minPrice && (
                        <span className="text-lg font-normal text-gray-500"> - ₦{maxPrice.toLocaleString()}</span>
                      )}
                    </div>
                    <p className="text-gray-500">
                      Available from {brand.suppliers.length} supplier{brand.suppliers.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Bioequivalence:</span>
                      <BioequivalenceInfo value={brand.bioequivalence} />
                    </div>
                    <p className="text-sm text-gray-600">
                      <strong>Manufacturer:</strong> {brand.manufacturer}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Pack Size:</strong> {brand.packSize}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Country of Origin:</strong> {brand.countryOfOrigin}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>NAFDAC Number:</strong> {brand.nafdacNumber}
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button size="lg" className="w-full">Compare with Other Brands</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-6">
            <Card>
              <CardContent className="p-6">
                <Tabs defaultValue="suppliers">
                  <TabsList>
                    <TabsTrigger value="suppliers">Suppliers ({brand.suppliers.length})</TabsTrigger>
                    <TabsTrigger value="details">Product Details</TabsTrigger>
                    <TabsTrigger value="bioequivalence">Bioequivalence</TabsTrigger>
                  </TabsList>

                  <TabsContent value="suppliers" className="mt-6">
                    <div className="space-y-4">
                      {brand.suppliers.map((supplier, index) => (
                        <Card key={supplier.supplierId || index}>
                          <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium">{supplier.supplierId}</h3>
                                <p className="text-sm text-gray-500">{supplier.location}</p>
                                <p className="text-sm text-gray-500">Stock: {supplier.stock} units</p>
                              </div>
                              <div className="text-right">
                                <div className="font-bold">₦{supplier.price.toLocaleString()}</div>
                                <p className="text-sm text-gray-500">
                                  Min. Order: {supplier.minOrder} {brand.packSize}
                                </p>
                                <Button size="sm" className="mt-2">
                                  <ShoppingCart className="h-4 w-4 mr-1" />
                                  Add to Cart
                                </Button>
                              </div>
                            </div>
                            {supplier.bulkDiscounts && supplier.bulkDiscounts.length > 0 && (
                              <div className="mt-3 pt-3 border-t">
                                <p className="text-sm font-medium mb-2">Bulk Discounts:</p>
                                <div className="space-y-1">
                                  {supplier.bulkDiscounts.map((discount, i) => (
                                    <p key={i} className="text-sm text-gray-600">
                                      {discount.discount}% off for orders ≥ {discount.quantity} units
                                    </p>
                                  ))}
                                </div>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </TabsContent>

                  <TabsContent value="details" className="mt-6">
                    <div className="prose max-w-none">
                      <h3>About {brand.brandName}</h3>
                      <p>{drug.description}</p>
                      
                      <h4>Indication</h4>
                      <p>{drug.indication}</p>

                      <h4>Product Information</h4>
                      <ul>
                        <li>Generic Name: {drug.name}</li>
                        <li>Brand Name: {brand.brandName}</li>
                        <li>Manufacturer: {brand.manufacturer}</li>
                        <li>Strength: {brand.strength}</li>
                        <li>Dosage Form: {brand.dosageForm}</li>
                        <li>Pack Size: {brand.packSize}</li>
                        <li>NAFDAC Registration: {brand.nafdacNumber}</li>
                        <li>Country of Origin: {brand.countryOfOrigin}</li>
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="bioequivalence" className="mt-6">
                    <div className="space-y-6">
                      <BioequivalenceDetails 
                        data={{
                          referenceProduct: {
                            name: "Amoxil® 500mg",
                            manufacturer: "GSK"
                          },
                          testProduct: {
                            name: brand.brandName,
                            manufacturer: brand.manufacturer
                          },
                          testingInfo: {
                            authority: "NAFDAC Bioequivalence Research Center",
                            date: "March 2024",
                            certificateNumber: "BE-2024-0472"
                          },
                          metrics: {
                            auc: {
                              test: 28.4,
                              reference: 27.8,
                              ratio: 102.2,
                              confidenceInterval: [96.5, 107.8],
                              result: "PASS"
                            },
                            cmax: {
                              test: 8.7,
                              reference: 8.5,
                              ratio: 102.4,
                              confidenceInterval: [92.7, 112.5],
                              result: "PASS"
                            },
                            tmax: {
                              test: 1.8,
                              reference: 1.7
                            }
                          },
                          status: "BIOEQUIVALENT"
                        }}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </Suspense>
      </div>
    )
  } catch (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load product details. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    )
  }
} 