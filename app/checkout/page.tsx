"use client"

import { EscrowPaymentSystem } from "@/components/buyer/escrow-payment-system"
import Link from "next/link"
import { ShoppingCart, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/components/marketplace/cartStore"

export default function CheckoutPage() {
  const { cartItems } = useCartStore()
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 2000
  const escrowFee = Math.round(subtotal * 0.01)
  const total = subtotal + deliveryFee + escrowFee

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Link href="/cart">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="flex items-center">
                <ShoppingCart className="h-4 w-4 mr-1" />
                Return to Cart
              </span>
            </Button>
          </Link>
        </div>
        
        <h1 className="text-3xl font-bold">Secure Checkout</h1>
        <p className="text-gray-500 mt-2">Complete your purchase with our secure escrow payment system</p>
      </div>

      <EscrowPaymentSystem
        cartItems={cartItems}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        escrowFee={escrowFee}
        total={total}
      />
    </div>
  )
} 