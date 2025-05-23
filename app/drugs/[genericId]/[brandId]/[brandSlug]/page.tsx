"use client"

// Import all needed components for the brand details page
import { useParams } from "next/navigation"
import { ArrowLeft, ShieldCheck, Star, ShoppingCart, AlertCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useEffect, useRef, useState } from "react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { BioequivalenceDetails } from "@/components/marketplace/bioequivalence-details"
import { useCartStore, type CartItem } from "@/components/marketplace/cartStore"
import Link from "next/link"
import { fetchBrandedProductDetails } from "@/lib/supabase-data-access"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import React from "react"

// Identical interface as the parent route
interface BrandedProductPageProps {
  params: {
    genericId: string
    brandId: string
    brandSlug: string
  }
}

// Extended interfaces to match the structure from supabase-data-access.ts
export interface SupplierProduct {
  supplierId: string
  supplierName?: string
  supplierVerified?: boolean
  price: number
  stock: number
  minOrder?: number
  unitOfSale?: string
}

export interface BrandedProduct {
  id: string
  brandName: string
  genericName?: string
  manufacturer?: string
  strength?: string
  dosageForm?: string
  packSize?: string
  nafdacNumber?: string
  countryOfOrigin?: string
  image?: string
  rating?: number
  verified?: boolean
  type?: 'Rx' | 'otc'
  description?: string
  tags?: string[]
  suppliers: SupplierProduct[]
  bioequivalenceData?: any
  genericDrugId?: string
}

export default function BrandedProductPageWithSlug({ params }: BrandedProductPageProps) {
  const suppliersRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<string>("suppliers")
  const [shouldScroll, setShouldScroll] = useState(false)
  
  // Destructure addItem from useCartStore
  const { addItem } = useCartStore()

  // Safely unwrap params
  const routeParams = useParams()
  const safeGenericId = typeof params.genericId === 'string' ? params.genericId : 
                         typeof routeParams.genericId === 'string' ? routeParams.genericId : ''
  const safeBrandId = typeof params.brandId === 'string' ? params.brandId : 
                      typeof routeParams.brandId === 'string' ? routeParams.brandId : ''
  
  const [product, setProduct] = useState<BrandedProduct | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // On mount, set tab based on hash
  useEffect(() => {
    if (window.location.hash === '#suppliers') {
      setActiveTab('suppliers')
      setShouldScroll(true)
    }
  }, [])

  // Scroll when suppliers tab is active and shouldScroll is true
  useEffect(() => {
    if (activeTab === 'suppliers' && shouldScroll && suppliersRef.current) {
      suppliersRef.current.scrollIntoView({ behavior: 'smooth' })
      setShouldScroll(false)
    }
  }, [activeTab, shouldScroll])

  useEffect(() => {
    if (!safeBrandId) {
      setError("No brand ID provided.")
      setIsLoading(false)
      return
    }
    const loadProduct = async () => {
      setIsLoading(true)
      setError(null)
      setProduct(null)
      try {
        // The fetchBrandedProductDetails should return a type compatible with local BrandedProduct
        const fetchedProduct = await fetchBrandedProductDetails(safeBrandId)
        if (!fetchedProduct) {
          setError("Product details not found.")
        } else {
          // Explicitly cast if necessary, but ideally types align
          setProduct(fetchedProduct as BrandedProduct)
        }
      } catch (err) {
        console.error("Failed to fetch product details:", err)
        setError("Could not load product details. Please try again.")
      }
      setIsLoading(false)
    }
    loadProduct()
  }, [safeBrandId])

  const [selectedSupplier, setSelectedSupplier] = useState<SupplierProduct | null>(null)
  const [quantity, setQuantity] = useState(1)

  useEffect(() => {
    if (product && product.suppliers && product.suppliers.length > 0) {
      const initialSupplier = product.suppliers[0]
      setSelectedSupplier(initialSupplier)
      setQuantity(initialSupplier.minOrder || 1)
    } else if (product) {
      setSelectedSupplier(null)
      setQuantity(1)
    }
  }, [product])

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 flex justify-center items-center min-h-[calc(100vh-200px)]">
        <LoadingSpinner />
      </div>
    )
  }

  if (error && !product) {
    return (
      <div className="container mx-auto p-6">
        <Link href={`/drugs/${safeGenericId || ''}`} className="inline-block mb-4 text-blue-600 hover:underline">
          <Button variant="ghost"><ArrowLeft className="h-4 w-4 mr-2" />Back to Generic</Button>
        </Link>
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error Loading Product</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto p-6">
        <Link href={`/drugs/${safeGenericId || ''}`} className="inline-block mb-4 text-blue-600 hover:underline">
            <Button variant="ghost"><ArrowLeft className="h-4 w-4 mr-2" />Back to Generic</Button>
        </Link>
        <Alert variant="default">
            <Info className="h-4 w-4" />
            <AlertTitle>Product Not Found</AlertTitle>
            <AlertDescription>The specific branded product (ID: {safeBrandId}) could not be found or there was an issue loading its details.</AlertDescription>
        </Alert>
      </div>
    )
  }

  // At this point, product is guaranteed to be a BrandedProduct
  const handleAddToCart = () => {
    if (!selectedSupplier) {
      toast({
        title: "No Supplier Selected",
        description: "Please select a supplier before adding to cart.",
        variant: "destructive",
      })
      return
    }
    if (quantity <= 0) {
        toast({
          title: "Invalid Quantity",
          description: "Please enter a quantity greater than zero.",
          variant: "destructive",
        })
        return
    }
    if (quantity > selectedSupplier.stock) {
        toast({
          title: "Insufficient Stock",
          description: `The selected supplier only has ${selectedSupplier.stock} units available.`,
          variant: "destructive",
        })
        return
    }

    // Construct CartItem ensuring all fields are present
    const itemForCart: CartItem = {
      id: `${product.id}_${selectedSupplier.supplierId}`,
      name: product.brandName,
      price: selectedSupplier.price,
      quantity: quantity,
      unit: selectedSupplier.unitOfSale || 'unit',
      supplier: selectedSupplier.supplierName || 'Unknown Supplier',
      verified: selectedSupplier.supplierVerified || false,
      image: product.image || '/placeholder.svg',
      brandId: product.id,
      genericId: product.genericDrugId || safeGenericId || '',
    }
    addItem(itemForCart)
    toast({
        title: "Item Added to Cart",
        description: `${quantity} x ${product.brandName} from ${selectedSupplier.supplierName} added.`,
    })
  }
  
  const handleSupplierChange = (supplierId: string) => {
    const newSupplier = product.suppliers.find(s => s.supplierId === supplierId)
    if (newSupplier) {
      setSelectedSupplier(newSupplier)
      setQuantity(newSupplier.minOrder || 1)
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/product-marketplace" className="hover:text-blue-600 hover:underline">
          Marketplace
        </Link>
        <span className="mx-1.5">/</span>
        <Link href={`/drugs/${product.genericDrugId || safeGenericId || ''}`} className="hover:text-blue-600 hover:underline">
          {product.genericName || product.genericDrugId || safeGenericId || 'Generic'}
        </Link>
        <span className="mx-1.5">/</span>
        <span className="font-medium text-gray-700">{product.brandName}</span>
      </nav>

      <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8 items-start">
        {/* Image Gallery - md:col-span-1 lg:col-span-2 */}
        <Card className="md:col-span-1 lg:col-span-2">
          <CardContent className="p-2 sm:p-4">
            <img 
              src={product.image || "/placeholder.svg?height=400&width=600&text=No+Image"} 
              alt={product.brandName} 
              className="w-full h-auto object-contain rounded-lg aspect-[4/3] bg-gray-50"
            />
          </CardContent>
        </Card>

        {/* Product Details & Purchase Options - md:col-span-2 lg:col-span-3 */}
        <div className="md:col-span-2 lg:col-span-3 space-y-6">
          <div className="space-y-1.5">
            <h1 className="text-2xl sm:text-3xl font-bold leading-tight">{product.brandName}</h1>
            <p className="text-base text-gray-600">
              Generic: <Link href={`/drugs/${product.genericDrugId || safeGenericId || ''}`} className="text-blue-600 hover:underline">{product.genericName || 'N/A'}</Link>
            </p>
            <p className="text-sm text-gray-500">Manufactured by: {product.manufacturer || 'N/A'}</p>
            <div className="flex items-center pt-1">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`h-5 w-5 ${product.rating && product.rating >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                ))}
                <span className="ml-2 text-sm text-gray-600">({product.rating?.toFixed(1) || 'No ratings'})</span>
              </div>
              {product.verified && (
                <Badge variant="outline" className="ml-3 border-green-600 bg-green-50 text-green-700 flex items-center text-xs px-1.5 py-0.5">
                  <ShieldCheck className="h-3.5 w-3.5 mr-1" /> NAFDAC Reg.
                </Badge>
              )}
            </div>
          </div>
          
          <Card className="shadow-sm">
            <CardContent className="p-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
              {[
                { label: "NAFDAC No:", value: product.nafdacNumber },
                { label: "Strength:", value: product.strength },
                { label: "Dosage Form:", value: product.dosageForm },
                { label: "Pack Size:", value: product.packSize },
                { label: "Country:", value: product.countryOfOrigin },
                { label: "Product Type:", value: product.type === 'otc' ? 'Over-the-Counter' : product.type === 'Rx' ? 'Prescription (Rx)' : product.type },
              ].map(detail => detail.value && (
                <div key={detail.label} className="flex justify-between">
                  <span className="text-gray-500">{detail.label}</span>
                  <span className="font-medium text-gray-800 text-right">{detail.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {product.suppliers && product.suppliers.length > 0 ? (
            <Card className="shadow-sm" id="suppliers" ref={suppliersRef}>
              <CardHeader className="pb-3 pt-4 px-4">
                <CardTitle className="text-lg sm:text-xl">Purchase Options</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div>
                  <Label htmlFor="supplier-select" className="text-xs font-medium text-gray-600 mb-1 block">Select Supplier:</Label>
                  <Select 
                    value={selectedSupplier?.supplierId} 
                    onValueChange={handleSupplierChange}
                    name="supplier-select"
                    aria-label="Select a supplier"
                  >
                    <SelectTrigger id="supplier-select">
                      <SelectValue placeholder="Choose a supplier..." />
                    </SelectTrigger>
                    <SelectContent>
                      {product.suppliers.map((supplier) => (
                        <SelectItem key={supplier.supplierId} value={supplier.supplierId}>
                          {supplier.supplierName || `Supplier ID: ${supplier.supplierId}`} ({new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(supplier.price)} / {supplier.unitOfSale || 'unit'})
                          {supplier.supplierVerified && <ShieldCheck className="h-4 w-4 inline-block ml-2 text-green-600" />}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedSupplier && (
                  <div className="p-3 bg-gray-50 rounded-md space-y-3">
                    <div className="flex justify-between items-center">
                        <p className="text-lg font-semibold text-blue-600">
                            {new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(selectedSupplier.price)}
                            <span className="text-xs text-gray-500"> / {selectedSupplier.unitOfSale || 'unit'}</span>
                        </p>
                        {selectedSupplier.supplierVerified && (
                            <Badge variant="secondary" className="text-green-700 bg-green-100 border-green-200">
                                <ShieldCheck className="h-3.5 w-3.5 mr-1.5" /> Verified Supplier
                            </Badge>
                        )}
                    </div>
                     <p className="text-xs text-gray-500">Min. Order: {selectedSupplier.minOrder || 1} {selectedSupplier.unitOfSale || 'unit'}(s)</p>
                     <p className="text-xs text-gray-500">Stock: {selectedSupplier.stock} {selectedSupplier.unitOfSale || 'unit'}(s) available</p>
                    
                    <div className="flex items-center space-x-3 pt-2">
                      <Label htmlFor="quantity" className="text-sm font-medium">Quantity:</Label>
                      <Input 
                        id="quantity"
                        type="number" 
                        value={quantity} 
                        onChange={(e) => {
                            const val = parseInt(e.target.value)
                            if (val > (selectedSupplier.stock || 0) ) {
                                setQuantity(selectedSupplier.stock || 0)
                                toast({ title: "Max quantity reached", description: `Only ${selectedSupplier.stock || 0} in stock.`, variant: "default" })
                            } else if (val < (selectedSupplier.minOrder || 1) && val > 0) {
                                setQuantity(selectedSupplier.minOrder || 1)
                                toast({ title: "Min quantity required", description: `Minimum order is ${selectedSupplier.minOrder || 1}.`, variant: "default" })
                            } else if (val <=0 && e.target.value !== '') { // handle 0 or negative but not empty string
                                setQuantity(selectedSupplier.minOrder || 1)
                            }
                            else {
                                setQuantity(val)
                            }
                        }}
                        min={selectedSupplier.minOrder || 1}
                        max={selectedSupplier.stock}
                        className="w-20 h-9"
                        aria-label="Quantity to purchase"
                      />
                    </div>
                    <Button onClick={handleAddToCart} size="lg" className="w-full mt-3">
                      <ShoppingCart className="h-4 w-4 mr-2" /> Add to Cart
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
             <Card className="shadow-sm">
                <CardContent className="p-4">
                    <div className="flex items-center text-gray-500">
                        <Info className="h-5 w-5 mr-2 text-blue-500"/>
                        <p>No suppliers currently listed for this product.</p>
                    </div>
                </CardContent>
             </Card>
          )}

          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="bioequivalence">Bioequivalence</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="mt-4 p-1">
              <Card className="shadow-sm">
                <CardHeader className="pb-2 pt-3 px-4">
                  <CardTitle className="text-base font-semibold">Product Description</CardTitle>
                </CardHeader>
                <CardContent className="p-4 text-sm text-gray-700 space-y-2">
                  <p>{product.description || "No description available for this product."}</p>
                  {product.tags && product.tags.length > 0 && (
                    <div className="pt-2">
                      <h4 className="text-xs font-semibold mb-1 text-gray-500">TAGS:</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {product.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="bioequivalence" className="mt-4 p-1">
              {product.bioequivalenceData ? (
                <BioequivalenceDetails data={product.bioequivalenceData} />
              ) : (
                <Card className="shadow-sm">
                  <CardContent className="p-6 flex items-center justify-center min-h-[200px]">
                    <div className="text-center text-gray-500">
                      <Info className="h-8 w-8 mx-auto mb-2 text-blue-400" />
                      <p className="font-medium">Bioequivalence Data Not Available</p>
                      <p className="text-xs">Information regarding bioequivalence for this product is currently not provided.</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
} 