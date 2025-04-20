import { Calendar, Clock, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function RecentOrdersWidget() {
  const recentOrders = [
    {
      id: "ORD-2001",
      customer: "Lagos General Hospital",
      date: new Date(),
      amount: 125000,
      status: "new",
      urgency: "urgent",
    },
    {
      id: "ORD-2002",
      customer: "MediPlus Pharmacy",
      date: new Date(),
      amount: 87500,
      status: "processing",
      urgency: "express",
    },
    {
      id: "ORD-2003",
      customer: "Sunshine Pharmacy",
      date: new Date(),
      amount: 45000,
      status: "shipped",
      urgency: "standard",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Orders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {recentOrders.map((order) => (
          <div key={order.id} className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-blue-100 flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium">{order.id}</h4>
                <p className="text-xs text-gray-500">{order.customer}</p>
                <div className="flex items-center mt-1">
                  <Calendar className="h-3 w-3 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500 mr-3">{order.date.toLocaleDateString()}</span>
                  <Clock className="h-3 w-3 text-gray-400 mr-1" />
                  <span className="text-xs text-gray-500">{order.date.toLocaleTimeString()}</span>
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">₦{order.amount.toLocaleString()}</div>
              <div className="flex items-center justify-end mt-1 gap-2">
                <Badge
                  className={
                    order.status === "new"
                      ? "bg-blue-500"
                      : order.status === "processing"
                        ? "bg-amber-500"
                        : "bg-purple-500"
                  }
                >
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </Badge>
                <Badge
                  variant="outline"
                  className={
                    order.urgency === "urgent"
                      ? "border-red-200 bg-red-50 text-red-700"
                      : order.urgency === "express"
                        ? "border-amber-200 bg-amber-50 text-amber-700"
                        : "border-green-200 bg-green-50 text-green-700"
                  }
                >
                  {order.urgency.charAt(0).toUpperCase() + order.urgency.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <Button variant="outline" size="sm">
            View All Orders
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
