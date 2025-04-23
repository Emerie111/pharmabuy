"use client"

import Link from "next/link"
import { ShieldCheck, Star, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import BioequivalenceInfo from "@/components/marketplace/bioequivalence-info"
import type { Product } from "@/components/marketplace/product-data"

interface ProductCardProps {
  product: Product
  viewMode: "grid" | "list"
}

export function ProductCard({ product, viewMode }: ProductCardProps) {
  // Get price range from suppliers
  const prices = product.suppliers.map(s => s.price)
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const supplierCount = product.suppliers.length

  return (
    <Card className={`overflow-hidden transition-all duration-200 hover:shadow-md ${
      viewMode === "list" ? "flex" : ""
    }`}>
      <CardContent className={`p-0 ${viewMode === "list" ? "flex flex-1" : ""}`}>
        <div className={`relative ${viewMode === "list" ? "w-48" : ""}`}>
          <img
            src={product.image || "/placeholder.svg?height=200&width=400&text=Product+Image"}
            alt={product.name}
            className={`${viewMode === "list" ? "w-48" : "w-full"} h-48 object-cover`}
          />

          {/* Verification Badge */}
          {product.verified && (
            <div className="absolute top-2 right-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      NAFDAC Verified
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">This product has been verified by NAFDAC</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          {/* Bioequivalence Badge */}
          <div className="absolute top-2 left-2">
            <BioequivalenceInfo value={product.bioequivalence} />
          </div>

          {/* Product Type Badge */}
          <div className="absolute bottom-2 left-2">
            <Badge variant={product.type === "prescription" ? "destructive" : "secondary"}>
              {product.type === "prescription" ? "Rx" : "OTC"}
            </Badge>
          </div>
        </div>

        <div className={`p-4 ${viewMode === "list" ? "flex-1" : ""}`}>
          <div className="space-y-2">
            <div>
              <h3 className="font-bold text-lg">{product.name}</h3>
              <p className="text-sm text-gray-500">
                Generic: {product.genericName} (ref: {product.referenceBrand})
              </p>
            </div>

            <div className="flex justify-between items-center">
              <div>
                <div className="text-lg font-bold">
                  ₦{minPrice.toLocaleString()}
                  {maxPrice > minPrice && (
                    <span className="text-sm font-normal text-gray-500"> - ₦{maxPrice.toLocaleString()}</span>
                  )}
                </div>
                <p className="text-sm text-gray-500">
                  Available from {supplierCount} supplier{supplierCount !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400 mr-1" />
                <span className="font-medium">{product.rating}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <Button asChild className="flex-1" variant="outline">
                <Link href={`/products/${product.id}`}>
                  View Details
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
              <Button className="flex-1">Compare</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 