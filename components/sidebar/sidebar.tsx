"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShieldCheck,
  Users,
  BarChart2,
  Store,
  DollarSign,
  FileCheck,
  MessageSquare,
  Menu,
  X,
  Search,
  Bell,
  User,
  HeartPulse,
  CreditCard,
  LineChart,
  HelpCircle,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"

type SidebarProps = {
  userRole: "buyer" | "seller"
}

export function Sidebar({ userRole }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  const buyerNavItems = [
    { name: "Dashboard", href: "/buyer-dashboard", icon: LayoutDashboard },
    { name: "Products", href: "/buyer-dashboard/products", icon: Package },
    { name: "NAFDAC Verification", href: "/buyer-dashboard/verification", icon: ShieldCheck },
    { name: "Suppliers", href: "/buyer-dashboard/suppliers", icon: Users },
    { name: "Analytics", href: "/buyer-dashboard/analytics", icon: BarChart2 },
  ]

  const buyerSupportItems = [
    { name: "PharmAssist", href: "/buyer-dashboard/assist", icon: HeartPulse },
    { name: "PharmCredit", href: "/buyer-dashboard/credit", icon: CreditCard },
    { name: "Market Insights", href: "/buyer-dashboard/insights", icon: LineChart },
    { name: "Help Center", href: "/buyer-dashboard/help", icon: HelpCircle },
    { name: "Settings", href: "/buyer-dashboard/settings", icon: Settings },
  ]

  const sellerNavItems = [
    { name: "Dashboard", href: "/seller-dashboard", icon: LayoutDashboard },
    { name: "Inventory", href: "/seller-dashboard/inventory", icon: Package },
    { name: "Orders", href: "/seller-dashboard/orders", icon: MessageSquare },
    { name: "Analytics", href: "/seller-dashboard/analytics", icon: BarChart2 },
    { name: "Marketplace", href: "/seller-dashboard/marketplace", icon: Store },
    { name: "Finances", href: "/seller-dashboard/finances", icon: DollarSign },
    { name: "Compliance", href: "/seller-dashboard/compliance", icon: FileCheck },
    { name: "Communications", href: "/seller-dashboard/communications", icon: MessageSquare },
  ]

  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-10 flex h-16 items-center justify-between border-b bg-white px-4 md:px-6">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="mr-2 md:hidden" onClick={() => setIsOpen(!isOpen)}>
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
          <Link href={userRole === "buyer" ? "/buyer-dashboard" : "/seller-dashboard"} className="flex items-center">
            <span className="text-xl font-bold text-emerald-600">PharmaBuy</span>
          </Link>
        </div>
        <div className="hidden md:flex md:w-1/3 lg:w-1/4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full bg-gray-100 pl-8 focus-visible:ring-emerald-500"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-gray-500">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 z-20 flex h-full flex-col bg-white transition-transform md:static md:z-0 md:h-[calc(100vh-4rem)] md:w-64 md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4 md:hidden">
          <Link href={userRole === "buyer" ? "/buyer-dashboard" : "/seller-dashboard"} className="flex items-center">
            <span className="text-xl font-bold text-emerald-600">PharmaBuy</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6" />
            <span className="sr-only">Close Menu</span>
          </Button>
        </div>
        <div className="flex-1 overflow-auto py-4">
          <nav className="grid gap-1 px-2">
            {/* Main Navigation Items */}
            {userRole === "buyer" ? (
              <>
                {/* Buyer Main Navigation */}
                {buyerNavItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                        isActive
                          ? "bg-emerald-50 text-emerald-600"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
                      )}
                    >
                      <item.icon className={cn("h-5 w-5", isActive ? "text-emerald-600" : "text-gray-400")} />
                      {item.name}
                    </Link>
                  )
                })}

                {/* Support Section */}
                <div className="mt-6 mb-2 px-3">
                  <h3 className="text-xs font-semibold uppercase text-gray-400">Support</h3>
                </div>
                {buyerSupportItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                        isActive
                          ? "bg-emerald-50 text-emerald-600"
                          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
                      )}
                    >
                      <item.icon className={cn("h-5 w-5", isActive ? "text-emerald-600" : "text-gray-400")} />
                      {item.name}
                    </Link>
                  )
                })}
              </>
            ) : (
              // Seller Navigation Items
              sellerNavItems.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                      isActive
                        ? "bg-emerald-50 text-emerald-600"
                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
                    )}
                  >
                    <item.icon className={cn("h-5 w-5", isActive ? "text-emerald-600" : "text-gray-400")} />
                    {item.name}
                  </Link>
                )
              })
            )}
          </nav>
        </div>
        <div className="border-t p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg?height=36&width=36" alt="User" />
              <AvatarFallback>
                <User className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            <div className="grid gap-0.5 text-sm">
              <div className="font-medium">{userRole === "buyer" ? "Pharma Solutions Ltd" : "MediSupply Nigeria"}</div>
              <div className="text-xs text-gray-500">{userRole === "buyer" ? "Buyer Account" : "Seller Account"}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
