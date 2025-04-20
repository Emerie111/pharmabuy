"use client"

import {
  AlertTriangle,
  BarChart3,
  Bell,
  Calendar,
  ChevronDown,
  Download,
  LineChart,
  MapPin,
  Package,
  TrendingDown,
  TrendingUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

export default function MarketIntelligence() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">Market Intelligence</h2>
          <p className="text-sm text-gray-500">Stay informed about the Nigerian pharmaceutical market</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="lagos">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select location" />
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
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Market Price Index</CardTitle>
            <LineChart className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">124.5</div>
            <div className="flex items-center mt-1 text-xs">
              <span className="text-green-600 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" />
                3.2% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Stock Availability</CardTitle>
            <Package className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <div className="flex items-center mt-1 text-xs">
              <span className="text-red-600 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" />
                2.1% from last month
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Shortages</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="flex items-center mt-1 text-xs">
              <span className="text-amber-600">5 critical medications</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="price-comparison" className="space-y-4">
        <TabsList>
          <TabsTrigger value="price-comparison">Price Comparison</TabsTrigger>
          <TabsTrigger value="availability">Stock Availability</TabsTrigger>
          <TabsTrigger value="trends">Market Trends</TabsTrigger>
          <TabsTrigger value="shortages">Shortage Alerts</TabsTrigger>
        </TabsList>

        <TabsContent value="price-comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <CardTitle>Price Comparison</CardTitle>
                  <CardDescription>Compare prices across different markets and suppliers</CardDescription>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <Select defaultValue="antibiotics">
                    <SelectTrigger className="w-[160px]">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="antibiotics">Antibiotics</SelectItem>
                      <SelectItem value="analgesics">Analgesics</SelectItem>
                      <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                      <SelectItem value="antidiabetic">Antidiabetic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Avg. Price</TableHead>
                    <TableHead>Lowest Price</TableHead>
                    <TableHead>Highest Price</TableHead>
                    <TableHead>Price Trend</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[
                    { name: "Amoxicillin 500mg", avg: 2500, low: 1800, high: 3200, trend: "up" },
                    { name: "Ciprofloxacin 500mg", avg: 3200, low: 2700, high: 4100, trend: "down" },
                    { name: "Azithromycin 250mg", avg: 4500, low: 3800, high: 5200, trend: "up" },
                    { name: "Ceftriaxone 1g", avg: 6800, low: 5500, high: 8200, trend: "stable" },
                  ].map((product, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>₦{product.avg.toLocaleString()}</TableCell>
                      <TableCell className="text-green-600">₦{product.low.toLocaleString()}</TableCell>
                      <TableCell className="text-red-600">₦{product.high.toLocaleString()}</TableCell>
                      <TableCell>
                        {product.trend === "up" ? (
                          <Badge className="bg-red-500 flex items-center gap-1 w-fit">
                            <TrendingUp className="h-3 w-3" />
                            Rising
                          </Badge>
                        ) : product.trend === "down" ? (
                          <Badge className="bg-green-500 flex items-center gap-1 w-fit">
                            <TrendingDown className="h-3 w-3" />
                            Falling
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="flex items-center gap-1 w-fit">
                            Stable
                          </Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View Full Price Comparison
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                  <CardTitle>Stock Availability</CardTitle>
                  <CardDescription>Check product availability across different markets</CardDescription>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                  <Select defaultValue="lagos">
                    <SelectTrigger className="w-[160px]">
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
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { category: "Antibiotics", availability: 92, products: 120, trend: "stable" },
                  { category: "Analgesics", availability: 96, products: 85, trend: "up" },
                  { category: "Cardiovascular", availability: 78, products: 65, trend: "down" },
                  { category: "Antidiabetic", availability: 84, products: 40, trend: "stable" },
                ].map((category, i) => (
                  <Collapsible key={i}>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">{category.category}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div>
                          <span className="text-sm font-medium">{category.availability}%</span>
                          <span className="text-xs text-gray-500 ml-1">available</span>
                        </div>
                        <CollapsibleTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </CollapsibleTrigger>
                      </div>
                    </div>
                    <CollapsibleContent>
                      <div className="p-3 border border-t-0 rounded-b-md">
                        <div className="text-sm mb-2">
                          <span className="font-medium">Total Products: </span>
                          <span>{category.products}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-green-500 mr-1"></div>
                            <span>Fully Stocked: {Math.round(category.availability * 0.7)}%</span>
                          </div>
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-amber-500 mr-1"></div>
                            <span>Limited Stock: {Math.round(category.availability * 0.2)}%</span>
                          </div>
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-red-500 mr-1"></div>
                            <span>Out of Stock: {100 - category.availability}%</span>
                          </div>
                          <div className="flex items-center">
                            <div className="h-2 w-2 rounded-full bg-blue-500 mr-1"></div>
                            <span>On Order: {Math.round(category.availability * 0.1)}%</span>
                          </div>
                        </div>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Market Trends</CardTitle>
              <CardDescription>Key trends in the Nigerian pharmaceutical market</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Market trends visualization would appear here</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Pricing Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-red-500" />
                      <span>Antibiotics</span>
                    </div>
                    <span className="text-red-500">+8.2%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-green-500" />
                      <span>Analgesics</span>
                    </div>
                    <span className="text-green-500">-2.5%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-red-500" />
                      <span>Cardiovascular</span>
                    </div>
                    <span className="text-red-500">+5.7%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-red-500" />
                      <span>Antidiabetic</span>
                    </div>
                    <span className="text-red-500">+3.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market News</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-b pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">June 15, 2023</span>
                    </div>
                    <h4 className="text-sm font-medium">NAFDAC Announces New Verification System</h4>
                    <p className="text-xs text-gray-500">
                      NAFDAC has announced a new digital verification system to combat counterfeit medications.
                    </p>
                  </div>
                  <div className="border-b pb-2">
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">June 10, 2023</span>
                    </div>
                    <h4 className="text-sm font-medium">Import Restrictions Affect Antibiotic Supply</h4>
                    <p className="text-xs text-gray-500">
                      Recent import restrictions have led to supply constraints for certain antibiotics.
                    </p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">June 5, 2023</span>
                    </div>
                    <h4 className="text-sm font-medium">Local Manufacturing Capacity Expands</h4>
                    <p className="text-xs text-gray-500">
                      Three new pharmaceutical manufacturing plants have opened in Lagos and Abuja.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="shortages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Shortage Alerts</CardTitle>
              <CardDescription>Critical medication shortages in the Nigerian market</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    name: "Insulin Glargine",
                    severity: "critical",
                    duration: "2 months",
                    locations: ["Lagos", "Abuja", "Kano"],
                  },
                  {
                    name: "Ceftriaxone Injection",
                    severity: "high",
                    duration: "3 weeks",
                    locations: ["Port Harcourt", "Ibadan"],
                  },
                  { name: "Salbutamol Inhaler", severity: "medium", duration: "1 month", locations: ["Lagos", "Kano"] },
                  { name: "Metformin 1000mg", severity: "low", duration: "2 weeks", locations: ["Abuja"] },
                ].map((shortage, i) => (
                  <div key={i} className="border rounded-md overflow-hidden">
                    <div
                      className={`p-3 ${
                        shortage.severity === "critical"
                          ? "bg-red-50 border-b border-red-200"
                          : shortage.severity === "high"
                            ? "bg-amber-50 border-b border-amber-200"
                            : shortage.severity === "medium"
                              ? "bg-yellow-50 border-b border-yellow-200"
                              : "bg-blue-50 border-b border-blue-200"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <h4 className="font-medium">{shortage.name}</h4>
                        <Badge
                          className={
                            shortage.severity === "critical"
                              ? "bg-red-500"
                              : shortage.severity === "high"
                                ? "bg-amber-500"
                                : shortage.severity === "medium"
                                  ? "bg-yellow-500"
                                  : "bg-blue-500"
                          }
                        >
                          {shortage.severity.charAt(0).toUpperCase() + shortage.severity.slice(1)}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-3 bg-white">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">Duration</p>
                          <p className="font-medium">{shortage.duration}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Affected Areas</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {shortage.locations.map((location, j) => (
                              <Badge key={j} variant="outline" className="text-xs flex items-center">
                                <MapPin className="h-2 w-2 mr-1" />
                                {location}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 flex justify-between">
                        <Button variant="outline" size="sm" className="text-xs">
                          View Alternatives
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          <Bell className="h-3 w-3 mr-1" />
                          Get Alerts
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Shortages
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
