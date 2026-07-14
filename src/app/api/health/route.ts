import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const start = Date.now();
    const { error } = await supabase.from('profiles').select('id').limit(1);
    const latency = Date.now() - start;

    if (error) {
      if (error.code === '42P01') {
        return NextResponse.json({ status: 'setup_required', healthy: true, message: 'Tables not created yet' });
      }
      return NextResponse.json({ status: 'error', healthy: false, error: error.message, code: error.code });
    }

    return NextResponse.json({ status: 'healthy', healthy: true, latency });
  } catch (e: any) {
    return NextResponse.json({ status: 'unreachable', healthy: false, error: e.message });
  }
}
