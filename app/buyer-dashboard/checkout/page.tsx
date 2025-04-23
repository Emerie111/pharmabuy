import { EscrowPaymentSystem } from "@/components/buyer/escrow-payment-system"
import BuyerDashboardLayout from "@/components/layouts/buyer-dashboard-layout"

export default function CheckoutPage() {
  return (
    <BuyerDashboardLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Secure Checkout</h1>
        <p className="text-gray-500">Complete your purchase with our secure escrow payment system</p>
      </div>

      <EscrowPaymentSystem
        productName="Amoxicillin 500mg (100 capsules)"
        productPrice={12500}
        quantity={10}
        sellerName="MediPharm Supplies Ltd."
      />
    </BuyerDashboardLayout>
  )
}
