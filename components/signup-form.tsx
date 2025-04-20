"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CheckCircle2, ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SignupForm() {
  const router = useRouter()
  const [role, setRole] = useState("buyer")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would handle form submission and authentication here

    // Redirect based on role
    if (role === "buyer") {
      router.push("/buyer-dashboard")
    } else {
      router.push("/seller-dashboard")
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>Join thousands of pharmaceutical professionals on PharmaBuy</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <Tabs defaultValue="buyer" className="w-full" onValueChange={setRole}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="buyer">Buyer</TabsTrigger>
                <TabsTrigger value="seller">Seller</TabsTrigger>
              </TabsList>
              <TabsContent value="buyer" className="mt-2">
                <div className="text-sm text-gray-500 flex items-start gap-2 p-3 bg-blue-50 rounded-md">
                  <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p>For pharmacies and hospitals looking to purchase pharmaceutical products</p>
                </div>
              </TabsContent>
              <TabsContent value="seller" className="mt-2">
                <div className="text-sm text-gray-500 flex items-start gap-2 p-3 bg-blue-50 rounded-md">
                  <CheckCircle2 className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <p>For manufacturers, distributors, and wholesalers looking to sell pharmaceutical products</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input id="fullName" placeholder="John Doe" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input id="companyName" placeholder="ABC Pharmaceuticals" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="john@example.com" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required />
                <p className="text-xs text-gray-500">
                  Password must be at least 8 characters with a number and special character
                </p>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Create Account
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center text-gray-500">
          Already have an account?{" "}
          <a href="#" className="text-blue-600 hover:underline">
            Sign in
          </a>
        </div>
        <div className="text-xs text-center text-gray-400">
          By signing up, you agree to our{" "}
          <a href="#" className="underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="underline">
            Privacy Policy
          </a>
        </div>
      </CardFooter>
    </Card>
  )
}
