import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Query simples para manter o Supabase ativo
    const { error } = await supabase.from('profiles').select('id').limit(1);

    if (error && error.code !== '42P01') {
      return NextResponse.json({ alive: false, error: error.message });
    }

    return NextResponse.json({
      alive: true,
      timestamp: new Date().toISOString(),
      message: 'Supabase keepalive OK',
    });
  } catch (e: any) {
    return NextResponse.json({ alive: false, error: e.message });
  }
}
