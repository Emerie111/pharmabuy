import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Building2, Star } from "lucide-react"

export default function VerifiedSuppliersPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Verified Suppliers</h1>
          <p className="text-gray-500">Connect with trusted pharmaceutical suppliers</p>
        </div>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input placeholder="Search suppliers by name, location, or specialty..." className="pl-9 pr-4" />
            </div>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lagos">Lagos</SelectItem>
                  <SelectItem value="abuja">Abuja</SelectItem>
                  <SelectItem value="kano">Kano</SelectItem>
                  <SelectItem value="ibadan">Ibadan</SelectItem>
                  <SelectItem value="port-harcourt">Port Harcourt</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Specialty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="generics">Generics</SelectItem>
                  <SelectItem value="branded">Branded</SelectItem>
                  <SelectItem value="otc">OTC</SelectItem>
                  <SelectItem value="prescription">Prescription</SelectItem>
                  <SelectItem value="specialty">Specialty</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            <Badge variant="outline" className="bg-gray-100">
              <MapPin className="h-3 w-3 mr-1" /> Lagos
            </Badge>
            <Badge variant="outline" className="bg-gray-100">
              <Star className="h-3 w-3 mr-1" /> Top Rated
            </Badge>
            <Badge variant="outline" className="bg-gray-100">
              <Building2 className="h-3 w-3 mr-1" /> Wholesalers
            </Badge>
          </div>
        </CardContent>
      </Card>

      <div className="h-64 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center p-6">
          <p className="text-gray-500 mb-2">Supplier directory will be displayed here</p>
          <p className="text-sm text-gray-400">Browse verified pharmaceutical suppliers across Nigeria</p>
        </div>
      </div>
    </div>
  )
}
