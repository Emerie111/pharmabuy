import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { createClient } from '@supabase/supabase-js';
import { genericDrugs } from '../data/genericDrugs';
import { suppliers } from '../data/suppliers';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function importData() {
  try {
    console.log('Starting data import...');

    // Import generic drugs
    console.log('Importing generic drugs...');
    for (const drug of genericDrugs) {
      const { error } = await supabase
        .from('generic_drugs')
        .upsert({
          id: drug.id,
          name: drug.name,
          category: drug.category,
          description: drug.description,
          indication: drug.indication
        });

      if (error) {
        console.error(`Error importing generic drug ${drug.name}:`, error);
        continue;
      }

      // Import branded products
      for (const brand of drug.brandProducts) {
        const { error: brandError } = await supabase
          .from('branded_products')
          .upsert({
            id: brand.id,
            generic_id: drug.id,
            brand_name: brand.brandName,
            manufacturer: brand.manufacturer,
            strength: brand.strength,
            dosage_form: brand.dosageForm,
            pack_size: brand.packSize,
            verified: brand.verified,
            rating: brand.rating,
            image: brand.image,
            bioequivalence: (typeof brand.bioequivalence === 'number') ? brand.bioequivalence : null,
            nafdac_number: brand.nafdacNumber,
            type: brand.type,
            country_of_origin: brand.countryOfOrigin
          });

        if (brandError) {
          console.error(`Error importing brand ${brand.brandName}:`, brandError);
          continue;
        }
      }
    }

    // Import suppliers
    console.log('Importing suppliers...');
    for (const supplier of suppliers) {
      const { error } = await supabase
        .from('suppliers')
        .upsert({
          id: supplier.id,
          name: supplier.name,
          description: supplier.description,
          verified: supplier.verified,
          logo: supplier.logo,
          address: supplier.address,
          phone: supplier.phone,
          email: supplier.email,
          website: supplier.website,
          founded_year: supplier.foundedYear,
          certifications: supplier.certifications
        });

      if (error) {
        console.error(`Error importing supplier ${supplier.name}:`, error);
        continue;
      }

      // Import supplier products
      for (const product of supplier.products) {
        const { error: productError } = await supabase
          .from('supplier_products')
          .upsert({
            id: `${supplier.id}_${product.brandedProductId}`,
            supplier_id: supplier.id,
            branded_product_id: product.brandedProductId,
            price: product.price,
            stock: product.stock,
            location: product.location,
            min_order: product.minOrder,
            bulk_discounts: product.bulkDiscounts
          });

        if (productError) {
          console.error(`Error importing supplier product for ${supplier.name}:`, productError);
          continue;
        }
      }
    }

    console.log('Data import completed successfully!');
  } catch (error) {
    console.error('Error during data import:', error);
  }
}

importData(); 