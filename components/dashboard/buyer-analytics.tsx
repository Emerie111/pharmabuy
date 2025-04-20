"use client"

import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  CreditCard,
  DollarSign,
  Download,
  Package,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function BuyerAnalytics() {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">Buyer Analytics</h2>
          <p className="text-sm text-gray-500">Track your purchasing patterns and verification metrics</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="30days">
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7days">Last 7 days</SelectItem>
              <SelectItem value="30days">Last 30 days</SelectItem>
              <SelectItem value="90days">Last 90 days</SelectItem>
              <SelectItem value="year">This year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Spent</CardTitle>
            <DollarSign className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₦1,245,600</div>
            <div className="flex items-center mt-1 text-xs">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                12% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Orders Placed</CardTitle>
            <ShoppingBag className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <div className="flex items-center mt-1 text-xs">
              <span className="text-red-600 flex items-center">
                <ArrowDownRight className="h-3 w-3 mr-1" />
                3% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Verification Rate</CardTitle>
            <ShieldCheck className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94%</div>
            <div className="flex items-center mt-1 text-xs">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                5% from last period
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Credit Score</CardTitle>
            <CreditCard className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">720</div>
            <div className="flex items-center mt-1 text-xs">
              <span className="text-green-600 flex items-center">
                <ArrowUpRight className="h-3 w-3 mr-1" />
                10 points from last period
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="space-y-4">
        <TabsList>
          <TabsTrigger value="orders">Order History</TabsTrigger>
          <TabsTrigger value="spending">Spending Trends</TabsTrigger>
          <TabsTrigger value="reorder">Quick Reorder</TabsTrigger>
          <TabsTrigger value="payments">Payment Status</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>View and track your recent orders</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verification</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...Array(5)].map((_, i) => (
                    <TableRow key={i}>
                      <TableCell className="font-medium">ORD-{2000 + i}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                          <span>Jun {10 + i}, 2023</span>
                        </div>
                      </TableCell>
                      <TableCell>₦{(25000 * (5 - i)).toLocaleString()}</TableCell>
                      <TableCell>
                        <Badge className={i === 0 ? "bg-amber-500" : i === 1 ? "bg-blue-500" : "bg-green-500"}>
                          {i === 0 ? "Processing" : i === 1 ? "Shipped" : "Delivered"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200 flex items-center w-fit"
                        >
                          <ShieldCheck className="h-3 w-3 mr-1" />
                          {i === 2 ? "98%" : "100%"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Orders
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="spending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Spending Trends</CardTitle>
              <CardDescription>Track your spending patterns over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80 flex items-center justify-center">
              <div className="text-center">
                <DollarSign className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Spending chart visualization would appear here</p>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Top Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Antibiotics", "Analgesics", "Cardiovascular", "Vitamins"].map((category, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                        <span>{category}</span>
                      </div>
                      <span className="font-medium">₦{(50000 * (4 - i)).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Suppliers</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["PharmaCare Ltd", "MediPlus Nigeria", "HealthBridge", "Global Pharma"].map((supplier, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                        <span>{supplier}</span>
                      </div>
                      <span className="font-medium">₦{(75000 * (4 - i)).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="reorder" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Purchased Items</CardTitle>
              <CardDescription>Quickly reorder items you purchase regularly</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                        <Package className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Product Name {i + 1}</h4>
                        <p className="text-xs text-gray-500">Last ordered: {i * 5 + 3} days ago</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        <ShieldCheck className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                      <Button size="sm">
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Reorder
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                View All Frequent Items
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="payments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payment Status</CardTitle>
              <CardDescription>Track your payment status and credit availability</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium">Available Credit</h4>
                    <span className="text-sm font-medium">₦2,500,000 / ₦4,000,000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: "62.5%" }}></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">62.5% of credit limit used</p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-medium">Upcoming Payments</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Invoice ID</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...Array(3)].map((_, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">INV-{3000 + i}</TableCell>
                          <TableCell>₦{(150000 * (3 - i)).toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                              <span>Jul {5 + i * 7}, 2023</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={i === 0 ? "bg-red-500" : i === 1 ? "bg-amber-500" : "bg-blue-500"}>
                              {i === 0 ? "Overdue" : i === 1 ? "Due Soon" : "Scheduled"}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div>
                  <h4 className="text-sm font-medium mb-2">Payment Methods</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
                        <div>
                          <p className="text-sm font-medium">Bank Transfer (Primary)</p>
                          <p className="text-xs text-gray-500">First Bank of Nigeria</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-md">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 mr-2 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium">Credit Terms</p>
                          <p className="text-xs text-gray-500">Net 30</p>
                        </div>
                      </div>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
