import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET() {
  const startTime = Date.now();
  const checks: Record<string, { status: 'healthy' | 'unhealthy'; latency_ms?: number; error?: string }> = {};

  // 1. Verificação do Supabase
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    if (!supabaseUrl || !supabaseKey) {
      checks.supabase = { status: 'unhealthy', error: 'Chaves de ambiente ausentes' };
    } else {
      const dbStart = Date.now();
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { error } = await supabase.from('products').select('id').limit(1);

      if (error) {
        checks.supabase = { status: 'unhealthy', error: error.message };
      } else {
        checks.supabase = { status: 'healthy', latency_ms: Date.now() - dbStart };
      }
    }
  } catch (err: any) {
    checks.supabase = { status: 'unhealthy', error: err.message };
  }

  // 2. Verificação das Variáveis de Gateway (Mercado Pago)
  const mpAccessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN;
  checks.mercadopago = {
    status: mpAccessToken ? 'healthy' : 'unhealthy',
    error: mpAccessToken ? undefined : 'MERCADO_PAGO_ACCESS_TOKEN ausente'
  };

  // 3. Verificação do Serviço de Notificações (Resend)
  const resendApiKey = process.env.RESEND_API_KEY;
  checks.resend = {
    status: resendApiKey ? 'healthy' : 'unhealthy',
    error: resendApiKey ? undefined : 'RESEND_API_KEY ausente'
  };

  const isHealthy = Object.values(checks).every((c) => c.status === 'healthy');
  const totalLatency = Date.now() - startTime;

  return NextResponse.json(
    {
      status: isHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      total_latency_ms: totalLatency,
      checks
    },
    { status: isHealthy ? 200 : 503 }
  );
}