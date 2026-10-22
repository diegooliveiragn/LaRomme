'use client';

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, TrendingDown, DollarSign, Users, 
  Activity, AlertTriangle, Download, PackageOpen, MousePointerClick 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

// Simulando dados de banco para alimentar o gráfico
const REVENUE_DATA = [
  { date: '01/10', receita: 450, lastMonth: 320 }, 
  { date: '05/10', receita: 1200, lastMonth: 950 },
  { date: '10/10', receita: 3100, lastMonth: 2100 }, 
  { date: '15/10', receita: 2800, lastMonth: 2900 },
  { date: '20/10', receita: 5400, lastMonth: 4800 }, 
  { date: '25/10', receita: 8900, lastMonth: 7500 },
  { date: 'Hoje', receita: 12450, lastMonth: 10100 },
];

const GEO_DATA = [
  { estado: 'SP', vendas: 45 },
  { estado: 'CE', vendas: 32 },
  { estado: 'RJ', vendas: 18 },
  { estado: 'MG', vendas: 12 },
  { estado: 'SC', vendas: 8 },
];

const SHARE_DATA = [
  { name: 'Tenax', value: 45 },
  { name: 'Vestigium', value: 30 },
  { name: 'Umbra', value: 15 },
  { name: 'Libertas', value: 10 },
];

const COLORS = ['#18181b', '#52525b', '#a1a1aa', '#e4e4e7'];

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
          <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 font-serif tracking-wide uppercase">Cockpit Predivito</h1>
          <p className="text-xs font-bold text-zinc-500 font-mono mt-1">Growth, Retenção & Visão Macro</p>
        </div>
        <button className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-zinc-700 bg-white border border-zinc-300 rounded hover:bg-zinc-50 transition-colors flex items-center gap-2 shadow-sm">
          <Download className="w-4 h-4" /> Exportar DRE Executivo
        </button>
      </div>

      {/* FASE 1: KPI CARDS (Indicadores de Tração) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Receita Real vs. Projetada */}
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
                <TrendingUp className="w-3.5 h-3.5" /> +23%
              </span>
              <span className="text-zinc-400">vs. mês passado</span>
            </div>
          </div>
        </div>

        {/* Card 2: VGV Latente (Waitlist) */}
        <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">VGV Latente</span>
            <div className="bg-amber-50 p-2 rounded border border-amber-100">
              <PackageOpen className="w-4 h-4 text-amber-600" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-amber-600 tracking-tight">{formatBRL(7645.50)}</span>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-mono font-bold">
              <span className="flex items-center gap-0.5 text-amber-700 bg-amber-50 border border-amber-100 px-2 py-0.5 rounded">
                85 alertas
              </span>
              <span className="text-zinc-400">Aguardando reposição</span>
            </div>
          </div>
        </div>

        {/* Card 3: Conversão do Funil */}
        <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">Funil de Tração</span>
            <div className="bg-zinc-50 p-2 rounded border border-zinc-100">
              <MousePointerClick className="w-4 h-4 text-zinc-600" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-zinc-900 tracking-tight">1.8%</span>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-mono font-bold">
              <span className="flex items-center gap-0.5 text-rose-700 bg-rose-50 border border-rose-100 px-2 py-0.5 rounded">
                <TrendingDown className="w-3.5 h-3.5" /> Fricção
              </span>
              <span className="text-zinc-400">Checkout abandonado</span>
            </div>
          </div>
        </div>

        {/* Card 4: Saúde do Senado VIP (Recompra) */}
        <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm flex flex-col justify-between hover:border-zinc-300 transition-colors">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-500">Taxa de Recompra</span>
            <div className="bg-zinc-50 p-2 rounded border border-zinc-100">
              <Users className="w-4 h-4 text-zinc-600" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-zinc-900 tracking-tight">34%</span>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-mono font-bold text-zinc-400">
              Base Senado VIP ativa
            </div>
          </div>
        </div>

      </div>

      {/* FASE 2: GRÁFICOS CENTRAIS E ALERTAS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUNA ESQUERDA (Evolução + Share) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* GRÁFICO: LINHA DO TEMPO */}
          <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6">
            <div className="mb-8 flex justify-between items-end">
              <div>
                <h2 className="text-sm font-bold text-zinc-900 tracking-widest uppercase">Evolução de Receita</h2>
                <p className="text-xs font-mono font-bold text-zinc-500 mt-1">Atual vs. Mês Anterior</p>
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
                    formatter={(value: any) => [formatBRL(Number(value) || 0), "R$"]}
                  />
                  {/* Linha fantasma (Mês Anterior) */}
                  <Area type="monotone" dataKey="lastMonth" stroke="#a1a1aa" strokeDasharray="5 5" strokeWidth={2} fillOpacity={0} />
                  <Area type="monotone" dataKey="receita" stroke="#18181b" strokeWidth={3} fillOpacity={1} fill="url(#colorReceita)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* GRÁFICO: SHARE DE ARTEFATOS */}
          <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6 flex flex-col md:flex-row items-center justify-between">
            <div className="w-full md:w-1/2">
               <h2 className="text-sm font-bold text-zinc-900 tracking-widest uppercase">Share de Artefatos</h2>
               <p className="text-xs font-mono font-bold text-zinc-500 mt-1 mb-6">Composição de vendas (%)</p>
               <div className="space-y-3">
                 {SHARE_DATA.map((item, idx) => (
                   <div key={item.name} className="flex items-center justify-between text-xs font-mono font-bold">
                     <div className="flex items-center gap-2">
                       <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[idx] }}></span>
                       <span className="text-zinc-700 uppercase">{item.name}</span>
                     </div>
                     <span className="text-zinc-900">{item.value}%</span>
                   </div>
                 ))}
               </div>
            </div>
            <div className="w-full md:w-1/2 h-48 mt-6 md:mt-0">
               <ResponsiveContainer width="100%" height="100%">
                 <PieChart>
                   <Pie data={SHARE_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value" stroke="none">
                     {SHARE_DATA.map((entry, index) => (
                       <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                     ))}
                   </Pie>
                   <Tooltip 
                     contentStyle={{ backgroundColor: '#18181b', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '10px' }}
                     itemStyle={{ color: '#fff' }}
                   />
                 </PieChart>
               </ResponsiveContainer>
            </div>
          </div>

        </div>

        {/* COLUNA DIREITA (Praças e Alertas Preditivos) */}
        <div className="space-y-6">
          
          {/* RADAR GEOGRÁFICO + WEATHER SYNC */}
          <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6">
            <div className="flex justify-between items-start mb-6">
               <h2 className="text-sm font-bold text-zinc-900 tracking-widest uppercase">Top Praças</h2>
               <span className="text-[9px] uppercase font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded border border-amber-200">Weather Sync Ativo</span>
            </div>
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

          {/* PAINEL DE AÇÃO PREDITIVA */}
          <div className="bg-white rounded-lg border border-zinc-200 shadow-sm p-6">
             <h2 className="text-sm font-bold text-zinc-900 tracking-widest uppercase mb-4 flex items-center gap-2">
               <AlertTriangle className="w-5 h-5 text-rose-500" />
               Fila de Ação (Concierge)
             </h2>
             <div className="space-y-4">
               
               <div className="bg-rose-50 border border-rose-100 p-4 rounded-md text-rose-900">
                 <p className="text-xs font-bold uppercase tracking-wider mb-1.5 flex justify-between">
                   Radar de Ruptura
                   <span className="text-[10px] text-rose-500">Alta Priori</span>
                 </p>
                 <p className="text-xs font-mono font-medium opacity-90 leading-relaxed border-b border-rose-200/50 pb-2 mb-2">
                   A peça 'Camiseta TENAX (M)' esgota em 4 dias no ritmo atual.
                 </p>
                 <button className="text-[10px] font-bold uppercase tracking-wider text-rose-700 hover:text-rose-900">
                   Gerar Ordem de Produção &rarr;
                 </button>
               </div>

               <div className="bg-amber-50 border border-amber-100 p-4 rounded-md text-amber-900">
                 <p className="text-xs font-bold uppercase tracking-wider mb-1.5 flex justify-between">
                   Gargalo de Retenção
                 </p>
                 <p className="text-xs font-mono font-medium opacity-90 leading-relaxed border-b border-amber-200/50 pb-2 mb-2">
                   3 clientes (AOV &gt; R$ 400) abandonaram o carrinho por conta do valor do frete para SC.
                 </p>
                 <button className="text-[10px] font-bold uppercase tracking-wider text-amber-700 hover:text-amber-900">
                   Sondar via WhatsApp &rarr;
                 </button>
               </div>
             </div>
          </div>

        </div>
      </div>

    </div>
  );
}