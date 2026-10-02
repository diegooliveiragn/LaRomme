'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface DailyMetrics {
  grossRevenueToday: number;
  paidOrdersToday: number;
  pendingPixToday: number;
  criticalStockCount: number;
  latestLogs: { title: string; desc: string; time: string; color: string }[];
}

export default function CortexDashboardPage() {
  const [metrics, setMetrics] = useState<DailyMetrics>({
    grossRevenueToday: 0,
    paidOrdersToday: 0,
    pendingPixToday: 0,
    criticalStockCount: 0,
    latestLogs: [],
  });
  const [loading, setLoading] = useState(true);

  const fetchLiveTelemetry = async () => {
    setLoading(true);
    try {
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayIso = todayStart.toISOString();

      // 1. Pedidos Pagos Hoje
      const { data: paidOrders } = await supabase
        .from('orders')
        .select('total_amount, subtotal')
        .eq('status', 'paid')
        .gte('created_at', todayIso);

      const revenueToday = (paidOrders || []).reduce(
        (sum, o) => sum + Number(o.total_amount || o.subtotal || 0),
        0
      );
      const paidCount = (paidOrders || []).length;

      // 2. Pix Pendentes / Abandonos Hoje
      const { data: pendingOrders } = await supabase
        .from('orders')
        .select('id')
        .eq('status', 'pending')
        .gte('created_at', todayIso);

      const pendingCount = (pendingOrders || []).length;

      // 3. SKUs em Estoque Crítico (Disponível <= 3 unidades)
      const { data: criticalVariants } = await supabase
        .from('inventory_variants')
        .select('id')
        .lte('stock_available', 3);

      const criticalCount = (criticalVariants || []).length;

      // 4. Montagem de Log de Sistema Vivo
      const logs = [
        {
          title: 'Telemetria do Banco Conectada',
          desc: 'Dados consultados diretamente das tabelas vivas do Supabase.',
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          color: 'bg-emerald-400',
        },
      ];

      if (criticalCount > 0) {
        logs.push({
          title: 'Alerta de Estoque WMS',
          desc: `${criticalCount} SKU(s) com 3 ou menos unidades disponíveis.`,
          time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
          color: 'bg-rose-400',
        });
      }

      setMetrics({
        grossRevenueToday: revenueToday,
        paidOrdersToday: paidCount,
        pendingPixToday: pendingCount,
        criticalStockCount: criticalCount,
        latestLogs: logs,
      });
    } catch (err) {
      console.error('Erro na telemetria do Olho de Hórus:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveTelemetry();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* TÍTULO EXECUTIVO */}
      <div className="flex justify-between items-end border-b border-slate-800/40 pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-wide uppercase">Olho de Hórus</h1>
          <p className="text-xs text-slate-400 mt-1">Cockpit de Telemetria Operacional & Saúde Financeira</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 block">Status da Apuração</span>
          <span className="text-xs font-semibold text-emerald-400 flex items-center justify-end gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Consolidado em Tempo Real
          </span>
        </div>
      </div>

      {/* CARDS DE KPIS VIVOS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        
        {/* Card 1 */}
        <div className="p-5 rounded-xl border bg-slate-900/40 border-slate-800/80 shadow-sm space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
            <span>Faturamento Bruto (Hoje)</span>
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-100">
            {loading ? 'R$ ...' : `R$ ${metrics.grossRevenueToday.toFixed(2).replace('.', ',')}`}
          </div>
          <div className="text-[11px] text-slate-500 border-t border-slate-800/60 pt-2 flex justify-between">
            <span>Apuração Diária</span>
            <span className="font-semibold text-emerald-400">Ao Vivo</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-5 rounded-xl border bg-slate-900/40 border-slate-800/80 shadow-sm space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
            <span>Vendas Concluídas (Hoje)</span>
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-100">
            {loading ? '...' : metrics.paidOrdersToday} <span className="text-xs font-normal text-slate-400">pedido(s)</span>
          </div>
          <div className="text-[11px] text-slate-500 border-t border-slate-800/60 pt-2">
            Status: <span className="font-semibold text-emerald-400">Aprovados via Checkout</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-5 rounded-xl border bg-amber-500/5 border-amber-500/20 shadow-sm space-y-3">
          <div className="flex justify-between items-center text-xs text-amber-400 font-medium">
            <span>Pix Pendentes (Hoje)</span>
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <div className="text-2xl font-bold tracking-tight text-amber-400">
            {loading ? '...' : metrics.pendingPixToday}
          </div>
          <div className="text-[11px] text-amber-400/80 border-t border-amber-500/20 pt-2">
            Aguardando pagamento no banco
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-5 rounded-xl border bg-slate-900/40 border-slate-800/80 shadow-sm space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
            <span>Alertas de Estoque (WMS)</span>
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
          <div className="text-2xl font-bold tracking-tight text-slate-100">
            {loading ? '...' : metrics.criticalStockCount} <span className="text-xs font-normal text-slate-400">SKUs</span>
          </div>
          <div className={`text-[11px] border-t border-slate-800/60 pt-2 ${
            metrics.criticalStockCount > 0 ? 'text-rose-400 font-bold' : 'text-emerald-400'
          }`}>
            {metrics.criticalStockCount > 0 ? 'Atenção: Estoque Crítico' : 'Estoque Físico Regular'}
          </div>
        </div>
      </div>

      {/* ÁREA PRINCIPAL */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Painel Central */}
        <div className="lg:col-span-2 p-6 rounded-xl border bg-slate-900/40 border-slate-800/80 flex flex-col h-96 justify-between">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800/60">
            <h2 className="text-sm font-semibold tracking-wide">Saúde da Operação LaRomme</h2>
            <button
              onClick={fetchLiveTelemetry}
              className="text-[10px] px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono transition-colors"
            >
              Reconsultar Banco
            </button>
          </div>

          <div className="space-y-4 py-4">
            <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200 block">Esteira Logística & Fulfillment</span>
                <span className="text-[11px] text-slate-400">Controle de despachos e códigos de rastreamento.</span>
              </div>
              <a href="/cortex/pedidos" className="text-xs text-amber-400 hover:underline">Acessar Esteira →</a>
            </div>

            <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200 block">Product Studio & WMS</span>
                <span className="text-[11px] text-slate-400">Edição de catálogo público e entradas de estoque.</span>
              </div>
              <a href="/cortex/catalogo" className="text-xs text-amber-400 hover:underline">Gerenciar Catalogo →</a>
            </div>

            <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-slate-200 block">Tesouraria & DRE Sintético</span>
                <span className="text-[11px] text-slate-400">Apuração de Margem Líquida e Despesas.</span>
              </div>
              <a href="/cortex/financeiro" className="text-xs text-amber-400 hover:underline">Ver Financeiro →</a>
            </div>
          </div>

          <div className="text-[10px] text-slate-500 font-mono border-t border-slate-800/60 pt-3 flex justify-between">
            <span>MOTOR DE BUSCA: SUPABASE REST API</span>
            <span>AMORTIZAÇÃO E DRE: ATIVO</span>
          </div>
        </div>

        {/* Auditoria / Log de Eventos Reais */}
        <div className="p-6 rounded-xl border bg-slate-900/40 border-slate-800/80 flex flex-col h-96">
          <h2 className="text-sm font-semibold tracking-wide pb-4 border-b border-slate-800/60 mb-4">Log Teleférico do Sistema</h2>
          <div className="space-y-4 flex-1 overflow-y-auto">
            {metrics.latestLogs.map((log, idx) => (
              <div key={idx} className="flex space-x-3 items-start text-xs">
                <span className={`w-2 h-2 rounded-full ${log.color} mt-1 shrink-0`} />
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold text-slate-200">{log.title}</p>
                    <span className="text-[9px] font-mono text-slate-500">{log.time}</span>
                  </div>
                  <p className="text-slate-400 text-[11px] mt-0.5">{log.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}