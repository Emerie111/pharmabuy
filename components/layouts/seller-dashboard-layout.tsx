"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  Home,
  Package,
  ShoppingCart,
  TrendingUp,
  HelpCircle,
  FileCheck,
  DollarSign,
  Store,
  MessageSquare,
  Bell,
  Search,
  User,
  ChevronDown,
  Settings,
  LogOut,
  LogIn,
  UserPlus
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { useAuth } from "@/lib/auth-context"
import { Toaster } from "@/components/ui/toaster"
import { supabase } from "@/lib/supabase"

export default function SellerDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const { user, isLoading, roles, signOut } = useAuth()
  const { isSupplier } = roles
  const [supplierName, setSupplierName] = useState<string>("")
  const [isLoadingSupplier, setIsLoadingSupplier] = useState(false)
  const [supplierLogo, setSupplierLogo] = useState<string | null>(null)

  // Fetch supplier name from the supplier table using email
  useEffect(() => {
    const fetchSupplierData = async () => {
      if (!user || !user.email) return
      
      const normalizedEmail = user.email.toLowerCase()
      
      setIsLoadingSupplier(true)
      try {
        console.log("Fetching supplier data with normalized email:", normalizedEmail)
        
        // Get all suppliers
        const { data: allSuppliers, error: suppliersError } = await supabase
          .from('suppliers')
          .select('name, logo, email')
        
        if (suppliersError) {
          console.error("Error fetching suppliers:", suppliersError)
          throw suppliersError
        }
        
        // Find a supplier with a case-insensitive match
        const matchingSupplier = allSuppliers.find(
          supplier => supplier.email && supplier.email.toLowerCase() === normalizedEmail
        )
        
        if (matchingSupplier) {
          console.log("Found matching supplier:", matchingSupplier)
          setSupplierName(matchingSupplier.name)
          if (matchingSupplier.logo) {
            setSupplierLogo(matchingSupplier.logo)
          }
        } else {
          console.log("No supplier found with email:", normalizedEmail)
        }
      } catch (error) {
        console.error('Error fetching supplier data:', error)
      } finally {
        setIsLoadingSupplier(false)
      }
    }
    
    fetchSupplierData()
  }, [user])

  // Handle sign out
  const handleSignOut = async () => {
    await signOut()
    router.push('/signin')
  }

  // Get supplier initials for avatar
  const getSupplierInitials = () => {
    if (!user) return 'GU' // Guest User
    
    // Prefer company name for initials if available
    if (supplierName) {
      const parts = supplierName.split(' ')
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
      }
      return supplierName.substring(0, 2).toUpperCase()
    }
    
    const name = user.user_metadata?.name || user.email || ''
    if (!name) return 'SU' // Supplier User
    
    // Extract initials from name
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  // Get supplier display name
  const getSupplierName = () => {
    if (!user) return 'Guest'
    return supplierName || user.user_metadata?.name || user.email?.split('@')[0] || 'Supplier'
  }

  const navItems = [
    { icon: Home, label: "Dashboard", href: "/seller-dashboard" },
    { icon: Package, label: "Inventory", href: "/seller-dashboard/inventory" },
    { icon: ShoppingCart, label: "Orders", href: "/seller-dashboard/orders" },
    { icon: TrendingUp, label: "Analytics", href: "/seller-dashboard/analytics" },
    { icon: Store, label: "Marketplace", href: "/seller-dashboard/marketplace" },
    { icon: DollarSign, label: "Finances", href: "/seller-dashboard/finances" },
    { icon: FileCheck, label: "Compliance", href: "/seller-dashboard/compliance" },
    { icon: MessageSquare, label: "Communications", href: "/seller-dashboard/communications" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-20 h-16 border-b bg-white">
        <div className="flex h-full items-center justify-between px-4 md:px-6">
          <div className="flex items-center">
            <Link href="/seller-dashboard" className="flex items-center">
              <div className="h-10 w-10 rounded-md bg-green-600 flex items-center justify-center mr-2">
                <span className="text-white font-bold text-lg">Rx</span>
              </div>
              <span className="text-xl font-bold text-green-600">PharmaBuy</span>
            </Link>
          </div>

          <div className="hidden md:block flex-1 max-w-md mx-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search inventory, orders, customers..." className="pl-9 pr-4 py-2 w-full" />
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

            {isLoading || isLoadingSupplier ? (
              // Show loading state
              <Button variant="ghost" size="sm" disabled className="opacity-50">
                <span className="animate-pulse">Loading...</span>
              </Button>
            ) : user ? (
              // User is authenticated - show profile dropdown
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={supplierLogo || user.user_metadata?.avatar_url || "/placeholder.svg"} alt={supplierName} />
                      <AvatarFallback className="bg-green-100 text-green-800">{getSupplierInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium">{user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}</span>
                      <span className="text-xs text-gray-500">{supplierName}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 hidden md:inline-flex" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span>{user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}</span>
                      <span className="text-xs font-normal text-gray-500">{supplierName}</span>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/seller-dashboard/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/seller-dashboard/settings')}>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // User is not authenticated - show login buttons
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => router.push('/signin')}>
                  <LogIn className="mr-1 h-4 w-4" />
                  <span className="hidden md:inline">Sign In</span>
                </Button>
                <Button size="sm" onClick={() => router.push('/signup')}>
                  <UserPlus className="mr-1 h-4 w-4" />
                  <span className="hidden md:inline">Register</span>
                </Button>
              </div>
            )}
          </div>
        </div>

        {isSearchOpen && (
          <div className="p-2 border-t md:hidden">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search inventory, orders..."
                className="w-full pl-10 pr-4 py-2 text-sm border rounded-md"
                autoFocus
              />
            </div>
          </div>
        )}
      </header>

      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-10 w-64 bg-white border-r hidden md:block pt-16">
        <div className="px-4 py-6">
          <nav className="space-y-1">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium",
                  pathname === item.href
                    ? "bg-emerald-50 text-emerald-600"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900",
                )}
              >
                <item.icon className={cn("h-5 w-5", pathname === item.href ? "text-emerald-600" : "text-gray-400")} />
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-10 pt-6 border-t">
            <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase">SUPPORT</div>
            <Link
              href="/seller-dashboard/help"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            >
              <HelpCircle className="h-5 w-5 text-gray-400" />
              Help Center
            </Link>
          </div>
        </div>
      </div>
      <div className="flex-1 md:ml-64 pt-16">
        <main className="container mx-auto p-4 md:p-6">{children}</main>
      </div>
      
      {/* Add Toaster component for notifications */}
      <Toaster />
    </div>
  )
}
