"use client"

import { useState } from "react"
import { Filter, Grid3X3, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FilterSheet } from "@/components/marketplace/filter-sheet"
import { ActiveFilters } from "@/components/marketplace/active-filters"
import { getAllGenericDrugs, GenericDrug, BrandedProduct } from "@/components/marketplace/product-data"
import { BrandCard } from "./brand-card"

interface SearchResultsProps {
  searchQuery: string
}

const filterSections = [
  {
    id: "type",
    title: "Product Type",
    options: [
      { id: "otc", label: "Over the Counter (OTC)" },
      { id: "prescription", label: "Prescription (Rx)" }
    ]
  },
  {
    id: "bioequivalence",
    title: "Bioequivalence",
    options: [
      { id: "a", label: "Class A (>90%)" },
      { id: "b", label: "Class B (80-90%)" },
      { id: "c", label: "Class C (<80%)" }
    ]
  },
  {
    id: "origin",
    title: "Country of Origin",
    options: [
      { id: "nigeria", label: "Made in Nigeria" },
      { id: "imported", label: "Imported" }
    ]
  },
  {
    id: "verification",
    title: "Verification",
    options: [
      { id: "nafdac", label: "NAFDAC Verified" },
      { id: "gmp", label: "GMP Certified" }
    ]
  }
]

export function SearchResults({ searchQuery }: SearchResultsProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedSort, setSelectedSort] = useState("relevance")
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // Get all generic drugs
  const allGenericDrugs = getAllGenericDrugs()

  // Filter generic drugs and their brands based on search query
  const filteredDrugs = allGenericDrugs
    .filter((drug) => {
      const matchesGeneric = drug.name.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesBrands = drug.brandProducts.some(
        brand =>
          brand.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          brand.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          brand.suppliers.some(s => s.supplierId.toLowerCase().includes(searchQuery.toLowerCase()))
      )
      return matchesGeneric || matchesBrands
    })
    .map(drug => ({
      ...drug,
      brandProducts: filterBrandProducts(drug.brandProducts, activeFilters)
    }))
    .filter(drug => drug.brandProducts.length > 0)

  // Handle filter changes
  const handleFilterChange = (filterId: string) => {
    setActiveFilters(current =>
      current.includes(filterId)
        ? current.filter(id => id !== filterId)
        : [...current, filterId]
    )
  }

  // Clear all filters
  const handleClearFilters = () => {
    setActiveFilters([])
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant={viewMode === "grid" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    Grid
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4 mr-2" />
                    List
                  </Button>
                </div>

                <FilterSheet
                  sections={filterSections}
                  activeFilters={activeFilters}
                  onFilterChange={handleFilterChange}
                  onClearAll={handleClearFilters}
                />
              </div>

              <Select value={selectedSort} onValueChange={setSelectedSort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="bioequivalence">Bioequivalence</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <ActiveFilters
              filters={activeFilters.map(id => ({ id, label: id }))}
              onRemove={handleFilterChange}
              onClearAll={handleClearFilters}
            />
          </CardContent>
        </Card>
      </div>

      <div className="space-y-8">
        {filteredDrugs.map((drug) => (
          <div key={drug.id} className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">{drug.name}</h2>
                <p className="text-sm text-gray-500">
                  {drug.brandProducts.length} brand{drug.brandProducts.length !== 1 ? "s" : ""} available
                </p>
                <p className="text-sm text-gray-600 mt-1">{drug.description}</p>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href={`/drugs/${drug.id}`}>View All Brands</a>
              </Button>
            </div>

            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                  : "space-y-4"
              }
            >
              {sortBrandProducts(drug.brandProducts, selectedSort).map(brand => (
                <BrandCard
                  key={brand.id}
                  brand={brand}
                  genericName={drug.name}
                  viewMode={viewMode}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Helper function to filter brand products based on active filters
function filterBrandProducts(brands: BrandedProduct[], activeFilters: string[]): BrandedProduct[] {
  if (activeFilters.length === 0) return brands

  return brands.filter(brand => {
    const matchesType = activeFilters.includes(brand.type) ||
      !activeFilters.some(f => ["otc", "prescription"].includes(f))
    
    const matchesBioequivalence = 
      !activeFilters.some(f => ["a", "b", "c"].includes(f)) ||
      (typeof brand.bioequivalence === "number" && (
        (activeFilters.includes("a") && brand.bioequivalence > 90) ||
        (activeFilters.includes("b") && brand.bioequivalence >= 80 && brand.bioequivalence <= 90) ||
        (activeFilters.includes("c") && brand.bioequivalence < 80)
      ))
    
    const matchesOrigin = 
      !activeFilters.some(f => ["nigeria", "imported"].includes(f)) ||
      (activeFilters.includes("nigeria") && brand.countryOfOrigin === "Nigeria") ||
      (activeFilters.includes("imported") && brand.countryOfOrigin !== "Nigeria")
    
    const matchesVerification = 
      !activeFilters.some(f => ["nafdac", "gmp"].includes(f)) ||
      (activeFilters.includes("nafdac") && brand.verified)

    return matchesType && matchesBioequivalence && matchesOrigin && matchesVerification
  })
}

// Helper function to sort brand products
function sortBrandProducts(brands: BrandedProduct[], sortBy: string): BrandedProduct[] {
  const sorted = [...brands]
  
  switch (sortBy) {
    case "price-low":
      return sorted.sort((a, b) => {
        const minPriceA = Math.min(...a.suppliers.map(s => s.price))
        const minPriceB = Math.min(...b.suppliers.map(s => s.price))
        return minPriceA - minPriceB
      })
    case "price-high":
      return sorted.sort((a, b) => {
        const minPriceA = Math.min(...a.suppliers.map(s => s.price))
        const minPriceB = Math.min(...b.suppliers.map(s => s.price))
        return minPriceB - minPriceA
      })
    case "rating":
      return sorted.sort((a, b) => b.rating - a.rating)
    case "bioequivalence":
      return sorted.sort((a, b) => {
        if (typeof a.bioequivalence === "number" && typeof b.bioequivalence === "number") {
          return b.bioequivalence - a.bioequivalence
        }
        return typeof a.bioequivalence === "number" ? -1 : 1
      })
    default:
      return sorted
  }
} 