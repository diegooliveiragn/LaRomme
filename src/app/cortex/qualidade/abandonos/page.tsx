'use client';

import React from 'react';
import { ShoppingCart, MessageCircle, AlertCircle, RefreshCcw } from 'lucide-react';

const ABANDONED_CARTS = [
  { id: '1049', customer: 'Thiago Mendes', email: 'thiago.mendes@gmail.com', value: 189.90, item: '1x TENAX T-SHIRT (G)', time: 'Há 22 min', risk: 'high', reason: 'Abandono no Frete' },
  { id: '1050', customer: 'Marina Costa', email: 'marina.cst@hotmail.com', value: 399.80, item: '1x VESTIGIUM (M), 1x UMBRA', time: 'Há 1 hora', risk: 'high', reason: 'Pix Expirado' },
  { id: '1042', customer: 'Lucas H. Silveira', email: 'lucashs@empresa.com.br', value: 159.90, item: '1x SIGNUM DAD HAT', time: 'Há 4 horas', risk: 'medium', reason: 'Abandono no Cartão' },
];

export default function AbandonosPage() {
  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 font-serif tracking-wide uppercase">Gargalos & Abandonos</h1>
          <p className="text-xs text-zinc-500 font-mono mt-1">Recuperação Ativa de Receita • Últimas 24h</p>
        </div>
        <button className="px-3 py-1.5 text-xs font-medium text-zinc-600 bg-white border border-zinc-300 rounded hover:bg-zinc-50 transition-colors flex items-center gap-1.5 shadow-sm">
          <RefreshCcw className="w-3.5 h-3.5" /> Sincronizar Gateway
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-sm">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 block mb-3">Receita na Mesa</span>
          <span className="text-2xl font-bold text-zinc-900 tracking-tight">{formatBRL(749.60)}</span>
          <p className="text-[10px] font-mono text-rose-500 mt-2 flex items-center gap-1"><AlertCircle className="w-3 h-3"/> Risco de perda em 3 carrinhos</p>
        </div>
        <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-sm">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 block mb-3">Taxa de Recuperação</span>
          <span className="text-2xl font-bold text-zinc-900 tracking-tight">18.5%</span>
          <p className="text-[10px] font-mono text-emerald-600 mt-2 flex items-center gap-1">Acima da média do mercado (12%)</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/50">
          <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
            <ShoppingCart className="w-4 h-4 text-zinc-500" /> Fila de Abordagem do Concierge
          </h2>
        </div>
        <div className="divide-y divide-zinc-100">
          {ABANDONED_CARTS.map((cart) => (
            <div key={cart.id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-zinc-50 transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-sm font-bold text-zinc-900">{cart.customer}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-rose-600 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded">{cart.time}</span>
                </div>
                <p className="text-[11px] font-mono text-zinc-500">{cart.email}</p>
                <div className="mt-3 flex items-center gap-3 text-xs font-mono text-zinc-600">
                  <span className="font-bold text-zinc-900">{cart.item}</span>
                  <span>&bull;</span>
                  <span>Motivo presumido: <span className="font-bold text-amber-600">{cart.reason}</span></span>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-3 w-full md:w-auto border-t md:border-t-0 border-zinc-100 pt-4 md:pt-0">
                <span className="text-lg font-bold text-zinc-900">{formatBRL(cart.value)}</span>
                <button className="w-full md:w-auto px-4 py-2 bg-[#25D366] hover:bg-[#1DA851] text-white text-[10px] font-bold uppercase tracking-widest rounded transition-colors flex items-center justify-center gap-2 shadow-sm">
                  <MessageCircle className="w-3.5 h-3.5" /> Chamar no WhatsApp
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}