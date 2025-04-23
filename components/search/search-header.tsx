"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface SearchHeaderProps {
  initialQuery: string
}

export function SearchHeader({ initialQuery }: SearchHeaderProps) {
  const router = useRouter()

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const query = formData.get("query")?.toString() || ""
    router.push(`/search?q=${encodeURIComponent(query)}`)
  }

  return (
    <div className="sticky top-0 z-10 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <form onSubmit={handleSearch} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                name="query"
                defaultValue={initialQuery}
                placeholder="Search medications, brands, or manufacturers..."
                className="w-full pl-10"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 