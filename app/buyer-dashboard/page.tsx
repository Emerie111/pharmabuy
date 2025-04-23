import BuyerDashboardLayout from "@/components/layouts/buyer-dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ShieldCheck, Truck, Calendar, Clock, TrendingUp, Search, Package } from "lucide-react"
import Link from "next/link"

export default function BuyerDashboardPage() {
  return (
    <BuyerDashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Buyer Dashboard</h1>
        <p className="text-gray-500">Welcome back, ABC Pharmacy</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Verified Products</CardTitle>
              <ShieldCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,245</div>
              <div className="flex items-center mt-1">
                <p className="text-xs text-green-600 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  <span>+12% from last month</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Pending Orders</CardTitle>
              <Clock className="h-4 w-4 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-gray-500 mt-1">
                <span>Last updated: 2 hours ago</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Available Credit</CardTitle>
              <TrendingUp className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₦2.4M</div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: "65%" }}></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                <span>65% of total limit</span>
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">Verified Suppliers</CardTitle>
              <ShieldCheck className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-green-600 flex items-center mt-1">
                <span>+3 new this month</span>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent Purchases</CardTitle>
                <CardDescription>Track your recent orders and their status</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2, 3].map((order) => (
                  <div key={order} className="flex items-center justify-between border-b pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                        <Package className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-medium">Order #{1000 + order}</h4>
                        <p className="text-xs text-gray-500">5 products • ₦{(50000 * order).toLocaleString()}</p>
                        <div className="flex items-center mt-1">
                          <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500 mr-3">June {10 + order}, 2023</span>
                          <Clock className="h-3 w-3 text-gray-400 mr-1" />
                          <span className="text-xs text-gray-500">10:30 AM</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge className={order === 1 ? "bg-blue-500" : order === 2 ? "bg-purple-500" : "bg-green-500"}>
                        {order === 1 ? "Processing" : order === 2 ? "Shipped" : "Delivered"}
                      </Badge>
                      <Button variant="ghost" size="sm" className="mt-1">
                        View Details
                      </Button>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full">
                  View All Orders
                </Button>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Deliveries</CardTitle>
                <CardDescription>Track your shipments</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[1, 2].map((delivery) => (
                  <div key={delivery} className="flex flex-col border-b pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-blue-600" />
                        <h4 className="font-medium">Order #{1002 + delivery}</h4>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          delivery === 1
                            ? "border-red-200 bg-red-50 text-red-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                        }
                      >
                        {delivery === 1 ? "Urgent" : "Express"}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">From: PharmaCare Ltd</p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                        <span className="text-xs text-gray-500">
                          Expected: June {delivery === 1 ? "17" : "18"}, 2023
                        </span>
                      </div>
                      <Button variant="link" size="sm" className="h-5 p-0">
                        Track
                      </Button>
                    </div>
                    <Progress className="mt-2" value={delivery === 1 ? 75 : 40} />
                  </div>
                ))}

                <Button variant="outline" className="w-full">
                  View All Deliveries
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button variant="outline" className="mr-2">
            <Truck className="mr-2 h-4 w-4" />
            Track Shipment
          </Button>
          <Link href="/marketplace">
            <Button>
              <Search className="mr-2 h-4 w-4" />
              Browse Products
            </Button>
          </Link>
        </div>
      </div>
    </BuyerDashboardLayout>
  )
}
