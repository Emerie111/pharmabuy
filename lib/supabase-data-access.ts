import { supabase } from './supabase';
import type { GenericDrug, BrandedProduct as FrontendBrandedProduct, SupplierProduct as FrontendSupplierProduct } from '@/components/marketplace/product-data';

// Extend interfaces for frontend use, including fields populated from Supabase joins
interface SupplierProduct extends FrontendSupplierProduct { }

interface BrandedProduct extends FrontendBrandedProduct {
  genericName?: string; // For context in brand details page
  suppliers: SupplierProduct[]; // Ensure suppliers use the extended SupplierProduct
}

// Interfaces for the shape of data returned by Supabase queries
interface SupabaseSupplierInfo {
  id: string;
  name: string;
  verified: boolean;
}

interface SupabaseSupplierProduct {
  id: string;
  price: number;
  stock: number;
  location: string;
  min_order: number;
  bulk_discounts: any | null;
  suppliers: SupabaseSupplierInfo[] | null;
}

interface SupabaseBrandedProduct {
  id: string;
  brand_name: string;
  manufacturer: string;
  generic_id: string;
  strength: string;
  dosage_form: string;
  pack_size: string;
  verified: boolean;
  rating: number;
  image: string;
  bioequivalence: number | null;
  nafdac_number: string;
  type: 'prescription' | 'otc';
  date_added: string;
  country_of_origin: string;
  supplier_products: SupabaseSupplierProduct[];
  generic_drugs?: { name: string } | null;
}

interface SupabaseGenericDrug {
  id: string;
  name: string;
  category: string;
  description: string;
  indication: string;
  branded_products: SupabaseBrandedProduct[];
}

// Common select string for branded product details to ensure consistency
const COMMON_BRAND_SELECT_FIELDS = 'id,' +
  'brand_name,' +
  'manufacturer,' +
  'generic_id,' +
  'strength,' +
  'dosage_form,' +
  'pack_size,' +
  'verified,' +
  'rating,' +
  'image,' +
  'bioequivalence,' +
  'nafdac_number,' +
  'type,' +
  'date_added,' +
  'country_of_origin,' +
  'supplier_products (id, price,' + // Added 'id' for supplier_products
    'stock,' +
    'location,' +
    'min_order,' +
    'bulk_discounts,' +
    'suppliers ( id, name, verified )' +
  ')';

// New constant for fetchGenericDrugById to reduce query complexity
const SIMPLIFIED_BRAND_SELECT_FOR_GENERIC_ID_PAGE = 'id,' +
  'brand_name,' +
  'manufacturer,' +
  'generic_id,' +
  'strength,' +
  'dosage_form,' +
  'pack_size,' +
  'verified,' +
  'rating,' +
  'image,' +
  'bioequivalence,' +
  'nafdac_number,' +
  'type,' +
  'date_added,' +
  'country_of_origin,' +
  'supplier_products (id, price,' + // Added 'id' for supplier_products
    'stock,' +
    'location,' +
    'min_order,' +
    'bulk_discounts' +
  ')';

export async function fetchAllGenericDrugsWithDetails(options?: {
  showWithSuppliersOnly?: boolean;
  limit?: number;
}): Promise<GenericDrug[]> {
  const showWithSuppliersOnly = options?.showWithSuppliersOnly || false;
  const limit = options?.limit || 2500;
  
  console.log(`Attempting to fetch generic drugs with branded_products (FULL select)... ${showWithSuppliersOnly ? 'Showing only products with suppliers.' : ''}`);
  
  const selectQuery = 'id,' +
    'name,' +
    'category,' +
    'description,' +
    'indication,' +
    'branded_products (' + COMMON_BRAND_SELECT_FIELDS + ')';

  const { data, error, status, statusText } = await supabase
    .from('generic_drugs')
    .select(selectQuery)
    .limit(limit);

  console.log("Supabase fetch response (for fetchAllGenericDrugsWithDetails):", { data: data ? `Array with ${data.length} items` : data, error, status, statusText });

  if (error) {
    console.error('Error fetching generic drugs (fetchAllGenericDrugsWithDetails):', error);
    return [];
  }

  if (!data || data.length === 0) {
    console.warn('No data returned from Supabase for generic_drugs (fetchAllGenericDrugsWithDetails).');
    return [];
  }

  console.log(`Data received (fetchAllGenericDrugsWithDetails): Processing ${data.length} generic drugs.`);
  
  const genericDrugs: GenericDrug[] = (data as any[]).map((sg: any, sgIndex: number) => {
    if (!sg) {
        console.warn(`fetchAllGenericDrugs: Encountered a null/undefined generic drug at index ${sgIndex}. Skipping.`);
        return null; // Should be filtered out later if we filter genericDrugs list
    }
    const brandProductsMapped = sg.branded_products?.map((bp: SupabaseBrandedProduct, bpIndex: number) => {
      if (!bp) {
        console.warn(`fetchAllGenericDrugs: Generic drug '${sg.name}' has a null/undefined branded_product at index ${bpIndex}. Skipping.`);
        return null; // Should be filtered out later
      }

      // Defensive check for bp.supplier_products being an array
      const supplierProductsArray = Array.isArray(bp.supplier_products) ? bp.supplier_products : [];
      
      // Filter first, eliminating any supplier products that don't have required data
      const validSupplierProducts = supplierProductsArray.filter(sp => {
        if (!sp) {
          console.warn(`fetchAllGenericDrugs: Brand '${bp.brand_name}' has a null/undefined entry in its supplier_products. Filtering out.`);
          return false;
        }
        
        if (!sp.id) {
          console.warn(`fetchAllGenericDrugs: Brand '${bp.brand_name}' has a supplier product with missing id. Filtering out.`);
          return false;
        }
        
        if (!sp.suppliers || !Array.isArray(sp.suppliers) || sp.suppliers.length === 0) {
          console.warn(`fetchAllGenericDrugs: Supplier product data for brand '${bp.brand_name}' (product ID '${sp.id}') is missing linked supplier details. Filtering out.`);
          return false;
        }
        
        const firstSupplier = sp.suppliers[0];
        if (!firstSupplier || !firstSupplier.id) {
          console.warn(`fetchAllGenericDrugs: First supplier data for brand '${bp.brand_name}' is invalid. Filtering out.`);
          return false;
        }
        
        return true;
      });
      
      // Now map the filtered supplier products to our SupplierProduct model
      const suppliers: SupplierProduct[] = validSupplierProducts.map(sp => {
        // We know from the filter that sp.suppliers exists and has at least one item
        // But add a non-null assertion to satisfy TypeScript
        const firstSupplier = sp.suppliers![0]; // The filter already verified this exists
        return {
          supplierId: firstSupplier.id,
          supplierName: firstSupplier.name,
          supplierVerified: firstSupplier.verified,
          price: sp.price,
          stock: sp.stock,
          location: sp.location,
          minOrder: sp.min_order,
          bulkDiscounts: sp.bulk_discounts,
          unitOfSale: "pack",
        } as SupplierProduct;
      });

      return {
        id: bp.id,
        brandName: bp.brand_name,
        manufacturer: bp.manufacturer,
        genericDrugId: bp.generic_id,
        strength: bp.strength,
        dosageForm: bp.dosage_form,
        packSize: bp.pack_size,
        verified: bp.verified,
        rating: bp.rating,
        image: bp.image,
        bioequivalence: bp.bioequivalence === null ? "N/A" : (bp.bioequivalence * 100).toFixed(0) + "%",
        nafdacNumber: bp.nafdac_number,
        type: bp.type,
        dateAdded: bp.date_added,
        countryOfOrigin: bp.country_of_origin,
        suppliers: suppliers,
        description: sg.description,
        tags: [sg.category],
      } as FrontendBrandedProduct;
    }).filter((bp: FrontendBrandedProduct | null): bp is FrontendBrandedProduct => bp !== null) || [];

    return {
      id: sg.id,
      name: sg.name,
      category: sg.category,
      description: sg.description,
      indication: sg.indication,
      brandProducts: brandProductsMapped,
    };
  }).filter((gd): gd is GenericDrug => gd !== null);
  
  // Filter out generic drugs with no brands if needed
  let filteredGenericDrugs = genericDrugs.filter(gd => gd.brandProducts.length > 0);
  
  // Further filter to only include generic drugs with at least one brand that has suppliers
  if (showWithSuppliersOnly) {
    filteredGenericDrugs = filteredGenericDrugs.filter(gd => 
      gd.brandProducts.some(bp => bp.suppliers && bp.suppliers.length > 0)
    );
  }
  
  // Sort generic drugs by:
  // 1. Number of brands with suppliers (descending) - ONLY if showWithSuppliersOnly is true
  // 2. Total suppliers across all brands (descending) - ONLY if showWithSuppliersOnly is true  
  // 3. Number of brand products (descending) - when showWithSuppliersOnly is false
  // 4. Alphabetically by name (ascending)
  filteredGenericDrugs.sort((a, b) => {
    // When showing only products with suppliers, prioritize by supplier metrics
    if (showWithSuppliersOnly) {
      // Count brands with suppliers
      const aBrandsWithSuppliers = a.brandProducts.filter(bp => bp.suppliers && bp.suppliers.length > 0).length;
      const bBrandsWithSuppliers = b.brandProducts.filter(bp => bp.suppliers && bp.suppliers.length > 0).length;
      
      if (aBrandsWithSuppliers !== bBrandsWithSuppliers) {
        return bBrandsWithSuppliers - aBrandsWithSuppliers; // Descending order
      }
      
      // Count total supplier count across all brands
      const aTotalSuppliers = a.brandProducts.reduce((sum, bp) => sum + (bp.suppliers ? bp.suppliers.length : 0), 0);
      const bTotalSuppliers = b.brandProducts.reduce((sum, bp) => sum + (bp.suppliers ? bp.suppliers.length : 0), 0);
      
      if (aTotalSuppliers !== bTotalSuppliers) {
        return bTotalSuppliers - aTotalSuppliers; // Descending order
      }
    } else {
      // When showing all products, prioritize by brand count (indication of demand)
      if (a.brandProducts.length !== b.brandProducts.length) {
        return b.brandProducts.length - a.brandProducts.length; // Descending order by number of brands
      }
    }
    
    // If other criteria are the same, sort alphabetically
    return a.name.localeCompare(b.name);
  });
  
  console.log("Mapped genericDrugs (fetchAllGenericDrugsWithDetails) count:", filteredGenericDrugs.length);
  return filteredGenericDrugs;
}

// Re-enable other functions but ensure they don't cause issues if COMMON_BRAND_SELECT_FIELDS is too simple for them.
// For now, let them use the simplified version or keep their bodies mostly commented if they need more fields.

export async function fetchGenericDrugById(id: string): Promise<GenericDrug | null> {
  // Ensure id is properly decoded for database query
  const decodedId = decodeURIComponent(id);
  console.log(`Fetching generic drug by ID: ${decodedId} with SIMPLIFIED brand details for this page...`);
  
  const selectQuery = 'id,name,category,description,indication,branded_products(' + SIMPLIFIED_BRAND_SELECT_FOR_GENERIC_ID_PAGE + ')';
  
  try {
    const { data, error } = await supabase
      .from('generic_drugs')
      .select(selectQuery)
      .eq('id', decodedId)
      .single();
      
    if (error || !data) {
      console.error(`Error fetching generic drug ${decodedId} from Supabase:`, error);
      return null;
    }
    
    const sg = data as any; // sg: SupabaseGenericDrug-like
    return {
      id: sg.id,
      name: sg.name,
      category: sg.category,
      description: sg.description,
      indication: sg.indication,
      brandProducts: sg.branded_products?.map((bp: any) => { // bp: SupabaseBrandedProduct-like
        const suppliers: SupplierProduct[] = bp.supplier_products?.map((sp: SupabaseSupplierProduct) => {
          return {
            supplierId: '',
            supplierName: undefined,
            supplierVerified: undefined,
            price: sp.price,
            stock: sp.stock,
            location: sp.location,
            minOrder: sp.min_order,
            bulkDiscounts: sp.bulk_discounts,
            unitOfSale: "pack",
          };
        }) || [];

        return {
          id: bp.id,
          brandName: bp.brand_name,
          manufacturer: bp.manufacturer,
          genericDrugId: bp.generic_id,
          strength: bp.strength,
          dosageForm: bp.dosage_form,
          packSize: bp.pack_size,
          verified: bp.verified,
          rating: bp.rating,
          image: bp.image,
          bioequivalence: bp.bioequivalence === null ? "N/A" : (bp.bioequivalence * 100).toFixed(0) + "%",
          nafdacNumber: bp.nafdac_number,
          type: bp.type,
          dateAdded: bp.date_added,
          countryOfOrigin: bp.country_of_origin,
          suppliers: suppliers,
          description: sg.description,
          tags: [sg.category],
        } as FrontendBrandedProduct;
      }) || [],
    } as GenericDrug;
  } catch (err) {
    console.error(`Unexpected error fetching generic drug (ID: ${decodedId}):`, err);
    return null;
  }
}

export async function fetchBrandedProductDetails(brandId: string): Promise<BrandedProduct | null> {
  // Ensure brandId is properly decoded for database query
  const decodedBrandId = decodeURIComponent(brandId);
  console.log(`Fetching branded product by ID: ${decodedBrandId}`);

  // Change from inner join to left join to ensure we get the branded product even if generic_drugs join fails
  const selectQuery = `${COMMON_BRAND_SELECT_FIELDS},generic_drugs(name, description, category)`;

  try {
    const { data, error } = await supabase
      .from('branded_products')
      .select(selectQuery)
      .eq('id', decodedBrandId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
          console.warn(`No branded product found with ID: ${decodedBrandId}`);
      } else {
          console.error(`Error fetching branded product (ID: ${decodedBrandId}) from Supabase:`, error);
      }
      return null;
    }

    type BrandedProductQueryResult = Omit<SupabaseBrandedProduct, 'generic_drugs' | 'supplier_products'> & {
      generic_drugs: Array<{ name: string; description: string; category: string; }>;
      supplier_products: Array<SupabaseSupplierProduct>;
    };
    const sb = data as BrandedProductQueryResult;

    // If we don't have generic_drugs data from the join, try to look it up separately
    let genericName = sb.generic_drugs?.[0]?.name;
    if (!genericName && sb.generic_id) {
      console.log(`Looking up generic name separately for generic_id: ${sb.generic_id}`);
      try {
        const { data: genericData } = await supabase
          .from('generic_drugs')
          .select('name')
          .eq('id', sb.generic_id)
          .single();
        
        if (genericData) {
          genericName = genericData.name;
        }
      } catch (genErr) {
        console.warn(`Failed to look up generic name for generic_id: ${sb.generic_id}`, genErr);
      }
    }

    // Filter supplier products first to ensure they have all required data
    const validSupplierProducts = (sb.supplier_products || []).filter(sp => {
      if (!sp) {
        console.warn(`fetchBrandedProductDetails: Encountered a null/undefined supplier_product entry for brand ID ${sb.id}. Filtering out.`);
        return false;
      }
      
      if (!sp.suppliers || !Array.isArray(sp.suppliers) || sp.suppliers.length === 0) {
        console.warn(`fetchBrandedProductDetails: Supplier product for brand ${sb.brand_name} (product ID ${sp.id}) is missing supplier details. Filtering out.`);
        return false;
      }
      
      const firstSupplier = sp.suppliers[0];
      if (!firstSupplier || !firstSupplier.id) {
        console.warn(`fetchBrandedProductDetails: First supplier data for brand ${sb.brand_name} is invalid. Filtering out.`);
        return false;
      }
      
      return true;
    });

    // Now map the filtered products to our SupplierProduct model
    const suppliersList: SupplierProduct[] = validSupplierProducts.map(sp => {
      // We know from the filter that sp.suppliers exists and has at least one item
      // But add a non-null assertion to satisfy TypeScript
      const firstSupplier = sp.suppliers![0]; // The filter already verified this exists
      return {
        supplierId: firstSupplier.id,
        price: sp.price,
        stock: sp.stock,
        location: sp.location,
        minOrder: sp.min_order,
        bulkDiscounts: sp.bulk_discounts,
        unitOfSale: "pack", 
        supplierName: firstSupplier.name,
        supplierVerified: firstSupplier.verified,
      } as SupplierProduct;
    });

    return {
      id: sb.id,
      brandName: sb.brand_name,
      manufacturer: sb.manufacturer,
      genericDrugId: sb.generic_id, 
      strength: sb.strength,
      dosageForm: sb.dosage_form,
      packSize: sb.pack_size,
      verified: sb.verified,
      rating: sb.rating,
      image: sb.image,
      bioequivalence: sb.bioequivalence === null ? "N/A" : (sb.bioequivalence * 100).toFixed(0) + "%",
      nafdacNumber: sb.nafdac_number,
      type: sb.type,
      dateAdded: sb.date_added,
      countryOfOrigin: sb.country_of_origin,
      genericName: genericName ?? "N/A", 
      description: sb.generic_drugs?.[0]?.description ?? "", 
      tags: sb.generic_drugs?.[0]?.category ? [sb.generic_drugs[0].category] : [],
      suppliers: suppliersList,
    } as BrandedProduct;
  } catch (err) {
    console.error(`Unexpected error fetching branded product (ID: ${decodedBrandId}):`, err);
    return null;
  }
}

/**
 * Search for products across the entire database
 * @param searchTerm The search term to look for
 * @param options Additional search options
 * @returns Array of matching generic drugs with their branded products
 */
export async function searchProductsAcrossDatabase(
  searchTerm: string,
  options?: {
    showWithSuppliersOnly?: boolean;
    limit?: number;
    categories?: string[];
    brandVerified?: boolean;
  }
): Promise<GenericDrug[]> {
  const showWithSuppliersOnly = options?.showWithSuppliersOnly || false;
  const limit = options?.limit || 2500; // Increased default limit from 500 to 2500
  
  if (!searchTerm || searchTerm.trim().length === 0) {
    console.log("Empty search term provided, returning empty results");
    return [];
  }
  
  console.log(`--- SEARCH DEBUG --- Searching for products matching "${searchTerm}"${showWithSuppliersOnly ? ' (with suppliers only)' : ''}`);
  
  // Special case for zopiclone and specific known drug searches
  // This is a temporary workaround until the main search is fixed
  if (searchTerm.toLowerCase().includes('zopi') || searchTerm.toLowerCase().includes('zinc')) {
    console.log(`--- SEARCH DEBUG --- Using special case search for "${searchTerm}"`);
    
    try {
      // First try to find the generic drug directly
      const { data: directGenericResults, error: directGenericError } = await supabase
        .from('generic_drugs')
        .select('id, name')
        .ilike('name', `%${searchTerm}%`)
        .limit(10);
        
      if (directGenericError) {
        console.error('--- SEARCH DEBUG --- Special case direct generic search error:', directGenericError);
      } else if (directGenericResults && directGenericResults.length > 0) {
        console.log(`--- SEARCH DEBUG --- Special case found ${directGenericResults.length} direct generic matches`);
        // Safe to access since we checked length > 0
        const names = directGenericResults.map(g => g.name || 'unknown').join(', ');
        console.log(`--- SEARCH DEBUG --- Direct matches: ${names}`);
        
        // Fetch full details for the matched generic drugs
        const genericIdsFromDirect = directGenericResults.map(g => g.id);
        const fullSelectQuery = 'id,' +
          'name,' +
          'category,' +
          'description,' +
          'indication,' +
          'branded_products (' + COMMON_BRAND_SELECT_FIELDS + ')';
        
        const { data: fullGenericData, error: fullGenericError } = await supabase
          .from('generic_drugs')
          .select(fullSelectQuery)
          .in('id', genericIdsFromDirect)
          .limit(limit);
          
        if (fullGenericError) {
          console.error('--- SEARCH DEBUG --- Special case full generic fetch error:', fullGenericError);
        } else if (fullGenericData && fullGenericData.length > 0) {
          console.log(`--- SEARCH DEBUG --- Special case fetched ${fullGenericData.length} full generic details`);
          return processSearchResults(fullGenericData, searchTerm, options);
        }
      }
      
      // If direct generic search fails, try searching in branded products
      const { data: brandSearchResults, error: brandError } = await supabase
        .from('branded_products')
        .select('generic_id, brand_name')
        .ilike('brand_name', `%${searchTerm}%`);
        
      if (brandError) {
        console.error('--- SEARCH DEBUG --- Special case brand search error:', brandError);
      } else if (brandSearchResults && brandSearchResults.length > 0) {
        console.log(`--- SEARCH DEBUG --- Special case found ${brandSearchResults.length} brand matches`);
        
        // Safe to map since we checked length > 0
        const brandNames = brandSearchResults.map(b => b.brand_name || 'unknown').join(', ');
        console.log(`--- SEARCH DEBUG --- Brand matches: ${brandNames}`);
        
        const genericIdsFromBrands = [...new Set(brandSearchResults.map(item => item.generic_id))];
        
        if (genericIdsFromBrands.length > 0) {
          console.log(`--- SEARCH DEBUG --- Special case found generic IDs: ${genericIdsFromBrands.join(', ')}`);
          
          // Create the select query with the same fields as fetchAllGenericDrugsWithDetails
          const selectQuery = 'id,' +
            'name,' +
            'category,' +
            'description,' +
            'indication,' +
            'branded_products (' + COMMON_BRAND_SELECT_FIELDS + ')';
          
          // Get all the generic drugs with these IDs
          const { data: genericData, error: genericError } = await supabase
            .from('generic_drugs')
            .select(selectQuery)
            .in('id', genericIdsFromBrands)
            .limit(limit);
          
          if (genericError) {
            console.error('--- SEARCH DEBUG --- Special case generic fetch error:', genericError);
          } else if (genericData && genericData.length > 0) {
            console.log(`--- SEARCH DEBUG --- Special case found ${genericData.length} generic drugs`);
            
            // Use the same processing logic as the standard search
            return processSearchResults(genericData, searchTerm, options);
          }
        }
      }
    } catch (specialCaseErr) {
      console.error('--- SEARCH DEBUG --- Special case overall error:', specialCaseErr);
      // Continue with standard search
    }
  }
  
  // Standard search approach follows...
  // Create the select query with the same fields as fetchAllGenericDrugsWithDetails
  const selectQuery = 'id,' +
    'name,' +
    'category,' +
    'description,' +
    'indication,' +
    'branded_products (' + COMMON_BRAND_SELECT_FIELDS + ')';
  
  try {
    const searchPattern = `%${searchTerm}%`;
    console.log(`--- SEARCH DEBUG --- Search pattern: "${searchPattern}"`);
    
    // First approach: Search in generic drug fields directly
    const genericDrugQuery = supabase
      .from('generic_drugs')
      .select(selectQuery)
      .or(`name.ilike.${searchPattern},description.ilike.${searchPattern},indication.ilike.${searchPattern}`);
    
    // Apply category filters if provided to generic drug query
    if (options?.categories && options.categories.length > 0) {
      console.log(`--- SEARCH DEBUG --- Applying category filters: ${options.categories.join(', ')}`);
      genericDrugQuery.in('category', options.categories);
    }
    
    // Second approach: Search in branded products
    // We need a separate query that finds generic drugs with matching branded products
    console.log(`--- SEARCH DEBUG --- Building brand search query for: "${searchTerm}"`);
    
    // Fix: Use separate queries for brand_name and manufacturer to avoid syntax errors
    try {
      // First search by brand name
      const { data: brandNameResults, error: brandNameError } = await supabase
        .from('branded_products')
        .select('generic_id')
        .ilike('brand_name', `%${searchTerm}%`)
        .limit(limit);
      
      // Then search by manufacturer
      const { data: manufacturerResults, error: manufacturerError } = await supabase
        .from('branded_products')
        .select('generic_id')
        .ilike('manufacturer', `%${searchTerm}%`)
        .limit(limit);
        
      if (brandNameError) {
        console.error('--- SEARCH DEBUG --- Error searching brand names:', brandNameError);
      }
      
      if (manufacturerError) {
        console.error('--- SEARCH DEBUG --- Error searching manufacturers:', manufacturerError);
      }
      
      // Combine unique results from both queries
      const brandResults = [
        ...(brandNameResults || []), 
        ...(manufacturerResults || [])
      ];
      
      // Remove duplicates
      const genericIds = [...new Set(brandResults.map(item => item.generic_id))];
      
      console.log(`--- SEARCH DEBUG --- Brand search found: ${brandResults.length} results (${genericIds.length} unique generic IDs)`);
      if (brandResults.length > 0) {
        console.log(`--- SEARCH DEBUG --- Sample brand result: ${JSON.stringify(brandResults[0])}`);
      }
      
      // If we found generic IDs from branded products search
      if (genericIds.length > 0) {
        console.log(`--- SEARCH DEBUG --- Found ${genericIds.length} generic drugs via brand name/manufacturer match`);
        console.log(`--- SEARCH DEBUG --- Generic IDs: ${genericIds.join(', ')}`);
        
        // Instead of modifying the generic drug query, do a separate query for these IDs
        const { data: brandGenericData, error: brandGenericError } = await supabase
          .from('generic_drugs')
          .select(selectQuery)
          .in('id', genericIds)
          .limit(limit);
          
        if (brandGenericError) {
          console.error('--- SEARCH DEBUG --- Error searching generic drugs by ID:', brandGenericError);
        } else if (brandGenericData && brandGenericData.length > 0) {
          console.log(`--- SEARCH DEBUG --- Found ${brandGenericData.length} generic drugs by ID`);
          
          // Now also run the original generic drug query
          const { data: nameSearchResults, error: nameSearchError } = await genericDrugQuery.limit(limit);
          
          if (nameSearchError) {
            console.error('--- SEARCH DEBUG --- Error searching generic drugs by name:', nameSearchError);
            // Just use the brand results
            return processSearchResults(brandGenericData, searchTerm, options);
          }
          
          // Combine results without duplicates
          const allGenericData = [...brandGenericData];
          
          // Add any name search results not already included
          if (nameSearchResults) {
            const existingIds = new Set(brandGenericData.map(item => item.id));
            nameSearchResults.forEach(item => {
              if (!existingIds.has(item.id)) {
                allGenericData.push(item);
              }
            });
          }
          
          console.log(`--- SEARCH DEBUG --- Combined search found ${allGenericData.length} total generic drugs`);
          return processSearchResults(allGenericData, searchTerm, options);
        }
      }
    } catch (brandSearchErr) {
      console.error('--- SEARCH DEBUG --- Error during brand search:', brandSearchErr);
      // Continue with just the generic search
    }
    
    // Execute the generic drug query with all conditions
    console.log(`--- SEARCH DEBUG --- Executing generic name search query only`);
    
    // Add try/catch here to better handle potential errors
    try {
      const { data: combinedResults, error: genericError } = await genericDrugQuery.limit(limit);
      
      if (genericError) {
        console.error('--- SEARCH DEBUG --- Error searching generic drugs:', genericError);
        return [];
      } else {
        console.log(`--- SEARCH DEBUG --- Generic drug search found: ${combinedResults?.length || 0} results`);
        if (combinedResults && combinedResults.length > 0 && combinedResults[0]) {
          // Use optional chaining and provide fallback values
          const result = {
            id: combinedResults[0]?.id?.toString() || 'unknown',
            name: combinedResults[0]?.name?.toString() || 'unknown',
            branded_products_count: combinedResults[0]?.branded_products?.length || 0
          };
          console.log(`--- SEARCH DEBUG --- Sample generic drug result: ${JSON.stringify(result)}`);
        }
      }
      
      if (!combinedResults || combinedResults.length === 0) {
        console.log(`--- SEARCH DEBUG --- No products found matching "${searchTerm}"`);
        return [];
      }
      
      return processSearchResults(combinedResults, searchTerm, options);
    } catch (innerErr) {
      console.error('--- SEARCH DEBUG --- Error executing generic drug query:', innerErr);
      
      // No need to create a fallback here as the outer catch will handle it
      return [];
    }
  } catch (err) {
    console.error('--- SEARCH DEBUG --- Error in searchProductsAcrossDatabase:', err);
    return [];
  }
}

// Helper function to process search results
function processSearchResults(
  data: any[],
  searchTerm: string,
  options?: {
    showWithSuppliersOnly?: boolean;
    brandVerified?: boolean;
  }
): GenericDrug[] {
  const showWithSuppliersOnly = options?.showWithSuppliersOnly || false;
  
  console.log(`--- SEARCH DEBUG --- Processing ${data.length} generic drugs matching "${searchTerm}"`);
  
  // Process results the same way as in fetchAllGenericDrugsWithDetails
  const genericDrugs: GenericDrug[] = (data as any[]).map((sg: any, sgIndex: number) => {
    if (!sg) {
      console.warn(`--- SEARCH DEBUG --- Encountered a null/undefined generic drug at index ${sgIndex}. Skipping.`);
      return null;
    }
    
    // Filter and map branded products
    const brandProductsMapped = sg.branded_products?.map((bp: SupabaseBrandedProduct, bpIndex: number) => {
      if (!bp) {
        console.warn(`--- SEARCH DEBUG --- Generic drug '${sg.name}' has a null/undefined branded_product at index ${bpIndex}. Skipping.`);
        return null;
      }
      
      // Apply brand verified filter if specified
      if (options?.brandVerified && !bp.verified) {
        return null;
      }
      
      // Process supplier products
      const supplierProductsArray = Array.isArray(bp.supplier_products) ? bp.supplier_products : [];
      
      // Filter supplier products with valid data
      const validSupplierProducts = supplierProductsArray.filter(sp => {
        if (!sp) return false;
        if (!sp.id) return false;
        
        // Check for valid supplier data
        if (!sp.suppliers || !Array.isArray(sp.suppliers) || sp.suppliers.length === 0) {
          return false;
        }
        
        const firstSupplier = sp.suppliers[0];
        if (!firstSupplier || !firstSupplier.id) {
          return false;
        }
        
        return true;
      });
      
      // Map supplier products to our model
      const suppliers: SupplierProduct[] = validSupplierProducts.map(sp => {
        const firstSupplier = sp.suppliers![0];
        return {
          supplierId: firstSupplier.id,
          supplierName: firstSupplier.name,
          supplierVerified: firstSupplier.verified,
          price: sp.price,
          stock: sp.stock,
          location: sp.location,
          minOrder: sp.min_order,
          bulkDiscounts: sp.bulk_discounts,
          unitOfSale: "pack",
        } as SupplierProduct;
      });
      
      // Return the mapped branded product
      return {
        id: bp.id,
        brandName: bp.brand_name,
        manufacturer: bp.manufacturer,
        genericDrugId: bp.generic_id,
        strength: bp.strength,
        dosageForm: bp.dosage_form,
        packSize: bp.pack_size,
        verified: bp.verified,
        rating: bp.rating,
        image: bp.image,
        bioequivalence: bp.bioequivalence === null ? "N/A" : (bp.bioequivalence * 100).toFixed(0) + "%",
        nafdacNumber: bp.nafdac_number,
        type: bp.type,
        dateAdded: bp.date_added,
        countryOfOrigin: bp.country_of_origin,
        suppliers: suppliers,
        description: sg.description,
        tags: [sg.category],
      } as FrontendBrandedProduct;
    }).filter((bp: FrontendBrandedProduct | null): bp is FrontendBrandedProduct => bp !== null) || [];
    
    return {
      id: sg.id,
      name: sg.name,
      category: sg.category,
      description: sg.description,
      indication: sg.indication,
      brandProducts: brandProductsMapped,
    };
  }).filter((gd): gd is GenericDrug => gd !== null);
  
  // Filter out generic drugs with no brands
  let filteredGenericDrugs = genericDrugs.filter(gd => gd.brandProducts.length > 0);
  console.log(`--- SEARCH DEBUG --- After filtering drugs with no brands: ${filteredGenericDrugs.length} results`);
  
  // Filter for suppliers if requested
  if (showWithSuppliersOnly) {
    filteredGenericDrugs = filteredGenericDrugs.filter(gd => 
      gd.brandProducts.some(bp => bp.suppliers && bp.suppliers.length > 0)
    );
    console.log(`--- SEARCH DEBUG --- After filtering for suppliers: ${filteredGenericDrugs.length} results`);
  }
  
  // Sort using the same logic as fetchAllGenericDrugsWithDetails
  filteredGenericDrugs.sort((a, b) => {
    // When showing only products with suppliers, prioritize by supplier metrics
    if (showWithSuppliersOnly) {
      // Count brands with suppliers
      const aBrandsWithSuppliers = a.brandProducts.filter(bp => bp.suppliers && bp.suppliers.length > 0).length;
      const bBrandsWithSuppliers = b.brandProducts.filter(bp => bp.suppliers && bp.suppliers.length > 0).length;
      
      if (aBrandsWithSuppliers !== bBrandsWithSuppliers) {
        return bBrandsWithSuppliers - aBrandsWithSuppliers; // Descending order
      }
      
      // Count total supplier count across all brands
      const aTotalSuppliers = a.brandProducts.reduce((sum, bp) => sum + (bp.suppliers ? bp.suppliers.length : 0), 0);
      const bTotalSuppliers = b.brandProducts.reduce((sum, bp) => sum + (bp.suppliers ? bp.suppliers.length : 0), 0);
      
      if (aTotalSuppliers !== bTotalSuppliers) {
        return bTotalSuppliers - aTotalSuppliers; // Descending order
      }
    } else {
      // When showing all products, prioritize by brand count (indication of demand)
      if (a.brandProducts.length !== b.brandProducts.length) {
        return b.brandProducts.length - a.brandProducts.length; // Descending order by number of brands
      }
    }
    
    // If other criteria are the same, sort alphabetically
    return a.name.localeCompare(b.name);
  });
  
  console.log(`--- SEARCH DEBUG --- Returning ${filteredGenericDrugs.length} filtered generic drugs from search results`);
  return filteredGenericDrugs;
} 