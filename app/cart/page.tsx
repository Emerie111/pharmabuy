import Cart from "@/components/marketplace/cart"

export default function CartPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Your Cart</h1>
        <p className="text-gray-600 mt-2">Review your items before proceeding to checkout</p>
      </div>

      <Cart />
    </div>
  )
}
