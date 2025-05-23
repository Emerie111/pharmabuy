"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth-context"

export default function LoginForm() {
  const router = useRouter()
  const { signIn, user, refreshSession } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      // Sign in using the context's signIn method
      const { error } = await signIn(email, password)
      
      if (error) {
        throw error
      }
      
      // Refresh session to get latest user data
      await refreshSession()
      
      // Get user data from the refreshed session
      const userRole = user?.user_metadata?.role
      
      // Redirect based on role
      if (userRole === "supplier") {
        router.push("/seller-dashboard")
      } else if (userRole === "healthcare_provider") {
        router.push("/healthcare-provider-dashboard")
      } else {
        // Default redirect if role is unrecognized
        router.push("/")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError(error instanceof Error ? error.message : "Failed to sign in")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Sign In</CardTitle>
        <CardDescription>Welcome back to PharmaBuy</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="your@email.com" 
                required 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                required 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
              />
            </div>

            {error && <div className="text-red-500 text-sm text-center">{error}</div>}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Signing In..." : "Sign In"}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-center text-gray-500">
          Don't have an account?{" "}
          <a href="/" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </div>
        <div className="text-xs text-center text-gray-400">
          <a href="#" className="underline">
            Forgot your password?
          </a>
        </div>
      </CardFooter>
    </Card>
  )
} 