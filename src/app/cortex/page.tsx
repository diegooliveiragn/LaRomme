'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, ShoppingBag, 
  CreditCard, Activity, AlertTriangle, Download 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

// Simulando dados de banco para alimentar o gráfico
const REVENUE_DATA = [
  { date: '01/10', receita: 450 }, { date: '05/10', receita: 1200 },
  { date: '10/10', receita: 3100 }, { date: '15/10', receita: 2800 },
  { date: '20/10', receita: 5400 }, { date: '25/10', receita: 8900 },
  { date: 'Hoje', receita: 12450 },
];

const GEO_DATA = [
  { estado: 'SP', vendas: 45 },
  { estado: 'CE', vendas: 32 },
  { estado: 'RJ', vendas: 18 },
  { estado: 'MG', vendas: 12 },
  { estado: 'SC', vendas: 8 },
];

export default function CockpitPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatBRL = (val: number) => 
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  if (!mounted) return null; // Previne hidratação incorreta dos gráficos no SSR

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12 font-sans">
      
      {/* CABEÇALHO C-LEVEL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 font-serif tracking-wide uppercase">Cockpit de Comando</h1>
          <p className="text-xs font-bold text-zinc-500 font-mono mt-1">Visão Geral da Operação • Últimos 30 dias</p>
        </div>
        <button className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-700 bg-white border border-zinc-300 rounded hover:bg-zinc-50 transition-colors flex items-center gap-2 shadow-sm">
          <Download className="w-4 h-4" /> Exportar DRE Executivo
        </button>
      </div>

      {/* KPI CARDS (Indicadores Chave) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">Receita Bruta</span>
            <div className="bg-zinc-50 p-2 rounded border border-zinc-100">
              <DollarSign className="w-4 h-4 text-zinc-600" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-zinc-900 tracking-tight">{formatBRL(18450)}</span>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-mono font-bold">
              <span className="flex items-center gap-0.5 text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                <TrendingUp className="w-3.5 h-3.5" /> +12.4%
              </span>
              <span className="text-zinc-400">vs. mês anterior</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">Ticket Médio (AOV)</span>
            <div className="bg-zinc-50 p-2 rounded border border-zinc-100">
              <ShoppingBag className="w-4 h-4 text-zinc-600" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-zinc-900 tracking-tight">{formatBRL(324.80)}</span>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-mono font-bold">
              <span className="flex items-center gap-0.5 text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded">
                <TrendingUp className="w-3.5 h-3.5" /> +R$ 45
              </span>
              <span className="text-zinc-400">Puxado por kit ORIGO</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">Conversão Global</span>
            <div className="bg-zinc-50 p-2 rounded border border-zinc-100">
              <Activity className="w-4 h-4 text-zinc-600" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-zinc-900 tracking-tight">3.2%</span>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-mono font-bold">
              <span className="flex items-center gap-0.5 text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded">
                <TrendingDown className="w-3.5 h-3.5" /> -0.4%
              </span>
              <span className="text-zinc-400">Atenção ao checkout</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">Aprovação PIX</span>
            <div className="bg-zinc-50 p-2 rounded border border-zinc-100">
              <CreditCard className="w-4 h-4 text-zinc-600" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-zinc-900 tracking-tight">78%</span>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-mono font-bold text-zinc-400">
              12 pedidos expirados
            </div>
          </div>
        </div>

      </div>

      {/* ÁREA DOS GRÁFICOS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* GRÁFICO PRINCIPAL: LINHA DO TEMPO */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-zinc-200 shadow-sm p-6">
          <div className="mb-8 flex justify-between items-end">
            <div>
              <h2 className="text-sm font-bold text-zinc-900 tracking-widest uppercase">Evolução de Receita</h2>
              <p className="text-xs font-mono font-bold text-zinc-500 mt-1">Crescimento Acumulado Mensal</p>
            </div>
            <span className="text-xs font-mono font-bold bg-zinc-100 border border-zinc-200 text-zinc-700 px-3 py-1.5 rounded shadow-sm">Mês Atual</span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#18181b" stopOpacity={0.15}/>
                    <stop offset="95%" stopColor="#18181b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a', fontWeight: 600 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#71717a', fontWeight: 600 }} tickFormatter={(val) => `R$ ${val/1000}k`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#ffffff', color: '#18181b', border: '1px solid #e4e4e7', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#18181b' }}
                  formatter={(value: any) => [formatBRL(Number(value) || 0), "Receita"]}
                />
                <Area type="monotone" dataKey="receita" stroke="#18181b" strokeWidth={3} fillOpacity={1} fill="url(#colorReceita)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* COLUNA DIREITA: TOP ESTADOS E ALERTAS */}
        <div className="space-y-6">
          
          {/* RADAR GEOGRÁFICO */}
          <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6">
            <h2 className="text-sm font-bold text-zinc-900 tracking-widest uppercase mb-6">Top 5 Praças (Estados)</h2>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={GEO_DATA} layout="vertical" margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e4e4e7" />
                  <XAxis type="number" hide />
                  <YAxis dataKey="estado" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#52525b', fontWeight: 'bold' }} />
                  <Tooltip 
                    cursor={{fill: '#f4f4f5'}}
                    contentStyle={{ backgroundColor: '#ffffff', color: '#18181b', border: '1px solid #e4e4e7', borderRadius: '8px', fontSize: '13px', fontWeight: 'bold', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ color: '#18181b' }}
                    formatter={(value: any) => [`${value} Vendas`, "Volume"]}
                  />
                  <Bar dataKey="vendas" fill="#27272a" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* PAINEL DE AVISOS DO SISTEMA */}
          <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6">
             <h2 className="text-sm font-bold text-zinc-900 tracking-widest uppercase mb-4 flex items-center gap-2">
               <AlertTriangle className="w-5 h-5 text-amber-500" />
               Alertas Críticos
             </h2>
             <div className="space-y-4">
               <div className="bg-rose-50 border border-rose-100 p-4 rounded-md text-rose-900">
                 <p className="text-xs font-bold uppercase tracking-wider mb-1.5">Ruptura Iminente</p>
                 <p className="text-xs font-mono font-medium opacity-90 leading-relaxed">A peça 'Camiseta TENAX (M)' possui apenas 2 unidades disponíveis na prateleira física.</p>
               </div>
               <div className="bg-amber-50 border border-amber-100 p-4 rounded-md text-amber-900">
                 <p className="text-xs font-bold uppercase tracking-wider mb-1.5">Trava Financeira</p>
                 <p className="text-xs font-mono font-medium opacity-90 leading-relaxed">Existem 3 pedidos com PIX aguardando expiração e retendo estoque válido.</p>
               </div>
             </div>
          </div>

        </div>
      </div>

    </div>
  );
}