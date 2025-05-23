"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { fetchAllGenericDrugsWithDetails } from "@/lib/supabase-data-access"
import type { GenericDrug, BrandedProduct } from "@/components/marketplace/product-data"

// Set this to true to enable stock validation
const VALIDATE_STOCK = true

function findBrandAndGeneric(productName: string, allGenerics: GenericDrug[]): { generic: GenericDrug | undefined, brand: BrandedProduct | undefined } {
  for (const generic of allGenerics) {
    for (const brand of generic.brandProducts) {
      // Match by brandName or productName (case-insensitive, loose match)
      if (
        brand.brandName.toLowerCase() === productName.toLowerCase() ||
        brand.brandName.toLowerCase().includes(productName.toLowerCase()) ||
        productName.toLowerCase().includes(brand.brandName.toLowerCase())
      ) {
        return { generic, brand }
      }
    }
  }
  return { generic: undefined, brand: undefined }
}

export default function BulkOrderModule() {
  const [allGenericDrugsData, setAllGenericDrugsData] = useState<GenericDrug[]>([])
  const [isLoadingDrugs, setIsLoadingDrugs] = useState(true)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [recognizedItems, setRecognizedItems] = useState([
    { id: 1, name: "Floximox", quantity: 100 },
    { id: 2, name: "Panadol", quantity: 200 },
    { id: 3, name: "Emmox", quantity: 50 },
  ])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedImage(e.target.files[0])
    }
  }

  useEffect(() => {
    async function loadDrugData() {
      setIsLoadingDrugs(true);
      try {
        const drugs = await fetchAllGenericDrugsWithDetails();
        setAllGenericDrugsData(drugs);
      } catch (error) {
        console.error("Error fetching generic drugs for bulk order module:", error);
        // Optionally, set an error state here to inform the user
      }
      setIsLoadingDrugs(false);
    }
    loadDrugData();
  }, [])

  const removeFile = () => setUploadedFile(null)
  const removeImage = () => setUploadedImage(null)

  // Quantity adjuster logic
  const handleQuantityChange = (index: number, newQuantity: number, maxStock?: number) => {
    setRecognizedItems((prev) => {
      return prev.map((item, i) =>
        i === index
          ? { ...item, quantity: VALIDATE_STOCK && maxStock ? Math.min(Math.max(newQuantity, 1), maxStock) : Math.max(newQuantity, 1) }
          : item
      )
    })
  }

  // For NAFDAC verified count
  const verifiedCount = recognizedItems.filter((item) => {
    const { brand } = findBrandAndGeneric(item.name, allGenericDrugsData)
    return brand?.verified
  }).length
  const totalCount = recognizedItems.length

  if (isLoadingDrugs) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Bulk Order</CardTitle>
          <CardDescription>Loading product data...</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Please wait while we fetch the latest product information.</p>
          {/* Optionally, add a spinner here */}
        </CardContent>
      </Card>
    )
  }

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
                <Input
                  type="file"
                  id="image-upload"
                  className="hidden"
                  accept="image/*,application/pdf"
                  onChange={handleImageUpload}
                />
                <Button variant="outline" size="sm" asChild>
                  <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                  </label>
                </Button>
                {uploadedImage && (
                  <div className="flex items-center justify-between bg-green-50 p-3 rounded mt-4">
                    <div className="flex items-center">
                      <ImageIcon className="h-6 w-6 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm font-medium">{uploadedImage.name}</p>
                        <p className="text-xs text-gray-500">{(uploadedImage.size / 1024).toFixed(2)} KB</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={removeImage}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
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
                  <TableHead>Product (Brand)</TableHead>
                  <TableHead>Generic</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>NAFDAC Status</TableHead>
                  <TableHead>Alternatives</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recognizedItems.map((item, idx) => {
                  const { generic, brand } = findBrandAndGeneric(item.name, allGenericDrugsData)
                  const alternatives = generic?.brandProducts.filter(b => b.id !== brand?.id) || []
                  const maxStock = VALIDATE_STOCK ? brand?.suppliers.reduce((sum, s) => sum + s.stock, 0) : undefined
                  return (
                  <TableRow key={item.id}>
                      <TableCell className="font-medium">
                        {brand ? (
                          <div className="flex items-center gap-2">
                            <img src={brand.image} alt={brand.brandName} className="w-10 h-10 object-cover rounded" />
                            <div>
                              <div>{brand.brandName}</div>
                              <div className="text-xs text-gray-500">{brand.strength} {brand.dosageForm}</div>
                            </div>
                          </div>
                        ) : item.name}
                      </TableCell>
                      <TableCell>{generic ? generic.name : "-"}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                          <Button size="icon" variant="outline" onClick={() => handleQuantityChange(idx, item.quantity - 1, maxStock)}>-</Button>
                          <Input
                            type="number"
                            value={item.quantity}
                            min={1}
                            max={maxStock}
                            onChange={e => handleQuantityChange(idx, Number(e.target.value), maxStock)}
                            className="w-20 h-8"
                          />
                          <Button size="icon" variant="outline" onClick={() => handleQuantityChange(idx, item.quantity + 1, maxStock)}>+</Button>
                          {VALIDATE_STOCK && maxStock !== undefined && (
                            <span className="text-xs text-gray-500 ml-2">/ {maxStock} in stock</span>
                          )}
                        </div>
                    </TableCell>
                    <TableCell>
                        {brand?.verified ? (
                        <Badge className="bg-green-500 flex items-center gap-1 w-fit">
                            <ShieldCheck className="h-3 w-3" /> Verified
                        </Badge>
                      ) : (
                          <Badge variant="outline" className="text-amber-600 border-amber-300 bg-amber-50 flex items-center gap-1 w-fit">
                            <AlertCircle className="h-3 w-3" /> Unverified
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                        {alternatives.length > 0 ? (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                        <Button variant="link" size="sm" className="h-5 p-0">
                                  View {alternatives.length} alternatives
                        </Button>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <div className="space-y-2">
                                  {alternatives.map((alt) => (
                                    <div key={alt.id} className="flex items-center gap-2">
                                      <img src={alt.image} alt={alt.brandName} className="w-8 h-8 object-cover rounded" />
                                      <div>
                                        <div className="font-medium">{alt.brandName}</div>
                                        <div className="text-xs text-gray-500">{alt.strength} {alt.dosageForm}</div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
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
                  )
                })}
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
