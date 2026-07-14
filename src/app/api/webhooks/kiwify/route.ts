import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Kiwify webhook payload
    const { 
      product_name, 
      buyer_email, 
      buyer_name,
      buyer_phone,
      transaction_id,
      amount,
      currency = 'BRL',
      status,
    } = body;

    const supabase = createServerSupabase();

    // Find or create lead
    let leadId = null;
    if (buyer_email) {
      const { data: existingLead } = await supabase
        .from('leads')
        .select('id')
        .eq('email', buyer_email)
        .single();

      if (existingLead) {
        leadId = existingLead.id;
        await supabase
          .from('leads')
          .update({ status: 'converted' })
          .eq('id', leadId);
      }
    }

    // Create sale record
    const { error } = await supabase.from('sales').insert({
      product_name: product_name || 'Produto',
      amount: parseFloat(amount) || 0,
      currency,
      platform: 'kiwify',
      status: status === 'approved' || status === 'paid' ? 'confirmed' : 'pending',
      transaction_id: transaction_id || null,
      lead_id: leadId,
    });

    if (error) {
      console.error('Webhook error:', error);
    }

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
