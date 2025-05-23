import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface Supplier {
  id: string;
  name: string;
  email: string;
  [key: string]: any; // For any other properties
}

interface MismatchItem {
  type: 'supplier_without_auth' | 'auth_without_supplier';
  supplier?: Supplier;
  user?: {
    id: string;
    email: string | undefined;
    role: string | undefined;
  };
  suggestion: string;
}

export async function GET() {
  try {
    // Only allow this in development
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json({ error: 'This endpoint is only available in development mode' }, { status: 403 })
    }

    // Get all users with supplier role
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      throw authError
    }

    // Get all suppliers
    const { data: suppliers, error: suppliersError } = await supabase
      .from('suppliers')
      .select('id, name, email')
    
    if (suppliersError) {
      throw suppliersError
    }

    // Find users with supplier role
    const supplierUsers = authUsers?.users?.filter(
      user => user.user_metadata?.role === 'supplier'
    ) || []

    // Check for mismatches
    const mismatches: MismatchItem[] = []
    
    // Check for suppliers without matching auth users
    suppliers.forEach(supplier => {
      const matchingUser = supplierUsers.find(
        user => user.email && 
        supplier.email && 
        user.email.toLowerCase() === supplier.email.toLowerCase()
      )
      
      if (!matchingUser) {
        mismatches.push({
          type: 'supplier_without_auth',
          supplier,
          suggestion: 'Create auth account or update supplier email'
        })
      }
    })
    
    // Check for auth users without suppliers
    supplierUsers.forEach(user => {
      const matchingSupplier = suppliers.find(
        supplier => supplier.email && 
        user.email && 
        supplier.email.toLowerCase() === user.email.toLowerCase()
      )
      
      if (!matchingSupplier) {
        mismatches.push({
          type: 'auth_without_supplier',
          user: {
            id: user.id,
            email: user.email,
            role: user.user_metadata?.role
          },
          suggestion: 'Create supplier record or update user role'
        })
      }
    })

    return NextResponse.json({
      supplierCount: suppliers.length,
      authSupplierCount: supplierUsers.length,
      mismatches,
      // List first few suppliers and auth users for debugging
      sampleSuppliers: suppliers.slice(0, 5),
      sampleAuthUsers: supplierUsers.slice(0, 5).map(u => ({
        id: u.id,
        email: u.email,
        role: u.user_metadata?.role
      }))
    })
  } catch (error: any) {
    console.error('Error checking supplier mismatches:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
} 