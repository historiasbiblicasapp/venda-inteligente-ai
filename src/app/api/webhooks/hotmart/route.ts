import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabase } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const supabase = createServerSupabase();

    const { data } = body;
    if (!data) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const { transaction, product, buyer } = data;

    let leadId = null;
    if (buyer?.email) {
      const { data: existingLead } = await supabase
        .from('leads')
        .select('id')
        .eq('email', buyer.email)
        .single();

      if (existingLead) {
        leadId = existingLead.id;
        await supabase.from('leads').update({ status: 'converted' }).eq('id', leadId);
      }
    }

    await supabase.from('sales').insert({
      product_name: product?.name || 'Produto Hotmart',
      amount: parseFloat(transaction?.price?.value) || 0,
      currency: transaction?.price?.currency || 'BRL',
      platform: 'hotmart',
      status: transaction?.status === 'APPROVED' ? 'confirmed' : 'pending',
      transaction_id: transaction?.transaction_id || null,
      lead_id: leadId,
    });

    return NextResponse.json({ received: true });
  } catch {
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 });
  }
}
