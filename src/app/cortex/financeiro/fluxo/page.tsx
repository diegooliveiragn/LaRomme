'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, ArrowUpRight, ArrowDownRight, Wallet, CheckCircle2, Clock } from 'lucide-react';

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
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

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
  
  // Taxa real de intermediação do gateway Mercado Pago (0,99% Pix)
  const gatewayFee = totalIn * 0.0099;
  const totalOut = gatewayFee; // Deduções reais confirmadas
  const netBalance = totalIn - totalOut;

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      
      {/* HEADER E SELETOR DE PERÍODO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            TESOURARIA & EXTRATOS OPERACIONAIS
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">
            Fluxo de Caixa & Extrato
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Entradas Liquidadas, Taxas de Gateway e Saldo Disponível em Conta
          </p>
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

      {/* KPIS REAIS DO PERÍODO */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 block mb-2">
            (+) Entradas Brutas
          </span>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">
            {formatBRL(totalIn)}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            {filteredOrders.length} {filteredOrders.length === 1 ? 'pedido liquidado' : 'pedidos liquidados'}
          </p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-600 block mb-2">
            (-) Intermediação Gateway
          </span>
          <div className="text-3xl font-bold text-zinc-700 font-mono tracking-tight">
            - {formatBRL(totalOut)}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            Taxa Pix Mercado Pago (0,99%)
          </p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-900 block mb-2">
            (=) Saldo Líquido Disponível
          </span>
          <div className="text-3xl font-bold text-emerald-600 font-mono tracking-tight">
            {formatBRL(netBalance)}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            Valor em conta pronto para alocação
          </p>
        </div>

      </div>

      {/* EXTRATO DE PEDIDOS LIQUIDADOS */}
      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center">
          <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
            <Wallet className="w-4 h-4 text-zinc-500" /> Extrato Analítico de Transações
          </h2>
          <span className="text-[10px] font-mono text-zinc-500 uppercase">
            Tempo Real (Supabase)
          </span>
        </div>

        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-3 font-bold">Identificador</th>
                  <th className="px-6 py-3 font-bold">Data</th>
                  <th className="px-6 py-3 font-bold">Status</th>
                  <th className="px-6 py-3 font-bold text-right">Taxa MP</th>
                  <th className="px-6 py-3 font-bold text-right">Valor Líquido</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filteredOrders.map((ord) => {
                  const val = Number(ord.total_amount || ord.subtotal || 0);
                  const fee = val * 0.0099;
                  const net = val - fee;

                  return (
                    <tr key={ord.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="px-6 py-3.5 font-bold text-zinc-900">
                        #{ord.short_id || ord.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-3.5 text-zinc-500">
                        {new Date(ord.created_at).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-3.5">
                        <span className="text-[9px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded uppercase font-bold">
                          {ord.status}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-right text-zinc-500">
                        - {formatBRL(fee)}
                      </td>
                      <td className="px-6 py-3.5 text-right font-bold text-emerald-600">
                        {formatBRL(net)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center text-xs font-mono text-zinc-400">
            Nenhuma transação liquidada no período selecionado.
          </div>
        )}
      </div>

    </div>
  );
}