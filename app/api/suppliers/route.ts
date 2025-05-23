import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { createClient } from '@supabase/supabase-js'

// Ensure we use server runtime (Node.js) and not edge runtime
export const runtime = 'nodejs'

// Explicitly set this route as dynamic
export const dynamic = 'force-dynamic'

// Create a dedicated admin client using the SERVICE_ROLE_KEY
// Ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are in your .env.local
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
)

export async function POST(request: Request) {
  try {
    // Debug: Log incoming request headers
    console.log("Incoming request headers for /api/suppliers:", Object.fromEntries(request.headers.entries()))
    
    // Get request body
    const body = await request.json()
    
    // This client is for user session context, using cookies
    const supabaseServer = await createServerSupabaseClient()
    const { data: { session }, error: sessionError } = await supabaseServer.auth.getSession()
    let user = session?.user
    
    // Debug: Log session retrieval results
    console.log("Session from supabaseServer.auth.getSession():", JSON.stringify({ session, error: sessionError }, null, 2))
    
    // If no session from cookies, try fallback using the user_id from request body WITH ADMIN CLIENT
    if (!user && body.user_id) {
      console.log("No user session from cookies. Attempting fallback with user_id via admin client:", body.user_id)
      try {
        // MODIFY THIS: Use supabaseAdmin for this call
        const { data: adminUserDataResponse, error: adminUserError } = await supabaseAdmin.auth.admin.getUserById(body.user_id)
        
        // Supabase typings for adminUserData might be { user: User | null } or { data: { user: User | null }, error: Error | null }
        // Adjust access accordingly based on actual Supabase JS library version for admin client
        const adminUser = adminUserDataResponse?.user || (adminUserDataResponse as any)?.data?.user

        console.log("Admin fallback auth.admin.getUserById result:", JSON.stringify({ user: adminUser, error: adminUserError }, null, 2))

        if (adminUserError) {
          console.error("Error from supabaseAdmin.auth.admin.getUserById:", adminUserError.message)
        }
        if (adminUser) {
          user = adminUser
          console.log("Fallback successful. User identified via admin client:", user.id)
        }
      } catch (error) {
        console.error("Exception during admin fallback for getUserById:", error)
      }
    }
    
    if (!user) {
      console.log("Authentication failed: No valid user could be identified for /api/suppliers.")
      return NextResponse.json(
        { error: "Authentication required. Please ensure you are logged in." },
        { status: 401 }
      )
    }
    
    console.log("User authenticated for /api/suppliers route:", user.id, "Email:", user.email)
    
    // Check if the user has the supplier role in the user_roles table
    // Using supabaseServer as this check should be in the context of the (now hopefully identified) user
    const { data: userRole, error: roleError } = await supabaseServer
      .from('user_roles')
      .select('role_id')
      .eq('user_id', user.id)
      .eq('role_id', 1) // supplier role_id is 1
      .maybeSingle() // Use maybeSingle to avoid error if not found

    if (roleError) { 
      // PGRST116 is "Not found", which is fine if the role isn't there yet.
      // Any other error is a problem.
      if (roleError.code !== 'PGRST116') {
        console.error("Error checking user role in user_roles:", roleError)
        return NextResponse.json(
          { error: "Failed to check user role information." },
          { status: 500 }
        )
      }
      console.log("User role not found in user_roles (PGRST116), will attempt to assign.")
    }

    // If user doesn't have the supplier role, assign it.
    // Using supabaseAdmin to ensure this critical step happens, bypassing RLS if necessary.
    if (!userRole || userRole.role_id !== 1) {
      console.log("User doesn't have supplier role (id: 1) in user_roles yet, assigning with admin client...")
      const { error: assignRoleError } = await supabaseAdmin
        .from('user_roles')
        .insert({
          user_id: user.id,
          role_id: 1 
        })

      if (assignRoleError) {
        console.error("Error assigning user role with admin client:", assignRoleError)
        return NextResponse.json(
          { error: "Failed to assign user role." },
          { status: 500 }
        )
      }
      console.log("User role (id: 1) assigned to supplier in user_roles table.")
    } else {
      console.log("User already has supplier role (id: 1) in user_roles.")
    }

    // Required fields for the suppliers table
    const requiredFields = [
      "name", "description", "logo", "address", "phone", "email", "founded_year"
    ]
    
    // Check if all required fields are present
    for (const field of requiredFields) {
      if (!body[field]) {
        console.log(`Missing required field for supplier: ${field}`)
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // Check if the supplier record already exists.
    // Use supabaseServer to respect RLS (user can see their own supplier record if it exists).
    const { data: existingSupplier, error: lookupError } = await supabaseServer
      .from("suppliers")
      .select("id")
      .eq("id", user.id)
      .maybeSingle()
      
    if (lookupError && lookupError.code !== 'PGRST116') {
      console.error("Error looking up existing supplier record:", lookupError)
      return NextResponse.json(
        { error: "Failed to check for existing supplier record." },
        { status: 500 }
      )
    }
    
    if (existingSupplier) {
      console.log("Supplier record already exists for user:", user.id, "Data:", existingSupplier)
      // Optionally, update the existing record here if that's desired, or just return success.
      // For now, assuming we don't re-create or update if it exists through this specific flow.
      return NextResponse.json({ 
        success: true, 
        data: existingSupplier,
        message: "Supplier already registered."
      }, { status: 200 })
    }
    
    // Create supplier record.
    // Using supabaseAdmin to ensure this can happen, especially if RLS on `suppliers` table is restrictive for inserts.
    // If RLS allows users to insert into `suppliers` where `id = auth.uid()`, then supabaseServer could be used.
    console.log("Creating new supplier record for user:", user.id)
    const supplierInsertData = {
      id: user.id,
      name: body.name,
      description: body.description,
      verified: body.verified !== undefined ? body.verified : true, // Default to true, or use provided
      logo: body.logo,
      address: body.address,
      phone: body.phone,
      email: body.email, // Should ideally match user.email or be validated
      website: body.website || null,
      founded_year: parseInt(body.founded_year) || new Date().getFullYear(),
      certifications: body.certifications || [],
      // Ensure all fields from your `suppliers` table are covered
      // product_spec_type: body.productSpecType, (example, if you have this field)
      // product_categories: body.productSpecType === "specific" ? [body.specificProductSpec] : [], (example)
      // delivery_capability: body.deliveryCapability, (example)
    }

    const { data: newSupplierData, error: createSupplierError } = await supabaseAdmin
      .from("suppliers")
      .insert(supplierInsertData)
      .select() // Select the data back
      .single() // Expect a single record

    if (createSupplierError) {
      console.error("Error creating supplier record with admin client:", createSupplierError)
      return NextResponse.json(
        { error: "Failed to create supplier profile.", details: createSupplierError.message },
        { status: 500 }
      )
    }
    
    console.log("Supplier record created successfully for user:", user.id, "Data:", newSupplierData)
    return NextResponse.json({ success: true, data: newSupplierData }, { status: 201 })
  } catch (error: any) {
    console.error("Catastrophic error in POST /api/suppliers:", error)
    return NextResponse.json(
      { error: "Internal server error.", details: error.message || 'Unknown error' },
      { status: 500 }
    )
  }
} 