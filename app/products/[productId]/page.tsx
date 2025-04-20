import { notFound } from "next/navigation"
import ProductDetail from "@/components/marketplace/product-detail"
import { getProductById } from "@/components/marketplace/product-data"

export default function ProductDetailPage({ params }: { params: { productId: string } }) {
  const product = getProductById(params.productId)

  if (!product) {
    notFound()
  }

  return <ProductDetail product={product} />
}
