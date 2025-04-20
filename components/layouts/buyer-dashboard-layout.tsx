"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Bell, Search, User, ChevronDown, Settings, LogOut, Menu, X, ShoppingCart } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { BuyerSidebar } from "@/components/buyer/buyer-sidebar"

export default function BuyerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-20 h-16 border-b bg-white">
        <div className="flex h-full items-center justify-between px-4 md:px-6">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden mr-2"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
            <Link href="/buyer-dashboard" className="flex items-center">
              <div className="h-10 w-10 rounded-md bg-green-600 flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">Rx</span>
              </div>
              <span className="text-xl font-bold text-green-600">PharmaBuy</span>
            </Link>
          </div>

          <div className="hidden md:block flex-1 max-w-md mx-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search products, suppliers, NAFDAC codes..." className="pl-9 pr-4 py-2 w-full" />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-5 w-5" />
            </Button>

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
                    <span className="text-xs font-normal text-gray-500">ABC Pharmacy</span>
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

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/50 md:hidden transition-opacity",
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setIsSidebarOpen(false)}
      />

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-white transform transition-transform md:hidden",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between h-16 border-b px-4">
          <Link href="/buyer-dashboard" className="flex items-center">
            <div className="h-8 w-8 rounded-md bg-green-600 flex items-center justify-center mr-2">
              <span className="text-white font-bold text-sm">Rx</span>
            </div>
            <span className="text-lg font-bold text-green-600">PharmaBuy</span>
          </Link>
          <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <div className="h-[calc(100%-4rem)] overflow-y-auto">
          <BuyerSidebar />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="fixed inset-y-0 left-0 z-10 hidden md:block pt-16">
        <BuyerSidebar />
      </div>

      <div className="flex-1 md:ml-64 pt-16">
        <main className="container mx-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
