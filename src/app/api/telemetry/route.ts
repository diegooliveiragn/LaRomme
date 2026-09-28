import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_type, event_data, page_url } = body;

    await supabase.from('telemetry_events').insert([{
      event_type,
      event_data: JSON.stringify(event_data || {}),
      page_url
    }]);

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ success: true });
  }
}