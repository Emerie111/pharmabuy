import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { createServerSupabaseClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"

export async function POST(request: Request) {
  try {
    // Get request body
    const body = await request.json()
    
    // Get current session to verify authenticated user
    const supabaseServer = await createServerSupabaseClient()
    let { data: { session } } = await supabaseServer.auth.getSession()
    let user = session?.user
    
    // If no session, try to use the user_id from the request body
    if (!user && body.user_id) {
      try {
        // Get the user data from Supabase
        const { data, error } = await supabaseServer.auth.admin.getUserById(body.user_id)
        if (!error && data.user) {
          user = data.user
        }
      } catch (error) {
        console.error("Error getting user by ID:", error)
      }
    }
    
    if (!user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      )
    }
    
    // Ensure the user has the healthcare_provider role
    if (user.user_metadata.role !== "healthcare_provider") {
      return NextResponse.json(
        { error: "Not authorized as a healthcare provider" },
        { status: 403 }
      )
    }

    // Check if the user has the healthcare_provider role in the user_roles table
    const { data: userRole, error: roleError } = await supabaseServer
      .from('user_roles')
      .select('role_id')
      .eq('user_id', user.id)
      .eq('role_id', 2) // Assuming role_id 2 is for 'healthcare_provider'
      .single();

    if (roleError && roleError.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error("Error checking user role:", roleError);
      return NextResponse.json(
        { error: "Failed to check user role" },
        { status: 500 }
      );
    }

    // If user doesn't have the healthcare_provider role in user_roles, assign it
    if (!userRole) {
      console.log("User doesn't have healthcare_provider role in user_roles yet, assigning...");

      const { error: assignRoleError } = await supabaseServer
        .from('user_roles')
        .insert({
          user_id: user.id,
          role_id: 2 // Assuming role_id 2 is for 'healthcare_provider'
        });

      if (assignRoleError) {
        console.error("Error assigning user role:", assignRoleError);
        return NextResponse.json(
          { error: "Failed to assign user role" },
          { status: 500 }
        );
      }
      console.log("User role assigned to healthcare_provider in user_roles");
    }

    // Required fields for healthcare providers
    const requiredFields = [
      "name", 
      "profession", 
      "license_number", 
      "business_name", 
      "address", 
      "phone",
      "email"
    ]
    
    // Check if all required fields are present
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }
    
    // Create healthcare provider record
    const { data, error } = await supabaseServer
      .from("healthcare_providers")
      .insert({
        id: user.id, // Use the auth user ID as the provider ID
        name: body.name,
        profession: body.profession,
        license_number: body.license_number,
        license_verified: false, // Will be verified by admin
        business_name: body.business_name,
        address: body.address,
        phone: body.phone,
        email: body.email,
        website: body.website || null,
      })
      .select()
    
    if (error) {
      console.error("Error creating healthcare provider:", error)
      
      // If the error indicates the table doesn't exist, return a clearer message
      if (error.message && error.message.includes('relation "healthcare_providers" does not exist')) {
        return NextResponse.json(
          { 
            error: "Healthcare providers table does not exist", 
            details: "Please create the healthcare_providers table in your database before proceeding." 
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { error: "Failed to create healthcare provider profile", details: error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error("Error in healthcare provider creation:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
} 