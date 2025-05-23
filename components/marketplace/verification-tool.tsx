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

interface VerificationResult {
  status: 'verified' | 'unverified'
  product?: {
    brandName: string
    manufacturer: string
    strength: string
    dosageForm: string
    packSize: string
    genericName: string
    category: string
    description: string
    indication: string
    nafdacNumber: string
    countryOfOrigin: string
    type: 'prescription' | 'otc'
    verified: boolean
    rating: number
    bioequivalence: number | 'pending' | 'N/A'
  }
  message?: string
}

export default function VerificationTool() {
  const [nafdacCode, setNafdacCode] = useState("")
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [batchCodes, setBatchCodes] = useState("")
  const [batchResults, setBatchResults] = useState<any[] | null>(null)
  const [isScanning, setIsScanning] = useState(false)

  const handleVerify = async () => {
    if (!nafdacCode.trim()) return
    
    setIsVerifying(true)
    setVerificationResult(null)
    
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nafdacCode: nafdacCode.trim() }),
      })
      
      const result = await response.json()
      setVerificationResult(result)
    } catch (error) {
      console.error('Error verifying NAFDAC code:', error)
      setVerificationResult({
        status: 'unverified',
        message: 'An error occurred while verifying the NAFDAC code'
      })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleBatchVerify = async () => {
    const codes = batchCodes.split("\n").filter((code) => code.trim() !== "")
    const results = []
    
    for (const code of codes) {
      try {
        const response = await fetch('/api/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ nafdacCode: code.trim() }),
        })
        
        const result = await response.json()
        results.push({
          code: code.trim(),
          ...result
        })
      } catch (error) {
        results.push({
          code: code.trim(),
          status: 'error',
          message: 'Error verifying code'
        })
      }
    }
    
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
                  <Button 
                    onClick={handleVerify} 
                    disabled={!nafdacCode || isVerifying} 
                    className="sm:w-auto"
                  >
                    {isVerifying ? (
                      "Verifying..."
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Verify
                      </>
                    )}
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

                {verificationResult?.status === "verified" && verificationResult.product && (
                  <Alert className="bg-green-50 border-green-200">
                    <ShieldCheck className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Product Verified</AlertTitle>
                    <AlertDescription className="text-green-700">
                      This product has been verified as authentic by NAFDAC.
                    </AlertDescription>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-green-800">Product Details</h4>
                        <p className="text-sm text-green-700">{verificationResult.product.brandName}</p>
                        <p className="text-xs text-green-600">
                          {verificationResult.product.strength} {verificationResult.product.dosageForm}
                          {verificationResult.product.packSize && `, ${verificationResult.product.packSize}`}
                        </p>
                        <p className="text-xs text-green-600 mt-1">
                          Generic: {verificationResult.product.genericName}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-green-800">Manufacturer</h4>
                        <p className="text-sm text-green-700">{verificationResult.product.manufacturer}</p>
                        <p className="text-xs text-green-600">{verificationResult.product.countryOfOrigin}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-green-800">NAFDAC Registration</h4>
                        <p className="text-sm text-green-700">{verificationResult.product.nafdacNumber}</p>
                        <p className="text-xs text-green-600">
                          Type: {verificationResult.product.type === 'otc' ? 'Over the Counter' : 'Prescription'}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-green-800">Quality Information</h4>
                        <p className="text-sm text-green-700">
                          Rating: {verificationResult.product.rating.toFixed(1)}/5.0
                        </p>
                        <p className="text-xs text-green-600">
                          Bioequivalence: {
                            typeof verificationResult.product.bioequivalence === 'number' 
                              ? `${verificationResult.product.bioequivalence}%`
                              : verificationResult.product.bioequivalence
                          }
                        </p>
                      </div>
                    </div>

                    {verificationResult.product.description && (
                      <div className="mt-4 pt-4 border-t border-green-200">
                        <h4 className="text-sm font-medium text-green-800 mb-2">Product Information</h4>
                        <p className="text-sm text-green-700">{verificationResult.product.description}</p>
                        {verificationResult.product.indication && (
                          <p className="text-sm text-green-700 mt-2">
                            <span className="font-medium">Indication:</span> {verificationResult.product.indication}
                          </p>
                        )}
                      </div>
                    )}
                  </Alert>
                )}

                {verificationResult?.status === "unverified" && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Product Not Verified</AlertTitle>
                    <AlertDescription>
                      {verificationResult.message || 'This NAFDAC code could not be verified. The product may be counterfeit or the code may be incorrect.'}
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
                <div className="space-y-4">
                  <Textarea
                    placeholder="Enter NAFDAC codes (one per line)"
                    value={batchCodes}
                    onChange={(e) => setBatchCodes(e.target.value)}
                    className="min-h-[200px]"
                  />
                  <div className="flex justify-end">
                    <Button 
                      onClick={handleBatchVerify} 
                      disabled={!batchCodes.trim()}
                    >
                      Verify All Codes
                    </Button>
                  </div>
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
                            <TableHead>Type</TableHead>
                            <TableHead>Details</TableHead>
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
                              <TableCell>
                                {result.product ? (
                                  <>
                                    <p className="font-medium">{result.product.brandName}</p>
                                    <p className="text-xs text-gray-500">{result.product.genericName}</p>
                                  </>
                                ) : (
                                  "Unknown"
                                )}
                              </TableCell>
                              <TableCell>
                                {result.product ? (
                                  <>
                                    <p>{result.product.manufacturer}</p>
                                    <p className="text-xs text-gray-500">{result.product.countryOfOrigin}</p>
                                  </>
                                ) : (
                                  "Unknown"
                                )}
                              </TableCell>
                              <TableCell>
                                {result.product ? (
                                  result.product.type === 'otc' ? 'Over the Counter' : 'Prescription'
                                ) : (
                                  "Unknown"
                                )}
                              </TableCell>
                              <TableCell>
                                {result.product ? (
                                  <>
                                    <p>{result.product.strength} {result.product.dosageForm}</p>
                                    <p className="text-xs text-gray-500">{result.product.packSize}</p>
                                  </>
                                ) : (
                                  "Unknown"
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Right Column - Instructions */}
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
                  <h3 className="text-sm font-medium">Verify Authenticity</h3>
                  <p className="text-xs text-gray-500">
                    Click verify to check if the product is registered with NAFDAC and view detailed product information.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Why Verify?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <ShieldCheck className="h-5 w-5 text-green-600 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium">Ensure Product Safety</h3>
                  <p className="text-xs text-gray-500">
                    Verify that your medication is registered with NAFDAC and meets safety standards.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium">Avoid Counterfeits</h3>
                  <p className="text-xs text-gray-500">
                    Protect yourself from counterfeit or unregistered products that may be harmful.
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Search className="h-5 w-5 text-blue-600 flex-shrink-0" />
                <div>
                  <h3 className="text-sm font-medium">Get Product Details</h3>
                  <p className="text-xs text-gray-500">
                    Access comprehensive information about the product, including manufacturer details and quality ratings.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
