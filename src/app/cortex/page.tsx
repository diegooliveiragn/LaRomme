'use client';

import React from 'react';

export default function CortexDashboardPage() {
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
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            Consolidado em Tempo Real
          </span>
        </div>
      </div>

      {/* CARDS DE KPIS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="p-5 rounded-xl border bg-slate-900/40 border-slate-800/80 shadow-sm space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
            <span>Faturamento Bruto (Hoje)</span>
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div className="text-2xl font-bold tracking-tight">R$ 0,00</div>
          <div className="text-[11px] text-slate-500 border-t border-slate-800/60 pt-2 flex justify-between">
            <span>Meta Diária: R$ 2.500</span>
            <span className="font-semibold text-slate-400">0%</span>
          </div>
        </div>

        <div className="p-5 rounded-xl border bg-slate-900/40 border-slate-800/80 shadow-sm space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
            <span>Vendas Concluídas</span>
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          <div className="text-2xl font-bold tracking-tight">0 <span className="text-xs font-normal text-slate-400">pedidos</span></div>
          <div className="text-[11px] text-slate-500 border-t border-slate-800/60 pt-2">
            Ticket Médio: <span className="font-semibold text-slate-300">R$ 0,00</span>
          </div>
        </div>

        <div className="p-5 rounded-xl border bg-amber-500/5 border-amber-500/20 shadow-sm space-y-3">
          <div className="flex justify-between items-center text-xs text-amber-400 font-medium">
            <span>Pix Pendentes / Abandonos</span>
            <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <div className="text-2xl font-bold tracking-tight text-amber-400">0</div>
          <div className="text-[11px] text-amber-400/80 border-t border-amber-500/20 pt-2">
            Receita Retida: <span className="font-semibold">R$ 0,00</span>
          </div>
        </div>

        <div className="p-5 rounded-xl border bg-slate-900/40 border-slate-800/80 shadow-sm space-y-3">
          <div className="flex justify-between items-center text-xs text-slate-400 font-medium">
            <span>Alertas de Estoque (WMS)</span>
            <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
          <div className="text-2xl font-bold tracking-tight">0 <span className="text-xs font-normal text-slate-400">SKUs</span></div>
          <div className="text-[11px] text-emerald-400 border-t border-slate-800/60 pt-2">
            Estoque Fisico Regular
          </div>
        </div>
      </div>

      {/* ÁREA PRINCIPAL DOS GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Painel do Gráfico */}
        <div className="lg:col-span-2 p-6 rounded-xl border bg-slate-900/40 border-slate-800/80 flex flex-col h-96">
          <div className="flex justify-between items-center pb-4 border-b border-slate-800/60 mb-6">
            <h2 className="text-sm font-semibold tracking-wide">DRE Operacional Simplificado (Entradas vs. Custos)</h2>
            <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono">Apuração Mensal</span>
          </div>
          <div className="flex-1 rounded-lg border border-dashed border-slate-800 flex items-center justify-center text-xs text-slate-500 font-medium">
            [ Gráfico de Curva Financeira em Tempo Real ]
          </div>
        </div>

        {/* Auditoria / Log */}
        <div className="p-6 rounded-xl border bg-slate-900/40 border-slate-800/80 flex flex-col h-96">
          <h2 className="text-sm font-semibold tracking-wide pb-4 border-b border-slate-800/60 mb-6">Atividades do Sistema</h2>
          <div className="space-y-4 flex-1 overflow-y-auto">
            <div className="flex space-x-3 items-start text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1 shrink-0" />
              <div>
                <p className="font-semibold text-slate-200">Autenticação Executiva Concluída</p>
                <p className="text-slate-400 text-[11px] mt-0.5">Sessão blindada ativada via Supabase Auth.</p>
              </div>
            </div>
            <div className="flex space-x-3 items-start text-xs">
              <span className="w-2 h-2 rounded-full bg-amber-400 mt-1 shrink-0" />
              <div>
                <p className="font-semibold text-slate-200">Interface Ergonômica Ativada</p>
                <p className="text-slate-400 text-[11px] mt-0.5">Tipografia Sans-serif e Suporte a Modo Claro/Escuro.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}