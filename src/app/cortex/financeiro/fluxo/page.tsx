'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, Calendar, ArrowUpRight, ArrowDownRight, DollarSign } from 'lucide-react';

export default function FluxoCaixaPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<any[]>([]);
  const [period, setPeriod] = useState<'HOJE' | '7D' | 'MES' | '30D' | '90D' | 'ANO'>('MES');

  const fetchCashFlow = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/cortex/financeiro', { cache: 'no-store' });
      const json = await res.json();
      if (json.success) {
        setOrders(json.orders || []);
      }
    } catch (e) {
      console.error('Erro ao buscar fluxo:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCashFlow();
  }, []);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Filtro Temporal Dinâmico
  const now = new Date();
  const filteredOrders = orders.filter((o) => {
    const orderDate = new Date(o.created_at);
    const diffDays = (now.getTime() - orderDate.getTime()) / (1000 * 3600 * 24);

    if (period === 'HOJE') return diffDays <= 1;
    if (period === '7D') return diffDays <= 7;
    if (period === 'MES') return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
    if (period === '30D') return diffDays <= 30;
    if (period === '90D') return diffDays <= 90;
    if (period === 'ANO') return orderDate.getFullYear() === now.getFullYear();
    return true;
  });

  const totalIn = filteredOrders.reduce((acc, curr) => acc + Number(curr.total_amount || curr.subtotal || 0), 0);
  const totalOut = totalIn * (0.06 + 0.0099 + 0.35); // 6% Fisco + 0.99% Pix Mercado Pago + 35% CMV
  const netBalance = totalIn - totalOut;
  const avgTicket = filteredOrders.length > 0 ? totalIn / filteredOrders.length : 0;

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      {/* HEADER E SELETOR DE PERÍODO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">TESOURARIA & EXTRATOS OPERACIONAIS</span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">Fluxo de Caixa & Extrato</h1>
          <p className="text-xs text-zinc-500 mt-0.5">Entradas Liquidadas, Provisões de Custos e Balanço de Período</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center bg-zinc-100 p-1 rounded border border-zinc-200 text-xs font-mono font-bold">
            {(['HOJE', '7D', 'MES', '30D', '90D', 'ANO'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-2.5 py-1 rounded transition-all ${
                  period === p ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {p === 'HOJE' ? 'Hoje' : p === '7D' ? '7 Dias' : p === 'MES' ? 'Mês Atual' : p === '30D' ? '30 Dias' : p === '90D' ? '90 Dias' : 'Ano'}
              </button>
            ))}
          </div>

          <button
            onClick={fetchCashFlow}
            disabled={loading}
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 disabled:opacity-50 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sincronizar</span>
          </button>
        </div>
      </div>

      {/* KPIS DO PERÍODO SELECIONADO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 block mb-2">(+) Entradas Brutas</span>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">{formatBRL(totalIn)}</div>
          <p className="text-[11px] text-zinc-400 mt-1">{filteredOrders.length} pedidos no período</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-600 block mb-2">(-) Saídas & Provisões</span>
          <div className="text-3xl font-bold text-rose-600 font-mono tracking-tight">- {formatBRL(totalOut)}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Fisco (6%) + Gateway Pix (0,99%) + CMV (35%)</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">(=) Saldo Líquido</span>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">{formatBRL(netBalance)}</div>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">Margem Livre no Período</p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">Ticket Médio Janela</span>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">{formatBRL(avgTicket)}</div>
          <p className="text-[11px] text-zinc-400 mt-1">Média por pedido liquidado</p>
        </div>
      </div>

      {/* EXTRATO ANALÍTICO DO PERÍODO */}
      <div className="p-6 rounded-lg border border-zinc-200 bg-white shadow-sm">
        <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest mb-4">
          Extrato Analítico de Lançamentos ({period})
        </h3>
        {filteredOrders.length === 0 ? (
          <p className="text-xs font-mono text-zinc-400 text-center py-8">Nenhuma transação liquidada encontrada para este período.</p>
        ) : (
          <div className="divide-y divide-zinc-100">
            {filteredOrders.map((ord) => (
              <div key={ord.id} className="py-3 flex justify-between items-center text-xs font-mono">
                <div>
                  <span className="font-bold text-zinc-900">Pedido #{ord.short_id || ord.id.slice(0, 8)}</span>
                  <span className="text-zinc-400 ml-2">({new Date(ord.created_at).toLocaleDateString('pt-BR')})</span>
                </div>
                <span className="text-emerald-600 font-bold">
                  + {formatBRL(Number(ord.total_amount || ord.subtotal || 0))}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}