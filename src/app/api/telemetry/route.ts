import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(req: NextRequest) {
  try {
    const { session_id, event_type, path, details } = await req.json();

    // Filtro Anti-Contaminação: Ignora logs se for o CEO navegando
    if (details?.is_ceo) {
      return NextResponse.json({ success: true, message: 'CEO event ignored.' });
    }

    const { error } = await supabase
      .from('telemetry_events')
      .insert([{ session_id, event_type, path, details }]);

    if (error) throw error;
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Telemetry Error:', error);
    return NextResponse.json({ error: 'Failed to track event' }, { status: 500 });
  }
}