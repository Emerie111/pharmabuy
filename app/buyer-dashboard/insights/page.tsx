import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart2, TrendingUp, AlertTriangle, Download, Lock, Crown } from "lucide-react"

export default function MarketInsightsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Market Insights</h1>
          <p className="text-gray-500">Premium pharmaceutical market intelligence</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="lagos">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Region" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="lagos">Lagos</SelectItem>
              <SelectItem value="abuja">Abuja</SelectItem>
              <SelectItem value="kano">Kano</SelectItem>
              <SelectItem value="nationwide">Nationwide</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Card className="border-amber-200 bg-amber-50">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="bg-amber-100 p-2 rounded-full">
              <Crown className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <h3 className="font-medium text-amber-800 mb-1">Premium Market Intelligence</h3>
              <p className="text-amber-700 text-sm mb-3">
                Unlock comprehensive market insights with our premium subscription
              </p>
              <Button className="bg-amber-600 hover:bg-amber-700">Upgrade to Premium</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="price-trends" className="w-full">
        <TabsList>
          <TabsTrigger value="price-trends">Price Trends</TabsTrigger>
          <TabsTrigger value="supply-chain">Supply Chain</TabsTrigger>
          <TabsTrigger value="market-forecast">Market Forecast</TabsTrigger>
          <TabsTrigger value="shortages">Shortages</TabsTrigger>
        </TabsList>

        <TabsContent value="price-trends" className="mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2 text-emerald-600" />
                  Price Index Trends
                </CardTitle>
                <CardDescription>Pharmaceutical price trends over the last 12 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center relative">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-6">
                      <BarChart2 className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500 mb-2">Premium market intelligence coming soon</p>
                      <p className="text-sm text-gray-400">Upgrade to access detailed price trend analysis</p>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500">Premium Feature</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                  Price Volatility
                </CardTitle>
                <CardDescription>Categories with highest price fluctuations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center relative">
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                    <div className="text-center">
                      <Lock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-500">Premium Feature</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="supply-chain" className="mt-4">
          <div className="h-64 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center relative">
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div className="text-center">
                <Lock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500">Premium Feature</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="market-forecast" className="mt-4">
          <div className="h-64 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center relative">
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div className="text-center">
                <Lock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500">Premium Feature</p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="shortages" className="mt-4">
          <div className="h-64 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center relative">
            <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
              <div className="text-center">
                <Lock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p className="text-gray-500">Premium Feature</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
