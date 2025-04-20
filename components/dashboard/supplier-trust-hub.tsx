"use client"

import { useState } from "react"
import {
  BadgeCheck,
  Building,
  Calendar,
  Clock,
  Filter,
  MapPin,
  Search,
  ShieldCheck,
  Star,
  Truck,
  Users,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"

export default function SupplierTrustHub() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg border shadow-sm p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search suppliers by name, location, or specialization..."
              className="pl-10 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <h4 className="font-medium">Filter Suppliers</h4>

                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Verification Status</h5>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Any status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any status</SelectItem>
                        <SelectItem value="verified">Verified only</SelectItem>
                        <SelectItem value="gold">Gold verified</SelectItem>
                        <SelectItem value="pending">Pending verification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Location</h5>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All Nigeria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Nigeria</SelectItem>
                        <SelectItem value="lagos">Lagos</SelectItem>
                        <SelectItem value="abuja">Abuja</SelectItem>
                        <SelectItem value="kano">Kano</SelectItem>
                        <SelectItem value="ibadan">Ibadan</SelectItem>
                        <SelectItem value="port-harcourt">Port Harcourt</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Specialization</h5>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="All specializations" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All specializations</SelectItem>
                        <SelectItem value="generics">Generic Medications</SelectItem>
                        <SelectItem value="branded">Branded Medications</SelectItem>
                        <SelectItem value="antibiotics">Antibiotics</SelectItem>
                        <SelectItem value="otc">OTC Products</SelectItem>
                        <SelectItem value="equipment">Medical Equipment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-sm font-medium">Minimum Rating</h5>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Any rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Any rating</SelectItem>
                        <SelectItem value="4">4+ Stars</SelectItem>
                        <SelectItem value="3">3+ Stars</SelectItem>
                        <SelectItem value="2">2+ Stars</SelectItem>
                      </SelectContent>
                    </Select>
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
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="verified">Verification Status</SelectItem>
                <SelectItem value="transactions">Most Transactions</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Suppliers</TabsTrigger>
          <TabsTrigger value="verified">Verified</TabsTrigger>
          <TabsTrigger value="gold">Gold Verified</TabsTrigger>
          <TabsTrigger value="recent">Recently Used</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <SupplierCard
                key={i}
                name={`Pharma Supplier ${i + 1}`}
                location="Lagos, Nigeria"
                rating={4.5 - (i % 3) * 0.5}
                verificationLevel={i % 3 === 0 ? "gold" : i % 3 === 1 ? "verified" : "basic"}
                yearsInBusiness={5 + i}
                transactions={100 * (i + 1)}
                specializations={["Antibiotics", "OTC", "Generics"]}
              />
            ))}
          </div>

          <div className="flex justify-center">
            <Button variant="outline">Load More</Button>
          </div>
        </TabsContent>

        <TabsContent value="verified" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(4)].map((_, i) => (
              <SupplierCard
                key={i}
                name={`Verified Supplier ${i + 1}`}
                location="Abuja, Nigeria"
                rating={4.7 - (i % 2) * 0.2}
                verificationLevel={i % 2 === 0 ? "gold" : "verified"}
                yearsInBusiness={7 + i}
                transactions={150 * (i + 1)}
                specializations={["Antibiotics", "Prescription", "Vaccines"]}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="gold" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <SupplierCard
                key={i}
                name={`Gold Supplier ${i + 1}`}
                location="Port Harcourt, Nigeria"
                rating={4.8 - (i % 2) * 0.1}
                verificationLevel="gold"
                yearsInBusiness={10 + i}
                transactions={200 * (i + 1)}
                specializations={["Full Range", "Imports", "Specialty"]}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recent" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(2)].map((_, i) => (
              <SupplierCard
                key={i}
                name={`Recent Supplier ${i + 1}`}
                location="Kano, Nigeria"
                rating={4.3 - (i % 2) * 0.3}
                verificationLevel={i % 2 === 0 ? "verified" : "basic"}
                yearsInBusiness={3 + i}
                transactions={50 * (i + 1)}
                specializations={["Generics", "OTC"]}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Supply Chain Transparency</CardTitle>
          <CardDescription>View the complete supply chain for select products to ensure authenticity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input placeholder="Enter product name or NAFDAC number..." className="pl-10 w-full" />
              </div>
              <Button>Track Supply Chain</Button>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300 text-center">
              <p className="text-gray-500">
                Enter a product name or NAFDAC number to view its complete supply chain journey
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

interface SupplierCardProps {
  name: string
  location: string
  rating: number
  verificationLevel: "gold" | "verified" | "basic"
  yearsInBusiness: number
  transactions: number
  specializations: string[]
}

function SupplierCard({
  name,
  location,
  rating,
  verificationLevel,
  yearsInBusiness,
  transactions,
  specializations,
}: SupplierCardProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="p-4 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium flex items-center">
                {name}
                {verificationLevel === "gold" && (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <BadgeCheck className="h-4 w-4 ml-1 text-amber-500" />
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
                {location}
              </p>
            </div>
            <Badge
              className={
                verificationLevel === "gold"
                  ? "bg-amber-500"
                  : verificationLevel === "verified"
                    ? "bg-green-500"
                    : "bg-gray-500"
              }
            >
              {verificationLevel === "gold" ? "Gold Verified" : verificationLevel === "verified" ? "Verified" : "Basic"}
            </Badge>
          </div>

          <div className="flex items-center mt-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : i < rating ? "text-amber-400 fill-amber-400" : "text-gray-300"}`}
                />
              ))}
            </div>
            <span className="ml-2 text-sm font-medium">{rating.toFixed(1)}</span>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Years in Business</span>
              <span className="text-sm font-medium flex items-center">
                <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                {yearsInBusiness} years
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Transactions</span>
              <span className="text-sm font-medium flex items-center">
                <Truck className="h-3 w-3 mr-1 text-gray-400" />
                {transactions}+
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-gray-500">Response Time</span>
              <span className="text-sm font-medium flex items-center">
                <Clock className="h-3 w-3 mr-1 text-gray-400" />
                &lt; 24 hours
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
              {specializations.map((spec, i) => (
                <Badge key={i} variant="outline" className="text-xs">
                  {spec}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <span className="text-xs text-gray-500 block mb-1">Trust Score</span>
            <Progress
              value={verificationLevel === "gold" ? 90 : verificationLevel === "verified" ? 75 : 50}
              className="h-2"
            />
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
