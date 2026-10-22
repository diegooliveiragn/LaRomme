'use client';

import React from 'react';
import { RotateCcw, AlertTriangle, FileWarning, Ruler, Truck } from 'lucide-react';

const REVERSE_LOGISTICS = [
  { id: 'REV-092', item: 'TENAX T-SHIRT', size: 'M', reason: 'Modelagem: Ficou justa nos ombros', frequency: '3 ocorrências', cost: 35.90, action: 'Ajustar Tech Pack (Cava)', status: 'action_required' },
  { id: 'REV-091', item: 'UMBRA 5-PANEL', size: 'TU', reason: 'Produto: Fecho soltando costura', frequency: '1 ocorrência', cost: 28.50, action: 'Acionar Qualidade Confecção', status: 'monitoring' },
  { id: 'REV-089', item: 'LIBERTAS REGATA', size: 'G', reason: 'Cliente: Arrependimento de cor', frequency: '1 ocorrência', cost: 42.00, action: 'Devolver ao Acervo', status: 'resolved' },
];

export default function ReversaPage() {
  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 font-serif tracking-wide uppercase">Logística Reversa</h1>
          <p className="text-xs text-zinc-500 font-mono mt-1">Matriz de Fricção e Melhoria Contínua de Tech Pack</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 block mb-3">Taxa de Devolução (Mês)</span>
          <span className="text-2xl font-bold text-zinc-900 tracking-tight">2.4%</span>
          <p className="text-[10px] font-mono text-emerald-600 mt-2">Excelente (Mercado moda: 15-20%)</p>
        </div>
        <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 block mb-3">Custo de Fretes Reversos</span>
          <span className="text-2xl font-bold text-rose-600 tracking-tight">{formatBRL(106.40)}</span>
          <p className="text-[10px] font-mono text-zinc-400 mt-2 flex items-center gap-1"><Truck className="w-3 h-3"/> Abatido da Margem Líquida</p>
        </div>
        <div className="bg-rose-50 p-5 rounded-lg border border-rose-100 shadow-sm flex flex-col justify-between">
          <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-rose-800 block mb-3 flex items-center gap-1"><AlertTriangle className="w-3 h-3"/> Alerta de Modelagem</span>
          <span className="text-sm font-bold text-rose-900 tracking-tight leading-snug">Atenção ao SKU: TENAX (M)</span>
          <p className="text-[10px] font-mono text-rose-700 mt-2">Padrão de devolução detectado.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50/50">
          <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
            <Ruler className="w-4 h-4 text-zinc-500" /> Matriz de Fricção (Autópsia de Produto)
          </h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-3 font-bold">Artefato & SKU</th>
                <th className="px-6 py-3 font-bold">Motivo (Sintoma)</th>
                <th className="px-6 py-3 font-bold">Custo de Perda</th>
                <th className="px-6 py-3 font-bold">Ação Exigida (Tech Pack)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {REVERSE_LOGISTICS.map((log) => (
                <tr key={log.id} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-bold text-zinc-900 block">{log.item}</span>
                    <span className="text-[10px] text-zinc-400">TAM: {log.size} &bull; {log.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-zinc-700 block">{log.reason}</span>
                    <span className={`text-[9px] font-bold uppercase tracking-widest mt-1 inline-block px-1.5 py-0.5 rounded ${
                      log.status === 'action_required' ? 'bg-rose-100 text-rose-700' : 'bg-zinc-100 text-zinc-600'
                    }`}>
                      {log.frequency}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-bold text-rose-600">
                    {formatBRL(log.cost)}
                  </td>
                  <td className="px-6 py-4">
                    {log.status === 'action_required' ? (
                      <button className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-[9px] font-bold uppercase tracking-widest rounded flex items-center gap-1.5 transition-colors">
                        <FileWarning className="w-3 h-3" /> {log.action}
                      </button>
                    ) : (
                      <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest flex items-center gap-1">
                        <RotateCcw className="w-3 h-3" /> {log.action}
                      </span>
                    )}
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