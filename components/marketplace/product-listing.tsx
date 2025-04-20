"use client"

import { useState } from "react"
import { Search, Filter, ShieldCheck, Check, Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function ProductListing() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedSort, setSelectedSort] = useState("relevance")

  // Sample product data
  const products = [
    {
      id: "p1",
      name: "Amoxicillin 500mg",
      category: "antibiotics",
      price: 2500,
      unit: "pack of 10",
      minOrder: 5,
      stock: 200,
      location: "Lagos",
      supplier: "PharmaCare Ltd",
      verified: true,
      rating: 4.8,
      image: "/placeholder.svg?height=150&width=300&text=Amoxicillin",
    },
    {
      id: "p2",
      name: "Paracetamol 500mg",
      category: "analgesics",
      price: 800,
      unit: "pack of 20",
      minOrder: 10,
      stock: 500,
      location: "Abuja",
      supplier: "MediPlus Nigeria",
      verified: true,
      rating: 4.5,
      image: "/placeholder.svg?height=150&width=300&text=Paracetamol",
    },
    {
      id: "p3",
      name: "Metformin 850mg",
      category: "antidiabetic",
      price: 1200,
      unit: "pack of 30",
      minOrder: 3,
      stock: 120,
      location: "Port Harcourt",
      supplier: "DiabeCare Ltd",
      verified: false,
      rating: 4.2,
      image: "/placeholder.svg?height=150&width=300&text=Metformin",
    },
    {
      id: "p4",
      name: "Lisinopril 10mg",
      category: "cardiovascular",
      price: 1800,
      unit: "pack of 15",
      minOrder: 2,
      stock: 80,
      location: "Lagos",
      supplier: "CardioHealth Inc",
      verified: true,
      rating: 4.7,
      image: "/placeholder.svg?height=150&width=300&text=Lisinopril",
    },
    {
      id: "p5",
      name: "Azithromycin 250mg",
      category: "antibiotics",
      price: 3500,
      unit: "pack of 6",
      minOrder: 2,
      stock: 150,
      location: "Ibadan",
      supplier: "PharmaTrust",
      verified: true,
      rating: 4.6,
      image: "/placeholder.svg?height=150&width=300&text=Azithromycin",
    },
    {
      id: "p6",
      name: "Omeprazole 20mg",
      category: "gastrointestinal",
      price: 1500,
      unit: "pack of 14",
      minOrder: 3,
      stock: 90,
      location: "Kano",
      supplier: "GastroMed Ltd",
      verified: false,
      rating: 4.0,
      image: "/placeholder.svg?height=150&width=300&text=Omeprazole",
    },
  ]

  // Filter products based on search query and category
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
      default: // relevance
        return 0
    }
  })

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products, suppliers, NAFDAC codes..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="antibiotics">Antibiotics</SelectItem>
                <SelectItem value="analgesics">Analgesics</SelectItem>
                <SelectItem value="antidiabetic">Antidiabetic</SelectItem>
                <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                <SelectItem value="gastrointestinal">Gastrointestinal</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSort} onValueChange={setSelectedSort}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filters</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {sortedProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No products found matching your criteria.</p>
          <Button
            variant="link"
            onClick={() => {
              setSearchQuery("")
              setSelectedCategory("all")
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}

function ProductCard({ product }: { product: any }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-40 object-cover" />
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
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium">{product.name}</h3>
              <p className="text-sm text-gray-500">Generic: {product.name.split(" ")[0]}</p>
            </div>
            <Badge
              variant={product.verified ? "default" : "outline"}
              className={product.verified ? "bg-green-500" : ""}
            >
              {product.verified ? "Verified" : "Unverified"}
            </Badge>
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

          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500 flex items-center">
              <span>{product.supplier}</span>
              {product.verified && (
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

          <div className="flex gap-1 mt-4">
            <Button size="sm" variant="outline" className="flex-1">
              Details
            </Button>
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
