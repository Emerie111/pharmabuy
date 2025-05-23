"use client"; // Ensure it's a client component if using hooks like useState

import { useState } from "react"; // Import useState
import SellerDashboardLayout from "@/components/layouts/seller-dashboard-layout"
import InventoryManagement from "@/components/seller/inventory-management"
import AddProductToInventoryModal from "@/components/supplier/AddProductToInventoryModal" // Import the modal

export default function InventoryPage() {
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);

  const openModal = () => setIsAddProductModalOpen(true);

  return (
    <SellerDashboardLayout>
      <div className="p-6">
        <InventoryManagement openAddProductModal={openModal} />
      </div>
      <AddProductToInventoryModal
        isOpen={isAddProductModalOpen}
        onOpenChange={setIsAddProductModalOpen}
      />
    </SellerDashboardLayout>
  )
}
