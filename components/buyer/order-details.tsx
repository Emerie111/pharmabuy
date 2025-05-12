"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Package,
  Truck,
  FileText,
  RefreshCw,
  Download,
  MoreHorizontal,
  AlertCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Mock data - replace with actual data fetching
const mockOrderDetails = {
  id: "ORD-2024-001",
  date: "2024-03-15",
  status: "pending",
  paymentStatus: "pending",
  total: 125000,
  items: [
    {
      id: "PROD-001",
      name: "Paracetamol 500mg",
      quantity: 100,
      unitPrice: 500,
      total: 50000,
      supplier: "MediSupply Nigeria",
      nafdacVerified: true,
    },
    {
      id: "PROD-002",
      name: "Amoxicillin 250mg",
      quantity: 50,
      unitPrice: 1500,
      total: 75000,
      supplier: "Lagos Pharmaceuticals",
      nafdacVerified: true,
    },
  ],
  shippingAddress: {
    name: "John Doe",
    address: "123 Pharmacy Street",
    city: "Lagos",
    state: "Lagos",
    country: "Nigeria",
    phone: "+234 123 456 7890",
  },
  paymentDetails: {
    method: "Bank Transfer",
    reference: "PAY-2024-001",
    status: "Pending",
    amount: 125000,
  },
}

export function OrderDetails({ orderId }: { orderId: string }) {
  const [isOpen, setIsOpen] = useState(false)

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-amber-100 text-amber-800", icon: Package },
      processing: { color: "bg-blue-100 text-blue-800", icon: RefreshCw },
      shipped: { color: "bg-purple-100 text-purple-800", icon: Truck },
      delivered: { color: "bg-green-100 text-green-800", icon: Package },
      cancelled: { color: "bg-red-100 text-red-800", icon: AlertCircle },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    const Icon = config.icon

    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <FileText className="h-4 w-4" />
          <span className="sr-only">View Details</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl h-[90vh] p-0 sm:p-0 flex flex-col">
        <DialogHeader className="px-4 sm:px-6 py-4 border-b sticky top-0 bg-white z-10">
          <DialogTitle>Order Details - {mockOrderDetails.id}</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1">
          <div className="px-4 sm:px-6 py-4 space-y-6">
            {/* Order Summary */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <h3 className="font-medium">Order Information</h3>
                <div className="rounded-lg border p-4">
                  <div className="grid gap-2 text-sm">
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="text-muted-foreground">Order Date</span>
                      <span>{mockOrderDetails.date}</span>
                    </div>
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="text-muted-foreground">Status</span>
                      <span>{getStatusBadge(mockOrderDetails.status)}</span>
                    </div>
                    <div className="flex justify-between items-center flex-wrap gap-2">
                      <span className="text-muted-foreground">Payment Status</span>
                      <span>{getStatusBadge(mockOrderDetails.paymentStatus)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="font-medium">Shipping Address</h3>
                <div className="rounded-lg border p-4">
                  <div className="grid gap-2 text-sm">
                    <div>{mockOrderDetails.shippingAddress.name}</div>
                    <div className="break-words">{mockOrderDetails.shippingAddress.address}</div>
                    <div>
                      {mockOrderDetails.shippingAddress.city},{" "}
                      {mockOrderDetails.shippingAddress.state}
                    </div>
                    <div>{mockOrderDetails.shippingAddress.country}</div>
                    <div>{mockOrderDetails.shippingAddress.phone}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="space-y-2">
              <h3 className="font-medium">Order Items</h3>
              <div className="rounded-lg border overflow-hidden">
                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Supplier</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Unit Price</TableHead>
                        <TableHead className="text-right">Total</TableHead>
                        <TableHead>NAFDAC</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockOrderDetails.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell className="max-w-[150px] truncate" title={item.supplier}>
                            {item.supplier}
                          </TableCell>
                          <TableCell className="text-right">{item.quantity}</TableCell>
                          <TableCell className="text-right">₦{item.unitPrice.toLocaleString()}</TableCell>
                          <TableCell className="text-right">₦{item.total.toLocaleString()}</TableCell>
                          <TableCell>
                            {item.nafdacVerified ? (
                              <Badge className="bg-green-100 text-green-800 whitespace-nowrap">
                                Verified
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-amber-600 whitespace-nowrap">
                                Pending
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden divide-y">
                  {mockOrderDetails.items.map((item) => (
                    <div key={item.id} className="p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground truncate max-w-[200px]" title={item.supplier}>
                            {item.supplier}
                          </p>
                        </div>
                        {item.nafdacVerified ? (
                          <Badge className="bg-green-100 text-green-800 whitespace-nowrap">
                            Verified
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-amber-600 whitespace-nowrap">
                            Pending
                          </Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-muted-foreground">Quantity:</span>
                          <span className="ml-2">{item.quantity}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Unit Price:</span>
                          <span className="ml-2">₦{item.unitPrice.toLocaleString()}</span>
                        </div>
                        <div className="col-span-2">
                          <span className="text-muted-foreground">Total:</span>
                          <span className="ml-2 font-medium">₦{item.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="space-y-2">
              <h3 className="font-medium">Payment Details</h3>
              <div className="rounded-lg border p-4">
                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span className="text-muted-foreground">Payment Method</span>
                    <span>{mockOrderDetails.paymentDetails.method}</span>
                  </div>
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span className="text-muted-foreground">Reference</span>
                    <span className="break-all">{mockOrderDetails.paymentDetails.reference}</span>
                  </div>
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span className="text-muted-foreground">Amount</span>
                    <span>₦{mockOrderDetails.paymentDetails.amount.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex flex-col sm:flex-row justify-end gap-2 px-4 sm:px-6 py-4 border-t bg-gray-50">
          <Button variant="outline" onClick={() => setIsOpen(false)} className="w-full sm:w-auto">
            Close
          </Button>
          <Button className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Reorder
          </Button>
          <Button variant="outline" className="w-full sm:w-auto">
            <Download className="mr-2 h-4 w-4" />
            Download Invoice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 