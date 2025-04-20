"use client"

import { useState } from "react"
import { Search, ShieldCheck, AlertTriangle, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function VerificationTool() {
  const [nafdacCode, setNafdacCode] = useState("")
  const [verificationResult, setVerificationResult] = useState<null | "verified" | "unverified">(null)
  const [batchCodes, setBatchCodes] = useState("")
  const [batchResults, setBatchResults] = useState<any[] | null>(null)

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
    }))

    setBatchResults(results)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>NAFDAC Verification Center</CardTitle>
            <CardDescription>Verify the authenticity of pharmaceutical products using NAFDAC codes</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="single" className="space-y-4">
              <TabsList>
                <TabsTrigger value="single">Single Verification</TabsTrigger>
                <TabsTrigger value="batch">Batch Verification</TabsTrigger>
              </TabsList>

              <TabsContent value="single" className="space-y-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Enter NAFDAC code (e.g., A4-0123)"
                      value={nafdacCode}
                      onChange={(e) => setNafdacCode(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleVerify} disabled={!nafdacCode}>
                    <Search className="h-4 w-4 mr-2" />
                    Verify
                  </Button>
                </div>

                {verificationResult === "verified" && (
                  <Alert className="bg-green-50 border-green-200">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Product Verified</AlertTitle>
                    <AlertDescription className="text-green-700">
                      This product has been verified as authentic by NAFDAC.
                    </AlertDescription>

                    <div className="mt-4 grid grid-cols-2 gap-4">
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
                <Textarea
                  placeholder="Enter multiple NAFDAC codes, one per line"
                  className="min-h-[150px]"
                  value={batchCodes}
                  onChange={(e) => setBatchCodes(e.target.value)}
                />

                <div className="flex justify-end">
                  <Button onClick={handleBatchVerify} disabled={!batchCodes.trim()}>
                    Verify All Codes
                  </Button>
                </div>

                {batchResults && batchResults.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Verification Results</h3>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>NAFDAC Code</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead>Manufacturer</TableHead>
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
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    <div className="mt-4 flex justify-between">
                      <div className="text-sm">
                        <span className="font-medium">Summary: </span>
                        {batchResults.filter((r) => r.status === "verified").length} verified,{" "}
                        {batchResults.filter((r) => r.status === "unverified").length} unverified
                      </div>
                      <Button variant="outline" size="sm">
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

      <div className="space-y-4">
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
              </Alert>

              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Counterfeit Antibiotics</AlertTitle>
                <AlertDescription>
                  Fake antibiotics with incorrect NAFDAC numbers have been found in circulation.
                </AlertDescription>
                <div className="mt-1 text-xs">June 15, 2023</div>
              </Alert>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Alerts
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
