"use client"

import { useRouter } from "next/navigation"
import LoginForm from "@/components/login-form"

export default function SignIn() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-md bg-blue-600 flex items-center justify-center">
                <span className="text-white font-bold text-xl">Rx</span>
              </div>
              <h1 className="text-2xl font-bold text-blue-900">PharmaBuy</h1>
            </div>
          </div>
        </header>

        <main className="flex justify-center">
          <LoginForm />
        </main>
      </div>
    </div>
  )
} 