import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET() {
  try {
    // Only allow this in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'This endpoint is only available in development mode' }, { status: 403 })
    }

    // Since we're in a client context, use the client-side supabase instance
    // This won't have the user's session, but we can still query the supplier table
    
    // Get all suppliers to check data format
    const { data: suppliers, error: suppliersError } = await supabase
      .from('suppliers')
      .select('id, name, email')
      .limit(5)
    
    if (suppliersError) {
      throw suppliersError
    }

    // Find supplier matching the example email
    const exampleEmail = "maduchukwuemerie@gmail.com"
    const { data: exactMatchSupplier } = await supabase
      .from('suppliers')
      .select('*')
      .eq('email', exampleEmail)
      .single()

    // Try case-insensitive match if exact match failed
    let caseInsensitiveMatch = null
    const { data: caseMatches } = await supabase
      .from('suppliers')
      .select('*')
      .ilike('email', exampleEmail)
    
    if (caseMatches && caseMatches.length > 0) {
      caseInsensitiveMatch = caseMatches[0]
    }

    return NextResponse.json({
      suppliers: suppliers.map(s => ({ 
        id: s.id, 
        name: s.name, 
        email: s.email,
        email_lowercase: s.email ? s.email.toLowerCase() : null 
      })),
      exactMatchSupplier,
      caseInsensitiveMatch,
      debug: {
        example_email: exampleEmail,
        example_email_lowercase: exampleEmail.toLowerCase()
      }
    })
  } catch (error: any) {
    console.error('Error getting debug info:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 