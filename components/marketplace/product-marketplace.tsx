"use client"

import { useState } from "react"
import { Search, Grid3X3, List, Filter, AlertCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import GenericProductCard from "./generic-product-card"
import { FilterSheet } from "./filter-sheet"
import { ActiveFilters } from "./active-filters"
import { getAllGenericDrugs } from "./product-data"
import type { GenericDrug } from "./product-data"

// Filter sections data
const filterSections = [
  {
    id: "categories",
    title: "Categories",
    options: [
      { id: "antibiotics", label: "Antibiotics", count: 45 },
      { id: "analgesics", label: "Analgesics", count: 32 },
      { id: "antidiabetic", label: "Antidiabetic", count: 28 },
      { id: "cardiovascular", label: "Cardiovascular", count: 35 },
      { id: "gastrointestinal", label: "Gastrointestinal", count: 25 },
    ],
  },
  {
    id: "verification",
    title: "Verification",
    options: [
      { id: "has-verified-brands", label: "Has Verified Brands", count: 120 },
      { id: "all-brands-verified", label: "All Brands Verified", count: 85 },
    ],
  },
  {
    id: "bioequivalence",
    title: "Bioequivalence",
    options: [
      { id: "be-90-plus", label: "90% or higher", count: 75 },
      { id: "be-80-89", label: "80-89%", count: 45 },
      { id: "be-below-80", label: "Below 80%", count: 15 },
      { id: "be-pending", label: "Pending", count: 25 },
    ],
  },
]

// Quick filter options
const quickFilters = [
  { id: "has-verified-brands", label: "Has Verified Brands" },
  { id: "be-90-plus", label: "90%+ Bioequivalence" },
  { id: "antibiotics", label: "Antibiotics" },
  { id: "analgesics", label: "Analgesics" },
  { id: "rx-only", label: "Prescription Only" },
]

export default function ProductMarketplace() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedSort, setSelectedSort] = useState("relevance")
  const [showBanner, setShowBanner] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)

  // Get all generic drugs
  const genericDrugs = getAllGenericDrugs()

  // Handle filter changes
  const handleFilterChange = (filterId: string) => {
    setActiveFilters((current) =>
      current.includes(filterId)
        ? current.filter((id) => id !== filterId)
        : [...current, filterId]
    )
  }

  // Clear all filters
  const handleClearFilters = () => {
    setActiveFilters([])
  }

  // Get active filter objects for display
  const activeFilterObjects = activeFilters.map((id) => {
    const option = filterSections
      .flatMap((section) => section.options)
      .find((opt) => opt.id === id)
    return option ? { id, label: option.label } : null
  }).filter((filter): filter is { id: string; label: string } => filter !== null)

  // Filter generic drugs based on search query and active filters
  const filteredDrugs = genericDrugs.filter((drug) => {
    const matchesSearch =
      drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drug.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      drug.brandProducts.some(brand => 
        brand.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        brand.manufacturer.toLowerCase().includes(searchQuery.toLowerCase())
      )

    const matchesFilters =
      activeFilters.length === 0 ||
      activeFilters.every((filterId) => {
        // Category filters
        if (filterId.startsWith("category-")) {
          return drug.category.toLowerCase() === filterId.replace("category-", "")
        }
        // Verification filters
        if (filterId === "has-verified-brands") {
          return drug.brandProducts.some(brand => brand.verified)
        }
        if (filterId === "all-brands-verified") {
          return drug.brandProducts.every(brand => brand.verified)
        }
        // Bioequivalence filters
        if (filterId === "be-90-plus") {
          return drug.brandProducts.some(brand => 
            typeof brand.bioequivalence === 'number' && brand.bioequivalence >= 90
          )
        }
        if (filterId === "be-80-89") {
          return drug.brandProducts.some(brand =>
            typeof brand.bioequivalence === 'number' && 
            brand.bioequivalence >= 80 && 
            brand.bioequivalence < 90
          )
        }
        if (filterId === "be-below-80") {
          return drug.brandProducts.some(brand =>
            typeof brand.bioequivalence === 'number' && brand.bioequivalence < 80
          )
        }
        if (filterId === "be-pending") {
          return drug.brandProducts.some(brand => brand.bioequivalence === "pending")
        }
        // Product type filters
        if (filterId === "rx-only") {
          return drug.brandProducts.some(brand => brand.type === "prescription")
        }
        return true
      })

    return matchesSearch && matchesFilters
  })

  // Sort generic drugs
  const sortedDrugs = [...filteredDrugs].sort((a, b) => {
    switch (selectedSort) {
      case "price-low":
        const aMinPrice = Math.min(...a.brandProducts.flatMap(brand => 
          brand.suppliers.map(s => s.price)
        ))
        const bMinPrice = Math.min(...b.brandProducts.flatMap(brand => 
          brand.suppliers.map(s => s.price)
        ))
        return aMinPrice - bMinPrice
      case "price-high":
        const aMaxPrice = Math.max(...a.brandProducts.flatMap(brand => 
          brand.suppliers.map(s => s.price)
        ))
        const bMaxPrice = Math.max(...b.brandProducts.flatMap(brand => 
          brand.suppliers.map(s => s.price)
        ))
        return bMaxPrice - aMaxPrice
      case "rating":
        const aAvgRating = a.brandProducts.reduce((sum, brand) => sum + brand.rating, 0) / a.brandProducts.length
        const bAvgRating = b.brandProducts.reduce((sum, brand) => sum + brand.rating, 0) / b.brandProducts.length
        return bAvgRating - aAvgRating
      case "newest":
        const aNewest = Math.max(...a.brandProducts.map(brand => new Date(brand.dateAdded).getTime()))
        const bNewest = Math.max(...b.brandProducts.map(brand => new Date(brand.dateAdded).getTime()))
        return bNewest - aNewest
      default: // relevance
        return 0
    }
  })

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Product Marketplace</h1>
          <p className="text-gray-500">Browse verified pharmaceutical products</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
            <Grid3X3 className="h-4 w-4 mr-2" />
            Grid
          </Button>
          <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
            <List className="h-4 w-4 mr-2" />
            List
          </Button>
        </div>
      </div>

      {showBanner && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>New Feature: Bioequivalence Data</AlertTitle>
          <AlertDescription className="flex justify-between items-center">
            <span>
              Products now display bioequivalence ratings compared to reference brands. Look for the colored indicators
              showing how closely generic medications match their brand-name counterparts.
            </span>
            <Button variant="ghost" size="sm" onClick={() => setShowBanner(false)}>
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block w-64 flex-shrink-0 sticky top-6 h-fit">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">Filters</h3>
                {activeFilters.length > 0 && (
                  <Button variant="ghost" size="sm" onClick={handleClearFilters}>
                    Clear all
                  </Button>
                )}
              </div>

              {filterSections.map((section) => (
                <div key={section.id} className="mb-6">
                  <h4 className="font-medium mb-2">{section.title}</h4>
                  <div className="space-y-2">
                    {section.options.map((option) => (
                      <div key={option.id} className="flex items-center">
                        <Checkbox
                          id={option.id}
                          checked={activeFilters.includes(option.id)}
                          onCheckedChange={() => handleFilterChange(option.id)}
                        />
                        <label htmlFor={option.id} className="text-sm ml-2 flex-1">
                          {option.label}
                        </label>
                        <span className="text-xs text-gray-500">({option.count})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  placeholder="Search by generic name, brand, or manufacturer..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={selectedSort} onValueChange={setSelectedSort}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Sort by Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="icon" 
                className="lg:hidden"
                onClick={() => setIsFilterSheetOpen(true)}
              >
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Quick Filters */}
          <ScrollArea className="w-full mb-6">
            <div className="flex gap-2">
              {quickFilters.map((filter) => (
                <Button
                  key={filter.id}
                  variant={activeFilters.includes(filter.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange(filter.id)}
                  className="whitespace-nowrap"
                >
                  {filter.label}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          {/* Active Filters */}
          {activeFilterObjects.length > 0 && (
            <div className="mb-6">
              <ActiveFilters
                filters={activeFilterObjects}
                onRemove={(id) => handleFilterChange(id)}
                onClear={handleClearFilters}
              />
            </div>
          )}

          {/* Products Grid/List */}
          <div className={`grid gap-6 ${
            viewMode === "grid" 
              ? "grid-cols-1 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-2" 
              : "grid-cols-1"
          }`}>
            {sortedDrugs.map((drug) => (
              <GenericProductCard
                key={drug.id}
                drug={drug}
                viewMode={viewMode}
              />
            ))}
          </div>

          {/* Mobile Filter Sheet */}
          <FilterSheet
            open={isFilterSheetOpen}
            onOpenChange={setIsFilterSheetOpen}
            sections={filterSections}
            activeFilters={activeFilters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
          />
        </div>
      </div>
    </div>
  )
}
