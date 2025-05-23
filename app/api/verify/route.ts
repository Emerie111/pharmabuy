import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request: Request) {
  try {
    const { nafdacCode } = await request.json()

    if (!nafdacCode) {
      return NextResponse.json(
        { error: 'NAFDAC code is required' },
        { status: 400 }
      )
    }

    console.log('Searching for NAFDAC code:', nafdacCode)

    // First, let's check what NAFDAC numbers exist in the database
    const { data: allProducts, error: listError } = await supabase
      .from('branded_products')
      .select('nafdac_number, brand_name')
      .order('nafdac_number')
    
    if (listError) {
      console.error('Error listing NAFDAC numbers:', listError)
      return NextResponse.json(
        { error: `Error listing NAFDAC numbers: ${listError.message}` },
        { status: 500 }
      )
    } else {
      console.log('Total products in database:', allProducts?.length || 0)
      console.log('First 10 NAFDAC numbers:')
      allProducts?.slice(0, 10).forEach(p => {
        console.log(`- ${p.nafdac_number} (${p.brand_name})`)
      })
      if (allProducts && allProducts.length > 10) {
        console.log(`... and ${allProducts.length - 10} more`)
      }
    }

    const trimmedCode = nafdacCode.trim();
    // Query the branded_products table for the NAFDAC number (case-insensitive)
    const { data: product, error } = await supabase
      .from('branded_products')
      .select(`
        *,
        generic_drugs (
          name,
          category,
          description,
          indication
        )
      `)
      .ilike('nafdac_number', trimmedCode)
      .single()

    if (error) {
      console.error('Error querying Supabase:', error)
      // Check if it's a "not found" error
      if (error.code === 'PGRST116') {
        return NextResponse.json({
          status: 'unverified',
          message: 'This NAFDAC code could not be found in our database'
        })
      }
      return NextResponse.json(
        { error: `Error verifying NAFDAC code: ${error.message}` },
        { status: 500 }
      )
    }

    console.log('Query result:', product)

    if (product) {
      return NextResponse.json({
        status: 'verified',
        product: {
          brandName: product.brand_name,
          manufacturer: product.manufacturer,
          strength: product.strength,
          dosageForm: product.dosage_form,
          packSize: product.pack_size,
          genericName: product.generic_drugs?.name,
          category: product.generic_drugs?.category,
          description: product.generic_drugs?.description,
          indication: product.generic_drugs?.indication,
          nafdacNumber: product.nafdac_number,
          countryOfOrigin: product.country_of_origin,
          type: product.type,
          verified: product.verified,
          rating: product.rating,
          bioequivalence: product.bioequivalence
        }
      })
    } else {
      return NextResponse.json({
        status: 'unverified',
        message: 'This NAFDAC code could not be found in our database'
      })
    }
  } catch (error) {
    console.error('Error in verify endpoint:', error)
    return NextResponse.json(
      { error: `Internal server error: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    )
  }
} 