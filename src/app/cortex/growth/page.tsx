'use client';

import React, { useState, useEffect } from 'react';
import {
  TrendingUp, Users, Target, Activity, RefreshCw,
  Compass, PieChart, ShieldCheck, ArrowUpRight, Zap
} from 'lucide-react';

export default function CortexGrowthPage() {
  const [loading, setLoading] = useState(false);

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val || 0);

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            INTELIGÊNCIA PREDITIVA & AUDIÊNCIA
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">
            Growth & Análise Comportamental
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Matriz RFM, apetite esportivo e segmentação para os próximos lançamentos da LaRomme
          </p>
        </div>

        <button
          onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 500); }}
          disabled={loading}
          className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 disabled:opacity-50 shadow-sm"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Atualizar Segmentos</span>
        </button>
      </div>

      {/* TOP RADAR: MATRIZ DE RETENÇÃO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
            Patronos Fundadores
          </span>
          <span className="text-3xl font-bold text-zinc-900 font-mono tracking-tight my-2">
            1
          </span>
          <span className="text-[11px] text-amber-700 font-mono font-bold">
            👑 Diego Oliveira (Vôlei de Praia)
          </span>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
            LTV Médio Consolidado
          </span>
          <span className="text-3xl font-bold text-emerald-600 font-mono tracking-tight my-2">
            {formatBRL(894.25)}
          </span>
          <span className="text-[11px] text-zinc-400">
            Base: Custódia & Insumos
          </span>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
            Afinidade Esportiva Líder
          </span>
          <span className="text-3xl font-bold text-zinc-900 font-mono tracking-tight my-2">
            Vôlei Praia
          </span>
          <span className="text-[11px] text-zinc-400">
            100% da audiência confirmada
          </span>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
            Taxa de Recompra Alvo
          </span>
          <span className="text-3xl font-bold text-zinc-900 font-mono tracking-tight my-2">
            35%
          </span>
          <span className="text-[11px] text-zinc-400">
            Meta para patronos no Drop 01
          </span>
        </div>
      </div>

      {/* MATRIZ RFM & APETITE DE GRADE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CLASSIFICAÇÃO RFM */}
        <div className="lg:col-span-7 bg-white rounded-lg border border-zinc-200 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-600" /> Matriz RFM (Recência, Frequência e Valor)
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5">Segmentação dos clientes por comportamento transacional</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
              Base Saudável
            </span>
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="p-3.5 rounded border border-amber-200 bg-amber-50/40 flex justify-between items-center">
              <div>
                <span className="font-bold text-amber-950 flex items-center gap-1.5">
                  <span>👑</span> Patrono Founder & Embaixadores
                </span>
                <span className="text-[10px] text-zinc-500 block">Acesso perpétuo e atendimento concierge direto</span>
              </div>
              <span className="font-bold text-amber-900">1 Membro</span>
            </div>

            <div className="p-3.5 rounded border border-zinc-200 bg-zinc-50 flex justify-between items-center">
              <div>
                <span className="font-bold text-zinc-900">Membros Senado VIP (Early Access)</span>
                <span className="text-[10px] text-zinc-500 block">Cadastrados no formulário de pré-abertura</span>
              </div>
              <span className="font-bold text-zinc-700">Fila Ativa</span>
            </div>

            <div className="p-3.5 rounded border border-zinc-200 bg-zinc-50 flex justify-between items-center">
              <div>
                <span className="font-bold text-zinc-900">Compradores Drop 01</span>
                <span className="text-[10px] text-zinc-500 block">Pedidos pagos e despachados</span>
              </div>
              <span className="font-bold text-emerald-600">1 Pedido Homologado</span>
            </div>
          </div>
        </div>

        {/* DISTRIBUIÇÃO ANATÔMICA (TRUE FIT PERSONA) */}
        <div className="lg:col-span-5 bg-white rounded-lg border border-zinc-200 shadow-sm p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <div>
              <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-widest flex items-center gap-2">
                <Compass className="w-4 h-4 text-zinc-500" /> Apetite de Grade (True Fit)
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono mt-0.5">Demanda proporcional por tamanho para a confecção</p>
            </div>
          </div>

          <div className="space-y-3 font-mono text-xs">
            {[
              { size: 'M (Médio)', pct: 50, desc: 'Tamanho mais procurado para modelagem Boxy' },
              { size: 'G (Grande)', pct: 35, desc: 'Caimento solto para atletas de areia' },
              { size: 'P (Pequeno)', pct: 10, desc: 'Ajuste mais curto' },
              { size: 'GG (Extra Grande)', pct: 5, desc: 'Grade reduzida para evitar ruptura' },
            ].map((item) => (
              <div key={item.size} className="space-y-1">
                <div className="flex justify-between text-zinc-700 text-[11px]">
                  <span>{item.size}</span>
                  <span className="font-bold text-zinc-900">{item.pct}%</span>
                </div>
                <div className="w-full bg-zinc-100 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-zinc-900 h-full rounded-full"
                    style={{ width: `${item.pct}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] font-mono text-zinc-400 pt-2 border-t border-zinc-100 text-center">
            Orientação para corte fabril: 50% M • 35% G • 10% P • 5% GG.
          </p>
        </div>

      </div>
    </div>
  );
}