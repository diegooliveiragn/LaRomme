'use client';

import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Clock, AlertTriangle, ArrowRightLeft, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

const CASH_FLOW_DATA = [
  { id: 'REC-001', type: 'in', description: 'Recebíveis Mercado Pago', date: 'Hoje', amount: 3450.00, status: 'cleared' },
  { id: 'PAY-012', type: 'out', description: 'Fatura MelhorEnvio', date: 'Amanhã', amount: 890.50, status: 'pending' },
  { id: 'PAY-013', type: 'out', description: 'Adiantamento Facção (Lote 03)', date: '15/Nov', amount: 4500.00, status: 'scheduled' },
  { id: 'REC-002', type: 'in', description: 'Liberação Antecipação Cielo', date: '16/Nov', amount: 2100.00, status: 'scheduled' },
  { id: 'PAY-014', type: 'out', description: 'Vercel / Supabase / Domínios', date: '20/Nov', amount: 185.00, status: 'scheduled' },
];

export default function FluxoCaixaPage() {
  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 font-serif tracking-wide uppercase">Fluxo de Caixa</h1>
          <p className="text-xs text-zinc-500 font-mono mt-1">Runway, Liquidez e Obrigações • 30 Dias</p>
        </div>
        <div className="flex gap-2">
           <button className="px-3 py-1.5 text-xs font-medium text-zinc-600 bg-white border border-zinc-300 rounded hover:bg-zinc-50 transition-colors flex items-center gap-1.5 shadow-sm">
             <ArrowRightLeft className="w-3.5 h-3.5" /> Transferência Interna
           </button>
           <button className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-zinc-900 border border-zinc-900 rounded hover:bg-zinc-800 transition-colors shadow-sm">
             Novo Lançamento
           </button>
        </div>
      </div>

      {/* KPIs DE LIQUIDEZ E RUNWAY */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="md:col-span-2 bg-zinc-900 p-6 rounded-lg border border-zinc-800 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-800/50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 block">Saldo Disponível (Caixa Hoje)</span>
            <Wallet className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="relative z-10">
            <span className="text-3xl font-black text-white tracking-tight">{formatBRL(12845.50)}</span>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-mono text-zinc-400 border-r border-zinc-700 pr-2">C6 Bank: {formatBRL(8400)}</span>
              <span className="text-[10px] font-mono text-zinc-400">Mercado Pago: {formatBRL(4445.50)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 block mb-3">Previsão (7 Dias)</span>
          <div>
            <span className="text-xl font-bold text-zinc-900 tracking-tight">{formatBRL(4659.50)}</span>
            <p className="text-[10px] font-mono text-emerald-600 mt-1 flex items-center gap-1"><ArrowUpCircle className="w-3 h-3"/> + {formatBRL(5550)} Entradas</p>
            <p className="text-[10px] font-mono text-rose-600 mt-1 flex items-center gap-1"><ArrowDownCircle className="w-3 h-3"/> - {formatBRL(890.50)} Saídas</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-emerald-200 shadow-sm flex flex-col justify-between bg-emerald-50/30">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-800 block mb-3">Runway (Fôlego)</span>
          <div>
             <span className="text-2xl font-black text-emerald-700 tracking-tight">4.2 Meses</span>
             <p className="text-[10px] font-mono text-emerald-600 mt-2 leading-relaxed">O caixa atual cobre as despesas fixas até Fevereiro/2027 sem novas vendas.</p>
          </div>
        </div>
      </div>

      {/* TIMELINE DE CONTAS A PAGAR / RECEBER */}
      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/50">
          <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
            <Clock className="w-4 h-4 text-zinc-500" /> Projeção de Lançamentos
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-3 font-bold">Data</th>
                <th className="px-6 py-3 font-bold">Descrição do Lançamento</th>
                <th className="px-6 py-3 font-bold">Tipo</th>
                <th className="px-6 py-3 font-bold text-right">Valor Projetado</th>
                <th className="px-6 py-3 font-bold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {CASH_FLOW_DATA.map((entry) => (
                <tr key={entry.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4 font-bold text-zinc-700 whitespace-nowrap">{entry.date}</td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-zinc-900 block">{entry.description}</span>
                    <span className="text-[9px] text-zinc-400">{entry.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    {entry.type === 'in' ? (
                      <span className="text-emerald-600 flex items-center gap-1.5 font-bold"><TrendingUp className="w-3.5 h-3.5" /> Receita</span>
                    ) : (
                      <span className="text-rose-600 flex items-center gap-1.5 font-bold"><TrendingDown className="w-3.5 h-3.5" /> Despesa</span>
                    )}
                  </td>
                  <td className={`px-6 py-4 text-right font-bold ${entry.type === 'in' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {entry.type === 'in' ? '+' : '-'} {formatBRL(entry.amount)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {entry.status === 'cleared' && <span className="inline-block px-2 py-1 text-[9px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-700 rounded">Liquidado</span>}
                    {entry.status === 'pending' && <span className="inline-block px-2 py-1 text-[9px] font-bold uppercase tracking-widest bg-amber-100 text-amber-700 rounded flex items-center gap-1 ml-auto w-fit"><AlertTriangle className="w-3 h-3" /> Vence Hoje</span>}
                    {entry.status === 'scheduled' && <span className="inline-block px-2 py-1 text-[9px] font-bold uppercase tracking-widest bg-zinc-100 text-zinc-600 rounded">Agendado</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}