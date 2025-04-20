"use client"

import { useState } from "react"
import { Check, Filter, Search, ShieldCheck, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function SearchDiscovery() {
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [nafdacVerifiedOnly, setNafdacVerifiedOnly] = useState(false)

  const toggleFilter = (filter: string) => {
    if (activeFilters.includes(filter)) {
      setActiveFilters(activeFilters.filter((f) => f !== filter))
    } else {
      setActiveFilters([...activeFilters, filter])
    }
  }

  const clearFilters = () => {
    setActiveFilters([])
    setNafdacVerifiedOnly(false)
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input placeholder="Search by brand name, generic name, or NAFDAC number..." className="pl-10 w-full" />
          </div>

          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                  {activeFilters.length > 0 && <Badge className="ml-1 bg-green-500">{activeFilters.length}</Badge>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Filters</h4>
                    {(activeFilters.length > 0 || nafdacVerifiedOnly) && (
                      <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
                        Clear all
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Product Type</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="prescription"
                          checked={activeFilters.includes("prescription")}
                          onCheckedChange={() => toggleFilter("prescription")}
                        />
                        <Label htmlFor="prescription" className="text-sm">
                          Prescription
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="otc"
                          checked={activeFilters.includes("otc")}
                          onCheckedChange={() => toggleFilter("otc")}
                        />
                        <Label htmlFor="otc" className="text-sm">
                          OTC
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Categories</h5>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="antibiotics"
                          checked={activeFilters.includes("antibiotics")}
                          onCheckedChange={() => toggleFilter("antibiotics")}
                        />
                        <Label htmlFor="antibiotics" className="text-sm">
                          Antibiotics
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="analgesics"
                          checked={activeFilters.includes("analgesics")}
                          onCheckedChange={() => toggleFilter("analgesics")}
                        />
                        <Label htmlFor="analgesics" className="text-sm">
                          Analgesics
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="antihypertensives"
                          checked={activeFilters.includes("antihypertensives")}
                          onCheckedChange={() => toggleFilter("antihypertensives")}
                        />
                        <Label htmlFor="antihypertensives" className="text-sm">
                          Antihypertensives
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="vitamins"
                          checked={activeFilters.includes("vitamins")}
                          onCheckedChange={() => toggleFilter("vitamins")}
                        />
                        <Label htmlFor="vitamins" className="text-sm">
                          Vitamins
                        </Label>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Price Range (₦)</h5>
                    <div className="flex items-center gap-2">
                      <Input placeholder="Min" className="h-8" />
                      <span>-</span>
                      <Input placeholder="Max" className="h-8" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Location</h5>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select location" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lagos">Lagos</SelectItem>
                        <SelectItem value="abuja">Abuja</SelectItem>
                        <SelectItem value="kano">Kano</SelectItem>
                        <SelectItem value="ibadan">Ibadan</SelectItem>
                        <SelectItem value="port-harcourt">Port Harcourt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-2 border-t">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="nafdac-verified"
                        checked={nafdacVerifiedOnly}
                        onCheckedChange={(checked) => setNafdacVerifiedOnly(checked as boolean)}
                      />
                      <Label htmlFor="nafdac-verified" className="text-sm font-medium flex items-center">
                        <ShieldCheck className="h-4 w-4 mr-1 text-green-600" />
                        NAFDAC Verified Only
                      </Label>
                    </div>
                  </div>

                  <Button className="w-full">Apply Filters</Button>
                </div>
              </PopoverContent>
            </Popover>

            <Select>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {(activeFilters.length > 0 || nafdacVerifiedOnly) && (
          <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t">
            {nafdacVerifiedOnly && (
              <Badge variant="outline" className="flex items-center gap-1 bg-green-50">
                <ShieldCheck className="h-3 w-3 text-green-600" />
                NAFDAC Verified
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 ml-1 p-0"
                  onClick={() => setNafdacVerifiedOnly(false)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            )}

            {activeFilters.map((filter) => (
              <Badge key={filter} variant="outline" className="flex items-center gap-1">
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
                <Button variant="ghost" size="icon" className="h-4 w-4 ml-1 p-0" onClick={() => toggleFilter(filter)}>
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}

            {(activeFilters.length > 0 || nafdacVerifiedOnly) && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-6 text-xs">
                Clear all
              </Button>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <ProductCard key={i} verified={i % 2 === 0} />
        ))}
      </div>

      <div className="flex justify-center">
        <Button variant="outline">Load More</Button>
      </div>
    </div>
  )
}

function ProductCard({ verified }: { verified: boolean }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative">
          <img
            src={`/placeholder.svg?height=150&width=300&text=Product+Image`}
            alt="Product"
            className="w-full h-40 object-cover"
          />
          {verified && (
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
              <h3 className="font-medium">Amoxicillin 500mg</h3>
              <p className="text-sm text-gray-500">Generic: Amoxicillin</p>
            </div>
            <Badge variant={verified ? "default" : "outline"} className={verified ? "bg-green-500" : ""}>
              {verified ? "Verified" : "Unverified"}
            </Badge>
          </div>

          <div className="flex justify-between items-center mb-3">
            <div className="text-sm">
              <span className="font-bold text-lg">₦2,500</span>
              <span className="text-gray-500 ml-1">/ pack of 10</span>
            </div>
            <div className="text-xs text-gray-500">Min Order: 5 packs</div>
          </div>

          <div className="flex justify-between items-center mb-3">
            <div className="text-xs text-gray-500 flex items-center">
              <Check className="h-3 w-3 mr-1 text-green-600" />
              In stock: 200+ packs
            </div>
            <div className="text-xs text-gray-500">Lagos, Nigeria</div>
          </div>

          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              Supplier: PharmaCare Ltd
              {verified && (
                <span className="ml-1 inline-flex items-center">
                  <Check className="h-3 w-3 text-green-600" />
                </span>
              )}
            </div>
            <div className="flex gap-1">
              <Button size="sm" variant="outline" className="h-8 text-xs">
                Details
              </Button>
              <Button size="sm" className="h-8 text-xs">
                Add to Cart
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
