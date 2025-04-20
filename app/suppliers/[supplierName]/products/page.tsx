import { notFound } from "next/navigation"
import SupplierProducts from "@/components/suppliers/supplier-products"
import { getSupplierByName, getProductsBySupplier } from "@/components/marketplace/product-data"

export default function SupplierProductsPage({ params }: { params: { supplierName: string } }) {
  const supplierName = decodeURIComponent(params.supplierName)
  const supplier = getSupplierByName(supplierName)

  if (!supplier) {
    notFound()
  }

  const products = getProductsBySupplier(supplierName)

  return <SupplierProducts supplier={supplier} products={products} />
}
