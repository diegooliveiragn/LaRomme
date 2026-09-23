import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, instagram } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Forneça um e-mail válido para o protocolo de acesso.' },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('seu-projeto')) {
      return NextResponse.json(
        { error: 'Credenciais do banco de dados não configuradas na Vercel/.env.local.' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase
      .from('lote_zero_leads')
      .insert([{ name, email, phone, instagram }]);

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Este e-mail já está registrado na lista VIP do Lote Zero.' },
          { status: 400 }
        );
      }
      return NextResponse.json(
        { error: 'Falha ao registrar coordenadas no banco de dados.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    return NextResponse.json(
      { error: 'Erro interno ao processar requisição.' },
      { status: 500 }
    );
  }
}