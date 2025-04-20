import SupplierDirectory from "@/components/marketplace/supplier-directory"

export default function SuppliersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Supplier Directory</h1>
        <p className="text-gray-600 mt-2">Find and connect with verified pharmaceutical suppliers across Nigeria</p>
      </div>

      <SupplierDirectory />
    </div>
  )
}
