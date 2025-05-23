import { NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase-server';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('searchTerm');

    if (!searchTerm) {
      return NextResponse.json({ error: 'Search term is required' }, { status: 400 });
    }

    const supabase = await createServerSupabaseClient();
    const { data: genericDrugs, error } = await supabase
      .from('generic_drugs')
      .select('id, name, category, description')
      .ilike('name', `%${searchTerm}%`)
      .limit(10);

    if (error) {
      console.error('Error searching generic drugs:', error);
      return NextResponse.json({ error: 'Failed to search generic drugs' }, { status: 500 });
    }

    return NextResponse.json(genericDrugs || []);
  } catch (e) {
    console.error('Unexpected error in generic drug search:', e);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
} 