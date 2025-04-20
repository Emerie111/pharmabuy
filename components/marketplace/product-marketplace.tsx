"use client"

import { useState } from "react"
import { Search, X, AlertCircle, Grid3X3, List } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import ProductCard from "./product-card"
import { getAllProducts } from "./product-data"

export default function ProductMarketplace() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSort, setSelectedSort] = useState("relevance")
  const [showBanner, setShowBanner] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  // Get all products
  const products = getAllProducts()

  // Filter products based on search query and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.supplier.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (selectedSort) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.rating - a.rating
      case "newest":
        return new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime()
      default: // relevance
        return 0
    }
  })

  return (
    <div className="p-6 space-y-6">
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
        {/* Filter Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-medium mb-3">Filters</h3>

              <div className="space-y-5">
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Categories</h4>
                  <div className="space-y-2">
                    {["antibiotics", "analgesics", "antidiabetic", "cardiovascular", "gastrointestinal"].map(
                      (category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category}`}
                            checked={selectedCategory === category}
                            onCheckedChange={() =>
                              setSelectedCategory(selectedCategory === category ? "all" : category)
                            }
                          />
                          <label
                            htmlFor={`category-${category}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                          >
                            {category}
                          </label>
                        </div>
                      ),
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Verification</h4>
                  <div className="space-y-2">
                    {["NAFDAC Verified", "Supplier Verified"].map((status) => (
                      <div key={status} className="flex items-center space-x-2">
                        <Checkbox id={`status-${status}`} />
                        <label
                          htmlFor={`status-${status}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {status}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Bioequivalence</h4>
                  <div className="space-y-2">
                    {["90% or higher", "80-89%", "Below 80%", "Pending", "Not Available"].map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox id={`bio-${level}`} />
                        <label
                          htmlFor={`bio-${level}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {level}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Product Type</h4>
                  <div className="space-y-2">
                    {["Prescription (Rx)", "Over-the-counter (OTC)"].map((type) => (
                      <div key={type} className="flex items-center space-x-2">
                        <Checkbox id={`type-${type}`} />
                        <label
                          htmlFor={`type-${type}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {type}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          <Card className="mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search products, generics, suppliers..."
                    className="pl-10 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
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
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {sortedProducts.length > 0 ? (
            <div
              className={`grid ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"} gap-6`}
            >
              {sortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-6 text-center">
                <p className="text-gray-500 mb-2">No products found matching your criteria.</p>
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedCategory("all")
                  }}
                >
                  Clear filters
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
