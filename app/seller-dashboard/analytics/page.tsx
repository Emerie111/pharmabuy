import SellerDashboardLayout from "@/components/layouts/seller-dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AnalyticsPage() {
  return (
    <SellerDashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Business Analytics</h1>
        <Card>
          <CardHeader>
            <CardTitle>Analytics Dashboard</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Analytics dashboard would be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </SellerDashboardLayout>
  )
}
