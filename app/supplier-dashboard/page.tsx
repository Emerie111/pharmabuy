"use client"

import { Button } from "@/components/ui/button"
import SellerDashboardLayout from "@/components/layouts/seller-dashboard-layout"
import SellerQuickStats from "@/components/seller/seller-quick-stats"
import RecentOrdersWidget from "@/components/seller/recent-orders-widget"
import InventorySummaryWidget from "@/components/seller/inventory-summary-widget"
import AnalyticsSnapshotWidget from "@/components/seller/analytics-snapshot-widget"

export default function SupplierDashboardPage() {
  return (
    <SellerDashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Supplier Dashboard</h1>
        <p className="text-gray-500">Welcome back, XYZ Pharmaceuticals</p>

        <SellerQuickStats />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <RecentOrdersWidget />
          <InventorySummaryWidget />
        </div>

        <AnalyticsSnapshotWidget />

        <div className="flex justify-end">
          <Button variant="outline">View All Reports</Button>
        </div>
      </div>
    </SellerDashboardLayout>
  )
} 