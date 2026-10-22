'use client';

import React from 'react';
import { Crown, Star, Mail, ArrowUpRight, Trophy, ShieldCheck } from 'lucide-react';

const SENADO_MEMBERS = [
  { id: 'VIP-001', name: 'Thiago Mendes', email: 'thiago.mendes@gmail.com', ltv: 2450.00, tier: 'Black', lastPurchase: 'Há 5 dias', orders: 6 },
  { id: 'VIP-002', name: 'Marina Costa', email: 'marina.cst@hotmail.com', ltv: 1890.50, tier: 'Gold', lastPurchase: 'Há 12 dias', orders: 4 },
  { id: 'VIP-003', name: 'Lucas H. Silveira', email: 'lucashs@empresa.com.br', ltv: 1150.00, tier: 'Gold', lastPurchase: 'Há 1 mês', orders: 3 },
  { id: 'VIP-004', name: 'Pedro H. Nogueira', email: 'ph.nogueira@gmail.com', ltv: 650.00, tier: 'Silver', lastPurchase: 'Há 2 meses', orders: 2 },
  { id: 'VIP-005', name: 'Camila Fontenelle', email: 'camila.font@yahoo.com', ltv: 480.00, tier: 'Silver', lastPurchase: 'Há 15 dias', orders: 2 },
];

export default function SenadoVipPage() {
  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 font-sans">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 font-serif tracking-wide uppercase">Senado VIP</h1>
          <p className="text-xs text-zinc-500 font-mono mt-1">Gestão de Patronos, LTV e Early Access</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-zinc-700 bg-white border border-zinc-300 rounded hover:bg-zinc-50 transition-colors flex items-center gap-1.5 shadow-sm">
            <Mail className="w-3.5 h-3.5" /> Exportar Lista
          </button>
          <button className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-zinc-900 border border-zinc-900 rounded hover:bg-zinc-800 transition-colors flex items-center gap-2 shadow-sm">
            <Crown className="w-4 h-4" /> Disparar Early Access
          </button>
        </div>
      </div>

      {/* KPIs DO SENADO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        
        <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">Total de Membros</span>
            <ShieldCheck className="w-4 h-4 text-zinc-400" />
          </div>
          <div>
            <span className="text-3xl font-black text-zinc-900 tracking-tight">142</span>
            <p className="text-[10px] font-mono text-emerald-600 mt-2 font-bold">+12 novos neste mês</p>
          </div>
        </div>

        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-800/50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="flex justify-between items-start mb-2 relative z-10">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">LTV Médio (Lifetime Value)</span>
            <ArrowUpRight className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="relative z-10">
            <span className="text-3xl font-black text-white tracking-tight">{formatBRL(1324.10)}</span>
            <p className="text-[10px] font-mono text-zinc-400 mt-2">Gasto histórico por VIP</p>
          </div>
        </div>

        <div className="bg-amber-50 p-6 rounded-lg border border-amber-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-amber-800">Receita do Clube</span>
            <Trophy className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <span className="text-xl font-bold text-amber-900 tracking-tight block">{formatBRL(188022.20)}</span>
            <p className="text-[10px] font-mono text-amber-700 mt-2">Representa 42% da receita total</p>
          </div>
        </div>

      </div>

      {/* TABELA DE MEMBROS VIP */}
      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/50">
          <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
            <Star className="w-4 h-4 text-zinc-500" /> Ranking de Patronos
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 font-bold">Patrono</th>
                <th className="px-6 py-4 font-bold">Tier</th>
                <th className="px-6 py-4 font-bold text-right">Pedidos</th>
                <th className="px-6 py-4 font-bold text-right">LTV (Total Gasto)</th>
                <th className="px-6 py-4 font-bold text-right">Última Compra</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {SENADO_MEMBERS.map((member) => (
                <tr key={member.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-zinc-900 block font-sans text-sm">{member.name}</span>
                    <span className="text-[9px] text-zinc-400">{member.email}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded flex items-center gap-1 w-fit ${
                      member.tier === 'Black' ? 'bg-zinc-900 text-amber-400 border border-zinc-800' : 
                      member.tier === 'Gold' ? 'bg-amber-100 text-amber-700 border border-amber-200' : 
                      'bg-slate-100 text-slate-600 border border-slate-200'
                    }`}>
                      {member.tier === 'Black' && <Crown className="w-3 h-3" />}
                      {member.tier}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-zinc-600">
                    {member.orders}x
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-emerald-600">
                    {formatBRL(member.ltv)}
                  </td>
                  <td className="px-6 py-4 text-right text-zinc-500">
                    {member.lastPurchase}
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