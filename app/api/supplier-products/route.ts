import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createServerClient } from '@/lib/supabase-server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    // Get the cookies for server-side Supabase client
    const cookieStore = await cookies();
    
    // Debug: Log available cookies
    console.log("Available cookies:", cookieStore.getAll().map(c => c.name));
    
    const supabase = createServerClient(cookieStore);

    // Get session and log the result
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    console.log("Session check result:", {
      hasSession: !!session,
      sessionError: sessionError?.message,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      userRole: session?.user?.user_metadata?.role
    });

    if (sessionError) {
      console.error("Session error details:", sessionError);
      return NextResponse.json({ error: 'Authentication error', details: sessionError.message }, { status: 401 });
    }

    if (!session) {
      return NextResponse.json({ error: 'Not authenticated', details: 'No valid session found' }, { status: 401 });
    }

    // Get the request body
    const body = await request.json();
    const { branded_product_id, price, stock, location, min_order = 1, expiry_date } = body;

    // Validate if the user is a supplier
    if (session.user.user_metadata.role !== 'supplier') {
      return NextResponse.json({ 
        error: 'Only suppliers can add products to inventory',
        details: `User role is ${session.user.user_metadata.role || 'undefined'}`
      }, { status: 403 });
    }

    // Validate required fields
    if (!branded_product_id || !price || !stock || !location) {
      return NextResponse.json({ 
        error: 'Missing required fields: branded_product_id, price, stock, and location are required' 
      }, { status: 400 });
    }

    // Check if the product already exists in supplier's inventory
    const { data: existingProduct, error: checkError } = await supabase
      .from('supplier_products')
      .select('id')
      .eq('supplier_id', session.user.id)
      .eq('branded_product_id', branded_product_id)
      .limit(1);
      
    if (checkError) {
      console.error('Error checking existing product:', checkError);
      return NextResponse.json({ error: 'Failed to check for existing product' }, { status: 500 });
    }
    
    // If product already exists, update it instead of creating a new one
    if (existingProduct && existingProduct.length > 0) {
      const { data: updatedData, error: updateError } = await supabase
        .from('supplier_products')
        .update({
          price,
          stock,
          location,
          min_order,
          updated_at: new Date().toISOString(),
          // Additional fields that might be updated
          expiry_date: expiry_date || null
        })
        .eq('id', existingProduct[0].id)
        .select();
      
      if (updateError) {
        console.error('Error updating product:', updateError);
        return NextResponse.json({ error: 'Failed to update product in inventory' }, { status: 500 });
      }
      
      return NextResponse.json({ 
        success: true, 
        message: 'Product updated in inventory', 
        product: updatedData[0] 
      });
    }

    // Generate a unique ID for the new supplier product
    const id = `SP${uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase()}`;

    // Add the supplier's ID to the product data
    const productData = {
      id,
      supplier_id: session.user.id,
      branded_product_id,
      price: parseFloat(price.toString()), // Ensure price is a number
      stock: parseInt(stock.toString()), // Ensure stock is an integer
      location,
      min_order: parseInt(min_order.toString()), // Ensure min_order is an integer
      // Store expiry date if provided
      expiry_date: expiry_date || null,
      // Optional bulk discounts will be added in a future iteration
      bulk_discounts: null,
      created_at: new Date().toISOString()
    };

    // Insert the product into the supplier_products table
    const { data, error } = await supabase
      .from('supplier_products')
      .insert(productData)
      .select()
      .single();

    if (error) {
      console.error('Error adding product:', error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    console.error('Unexpected error adding product to inventory:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
} 