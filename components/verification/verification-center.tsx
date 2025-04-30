"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { QrCode, Upload, FileCheck, Search } from "lucide-react"

export default function VerificationCenter() {
  const [serialNumber, setSerialNumber] = useState("")
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<null | {
    isVerified: boolean
    product?: {
      name: string
      manufacturer: string
      batchNumber: string
      expiryDate: string
    }
  }>(null)

  const handleSerialVerification = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!serialNumber.trim()) return
    
    setIsVerifying(true)
    
    // Simulate API call
    setTimeout(() => {
      // Demo result - in a real app, this would come from an API
      if (serialNumber === "ABC123456789") {
        setVerificationResult({
          isVerified: true,
          product: {
            name: "Amoxicillin 500mg",
            manufacturer: "PharmaCorp Ltd",
            batchNumber: "LOT202306",
            expiryDate: "06/2025",
          }
        })
      } else {
        setVerificationResult({
          isVerified: false
        })
      }
      setIsVerifying(false)
    }, 1500)
  }

  return (
    <Tabs defaultValue="serial" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-6">
        <TabsTrigger value="serial" className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          <span>Serial Number</span>
        </TabsTrigger>
        <TabsTrigger value="scanner" className="flex items-center gap-2">
          <QrCode className="h-4 w-4" />
          <span>Barcode Scanner</span>
        </TabsTrigger>
        <TabsTrigger value="image" className="flex items-center gap-2">
          <Upload className="h-4 w-4" />
          <span>Image Upload</span>
        </TabsTrigger>
      </TabsList>
      
      <TabsContent value="serial">
        <Card>
          <CardContent className="space-y-6">
            <form onSubmit={handleSerialVerification} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="serial">Enter Product Serial Number</Label>
                <Input 
                  id="serial"
                  placeholder="e.g. ABC123456789" 
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                />
                <p className="text-sm text-muted-foreground">
                  Enter the serial number printed on the product packaging
                </p>
              </div>
              <Button 
                type="submit" 
                disabled={isVerifying || !serialNumber.trim()}
                className="w-full"
              >
                {isVerifying ? "Verifying..." : "Verify Product"}
              </Button>
            </form>
            
            {verificationResult && (
              <div className="border rounded-lg p-6 space-y-6">
                {verificationResult.isVerified ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-green-600">
                      <FileCheck className="h-5 w-5" />
                      <h3 className="text-lg font-medium">Verification Successful</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      This product has been verified as authentic and registered with the regulatory authorities.
                    </p>
                    <div className="space-y-3">
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Product Name</span>
                        <span>{verificationResult.product?.name}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Manufacturer</span>
                        <span>{verificationResult.product?.manufacturer}</span>
                      </div>
                      <div className="flex justify-between py-2 border-b">
                        <span className="font-medium">Batch Number</span>
                        <span>{verificationResult.product?.batchNumber}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="font-medium">Expiry Date</span>
                        <span>{verificationResult.product?.expiryDate}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-red-600">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                      </svg>
                      <h3 className="text-lg font-medium">Verification Failed</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      We could not verify this product with the provided serial number. This may indicate a counterfeit product or an error in the serial number entry.
                    </p>
                    <div className="bg-red-50 p-4 rounded-md border border-red-200">
                      <p className="text-sm text-red-700">
                        If you have purchased this product, please contact our support team or your local health authority to report a potentially counterfeit product.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="scanner">
        <Card>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
              <QrCode className="h-16 w-16 mx-auto text-muted-foreground" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Scan Product Barcode</h3>
                <p className="text-sm text-muted-foreground">
                  Position the product barcode within the camera view to scan
                </p>
              </div>
              <Button>Enable Camera</Button>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              This feature requires camera access. Make sure to grant permission when prompted by your browser.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="image">
        <Card>
          <CardContent className="space-y-6">
            <div className="border-2 border-dashed rounded-lg p-8 text-center space-y-4">
              <Upload className="h-16 w-16 mx-auto text-muted-foreground" />
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Upload Product Image</h3>
                <p className="text-sm text-muted-foreground">
                  Upload a clear image of the product packaging for verification
                </p>
              </div>
              <Button>Upload Image</Button>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Supported formats: JPG, PNG, HEIF. Maximum file size: 10MB.
            </p>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
} 