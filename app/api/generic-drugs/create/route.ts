import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, description, indication } = body;

    // Validate required fields
    if (!name || !category || !description || !indication) {
      return NextResponse.json({ 
        error: 'Missing required fields. Name, category, description, and indication are required.' 
      }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    
    // Check if a generic drug with this name already exists
    const { data: existingDrug, error: checkError } = await supabase
      .from('generic_drugs')
      .select('id')
      .ilike('name', name)
      .limit(1);
      
    if (checkError) {
      console.error('Error checking existing generic drug:', checkError);
      return NextResponse.json({ error: 'Failed to check for existing generic drug' }, { status: 500 });
    }
    
    if (existingDrug && existingDrug.length > 0) {
      return NextResponse.json({ 
        error: 'A generic drug with this name already exists',
        existingId: existingDrug[0].id
      }, { status: 409 });
    }

    // Generate a unique ID with the "GEN" prefix
    const id = `GEN${uuidv4().replace(/-/g, '').substring(0, 8).toUpperCase()}`;

    // Insert the new generic drug
    const { data, error } = await supabase
      .from('generic_drugs')
      .insert({
        id,
        name,
        category,
        description,
        indication
      })
      .select('id, name, category, description');

    if (error) {
      console.error('Error creating generic drug:', error);
      return NextResponse.json({ error: 'Failed to create generic drug' }, { status: 500 });
    }

    return NextResponse.json(data[0]);
  } catch (e) {
    console.error('Unexpected error creating generic drug:', e);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
} 