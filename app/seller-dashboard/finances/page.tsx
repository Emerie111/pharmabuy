import SellerDashboardLayout from "@/components/layouts/seller-dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function FinancesPage() {
  return (
    <SellerDashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Financial Center</h1>
        <Card>
          <CardHeader>
            <CardTitle>Financial Management</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Financial management functionality would be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </SellerDashboardLayout>
  )
}
