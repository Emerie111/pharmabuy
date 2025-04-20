"use client"

import type React from "react"

import { useState } from "react"
import { AlertCircle, Check, FileSpreadsheet, ImageIcon, ShieldCheck, Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function BulkOrderModule() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [recognizedItems, setRecognizedItems] = useState<any[]>([
    {
      id: 1,
      name: "Amoxicillin 500mg",
      quantity: 100,
      verified: true,
      nafdacNumber: "A4-0123",
      alternatives: 2,
    },
    {
      id: 2,
      name: "Paracetamol 500mg",
      quantity: 200,
      verified: true,
      nafdacNumber: "A4-5678",
      alternatives: 0,
    },
    {
      id: 3,
      name: "Metformin 850mg",
      quantity: 50,
      verified: false,
      nafdacNumber: "Unverified",
      alternatives: 3,
    },
  ])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
      // In a real app, you would process the file here
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
  }

  const verifiedCount = recognizedItems.filter((item) => item.verified).length
  const totalCount = recognizedItems.length

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Bulk Order</CardTitle>
          <CardDescription>Upload your product list or enter items manually to place a bulk order</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="upload" className="space-y-4">
            <TabsList>
              <TabsTrigger value="upload">Upload File</TabsTrigger>
              <TabsTrigger value="image">Upload Image</TabsTrigger>
              <TabsTrigger value="manual">Manual Entry</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="space-y-4">
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                {!uploadedFile ? (
                  <>
                    <FileSpreadsheet className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">Drag and drop your Excel/CSV file, or click to browse</p>
                    <p className="text-xs text-gray-400 mb-4">Supported formats: XLSX, CSV (Max 5MB)</p>
                    <Input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      accept=".xlsx,.csv"
                      onChange={handleFileUpload}
                    />
                    <Button variant="outline" size="sm" asChild>
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Upload className="h-4 w-4 mr-2" />
                        Select File
                      </label>
                    </Button>
                  </>
                ) : (
                  <div className="flex items-center justify-between bg-green-50 p-3 rounded">
                    <div className="flex items-center">
                      <FileSpreadsheet className="h-6 w-6 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium">{uploadedFile.name}</p>
                        <p className="text-xs text-gray-500">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>

              {uploadedFile && (
                <Alert className="bg-blue-50 border-blue-200">
                  <Check className="h-4 w-4 text-blue-600" />
                  <AlertTitle>File uploaded successfully</AlertTitle>
                  <AlertDescription>
                    We've recognized {totalCount} items in your file. {verifiedCount} items are NAFDAC verified.
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>

            <TabsContent value="image" className="space-y-4">
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-2">Drag and drop an image of your prescription or order list</p>
                <p className="text-xs text-gray-400 mb-4">Supported formats: JPG, PNG, PDF (Max 10MB)</p>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              </div>

              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>OCR Processing</AlertTitle>
                <AlertDescription>
                  Our system will use OCR to recognize text in your image and convert it to an order list.
                </AlertDescription>
              </Alert>
            </TabsContent>

            <TabsContent value="manual" className="space-y-4">
              <Textarea
                placeholder="Enter your product list here. One product per line in the format: Product Name, Quantity, Strength"
                className="min-h-[200px]"
              />

              <div className="text-sm text-gray-500">
                <p className="font-medium mb-1">Example format:</p>
                <pre className="bg-gray-100 p-2 rounded text-xs">
                  Amoxicillin, 100, 500mg{"\n"}
                  Paracetamol, 200, 500mg{"\n"}
                  Metformin, 50, 850mg
                </pre>
              </div>

              <Button>Process List</Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {recognizedItems.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Recognized Items</CardTitle>
              <div className="text-sm text-gray-500">
                {verifiedCount}/{totalCount} NAFDAC Verified
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>NAFDAC Status</TableHead>
                  <TableHead>Alternatives</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recognizedItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell>
                      <Input type="number" value={item.quantity} className="w-20 h-8" min={1} />
                    </TableCell>
                    <TableCell>
                      {item.verified ? (
                        <Badge className="bg-green-500 flex items-center gap-1 w-fit">
                          <ShieldCheck className="h-3 w-3" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-amber-600 border-amber-300 bg-amber-50 flex items-center gap-1 w-fit"
                        >
                          <AlertCircle className="h-3 w-3" />
                          Unverified
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {item.alternatives > 0 ? (
                        <Button variant="link" size="sm" className="h-5 p-0">
                          View {item.alternatives} alternatives
                        </Button>
                      ) : (
                        <span className="text-gray-500 text-sm">None available</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <X className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Remove item</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-between items-center mt-6">
              <Button variant="outline">Add More Items</Button>
              <div className="flex gap-2">
                <Button variant="outline">Save as Template</Button>
                <Button>Add All to Cart</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
