import Link from "next/link"
import { ShieldCheck, ChevronRight, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import type { GenericDrug } from "./product-data"

interface GenericProductCardProps {
  drug: GenericDrug
  viewMode?: "grid" | "list"
}

export default function GenericProductCard({ drug, viewMode = "grid" }: GenericProductCardProps) {
  // Calculate ranges and statistics
  const priceRange = drug.brandProducts.reduce(
    (acc, brand) => {
      const lowestPrice = Math.min(...brand.suppliers.map(s => s.price))
      return {
        min: Math.min(acc.min, lowestPrice),
        max: Math.max(acc.max, lowestPrice)
      }
    },
    { min: Infinity, max: 0 }
  )

  const bioequivalenceRange = drug.brandProducts.reduce(
    (acc, brand) => {
      if (typeof brand.bioequivalence === 'number') {
        return {
          min: Math.min(acc.min, brand.bioequivalence),
          max: Math.max(acc.max, brand.bioequivalence)
        }
      }
      return acc
    },
    { min: Infinity, max: 0 }
  )

  const verifiedBrandsCount = drug.brandProducts.filter(b => b.verified).length
  const averageRating = drug.brandProducts.reduce((sum, brand) => sum + brand.rating, 0) / drug.brandProducts.length

  // Get the first brand's strength as reference (assuming all brands have same strength)
  const strength = drug.brandProducts[0]?.strength || ""

  return (
    <Card className={`overflow-hidden transition-all duration-200 hover:shadow-md ${
      viewMode === "list" ? "flex" : ""
    }`}>
      <CardContent className={`p-0 ${viewMode === "list" ? "flex flex-1" : ""}`}>
        <div className={`relative ${viewMode === "list" ? "w-48" : ""}`}>
          <img
            src={drug.brandProducts[0]?.image || "/placeholder.svg"}
            alt={drug.name}
            className={`${viewMode === "list" ? "w-48" : "w-full"} h-48 object-cover`}
          />

          {/* Verification Badge */}
          {verifiedBrandsCount > 0 && (
            <div className="absolute top-2 right-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      {verifiedBrandsCount} Verified Brand{verifiedBrandsCount !== 1 ? 's' : ''}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">{verifiedBrandsCount} brand{verifiedBrandsCount !== 1 ? 's' : ''} verified by NAFDAC</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute bottom-2 left-2">
            <Badge variant="secondary">
              {drug.category.charAt(0).toUpperCase() + drug.category.slice(1)}
            </Badge>
          </div>
        </div>

        <div className="p-4 flex-1">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-lg">{drug.name} {strength}</h3>
              <p className="text-sm text-gray-500">
                {drug.brandProducts.length} Brand{drug.brandProducts.length !== 1 ? 's' : ''} Available
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {drug.description}
              </p>
            </div>
          </div>

          <div className="flex justify-between items-center mb-3">
            <div className="text-sm">
              <span className="font-bold text-lg">₦{priceRange.min.toLocaleString()}</span>
              <span className="text-gray-500"> - </span>
              <span className="font-bold text-lg">₦{priceRange.max.toLocaleString()}</span>
            </div>
          </div>

          {bioequivalenceRange.min !== Infinity && (
            <div className="flex justify-between items-center mb-3">
              <div className="text-xs text-gray-500">
                Bioequivalence: {bioequivalenceRange.min}% - {bioequivalenceRange.max}%
              </div>
              <div className="flex items-center">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400 mr-1" />
                <span className="font-medium">{averageRating.toFixed(1)}</span>
              </div>
            </div>
          )}

          <Link 
            href={`/drugs/${encodeURIComponent(drug.id)}`}
            className="mt-2 block"
          >
            <Button className="w-full">
              View Brands
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
} 