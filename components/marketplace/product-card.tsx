"use client"

import Link from "next/link"
import { ShieldCheck, Check, Star, ShoppingCart, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import BioequivalenceInfo from "./bioequivalence-info"
import type { BrandedProduct } from "./product-data"
import { getSupplierByName } from "./product-data"

interface ProductCardProps {
  brand: BrandedProduct
  genericName: string
  viewMode?: "grid" | "list"
}

export default function ProductCard({ brand, genericName, viewMode = "grid" }: ProductCardProps) {
  // Get aggregated supplier information
  const totalSuppliers = brand.suppliers.length;
  const priceRange = {
    min: Math.min(...brand.suppliers.map(s => s.price)),
    max: Math.max(...brand.suppliers.map(s => s.price))
  };
  const totalStock = brand.suppliers.reduce((sum, s) => sum + s.stock, 0);
  const minOrderQty = Math.min(...brand.suppliers.map(s => s.minOrder));
  const locations = [...new Set(brand.suppliers.map(s => s.location))];

  return (
    <Card className={`overflow-hidden transition-all duration-200 hover:shadow-md ${
      viewMode === "list" ? "flex" : ""
    }`}>
      <CardContent className={`p-0 ${viewMode === "list" ? "flex flex-1" : ""}`}>
        <div className={`relative ${viewMode === "list" ? "w-48" : ""}`}>
          <img
            src={brand.image}
            alt={brand.brandName}
            className={`${viewMode === "list" ? "w-48" : "w-full"} h-48 object-cover`}
          />

          {/* Verification Badge */}
          {brand.verified && (
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
            <BioequivalenceInfo value={brand.bioequivalence} />
          </div>

          {/* Product Type Badge */}
          <div className="absolute bottom-2 left-2">
            <Badge variant={brand.type === "prescription" ? "destructive" : "secondary"}>
              {brand.type === "prescription" ? "Rx" : "OTC"}
            </Badge>
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-lg">{brand.brandName}</h3>
              <p className="text-sm text-gray-500">
                {genericName} {brand.strength} • {brand.manufacturer}
              </p>
              <p className="text-xs text-gray-500">
                {brand.packSize} • Made in {brand.countryOfOrigin}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-3">
            <div className="text-sm">
              <span className="font-bold text-lg">₦{priceRange.min.toLocaleString()}</span>
              {priceRange.max > priceRange.min && (
                <span className="text-gray-500"> - ₦{priceRange.max.toLocaleString()}</span>
              )}
              <span className="text-gray-500 ml-1">/ {brand.packSize}</span>
            </div>
            <div className="text-xs text-gray-500">
              Min Order: {minOrderQty} {brand.packSize.includes("pack") ? "packs" : "units"}
            </div>
          </div>

          <div className="flex justify-between items-center mb-3">
            <div className="text-xs text-gray-500 flex items-center">
              <Check className="h-3 w-3 mr-1 text-green-600" />
              In stock: {totalStock}+ {brand.packSize.includes("pack") ? "packs" : "units"}
            </div>
            <div className="text-xs text-gray-500">{locations.length} location{locations.length > 1 ? 's' : ''}</div>
          </div>

          <div className="flex justify-between items-center mb-4">
            <div className="text-xs text-gray-500">
              {totalSuppliers} verified supplier{totalSuppliers > 1 ? 's' : ''} available
            </div>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-amber-400 fill-amber-400 mr-1" />
              <span className="font-medium">{brand.rating}</span>
            </div>
          </div>

          <div className="flex gap-1">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link 
                    href={`/drugs/${encodeURIComponent(genericName.toLowerCase())}/${encodeURIComponent(brand.brandName.toLowerCase())}`} 
                    className="flex-1"
                  >
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
                      <span className="font-medium">{brand.nafdacNumber}</span>
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
