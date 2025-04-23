"use client"

import { useState } from "react"
import { Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"

export interface FilterSection {
  id: string
  title: string
  options: {
    id: string
    label: string
  }[]
}

export interface FilterSheetProps {
  sections: FilterSection[]
  activeFilters: string[]
  onFilterChange: (filterId: string) => void
  onClearAll: () => void
}

export function FilterSheet({
  sections,
  activeFilters,
  onFilterChange,
  onClearAll,
}: FilterSheetProps) {
  const [open, setOpen] = useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm">
          <Filter className="mr-2 h-4 w-4" />
          Filter
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px]">
        <SheetHeader className="space-y-2.5 pb-4">
          <SheetTitle>Filters</SheetTitle>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              {activeFilters.length} selected
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                onClearAll()
                setOpen(false)
              }}
              className="h-auto p-0 text-sm font-medium"
            >
              Clear all
            </Button>
          </div>
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-8rem)]">
          <div className="space-y-6">
            {sections.map((section) => (
              <div key={section.id} className="space-y-4">
                <h4 className="font-medium">{section.title}</h4>
                <div className="grid gap-3">
                  {section.options.map((option) => (
                    <div
                      key={option.id}
                      className="flex items-center space-x-3"
                    >
                      <Checkbox
                        id={option.id}
                        checked={activeFilters.includes(option.id)}
                        onCheckedChange={() => {
                          onFilterChange(option.id)
                        }}
                      />
                      <label
                        htmlFor={option.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
} 