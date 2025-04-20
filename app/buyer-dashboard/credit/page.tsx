import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, TrendingUp, Clock, AlertCircle, CheckCircle2, ShieldCheck } from "lucide-react"

export default function PharmCreditPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">PharmCredit</h1>
          <p className="text-gray-500">Manage your pharmaceutical credit profile</p>
        </div>
        <Button>
          <CreditCard className="h-4 w-4 mr-2" />
          Apply for Credit Increase
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <ShieldCheck className="h-5 w-5 mr-2 text-emerald-600" />
              Credit Profile
            </CardTitle>
            <CardDescription>Your PharmCredit score and available credit</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="relative w-40 h-40">
                <div className="w-40 h-40 rounded-full border-8 border-emerald-100 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-emerald-600">720</div>
                    <div className="text-sm text-gray-500">Credit Score</div>
                  </div>
                </div>
                <div className="absolute top-0 left-0 w-40 h-40">
                  <svg width="160" height="160" viewBox="0 0 160 160">
                    <circle
                      cx="80"
                      cy="80"
                      r="70"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="8"
                      strokeDasharray="439.6"
                      strokeDashoffset="110"
                      transform="rotate(-90 80 80)"
                    />
                  </svg>
                </div>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Available Credit</span>
                    <span className="text-sm font-medium">₦2.4M / ₦3.5M</span>
                  </div>
                  <Progress value={68} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Credit Utilization</div>
                    <div className="text-lg font-medium">32%</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-500">Payment History</div>
                    <div className="text-lg font-medium flex items-center">
                      <CheckCircle2 className="h-4 w-4 mr-1 text-emerald-600" />
                      Excellent
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-amber-800 text-sm font-medium">Your PharmCredit profile will appear here</p>
                  <p className="text-amber-700 text-xs mt-1">
                    This feature is currently in development. The data shown is for demonstration purposes only.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-emerald-600" />
              Credit Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm text-gray-500">Credit Limit</span>
              <span className="font-medium">₦3,500,000</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm text-gray-500">Available Credit</span>
              <span className="font-medium">₦2,380,000</span>
            </div>
            <div className="flex justify-between items-center pb-2 border-b">
              <span className="text-sm text-gray-500">Current Balance</span>
              <span className="font-medium">₦1,120,000</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">Next Payment Due</span>
              <span className="font-medium">July 15, 2023</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="history" className="w-full">
        <TabsList>
          <TabsTrigger value="history">Credit History</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="rewards">Rewards</TabsTrigger>
        </TabsList>
        <TabsContent value="history" className="mt-4">
          <div className="h-64 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center p-6">
              <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500 mb-2">Your credit history will appear here</p>
              <p className="text-sm text-gray-400">Track your payment history and credit utilization over time</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="transactions" className="mt-4">
          <div className="h-64 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center p-6">
              <p className="text-gray-500">Your transaction history will appear here</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="rewards" className="mt-4">
          <div className="h-64 border-2 border-dashed border-gray-200 rounded-lg flex items-center justify-center">
            <div className="text-center p-6">
              <p className="text-gray-500">Your PharmCredit rewards will appear here</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
