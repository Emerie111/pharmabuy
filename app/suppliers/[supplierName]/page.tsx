import { notFound } from "next/navigation"
import SupplierProfile from "@/components/suppliers/supplier-profile"
import { getSupplierByName } from "@/components/marketplace/product-data"

export default function SupplierProfilePage({ params }: { params: { supplierName: string } }) {
  const supplier = getSupplierByName(decodeURIComponent(params.supplierName))

  if (!supplier) {
    notFound()
  }

  return <SupplierProfile supplier={supplier} />
}
