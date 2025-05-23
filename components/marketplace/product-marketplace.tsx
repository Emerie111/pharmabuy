"use client"

import { useState, useEffect, useMemo, useCallback } from "react"
import { Search, Grid3X3, List, Filter, AlertCircle, X, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import GenericProductCard from "./generic-product-card"
import { FilterSheet, type FilterOption, type FilterSection } from "./filter-sheet"
import { ActiveFilters } from "./active-filters"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import type { GenericDrug, BrandedProduct, SupplierProduct } from "./product-data"
import { fetchAllGenericDrugsWithDetails, searchProductsAcrossDatabase } from "@/lib/supabase-data-access"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { useToast } from "@/components/ui/use-toast"

// Initial static filter sections (categories will be populated dynamically)
const initialFilterSections: FilterSection[] = [
  // Categories section will be populated dynamically
  {
    id: "verification",
    title: "Brand Verification",
    options: [
      { id: "has-verified-brands", label: "Has NAFDAC Verified Brands", count: 0 },
      { id: "all-brands-verified", label: "All Brands NAFDAC Verified", count: 0 },
    ],
  },
  {
    id: "bioequivalence",
    title: "Bioequivalence Rating",
    options: [
      { id: "be-90-plus", label: "90% or higher", count: 0 },
      { id: "be-80-89", label: "80-89%", count: 0 },
      // { id: "be-below-80", label: "Below 80%", count: 0 }, // Example: can be added if data supports
      { id: "be-pending", label: "Pending / N/A", count: 0 },
    ],
  },
  {
    id: "product-type",
    title: "Product Type",
    options: [
        { id: "type-prescription", label: "Prescription (Rx)", count: 0},
        { id: "type-otc", label: "Over-the-Counter (OTC)", count: 0},
    ]
  }
]

// Quick filter options - can be a subset of dynamic categories or other specific filters
const quickFilters: { id: string; label: string }[] = [
  { id: "has-verified-brands", label: "Verified Brands" },
  { id: "type-otc", label: "OTC Drugs" },
  // Categories can be added here dynamically too if needed, or link to main category filters
]

// Debounce function to limit how often a function is called
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)
  
  useEffect(() => {
    // Set debouncedValue to value after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    // Cancel the timeout if value changes or unmounts
    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])
  
  return debouncedValue
}

export default function ProductMarketplace() {
  const { toast } = useToast()
  const [allDrugs, setAllDrugs] = useState<GenericDrug[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchingForNoLocalResults, setSearchingForNoLocalResults] = useState(false)

  const [searchQuery, setSearchQuery] = useState("")
  // Create a debounced version of the search query
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  
  const [selectedSort, setSelectedSort] = useState("relevance")
  const [showBanner, setShowBanner] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false)
  
  // New state for supplier toggle
  const [showWithSuppliersOnly, setShowWithSuppliersOnly] = useState(false)
  
  const [dynamicFilterSections, setDynamicFilterSections] = useState<FilterSection[]>(initialFilterSections)
  const [autoSearchPerformed, setAutoSearchPerformed] = useState(false)

  // Add a new state for tracking background searches
  const [isBackgroundSearching, setIsBackgroundSearching] = useState(false)

  // Load products when component mounts or when supplier toggle changes
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const drugs = await fetchAllGenericDrugsWithDetails({ 
          showWithSuppliersOnly: showWithSuppliersOnly 
        })
        setAllDrugs(drugs)

        // Dynamically generate categories for filters
        const categories = new Set<string>()
        drugs.forEach(drug => {
          if (drug.category) { // Ensure category is not null or undefined
            categories.add(drug.category)
          }
        })
        
        const categoryFilterOptions: FilterOption[] = Array.from(categories).sort().map(cat => ({
          id: `category-${cat.toLowerCase().replace(/ /g, "-")}`, // Create a slug-like ID
          label: cat.charAt(0).toUpperCase() + cat.slice(1), // Capitalize first letter
          count: drugs.filter(d => d.category === cat).length // Calculate count
        }))

        // Create a new categories section
        const categoriesSection: FilterSection = {
          id: "categories",
          title: "Categories",
          options: categoryFilterOptions,
        }
        
        // Update filter sections state
        setDynamicFilterSections(prevSections => {
          const existingCategoriesIndex = prevSections.findIndex(s => s.id === "categories")
          if (existingCategoriesIndex !== -1) {
            // Replace existing categories section
            const updatedSections = [...prevSections]
            updatedSections[existingCategoriesIndex] = categoriesSection
            return updatedSections
          } else {
            // Add new categories section (e.g., at the beginning)
            return [categoriesSection, ...prevSections]
          }
        })

      } catch (err) {
        console.error("Failed to fetch products:", err)
        setError("Failed to load products. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }
    loadData()
  }, [showWithSuppliersOnly]) // Re-run when showWithSuppliersOnly changes

  // Handle database search
  const performDatabaseSearch = useCallback(async (query: string) => {
    if (!query.trim()) return
    
    setIsSearching(true)
    setError(null)
    
    try {
      // Get active category filters
      const activeCategories = activeFilters
        .filter(id => id.startsWith('category-'))
        .map(id => id.replace('category-', '').replace(/-/g, ' '))
      
      // Determine if we should filter for verified brands only
      const verifiedFilter = activeFilters.includes('all-brands-verified')
      
      console.log(`--- AUTO SEARCH --- Searching database for: "${query}"`)
      
      // Perform search across all products in the database
      const searchResults = await searchProductsAcrossDatabase(query, {
        showWithSuppliersOnly: showWithSuppliersOnly,
        categories: activeCategories.length > 0 ? activeCategories : undefined,
        brandVerified: verifiedFilter,
        limit: 500
      })
      
      // Update the displayed drugs with search results
      setAllDrugs(searchResults)
      setAutoSearchPerformed(true)
      
      console.log(`--- AUTO SEARCH --- Found ${searchResults.length} results`)
      
      // Only show toast for manual searches
    } catch (err) {
      console.error("--- AUTO SEARCH --- Error:", err)
      // Don't set error for auto-searches to avoid disrupting the user
    } finally {
      setIsSearching(false)
    }
  }, [activeFilters, showWithSuppliersOnly])

  // Modify the useEffect hook that handles debounced search
  useEffect(() => {
    // Only perform filtering on local data with at least 2 characters
    if (debouncedSearchQuery && debouncedSearchQuery.length >= 2) {
      // Reset the auto-search flag - we only want local results initially
      setAutoSearchPerformed(false);
      
      // Reset loading flags
      setIsSearching(false);
      setSearchingForNoLocalResults(false);
      setIsBackgroundSearching(false);
    } else {
      // Reset flags when query is cleared
      setAutoSearchPerformed(false);
      setSearchingForNoLocalResults(false);
      setIsBackgroundSearching(false);
    }
  }, [debouncedSearchQuery]);

  // Add a new function for explicit database search
  const handleDatabaseSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setError(null);
    
    // Get active category filters
    const activeCategories = activeFilters
      .filter(id => id.startsWith('category-'))
      .map(id => id.replace('category-', '').replace(/-/g, ' '));
    
    // Determine if we should filter for verified brands only
    const verifiedFilter = activeFilters.includes('all-brands-verified');
    
    // Perform search across all products in the database
    performDatabaseSearch(searchQuery)
      .then(() => {
        // Mark that we performed a database search
        setAutoSearchPerformed(true);
      })
      .catch(err => {
        console.error("Error during database search:", err);
        setError("Failed to search the database. Please try again.");
      })
      .finally(() => {
        setIsSearching(false);
      });
  };

  // Add a component to render the database search button
  const renderDatabaseSearchButton = () => {
    // Only show if we have a search query, local results, and haven't done a DB search yet
    if (searchQuery && searchQuery.length >= 2 && !autoSearchPerformed) {
      return (
        <div className="mb-4 mt-2">
          <Button 
            variant="outline"
            size="sm"
            onClick={handleDatabaseSearch}
            className="flex items-center"
            disabled={isSearching}
          >
            {isSearching ? (
              <>
                <LoadingSpinner className="mr-2 h-3 w-3" />
                <span>Searching database...</span>
              </>
            ) : (
              <>
                <Search className="mr-2 h-3 w-3" />
                <span>Search entire database</span>
              </>
            )}
          </Button>
          <p className="text-xs text-gray-500 mt-1">
            Not finding what you're looking for? Search the complete database.
          </p>
        </div>
      );
    }
    return null;
  };

  // Handle manual search (when user clicks the search button)
  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!searchQuery.trim()) {
      return;
    }
    
    setIsSearching(true);
    setError(null);
    
    try {
      console.log(`--- MANUAL SEARCH --- Starting search for: "${searchQuery}"`);
      
      // Manual search should always check the database
      await performDatabaseSearch(searchQuery);
      
      // Mark that we've performed the search
      setAutoSearchPerformed(true);
    } catch (err) {
      console.error("--- MANUAL SEARCH --- Error:", err);
      setError("Failed to search products. Please try again.");
      
      toast({
        title: "Search error",
        description: "There was a problem with your search. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSearching(false);
    }
  }

  const handleFilterChange = (filterId: string) => {
    setActiveFilters((current) =>
      current.includes(filterId)
        ? current.filter((id) => id !== filterId)
        : [...current, filterId]
    )
  }

  const handleClearFilters = () => {
    setActiveFilters([])
  }

  const activeFilterObjects = useMemo(() => {
    return activeFilters.map((id) => {
      const option = dynamicFilterSections
        .flatMap((section) => section.options)
        .find((opt: FilterOption) => opt.id === id)
      return option ? { id, label: option.label } : null
    }).filter((filter): filter is { id: string; label: string } => filter !== null)
  }, [activeFilters, dynamicFilterSections])

  // Local filtering for already loaded drugs that don't require a new search
  const filteredDrugs = useMemo(() => {
    if (!allDrugs) return []
    
    // When auto-search has been performed, just return all drugs without filtering
    if (searchQuery.trim() && autoSearchPerformed) {
      return allDrugs
    }
    
    // Only apply local filtering when not searching or when auto-search hasn't been triggered
    return allDrugs.filter((drug: GenericDrug) => {
      // Only apply text matching if there's a search query
      const matchesSearch = searchQuery.trim() === '' || (
        drug.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (drug.description && drug.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (drug.indication && drug.indication.toLowerCase().includes(searchQuery.toLowerCase())) ||
        drug.brandProducts.some((brand: BrandedProduct) =>
          brand.brandName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (brand.manufacturer && brand.manufacturer.toLowerCase().includes(searchQuery.toLowerCase()))
        )
      )

      const matchesFilters =
        activeFilters.length === 0 ||
        activeFilters.every((filterId) => {
          if (filterId.startsWith("category-")) {
            // Ensure drug.category is defined and matches
            return drug.category?.toLowerCase().replace(/ /g, "-") === filterId.replace("category-", "")
          }
          if (filterId === "has-verified-brands") {
            return drug.brandProducts.some((brand: BrandedProduct) => brand.verified)
          }
          if (filterId === "all-brands-verified") {
            // Check if there's at least one brand, and all of them are verified
            return drug.brandProducts.length > 0 && drug.brandProducts.every((brand: BrandedProduct) => brand.verified)
          }
          if (filterId === "be-90-plus") {
            return drug.brandProducts.some((brand: BrandedProduct) =>
              typeof brand.bioequivalence === 'number' && brand.bioequivalence >= 90
            )
          }
          if (filterId === "be-80-89") {
            return drug.brandProducts.some((brand: BrandedProduct) =>
              typeof brand.bioequivalence === 'number' &&
              brand.bioequivalence >= 80 &&
              brand.bioequivalence < 90
            )
          }
          if (filterId === "be-pending") {
            return drug.brandProducts.some((brand: BrandedProduct) => brand.bioequivalence === 'pending' || brand.bioequivalence === 'N/A')
          }
          if (filterId === "type-prescription") {
            return drug.brandProducts.some((brand: BrandedProduct) => brand.type === "prescription")
          }
          if (filterId === "type-otc") {
            return drug.brandProducts.some((brand: BrandedProduct) => brand.type === "otc")
          }
          // Fallback for direct category matches if quick filters use raw category names (less robust)
          const categoriesSection = dynamicFilterSections.find(s => s.id === "categories")
          const matchedCategoryQuickFilter = categoriesSection?.options.find((o: FilterOption) => o.id === filterId)
          if (matchedCategoryQuickFilter) {
            return drug.category === matchedCategoryQuickFilter.label
          }

          return true // Default true if filterId doesn't match any known rule (or consider false)
        })

      return matchesSearch && matchesFilters
    })
  }, [allDrugs, searchQuery, activeFilters, dynamicFilterSections, autoSearchPerformed])

  // Sorting logic
  const sortedDrugs = useMemo(() => {
    const sortFunctions = {
      relevance: () => filteredDrugs, // No change, default sorting
      price_low_high: () => [...filteredDrugs].sort((a, b) => {
        const aPrices = getPrices(a)
        const bPrices = getPrices(b)
        if (aPrices.length === 0 && bPrices.length === 0) return 0
        if (aPrices.length === 0) return 1 // Empty arrays go last
        if (bPrices.length === 0) return -1
        return Math.min(...aPrices) - Math.min(...bPrices)
      }),
      price_high_low: () => [...filteredDrugs].sort((a, b) => {
        const aPrices = getPrices(a)
        const bPrices = getPrices(b)
        if (aPrices.length === 0 && bPrices.length === 0) return 0
        if (aPrices.length === 0) return 1 // Empty arrays go last
        if (bPrices.length === 0) return -1
        return Math.max(...bPrices) - Math.max(...aPrices) // Descending
      }),
      alphabetical: () => [...filteredDrugs].sort((a, b) => 
        a.name.localeCompare(b.name)
      ),
      newest: () => [...filteredDrugs].sort((a, b) => {
        const aDate = getLatestDate(a)
        const bDate = getLatestDate(b)
        return bDate - aDate // Newest first (descending)
      }),
    }
    
    // Fallback to relevance sort if the selected sort doesn't exist
    return (sortFunctions[selectedSort as keyof typeof sortFunctions] || sortFunctions.relevance)()
  }, [filteredDrugs, selectedSort])

  // Helper function to get all prices for a drug
  const getPrices = (drug: GenericDrug): number[] => 
      drug.brandProducts
        .flatMap(brand => brand.suppliers.map(s => s.price))
        .filter(price => price !== undefined && price !== null)
  
  const getLatestDate = (drug: GenericDrug): number => {
    if (!drug.brandProducts || drug.brandProducts.length === 0) return 0;
    
    const dates = drug.brandProducts
      .map(bp => bp.dateAdded ? new Date(bp.dateAdded).getTime() : 0)
      .filter(d => d > 0);
      
    return dates.length > 0 ? Math.max(...dates) : 0;
  };

  const supplierCount = useMemo(() => {
    return allDrugs.reduce((total, drug) => {
      return total + drug.brandProducts.reduce((brandTotal, brand) => {
        return brandTotal + (brand.suppliers ? brand.suppliers.length : 0);
      }, 0);
    }, 0);
  }, [allDrugs]);

  // Update the UI to show background search indicator
  const renderSearchStatus = () => {
    if (isSearching) {
      return (
        <div className="text-sm text-gray-500 italic flex items-center">
          <LoadingSpinner className="mr-2 h-3 w-3" />
          <span>Searching entire database...</span>
        </div>
      );
    }
    
    if (isBackgroundSearching) {
      return (
        <div className="text-sm text-gray-500 italic flex items-center">
          <LoadingSpinner className="mr-2 h-3 w-3" />
          <span>Looking for additional matches...</span>
        </div>
      );
    }
    
    return null;
  }

  return (
    <div className="container mx-auto p-6">
      {/* Information banner */}
      {showBanner && (
        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Browsing the Pharmaceutical Marketplace</AlertTitle>
          <AlertDescription>
            You can search for drugs by generic name, brand name, or therapeutic category.
          </AlertDescription>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-1 right-1"
            onClick={() => setShowBanner(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Mobile Filters Button (Shown on Mobile Only) */}
        <div className="md:hidden">
          <Button
            onClick={() => setIsFilterSheetOpen(true)}
            className="w-full flex items-center justify-center"
            variant="outline"
          >
            <Filter className="mr-2 h-4 w-4" />
            Filters ({activeFilters.length})
          </Button>
        </div>

        {/* Filter Sidebar (Hidden on Mobile) */}
        <div className="hidden md:block">
          <Card className="sticky top-4">
            <CardContent className="pt-6">
              <div className="space-y-4">
                <h2 className="font-semibold text-xl mb-2">Filters</h2>
                
                {/* Supplier toggle switch */}
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="space-y-0.5">
                    <Label htmlFor="supplier-toggle" className="text-base font-medium">
                      Products with Suppliers
                    </Label>
                    <p className="text-xs text-gray-500">
                      {supplierCount > 0 
                        ? `${supplierCount} suppliers available`
                        : "Currently no suppliers available"}
                    </p>
                  </div>
                  <Switch
                    id="supplier-toggle"
                    checked={showWithSuppliersOnly}
                    onCheckedChange={setShowWithSuppliersOnly}
                  />
                </div>
                
                {dynamicFilterSections.map((section) => (
                  <div key={section.id} className="space-y-3">
                    <h3 className="font-medium text-sm">{section.title}</h3>
                    <div className="space-y-1.5">
                      {section.options.map((option) => (
                        <div key={option.id} className="flex items-center">
                          <label
                            htmlFor={option.id}
                            className="flex items-center cursor-pointer w-full text-sm"
                          >
                            <input
                              type="checkbox"
                              id={option.id}
                              className="mr-2 h-4 w-4 rounded border-gray-300 focus:ring-blue-500"
                              checked={activeFilters.includes(option.id)}
                              onChange={() => handleFilterChange(option.id)}
                            />
                            <span>{option.label}</span>
                            <span className="ml-auto text-gray-500 text-xs">
                              {option.count}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {activeFilters.length > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                    className="mt-2 w-full"
                  >
                    Clear All Filters
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="md:col-span-3 space-y-6">
          <div className="flex flex-col space-y-4">
            {/* Search Bar, Sort, and View Toggle */}
            <div className="flex flex-wrap gap-3">
              <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    type="search"
                    placeholder="Search all products by name, brand, or manufacturer..."
                    className="pl-9 w-full"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button 
                    type="submit" 
                    className="absolute right-0 top-0 rounded-l-none h-full"
                    disabled={isSearching || searchQuery.trim() === ''}
                  >
                    {isSearching ? (
                      <div className="flex items-center">
                        <LoadingSpinner className="mr-2 h-4 w-4" />
                        <span>Searching...</span>
                      </div>
                    ) : (
                      <span>Search</span>
                    )}
                  </Button>
                </div>
              </form>

              <div className="flex space-x-2 items-center">
                <Select value={selectedSort} onValueChange={setSelectedSort}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Best Match</SelectItem>
                    <SelectItem value="price_low_high">Price: Low to High</SelectItem>
                    <SelectItem value="price_high_low">Price: High to Low</SelectItem>
                    <SelectItem value="alphabetical">Alphabetical</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>

                <div className="border rounded-md flex">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    className={`px-3 ${
                      viewMode === "grid" ? "" : "hover:bg-transparent hover:text-gray-900"
                    }`}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    className={`px-3 ${
                      viewMode === "list" ? "" : "hover:bg-transparent hover:text-gray-900"
                    }`}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="hidden sm:block">
              <ScrollArea className="w-full whitespace-nowrap">
                <div className="flex space-x-2 py-1">
                  {quickFilters.map((filter) => (
                    <button
                      key={filter.id}
                      onClick={() => handleFilterChange(filter.id)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                        activeFilters.includes(filter.id)
                          ? "bg-blue-100 text-blue-800 border border-blue-200"
                          : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}

                  {/* Supplier toggle - also available in quick filters for mobile */}
                  <button
                    onClick={() => setShowWithSuppliersOnly(!showWithSuppliersOnly)}
                    className={`px-4 py-1.5 rounded-full text-sm font-medium flex items-center ${
                      showWithSuppliersOnly
                        ? "bg-green-100 text-green-800 border border-green-200"
                        : "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200"
                    }`}
                  >
                    <ShoppingBag className="h-3.5 w-3.5 mr-1.5" />
                    Products with Suppliers
                  </button>
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>

            {/* Active Filters Display */}
            {activeFilters.length > 0 && (
              <ActiveFilters
                activeFilters={activeFilterObjects}
                onClearFilter={(id) => handleFilterChange(id)}
                onClearAll={handleClearFilters}
              />
            )}
          </div>

          {/* Results Section with Error Handling */}
          {error ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : isLoading || isSearching ? (
            <div className="h-60 flex items-center justify-center">
              <div className="text-center">
                <LoadingSpinner className="mx-auto mb-4" />
                <p className="text-gray-500">
                  {isLoading ? "Loading products..." : "Searching database..."}
                </p>
              </div>
            </div>
          ) : searchingForNoLocalResults && sortedDrugs.length === 0 ? (
            <div className="h-60 flex items-center justify-center">
              <div className="text-center">
                <LoadingSpinner className="mx-auto mb-4" />
                <p className="text-gray-500">
                  Searching for "{searchQuery}" across all products...
                </p>
              </div>
            </div>
          ) : sortedDrugs.length === 0 ? (
            <div className="text-center p-8 border rounded-lg">
              <div className="text-4xl mb-4">🔍</div>
              <h3 className="text-lg font-semibold">No products found</h3>
              <p className="text-gray-500 mt-1">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button className="mt-4" onClick={handleClearFilters}>
                Clear all filters
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm text-gray-500">
                  Showing {sortedDrugs.length} drug{sortedDrugs.length !== 1 ? "s" : ""}
                </p>
                {renderSearchStatus()}
              </div>
              {renderDatabaseSearchButton()}
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "flex flex-col gap-4"
                }
              >
                {sortedDrugs.map((drug) => (
                  <GenericProductCard
                    key={drug.id}
                    data={drug}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <FilterSheet
        open={isFilterSheetOpen}
        onOpenChange={setIsFilterSheetOpen}
        sections={dynamicFilterSections}
        activeFilters={activeFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        supplierToggle={{
          enabled: showWithSuppliersOnly,
          onChange: setShowWithSuppliersOnly,
          count: supplierCount
        }}
      />
    </div>
  )
}
