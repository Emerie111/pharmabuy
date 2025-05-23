"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Truck, FileText, Search, Filter, Calendar, Package2, Clock, AlertCircle, Plus, X, MoreHorizontal } from "lucide-react"
import { OrdersList } from "@/components/buyer/orders-list"
import BulkOrderModule from "@/components/dashboard/bulk-order-module"
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
import { Badge } from "@/components/ui/badge"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
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

const defaultFilters: FilterState = {
  status: [],
  nafdacVerification: [],
  supplierVerification: [],
  orderValue: [0, 1000000],
  dateRange: {
    from: undefined,
    to: undefined
  }
}

// ShipmentDetails modal component
function ShipmentDetails({ shipment, open, onOpenChange }: { shipment: any, open: boolean, onOpenChange: (v: boolean) => void }) {
  if (!shipment) return null
  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/30", open ? "" : "hidden")}
      onClick={() => onOpenChange(false)}
    >
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative" onClick={e => e.stopPropagation()}>
        <button className="absolute top-2 right-2" onClick={() => onOpenChange(false)}>
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-bold mb-4">Shipment Details</h2>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipment ID</span>
            <span>{shipment.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Order ID</span>
            <span>{shipment.orderId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipment Date</span>
            <span>{shipment.date}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <span>{shipment.status.charAt(0).toUpperCase() + shipment.status.slice(1)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Delivery Company</span>
            <span>{shipment.deliveryCompany}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Driver Name</span>
            <span>{shipment.driverName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Driver Phone</span>
            <span>{shipment.driverPhone}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Vehicle</span>
            <span>{shipment.vehicle}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// Add InvoiceDetails modal component
function InvoiceDetails({ invoice, open, onOpenChange }: { invoice: any, open: boolean, onOpenChange: (v: boolean) => void }) {
  if (!invoice) return null
  return (
    <div className={cn("fixed inset-0 z-50 flex items-center justify-center bg-black/30", open ? "" : "hidden")}
      onClick={() => onOpenChange(false)}
    >
      <div className="bg-white rounded-lg shadow-lg max-w-lg w-full p-6 relative" onClick={e => e.stopPropagation()}>
        <button className="absolute top-2 right-2" onClick={() => onOpenChange(false)}>
          <X className="h-5 w-5" />
        </button>
        <h2 className="text-xl font-bold mb-4">Invoice Details</h2>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Invoice ID</span>
            <span>{invoice.id}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Order ID</span>
            <span>{invoice.orderId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Issue Date</span>
            <span>{invoice.issueDate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Due Date</span>
            <span>{invoice.dueDate}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Amount</span>
            <span>₦{invoice.amount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Status</span>
            <span>{invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}</span>
          </div>
          {/* Payment info placeholder */}
          {invoice.status === "paid" && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment Reference</span>
              <span>{invoice.paymentReference || "PAY-2024-001"}</span>
            </div>
          )}
          {/* Cost Breakdown */}
          {invoice.breakdown && (
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Cost Breakdown</h3>
              <ul className="space-y-1">
                {invoice.breakdown.map((item: any, idx: number) => (
                  <li key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.label}</span>
                    <span>₦{item.amount.toLocaleString()}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default function OrderManagementPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [activeFilters, setActiveFilters] = useState<FilterState>(defaultFilters)

  // Load filters from localStorage on mount (client only)
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("orderFilters")
      if (saved) {
        setActiveFilters(JSON.parse(saved))
      }
    }
  }, [])

  // Save filters to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("orderFilters", JSON.stringify(activeFilters))
    }
  }, [activeFilters])

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.length >= 3) {
        // Implement search logic here
        console.log('Searching for:', searchQuery)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const clearFilters = () => {
    setActiveFilters(defaultFilters)
  }

  // Mock shipment data (API-ready structure)
  const shipments = [
    {
      id: "SHP-2024-001",
      orderId: "ORD-2024-001",
      date: "2024-03-15",
      deliveryCompany: "DHL",
      driverName: "John Doe",
      driverPhone: "+234 801 234 5678",
      vehicle: "Toyota Hiace - KJA 123 XY",
      status: "pending",
    },
    {
      id: "SHP-2024-002",
      orderId: "ORD-2024-002",
      date: "2024-03-16",
      deliveryCompany: "GIG Logistics",
      driverName: "Jane Smith",
      driverPhone: "+234 802 345 6789",
      vehicle: "Ford Transit - LAG 456 AB",
      status: "in-transit",
    },
    {
      id: "SHP-2024-003",
      orderId: "ORD-2024-003",
      date: "2024-03-17",
      deliveryCompany: "FedEx",
      driverName: "Ahmed Musa",
      driverPhone: "+234 803 456 7890",
      vehicle: "Mercedes Sprinter - ABJ 789 CD",
      status: "delivered",
    },
    {
      id: "SHP-2024-004",
      orderId: "ORD-2024-004",
      date: "2024-03-18",
      deliveryCompany: "ABC Logistics",
      driverName: "Chinedu Okafor",
      driverPhone: "+234 804 567 8901",
      vehicle: "Iveco Daily - ENU 321 EF",
      status: "pending",
    },
    {
      id: "SHP-2024-005",
      orderId: "ORD-2024-005",
      date: "2024-03-19",
      deliveryCompany: "DHL",
      driverName: "Bola Akin",
      driverPhone: "+234 805 678 9012",
      vehicle: "Toyota Hiace - KAD 654 GH",
      status: "in-transit",
    },
    {
      id: "SHP-2024-006",
      orderId: "ORD-2024-006",
      date: "2024-03-20",
      deliveryCompany: "GIG Logistics",
      driverName: "Fatima Bello",
      driverPhone: "+234 806 789 0123",
      vehicle: "Ford Transit - PHC 987 IJ",
      status: "delivered",
    },
  ]

  // Summary counts
  const totalShipments = shipments.length
  const pendingShipments = shipments.filter(s => s.status === "pending").length
  const inTransitShipments = shipments.filter(s => s.status === "in-transit").length
  const deliveredShipments = shipments.filter(s => s.status === "delivered").length

  // Table selection state
  const [selectedShipments, setSelectedShipments] = useState<string[]>([])
  const toggleShipmentSelection = (shipmentId: string) => {
    setSelectedShipments((prev) =>
      prev.includes(shipmentId)
        ? prev.filter((id) => id !== shipmentId)
        : [...prev, shipmentId]
    )
  }
  const toggleAllShipments = () => {
    setSelectedShipments((prev) =>
      prev.length === shipments.length ? [] : shipments.map((s) => s.id)
    )
  }

  const [shipmentDetailsOpen, setShipmentDetailsOpen] = useState(false)
  const [selectedShipment, setSelectedShipment] = useState<any>(null)

  // Mock invoice data (API-ready structure)
  const invoices = [
    {
      id: "INV-2024-001",
      orderId: "ORD-2024-001",
      issueDate: "2024-03-10",
      dueDate: "2024-03-20",
      amount: 125000,
      status: "pending",
      breakdown: [
        { label: "Products", amount: 110000 },
        { label: "Shipping", amount: 10000 },
        { label: "VAT (7.5%)", amount: 5000 },
      ],
    },
    {
      id: "INV-2024-002",
      orderId: "ORD-2024-002",
      issueDate: "2024-03-12",
      dueDate: "2024-03-22",
      amount: 87500,
      status: "paid",
      breakdown: [
        { label: "Products", amount: 80000 },
        { label: "Shipping", amount: 5000 },
        { label: "VAT (7.5%)", amount: 2500 },
      ],
    },
    {
      id: "INV-2024-003",
      orderId: "ORD-2024-003",
      issueDate: "2024-03-14",
      dueDate: "2024-03-24",
      amount: 45000,
      status: "overdue",
      breakdown: [
        { label: "Products", amount: 40000 },
        { label: "Shipping", amount: 3000 },
        { label: "VAT (7.5%)", amount: 2000 },
      ],
    },
    {
      id: "INV-2024-004",
      orderId: "ORD-2024-004",
      issueDate: "2024-03-15",
      dueDate: "2024-03-25",
      amount: 60000,
      status: "pending",
      breakdown: [
        { label: "Products", amount: 55000 },
        { label: "Shipping", amount: 3000 },
        { label: "VAT (7.5%)", amount: 2000 },
      ],
    },
    {
      id: "INV-2024-005",
      orderId: "ORD-2024-005",
      issueDate: "2024-03-16",
      dueDate: "2024-03-26",
      amount: 98000,
      status: "paid",
      breakdown: [
        { label: "Products", amount: 90000 },
        { label: "Shipping", amount: 5000 },
        { label: "VAT (7.5%)", amount: 3000 },
      ],
    },
    {
      id: "INV-2024-006",
      orderId: "ORD-2024-006",
      issueDate: "2024-03-17",
      dueDate: "2024-03-27",
      amount: 72000,
      status: "overdue",
      breakdown: [
        { label: "Products", amount: 65000 },
        { label: "Shipping", amount: 4000 },
        { label: "VAT (7.5%)", amount: 3000 },
      ],
    },
  ]

  // Summary calculations
  const totalOutstanding = invoices.filter(i => i.status !== "paid").reduce((sum, i) => sum + i.amount, 0)
  const paidInvoices = invoices.filter(i => i.status === "paid")
  const paidInvoicesCount = paidInvoices.length
  const paidInvoicesTotal = paidInvoices.reduce((sum, i) => sum + i.amount, 0)
  const pendingPayments = invoices.filter(i => i.status === "pending").length
  const overduePayments = invoices.filter(i => i.status === "overdue").length
  // For demo, compare to previous month (mocked)
  const prevMonthOutstanding = 300000
  const outstandingDiff = totalOutstanding - prevMonthOutstanding

  // Table selection state
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])
  const toggleInvoiceSelection = (invoiceId: string) => {
    setSelectedInvoices((prev) =>
      prev.includes(invoiceId)
        ? prev.filter((id) => id !== invoiceId)
        : [...prev, invoiceId]
    )
  }
  const toggleAllInvoices = () => {
    setSelectedInvoices((prev) =>
      prev.length === invoices.length ? [] : invoices.map((i) => i.id)
    )
  }

  const [invoiceDetailsOpen, setInvoiceDetailsOpen] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)

  return (
    <div className="px-4 md:px-6 lg:px-8 max-w-7xl mx-auto py-8 space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Order Management</h1>
          <p className="text-muted-foreground mt-2">Manage your orders, shipments, and invoices in one place.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2">
                <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Date Range</span>
          </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <CalendarComponent
                initialFocus
                mode="range"
                defaultMonth={activeFilters.dateRange.from}
                selected={{
                  from: activeFilters.dateRange.from,
                  to: activeFilters.dateRange.to,
                }}
                onSelect={(range) => 
                  setActiveFilters({ 
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

          <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm" className="h-9 gap-2">
                <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filter</span>
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
                            setActiveFilters({ ...activeFilters, status: newStatus })
                          }}
                        >
                          {status === "pending" && <Package2 className="mr-2 h-4 w-4" />}
                          {status === "processing" && <Clock className="mr-2 h-4 w-4" />}
                          {status === "in-transit" && <Truck className="mr-2 h-4 w-4" />}
                          {status === "delivered" && <Package2 className="mr-2 h-4 w-4" />}
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
                        value={activeFilters.nafdacVerification[0] || "all"}
                        onValueChange={(value) => 
                          setActiveFilters({ 
                            ...activeFilters, 
                            nafdacVerification: value === "all" ? [] : [value] 
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="NAFDAC Verification" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="verified">Verified</SelectItem>
                          <SelectItem value="unverified">Unverified</SelectItem>
                          <SelectItem value="mixed">Mixed</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={activeFilters.supplierVerification[0] || "all"}
                        onValueChange={(value) => 
                          setActiveFilters({ 
                            ...activeFilters, 
                            supplierVerification: value === "all" ? [] : [value] 
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Supplier Verification" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
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
                          setActiveFilters({ 
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

          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search orders..." 
              className="w-full pl-10 pr-4 md:w-[300px]" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Active Filter Chips */}
      {(activeFilters.status.length > 0 || 
        activeFilters.nafdacVerification.length > 0 || 
        activeFilters.supplierVerification.length > 0 || 
        activeFilters.orderValue[0] > 0 || 
        activeFilters.orderValue[1] < 1000000 || 
        activeFilters.dateRange.from || 
        activeFilters.dateRange.to) && (
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
                  setActiveFilters({
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

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="orders" className="flex items-center gap-2 flex-1 sm:flex-initial">
            <ShoppingCart className="h-4 w-4" />
            <span>Orders</span>
          </TabsTrigger>
          <TabsTrigger value="shipments" className="flex items-center gap-2 flex-1 sm:flex-initial">
            <Truck className="h-4 w-4" />
            <span>Shipments</span>
          </TabsTrigger>
          <TabsTrigger value="invoices" className="flex items-center gap-2 flex-1 sm:flex-initial">
            <FileText className="h-4 w-4" />
            <span>Invoices & Payments</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                <Package2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24</div>
                <p className="text-xs text-muted-foreground">+2 from last month</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3</div>
                <p className="text-xs text-muted-foreground">Awaiting processing</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Transit</CardTitle>
                <Truck className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Currently shipping</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Issues</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1</div>
                <p className="text-xs text-muted-foreground">Needs attention</p>
              </CardContent>
            </Card>
          </div>

          <div className="flex justify-end">
            <Button variant="default" size="lg" className="gap-2" onClick={() => document.getElementById('bulk-order')?.scrollIntoView({ behavior: 'smooth' })}>
              <Plus className="h-4 w-4" />
              New Bulk Order
            </Button>
          </div>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>View and manage your recent orders</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <OrdersList />
            </CardContent>
          </Card>

          <div id="bulk-order">
            <BulkOrderModule />
          </div>
        </TabsContent>

        <TabsContent value="shipments" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Shipments</CardTitle>
                <Truck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalShipments}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Shipments</CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingShipments}</div>
                <p className="text-xs text-muted-foreground">Awaiting pickup</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">In Transit Shipments</CardTitle>
                <Truck className="h-4 w-4 text-blue-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{inTransitShipments}</div>
                <p className="text-xs text-muted-foreground">Currently shipping</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Delivered Shipments</CardTitle>
                <Package2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{deliveredShipments}</div>
                <p className="text-xs text-muted-foreground">Successfully delivered</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Shipments Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Recent Shipments</CardTitle>
              <CardDescription>View and manage your recent shipments</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-[50px] px-4 py-2">
                        <input
                          type="checkbox"
                          checked={selectedShipments.length === shipments.length}
                          onChange={toggleAllShipments}
                        />
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipment ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipment Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delivery Company</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {shipments.map((shipment) => (
                      <tr key={shipment.id}>
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            checked={selectedShipments.includes(shipment.id)}
                            onChange={() => toggleShipmentSelection(shipment.id)}
                          />
                        </td>
                        <td className="px-4 py-2 font-medium">{shipment.id}</td>
                        <td className="px-4 py-2">{shipment.orderId}</td>
                        <td className="px-4 py-2">{shipment.date}</td>
                        <td className="px-4 py-2">{shipment.deliveryCompany}</td>
                        <td className="px-4 py-2">
                          {shipment.status === "pending" && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Pending</span>
                          )}
                          {shipment.status === "in-transit" && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">In Transit</span>
                          )}
                          {shipment.status === "delivered" && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Delivered</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => { setSelectedShipment(shipment); setShipmentDetailsOpen(true); }}>
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          <ShipmentDetails shipment={selectedShipment} open={shipmentDetailsOpen} onOpenChange={setShipmentDetailsOpen} />
        </TabsContent>

        <TabsContent value="invoices" className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Outstanding</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₦{totalOutstanding.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {outstandingDiff >= 0 ? `+₦${outstandingDiff.toLocaleString()}` : `-₦${Math.abs(outstandingDiff).toLocaleString()}`} from last month
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paid Invoices</CardTitle>
                <Package2 className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{paidInvoicesCount}</div>
                <p className="text-xs text-muted-foreground">Total: ₦{paidInvoicesTotal.toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
                <Clock className="h-4 w-4 text-amber-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{pendingPayments}</div>
                <p className="text-xs text-muted-foreground">Awaiting payment</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue Payments</CardTitle>
                <AlertCircle className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{overduePayments}</div>
                <p className="text-xs text-muted-foreground">Requires attention</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Invoices Table */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Recent Invoices</CardTitle>
              <CardDescription>View and manage your recent invoices</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="w-[50px] px-4 py-2">
                        <input
                          type="checkbox"
                          checked={selectedInvoices.length === invoices.length}
                          onChange={toggleAllInvoices}
                        />
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invoices.map((invoice) => (
                      <tr key={invoice.id}>
                        <td className="px-4 py-2">
                          <input
                            type="checkbox"
                            checked={selectedInvoices.includes(invoice.id)}
                            onChange={() => toggleInvoiceSelection(invoice.id)}
                          />
                        </td>
                        <td className="px-4 py-2 font-medium">{invoice.id}</td>
                        <td className="px-4 py-2">{invoice.orderId}</td>
                        <td className="px-4 py-2">{invoice.issueDate}</td>
                        <td className="px-4 py-2">{invoice.dueDate}</td>
                        <td className="px-4 py-2">₦{invoice.amount.toLocaleString()}</td>
                        <td className="px-4 py-2">
                          {invoice.status === "paid" && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Paid</span>
                          )}
                          {invoice.status === "pending" && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Pending</span>
                          )}
                          {invoice.status === "overdue" && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Overdue</span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => { setSelectedInvoice(invoice); setInvoiceDetailsOpen(true); }}>
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
          <InvoiceDetails invoice={selectedInvoice} open={invoiceDetailsOpen} onOpenChange={setInvoiceDetailsOpen} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
