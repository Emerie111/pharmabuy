import SellerDashboardLayout from "@/components/layouts/seller-dashboard-layout"
import InventoryManagement from "@/components/seller/inventory-management"

export default function InventoryPage() {
  return (
    <SellerDashboardLayout>
      <div className="p-6">
        <InventoryManagement />
      </div>
    </SellerDashboardLayout>
  )
}
