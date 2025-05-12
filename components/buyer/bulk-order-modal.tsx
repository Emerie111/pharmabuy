"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, Image, FileText, Plus, X } from "lucide-react"

export function BulkOrderModal() {
  const [isOpen, setIsOpen] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [manualEntries, setManualEntries] = useState([{ product: "", quantity: "" }])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0])
    }
  }

  const addManualEntry = () => {
    setManualEntries([...manualEntries, { product: "", quantity: "" }])
  }

  const removeManualEntry = (index: number) => {
    setManualEntries(manualEntries.filter((_, i) => i !== index))
  }

  const updateManualEntry = (index: number, field: "product" | "quantity", value: string) => {
    const newEntries = [...manualEntries]
    newEntries[index][field] = value
    setManualEntries(newEntries)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          New Bulk Order
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Bulk Order</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="file">File Upload</TabsTrigger>
            <TabsTrigger value="image">Image Upload</TabsTrigger>
            <TabsTrigger value="manual">Manual Entry</TabsTrigger>
          </TabsList>
          <TabsContent value="file" className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Order File</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileChange}
                  className="flex-1"
                />
                <Button variant="outline" size="icon">
                  <Upload className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Supported formats: CSV, Excel (.xlsx, .xls)
              </p>
            </div>
            {selectedFile && (
              <div className="flex items-center gap-2 rounded-md border p-2">
                <FileText className="h-4 w-4" />
                <span className="flex-1 text-sm">{selectedFile.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="image" className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Order Image</Label>
              <div className="flex items-center gap-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="flex-1"
                />
                <Button variant="outline" size="icon">
                  <Image className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Supported formats: JPG, PNG, PDF
              </p>
            </div>
            {selectedImage && (
              <div className="flex items-center gap-2 rounded-md border p-2">
                <Image className="h-4 w-4" />
                <span className="flex-1 text-sm">{selectedImage.name}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedImage(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </TabsContent>
          <TabsContent value="manual" className="space-y-4">
            <div className="space-y-4">
              {manualEntries.map((entry, index) => (
                <div key={index} className="flex items-end gap-2">
                  <div className="flex-1 space-y-2">
                    <Label>Product</Label>
                    <Input
                      placeholder="Enter product name or code"
                      value={entry.product}
                      onChange={(e) =>
                        updateManualEntry(index, "product", e.target.value)
                      }
                    />
                  </div>
                  <div className="w-32 space-y-2">
                    <Label>Quantity</Label>
                    <Input
                      type="number"
                      placeholder="Qty"
                      value={entry.quantity}
                      onChange={(e) =>
                        updateManualEntry(index, "quantity", e.target.value)
                      }
                    />
                  </div>
                  {index > 0 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeManualEntry(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button
                variant="outline"
                className="w-full"
                onClick={addManualEntry}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Product
              </Button>
            </div>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button>Create Order</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 