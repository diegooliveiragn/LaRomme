'use client';

import React from 'react';
import Link from 'next/link';

export default function CortexDashboard() {
  return (
    <div className="space-y-6 font-sans">
      
      {/* CABEÇALHO DO DASHBOARD */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 font-serif tracking-wide">COCKPIT DE COMANDO</h1>
          <p className="text-xs text-zinc-500 font-mono mt-1">Visão Geral da Operação • Últimos 30 dias</p>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 text-xs font-medium text-zinc-600 bg-white border border-zinc-300 rounded hover:bg-zinc-50 transition-colors">
            Exportar Relatório
          </button>
          <button className="px-3 py-1.5 text-xs font-bold text-white bg-zinc-900 rounded hover:bg-zinc-800 transition-colors">
            Nova Campanha
          </button>
        </div>
      </div>

      {/* 1. TERMÔMETRO FINANCEIRO (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-sm flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 font-bold">RECEITA BRUTA (MÊS)</span>
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">+12.4%</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-medium text-zinc-500">R$</span>
            <span className="text-3xl font-bold text-zinc-900 tracking-tight">18.450</span>
            <span className="text-sm font-medium text-zinc-500">,00</span>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-sm flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 font-bold">TICKET MÉDIO (AOV)</span>
            <span className="text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded text-[10px] font-bold">+R$ 45</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-medium text-zinc-500">R$</span>
            <span className="text-3xl font-bold text-zinc-900 tracking-tight">324</span>
            <span className="text-sm font-medium text-zinc-500">,80</span>
          </div>
          <p className="text-[10px] text-zinc-400 mt-[-4px]">Impulsionado pelo Bundle "Sistema ORIGO"</p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-lg border border-zinc-200 shadow-sm flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 font-bold">CONVERSÃO PIX</span>
            <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded text-[10px] font-bold">-2.1%</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-bold text-zinc-900 tracking-tight">78</span>
            <span className="text-lg font-medium text-zinc-500">%</span>
          </div>
          <p className="text-[10px] text-zinc-400 mt-[-4px]">12 boletos/pix expirados esta semana</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        
        {/* COLUNA ESQUERDA (Maior) - Funil e Decisões */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* PAINEL DE GARGALOS E AVISOS (O "Sócio Digital") */}
          <div className="bg-white rounded-lg border border-zinc-200 shadow-sm">
            <div className="px-5 py-4 border-b border-zinc-100 flex justify-between items-center">
              <h2 className="text-sm font-bold text-zinc-900 tracking-wide uppercase">RADAR DE OPERAÇÃO</h2>
            </div>
            <div className="p-5 space-y-4">
              
              <div className="flex items-start gap-4 p-4 rounded-md border border-amber-200 bg-amber-50">
                <div className="mt-0.5 w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xs font-bold text-amber-900 uppercase">3 PIXs aguardando liquidação</h3>
                  <p className="text-[11px] text-amber-800 mt-1">R$ 1.150,00 retidos em reservas. 1 deles vence em 5 minutos.</p>
                </div>
                <Link href="/cortex/pedidos" className="text-[10px] font-bold bg-amber-200 text-amber-900 px-3 py-1.5 rounded hover:bg-amber-300">
                  GERIR
                </Link>
              </div>

              <div className="flex items-start gap-4 p-4 rounded-md border border-rose-200 bg-rose-50">
                <div className="mt-0.5 w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                <div className="flex-1">
                  <h3 className="text-xs font-bold text-rose-900 uppercase">Ruptura de Estoque Iminente</h3>
                  <p className="text-[11px] text-rose-800 mt-1">Camiseta TENAX (M) possui apenas 2 unidades. Média de saída: 4/semana.</p>
                </div>
                <Link href="/cortex/supply" className="text-[10px] font-bold bg-rose-200 text-rose-900 px-3 py-1.5 rounded hover:bg-rose-300">
                  REPOR
                </Link>
              </div>

            </div>
          </div>

          {/* FUNIL DE TRÁFEGO */}
          <div className="bg-white rounded-lg border border-zinc-200 shadow-sm">
            <div className="px-5 py-4 border-b border-zinc-100">
              <h2 className="text-sm font-bold text-zinc-900 tracking-wide uppercase">EFICIÊNCIA DO FUNIL</h2>
            </div>
            <div className="p-5">
              <div className="space-y-4 font-mono text-xs">
                
                {/* Estágio 1 */}
                <div>
                  <div className="flex justify-between mb-1 text-zinc-600">
                    <span>1. VISITANTES ÚNICOS</span>
                    <span className="font-bold text-zinc-900">4.250</span>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-sm h-6 overflow-hidden">
                    <div className="bg-zinc-800 h-full" style={{ width: '100%' }}></div>
                  </div>
                </div>

                {/* Estágio 2 */}
                <div>
                  <div className="flex justify-between mb-1 text-zinc-600">
                    <span>2. ADIÇÕES À SACOLA</span>
                    <span className="font-bold text-zinc-900">318 <span className="text-zinc-400 font-normal">(7.4%)</span></span>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-sm h-6 overflow-hidden">
                    <div className="bg-zinc-700 h-full" style={{ width: '35%' }}></div>
                  </div>
                </div>

                {/* Estágio 3 */}
                <div>
                  <div className="flex justify-between mb-1 text-zinc-600">
                    <span>3. VENDAS LIQUIDADAS</span>
                    <span className="font-bold text-zinc-900">54 <span className="text-zinc-400 font-normal">(1.2%)</span></span>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-sm h-6 overflow-hidden">
                    <div className="bg-zinc-600 h-full" style={{ width: '8%' }}></div>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* COLUNA DIREITA (Menor) - Top 5 Geográfico */}
        <div className="lg:col-span-1 space-y-6">
          
          <div className="bg-white rounded-lg border border-zinc-200 shadow-sm h-full flex flex-col">
            <div className="px-5 py-4 border-b border-zinc-100">
              <h2 className="text-sm font-bold text-zinc-900 tracking-wide uppercase">TOP 5 ESTADOS</h2>
              <p className="text-[10px] text-zinc-500 font-mono mt-1">Concentração de demanda (%)</p>
            </div>
            
            <div className="p-5 flex-1 flex flex-col justify-center space-y-5 font-mono text-xs">
              
              {/* Barra 1 */}
              <div className="space-y-1">
                <div className="flex justify-between text-zinc-700">
                  <span className="font-bold">CEARÁ (Base)</span>
                  <span>48%</span>
                </div>
                <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-600 h-full rounded-full" style={{ width: '48%' }}></div>
                </div>
              </div>

              {/* Barra 2 */}
              <div className="space-y-1">
                <div className="flex justify-between text-zinc-700">
                  <span className="font-bold">SÃO PAULO</span>
                  <span>22%</span>
                </div>
                <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-zinc-800 h-full rounded-full" style={{ width: '22%' }}></div>
                </div>
              </div>

              {/* Barra 3 */}
              <div className="space-y-1">
                <div className="flex justify-between text-zinc-700">
                  <span className="font-bold">RIO DE JANEIRO</span>
                  <span>12%</span>
                </div>
                <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-zinc-700 h-full rounded-full" style={{ width: '12%' }}></div>
                </div>
              </div>

              {/* Barra 4 */}
              <div className="space-y-1">
                <div className="flex justify-between text-zinc-700">
                  <span className="font-bold">BAHIA</span>
                  <span>10%</span>
                </div>
                <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-zinc-600 h-full rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>

              {/* Barra 5 */}
              <div className="space-y-1">
                <div className="flex justify-between text-zinc-700">
                  <span className="font-bold">MINAS GERAIS</span>
                  <span>8%</span>
                </div>
                <div className="w-full bg-zinc-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-zinc-500 h-full rounded-full" style={{ width: '8%' }}></div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}