import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase-server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('searchTerm');

    if (!searchTerm) {
      return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
    }

    // Get cookies for server-side Supabase client
    const cookieStore = await cookies();
    const supabase = createServerClient(cookieStore);
    
    const { data: products, error } = await supabase
      .from('branded_products')
      .select('id, brand_name, manufacturer, strength, dosage_form, pack_size, nafdac_number, image')
      .ilike('brand_name', `%${searchTerm}%`)
      .limit(10); // Limit results for performance

    if (error) {
      console.error('Error searching branded products:', error);
      return NextResponse.json({ error: 'Failed to search products' }, { status: 500 });
    }

    // Map the fields to match what the frontend expects
    const productsWithMappedName = products?.map(p => ({ 
      ...p, 
      name: p.brand_name,
      // Create a description from available fields since we don't have a dedicated description column
      description: `${p.manufacturer} - ${p.strength} - ${p.dosage_form}`
    })) || [];

    return NextResponse.json(productsWithMappedName);
  } catch (e) {
    console.error('Unexpected error in branded product search:', e);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
} 