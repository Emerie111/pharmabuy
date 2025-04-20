"use client"

import type React from "react"

import { useState } from "react"
import {
  AlertCircle,
  ChevronDown,
  Download,
  Filter,
  Plus,
  ShieldCheck,
  X,
  FileSpreadsheet,
  Upload,
  ImageIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

// Sample inventory data
const inventoryData = [
  {
    id: 1,
    name: 'Amoxicillin 500mg',
    category: 'Antibiotics',
    sku: 'AMX-500-100',
    price: 12500,
    stock: 250,
    nafdacStatus: 'Verified',
    expiryDate: '2025-06-15',
    batchNumber: 'B12345',
    manufacturer: 'PharmaCorp Ltd',
  },
  {
    id: 2,
    name: 'Paracetamol 500mg',
    category: 'Analgesics',
    sku: 'PCM-500-100',
    price: 2500,
    stock: 500,
    nafdacStatus: 'Verified',
    expiryDate: '2025-08-20',
    batchNumber: 'B23456',
    manufacturer: 'MediPharm Inc',
  },
  {
    id: 3,
    name: 'Metformin 850mg',
    category: 'Antidiabetics',
    sku: 'MET-850-60',
    price: 4800,
    stock: 120,
    nafdacStatus: 'Verified',
    expiryDate: '2024-12-10',
    batchNumber: 'B34567',
    manufacturer: 'DiabeCare Ltd',
  },
  {
    id: 4,
    name: 'Lisinopril 10mg',
    category: 'Antihypertensives',
    sku: 'LIS-10-30',
    price: 3600,
    stock: 80,
    nafdacStatus: 'Pending',
    expiryDate: '2025-03-25',
    batchNumber: 'B45678',
    manufacturer: 'CardioHealth Inc',
  },
  {
    id: 5,
    name: 'Omeprazole 20mg',
    category: 'Antacids',
    sku: 'OMP-20-30',
    price: 4200,
    stock: 150,
    nafdacStatus: 'Verified',
    expiryDate: '2025-05-18',
    batchNumber: 'B56789',
    manufacturer: 'GastroMed Ltd',
  },
  {
    id: 6,
    name: 'Ciprofloxacin 500mg',
    category: 'Antibiotics',
    sku: 'CIP-500-10',
    price: 5500,
    stock: 90,
    nafdacStatus: 'Verified',\
    expiryDate: '2024-11-
  },
  {
    id: "P001",
    name: "Amoxicillin 500mg",
    category: "Antibiotics",
    stock: 250,
    price: 2500,
    nafdacStatus: "verified",
    nafdacExpiry: "2025-06-15",
    markup: 25,
  },
  {
    id: "P002",
    name: "Paracetamol 500mg",
    category: "Analgesics",
    stock: 500,
    price: 800,
    nafdacStatus: "verified",
    nafdacExpiry: "2025-08-22",
    markup: 20,
  },
  {
    id: "P003",
    name: "Metformin 850mg",
    category: "Antidiabetic",
    stock: 120,
    price: 1200,
    nafdacStatus: "pending",
    markup: 22,
  },
  {
    id: "P004",
    name: "Lisinopril 10mg",
    category: "Cardiovascular",
    stock: 80,
    price: 1800,
    nafdacStatus: "verified",
    nafdacExpiry: "2024-11-30",
    markup: 30,
  },
  {
    id: "P005",
    name: "Azithromycin 250mg",
    category: "Antibiotics",
    stock: 15,
    price: 3500,
    nafdacStatus: "verified",
    nafdacExpiry: "2025-03-15",
    markup: 28,
  },
]

export default function InventoryManagement() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [fileProcessing, setFileProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState("products")

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
  }

  const toggleProductSelection = (productId: string) => {
    if (selectedProducts.includes(productId)) {
      setSelectedProducts(selectedProducts.filter((id) => id !== productId))
    } else {
      setSelectedProducts([...selectedProducts, productId])
    }
  }

  const selectAllProducts = () => {
    if (selectedProducts.length === inventoryData.length) {
      setSelectedProducts([])
    } else {
      setSelectedProducts(inventoryData.map((product) => product.id))
    }
  }

  const processUploadedFile = () => {
    setFileProcessing(true)
    // Simulate processing delay
    setTimeout(() => {
      setFileProcessing(false)
      setUploadedFile(null)
      // In a real app, this would process the file and update inventory
      alert("File processed successfully!")
    }, 2000)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold">Inventory Management</h2>
          <p className="text-sm text-gray-500">Manage your product inventory and NAFDAC verifications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="upload">Bulk Upload</TabsTrigger>
          <TabsTrigger value="markup">Markup Settings</TabsTrigger>
          <TabsTrigger value="nafdac">NAFDAC Verification</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader className="flex items-center justify-between space-y-0 pb-2">
              <CardTitle>Products</CardTitle>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="ml-auto h-8 data-[state=open]:bg-muted">
                    <span>Actions</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem>
                    <Download className="h-4 w-4 mr-2" />
                    Export CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Product
                  </DropdownMenuItem>
                  <Separator />
                  <DropdownMenuItem>
                    <X className="h-4 w-4 mr-2" />
                    Delete Selected
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardHeader>
            <CardContent>
              <div className="flex items-center py-4">
                <Input placeholder="Filter products..." className="max-w-sm" />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="ml-auto">
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuItem>
                      <Label htmlFor="verified">
                        <Checkbox id="verified" className="mr-2" />
                        Verified
                      </Label>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Label htmlFor="pending">
                        <Checkbox id="pending" className="mr-2" />
                        Pending
                      </Label>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Label htmlFor="expired">
                        <Checkbox id="expired" className="mr-2" />
                        Expired
                      </Label>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[100px]">
                        <Checkbox />
                      </TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>NAFDAC Status</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inventoryData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="w-[100px]">
                          <Checkbox />
                        </TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell>{item.category}</TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell>{item.price}</TableCell>
                        <TableCell>{item.stock}</TableCell>
                        <TableCell>
                          {item.nafdacStatus === "Verified" ? (
                            <div className="flex items-center font-medium">
                              <ShieldCheck className="mr-2 h-4 w-4 text-green-500" />
                              <span>Verified</span>
                            </div>
                          ) : item.nafdacStatus === "Pending" ? (
                            <div className="flex items-center font-medium">
                              <AlertCircle className="mr-2 h-4 w-4 text-amber-500" />
                              <span>Pending</span>
                            </div>
                          ) : (
                            <div className="flex items-center font-medium">
                              <X className="mr-2 h-4 w-4 text-red-500" />
                              <span>Expired</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell>{item.expiryDate}</TableCell>
                        <TableCell className="text-right font-medium">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>View</DropdownMenuItem>
                              <DropdownMenuItem>Edit</DropdownMenuItem>
                              <DropdownMenuItem>Delete</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Upload Inventory</CardTitle>
              <CardDescription>
                Upload your product inventory in bulk using Excel, CSV, or image scanning
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="excel" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="excel">Excel/CSV</TabsTrigger>
                  <TabsTrigger value="image">Image Scanning</TabsTrigger>
                  <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                </TabsList>

                <TabsContent value="excel" className="space-y-4">
                  <div className="border-2 border-dashed rounded-md p-6 text-center">
                    {!uploadedFile ? (
                      <>
                        <FileSpreadsheet className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500 mb-2">
                          Drag and drop your Excel/CSV file, or click to browse
                        </p>
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
                        <div className="mt-4">
                          <Button variant="link" size="sm" className="text-xs">
                            Download Template
                          </Button>
                        </div>
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
                        <Button variant="ghost" size="sm" onClick={removeFile} disabled={fileProcessing}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {uploadedFile && (
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium">Upload Options</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="update-option">Update Existing Products</Label>
                          <Select defaultValue="update">
                            <SelectTrigger id="update-option">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="update">Update if exists</SelectItem>
                              <SelectItem value="skip">Skip if exists</SelectItem>
                              <SelectItem value="duplicate">Create as new</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nafdac-option">NAFDAC Verification</Label>
                          <Select defaultValue="auto">
                            <SelectTrigger id="nafdac-option">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="auto">Auto-verify if possible</SelectItem>
                              <SelectItem value="manual">Manual verification only</SelectItem>
                              <SelectItem value="pending">Mark all as pending</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <Button className="w-full" onClick={processUploadedFile} disabled={fileProcessing}>
                        {fileProcessing ? "Processing..." : "Upload and Process"}
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="image" className="space-y-4">
                  <div className="border-2 border-dashed rounded-md p-6 text-center">
                    <ImageIcon className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">
                      Drag and drop an image of your inventory list or receipt
                    </p>
                    <p className="text-xs text-gray-400 mb-4">Supported formats: JPG, PNG, PDF (Max 10MB)</p>
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Image
                    </Button>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                    <h3 className="text-sm font-medium text-blue-800 mb-2">How OCR Scanning Works</h3>
                    <p className="text-xs text-blue-700">
                      Our OCR technology will scan your image and extract product information. For best results:
                    </p>
                    <ul className="text-xs text-blue-700 list-disc list-inside mt-2 space-y-1">
                      <li>Ensure good lighting and clear image quality</li>
                      <li>Make sure text is clearly visible and not blurry</li>
                      <li>Include product name, quantity, and price in the image</li>
                      <li>You'll be able to review and edit before finalizing</li>
                    </ul>
                  </div>
                </TabsContent>

                <TabsContent value="manual" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="product-name">Product Name</Label>
                      <Input id="product-name" placeholder="e.g., Amoxicillin 500mg" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-category">Category</Label>
                      <Select>
                        <SelectTrigger id="product-category">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="antibiotics">Antibiotics</SelectItem>
                          <SelectItem value="analgesics">Analgesics</SelectItem>
                          <SelectItem value="cardiovascular">Cardiovascular</SelectItem>
                          <SelectItem value="antidiabetic">Antidiabetic</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-stock">Stock Quantity</Label>
                      <Input id="product-stock" type="number" min="0" placeholder="e.g., 100" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-price">Price (₦)</Label>
                      <Input id="product-price" type="number" min="0" placeholder="e.g., 2500" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-nafdac">NAFDAC Number</Label>
                      <Input id="product-nafdac" placeholder="e.g., A4-1234" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="product-markup">Markup (%)</Label>
                      <Input id="product-markup" type="number" min="0" placeholder="e.g., 25" />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <Button variant="outline">Clear</Button>
                    <Button>Add Product</Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="markup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Markup Settings</CardTitle>
              <CardDescription>Configure global and category-specific markup rules</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Global Markup</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="global-markup">Default Markup Percentage</Label>
                    <div className="flex items-center gap-2">
                      <Input id="global-markup" type="number" min="0" defaultValue="25" />
                      <span>%</span>
                    </div>
                    <p className="text-xs text-gray-500">This will be applied to all products without specific rules</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="min-markup">Minimum Markup</Label>
                    <div className="flex items-center gap-2">
                      <Input id="min-markup" type="number" min="0" defaultValue="10" />
                      <span>%</span>
                    </div>
                    <p className="text-xs text-gray-500">Products cannot have markup lower than this value</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">Category-Based Markup Rules</h3>
                  <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Rule
                  </Button>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead>Markup (%)</TableHead>
                        <TableHead>Applied To</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Antibiotics</TableCell>
                        <TableCell>30%</TableCell>
                        <TableCell>25 products</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Active</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm">
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Analgesics</TableCell>
                        <TableCell>20%</TableCell>
                        <TableCell>18 products</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Active</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm">
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Cardiovascular</TableCell>
                        <TableCell>35%</TableCell>
                        <TableCell>12 products</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500">Active</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              Edit
                            </Button>
                            <Button variant="ghost" size="sm">
                              Delete
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Individual Product Adjustments</h3>
                <p className="text-sm text-gray-500">
                  You can set custom markup for individual products from the Products tab by editing each product.
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline">Reset to Defaults</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="nafdac" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>NAFDAC Verification Management</CardTitle>
              <CardDescription>Manage NAFDAC certifications and verification status for your products</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Verified Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-600">85</div>
                    <p className="text-xs text-gray-500">66% of total products</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-amber-600">32</div>
                    <p className="text-xs text-gray-500">25% of total products</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Expiring Soon</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-red-600">11</div>
                    <p className="text-xs text-gray-500">Within next 30 days</p>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-medium">NAFDAC Certificates</h3>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Certificate
                  </Button>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Certificate ID</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Issue Date</TableHead>
                        <TableHead>Expiry Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">NAFDAC-2023-A4-1234</TableCell>
                        <TableCell>Product Registration</TableCell>
                        <TableCell>Jan 15, 2023</TableCell>
                        <TableCell>Jan 15, 2025</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500 flex items-center gap-1 w-fit">
                            <ShieldCheck className="h-3 w-3" />
                            Valid
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                            <Button variant="ghost" size="sm">
                              Renew
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">NAFDAC-2022-B7-5678</TableCell>
                        <TableCell>Import Permit</TableCell>
                        <TableCell>Nov 10, 2022</TableCell>
                        <TableCell>Nov 10, 2023</TableCell>
                        <TableCell>
                          <Badge variant="destructive" className="flex items-center gap-1 w-fit">
                            <X className="h-3 w-3" />
                            Expired
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                            <Button variant="ghost" size="sm">
                              Renew
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">NAFDAC-2023-C2-9012</TableCell>
                        <TableCell>Manufacturing License</TableCell>
                        <TableCell>Mar 22, 2023</TableCell>
                        <TableCell>Mar 22, 2026</TableCell>
                        <TableCell>
                          <Badge className="bg-green-500 flex items-center gap-1 w-fit">
                            <ShieldCheck className="h-3 w-3" />
                            Valid
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm">
                              View
                            </Button>
                            <Button variant="ghost" size="sm">
                              Renew
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Automatic Verification Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="auto-verify" className="flex flex-col space-y-1">
                      <span>Auto-verify products with valid NAFDAC numbers</span>
                      <span className="font-normal text-xs text-gray-500">
                        System will automatically check NAFDAC database for valid numbers
                      </span>
                    </Label>
                    <Switch id="auto-verify" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="expiry-alerts" className="flex flex-col space-y-1">
                      <span>Send expiry alerts</span>
                      <span className="font-normal text-xs text-gray-500">
                        Receive notifications when certificates are about to expire
                      </span>
                    </Label>
                    <Switch id="expiry-alerts" defaultChecked />
                  </div>
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="hide-unverified" className="flex flex-col space-y-1">
                      <span>Hide unverified products from marketplace</span>
                      <span className="font-normal text-xs text-gray-500">
                        Products without valid NAFDAC verification will not be visible to buyers
                      </span>
                    </Label>
                    <Switch id="hide-unverified" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
