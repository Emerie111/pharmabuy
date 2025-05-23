"use client"

import { useState, useEffect } from "react"
import { Search, ShieldCheck, AlertTriangle, X, Camera, FileUp, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

// Sample counterfeit alerts data
const counterfeitsAlerts = [
  {
    id: "1",
    title: "Fake Antimalarial Medication",
    description: "Counterfeit antimalarial medications have been identified in several markets. These products contain insufficient active ingredients.",
    date: "May 28, 2023",
    regions: "Lagos, Abuja, Port Harcourt"
  },
  {
    id: "2",
    title: "Counterfeit Antibiotics",
    description: "Fake antibiotics with incorrect NAFDAC numbers have been found in circulation.",
    date: "May 25, 2023",
    regions: "Kano, Kaduna"
  },
  {
    id: "3",
    title: "Fake Pain Relievers",
    description: "Counterfeit pain relievers with similar packaging to authentic products have been identified.",
    date: "May 20, 2023",
    regions: "Nationwide"
  }
]

type VerificationStatus = "idle" | "loading" | "verified" | "unverified" | "error"

export default function VerificationCenter() {
  const [nafdacCode, setNafdacCode] = useState("")
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>("idle")
  const [batchCodes, setBatchCodes] = useState("")
  const [batchResults, setBatchResults] = useState<any[] | null>(null)
  const [isScanning, setIsScanning] = useState(false)
  const [verificationResult, setVerificationResult] = useState<any | null>(null)
  const [alerts, setAlerts] = useState<any[]>([])
  const [alertsLoading, setAlertsLoading] = useState(true)
  const [alertsError, setAlertsError] = useState<string | null>(null)
  const [showReportModal, setShowReportModal] = useState(false);
  const [isBatchVerifying, setIsBatchVerifying] = useState(false);

  const handleSingleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nafdacCode.trim()) return

    setVerificationStatus("loading")
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
      if (result.status === 'verified') {
        setVerificationStatus('verified')
      } else {
        setVerificationStatus('unverified')
      }
    } catch (error) {
      setVerificationStatus('unverified')
      setVerificationResult({ status: 'unverified', message: 'An error occurred while verifying the NAFDAC code' })
    }
  }

  const handleBatchVerify = async () => {
    const codesToVerify = batchCodes.split("\\n").map(code => code.trim()).filter(code => code !== "");
    if (codesToVerify.length === 0) {
      setBatchResults([]);
      return;
    }

    setIsBatchVerifying(true);
    setBatchResults(null);

    const resultsPromises = codesToVerify.map(async (code) => {
      try {
        const response = await fetch('/api/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nafdacCode: code }),
        });
        if (!response.ok) {
          let errorMessage = `Failed to verify code ${code}. Status: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorData.error || errorMessage;
          } catch (parseError) {
            // Ignore if error response is not JSON
          }
          return { code, apiResponse: { status: 'error', message: errorMessage } };
        }
        const apiResult = await response.json();
        return { code, apiResponse: apiResult };
      } catch (error) {
        return { code, apiResponse: { status: 'error', message: 'Network error or failed to fetch for this code.' } };
      }
    });

    const settledResults = await Promise.allSettled(resultsPromises);

    const newBatchResults = settledResults.map(result => {
      if (result.status === 'fulfilled') {
        return result.value;
      } else {
        return {
          code: 'Unknown code',
          apiResponse: { status: 'error', message: 'An unexpected error occurred processing this item.' }
        };
      }
    });

    setBatchResults(newBatchResults);
    setIsBatchVerifying(false);
  };

  const toggleScanner = () => {
    setIsScanning(!isScanning)
    // In a real app, this would initialize the camera for barcode scanning
  }

  useEffect(() => {
    setAlertsLoading(true)
    fetch('/api/nafdac-alerts')
      .then(res => res.json())
      .then(data => {
        setAlerts(data.alerts || [])
        setAlertsLoading(false)
      })
      .catch(err => {
        setAlertsError('Failed to load alerts')
        setAlertsLoading(false)
      })
  }, [])

  return (
    <>
      <div className="container mx-auto px-4 py-8">
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
                    <form onSubmit={handleSingleVerification} className="flex flex-col sm:flex-row gap-2">
                      <div className="relative flex-1">
                        <Input
                          placeholder="Enter NAFDAC code (e.g., A4-0123)"
                          value={nafdacCode}
                          onChange={(e) => setNafdacCode(e.target.value)}
                          className="pr-24"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2"
                          onClick={toggleScanner}
                        >
                          <Camera className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button type="submit" disabled={!nafdacCode || verificationStatus === "loading"} className="sm:w-auto">
                        {verificationStatus === "loading" ? (
                          "Verifying..."
                        ) : (
                          <>
                            <Search className="h-4 w-4 mr-2" />
                            Verify
                          </>
                        )}
                      </Button>
                    </form>

                    {isScanning && (
                      <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                        <Camera className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">Camera access required for barcode scanning</p>
                        <Button variant="outline" size="sm" className="mt-2" onClick={toggleScanner}>
                          Cancel Scanning
                        </Button>
                      </div>
                    )}

                    {verificationStatus === "verified" && verificationResult?.product && (
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
                              Rating: {verificationResult.product.rating?.toFixed ? verificationResult.product.rating.toFixed(1) : verificationResult.product.rating}/5.0
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

                    {verificationStatus === "unverified" && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>Product Not Verified</AlertTitle>
                        <AlertDescription>
                          {verificationResult?.message || 'This NAFDAC code could not be verified. The product may be counterfeit or the code may be incorrect.'}
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
                    <div>
                      <Textarea
                        placeholder="Enter NAFDAC codes, one per line..."
                        value={batchCodes}
                        onChange={(e) => setBatchCodes(e.target.value)}
                        rows={8}
                        className="w-full"
                        disabled={isBatchVerifying}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Enter multiple NAFDAC codes, each on a new line.
                      </p>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={handleBatchVerify} disabled={!batchCodes.trim() || isBatchVerifying}>
                        {isBatchVerifying ? (
                          "Verifying All..."
                        ) : (
                          <>
                            <ShieldCheck className="h-4 w-4 mr-2" />
                            Verify All Codes
                          </>
                        )}
                      </Button>
                    </div>

                    {isBatchVerifying && (
                        <div className="text-center p-4">Loading verification results...</div>
                    )}

                    {batchResults && batchResults.length > 0 && !isBatchVerifying && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium mb-2">Verification Results</h3>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>NAFDAC Code</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Product Name</TableHead>
                                <TableHead>Manufacturer</TableHead>
                                <TableHead>NAFDAC Reg. No.</TableHead>
                                <TableHead>Message/Details</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {batchResults.map((result, index) => (
                                <TableRow key={index}>
                                  <TableCell className="font-medium">{result.code}</TableCell>
                                  <TableCell>
                                    {result.apiResponse.status === "verified" ? (
                                      <Badge className="bg-green-500 flex items-center gap-1 w-fit">
                                        <ShieldCheck className="h-3 w-3" />
                                        Verified
                                      </Badge>
                                    ) : result.apiResponse.status === "unverified" ? (
                                      <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                                        <X className="h-3 w-3" />
                                        Unverified
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                                        <AlertTriangle className="h-3 w-3" />
                                        Error
                                      </Badge>
                                    )}
                                  </TableCell>
                                  <TableCell>{result.apiResponse.product?.brandName || result.apiResponse.message || 'N/A'}</TableCell>
                                  <TableCell>{result.apiResponse.product?.manufacturer || 'N/A'}</TableCell>
                                  <TableCell>{result.apiResponse.product?.nafdacNumber || 'N/A'}</TableCell>
                                  <TableCell className="text-xs">
                                    {result.apiResponse.status !== 'verified' && result.apiResponse.message ? 
                                      result.apiResponse.message : 
                                      result.apiResponse.product?.description ? (result.apiResponse.product.description.substring(0,100) + "...") :
                                      (result.apiResponse.status === 'verified' ? 'Product is genuine.' : 'No further details.')}
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>

                        <div className="mt-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div className="text-sm">
                            <span className="font-medium">Summary: </span>
                            {batchResults.filter((r) => r.apiResponse.status === "verified").length} verified,{" "}
                            {batchResults.filter((r) => r.apiResponse.status === "unverified").length} unverified,{" "}
                            {batchResults.filter((r) => r.apiResponse.status === "error").length} errors.
                          </div>
                        </div>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Counterfeit Alerts moved here */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Counterfeit Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {alertsLoading && <div>Loading alerts...</div>}
                  {alertsError && <div className="text-red-600">{alertsError}</div>}
                  {!alertsLoading && !alertsError && alerts.length === 0 && (
                    <div>No recent medication-related alerts found.</div>
                  )}
                  {!alertsLoading && !alertsError && alerts.map((alert, idx) => (
                    <Alert key={alert.link || idx} variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle>
                        <a href={alert.link} target="_blank" rel="noopener noreferrer" className="underline">
                          {alert.title}
                        </a>
                      </AlertTitle>
                      <AlertDescription>
                        {alert.summary}
                      </AlertDescription>
                      <div className="mt-1 text-xs">{alert.date}</div>
                    </Alert>
                  ))}
                  <Button variant="link" className="w-full text-sm" asChild>
                    <a href="https://nafdac.gov.ng/category/press-release/" target="_blank" rel="noopener noreferrer">
                      View All Alerts
                    </a>
                  </Button>
                </div>
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
                <CardTitle>Educational Resources</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="https://nafdac.gov.ng/our-services/pharmacovigilance-post-market-surveillance/mobile-authentication-service-mas/" target="_blank" rel="noopener noreferrer">
                      How to Identify Authentic Medications
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="https://nafdac.gov.ng/our-services/registered-products/" target="_blank" rel="noopener noreferrer">
                      Understanding NAFDAC Registration
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" onClick={() => setShowReportModal(true)}>
                    Reporting Counterfeit Products
                  </Button>
                  <Separator className="my-2" />
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="https://nafdac.gov.ng/" target="_blank" rel="noopener noreferrer">
                      Visit Official NAFDAC Website
                    </a>
                  </Button>
                  <Button variant="default" className="w-full" onClick={() => setShowReportModal(true)}>
                    Report Suspicious Product
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showReportModal} onOpenChange={setShowReportModal}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Report Suspicious or Counterfeit Products</DialogTitle>
            <DialogDescription>
              If you suspect a product is counterfeit or have concerns about its authenticity, please report it to NAFDAC through the following channels:
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            <p>
              <span className="font-semibold">NAFDAC Hotline (Complaints):</span>
              <br />
              <a href="tel:08001623322" className="text-blue-600 hover:underline">0800-1-NAFDAC (0800-1-623322)</a>
            </p>
            <p>
              <span className="font-semibold">Other Phone Lines:</span>
              <br />
              <a href="tel:+2349097630506" className="text-blue-600 hover:underline">+234(0)909-763-0506</a>
              <br />
              <a href="tel:+2349097630507" className="text-blue-600 hover:underline">+234(0)909-763-0507</a>
            </p>
            <p>
              <span className="font-semibold">Email for Substandard/Falsified Product Alerts:</span>
              <br />
              <a href="mailto:sf.alert@nafdac.gov.ng" className="text-blue-600 hover:underline">sf.alert@nafdac.gov.ng</a>
            </p>
            <p>
              <span className="font-semibold">General Complaints/Reforms Email:</span>
              <br />
              <a href="mailto:reforms@nafdac.gov.ng" className="text-blue-600 hover:underline">reforms@nafdac.gov.ng</a>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              You can also visit the nearest NAFDAC office to make a report.
            </p>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowReportModal(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
