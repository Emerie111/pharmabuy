import { Suspense } from "react"
import { SearchResults } from "@/components/search/search-results"
import { SearchHeader } from "@/components/search/search-header"
import { SearchSkeleton } from "@/components/search/search-skeleton"

interface SearchPageProps {
  searchParams: { q?: string }
}

export default function SearchPage({ searchParams }: SearchPageProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <SearchHeader initialQuery={searchParams.q || ""} />
      <Suspense fallback={<SearchSkeleton />}>
        <SearchResults searchQuery={searchParams.q || ""} />
      </Suspense>
    </div>
  )
} 