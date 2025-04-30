"use client"

import { useState } from "react"
import { Search, Filter, MapPin, ShieldCheck, Star, Building, Clock, Truck, Users, CheckCircle, Calendar, Tag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Supplier {
  id: string
  name: string
  location: string
  rating: number
  verificationLevel: "gold" | "verified" | "basic"
  yearsInBusiness: number
  transactions: number
  responseTime: string
  specializations: string[]
  nafdacVerified: boolean
  image: string
}

// Sample supplier data with the specified distribution
const suppliers: Supplier[] = [
  // Gold Verified (40%)
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
    nafdacVerified: true,
    image: "/placeholder.svg?height=80&width=80&text=PC",
  },
  {
    id: "s2",
    name: "Global Pharma Distributors",
    location: "Port Harcourt",
    rating: 4.9,
    verificationLevel: "gold",
    yearsInBusiness: 15,
    transactions: 780,
    responseTime: "< 2 hours",
    specializations: ["Full Range", "Imports", "Specialty"],
    nafdacVerified: true,
    image: "/placeholder.svg?height=80&width=80&text=GP",
  },
  {
    id: "s3",
    name: "MediPlus Nigeria",
    location: "Abuja",
    rating: 4.7,
    verificationLevel: "gold",
    yearsInBusiness: 10,
    transactions: 450,
    responseTime: "< 4 hours",
    specializations: ["Cardiovascular", "Antidiabetic", "Imports"],
    nafdacVerified: true,
    image: "/placeholder.svg?height=80&width=80&text=MP",
  },
  {
    id: "s4",
    name: "HealthBridge Pharmaceuticals",
    location: "Lagos",
    rating: 4.6,
    verificationLevel: "gold",
    yearsInBusiness: 8,
    transactions: 380,
    responseTime: "< 5 hours",
    specializations: ["Generics", "OTC", "Vaccines"],
    nafdacVerified: true,
    image: "/placeholder.svg?height=80&width=80&text=HB",
  },
  // Verified (40%)
  {
    id: "s5",
    name: "MedSource Nigeria",
    location: "Kano",
    rating: 4.5,
    verificationLevel: "verified",
    yearsInBusiness: 6,
    transactions: 250,
    responseTime: "< 6 hours",
    specializations: ["Generics", "Medical Supplies"],
    nafdacVerified: true,
    image: "/placeholder.svg?height=80&width=80&text=MS",
  },
  {
    id: "s6",
    name: "PharmaExpress",
    location: "Ibadan",
    rating: 4.4,
    verificationLevel: "verified",
    yearsInBusiness: 5,
    transactions: 200,
    responseTime: "< 8 hours",
    specializations: ["Antibiotics", "Analgesics", "Vaccines"],
    nafdacVerified: true,
    image: "/placeholder.svg?height=80&width=80&text=PE",
  },
  {
    id: "s7",
    name: "MediTech Solutions",
    location: "Lagos",
    rating: 4.3,
    verificationLevel: "verified",
    yearsInBusiness: 4,
    transactions: 180,
    responseTime: "< 12 hours",
    specializations: ["OTC", "Medical Devices"],
    nafdacVerified: true,
    image: "/placeholder.svg?height=80&width=80&text=MT",
  },
  {
    id: "s8",
    name: "PharmaLink Nigeria",
    location: "Port Harcourt",
    rating: 4.2,
    verificationLevel: "verified",
    yearsInBusiness: 3,
    transactions: 150,
    responseTime: "< 24 hours",
    specializations: ["Generics", "OTC"],
    nafdacVerified: true,
    image: "/placeholder.svg?height=80&width=80&text=PL",
  },
  // Basic (20%)
  {
    id: "s9",
    name: "MediCare Plus",
    location: "Abuja",
    rating: 4.0,
    verificationLevel: "basic",
    yearsInBusiness: 2,
    transactions: 100,
    responseTime: "< 48 hours",
    specializations: ["OTC", "Supplements"],
    nafdacVerified: false,
    image: "/placeholder.svg?height=80&width=80&text=MC",
  },
  {
    id: "s10",
    name: "PharmaTech",
    location: "Lagos",
    rating: 3.8,
    verificationLevel: "basic",
    yearsInBusiness: 1,
    transactions: 50,
    responseTime: "< 72 hours",
    specializations: ["Generics"],
    nafdacVerified: false,
    image: "/placeholder.svg?height=80&width=80&text=PT",
  },
]

export default function SupplierDirectory() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("all")
  const [selectedSpecialty, setSelectedSpecialty] = useState("all")
  const [selectedVerification, setSelectedVerification] = useState("all")
  const [selectedRating, setSelectedRating] = useState("all")
  const [selectedOrders, setSelectedOrders] = useState("all")
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  // Filter suppliers
  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.specializations.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesLocation = selectedLocation === "all" || supplier.location === selectedLocation
    const matchesSpecialty = selectedSpecialty === "all" || supplier.specializations.includes(selectedSpecialty)
    const matchesVerification =
      selectedVerification === "all" ||
      (selectedVerification === "gold" && supplier.verificationLevel === "gold") ||
      (selectedVerification === "verified" && supplier.verificationLevel === "verified") ||
      (selectedVerification === "basic" && supplier.verificationLevel === "basic")
    const matchesRating =
      selectedRating === "all" ||
      (selectedRating === "4.5+" && supplier.rating >= 4.5) ||
      (selectedRating === "4.0+" && supplier.rating >= 4.0) ||
      (selectedRating === "3.5+" && supplier.rating >= 3.5)
    const matchesOrders =
      selectedOrders === "all" ||
      (selectedOrders === "500+" && supplier.transactions >= 500) ||
      (selectedOrders === "200+" && supplier.transactions >= 200) ||
      (selectedOrders === "100+" && supplier.transactions >= 100)

    return matchesSearch && matchesLocation && matchesSpecialty && matchesVerification && matchesRating && matchesOrders
  })

  // Update active filters
  const updateActiveFilters = () => {
    const filters: string[] = []
    if (selectedLocation !== "all") filters.push(selectedLocation)
    if (selectedSpecialty !== "all") filters.push(selectedSpecialty)
    if (selectedVerification !== "all") filters.push(selectedVerification)
    if (selectedRating !== "all") filters.push(selectedRating)
    if (selectedOrders !== "all") filters.push(selectedOrders)
    setActiveFilters(filters)
  }

  // Remove filter
  const removeFilter = (filter: string) => {
    if (filter === selectedLocation) setSelectedLocation("all")
    if (filter === selectedSpecialty) setSelectedSpecialty("all")
    if (filter === selectedVerification) setSelectedVerification("all")
    if (filter === selectedRating) setSelectedRating("all")
    if (filter === selectedOrders) setSelectedOrders("all")
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <div className="flex flex-col gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search suppliers by name, location, or specialty..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Location" />
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

            <Select value={selectedSpecialty} onValueChange={setSelectedSpecialty}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Specialty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Specialties</SelectItem>
                <SelectItem value="Antibiotics">Antibiotics</SelectItem>
                <SelectItem value="OTC">OTC</SelectItem>
                <SelectItem value="Generics">Generics</SelectItem>
                <SelectItem value="Vaccines">Vaccines</SelectItem>
                <SelectItem value="Medical Supplies">Medical Supplies</SelectItem>
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

            <Select value={selectedRating} onValueChange={setSelectedRating}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="4.5+">4.5+ Stars</SelectItem>
                <SelectItem value="4.0+">4.0+ Stars</SelectItem>
                <SelectItem value="3.5+">3.5+ Stars</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedOrders} onValueChange={setSelectedOrders}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Orders" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="500+">500+ Orders</SelectItem>
                <SelectItem value="200+">200+ Orders</SelectItem>
                <SelectItem value="100+">100+ Orders</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" className="flex items-center gap-1">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">More Filters</span>
            </Button>
          </div>

          {/* Active Filters */}
          {activeFilters.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {activeFilters.map((filter) => (
                <Badge
                  key={filter}
                  variant="secondary"
                  className="flex items-center gap-1 cursor-pointer"
                  onClick={() => removeFilter(filter)}
                >
                  {filter}
                  <span className="text-xs">×</span>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Supplier Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSuppliers.map((supplier: Supplier) => (
          <SupplierCard key={supplier.id} supplier={supplier} />
        ))}
      </div>

      {/* Load More Button */}
      {filteredSuppliers.length > 0 && (
        <div className="flex justify-center mt-6">
          <Button variant="outline" className="w-full max-w-xs">
            Load More
          </Button>
        </div>
      )}

      {/* No Results */}
      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No suppliers found matching your criteria.</p>
          <Button
            variant="link"
            onClick={() => {
              setSearchQuery("")
              setSelectedLocation("all")
              setSelectedSpecialty("all")
              setSelectedVerification("all")
              setSelectedRating("all")
              setSelectedOrders("all")
            }}
          >
            Clear filters
          </Button>
        </div>
      )}

      {/* Supply Chain Transparency Section */}
      <div className="bg-white rounded-lg border shadow-sm p-6 mt-8">
        <h2 className="text-xl font-bold mb-4">Supply Chain Transparency</h2>
        <p className="text-gray-600 mb-4">
          Enter a product name or NAFDAC number to view its complete supply chain journey
        </p>
        <div className="flex gap-4">
          <Input
            placeholder="Enter product name or NAFDAC number..."
            className="flex-1"
          />
          <Button>Track Supply Chain</Button>
        </div>
      </div>
    </div>
  )
}

function SupplierCard({ supplier }: { supplier: Supplier }) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-md bg-blue-100 flex items-center justify-center overflow-hidden">
              <img
                src={supplier.image || "/placeholder.svg"}
                alt={supplier.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-medium flex items-center gap-2">
                {supplier.name}
                <Badge
                  className={`${
                    supplier.verificationLevel === "gold"
                      ? "bg-amber-100 text-amber-800"
                      : supplier.verificationLevel === "verified"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {supplier.verificationLevel === "gold"
                    ? "Gold"
                    : supplier.verificationLevel === "verified"
                    ? "Verified"
                    : "Basic"}
                </Badge>
              </h3>
              <p className="text-sm text-gray-500 flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {supplier.location}, Nigeria
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400" />
            <span className="font-medium">{supplier.rating}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{supplier.yearsInBusiness} years</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{supplier.transactions} orders</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm">{supplier.responseTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className={`h-4 w-4 ${supplier.nafdacVerified ? "text-green-500" : "text-gray-500"}`} />
            <span className="text-sm">{supplier.nafdacVerified ? "NAFDAC Verified" : "Pending"}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {supplier.specializations.map((spec: string) => (
            <Badge key={spec} variant="secondary" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {spec}
            </Badge>
          ))}
        </div>

        <Button className="w-full mt-4">View Profile</Button>
      </CardContent>
    </Card>
  )
}
