"use client"

import { Metadata } from "next"
import { ShieldCheck } from "lucide-react"
import VerificationCenter from "@/components/verification/verification-center"

export const metadata: Metadata = {
  title: "Verify Products | PharmaMarketplace",
  description: "Verify the authenticity of pharmaceutical products",
}

export default function VerifyPage() {
  return (
    <div className="container py-8 space-y-8">
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-3 rounded-full">
            <ShieldCheck className="h-6 w-6 text-primary" />
          </div>
          <h1 className="text-3xl font-bold">Product Verification</h1>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Verify the authenticity of pharmaceutical products using our verification tools. 
          Protect yourself and your patients from counterfeit or substandard medications.
        </p>
      </div>
      
      <VerificationCenter />
    </div>
  )
} 