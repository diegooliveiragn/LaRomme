export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const code = url.searchParams.get('code');

    if (!code) {
      return NextResponse.json({ error: 'Código de autorização não fornecido.' }, { status: 400 });
    }

    const clientId = process.env.MERCADOPAGO_CLIENT_ID || '3823361277258269';
    const clientSecret = process.env.MERCADOPAGO_CLIENT_SECRET || 'EDZpX11OrmveHkoWCRBKhHoxg4bZBO9w';
    const redirectUri = 'https://www.laromme.com.br/api/mercadopago/callback';

    // Troca o código temporário por token com escopo de carteira
    const tokenRes = await fetch('https://api.mercadopago.com/oauth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_secret: clientSecret,
        client_id: clientId,
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return NextResponse.json({ error: 'Falha ao autenticar no Mercado Pago.', details: tokenData }, { status: 400 });
    }

    // Persiste no Supabase para uso em segundo plano
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
    const supabase = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    });

    await supabase.from('app_settings').upsert({
      key: 'mercadopago_oauth_token',
      value: tokenData.access_token,
      updated_at: new Date().toISOString(),
    });

    return NextResponse.redirect('https://www.laromme.com.br/cortex/financeiro?oauth=success');
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}