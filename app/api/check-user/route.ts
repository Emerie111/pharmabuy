import { NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase-server"

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const userId = url.searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: "userId parameter is required" }, { status: 400 })
    }
    
    console.log(`Checking user with ID: ${userId}`)
    
    // Get current session to verify authenticated user
    const supabaseServer = await createServerSupabaseClient()
    console.log("Got supabase server client")
    
    try {
      // Try directly checking if the user exists
      const { data: userData, error: userError } = await supabaseServer
        .from('profiles') // Use the appropriate table where user data is stored
        .select('*')
        .eq('id', userId)
        .single()
      
      if (userError) {
        console.log("Error fetching user from database:", userError.message)
      } else {
        console.log("User data from database:", userData)
      }
      
      // Try with admin functions
      const { data, error } = await supabaseServer.auth.admin.getUserById(userId)
      
      if (error) {
        console.log("Error fetching user with admin:", error.message)
        return NextResponse.json({ 
          error: error.message, 
          userData: userData || null 
        }, { status: 404 })
      }
      
      return NextResponse.json({ 
        user: data.user,
        userData: userData || null 
      })
      
    } catch (error) {
      console.error("Error checking user:", error)
      return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 })
    }
  } catch (error) {
    console.error("Error in check-user route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
} 