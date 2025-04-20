"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, ShieldCheck, Check, Star, ShoppingCart, Download, Share2, Bookmark } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import BioequivalenceInfo from "./bioequivalence-info"
import type { Product } from "./product-data"

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [quantity, setQuantity] = useState(product.minOrder)

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link href="/buyer-dashboard/products" className="flex items-center text-sm text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Products
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product Image and Basic Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={product.image || "/placeholder.svg?height=400&width=600&text=Product+Image"}
                  alt={product.name}
                  className="w-full h-80 object-cover"
                />
                {product.verified && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      NAFDAC Verified
                    </div>
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <BioequivalenceInfo value={product.bioequivalence} />
                </div>
                <div className="absolute bottom-2 left-2">
                  <Badge variant={product.type === "prescription" ? "destructive" : "secondary"}>
                    {product.type === "prescription" ? "Rx" : "OTC"}
                  </Badge>
                </div>
              </div>

              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-amber-400 fill-amber-400 mr-1" />
                    <span className="font-medium">{product.rating}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">NAFDAC Number</h3>
                    <p>{product.nafdacNumber}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Category</h3>
                    <p className="capitalize">{product.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Supplier</h3>
                    <div className="flex items-center">
                      <Link
                        href={`/suppliers/${encodeURIComponent(product.supplier)}`}
                        className="text-blue-600 hover:underline"
                      >
                        {product.supplier}
                      </Link>
                      {product.supplierVerified && <Check className="h-4 w-4 ml-1 text-green-600" />}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Location</h3>
                    <p>{product.location}, Nigeria</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Product Details and Tabs */}
        <div className="lg:col-span-2">
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="mb-4">
                <h1 className="text-2xl font-bold">{product.name}</h1>
                <p className="text-gray-500">
                  Generic: {product.genericName} | Reference Brand: {product.referenceBrand}
                </p>
              </div>

              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-3xl font-bold">₦{product.price.toLocaleString()}</span>
                  <span className="text-gray-500 ml-2">/ {product.unit}</span>
                </div>
                <div className="text-sm text-gray-500">
                  Min Order: {product.minOrder} {product.unit.includes("pack") ? "packs" : "units"}
                </div>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(Math.max(product.minOrder, quantity - 1))}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button variant="outline" size="icon" onClick={() => setQuantity(quantity + 1)}>
                    +
                  </Button>
                </div>
                <Button className="flex-1">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
              </div>

              <div className="text-sm text-gray-500 flex items-center mb-2">
                <Check className="h-4 w-4 mr-1 text-green-600" />
                In stock: {product.stock}+ {product.unit.includes("pack") ? "packs" : "units"}
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="overview">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="bioequivalence">Bioequivalence</TabsTrigger>
              <TabsTrigger value="certification">Certification</TabsTrigger>
              <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Product Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Description</h3>
                    <p className="text-gray-600">
                      {product.name} is a pharmaceutical product used for treating various conditions. It contains{" "}
                      {product.genericName} as the active ingredient.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Indications</h3>
                    <p className="text-gray-600">
                      This medication is commonly prescribed for [specific conditions]. Always consult with a healthcare
                      professional before use.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Storage</h3>
                    <p className="text-gray-600">
                      Store in a cool, dry place away from direct sunlight. Keep out of reach of children.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="bioequivalence">
              <Card>
                <CardHeader>
                  <CardTitle>Bioequivalence Data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">Bioequivalence Rating</h3>
                      <div className="mt-2">
                        <BioequivalenceInfo value={product.bioequivalence} />
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download Full Report
                    </Button>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Comparison to Reference Product</h3>
                    <p className="text-gray-600 mb-4">
                      This product has been tested against {product.referenceBrand}, the reference brand for{" "}
                      {product.genericName}.
                    </p>

                    <div className="border rounded-lg overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Parameter
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              This Product
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Reference Brand
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              AUC (Area Under Curve)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">95%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">100%</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              Cmax (Maximum Concentration)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">92%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">100%</td>
                          </tr>
                          <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              Tmax (Time to Max Concentration)
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2.1 hours</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2.0 hours</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="certification">
              <Card>
                <CardHeader>
                  <CardTitle>NAFDAC Certification</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium">NAFDAC Registration Number</h3>
                      <p className="text-lg font-bold mt-1">{product.nafdacNumber}</p>
                    </div>
                    <Button variant="outline" size="sm" className="flex items-center gap-2">
                      <Download className="h-4 w-4" />
                      Download Certificate
                    </Button>
                  </div>
                  <div className="mt-4">
                    <h3 className="font-medium mb-2">Verification Status</h3>
                    <div className="flex items-center">
                      {product.verified ? (
                        <>
                          <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center mr-2">
                            <Check className="h-4 w-4 text-green-600" />
                          </div>
                          <span className="text-green-600 font-medium">Verified</span>
                        </>
                      ) : (
                        <>
                          <div className="h-6 w-6 rounded-full bg-yellow-100 flex items-center justify-center mr-2">
                            <span className="text-yellow-600">!</span>
                          </div>
                          <span className="text-yellow-600 font-medium">Pending Verification</span>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="alternatives">
              <Card>
                <CardHeader>
                  <CardTitle>Alternative Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 mb-4">
                    Similar products containing the same active ingredient ({product.genericName})
                  </p>
                  <div className="h-40 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">Alternative products will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
