"use client";

import { useState, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, AlertCircle, ArrowLeft, Upload } from "lucide-react"; // Added icons
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"; // Added Select component
import { useAuth } from "@/lib/auth-context"; // Updated import path
import { useToast } from "@/hooks/use-toast"; // Import toast for notifications

// Define a type for the branded product data we expect from the API
interface BrandedProduct {
  id: string | number;
  name: string;
  brand_name: string;
  manufacturer: string;
  strength: string;
  dosage_form: string;
  pack_size: string;
  nafdac_number: string;
  image?: string;
  description?: string;
}

// Interface for generic drugs
interface GenericDrug {
  id: string;
  name: string;
  category?: string;
  description?: string;
}

// Interface for new product form
interface NewProductForm {
  brand_name: string;
  manufacturer: string;
  strength: string;
  dosage_form: string;
  pack_size: string;
  nafdac_number: string;
  type: string;
  country_of_origin: string;
  generic_id: string;
  bioequivalence?: number;
  image_file?: File | null;
}

interface SupplierProductForm {
  price: string;
  stock: string;
  location: string;
  min_order: string;
  nafdac_number?: string;
  expiry_date?: string;
}

interface AddProductToInventoryModalProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

// Debounce function
function debounce<F extends (...args: any[]) => any>(func: F, waitFor: number) {
  let timeout: NodeJS.Timeout | null = null;

  const debounced = (...args: Parameters<F>) => {
    if (timeout !== null) {
      clearTimeout(timeout);
      timeout = null;
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };

  return debounced as (...args: Parameters<F>) => ReturnType<F>; 
}

export default function AddProductToInventoryModal({ isOpen, onOpenChange }: AddProductToInventoryModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<BrandedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<BrandedProduct | null>(null);
  
  // New state for add new product flow
  const [isAddingNewProduct, setIsAddingNewProduct] = useState(false);
  const [newProductForm, setNewProductForm] = useState<NewProductForm>({
    brand_name: "",
    manufacturer: "",
    strength: "",
    dosage_form: "",
    pack_size: "",
    nafdac_number: "",
    type: "otc", // Default to OTC
    country_of_origin: "",
    generic_id: "",
    bioequivalence: undefined,
    image_file: null
  });
  
  // State for generic drug search
  const [genericSearchTerm, setGenericSearchTerm] = useState("");
  const [genericResults, setGenericResults] = useState<GenericDrug[]>([]);
  const [isSearchingGeneric, setIsSearchingGeneric] = useState(false);
  const [genericError, setGenericError] = useState<string | null>(null);
  const [selectedGeneric, setSelectedGeneric] = useState<GenericDrug | null>(null);
  const [isAddingNewGeneric, setIsAddingNewGeneric] = useState(false);
  const [newGenericForm, setNewGenericForm] = useState({
    name: "",
    category: "",
    description: "",
    indication: ""
  });

  // Add state for supplier product form
  const [supplierProductForm, setSupplierProductForm] = useState<SupplierProductForm>({
    price: "",
    stock: "",
    location: "",
    min_order: "1", // Default minimum order is 1 pack
    nafdac_number: "",
    expiry_date: ""
  });
  
  // Use auth hook to get supplier information
  const { user, session, isLoading: authLoading, roles, supplierId, refreshSession } = useAuth();
  const { toast } = useToast();

  const fetchProducts = async (term: string) => {
    if (term.length < 2) { // Don't search for very short terms
      setSearchResults([]);
      setIsLoading(false);
      setError(null);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/branded-products/search?searchTerm=${encodeURIComponent(term)}`);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Failed to fetch products: ${response.statusText}`);
      }
      const data: BrandedProduct[] = await response.json();
      setSearchResults(data);
    } catch (e: any) {
      console.error("Search error:", e);
      setError(e.message || "An error occurred while searching.");
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const debouncedFetchProducts = useCallback(debounce(fetchProducts, 300), []);

  useEffect(() => {
    debouncedFetchProducts(searchTerm);
  }, [searchTerm, debouncedFetchProducts]);

  const fetchGenericDrugs = async (term: string) => {
    if (term.length < 2) {
      setGenericResults([]);
      setIsSearchingGeneric(false);
      setGenericError(null);
      return;
    }
    setIsSearchingGeneric(true);
    setGenericError(null);
    try {
      // Will need to create this API endpoint
      const response = await fetch(`/api/generic-drugs/search?searchTerm=${encodeURIComponent(term)}`);
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || `Failed to fetch generic drugs: ${response.statusText}`);
      }
      const data: GenericDrug[] = await response.json();
      setGenericResults(data);
    } catch (e: any) {
      console.error("Generic search error:", e);
      setGenericError(e.message || "An error occurred while searching for generic drugs.");
      setGenericResults([]);
    } finally {
      setIsSearchingGeneric(false);
    }
  };

  const debouncedFetchGenericDrugs = useCallback(debounce(fetchGenericDrugs, 300), []);

  useEffect(() => {
    debouncedFetchGenericDrugs(genericSearchTerm);
  }, [genericSearchTerm, debouncedFetchGenericDrugs]);

  const handleProductSelect = (product: BrandedProduct) => {
    setSelectedProduct(product);
    // Further logic to populate supplier-specific fields will go here in a later phase
    console.log("Selected product:", product);
    // For now, let's clear search and close modal as a placeholder action
    // setSearchTerm("");
    // setSearchResults([]);
    // onOpenChange(false); 
  };

  const handleManualAdd = () => {
    console.log("Proceed to manual add flow for term:", searchTerm);
    // Set the brand name in the new product form from the search term
    setNewProductForm({
      ...newProductForm,
      brand_name: searchTerm
    });
    setIsAddingNewProduct(true);
  };

  const handleNewProductInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewProductForm({
      ...newProductForm,
      [name]: value
    });
  };

  const handleSelectGeneric = (generic: GenericDrug) => {
    setSelectedGeneric(generic);
    setNewProductForm({
      ...newProductForm,
      generic_id: generic.id
    });
    setGenericSearchTerm(generic.name);
    setGenericResults([]);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setNewProductForm({
        ...newProductForm,
        image_file: e.target.files[0]
      });
    }
  };

  const handleCreateNewGeneric = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/generic-drugs/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGenericForm),
      });

      const data = await response.json();
      
      if (!response.ok) {
        if (response.status === 409 && data.existingId) {
          // A generic drug with this name already exists, select it
          setSelectedGeneric({
            id: data.existingId,
            name: newGenericForm.name,
            category: newGenericForm.category,
          });
          setNewProductForm({
            ...newProductForm,
            generic_id: data.existingId,
          });
          setIsAddingNewGeneric(false);
          return;
        }
        throw new Error(data.error || 'Failed to create generic drug');
      }

      // Success! Select the newly created generic
      setSelectedGeneric(data);
      setNewProductForm({
        ...newProductForm,
        generic_id: data.id,
      });
      setIsAddingNewGeneric(false);
    } catch (e: any) {
      setGenericError(e.message || 'An error occurred while creating the generic drug');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNewProduct = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get the current supplier ID (in a real app, this would come from auth context)
      // For now, we'll hardcode a test supplier ID
      const supplierId = "SUPPLIER1"; // TODO: Replace with actual supplier ID from auth
      
      // Create a FormData object to send both text fields and the image file
      const formData = new FormData();
      
      // Add all form fields to the FormData
      formData.append('brand_name', newProductForm.brand_name);
      formData.append('manufacturer', newProductForm.manufacturer);
      formData.append('strength', newProductForm.strength);
      formData.append('dosage_form', newProductForm.dosage_form);
      formData.append('pack_size', newProductForm.pack_size);
      formData.append('nafdac_number', newProductForm.nafdac_number);
      formData.append('type', newProductForm.type);
      formData.append('country_of_origin', newProductForm.country_of_origin);
      formData.append('generic_id', newProductForm.generic_id);
      formData.append('supplier_id', supplierId);
      
      // Add optional fields if they exist
      if (newProductForm.bioequivalence) {
        formData.append('bioequivalence', newProductForm.bioequivalence.toString());
      }
      
      // Add the image file if it exists
      if (newProductForm.image_file) {
        formData.append('image_file', newProductForm.image_file);
      }
      
      // Send the request to create a new branded product
      const response = await fetch('/api/branded-products/create', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create product');
      }
      
      // Success! Now let's set this as the selected product to add to inventory
      const newBrandedProduct: BrandedProduct = {
        id: data.product.id,
        name: data.product.brand_name,
        brand_name: data.product.brand_name,
        manufacturer: data.product.manufacturer,
        strength: data.product.strength,
        dosage_form: data.product.dosage_form,
        pack_size: data.product.pack_size,
        nafdac_number: data.product.nafdac_number,
        image: data.product.image
      };
      
      // Switch to the Add to Inventory view with this new product
      setSelectedProduct(newBrandedProduct);
      setIsAddingNewProduct(false);
      
      // Show a success message
      // Note: In a real app, you might want to use a toast notification
      alert('Product created successfully! Now add your inventory details.');
      
    } catch (e: any) {
      console.error('Error creating product:', e);
      setError(e.message || 'An error occurred while creating the product');
    } finally {
      setIsLoading(false);
    }
  };

  // Back to product search from add new product form
  const backToSearch = () => {
    setIsAddingNewProduct(false);
    setSelectedGeneric(null);
    setGenericSearchTerm("");
    setGenericResults([]);
  };

  // Handle supplier product form input changes
  const handleSupplierProductInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSupplierProductForm({
      ...supplierProductForm,
      [name]: value
    });
  };
  
  // Handle adding product to inventory
  const handleAddToInventory = async () => {
    if (!selectedProduct) return;

    setIsLoading(true); // Set loading early

    // Refresh session and re-check auth status before proceeding
    if (refreshSession) {
      await refreshSession(); 
      // After refreshSession, the user, session, roles, supplierId from useAuth() hook should be updated
    }
    
    // Check auth state AFTER refresh
    // Access the updated values from the useAuth() hook directly
    if (!session || !user) { // Check session and user from the hook
       toast({
        title: "Authentication Error",
        description: "Your session is invalid or has expired. Please log in again.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    if (!roles.isSupplier || !supplierId) { // Check roles and supplierId from the hook
      toast({
        title: "Authorization Error",
        description: "You must be logged in as a supplier to add products.",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    // Basic validation for the form itself
    if (!supplierProductForm.price || !supplierProductForm.stock || !supplierProductForm.location) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required product fields (price, stock, location).",
        variant: "destructive"
      });
      setIsLoading(false);
      return;
    }
    
    try {
      // setError(null); //setError is already called by fetchProducts or similar, ensure it's cleared if needed or rely on try/catch
      
      // Prepare data for API
      // The backend will use session.user.id for supplier_id, so no need to send it in the body.
      const productData = {
        branded_product_id: selectedProduct.id,
        price: parseFloat(supplierProductForm.price),
        stock: parseInt(supplierProductForm.stock),
        location: supplierProductForm.location,
        min_order: parseInt(supplierProductForm.min_order || "1"),
        expiry_date: supplierProductForm.expiry_date || null,
        // custom_nafdac_number: supplierProductForm.nafdac_number || null // This was not in original API call body
      };
      
      const response = await fetch('/api/supplier-products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(productData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to add product to inventory');
      }
      
      // Show success toast
      toast({
        title: "Success!",
        description: "Product added to your inventory.",
        variant: "default"
      });
      
      // Close modal and reset state
      onOpenChange(false);
      
    } catch (e: any) {
      console.error('Error adding product to inventory:', e);
      setError(e.message || 'An error occurred while adding the product to inventory');
      toast({
        title: "Error",
        description: e.message || "Failed to add product to inventory",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      onOpenChange(open);
      if (!open) { // Reset state when modal closes
        setSearchTerm("");
        setSearchResults([]);
        setSelectedProduct(null);
        setIsLoading(false);
        setError(null);
        setIsAddingNewProduct(false);
        setSelectedGeneric(null);
        setGenericSearchTerm("");
      }
    }}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 bg-white z-10 pb-4">
          <DialogTitle>
            {isAddingNewProduct ? "Add New Product" : "Add Product to Inventory"}
          </DialogTitle>
          <DialogDescription>
            {isAddingNewProduct 
              ? "Fill in the details to add a new product to the marketplace." 
              : "Search for an existing product by name. If not found, you can add it as a new product."}
          </DialogDescription>
        </DialogHeader>
        
        {!selectedProduct && !isAddingNewProduct ? (
          <>
            <div className="grid gap-4 py-4">
              <div className="grid items-center gap-1.5">
                <Label htmlFor="product-search">Search Product Name</Label>
                <Input 
                  id="product-search" 
                  placeholder="e.g., Amoxicillin 500mg"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {isLoading && (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-6 w-6 animate-spin text-primary" />
                <span className="ml-2">Searching...</span>
              </div>
            )}

            {error && (
              <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-md">
                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-sm text-red-700">{error}</span>
              </div>
            )}

            {!isLoading && !error && searchTerm.length > 1 && searchResults.length === 0 && (
              <div className="p-4 text-center text-sm text-gray-500">
                No products found matching "{searchTerm}".
                <Button variant="link" onClick={handleManualAdd} className="ml-1">
                  Add it as a new product?
                </Button>
              </div>
            )}

            {!isLoading && searchResults.length > 0 && (
              <div className="mt-2 max-h-[300px] overflow-y-auto border rounded-md">
                <ul className="divide-y">
                  {searchResults.map((product) => (
                    <li 
                      key={product.id}
                      className="p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                      onClick={() => handleProductSelect(product)}
                    >
                      <div>
                        <p className="font-medium">{product.name}</p>
                        {product.description && <p className="text-sm text-gray-500 truncate max-w-md">{product.description}</p>}
                        <div className="flex space-x-2 mt-1 text-xs text-gray-500">
                          <span>{product.manufacturer}</span>
                          <span>•</span>
                          <span>{product.strength}</span>
                          <span>•</span>
                          <span>{product.dosage_form}</span>
                        </div>
                      </div>
                      {product.image && <img src={product.image} alt={product.name} className="h-10 w-10 object-cover rounded ml-2" />}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        ) : isAddingNewProduct ? (
          // New Product Form
          <div className="py-4">
            <Button 
              variant="ghost" 
              onClick={backToSearch} 
              className="mb-4 -ml-2 text-gray-500 flex items-center"
            >
              <ArrowLeft className="mr-1 h-4 w-4" />
              Back to search
            </Button>
            
            <div className="space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-md text-sm">
                <p className="font-medium text-yellow-800">As the first supplier to add this product, you'll be featured prominently when healthcare providers view this medication.</p>
              </div>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label htmlFor="brand_name">Brand Name*</Label>
                  <Input 
                    id="brand_name" 
                    name="brand_name" 
                    value={newProductForm.brand_name} 
                    onChange={handleNewProductInputChange} 
                    required 
                  />
                </div>
                
                <div>
                  <Label htmlFor="manufacturer">Manufacturer*</Label>
                  <Input 
                    id="manufacturer" 
                    name="manufacturer" 
                    value={newProductForm.manufacturer} 
                    onChange={handleNewProductInputChange} 
                    required 
                  />
                </div>
                
                <div>
                  <Label htmlFor="strength">Strength*</Label>
                  <Input 
                    id="strength" 
                    name="strength" 
                    placeholder="e.g., 500mg" 
                    value={newProductForm.strength} 
                    onChange={handleNewProductInputChange} 
                    required 
                  />
                </div>
                
                <div>
                  <Label htmlFor="dosage_form">Dosage Form*</Label>
                  <Input 
                    id="dosage_form" 
                    name="dosage_form" 
                    placeholder="e.g., Tablet, Suspension" 
                    value={newProductForm.dosage_form} 
                    onChange={handleNewProductInputChange} 
                    required 
                  />
                </div>
                
                <div>
                  <Label htmlFor="pack_size">Pack Size*</Label>
                  <Input 
                    id="pack_size" 
                    name="pack_size" 
                    placeholder="e.g., 100 tablets, 250ml" 
                    value={newProductForm.pack_size} 
                    onChange={handleNewProductInputChange} 
                    required 
                  />
                </div>
                
                <div>
                  <Label htmlFor="nafdac_number">NAFDAC Number</Label>
                  <Input 
                    id="nafdac_number" 
                    name="nafdac_number" 
                    value={newProductForm.nafdac_number} 
                    onChange={handleNewProductInputChange} 
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">Type*</Label>
                  <Select 
                    value={newProductForm.type} 
                    onValueChange={(value) => setNewProductForm({...newProductForm, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="otc">Over the Counter (OTC)</SelectItem>
                      <SelectItem value="prescription">Prescription</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="country_of_origin">Country of Origin*</Label>
                  <Input 
                    id="country_of_origin" 
                    name="country_of_origin" 
                    value={newProductForm.country_of_origin} 
                    onChange={handleNewProductInputChange} 
                    required 
                  />
                </div>
                
                <div>
                  <Label htmlFor="bioequivalence">Bioequivalence</Label>
                  <Input 
                    id="bioequivalence" 
                    name="bioequivalence" 
                    type="number" 
                    step="0.01"
                    placeholder="Optional" 
                    value={newProductForm.bioequivalence || ""} 
                    onChange={handleNewProductInputChange} 
                  />
                </div>
                
                <div>
                  <Label htmlFor="image">Product Image</Label>
                  <div className="mt-1 flex items-center">
                    <label 
                      htmlFor="image-upload" 
                      className="cursor-pointer border-2 border-dashed rounded-md px-3 py-2 w-full flex items-center justify-center bg-gray-50 hover:bg-gray-100"
                    >
                      <Upload className="h-5 w-5 mr-2 text-gray-500" />
                      <span className="text-sm text-gray-500">
                        {newProductForm.image_file ? newProductForm.image_file.name : "Upload image (optional)"}
                      </span>
                      <input 
                        id="image-upload" 
                        name="image" 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange} 
                      />
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 border-t pt-4">
                <Label htmlFor="generic_search">Generic Drug*</Label>
                <p className="text-sm text-gray-500 mb-2">Search for the active ingredient/generic drug of this product</p>
                
                <Input 
                  id="generic_search" 
                  value={genericSearchTerm} 
                  onChange={(e) => setGenericSearchTerm(e.target.value)} 
                  placeholder="e.g., Paracetamol, Amoxicillin" 
                  disabled={!!selectedGeneric}
                />
                
                {isSearchingGeneric && (
                  <div className="flex items-center mt-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary mr-2" />
                    <span className="text-sm">Searching...</span>
                  </div>
                )}
                
                {genericError && (
                  <div className="flex items-center mt-2 p-2 bg-red-50 border border-red-200 rounded-md text-sm">
                    <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                    <span className="text-red-700">{genericError}</span>
                  </div>
                )}
                
                {genericResults.length > 0 && !selectedGeneric && (
                  <div className="mt-2 border rounded-md max-h-[200px] overflow-y-auto">
                    <ul className="divide-y">
                      {genericResults.map(generic => (
                        <li 
                          key={generic.id} 
                          className="p-2 hover:bg-gray-50 cursor-pointer"
                          onClick={() => handleSelectGeneric(generic)}
                        >
                          <p className="font-medium">{generic.name}</p>
                          {generic.category && <p className="text-xs text-gray-500">{generic.category}</p>}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {!isSearchingGeneric && genericResults.length === 0 && genericSearchTerm.length > 1 && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-sm">No matching generic drugs found. Would you like to add a new one?</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-1"
                      onClick={() => setIsAddingNewGeneric(true)}
                    >
                      Add New Generic Drug
                    </Button>
                  </div>
                )}
                
                {selectedGeneric && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md flex justify-between items-center">
                    <div>
                      <p className="font-medium">{selectedGeneric.name}</p>
                      {selectedGeneric.category && <p className="text-xs text-gray-500">{selectedGeneric.category}</p>}
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => {
                        setSelectedGeneric(null);
                        setNewProductForm({...newProductForm, generic_id: ""});
                      }}
                    >
                      Change
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter className="sticky bottom-0 bg-white pt-4 mt-6">
              <Button variant="outline" onClick={backToSearch}>Cancel</Button>
              <Button 
                onClick={handleCreateNewProduct}
                disabled={
                  !newProductForm.brand_name || 
                  !newProductForm.manufacturer || 
                  !newProductForm.strength || 
                  !newProductForm.dosage_form || 
                  !newProductForm.pack_size || 
                  !newProductForm.type || 
                  !newProductForm.country_of_origin || 
                  !newProductForm.generic_id
                }
              >
                Create Product & Add to Inventory
              </Button>
            </DialogFooter>
          </div>
        ) : (
          // Supplier-specific details form
          <div className="py-4">
            <div className="bg-gray-50 p-4 rounded-lg mb-6 flex items-start gap-4">
              {selectedProduct?.image && (
                <img 
                  src={selectedProduct.image} 
                  alt={selectedProduct.name} 
                  className="h-20 w-20 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <h3 className="text-lg font-medium">{selectedProduct?.name}</h3>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 text-sm">
                  <div>
                    <span className="text-gray-500">Manufacturer:</span> {selectedProduct?.manufacturer}
                  </div>
                  <div>
                    <span className="text-gray-500">Strength:</span> {selectedProduct?.strength}
                  </div>
                  <div>
                    <span className="text-gray-500">Dosage Form:</span> {selectedProduct?.dosage_form}
                  </div>
                  <div>
                    <span className="text-gray-500">Pack Size:</span> {selectedProduct?.pack_size}
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-500">NAFDAC Number:</span> 
                    {selectedProduct?.nafdac_number ? selectedProduct.nafdac_number : 
                    <span className="text-gray-400 italic">Not registered</span>}
                  </div>
                </div>
              </div>
            </div>
            
            {!authLoading && !roles.isSupplier && (
              <div className="bg-yellow-50 border border-yellow-300 rounded-md p-3 mb-4">
                <p className="text-yellow-800 font-medium">You need to be signed in as a supplier to add products.</p>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="mt-2"
                  onClick={() => window.location.href = "/signin"}
                >
                  Sign In as Supplier
                </Button>
              </div>
            )}
            
            {authLoading && (
              <div className="flex items-center justify-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Checking authentication...</span>
              </div>
            )}
            
            {!authLoading && roles.isSupplier && (
              <>
                <p className="text-sm text-gray-600 mb-4">Please add your specific details for this product:</p>
                <div className="space-y-3">
                  <div>
                    <Label htmlFor="price">Your Price (NGN)*</Label>
                    <Input 
                      id="price" 
                      name="price"
                      type="number" 
                      placeholder="e.g., 12000"
                      value={supplierProductForm.price}
                      onChange={handleSupplierProductInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="stock">Stock Quantity (number of packs)*</Label>
                    <div className="text-xs text-gray-500 mb-1">
                      Standard pack: {selectedProduct?.pack_size}
                    </div>
                    <Input 
                      id="stock" 
                      name="stock"
                      type="number" 
                      placeholder="e.g., 150"
                      value={supplierProductForm.stock}
                      onChange={handleSupplierProductInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="location">Location*</Label>
                    <Input 
                      id="location" 
                      name="location"
                      placeholder="e.g., Lagos Warehouse"
                      value={supplierProductForm.location}
                      onChange={handleSupplierProductInputChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="min_order">Minimum Order (in packs)</Label>
                    <Input 
                      id="min_order" 
                      name="min_order"
                      type="number" 
                      placeholder="Default: 1"
                      value={supplierProductForm.min_order}
                      onChange={handleSupplierProductInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="nafdac_number">NAFDAC Registration No. (if different)</Label>
                    <Input 
                      id="nafdac_number" 
                      name="nafdac_number"
                      placeholder="Optional"
                      value={supplierProductForm.nafdac_number}
                      onChange={handleSupplierProductInputChange}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="expiry_date">Expiry Date*</Label>
                    <Input 
                      id="expiry_date" 
                      name="expiry_date"
                      type="date" 
                      value={supplierProductForm.expiry_date}
                      onChange={handleSupplierProductInputChange}
                      required
                    />
                  </div>
                </div>
                
                <DialogFooter className="sticky bottom-0 bg-white pt-4 mt-4">
              <Button variant="outline" onClick={() => setSelectedProduct(null)}>Back to Search</Button>
                  <Button 
                    onClick={handleAddToInventory}
                    disabled={
                      isLoading || 
                      !supplierProductForm.price || 
                      !supplierProductForm.stock || 
                      !supplierProductForm.location || 
                      !supplierProductForm.expiry_date
                    }
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        Adding...
                      </>
                    ) : (
                      "Add to My Inventory"
                    )}
                  </Button>
            </DialogFooter>
              </>
            )}
          </div>
        )}

        {!selectedProduct && !isAddingNewProduct && (
            <DialogFooter className="sticky bottom-0 bg-white pt-4 mt-4">
                <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                </DialogClose>
                {/* The "Add Product" button here can be dynamic. 
                    If a product is selected, it becomes "Add to My Inventory". 
                    If no product found & user wants to add new, it triggers manual add. 
                    For now, this is mainly for closing the dialog if nothing is done.
                */}
            </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
} 