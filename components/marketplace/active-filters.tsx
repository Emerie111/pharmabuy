import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"

interface ActiveFilter {
  id: string
  label: string
}

interface ActiveFiltersProps {
  activeFilters: ActiveFilter[]
  onClearFilter: (id: string) => void
  onClearAll: () => void
}

export function ActiveFilters({ activeFilters, onClearFilter, onClearAll }: ActiveFiltersProps) {
  if (activeFilters.length === 0) return null

  return (
    <div className="flex items-center gap-2 py-2">
      <ScrollArea className="w-full">
        <div className="flex gap-2">
          {activeFilters.map((filter) => (
            <Button
              key={filter.id}
              variant="secondary"
              size="sm"
              className="rounded-full h-7 px-3 text-sm shrink-0"
              onClick={() => onClearFilter(filter.id)}
            >
              {filter.label}
              <X className="h-3 w-3 ml-1" />
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      {activeFilters.length > 1 && (
        <Button
          variant="ghost"
          size="sm"
          className="shrink-0 h-7 px-2 text-sm font-medium"
          onClick={onClearAll}
        >
          Clear all
        </Button>
      )}
    </div>
  )
} 