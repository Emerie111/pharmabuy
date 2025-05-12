"use client"

import React from "react"
import { useState } from "react"
import { Trash2, Plus, Minus, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useCartStore } from "./cartStore"
import { useRouter } from "next/navigation"

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  unit: string
  supplier: string
  verified: boolean
  image: string
  brandId: string
  genericId: string
}

export default function Cart() {
  const { cartItems, setCartItems, updateQuantity, removeItem, clearCart } = useCartStore()
  const router = useRouter()

  // For demo: if cart is empty, initialize with sample data
  React.useEffect(() => {
    if (cartItems.length === 0) {
      setCartItems([
        {
          id: "p1",
          name: "Amoxicillin 500mg",
          price: 2500,
          quantity: 5,
          unit: "pack of 10",
          supplier: "PharmaCare Ltd",
          verified: true,
          image: "/placeholder.svg?height=80&width=80&text=Amoxicillin",
          brandId: "amoxicillin-brandA",
          genericId: "amoxicillin",
        },
        {
          id: "p2",
          name: "Paracetamol 500mg",
          price: 800,
          quantity: 10,
          unit: "pack of 20",
          supplier: "MediPlus Nigeria",
          verified: true,
          image: "/placeholder.svg?height=80&width=80&text=Paracetamol",
          brandId: "paracetamol-brandB",
          genericId: "paracetamol",
        },
        {
          id: "p4",
          name: "Lisinopril 10mg",
          price: 1800,
          quantity: 2,
          unit: "pack of 15",
          supplier: "CardioHealth Inc",
          verified: true,
          image: "/placeholder.svg?height=80&width=80&text=Lisinopril",
          brandId: "lisinopril-brandC",
          genericId: "lisinopril",
        },
      ])
    }
  }, [cartItems, setCartItems])

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const deliveryFee = 2000
  const escrowFee = Math.round(subtotal * 0.01) // 1% escrow fee
  const total = subtotal + deliveryFee + escrowFee

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Shopping Cart</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {cartItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Your cart is empty</p>
                <Button variant="link" className="mt-2" onClick={() => router.push("/product-marketplace")}>Continue Shopping</Button>
              </div>
            ) : (
              <>
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 py-4 border-b">
                    <div className="h-16 w-16 rounded-md bg-gray-100 flex items-center justify-center overflow-hidden">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="font-medium">₦{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                      <p className="text-sm text-gray-500">{item.unit}</p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item.id, Number.parseInt(e.target.value) || 1)}
                            className="h-7 w-12 mx-1 text-center p-0"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-500">₦{item.price.toLocaleString()} each</p>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {item.verified && (
                        <div className="flex items-center mt-1">
                          <ShieldCheck className="h-3 w-3 text-green-600 mr-1" />
                          <span className="text-xs text-green-600">NAFDAC Verified</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={() => router.push("/product-marketplace")}>Continue Shopping</Button>
            <Button variant="ghost" className="text-red-500" onClick={clearCart}>
              Clear Cart
            </Button>
          </CardFooter>
        </Card>
      </div>

      <div>
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>₦{deliveryFee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Escrow Fee (1%)</span>
                <span>₦{escrowFee.toLocaleString()}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>₦{total.toLocaleString()}</span>
              </div>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <ShieldCheck className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                Your payment will be held in escrow until you verify and approve the products.
              </AlertDescription>
            </Alert>

            <Button className="w-full" onClick={() => router.push("/checkout")}>Proceed to Checkout</Button>
          </CardContent>
        </Card>

        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Have questions about your order or the escrow process?</p>
              <Button variant="outline" className="w-full">
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
