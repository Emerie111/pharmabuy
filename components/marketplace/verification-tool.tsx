"use client"

import { useState } from "react"
import { Search, ShieldCheck, AlertTriangle, X, Camera, FileUp, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"

export default function VerificationTool() {
  const [nafdacCode, setNafdacCode] = useState("")
  const [verificationResult, setVerificationResult] = useState<null | "verified" | "unverified">(null)
  const [batchCodes, setBatchCodes] = useState("")
  const [batchResults, setBatchResults] = useState<any[] | null>(null)
  const [isScanning, setIsScanning] = useState(false)

  const handleVerify = () => {
    // In a real app, this would call an API to verify the NAFDAC code
    if (nafdacCode.startsWith("A4-")) {
      setVerificationResult("verified")
    } else {
      setVerificationResult("unverified")
    }
  }

  const handleBatchVerify = () => {
    // In a real app, this would call an API to verify multiple codes
    const codes = batchCodes.split("\n").filter((code) => code.trim() !== "")
    const results = codes.map((code) => ({
      code: code.trim(),
      status: code.trim().startsWith("A4-") ? "verified" : "unverified",
      product: code.trim().startsWith("A4-") ? "Sample Product " + Math.floor(Math.random() * 100) : "Unknown",
      manufacturer: code.trim().startsWith("A4-") ? "Sample Manufacturer" : "Unknown",
      registration: code.trim().startsWith("A4-") ? "NAFDAC-" + Math.floor(Math.random() * 10000) : "Unknown",
      mfgDate: code.trim().startsWith("A4-") ? "2023-01-01" : "Unknown",
      expDate: code.trim().startsWith("A4-") ? "2025-01-01" : "Unknown",
    }))

    setBatchResults(results)
  }

  const toggleScanner = () => {
    setIsScanning(!isScanning)
    // In a real app, this would initialize the camera for barcode scanning
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left Column - Verification Tools */}
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">NAFDAC Verification Center</CardTitle>
            <CardDescription>Verify the authenticity of pharmaceutical products using NAFDAC codes</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="single" className="space-y-4">
              <TabsList className="w-full">
                <TabsTrigger value="single" className="flex-1">Single Verification</TabsTrigger>
                <TabsTrigger value="batch" className="flex-1">Batch Verification</TabsTrigger>
              </TabsList>

              <TabsContent value="single" className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Enter NAFDAC code (e.g., A4-0123)"
                      value={nafdacCode}
                      onChange={(e) => setNafdacCode(e.target.value)}
                      className="pr-24"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                      onClick={toggleScanner}
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button onClick={handleVerify} disabled={!nafdacCode} className="sm:w-auto">
                    <Search className="h-4 w-4 mr-2" />
                    Verify
                  </Button>
                </div>

                {isScanning && (
                  <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                    <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                    <p className="text-sm text-gray-500">Camera access required for barcode scanning</p>
                    <Button variant="outline" size="sm" className="mt-2" onClick={toggleScanner}>
                      Cancel Scanning
                    </Button>
                  </div>
                )}

                {verificationResult === "verified" && (
                  <Alert className="bg-green-50 border-green-200">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Product Verified</AlertTitle>
                    <AlertDescription className="text-green-700">
                      This product has been verified as authentic by NAFDAC.
                    </AlertDescription>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-green-800">Product Details</h4>
                        <p className="text-sm text-green-700">Amoxicillin 500mg</p>
                        <p className="text-xs text-green-600">Capsules, 100 count</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-green-800">Manufacturer</h4>
                        <p className="text-sm text-green-700">PharmaNigeria Ltd</p>
                        <p className="text-xs text-green-600">Lagos, Nigeria</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-green-800">NAFDAC Registration</h4>
                        <p className="text-sm text-green-700">NAFDAC-12345</p>
                        <p className="text-xs text-green-600">Valid until 2025-12-31</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-green-800">Dates</h4>
                        <p className="text-sm text-green-700">Manufactured: 2023-01-01</p>
                        <p className="text-xs text-green-600">Expires: 2025-01-01</p>
                      </div>
                    </div>
                  </Alert>
                )}

                {verificationResult === "unverified" && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Product Not Verified</AlertTitle>
                    <AlertDescription>
                      This NAFDAC code could not be verified. The product may be counterfeit or the code may be
                      incorrect.
                    </AlertDescription>

                    <div className="mt-4">
                      <Button variant="outline" size="sm" className="bg-white">
                        <AlertTriangle className="h-4 w-4 mr-2" />
                        Report Suspicious Product
                      </Button>
                    </div>
                  </Alert>
                )}
              </TabsContent>

              <TabsContent value="batch" className="space-y-4">
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center">
                  <FileUp className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-500 mb-2">Drag and drop your CSV file here or click to browse</p>
                  <p className="text-xs text-gray-400 mb-4">Maximum file size: 5MB. Format: CSV with NAFDAC codes</p>
                  <Button variant="outline" size="sm">
                    Select File
                  </Button>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleBatchVerify} disabled={!batchCodes.trim()}>
                    Verify All Codes
                  </Button>
                </div>

                {batchResults && batchResults.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Verification Results</h3>
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>NAFDAC Code</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Product</TableHead>
                            <TableHead>Manufacturer</TableHead>
                            <TableHead>Registration</TableHead>
                            <TableHead>Dates</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {batchResults.map((result, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">{result.code}</TableCell>
                              <TableCell>
                                {result.status === "verified" ? (
                                  <Badge className="bg-green-500 flex items-center gap-1 w-fit">
                                    <ShieldCheck className="h-3 w-3" />
                                    Verified
                                  </Badge>
                                ) : (
                                  <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                                    <X className="h-3 w-3" />
                                    Unverified
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>{result.product}</TableCell>
                              <TableCell>{result.manufacturer}</TableCell>
                              <TableCell>{result.registration}</TableCell>
                              <TableCell>
                                <div className="text-xs">
                                  <div>Mfg: {result.mfgDate}</div>
                                  <div>Exp: {result.expDate}</div>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="text-sm">
                        <span className="font-medium">Summary: </span>
                        {batchResults.filter((r) => r.status === "verified").length} verified,{" "}
                        {batchResults.filter((r) => r.status === "unverified").length} unverified
                      </div>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Export Results
                      </Button>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Educational Content */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>How to Verify Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-800 text-xs font-bold">1</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Locate the NAFDAC Number</h3>
                  <p className="text-xs text-gray-500">
                    Find the NAFDAC registration number on the product packaging. It usually starts with letters
                    followed by numbers.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-800 text-xs font-bold">2</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Enter the Code</h3>
                  <p className="text-xs text-gray-500">
                    Enter the complete NAFDAC code in the verification tool without spaces or special characters.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-green-800 text-xs font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Check the Results</h3>
                  <p className="text-xs text-gray-500">
                    Verify that the product details match what you have. If there's a mismatch or the code is invalid,
                    report it immediately.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Counterfeit Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Fake Antimalarial Medication</AlertTitle>
                <AlertDescription>
                  Counterfeit antimalarial medications have been identified in several markets. These products contain
                  insufficient active ingredients.
                </AlertDescription>
                <div className="mt-1 text-xs">May 28, 2023</div>
                <div className="mt-1 text-xs text-red-400">Affected Regions: Lagos, Abuja, Port Harcourt</div>
              </Alert>

              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Counterfeit Antibiotics</AlertTitle>
                <AlertDescription>
                  Fake antibiotics with incorrect NAFDAC numbers have been found in circulation.
                </AlertDescription>
                <div className="mt-1 text-xs">May 25, 2023</div>
                <div className="mt-1 text-xs text-red-400">Affected Regions: Kano, Kaduna</div>
              </Alert>

              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Fake Pain Relievers</AlertTitle>
                <AlertDescription>
                  Counterfeit pain relievers with similar packaging to authentic products have been identified.
                </AlertDescription>
                <div className="mt-1 text-xs">May 20, 2023</div>
                <div className="mt-1 text-xs text-red-400">Affected Regions: Nationwide</div>
              </Alert>

              <Button variant="link" className="w-full text-sm">
                View All Alerts
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Educational Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                How to Identify Authentic Medications
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Understanding NAFDAC Registration
              </Button>
              <Button variant="outline" className="w-full justify-start">
                Reporting Counterfeit Products
              </Button>
              <Separator className="my-2" />
              <Button variant="outline" className="w-full justify-start">
                Visit Official NAFDAC Website
              </Button>
              <Button variant="default" className="w-full">
                Report Suspicious Product
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
