import { Suspense } from "react"
import DashboardLayout from "@/components/dashboard-layout"
import QuickStats from "@/components/dashboard/quick-stats"
import SearchDiscovery from "@/components/dashboard/search-discovery"
import BulkOrderModule from "@/components/dashboard/bulk-order-module"
import VerificationCenter from "@/components/dashboard/verification-center"
import SupplierTrustHub from "@/components/dashboard/supplier-trust-hub"
import BuyerAnalytics from "@/components/dashboard/buyer-analytics"
import MarketIntelligence from "@/components/dashboard/market-intelligence"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

export default function Dashboard() {
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

        <Suspense fallback={<QuickStatsSkeleton />}>
          <QuickStats />
        </Suspense>

        <Tabs defaultValue="search" className="space-y-4">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 h-auto">
            <TabsTrigger value="search" className="text-xs md:text-sm">
              Search & Discovery
            </TabsTrigger>
            <TabsTrigger value="bulk" className="text-xs md:text-sm">
              Bulk Order
            </TabsTrigger>
            <TabsTrigger value="verification" className="text-xs md:text-sm">
              NAFDAC Verification
            </TabsTrigger>
            <TabsTrigger value="suppliers" className="text-xs md:text-sm">
              Supplier Trust
            </TabsTrigger>
            <TabsTrigger value="cart" className="text-xs md:text-sm">
              Cart & Checkout
            </TabsTrigger>
            <TabsTrigger value="analytics" className="text-xs md:text-sm">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="market" className="text-xs md:text-sm">
              Market Intelligence
            </TabsTrigger>
          </TabsList>

          <TabsContent value="search" className="space-y-4">
            <Suspense
              fallback={
                <div className="h-96 flex items-center justify-center">
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              }
            >
              <SearchDiscovery />
            </Suspense>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-4">
            <Suspense
              fallback={
                <div className="h-96 flex items-center justify-center">
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              }
            >
              <BulkOrderModule />
            </Suspense>
          </TabsContent>

          <TabsContent value="verification" className="space-y-4">
            <Suspense
              fallback={
                <div className="h-96 flex items-center justify-center">
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              }
            >
              <VerificationCenter />
            </Suspense>
          </TabsContent>

          <TabsContent value="suppliers" className="space-y-4">
            <Suspense
              fallback={
                <div className="h-96 flex items-center justify-center">
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              }
            >
              <SupplierTrustHub />
            </Suspense>
          </TabsContent>

          <TabsContent value="cart" className="space-y-4">
            <Suspense
              fallback={
                <div className="h-96 flex items-center justify-center">
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              }
            >
              <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">Cart & Checkout Module</p>
              </div>
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
              <BuyerAnalytics />
            </Suspense>
          </TabsContent>

          <TabsContent value="market" className="space-y-4">
            <Suspense
              fallback={
                <div className="h-96 flex items-center justify-center">
                  <Skeleton className="h-12 w-12 rounded-full" />
                </div>
              }
            >
              <MarketIntelligence />
            </Suspense>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
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
