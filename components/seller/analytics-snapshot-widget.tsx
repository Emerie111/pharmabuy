import { BarChart3, DollarSign, ShoppingBag, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AnalyticsSnapshotWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Sales Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 flex items-center justify-center">
          <div className="text-center">
            <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Sales chart visualization would appear here</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <ShoppingBag className="h-4 w-4 text-blue-600" />
              <h4 className="text-sm font-medium">Total Orders</h4>
            </div>
            <p className="text-2xl font-bold">243</p>
            <div className="flex items-center mt-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+15% from last month</span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <h4 className="text-sm font-medium">Average Order Value</h4>
            </div>
            <p className="text-2xl font-bold">₦32,800</p>
            <div className="flex items-center mt-1 text-xs text-green-600">
              <TrendingUp className="h-3 w-3 mr-1" />
              <span>+5% from last month</span>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg border">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-purple-600" />
              <h4 className="text-sm font-medium">Top Category</h4>
            </div>
            <p className="text-lg font-bold">Antibiotics</p>
            <p className="text-sm">₦1.2M in sales</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
