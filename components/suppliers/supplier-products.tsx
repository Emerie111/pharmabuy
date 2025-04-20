"use client"

import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import ProductCard from "@/components/marketplace/product-card"
import type { Supplier, Product } from "@/components/marketplace/product-data"

interface SupplierProductsProps {
  supplier: Supplier
  products: Product[]
}

export default function SupplierProducts({ supplier, products }: SupplierProductsProps) {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <Link
          href={`/suppliers/${encodeURIComponent(supplier.name)}`}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Supplier Profile
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-2xl font-bold">Products by {supplier.name}</h1>
        <p className="text-gray-500">Browse all products from this supplier</p>
      </div>

      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No products found for this supplier.</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
