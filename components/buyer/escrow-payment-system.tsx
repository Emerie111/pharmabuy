"use client"

import { useState } from "react"
import {
  CreditCard,
  Building,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Truck,
  DollarSign,
  Star,
  CheckCheck,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import ClientOnly from '../client-only'

interface EscrowPaymentSystemProps {
  cartItems: any[]
  subtotal: number
  deliveryFee: number
  escrowFee: number
  total: number
}

export function EscrowPaymentSystem({
  cartItems,
  subtotal,
  deliveryFee,
  escrowFee,
  total,
}: EscrowPaymentSystemProps) {
  return (
    <ClientOnly>
      <EscrowPaymentSystemContent
        cartItems={cartItems}
        subtotal={subtotal}
        deliveryFee={deliveryFee}
        escrowFee={escrowFee}
        total={total}
      />
    </ClientOnly>
  )
}

function EscrowPaymentSystemContent({
  cartItems,
  subtotal,
  deliveryFee,
  escrowFee,
  total,
}: EscrowPaymentSystemProps) {
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [deliveryUrgency, setDeliveryUrgency] = useState("standard")
  const [orderId] = useState(() => `ORD-${Date.now().toString().slice(-5)}`)
  const [verificationChecklist, setVerificationChecklist] = useState({
    allItems: false,
    matchDescription: false,
    goodCondition: false,
    nafdacVerified: false,
    expiryDates: false,
  })
  const [rating, setRating] = useState(0)

  const urgencyFees = {
    standard: 0,
    express: 1500,
    urgent: 3000,
  }

  const handleNext = () => {
    if (step < 5) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const allChecked = Object.values(verificationChecklist).every((value) => value)

  const handleChecklistChange = (key: keyof typeof verificationChecklist) => {
    setVerificationChecklist({
      ...verificationChecklist,
      [key]: !verificationChecklist[key],
    })
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-16">
        <div className="relative">
          <div className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-gray-200"></div>
          <ol className="relative z-10 flex justify-between">
            {[1, 2, 3, 4, 5].map((i) => (
              <li key={i} className="flex flex-col items-center flex-1">
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                    step === i
                      ? "border-emerald-600 bg-emerald-600 text-white"
                      : step > i
                        ? "border-emerald-600 bg-white text-emerald-600"
                        : "border-gray-300 bg-white text-gray-400"
                  }`}
                >
                  {step > i ? <CheckCircle2 className="h-5 w-5" /> : i}
                </div>
                <span className="mt-4 block w-full text-center text-xs sm:text-sm md:text-base font-medium">
                  {i === 1 && "Delivery Options"}
                  {i === 2 && "Payment Details"}
                  {i === 3 && "Review Order"}
                  {i === 4 && "Verification"}
                  {i === 5 && "Feedback"}
                </span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <Card className="border-gray-200 shadow-sm mt-8 sm:mt-12">
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle>Delivery Options</CardTitle>
              <CardDescription>Choose your preferred delivery timeline</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <RadioGroup defaultValue={deliveryUrgency} onValueChange={setDeliveryUrgency} className="space-y-4">
                  <div className="flex items-start space-x-3 rounded-lg border p-4 sm:p-5">
                    <RadioGroupItem value="standard" id="standard" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="standard" className="text-base font-medium">
                        Standard Delivery
                      </Label>
                      <p className="text-sm text-gray-500">Delivery within 5-7 business days</p>
                      <p className="mt-1 text-sm font-medium text-emerald-600">Free</p>
                    </div>
                    <Truck className="h-6 w-6 text-gray-400" />
                  </div>

                  <div className="flex items-start space-x-3 rounded-lg border p-4 sm:p-5">
                    <RadioGroupItem value="express" id="express" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="express" className="text-base font-medium">
                        Express Delivery
                      </Label>
                      <p className="text-sm text-gray-500">Delivery within 2-3 business days</p>
                      <p className="mt-1 text-sm font-medium text-emerald-600">₦1,500</p>
                    </div>
                    <Truck className="h-6 w-6 text-amber-500" />
                  </div>

                  <div className="flex items-start space-x-3 rounded-lg border p-4 sm:p-5">
                    <RadioGroupItem value="urgent" id="urgent" className="mt-1" />
                    <div className="flex-1">
                      <Label htmlFor="urgent" className="text-base font-medium">
                        Urgent Delivery
                      </Label>
                      <p className="text-sm text-gray-500">Delivery within 24 hours</p>
                      <p className="mt-1 text-sm font-medium text-emerald-600">₦3,000</p>
                    </div>
                    <Truck className="h-6 w-6 text-red-500" />
                  </div>
                </RadioGroup>

                <div className="rounded-lg border p-4">
                  <Label htmlFor="delivery-notes" className="text-base font-medium">
                    Delivery Notes
                  </Label>
                  <Textarea
                    id="delivery-notes"
                    placeholder="Add any specific delivery instructions or timing requirements..."
                    className="mt-2"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" disabled>
                Back
              </Button>
              <Button onClick={handleNext}>
                Continue to Payment <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        )}

        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle>Payment Details</CardTitle>
              <CardDescription>Choose your payment method</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={paymentMethod} onValueChange={setPaymentMethod} className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="card">Credit Card</TabsTrigger>
                  <TabsTrigger value="bank">Bank Transfer</TabsTrigger>
                  <TabsTrigger value="wallet">Wallet</TabsTrigger>
                </TabsList>
                <TabsContent value="card" className="space-y-5 pt-5">
                  <div className="grid gap-5">
                    <div className="grid gap-2">
                      <Label htmlFor="card-number">Card Number</Label>
                      <Input id="card-number" placeholder="1234 5678 9012 3456" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="expiry">Expiry Date</Label>
                        <Input id="expiry" placeholder="MM/YY" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="cvc">CVC</Label>
                        <Input id="cvc" placeholder="123" />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name on Card</Label>
                      <Input id="name" placeholder="John Smith" />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="bank" className="space-y-4 pt-4">
                  <div className="rounded-lg border p-4">
                    <div className="mb-4 flex items-center">
                      <Building className="mr-2 h-5 w-5 text-gray-500" />
                      <h3 className="font-medium">Bank Transfer Details</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="font-medium">Bank Name:</span> First Bank of Nigeria
                      </p>
                      <p>
                        <span className="font-medium">Account Name:</span> PharmaBuy Escrow
                      </p>
                      <p>
                        <span className="font-medium">Account Number:</span> 1234567890
                      </p>
                      <p>
                        <span className="font-medium">Reference:</span> {orderId}
                      </p>
                    </div>
                    <div className="mt-4 rounded-md bg-amber-50 p-3 text-sm text-amber-800">
                      <div className="flex">
                        <AlertCircle className="mr-2 h-5 w-5" />
                        <div>
                          <p className="font-medium">Important</p>
                          <p>
                            Please use the reference number when making your transfer. Funds will be held in escrow
                            until you approve the delivery.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="wallet" className="space-y-4 pt-4">
                  <div className="rounded-lg border p-4">
                    <div className="mb-4 flex items-center">
                      <DollarSign className="mr-2 h-5 w-5 text-gray-500" />
                      <h3 className="font-medium">Wallet Balance: ₦2,400,000</h3>
                    </div>
                    <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">
                      <div className="flex">
                        <CheckCircle2 className="mr-2 h-5 w-5" />
                        <div>
                          <p className="font-medium">Sufficient Balance</p>
                          <p>You have enough funds in your wallet to complete this purchase.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 rounded-lg bg-gray-50 p-4">
                <div className="mb-2 flex items-center">
                  <ShieldCheck className="mr-2 h-5 w-5 text-emerald-600" />
                  <h3 className="font-medium">Escrow Protection</h3>
                </div>
                <p className="text-sm text-gray-600">
                  Your payment will be held securely in escrow until you confirm receipt and approve the products. This
                  ensures you only pay for products that meet your expectations.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext}>
                Review Order <ChevronRight className="ml-1 h-4 w-4" />
              </Button>
            </CardFooter>
          </>
        )}

        {step === 3 && (
          <>
            <CardHeader>
              <CardTitle>Review Your Order</CardTitle>
              <CardDescription>Please confirm your order details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-2 font-medium">Order Summary</h3>
                <div className="rounded-lg border">
                  <div className="border-b p-4">
                    <div className="flex justify-between">
                      <div>
                        <p className="font-medium">{cartItems[0].name}</p>
                        <p className="text-sm text-gray-500">Quantity: {cartItems.length}</p>
                      </div>
                      <p className="font-medium">₦{subtotal.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between text-sm">
                      <p>Subtotal</p>
                      <p>₦{subtotal.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p>Delivery Fee ({deliveryUrgency})</p>
                      <p>₦{deliveryFee.toLocaleString()}</p>
                    </div>
                    <div className="flex justify-between text-sm">
                      <p>Escrow Fee (1%)</p>
                      <p>₦{escrowFee.toLocaleString()}</p>
                    </div>
                    <div className="mt-2 flex justify-between font-medium">
                      <p>Total</p>
                      <p>₦{total.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Delivery Information</h3>
                <div className="rounded-lg border p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Delivery Method</p>
                      <p className="font-medium capitalize">{deliveryUrgency} Delivery</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estimated Delivery</p>
                      <p className="font-medium">
                        {deliveryUrgency === "standard" && "May 10 - May 12, 2023"}
                        {deliveryUrgency === "express" && "May 7 - May 8, 2023"}
                        {deliveryUrgency === "urgent" && "May 6, 2023"}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-500">Delivery Address</p>
                    <p className="font-medium">Pharma Solutions Ltd</p>
                    <p className="text-sm">123 Awolowo Road, Ikoyi, Lagos, Nigeria</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Seller Information</h3>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center">
                    <ShieldCheck className="mr-2 h-5 w-5 text-emerald-600" />
                    <div>
                      <p className="font-medium">{cartItems[0].sellerName}</p>
                      <p className="text-xs text-gray-500">NAFDAC Verified Seller</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Payment Method</h3>
                <div className="rounded-lg border p-4">
                  <div className="flex items-center">
                    {paymentMethod === "card" && <CreditCard className="mr-2 h-5 w-5 text-gray-500" />}
                    {paymentMethod === "bank" && <Building className="mr-2 h-5 w-5 text-gray-500" />}
                    {paymentMethod === "wallet" && <DollarSign className="mr-2 h-5 w-5 text-gray-500" />}
                    <p className="font-medium capitalize">
                      {paymentMethod === "card"
                        ? "Credit Card"
                        : paymentMethod === "bank"
                          ? "Bank Transfer"
                          : "Wallet"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-emerald-50 p-4">
                <div className="flex">
                  <ShieldCheck className="mr-2 h-5 w-5 text-emerald-600" />
                  <div>
                    <p className="font-medium">Escrow Payment Protection</p>
                    <p className="text-sm text-emerald-700">
                      Your payment will be held in escrow until you verify and approve the delivery. You'll have 48
                      hours after delivery to inspect the products before the payment is released to the seller.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext}>Confirm & Pay</Button>
            </CardFooter>
          </>
        )}

        {step === 4 && (
          <>
            <CardHeader>
              <CardTitle>Product Verification</CardTitle>
              <CardDescription>Verify your delivery before releasing payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-700">
                  Your payment is being held in escrow. Please verify that all products have been delivered correctly
                  before approving the release of funds.
                </AlertDescription>
              </Alert>

              <div>
                <h3 className="mb-2 font-medium">Order Information</h3>
                <div className="rounded-lg border p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-medium">{orderId}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p className="font-medium">May 5, 2023</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Delivery Date</p>
                      <p className="font-medium">May 7, 2023</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Escrow Status</p>
                      <Badge className="bg-blue-500">Awaiting Approval</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Verification Checklist</h3>
                <div className="space-y-3 rounded-lg border p-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="all-items"
                      checked={verificationChecklist.allItems}
                      onCheckedChange={() => handleChecklistChange("allItems")}
                    />
                    <Label htmlFor="all-items">All items were delivered as ordered</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="match-description"
                      checked={verificationChecklist.matchDescription}
                      onCheckedChange={() => handleChecklistChange("matchDescription")}
                    />
                    <Label htmlFor="match-description">Products match the descriptions</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="good-condition"
                      checked={verificationChecklist.goodCondition}
                      onCheckedChange={() => handleChecklistChange("goodCondition")}
                    />
                    <Label htmlFor="good-condition">Products are in good condition</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="nafdac-verified"
                      checked={verificationChecklist.nafdacVerified}
                      onCheckedChange={() => handleChecklistChange("nafdacVerified")}
                    />
                    <Label htmlFor="nafdac-verified">NAFDAC numbers are verified</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="expiry-dates"
                      checked={verificationChecklist.expiryDates}
                      onCheckedChange={() => handleChecklistChange("expiryDates")}
                    />
                    <Label htmlFor="expiry-dates">Expiration dates are acceptable</Label>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="verification-notes" className="mb-2 block font-medium">
                  Additional Notes (Optional)
                </Label>
                <Textarea
                  id="verification-notes"
                  placeholder="Add any comments about the delivery or products..."
                  className="min-h-[100px]"
                />
              </div>

              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Important</AlertTitle>
                <AlertDescription>
                  By approving this order, you confirm that all products have been received as described and you
                  authorize the release of funds from escrow to the seller.
                </AlertDescription>
              </Alert>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <div className="flex gap-2">
                <Button variant="outline">Report Issue</Button>
                <Button onClick={handleNext} disabled={!allChecked}>
                  Approve & Release Payment
                </Button>
              </div>
            </CardFooter>
          </>
        )}

        {step === 5 && (
          <>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100">
                <CheckCheck className="h-6 w-6 text-emerald-600" />
              </div>
              <CardTitle>Payment Released!</CardTitle>
              <CardDescription>Thank you for verifying your order</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert className="bg-emerald-50 border-emerald-200">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <AlertDescription className="text-emerald-700">
                  Your payment has been released from escrow to the seller. The transaction is now complete.
                </AlertDescription>
              </Alert>

              <div>
                <h3 className="mb-2 font-medium">Rate Your Experience</h3>
                <div className="flex justify-center space-x-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Button
                      key={star}
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 rounded-full"
                      onClick={() => setRating(star)}
                    >
                      <Star
                        className={`h-5 w-5 ${star <= rating ? "text-amber-400 fill-amber-400" : "text-gray-400"}`}
                      />
                    </Button>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feedback">Share Your Feedback</Label>
                  <Textarea
                    id="feedback"
                    placeholder="Tell us about your experience with this seller and the products..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-medium">Transaction Summary</h3>
                <div className="rounded-lg border p-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">Order ID</p>
                      <p className="font-medium">{orderId}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">Seller</p>
                      <p className="font-medium">{cartItems[0].sellerName}</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">Order Date</p>
                      <p className="font-medium">May 5, 2023</p>
                    </div>
                    <div className="flex justify-between">
                      <p className="text-sm text-gray-500">Completion Date</p>
                      <p className="font-medium">May 7, 2023</p>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <p>Total Amount</p>
                      <p>₦{total.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center">
                <div className="rounded-lg bg-gray-50 p-4 text-center">
                  <FileText className="mx-auto mb-2 h-6 w-6 text-gray-500" />
                  <p className="font-medium">Transaction Receipt</p>
                  <p className="text-sm text-gray-500">A receipt has been sent to your email</p>
                  <Button variant="link" size="sm" className="mt-2">
                    Download Receipt
                  </Button>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">View Order History</Button>
              <Button>Continue Shopping</Button>
            </CardFooter>
          </>
        )}
      </Card>
    </div>
  )
}
