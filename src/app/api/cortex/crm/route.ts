export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .in('status', ['approved', 'paid', 'shipped', 'delivered'])
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Consolidação de Patronos por E-mail
    const patronosMap: Record<string, any> = {};

    (orders || []).forEach((ord: any) => {
      const email = (ord.customer_email || '').toLowerCase().trim();
      if (!email) return;

      if (!patronosMap[email]) {
        patronosMap[email] = {
          id: ord.id,
          email,
          full_name: ord.customer_name || 'Patrono LaRomme',
          phone: ord.customer_phone || '',
          city: ord.shipping_city || 'Fortaleza',
          state: ord.shipping_state || 'CE',
          total_spent: 0,
          order_count: 0,
          last_order_date: ord.created_at,
          sport: 'Geral / Lifestyle',
        };
      }

      patronosMap[email].total_spent += Number(ord.total_amount || ord.subtotal || 0);
      patronosMap[email].order_count += 1;
    });

    const patronos = Object.values(patronosMap);

    return NextResponse.json({
      success: true,
      patronos,
      totalCount: patronos.length,
      orders: orders || [],
    });
  } catch (err: any) {
    console.error('Erro na API CRM:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}