import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShieldCheck, Scan, Upload, AlertCircle } from "lucide-react"

export default function NAFDACVerificationPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">NAFDAC Verification</h1>
          <p className="text-gray-500">Verify the authenticity of pharmaceutical products</p>
        </div>
      </div>

      <Tabs defaultValue="single" className="w-full">
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="single">Single Verification</TabsTrigger>
          <TabsTrigger value="batch">Batch Verification</TabsTrigger>
        </TabsList>
        <TabsContent value="single">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <ShieldCheck className="h-5 w-5 mr-2 text-emerald-600" />
                Verify Individual Product
              </CardTitle>
              <CardDescription>Enter the NAFDAC number or scan the barcode to verify a product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Input placeholder="Enter NAFDAC number (e.g., A4-0125)" />
                </div>
                <Button>
                  <ShieldCheck className="h-4 w-4 mr-2" />
                  Verify
                </Button>
              </div>
              <div className="flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-6">
                <div className="text-center">
                  <Scan className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500 mb-2">Scan product barcode</p>
                  <Button variant="outline" size="sm">
                    Open Scanner
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="batch">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Upload className="h-5 w-5 mr-2 text-emerald-600" />
                Batch Verification
              </CardTitle>
              <CardDescription>Upload a CSV file with multiple NAFDAC numbers for bulk verification</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-center border-2 border-dashed border-gray-200 rounded-lg p-8">
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500 mb-2">Drag and drop a CSV file or click to browse</p>
                  <p className="text-xs text-gray-400 mb-3">
                    Maximum file size: 5MB. Format: CSV with NAFDAC numbers in first column.
                  </p>
                  <Button variant="outline" size="sm">
                    Browse Files
                  </Button>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-amber-800 text-sm font-medium">Verification tools will be available here</p>
                  <p className="text-amber-700 text-xs mt-1">
                    This feature is currently in development. Check back soon for full functionality.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
