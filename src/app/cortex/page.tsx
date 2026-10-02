'use client';

import React from 'react';

export default function CortexDashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      
      {/* CABEÇALHO DA PÁGINA */}
      <div className="flex justify-between items-end border-b border-zinc-900 pb-6">
        <div>
          <h1 className="font-serif text-2xl uppercase tracking-[0.15em] text-white">OLHO DE HÓRUS</h1>
          <p className="text-xs text-zinc-500 uppercase tracking-widest mt-2">Visão Executiva & Telemetria em Tempo Real</p>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-zinc-400 uppercase tracking-widest">Data de Referência</div>
          <div className="text-xs text-white font-bold mt-1 tracking-widest">
            {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* WIDGETS PRIMÁRIOS (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="border border-zinc-900 bg-[#080808] p-5">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Receita do Dia</span>
            <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <div className="mt-4">
            <span className="text-2xl font-serif text-white">R$ 0,00</span>
          </div>
          <div className="mt-2 text-[9px] text-zinc-500 uppercase tracking-widest border-t border-zinc-900 pt-2">
            Aguardando sincronização...
          </div>
        </div>

        {/* Card 2 */}
        <div className="border border-zinc-900 bg-[#080808] p-5">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Pedidos Pagos</span>
            <svg className="w-4 h-4 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-2xl font-serif text-white">0</span>
            <span className="text-xs text-zinc-500">vendas hoje</span>
          </div>
          <div className="mt-2 text-[9px] text-zinc-500 uppercase tracking-widest border-t border-zinc-900 pt-2">
            Aguardando sincronização...
          </div>
        </div>

        {/* Card 3 */}
        <div className="border border-zinc-900 bg-[#080808] p-5">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-amber-500/70 uppercase tracking-widest">Abandonos de Pix</span>
            <svg className="w-4 h-4 text-amber-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-2xl font-serif text-amber-500">0</span>
            <span className="text-xs text-zinc-500">potenciais perdidos</span>
          </div>
          <div className="mt-2 text-[9px] text-amber-500/50 uppercase tracking-widest border-t border-zinc-900 pt-2">
            Módulo de Recuperação Off
          </div>
        </div>

        {/* Card 4 */}
        <div className="border border-zinc-900 bg-[#080808] p-5">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Estoque Crítico</span>
            <svg className="w-4 h-4 text-red-500/70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
          </div>
          <div className="mt-4 flex items-baseline space-x-2">
            <span className="text-2xl font-serif text-white">0</span>
            <span className="text-xs text-zinc-500">SKUs em alerta</span>
          </div>
          <div className="mt-2 text-[9px] text-zinc-500 uppercase tracking-widest border-t border-zinc-900 pt-2">
            Sem alertas WMS
          </div>
        </div>
      </div>

      {/* ÁREA DE GRÁFICOS E RADAR (MOCKUP VISUAL) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-4">
        
        {/* Gráfico Principal */}
        <div className="lg:col-span-2 border border-zinc-900 bg-[#080808] p-6 h-96 flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b border-zinc-900 pb-4">
            <span className="text-xs font-serif uppercase tracking-widest">Fluxo de Caixa Operacional</span>
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest bg-zinc-900 px-2 py-1">Visão Mensal</span>
          </div>
          <div className="flex-1 border border-dashed border-zinc-800 flex items-center justify-center text-[10px] text-zinc-600 uppercase tracking-widest">
            [ Área reservada para Motor Gráfico de Receita vs. Custo ]
          </div>
        </div>

        {/* Radar Competitivo / Últimas Ações */}
        <div className="border border-zinc-900 bg-[#080808] p-6 h-96 flex flex-col">
          <div className="mb-6 border-b border-zinc-900 pb-4">
            <span className="text-xs font-serif uppercase tracking-widest">Log do Sistema</span>
          </div>
          <div className="flex-1 space-y-4">
            <div className="flex space-x-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
              <div>
                <p className="text-[10px] text-white uppercase tracking-widest">Acesso CEO Autenticado</p>
                <p className="text-[9px] text-zinc-500 font-sans mt-0.5">Sessão iniciada com sucesso via Supabase Auth.</p>
              </div>
            </div>
            <div className="flex space-x-3 items-start">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-600 mt-1.5 shrink-0" />
              <div>
                <p className="text-[10px] text-white uppercase tracking-widest">Cadeado Front-end Ativado</p>
                <p className="text-[9px] text-zinc-500 font-sans mt-0.5">Rotas protegidas. Estrutura de banco mapeada.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}