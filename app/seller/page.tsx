import { Suspense } from "react"
import SellerDashboardLayout from "@/components/seller-dashboard-layout"
import SellerQuickStats from "@/components/seller/quick-stats"
import InventoryManagement from "@/components/seller/inventory-management"
import OrderManagement from "@/components/seller/order-management"
import BusinessAnalytics from "@/components/seller/business-analytics"
import MarketplacePresence from "@/components/seller/marketplace-presence"
import FinancialCenter from "@/components/seller/financial-center"
import ComplianceHub from "@/components/seller/compliance-hub"
import CommunicationCenter from "@/components/seller/communication-center"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

export default function SellerDashboard() {
  return (
    <SellerDashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Seller Dashboard</h1>

        <Suspense fallback={<QuickStatsSkeleton />}>
          <SellerQuickStats />
        </Suspense>

        <Tabs defaultValue="inventory" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 h-auto">
            <TabsTrigger value="inventory" className="text-xs md:text-sm">
              Inventory
            </TabsTrigger>
            <TabsTrigger value="orders" className="text-xs md:text-sm">
              Orders
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs md:text-sm">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="marketplace" className="text-xs md:text-sm">
              Marketplace
            </TabsTrigger>
            <TabsTrigger value="finances" className="text-xs md:text-sm">
              Finances
            </TabsTrigger>
            <TabsTrigger value="compliance" className="text-xs md:text-sm">
              Compliance
            </TabsTrigger>
            <TabsTrigger value="communication" className="text-xs md:text-sm">
              Communication
            </TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-4">
            <Suspense
              fallback={
                <div className="h-96 flex items-center justify-center">
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              }
            >
              <InventoryManagement />
            </Suspense>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Suspense
              fallback={
                <div className="h-96 flex items-center justify-center">
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              }
            >
              <OrderManagement />
            </Suspense>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Suspense
              fallback={
                <div className="h-96 flex items-center justify-center">
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              }
            >
              <BusinessAnalytics />
            </Suspense>
          </TabsContent>

          <TabsContent value="marketplace" className="space-y-4">
            <Suspense
              fallback={
                <div className="h-96 flex items-center justify-center">
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              }
            >
              <MarketplacePresence />
            </Suspense>
          </TabsContent>

          <TabsContent value="finances" className="space-y-4">
            <Suspense
              fallback={
                <div className="h-96 flex items-center justify-center">
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              }
            >
              <FinancialCenter />
            </Suspense>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-4">
            <Suspense
              fallback={
                <div className="h-96 flex items-center justify-center">
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              }
            >
              <ComplianceHub />
            </Suspense>
          </TabsContent>

          <TabsContent value="communication" className="space-y-4">
            <Suspense
              fallback={
                <div className="h-96 flex items-center justify-center">
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              }
            >
              <CommunicationCenter />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </SellerDashboardLayout>
  )
}

function QuickStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-lg border">
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-8 w-16" />
        </div>
      ))}
    </div>
  )
}
