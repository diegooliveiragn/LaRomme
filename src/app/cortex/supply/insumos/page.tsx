'use client';

import React from 'react';
import { Package, Scissors, AlertTriangle, Plus, Edit2, Archive, DollarSign } from 'lucide-react';

const INSUMOS_DATA = [
  { id: 'INS-01', category: 'Embalagem', name: 'Caixa Rígida Preta (Padrão)', cost: 4.80, stock: 124, status: 'warning', leadTime: '15 dias' },
  { id: 'INS-02', category: 'Embalagem', name: 'Papel Seda Personalizado', cost: 0.60, stock: 1850, status: 'healthy', leadTime: '7 dias' },
  { id: 'INS-03', category: 'Aviamento', name: 'Tag Origo c/ Cordão', cost: 0.90, stock: 45, status: 'critical', leadTime: '10 dias' },
  { id: 'INS-04', category: 'Embalagem', name: 'Fita Gomada Personalizada', cost: 0.35, stock: 500, status: 'healthy', leadTime: '5 dias' },
  { id: 'INS-05', category: 'Brinde VIP', name: 'Toalha Esporte (Beach Tennis)', cost: 8.40, stock: 22, status: 'warning', leadTime: '20 dias' },
];

export default function GestaoInsumosPage() {
  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 font-sans">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 font-serif tracking-wide uppercase">Gestão de Insumos</h1>
          <p className="text-xs text-zinc-500 font-mono mt-1">Embalagens, Aviamentos e Custo de Unboxing</p>
        </div>
        <button className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-white bg-zinc-900 border border-zinc-900 rounded hover:bg-zinc-800 transition-colors flex items-center gap-2 shadow-sm">
          <Plus className="w-4 h-4" /> Cadastrar Insumo
        </button>
      </div>

      {/* KPIs DE SUPRIMENTOS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        
        <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">Custo Base Unboxing</span>
            <Package className="w-4 h-4 text-zinc-400" />
          </div>
          <div>
            <span className="text-3xl font-black text-zinc-900 tracking-tight">{formatBRL(6.65)}</span>
            <p className="text-[10px] font-mono text-zinc-500 mt-2">Caixa + Seda + Tag + Fita</p>
          </div>
        </div>

        <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-zinc-800/50 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="flex justify-between items-start mb-2 relative z-10">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">Capital Imobilizado</span>
            <DollarSign className="w-4 h-4 text-zinc-500" />
          </div>
          <div className="relative z-10">
            <span className="text-3xl font-black text-white tracking-tight">{formatBRL(2105.70)}</span>
            <p className="text-[10px] font-mono text-zinc-400 mt-2">Valor preso em suprimentos base</p>
          </div>
        </div>

        <div className="bg-rose-50 p-6 rounded-lg border border-rose-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-rose-800">Alerta Operacional</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div>
            <span className="text-lg font-bold text-rose-900 tracking-tight leading-snug block">Ruptura de Tags em 5 dias</span>
            <p className="text-[10px] font-mono text-rose-700 mt-2">Apenas 45 unidades restantes.</p>
          </div>
        </div>

      </div>

      {/* TABELA DE ESTOQUE DE INSUMOS */}
      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/50">
          <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
            <Archive className="w-4 h-4 text-zinc-500" /> Inventário Físico
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4 font-bold">Item</th>
                <th className="px-6 py-4 font-bold">Categoria</th>
                <th className="px-6 py-4 font-bold">Custo Unit.</th>
                <th className="px-6 py-4 font-bold">Estoque Físico</th>
                <th className="px-6 py-4 font-bold text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {INSUMOS_DATA.map((item) => (
                <tr key={item.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-zinc-900 block font-sans text-sm">{item.name}</span>
                    <span className="text-[9px] text-zinc-400">Ref: {item.id} &bull; Reposição: {item.leadTime}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-[10px] uppercase tracking-widest bg-zinc-100 text-zinc-600 px-2 py-1 rounded">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-zinc-700">
                    {formatBRL(item.cost)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-bold text-sm ${
                        item.status === 'critical' ? 'text-rose-600' : 
                        item.status === 'warning' ? 'text-amber-600' : 'text-emerald-600'
                      }`}>
                        {item.stock} un.
                      </span>
                      {item.status === 'critical' && <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors rounded hover:bg-zinc-100" title="Editar Insumo">
                      <Edit2 className="w-4 h-4" />
                    </button>
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