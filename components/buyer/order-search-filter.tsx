import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Search, Filter, Calendar as CalendarIcon, Package, Truck, CheckCircle, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

// Types
interface FilterState {
  status: string[]
  nafdacVerification: string[]
  supplierVerification: string[]
  orderValue: [number, number]
  dateRange: {
    from: Date | undefined
    to: Date | undefined
  }
}

interface OrderSearchFilterProps {
  onSearch: (query: string) => void
  onFilterChange: (filters: FilterState) => void
  activeFilters: FilterState
}

export function OrderSearchFilter({ onSearch, onFilterChange, activeFilters }: OrderSearchFilterProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeFilterCount, setActiveFilterCount] = useState(0)

  // Calculate active filter count
  useEffect(() => {
    let count = 0
    if (activeFilters.status.length > 0) count++
    if (activeFilters.nafdacVerification.length > 0) count++
    if (activeFilters.supplierVerification.length > 0) count++
    if (activeFilters.orderValue[0] > 0 || activeFilters.orderValue[1] < 1000000) count++
    if (activeFilters.dateRange.from || activeFilters.dateRange.to) count++
    setActiveFilterCount(count)
  }, [activeFilters])

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 3) {
        onSearch(searchQuery)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, onSearch])

  const clearFilters = () => {
    onFilterChange({
      status: [],
      nafdacVerification: [],
      supplierVerification: [],
      orderValue: [0, 1000000],
      dateRange: {
        from: undefined,
        to: undefined
      }
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search orders, suppliers, products..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10 sm:h-10 sm:w-auto sm:px-4">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline ml-2">Filter</span>
              {activeFilterCount > 0 && (
                <Badge variant="secondary" className="ml-2 hidden sm:inline-flex">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Filter Orders</SheetTitle>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-8rem)] pr-4">
              <div className="space-y-6 py-4">
                {/* Status Filters */}
                <div className="space-y-2">
                  <h4 className="font-medium">Order Status</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {["pending", "processing", "in-transit", "delivered", "issues"].map((status) => (
                      <Button
                        key={status}
                        variant={activeFilters.status.includes(status) ? "default" : "outline"}
                        className="justify-start"
                        onClick={() => {
                          const newStatus = activeFilters.status.includes(status)
                            ? activeFilters.status.filter(s => s !== status)
                            : [...activeFilters.status, status]
                          onFilterChange({ ...activeFilters, status: newStatus })
                        }}
                      >
                        {status === "pending" && <Package className="mr-2 h-4 w-4" />}
                        {status === "processing" && <Truck className="mr-2 h-4 w-4" />}
                        {status === "in-transit" && <Truck className="mr-2 h-4 w-4" />}
                        {status === "delivered" && <CheckCircle className="mr-2 h-4 w-4" />}
                        {status === "issues" && <AlertCircle className="mr-2 h-4 w-4" />}
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Verification Filters */}
                <div className="space-y-2">
                  <h4 className="font-medium">Verification Status</h4>
                  <div className="space-y-2">
                    <Select
                      value={activeFilters.nafdacVerification[0] || ""}
                      onValueChange={(value) => 
                        onFilterChange({ 
                          ...activeFilters, 
                          nafdacVerification: value ? [value] : [] 
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="NAFDAC Verification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="unverified">Unverified</SelectItem>
                        <SelectItem value="mixed">Mixed</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={activeFilters.supplierVerification[0] || ""}
                      onValueChange={(value) => 
                        onFilterChange({ 
                          ...activeFilters, 
                          supplierVerification: value ? [value] : [] 
                        })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Supplier Verification" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All</SelectItem>
                        <SelectItem value="verified">Verified</SelectItem>
                        <SelectItem value="unverified">Unverified</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Order Value Range */}
                <div className="space-y-2">
                  <h4 className="font-medium">Order Value Range</h4>
                  <div className="px-2">
                    <Slider
                      defaultValue={[0, 1000000]}
                      max={1000000}
                      step={10000}
                      value={activeFilters.orderValue}
                      onValueChange={(value) => 
                        onFilterChange({ 
                          ...activeFilters, 
                          orderValue: value as [number, number] 
                        })
                      }
                    />
                    <div className="flex justify-between text-sm text-muted-foreground mt-2">
                      <span>₦{activeFilters.orderValue[0].toLocaleString()}</span>
                      <span>₦{activeFilters.orderValue[1].toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Date Range */}
                <div className="space-y-2">
                  <h4 className="font-medium">Date Range</h4>
                  <div className="grid gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !activeFilters.dateRange.from && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {activeFilters.dateRange.from ? (
                            activeFilters.dateRange.to ? (
                              <>
                                {format(activeFilters.dateRange.from, "LLL dd, y")} -{" "}
                                {format(activeFilters.dateRange.to, "LLL dd, y")}
                              </>
                            ) : (
                              format(activeFilters.dateRange.from, "LLL dd, y")
                            )
                          ) : (
                            <span>Pick a date range</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          initialFocus
                          mode="range"
                          defaultMonth={activeFilters.dateRange.from}
                          selected={{
                            from: activeFilters.dateRange.from,
                            to: activeFilters.dateRange.to,
                          }}
                          onSelect={(range) => 
                            onFilterChange({ 
                              ...activeFilters, 
                              dateRange: { 
                                from: range?.from, 
                                to: range?.to 
                              } 
                            })
                          }
                          numberOfMonths={2}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </div>
            </ScrollArea>
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background">
              <div className="flex justify-between gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={clearFilters}
                >
                  Clear All
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filter Chips */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap gap-2">
          {activeFilters.status.map((status) => (
            <Badge
              key={status}
              variant="secondary"
              className="flex items-center gap-1"
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => {
                  onFilterChange({
                    ...activeFilters,
                    status: activeFilters.status.filter(s => s !== status)
                  })
                }}
              />
            </Badge>
          ))}
          {/* Add similar badges for other active filters */}
        </div>
      )}
    </div>
  )
} 