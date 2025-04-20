import { AlertCircle, Package, ShieldCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export default function InventorySummaryWidget() {
  const inventoryItems = [
    {
      id: "P005",
      name: "Azithromycin 250mg",
      stock: 15,
      price: 3500,
      nafdacStatus: "verified",
      lowStock: true,
    },
    {
      id: "P008",
      name: "Insulin Glargine",
      stock: 8,
      price: 7500,
      nafdacStatus: "verified",
      lowStock: true,
    },
    {
      id: "P012",
      name: "Ketoconazole Cream",
      stock: 18,
      price: 2200,
      nafdacStatus: "pending",
      lowStock: true,
    },
  ]

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <CardTitle>Low Stock Items</CardTitle>
        <Badge className="bg-red-500">3 Items</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        {inventoryItems.map((item) => (
          <div key={item.id} className="flex items-center justify-between border-b pb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-md bg-red-100 flex items-center justify-center">
                <Package className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-xs text-gray-500">{item.id}</p>
                <div className="flex items-center mt-1">
                  <span className="text-xs text-red-600 mr-3">Only {item.stock} left</span>
                  {item.nafdacStatus === "verified" ? (
                    <div className="flex items-center">
                      <ShieldCheck className="h-3 w-3 text-green-600 mr-1" />
                      <span className="text-xs text-green-600">Verified</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <AlertCircle className="h-3 w-3 text-amber-600 mr-1" />
                      <span className="text-xs text-amber-600">Pending</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium">₦{item.price.toLocaleString()}</div>
              <Button size="sm" className="mt-1">
                Restock
              </Button>
            </div>
          </div>
        ))}

        <div className="flex justify-end">
          <Button variant="outline" size="sm">
            Manage Inventory
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
