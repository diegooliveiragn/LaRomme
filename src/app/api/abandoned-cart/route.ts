import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const { email, fullName, phone, items } = await req.json();

    if (!email || !items || items.length === 0) {
      return NextResponse.json({ success: false }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    if (!supabaseUrl || !supabaseKey) return NextResponse.json({ success: false }, { status: 500 });

    const supabase = createClient(supabaseUrl, supabaseKey, { auth: { persistSession: false } });

    // Insere ou atualiza o carrinho abandonado pelo e-mail
    const { error } = await supabase
      .from('abandoned_carts')
      .upsert({
        customer_email: email,
        customer_name: fullName || null,
        customer_phone: phone || null,
        items: items,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'customer_email' });

    if (error) {
      console.error('Erro ao registrar carrinho abandonado:', error);
      return NextResponse.json({ success: false }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}