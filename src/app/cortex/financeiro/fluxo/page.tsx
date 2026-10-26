'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  TrendingUp, TrendingDown, DollarSign, Calendar,
  ArrowUpRight, ArrowDownRight, RefreshCw, Loader2,
  FileText, Download, Wallet, Layers, ShieldCheck
} from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

type PeriodOption = 'MES_ATUAL' | '30_DIAS' | '60_DIAS' | '90_DIAS' | 'YTD';

interface FinancialOrder {
  id: string;
  short_id?: string;
  customer_name?: string;
  customer_email?: string;
  total_amount: number;
  status: string;
  created_at: string;
}

export default function FluxoDeCaixaPage() {
  const [orders, setOrders] = useState<FinancialOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<PeriodOption>('MES_ATUAL');

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('id, short_id, customer_name, customer_email, total_amount, status, created_at')
        .in('status', ['paid', 'shipped', 'delivered'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err: any) {
      console.error('Erro ao carregar livro-razão de pedidos:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Filtragem Dinâmica por Período
  const filteredOrders = useMemo(() => {
    const now = new Date();
    
    return orders.filter(order => {
      const orderDate = new Date(order.created_at);
      
      switch (period) {
        case 'MES_ATUAL':
          return (
            orderDate.getMonth() === now.getMonth() &&
            orderDate.getFullYear() === now.getFullYear()
          );
        case '30_DIAS': {
          const past30 = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          return orderDate >= past30;
        }
        case '60_DIAS': {
          const past60 = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
          return orderDate >= past60;
        }
        case '90_DIAS': {
          const past90 = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
          return orderDate >= past90;
        }
        case 'YTD':
          return orderDate.getFullYear() === now.getFullYear();
        default:
          return true;
      }
    });
  }, [orders, period]);

  // Cálculos Financeiros da Janela Selecionada
  const receitaEntradas = filteredOrders.reduce((sum, o) => sum + Number(o.total_amount || 0), 0);
  const totalTransacoes = filteredOrders.length;
  
  // Deduções Operacionais Padrão LaRomme
  const impostosSimples = receitaEntradas * 0.06; // 6%
  const taxasGateway = receitaEntradas * 0.0499; // 4.99% Mercado Pago
  const cmvEstimado = receitaEntradas * 0.35; // 35% Custo Têxtil / Confecção
  const totalSaidasEstimadas = impostosSimples + taxasGateway + cmvEstimado;
  
  const saldoLiquidoApurado = receitaEntradas - totalSaidasEstimadas;
  const ticketMedioPeriodo = totalTransacoes > 0 ? receitaEntradas / totalTransacoes : 0;

  const getPeriodLabel = () => {
    switch (period) {
      case 'MES_ATUAL': return 'Mês Corrente';
      case '30_DIAS': return 'Últimos 30 Dias';
      case '60_DIAS': return 'Últimos 60 Dias';
      case '90_DIAS': return 'Últimos 90 Dias';
      case 'YTD': return 'Acumulado do Ano (YTD)';
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 font-sans">
      
      {/* CABEÇALHO COM SELETOR TEMPORAL */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 font-bold block mb-1">
            Tesouraria & Extratos Operacionais
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-zinc-900 uppercase flex items-center gap-3">
            Fluxo de Caixa & Extrato
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-1 font-bold">
            Entradas Liquidadas, Provisões de Custos e Balanço de Período
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* BOTÕES DE JANELA TEMPORAL */}
          <div className="flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs">
            {(['MES_ATUAL', '30_DIAS', '60_DIAS', '90_DIAS', 'YTD'] as PeriodOption[]).map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider transition-all ${
                  period === p
                    ? 'bg-zinc-900 text-white font-black shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                {p === 'MES_ATUAL' ? 'Mês Atual' : p.replace('_', ' ')}
              </button>
            ))}
          </div>

          <button
            onClick={fetchOrders}
            disabled={loading}
            className="p-2 bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-300 rounded-lg transition-all shadow-2xs disabled:opacity-50"
            title="Atualizar Livro-Razão"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPIS DO PERÍODO SELECIONADO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-black uppercase tracking-wider text-emerald-800">
              (+) Entradas Brutas
            </span>
            <ArrowUpRight className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-3xl font-black text-zinc-900 tabular-nums tracking-tight block font-mono">
            {formatBRL(receitaEntradas)}
          </span>
          <span className="text-xs font-bold text-zinc-500 mt-2 block">
            {totalTransacoes} pedidos em {getPeriodLabel()}
          </span>
        </div>

        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-black uppercase tracking-wider text-rose-800">
              (-) Saídas & Provisões
            </span>
            <ArrowDownRight className="w-4 h-4 text-rose-600" />
          </div>
          <span className="text-3xl font-black text-rose-600 tabular-nums tracking-tight block font-mono">
            - {formatBRL(totalSaidasEstimadas)}
          </span>
          <span className="text-xs font-bold text-zinc-500 mt-2 block">
            Fisco (6%) + Gateway (4.99%) + CMV (35%)
          </span>
        </div>

        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-600">
              (=) Saldo Líquido
            </span>
            <Wallet className="w-4 h-4 text-zinc-700" />
          </div>
          <span className={`text-3xl font-black tabular-nums tracking-tight block font-mono ${
            saldoLiquidoApurado >= 0 ? 'text-zinc-900' : 'text-rose-600'
          }`}>
            {formatBRL(saldoLiquidoApurado)}
          </span>
          <span className="text-xs font-bold text-emerald-700 mt-2 block">
            Margem Livre na Janela
          </span>
        </div>

        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500">
              Ticket Médio Janela
            </span>
            <TrendingUp className="w-4 h-4 text-zinc-600" />
          </div>
          <span className="text-3xl font-black text-zinc-900 tabular-nums tracking-tight block font-mono">
            {formatBRL(ticketMedioPeriodo)}
          </span>
          <span className="text-xs font-bold text-zinc-500 mt-2 block">
            Média por pedido liquidado
          </span>
        </div>

      </div>

      {/* EXTRATO ANALÍTICO / LIVRO-RAZÃO ITEM A ITEM */}
      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/70 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-zinc-600" />
            <h2 className="text-xs font-black text-zinc-900 tracking-wider uppercase">
              Extrato Analítico de Lançamentos ({getPeriodLabel()})
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500 font-bold tabular-nums">
            {filteredOrders.length} lançamentos apurados
          </span>
        </div>

        {loading ? (
          <div className="p-16 text-center text-xs font-mono font-bold text-zinc-500 flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
            Consolidando movimentações da janela...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-16 text-center text-xs font-mono font-bold text-zinc-500">
            Nenhuma transação liquidada encontrada para o período selecionado.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-sans">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider text-[10px] font-mono">
                <tr>
                  <th className="px-6 py-3.5 font-bold">Data / Hora</th>
                  <th className="px-6 py-3.5 font-bold">Identificador</th>
                  <th className="px-6 py-3.5 font-bold">Patrono / Descrição</th>
                  <th className="px-6 py-3.5 font-bold text-right">Fisco (6%)</th>
                  <th className="px-6 py-3.5 font-bold text-right">Gateway (4.99%)</th>
                  <th className="px-6 py-3.5 font-bold text-right">Líquido Estimado</th>
                  <th className="px-6 py-3.5 font-bold text-right">Valor Bruto</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 font-mono">
                {filteredOrders.map((ord) => {
                  const gross = Number(ord.total_amount || 0);
                  const fTax = gross * 0.06;
                  const gFee = gross * 0.0499;
                  const netEst = gross - fTax - gFee;

                  return (
                    <tr key={ord.id} className="hover:bg-zinc-50/70 transition-colors">
                      <td className="px-6 py-4 text-zinc-500">
                        {new Date(ord.created_at).toLocaleDateString('pt-BR')} às {new Date(ord.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </td>
                      <td className="px-6 py-4 font-black text-zinc-900">
                        #{ord.short_id || ord.id.slice(0, 8)}
                      </td>
                      <td className="px-6 py-4 font-sans">
                        <span className="font-bold text-zinc-800 block">{ord.customer_name || 'Patrono'}</span>
                        <span className="text-[11px] font-mono text-zinc-400">Liquidação Pix Mercado Pago</span>
                      </td>
                      <td className="px-6 py-4 text-right text-rose-600 font-bold tabular-nums">
                        - {formatBRL(fTax)}
                      </td>
                      <td className="px-6 py-4 text-right text-rose-600 font-bold tabular-nums">
                        - {formatBRL(gFee)}
                      </td>
                      <td className="px-6 py-4 text-right font-black text-emerald-700 tabular-nums">
                        {formatBRL(netEst)}
                      </td>
                      <td className="px-6 py-4 text-right font-black text-zinc-900 tabular-nums text-sm bg-zinc-50/50">
                        {formatBRL(gross)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
}