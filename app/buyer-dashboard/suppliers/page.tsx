import SupplierDirectory from "@/components/marketplace/supplier-directory"

export default function VerifiedSuppliersPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Verified Suppliers</h1>
          <p className="text-gray-500">Connect with trusted pharmaceutical suppliers</p>
        </div>
      </div>

      <SupplierDirectory />
    </div>
  )
}
