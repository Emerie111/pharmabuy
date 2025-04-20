"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Bell,
  ChevronDown,
  FileText,
  HelpCircle,
  Home,
  LogOut,
  Menu,
  Package,
  Search,
  Settings,
  ShieldCheck,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  Truck,
  User,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const pathname = usePathname()

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/dashboard" },
    { icon: Package, label: "Products", href: "/dashboard/products" },
    { icon: ShieldCheck, label: "NAFDAC Verification", href: "/dashboard/verification" },
    { icon: ShoppingBag, label: "Suppliers", href: "/dashboard/suppliers" },
    { icon: ShoppingCart, label: "Orders", href: "/dashboard/orders" },
    { icon: Truck, label: "Shipments", href: "/dashboard/shipments" },
    { icon: FileText, label: "Invoices", href: "/dashboard/invoices" },
    { icon: TrendingUp, label: "Analytics", href: "/dashboard/analytics" },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top Navigation */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="flex h-16 items-center px-4 md:px-6">
          <div className="flex items-center gap-2 mr-4">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-md bg-green-600 flex items-center justify-center">
                          <span className="text-white font-bold text-sm">Rx</span>
                        </div>
                        <h2 className="text-lg font-bold text-green-900">PharmaBuy</h2>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <nav className="flex-1 p-4">
                    <ul className="space-y-2">
                      {navItems.map((item, index) => (
                        <li key={index}>
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700",
                              pathname === item.href && "bg-green-50 text-green-700 font-medium",
                            )}
                            onClick={() => setIsSidebarOpen(false)}
                          >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </nav>
                  <div className="p-4 border-t">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="/placeholder.svg" alt="User" />
                          <AvatarFallback className="bg-green-100 text-green-800">JD</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">John Doe</p>
                          <p className="text-xs text-gray-500">Lagos Pharmacy Ltd</p>
                        </div>
                      </div>
                    </div>
                    <Button variant="ghost" className="w-full justify-start text-red-600">
                      <LogOut className="mr-2 h-5 w-5" />
                      <span>Log out</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
            <div className="h-8 w-8 rounded-md bg-green-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">Rx</span>
            </div>
            <h2 className="text-lg font-bold text-green-900 hidden md:block">PharmaBuy</h2>
          </div>

          <div className="relative w-full max-w-md hidden md:flex mx-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search products, suppliers, NAFDAC codes..."
              className="w-full pl-10 pr-4 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="md:hidden">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-5 w-5" />
            </Button>
          </div>

          <div className="ml-auto flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                    <span className="sr-only">Notifications</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Notifications</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs">
                      3
                    </Badge>
                    <span className="sr-only">Cart</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Cart</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <HelpCircle className="h-5 w-5" />
                    <span className="sr-only">Help</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Help & Support</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" alt="User" />
                    <AvatarFallback className="bg-green-100 text-green-800">JD</AvatarFallback>
                  </Avatar>
                  <span className="hidden md:inline-flex text-sm font-medium">John Doe</span>
                  <ChevronDown className="h-4 w-4 hidden md:inline-flex" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>John Doe</span>
                    <span className="text-xs font-normal text-gray-500">Lagos Pharmacy Ltd</span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {isSearchOpen && (
          <div className="p-2 border-t md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search products, suppliers..."
                className="w-full pl-10 pr-4 py-2 text-sm border rounded-md"
                autoFocus
              />
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className="flex flex-1">
        {/* Sidebar - Desktop Only */}
        <aside className="w-64 border-r bg-white hidden md:block">
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700",
                      pathname === item.href && "bg-green-50 text-green-700 font-medium",
                    )}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-6 border-t">
              <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase">Support</div>
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/dashboard/help"
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700"
                  >
                    <HelpCircle className="h-5 w-5" />
                    <span>Help Center</span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-green-50 hover:text-green-700"
                  >
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </Link>
                </li>
              </ul>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
