import { Filter, X } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface FilterOption {
  id: string
  label: string
  count?: number
}

interface FilterSection {
  id: string
  title: string
  options: FilterOption[]
}

interface FilterSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activeFilters: string[]
  sections: FilterSection[]
  onFilterChange: (filterId: string) => void
  onClearFilters: () => void
}

export function FilterSheet({ 
  open,
  onOpenChange,
  activeFilters, 
  sections, 
  onFilterChange, 
  onClearFilters 
}: FilterSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <Filter className="h-4 w-4 mr-2" />
          Filters
          {activeFilters.length > 0 && (
            <Badge variant="secondary" className="ml-2">
              {activeFilters.length}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[85vh]">
        <SheetHeader className="flex-row justify-between items-center mb-6">
          <SheetTitle>Filters</SheetTitle>
          {activeFilters.length > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              Clear all
            </Button>
          )}
        </SheetHeader>
        <ScrollArea className="h-[calc(100%-8rem)]">
          <Accordion type="multiple" className="w-full">
            {sections.map((section) => (
              <AccordionItem value={section.id} key={section.id}>
                <AccordionTrigger className="text-sm">{section.title}</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    {section.options.map((option) => (
                      <div key={option.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={option.id}
                          checked={activeFilters.includes(option.id)}
                          onCheckedChange={() => onFilterChange(option.id)}
                        />
                        <label
                          htmlFor={option.id}
                          className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {option.label}
                          {option.count !== undefined && (
                            <span className="ml-1 text-gray-500">({option.count})</span>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t">
          <Button className="w-full">Apply Filters</Button>
        </div>
      </SheetContent>
    </Sheet>
  )
} 