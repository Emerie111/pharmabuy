"use client"

import Link from "next/link"
import { ShieldCheck, Check, Star, ShoppingCart, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import BioequivalenceInfo from "./bioequivalence-info"
import type { Product } from "./product-data"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-md">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={product.image || "/placeholder.svg?height=200&width=400&text=Product+Image"}
            alt={product.name}
            className="w-full h-48 object-cover"
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

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-lg">{product.name}</h3>
              <p className="text-sm text-gray-500">
                Generic: {product.genericName} (ref: {product.referenceBrand})
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-3">
            <div className="text-sm">
              <span className="font-bold text-lg">₦{product.price.toLocaleString()}</span>
              <span className="text-gray-500 ml-1">/ {product.unit}</span>
            </div>
            <div className="text-xs text-gray-500">
              Min Order: {product.minOrder} {product.unit.includes("pack") ? "packs" : "units"}
            </div>
          </div>

          <div className="flex justify-between items-center mb-3">
            <div className="text-xs text-gray-500 flex items-center">
              <Check className="h-3 w-3 mr-1 text-green-600" />
              In stock: {product.stock}+ {product.unit.includes("pack") ? "packs" : "units"}
            </div>
            <div className="text-xs text-gray-500">{product.location}, Nigeria</div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="text-xs text-gray-500 flex items-center">
              <Link
                href={`/suppliers/${encodeURIComponent(product.supplier)}`}
                className="hover:text-blue-600 hover:underline"
              >
                {product.supplier}
              </Link>
              {product.supplierVerified && (
                <span className="ml-1 inline-flex items-center">
                  <Check className="h-3 w-3 text-green-600" />
                </span>
              )}
            </div>
            <div className="flex items-center">
              <Star className="h-3 w-3 text-amber-400 fill-amber-400 mr-1" />
              <span className="text-xs font-medium">{product.rating}</span>
            </div>
          </div>

          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link href={`/products/${product.id}`} className="flex-1">
                    <Button size="sm" variant="outline" className="w-full">
                      Details
                    </Button>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="top" className="w-64 p-3">
                  <h4 className="font-medium mb-2">Details Preview</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 text-blue-500" />
                      <span>View full bioequivalence data</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 text-blue-500" />
                      <span>See NAFDAC certification</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-3 w-3 text-blue-500" />
                      <span>Compare with reference product</span>
                    </li>
                  </ul>
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="text-xs">
                      <span className="text-gray-500">NAFDAC: </span>
                      <span className="font-medium">{product.nafdacNumber}</span>
                    </div>
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button size="sm" className="flex-1">
              <ShoppingCart className="h-4 w-4 mr-1" />
              Add to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
