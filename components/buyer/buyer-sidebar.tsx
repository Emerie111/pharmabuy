"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Package,
  Building2,
  ShieldCheck,
  ShoppingCart,
  Cross,
  CreditCard,
  BarChart2,
  HelpCircle,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export function BuyerSidebar() {
  const pathname = usePathname()

  const mainNavItems = [
    {
      name: "Dashboard",
      href: "/buyer-dashboard",
      icon: Home,
      exact: true,
    },
    {
      name: "Product Marketplace",
      href: "/buyer-dashboard/products",
      icon: Package,
    },
    {
      name: "Verified Suppliers",
      href: "/buyer-dashboard/suppliers",
      icon: Building2,
    },
    {
      name: "NAFDAC Verification",
      href: "/buyer-dashboard/verification",
      icon: ShieldCheck,
    },
    {
      name: "Order Management",
      href: "/buyer-dashboard/orders",
      icon: ShoppingCart,
      badge: "3",
    },
  ]

  const additionalNavItems = [
    {
      name: "PharmAssist",
      href: "/buyer-dashboard/assist",
      icon: Cross,
    },
    {
      name: "PharmCredit",
      href: "/buyer-dashboard/credit",
      icon: CreditCard,
    },
    {
      name: "Market Insights",
      href: "/buyer-dashboard/insights",
      icon: BarChart2,
      badge: "Premium",
    },
  ]

  const isLinkActive = (href: string, exact = false) => {
    if (exact) {
      return pathname === href
    }
    return pathname === href || pathname?.startsWith(`${href}/`)
  }

  return (
    <div className="flex h-full w-64 flex-col border-r bg-white">
      <div className="flex-1 overflow-auto py-6 px-3">
        <nav className="space-y-1">
          {mainNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isLinkActive(item.href, item.exact)
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={cn("h-5 w-5", isLinkActive(item.href, item.exact) ? "text-emerald-600" : "text-gray-500")}
                />
                {item.name}
              </div>
              {item.badge && (
                <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}

          {additionalNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isLinkActive(item.href)
                  ? "bg-emerald-50 text-emerald-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn("h-5 w-5", isLinkActive(item.href) ? "text-emerald-600" : "text-gray-500")} />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <Badge
                  variant="secondary"
                  className={
                    typeof item.badge === "string" ? "bg-purple-100 text-purple-800" : "bg-emerald-100 text-emerald-800"
                  }
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>
      </div>

      <div className="border-t p-4">
        <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase">SUPPORT</div>
        <Link
          href="/buyer-dashboard/help"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isLinkActive("/buyer-dashboard/help")
              ? "bg-emerald-50 text-emerald-600"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
          )}
        >
          <HelpCircle
            className={cn("h-5 w-5", isLinkActive("/buyer-dashboard/help") ? "text-emerald-600" : "text-gray-500")}
          />
          Help Center
        </Link>
        <Link
          href="/buyer-dashboard/settings"
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isLinkActive("/buyer-dashboard/settings")
              ? "bg-emerald-50 text-emerald-600"
              : "text-gray-700 hover:bg-gray-100 hover:text-gray-900",
          )}
        >
          <Settings
            className={cn("h-5 w-5", isLinkActive("/buyer-dashboard/settings") ? "text-emerald-600" : "text-gray-500")}
          />
          Settings
        </Link>
      </div>
    </div>
  )
}
