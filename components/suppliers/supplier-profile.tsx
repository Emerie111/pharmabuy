"use client"

import Link from "next/link"
import { ArrowLeft, Check, MapPin, Phone, Mail, Globe, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Supplier } from "@/components/marketplace/product-data"

interface SupplierProfileProps {
  supplier: Supplier
}

export default function SupplierProfile({ supplier }: SupplierProfileProps) {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link href="/buyer-dashboard/suppliers" className="flex items-center text-sm text-blue-600 hover:text-blue-800">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Suppliers
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Supplier Info */}
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="p-0">
              <div className="relative">
                <img
                  src={supplier.logo || "/placeholder.svg?height=200&width=400&text=Supplier+Logo"}
                  alt={supplier.name}
                  className="w-full h-48 object-cover"
                />
                {supplier.verified && (
                  <div className="absolute top-2 right-2">
                    <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Verified Supplier
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{supplier.name}</h2>
                <p className="text-gray-500 mb-4">{supplier.description}</p>

                <div className="space-y-3">
                  <div className="flex items-start">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5 mr-2" />
                    <span>{supplier.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-500 mr-2" />
                    <span>{supplier.phone}</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-500 mr-2" />
                    <span>{supplier.email}</span>
                  </div>
                  {supplier.website && (
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 text-gray-500 mr-2" />
                      <a
                        href={supplier.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {supplier.website.replace(/^https?:\/\//, "")}
                      </a>
                    </div>
                  )}
                </div>

                <div className="mt-6">
                  <Button className="w-full">Contact Supplier</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Supplier Details and Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="products">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
            </TabsList>
            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Products by {supplier.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">Products from this supplier will be displayed here</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle>About {supplier.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Company Overview</h3>
                    <p className="text-gray-600">
                      {supplier.description} Founded in {supplier.foundedYear || "N/A"},{supplier.name} has been a
                      trusted pharmaceutical supplier in Nigeria.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Certifications</h3>
                    <div className="flex flex-wrap gap-2">
                      {supplier.certifications?.map((cert, index) => (
                        <div key={index} className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                          <Check className="h-3 w-3 text-green-600 mr-1" />
                          <span className="text-sm">{cert}</span>
                        </div>
                      )) || <p className="text-gray-500">No certifications listed</p>}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="reviews">
              <Card>
                <CardHeader>
                  <CardTitle>Supplier Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
                    <p className="text-gray-400">Reviews for this supplier will be displayed here</p>
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
