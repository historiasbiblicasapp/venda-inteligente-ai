import { NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const raw = await request.text();
    const body = raw ? JSON.parse(raw) : {};
    const { landing_page_id, visitor_id, event_type, event_data, page_variant, utm_source, utm_medium, utm_campaign, referrer } = body;

    if (!landing_page_id || !visitor_id || !event_type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const supabase = createServerSupabase();
    const { error } = await supabase.from('page_analytics').insert({
      landing_page_id,
      visitor_id,
      event_type,
      event_data: event_data || null,
      page_variant: page_variant || null,
      utm_source: utm_source || null,
      utm_medium: utm_medium || null,
      utm_campaign: utm_campaign || null,
      referrer: referrer || null,
      user_agent: request.headers.get('user-agent') || null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
