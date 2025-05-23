import { NextResponse } from "next/server"

// Redirect to the new API endpoint for backward compatibility
export async function POST(request: Request) {
  const body = await request.json()
  
  // Forward the request to the new endpoint
  const response = await fetch(new URL("/api/healthcare-providers", request.url), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  })
  
  const data = await response.json()
  
  // Return the response from the new endpoint
  return NextResponse.json(data, { status: response.status })
} 