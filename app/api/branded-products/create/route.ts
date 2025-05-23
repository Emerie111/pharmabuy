import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    // Use FormData to handle both text fields and file uploads
    const formData = await request.formData();
    
    // Extract text fields
    const brandName = formData.get('brand_name') as string;
    const manufacturer = formData.get('manufacturer') as string;
    const strength = formData.get('strength') as string;
    const dosageForm = formData.get('dosage_form') as string;
    const packSize = formData.get('pack_size') as string;
    const nafdacNumber = formData.get('nafdac_number') as string;
    const type = formData.get('type') as string;
    const countryOfOrigin = formData.get('country_of_origin') as string;
    const genericId = formData.get('generic_id') as string;
    const bioequivalence = formData.get('bioequivalence') as string;
    const supplierId = formData.get('supplier_id') as string;
    
    // Extract image file if provided
    const imageFile = formData.get('image_file') as File | null;

    // Validate required fields
    if (!brandName || !manufacturer || !strength || !dosageForm || !packSize || 
        !type || !countryOfOrigin || !genericId || !supplierId) {
      return NextResponse.json({ 
        error: 'Missing required fields' 
      }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    
    // Check if a branded product with this name and strength already exists
    const { data: existingProduct, error: checkError } = await supabase
      .from('branded_products')
      .select('id')
      .eq('brand_name', brandName)
      .eq('strength', strength)
      .eq('dosage_form', dosageForm)
      .limit(1);
      
    if (checkError) {
      console.error('Error checking existing product:', checkError);
      return NextResponse.json({ error: 'Failed to check for existing product' }, { status: 500 });
    }
    
    if (existingProduct && existingProduct.length > 0) {
      return NextResponse.json({ 
        error: 'A product with this name, strength, and dosage form already exists',
        existingId: existingProduct[0].id
      }, { status: 409 });
    }

    // Generate a custom ID with the "SUPP" prefix for supplier-originated products
    const id = `SUPP${Date.now().toString().substring(6)}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
    
    // Handle image upload if provided
    let imagePath = null;
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${id}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile);
        
      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        return NextResponse.json({ error: 'Failed to upload product image' }, { status: 500 });
      }
      
      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
        
      imagePath = publicUrlData.publicUrl;
    }

    // Insert the new branded product
    const { data, error } = await supabase
      .from('branded_products')
      .insert({
        id,
        brand_name: brandName,
        manufacturer,
        strength,
        dosage_form: dosageForm,
        pack_size: packSize,
        nafdac_number: nafdacNumber || '', // Make NAFDAC number optional with empty default
        type,
        country_of_origin: countryOfOrigin,
        generic_id: genericId,
        bioequivalence: bioequivalence ? parseFloat(bioequivalence) : null,
        image: imagePath || '', // Use empty string if no image was uploaded
        first_added_by_supplier_id: supplierId, // Track which supplier added this product
        verified: false, // New products start as unverified
        rating: 0
      })
      .select();

    if (error) {
      console.error('Error creating branded product:', error);
      return NextResponse.json({ error: 'Failed to create branded product' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: "Product created successfully",
      product: data[0]
    });
  } catch (e) {
    console.error('Unexpected error creating branded product:', e);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
} 