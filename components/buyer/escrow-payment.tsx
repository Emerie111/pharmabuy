"use client"

import { useState } from "react"
import { CheckCircle, Clock, CreditCard, Info, Lock, ShieldCheck, Star, Truck, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"

export default function EscrowPayment() {
  const [currentStep, setCurrentStep] = useState<"payment" | "confirmation" | "receipt" | "verification" | "feedback">(
    "payment",
  )
  const [selectedUrgency, setSelectedUrgency] = useState<"standard" | "express" | "urgent">("standard")

  const handleContinue = () => {
    if (currentStep === "payment") setCurrentStep("confirmation")
    else if (currentStep === "confirmation") setCurrentStep("receipt")
    else if (currentStep === "receipt") setCurrentStep("verification")
    else if (currentStep === "verification") setCurrentStep("feedback")
  }

  const handleBack = () => {
    if (currentStep === "confirmation") setCurrentStep("payment")
    else if (currentStep === "receipt") setCurrentStep("confirmation")
    else if (currentStep === "verification") setCurrentStep("receipt")
    else if (currentStep === "feedback") setCurrentStep("verification")
  }

  const getStepProgress = () => {
    switch (currentStep) {
      case "payment":
        return 20
      case "confirmation":
        return 40
      case "receipt":
        return 60
      case "verification":
        return 80
      case "feedback":
        return 100
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Secure Escrow Payment</h2>
          <Badge className="bg-green-500">Protected Purchase</Badge>
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Your payment is held securely in escrow until you verify and approve the delivery
        </p>

        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-medium text-gray-500">Progress</div>
            <div className="text-sm font-medium text-green-600">Step {getStepProgress() / 20} of 5</div>
          </div>
          <Progress value={getStepProgress()} className="h-2" />
        </div>

        <div className="flex items-center justify-between mb-4">
          <div
            className={`flex flex-col items-center ${currentStep === "payment" || currentStep === "confirmation" || currentStep === "receipt" || currentStep === "verification" || currentStep === "feedback" ? "text-green-600" : "text-gray-400"}`}
          >
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep === "payment" || currentStep === "confirmation" || currentStep === "receipt" || currentStep === "verification" || currentStep === "feedback" ? "bg-green-100" : "bg-gray-100"}`}
            >
              <CreditCard className="h-4 w-4" />
            </div>
            <span className="text-xs mt-1">Payment</span>
          </div>
          <div className="w-full mx-2 h-0.5 bg-gray-200">
            <div
              className={`h-full bg-green-500 ${currentStep === "confirmation" || currentStep === "receipt" || currentStep === "verification" || currentStep === "feedback" ? "w-full" : "w-0"}`}
            ></div>
          </div>
          <div
            className={`flex flex-col items-center ${currentStep === "confirmation" || currentStep === "receipt" || currentStep === "verification" || currentStep === "feedback" ? "text-green-600" : "text-gray-400"}`}
          >
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep === "confirmation" || currentStep === "receipt" || currentStep === "verification" || currentStep === "feedback" ? "bg-green-100" : "bg-gray-100"}`}
            >
              <CheckCircle className="h-4 w-4" />
            </div>
            <span className="text-xs mt-1">Confirmation</span>
          </div>
          <div className="w-full mx-2 h-0.5 bg-gray-200">
            <div
              className={`h-full bg-green-500 ${currentStep === "receipt" || currentStep === "verification" || currentStep === "feedback" ? "w-full" : "w-0"}`}
            ></div>
          </div>
          <div
            className={`flex flex-col items-center ${currentStep === "receipt" || currentStep === "verification" || currentStep === "feedback" ? "text-green-600" : "text-gray-400"}`}
          >
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep === "receipt" || currentStep === "verification" || currentStep === "feedback" ? "bg-green-100" : "bg-gray-100"}`}
            >
              <Truck className="h-4 w-4" />
            </div>
            <span className="text-xs mt-1">Delivery</span>
          </div>
          <div className="w-full mx-2 h-0.5 bg-gray-200">
            <div
              className={`h-full bg-green-500 ${currentStep === "verification" || currentStep === "feedback" ? "w-full" : "w-0"}`}
            ></div>
          </div>
          <div
            className={`flex flex-col items-center ${currentStep === "verification" || currentStep === "feedback" ? "text-green-600" : "text-gray-400"}`}
          >
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep === "verification" || currentStep === "feedback" ? "bg-green-100" : "bg-gray-100"}`}
            >
              <ShieldCheck className="h-4 w-4" />
            </div>
            <span className="text-xs mt-1">Verification</span>
          </div>
          <div className="w-full mx-2 h-0.5 bg-gray-200">
            <div className={`h-full bg-green-500 ${currentStep === "feedback" ? "w-full" : "w-0"}`}></div>
          </div>
          <div
            className={`flex flex-col items-center ${currentStep === "feedback" ? "text-green-600" : "text-gray-400"}`}
          >
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center ${currentStep === "feedback" ? "bg-green-100" : "bg-gray-100"}`}
            >
              <Star className="h-4 w-4" />
            </div>
            <span className="text-xs mt-1">Feedback</span>
          </div>
        </div>
      </div>

      {currentStep === "payment" && (
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
            <CardDescription>Select delivery urgency and payment method</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Delivery Urgency</h3>
              <RadioGroup
                value={selectedUrgency}
                onValueChange={(value) => setSelectedUrgency(value as "standard" | "express" | "urgent")}
                className="space-y-3"
              >
                <div
                  className={`flex items-center space-x-2 rounded-md border p-3 ${selectedUrgency === "standard" ? "border-green-500 bg-green-50" : ""}`}
                >
                  <RadioGroupItem value="standard" id="standard" />
                  <Label htmlFor="standard" className="flex-1 cursor-pointer">
                    <div className="font-medium flex items-center justify-between">
                      <span>Standard Delivery</span>
                      <span className="text-green-600">₦0</span>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      3-5 business days
                    </div>
                  </Label>
                </div>
                <div
                  className={`flex items-center space-x-2 rounded-md border p-3 ${selectedUrgency === "express" ? "border-green-500 bg-green-50" : ""}`}
                >
                  <RadioGroupItem value="express" id="express" />
                  <Label htmlFor="express" className="flex-1 cursor-pointer">
                    <div className="font-medium flex items-center justify-between">
                      <span>Express Delivery</span>
                      <span className="text-green-600">₦2,500</span>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      1-2 business days
                    </div>
                  </Label>
                </div>
                <div
                  className={`flex items-center space-x-2 rounded-md border p-3 ${selectedUrgency === "urgent" ? "border-green-500 bg-green-50" : ""}`}
                >
                  <RadioGroupItem value="urgent" id="urgent" />
                  <Label htmlFor="urgent" className="flex-1 cursor-pointer">
                    <div className="font-medium flex items-center justify-between">
                      <span>Urgent Delivery</span>
                      <span className="text-green-600">₦5,000</span>
                    </div>
                    <div className="text-sm text-gray-500 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      Same day (within 8 hours)
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="delivery-notes">Delivery Notes (Optional)</Label>
              <Textarea
                id="delivery-notes"
                placeholder="Add any specific delivery instructions or timing requirements..."
                className="min-h-[100px]"
              />
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Order Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₦125,000.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee ({selectedUrgency})</span>
                  <span>
                    {selectedUrgency === "standard"
                      ? "₦0.00"
                      : selectedUrgency === "express"
                        ? "₦2,500.00"
                        : "₦5,000.00"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Escrow Fee (1%)</span>
                  <span>₦1,250.00</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>
                    ₦
                    {(
                      125000 +
                      (selectedUrgency === "standard" ? 0 : selectedUrgency === "express" ? 2500 : 5000) +
                      1250
                    ).toLocaleString()}
                    .00
                  </span>
                </div>
              </div>
            </div>

            <Alert className="bg-blue-50 border-blue-200">
              <Lock className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Escrow Protection</AlertTitle>
              <AlertDescription className="text-blue-700">
                Your payment will be held securely in escrow and only released to the seller after you verify and
                approve the delivery.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">Cancel</Button>
            <Button onClick={handleContinue}>Continue to Payment</Button>
          </CardFooter>
        </Card>
      )}

      {currentStep === "confirmation" && (
        <Card>
          <CardHeader>
            <CardTitle>Confirm Your Order</CardTitle>
            <CardDescription>Review your order details before proceeding</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Order Details</h3>
              <div className="rounded-md border p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Order ID:</span>
                  <span className="text-sm font-medium">ORD-2023-1234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Seller:</span>
                  <span className="text-sm font-medium">Lagos Pharmaceuticals</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Items:</span>
                  <span className="text-sm font-medium">5 products</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Delivery:</span>
                  <Badge
                    variant="outline"
                    className={
                      selectedUrgency === "urgent"
                        ? "border-red-200 bg-red-50 text-red-700"
                        : selectedUrgency === "express"
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : "border-green-200 bg-green-50 text-green-700"
                    }
                  >
                    {selectedUrgency.charAt(0).toUpperCase() + selectedUrgency.slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Expected Delivery:</span>
                  <span className="text-sm font-medium">
                    {selectedUrgency === "urgent"
                      ? "Today (within 8 hours)"
                      : selectedUrgency === "express"
                        ? "1-2 business days"
                        : "3-5 business days"}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Payment Summary</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>₦125,000.00</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Delivery Fee ({selectedUrgency})</span>
                  <span>
                    {selectedUrgency === "standard"
                      ? "₦0.00"
                      : selectedUrgency === "express"
                        ? "₦2,500.00"
                        : "₦5,000.00"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Escrow Fee (1%)</span>
                  <span>₦1,250.00</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>
                    ₦
                    {(
                      125000 +
                      (selectedUrgency === "standard" ? 0 : selectedUrgency === "express" ? 2500 : 5000) +
                      1250
                    ).toLocaleString()}
                    .00
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Escrow Process</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-800 text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Payment Secured</h4>
                    <p className="text-xs text-gray-500">Your payment is held securely in escrow</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-800 text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Order Processed</h4>
                    <p className="text-xs text-gray-500">Seller prepares and ships your order</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-800 text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Delivery & Verification</h4>
                    <p className="text-xs text-gray-500">You receive and verify the products</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-800 text-xs font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Approval & Release</h4>
                    <p className="text-xs text-gray-500">You approve and funds are released to the seller</p>
                  </div>
                </div>
              </div>
            </div>

            <Alert className="bg-green-50 border-green-200">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Your Purchase is Protected</AlertTitle>
              <AlertDescription className="text-green-700">
                If the products don't match the description or aren't delivered, you can request a refund through our
                dispute resolution process.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleContinue}>Confirm and Pay</Button>
          </CardFooter>
        </Card>
      )}

      {currentStep === "receipt" && (
        <Card>
          <CardHeader className="text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <CardTitle>Payment Successful!</CardTitle>
            <CardDescription>Your payment has been securely held in escrow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="bg-green-50 border-green-200">
              <Info className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Your order has been confirmed and the seller has been notified. You'll receive updates as your order
                progresses.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Order Receipt</h3>
              <div className="rounded-md border p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Order ID:</span>
                  <span className="text-sm font-medium">ORD-2023-1234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Date:</span>
                  <span className="text-sm font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Payment Status:</span>
                  <Badge className="bg-blue-500">In Escrow</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Delivery:</span>
                  <Badge
                    variant="outline"
                    className={
                      selectedUrgency === "urgent"
                        ? "border-red-200 bg-red-50 text-red-700"
                        : selectedUrgency === "express"
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : "border-green-200 bg-green-50 text-green-700"
                    }
                  >
                    {selectedUrgency.charAt(0).toUpperCase() + selectedUrgency.slice(1)}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Expected Delivery:</span>
                  <span className="text-sm font-medium">
                    {selectedUrgency === "urgent"
                      ? "Today (within 8 hours)"
                      : selectedUrgency === "express"
                        ? "1-2 business days"
                        : "3-5 business days"}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total Paid:</span>
                  <span>
                    ₦
                    {(
                      125000 +
                      (selectedUrgency === "standard" ? 0 : selectedUrgency === "express" ? 2500 : 5000) +
                      1250
                    ).toLocaleString()}
                    .00
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Next Steps</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-800 text-xs font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Track Your Order</h4>
                    <p className="text-xs text-gray-500">You'll receive updates via email and in your dashboard</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-800 text-xs font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Receive Delivery</h4>
                    <p className="text-xs text-gray-500">
                      The seller will deliver your order according to the selected timeframe
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-800 text-xs font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Verify Products</h4>
                    <p className="text-xs text-gray-500">
                      Check that all products match your order and are in good condition
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-800 text-xs font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Approve & Release Payment</h4>
                    <p className="text-xs text-gray-500">
                      Approve the order to release funds from escrow to the seller
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">View Order Details</Button>
            <Button onClick={handleContinue}>Continue</Button>
          </CardFooter>
        </Card>
      )}

      {currentStep === "verification" && (
        <Card>
          <CardHeader>
            <CardTitle>Product Verification</CardTitle>
            <CardDescription>Verify your delivery before releasing payment</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-600" />
              <AlertDescription className="text-blue-700">
                Please verify that all products have been delivered correctly before approving the order. This will
                release the payment from escrow to the seller.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Order Information</h3>
              <div className="rounded-md border p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Order ID:</span>
                  <span className="text-sm font-medium">ORD-2023-1234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Seller:</span>
                  <span className="text-sm font-medium">Lagos Pharmaceuticals</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Delivery Date:</span>
                  <span className="text-sm font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Escrow Status:</span>
                  <Badge className="bg-blue-500">Awaiting Approval</Badge>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Verification Checklist</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox id="check-1" />
                  <Label htmlFor="check-1">All items were delivered as ordered</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="check-2" />
                  <Label htmlFor="check-2">Products match the descriptions</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="check-3" />
                  <Label htmlFor="check-3">Products are in good condition</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="check-4" />
                  <Label htmlFor="check-4">NAFDAC numbers are verified</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="check-5" />
                  <Label htmlFor="check-5">Expiration dates are acceptable</Label>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verification-notes">Additional Notes (Optional)</Label>
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
                By approving this order, you confirm that all products have been received as described and you authorize
                the release of funds from escrow to the seller.
              </AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">Report Issue</Button>
              <Button onClick={handleContinue}>Approve & Release Payment</Button>
            </div>
          </CardFooter>
        </Card>
      )}

      {currentStep === "feedback" && (
        <Card>
          <CardHeader className="text-center">
            <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-2" />
            <CardTitle>Payment Released!</CardTitle>
            <CardDescription>Thank you for verifying your order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="bg-green-50 border-green-200">
              <ShieldCheck className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-700">
                Your payment has been released from escrow to the seller. The transaction is now complete.
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Rate Your Experience</h3>
              <div className="flex justify-center space-x-2 mb-4">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <Button key={rating} variant="outline" size="icon" className="h-10 w-10 rounded-full">
                    <Star className={`h-5 w-5 ${rating <= 4 ? "text-gray-400" : "text-amber-400 fill-amber-400"}`} />
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

            <div className="space-y-4">
              <h3 className="text-sm font-medium">Transaction Summary</h3>
              <div className="rounded-md border p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Order ID:</span>
                  <span className="text-sm font-medium">ORD-2023-1234</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Seller:</span>
                  <span className="text-sm font-medium">Lagos Pharmaceuticals</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Order Date:</span>
                  <span className="text-sm font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500">Completion Date:</span>
                  <span className="text-sm font-medium">{new Date().toLocaleDateString()}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Total Amount:</span>
                  <span>
                    ₦
                    {(
                      125000 +
                      (selectedUrgency === "standard" ? 0 : selectedUrgency === "express" ? 2500 : 5000) +
                      1250
                    ).toLocaleString()}
                    .00
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">View Order History</Button>
            <Button>Continue Shopping</Button>
          </CardFooter>
        </Card>
      )}
    </div>
  )
}
