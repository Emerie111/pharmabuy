"use client"

import { useState } from "react"
import { Search, Filter, MapPin, ShieldCheck, Star, Building, Clock, Truck, Users, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function SupplierDirectory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedVerification, setSelectedVerification] = useState("all")
  const [selectedSort, setSelectedSort] = useState("rating")

  // Sample supplier data
  const suppliers = [
    {
      id: "s1",
      name: "PharmaCare Ltd",
      location: "Lagos",
      rating: 4.8,
      verificationLevel: "gold",
      yearsInBusiness: 12,
      transactions: 520,
      responseTime: "< 3 hours",
      specializations: ["Antibiotics", "OTC", "Generics"],
      trustScore: 95,
      image: "/placeholder.svg?height=80&width=80&text=PC",
    },
    {
      id: "s2",
      name: "MediPlus Nigeria",
      location: "Abuja",
      rating: 4.6,
      verificationLevel: "verified",
      yearsInBusiness: 8,
      transactions: 350,
      responseTime: "< 6 hours",
      specializations: ["Cardiovascular", "Antidiabetic", "Imports"],
      trustScore: 87,
      image: "/placeholder.svg?height=80&width=80&text=MP",
    },
    {
      id: "s3",
      name: "Global Pharma Distributors",
      location: "Port Harcourt",
      rating: 4.9,
      verificationLevel: "gold",
      yearsInBusiness: 15,
      transactions: 780,
      responseTime: "< 2 hours",
      specializations: ["Full Range", "Imports", "Specialty"],
      trustScore: 98,
      image: "/placeholder.svg?height=80&width=80&text=GP",
    },
    {
      id: "s4",
      name: "HealthBridge Pharmaceuticals",
      location: "Lagos",
      rating: 4.5,
      verificationLevel: "verified",
      yearsInBusiness: 6,
      transactions: 210,
      responseTime: "< 12 hours",
      specializations: ["Generics", "OTC"],
      trustScore: 82,
      image: "/placeholder.svg?height=80&width=80&text=HB",
    },
    {
      id: "s5",
      name: "MedSource Nigeria",
      location: "Kano",
      rating: 4.2,
      verificationLevel: "basic",
      yearsInBusiness: 4,
      transactions: 120,
      responseTime: "< 24 hours",
      specializations: ["Generics", "Medical Supplies"],
      trustScore: 75,
      image: "/placeholder.svg?height=80&width=80&text=MS",
    },
    {
      id: "s6",
      name: "PharmaExpress",
      location: "Ibadan",
      rating: 4.7,
      verificationLevel: "verified",
      yearsInBusiness: 7,
      transactions: 290,
      responseTime: "< 4 hours",
      specializations: ["Antibiotics", "Analgesics", "Vaccines"],
      trustScore: 89,
      image: "/placeholder.svg?height=80&width=80&text=PE",
    },
  ]

  // Filter suppliers
  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.specializations.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesLocation = selectedLocation === "all" || supplier.location === selectedLocation
    const matchesVerification =
      selectedVerification === "all" ||
      (selectedVerification === "gold" && supplier.verificationLevel === "gold") ||
      (selectedVerification === "verified" &&
        (supplier.verificationLevel === "verified" || supplier.verificationLevel === "gold")) ||
      (selectedVerification === "basic" && supplier.verificationLevel === "basic")
    return matchesSearch && matchesLocation && matchesVerification
  })

  // Sort suppliers
  const sortedSuppliers = [...filteredSuppliers].sort((a, b) => {
    switch (selectedSort) {
      case "rating":
        return b.rating - a.rating
      case "transactions":
        return b.transactions - a.transactions
      case "trust":
        return b.trustScore - a.trustScore
      case "years":
        return b.yearsInBusiness - a.yearsInBusiness
      default:
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
              placeholder="Search suppliers by name or specialization..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Lagos">Lagos</SelectItem>
                <SelectItem value="Abuja">Abuja</SelectItem>
                <SelectItem value="Port Harcourt">Port Harcourt</SelectItem>
                <SelectItem value="Kano">Kano</SelectItem>
                <SelectItem value="Ibadan">Ibadan</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedVerification} onValueChange={setSelectedVerification}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Verification" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                <SelectItem value="gold">Gold Verified</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="basic">Basic</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedSort} onValueChange={setSelectedSort}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="transactions">Most Transactions</SelectItem>
                <SelectItem value="trust">Trust Score</SelectItem>
                <SelectItem value="years">Years in Business</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">More Filters</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedSuppliers.map((supplier) => (
          <SupplierCard key={supplier.id} supplier={supplier} />
        ))}
      </div>

      {sortedSuppliers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No suppliers found matching your criteria.</p>
          <Button
            variant="link"
            onClick={() => {
              setSearchQuery("")
              setSelectedLocation("all")
              setSelectedVerification("all")
            }}
          >
            Clear filters
          </Button>
        </div>
      )}
    </div>
  )
}

function SupplierCard({ supplier }: { supplier: any }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center overflow-hidden">
                <img
                  src={supplier.image || "/placeholder.svg"}
                  alt={supplier.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="font-medium flex items-center">
                  {supplier.name}
                  {supplier.verificationLevel === "gold" && (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <CheckCircle className="h-4 w-4 ml-1 text-amber-500" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="text-xs">Gold Verified Supplier</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}
                </h3>
                <p className="text-sm text-gray-500 flex items-center">
                  <MapPin className="h-3 w-3 mr-1" />
                  {supplier.location}, Nigeria
                </p>
              </div>
            </div>
            <Badge
              className={
                supplier.verificationLevel === "gold"
                  ? "bg-amber-500"
                  : supplier.verificationLevel === "verified"
                    ? "bg-green-500"
                    : "bg-gray-500"
              }
            >
              {supplier.verificationLevel === "gold"
                ? "Gold Verified"
                : supplier.verificationLevel === "verified"
                  ? "Verified"
                  : "Basic"}
            </Badge>
          </div>

          <div className="flex items-center mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(supplier.rating) ? "text-amber-400 fill-amber-400" : i < supplier.rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm font-medium">{supplier.rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Years in Business</span>
              <span className="text-sm font-medium flex items-center">
                <Building className="h-3 w-3 mr-1 text-gray-400" />
                {supplier.yearsInBusiness} years
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Transactions</span>
              <span className="text-sm font-medium flex items-center">
                <Truck className="h-3 w-3 mr-1 text-gray-400" />
                {supplier.transactions}+
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Response Time</span>
              <span className="text-sm font-medium flex items-center">
                <Clock className="h-3 w-3 mr-1 text-gray-400" />
                {supplier.responseTime}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Verification</span>
              <span className="text-sm font-medium flex items-center">
                <ShieldCheck className="h-3 w-3 mr-1 text-green-500" />
                NAFDAC Verified
              </span>
            </div>
          </div>

          <div className="mb-4">
            <span className="text-xs text-gray-500 block mb-1">Specializations</span>
            <div className="flex flex-wrap gap-1">
              {supplier.specializations.map((spec: string, i: number) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <span className="text-xs text-gray-500 block mb-1">Trust Score</span>
            <Progress value={supplier.trustScore} className="h-2" />
            <div className="flex justify-between mt-1">
              <span className="text-xs text-gray-500">Basic</span>
              <span className="text-xs text-gray-500">Gold</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Building className="h-4 w-4 mr-1" />
              Profile
            </Button>
            <Button size="sm" className="flex-1">
              <Users className="h-4 w-4 mr-1" />
              Contact
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
