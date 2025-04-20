import SellerDashboardLayout from "@/components/layouts/seller-dashboard-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MarketplacePage() {
  return (
    <SellerDashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Marketplace Presence</h1>
        <Card>
          <CardHeader>
            <CardTitle>Marketplace Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-500">Marketplace presence settings would be implemented here</p>
          </CardContent>
        </Card>
      </div>
    </SellerDashboardLayout>
  )
}
