'use client';

import React from 'react';
import { Activity, Target, Clock, AlertTriangle, Truck, MapPin, CheckCircle2, Zap, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';

export default function CockpitCLevel() {
  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Regras de Negócio e Mock de Dados
  const roasAtual = 3.9;
  const roasMeta = 3.5;
  const slaAtual = 14.5;
  
  const pixData = { gerados: 42, copiados: 28, pagos: 18 };
  const fugaPix = Math.round(((pixData.gerados - pixData.pagos) / pixData.gerados) * 100);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 font-sans">
      
      {/* SYSTEM HEALTH MONITOR */}
      <div className="flex flex-wrap items-center gap-4 bg-zinc-950 border border-zinc-900 px-4 py-3 rounded-md shadow-sm">
        <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-zinc-400 flex items-center gap-2 border-r border-zinc-800 pr-4">
          <Activity className="w-4 h-4" /> System Health
        </span>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300">Mercado Pago</span>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300">Vercel</span>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300">Resend</span>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-300">Melhor Envio</span>
        </div>
      </div>

      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 font-serif tracking-wide uppercase flex items-center gap-3">
            O Olho de Deus <ShieldCheck className="w-6 h-6 text-amber-600" />
          </h1>
          <p className="text-sm text-zinc-500 font-mono mt-1 font-bold">Dashboard Executivo • Tração, Aquisição e Logística em Tempo Real</p>
        </div>
      </div>

      {/* RADARES DE AQUISIÇÃO E LOGÍSTICA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Radar 1: Funil PIX */}
        <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">Tração do Dia (Vendas)</span>
            <CreditCard className="w-5 h-5 text-zinc-400" />
          </div>
          <div>
            <span className="text-4xl font-black text-zinc-900 tracking-tight block">{formatBRL(4250.00)}</span>
            
            <div className="mt-5 pt-5 border-t border-zinc-100">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 block mb-3">
                Taxa de Fuga do PIX: <span className="text-lg font-black text-rose-600">{fugaPix}%</span>
              </span>
              <div className="flex items-center justify-between text-xs font-mono">
                <span className="text-zinc-600 bg-zinc-100 px-3 py-1.5 rounded"><strong className="text-zinc-900 text-sm font-black">{pixData.gerados}</strong> Gerados</span>
                <ArrowRight className="w-4 h-4 text-zinc-300" />
                <span className="text-zinc-600 bg-zinc-100 px-3 py-1.5 rounded"><strong className="text-zinc-900 text-sm font-black">{pixData.copiados}</strong> Copiados</span>
                <ArrowRight className="w-4 h-4 text-zinc-300" />
                <span className="text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200"><strong className="text-emerald-700 text-sm font-black">{pixData.pagos}</strong> Pagos</span>
              </div>
            </div>
          </div>
        </div>

        {/* Radar 2: ROAS */}
        <div className={`p-6 rounded-lg border shadow-sm flex flex-col justify-between relative overflow-hidden ${roasAtual >= roasMeta ? 'bg-zinc-900 border-zinc-800' : 'bg-rose-950 border-rose-900'}`}>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
          <div className="flex justify-between items-start mb-4 relative z-10">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">Termômetro de Mídia (ROAS)</span>
            <Target className="w-5 h-5 text-zinc-500" />
          </div>
          <div className="relative z-10">
            <span className={`text-6xl font-black tracking-tight ${roasAtual >= roasMeta ? 'text-white' : 'text-rose-400'}`}>{roasAtual}x</span>
            <div className="flex items-center gap-2 mt-5">
              {roasAtual >= roasMeta ? (
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-1.5 bg-emerald-400/10 px-3 py-1.5 rounded border border-emerald-400/20">
                  <CheckCircle2 className="w-4 h-4" /> Escala Validada (Meta: {roasMeta}x)
                </span>
              ) : (
                <span className="text-xs font-mono font-bold uppercase tracking-widest text-rose-400 flex items-center gap-1.5 bg-rose-400/10 px-3 py-1.5 rounded border border-rose-400/20">
                  <AlertTriangle className="w-4 h-4" /> Pausar Campanhas
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Radar 3: SLA */}
        <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-100 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-800">SLA Operacional (Esteira)</span>
            <Clock className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <span className="text-5xl font-black text-emerald-900 tracking-tight block">{slaAtual}h <span className="text-2xl font-bold text-emerald-700">30m</span></span>
            <p className="text-xs font-mono text-emerald-700 mt-2 font-bold">Tempo médio: Checkout &rarr; Etiqueta</p>
            <div className="mt-5 pt-5 border-t border-emerald-200/50">
               <span className="text-xs font-mono font-bold uppercase tracking-widest text-emerald-800 flex items-center gap-1.5">
                 <CheckCircle2 className="w-4 h-4" /> Operação Saudável (Teto: 24h)
               </span>
            </div>
          </div>
        </div>

      </div>

      {/* BIFURCAÇÃO LOGÍSTICA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2 bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center">
            <h2 className="text-sm font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
              <Truck className="w-5 h-5 text-zinc-500" /> Logística de Despacho Ativa
            </h2>
            <span className="text-xs font-mono text-zinc-600 bg-zinc-200 px-3 py-1.5 rounded font-black">3 Pendentes</span>
          </div>
          <div className="divide-y divide-zinc-100">
            
            <div className="p-5 px-6 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-zinc-50 transition-colors">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono font-black uppercase tracking-widest text-amber-700 border border-amber-200 bg-amber-50 px-2 py-1 rounded mb-1 inline-block">[ EXPRESSO LOCAL ]</span>
                  <p className="text-base font-black text-zinc-900">Pedido #1042 • Thiago Mendes</p>
                  <p className="text-sm text-zinc-600 font-mono mt-0.5 font-bold">Fortaleza, CE (Meireles) • Há 4 horas</p>
                </div>
              </div>
              <button className="w-full md:w-auto px-5 py-3 text-xs font-black uppercase tracking-wider text-amber-900 bg-amber-400 border border-amber-500 rounded hover:bg-amber-500 transition-colors flex items-center justify-center gap-2 shadow-sm">
                <Zap className="w-4 h-4" /> Acionar Motoboy
              </button>
            </div>

            <div className="p-5 px-6 flex flex-col md:flex-row items-center justify-between gap-4 hover:bg-zinc-50 transition-colors">
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="w-12 h-12 bg-zinc-100 text-zinc-500 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-mono font-black uppercase tracking-widest text-zinc-500 border border-zinc-200 bg-zinc-100 px-2 py-1 rounded mb-1 inline-block">[ NACIONAL ]</span>
                  <p className="text-base font-black text-zinc-900">Pedido #1043 • Marina Costa</p>
                  <p className="text-sm text-zinc-600 font-mono mt-0.5 font-bold">São Paulo, SP (Pinheiros) • Há 12 horas</p>
                </div>
              </div>
              <button className="w-full md:w-auto px-5 py-3 text-xs font-black uppercase tracking-wider text-zinc-700 bg-white border border-zinc-300 rounded hover:bg-zinc-50 transition-colors flex items-center justify-center gap-2 shadow-sm">
                Gerar Etiqueta PDF
              </button>
            </div>

          </div>
        </div>

        <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
           <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/50">
            <h2 className="text-sm font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-500" /> Insight do Cortex
            </h2>
          </div>
          <div className="p-6 flex-1 flex flex-col justify-center">
            <p className="text-sm text-zinc-700 leading-relaxed font-medium">
              <strong className="text-zinc-900 block mb-2 text-base font-black">Padrão de Compra Identificado:</strong>
              72% dos clientes que compraram a Camiseta Vestigium esta semana também adicionaram o Boné Umbra ao carrinho.
            </p>
            <button className="mt-5 w-full px-4 py-3 text-xs font-black uppercase tracking-widest text-zinc-700 bg-zinc-100 border border-zinc-300 rounded hover:bg-zinc-200 transition-colors">
              Criar Bundle (Kit)
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}