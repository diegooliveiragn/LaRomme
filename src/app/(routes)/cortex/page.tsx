'use client';

import { useState, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const CEO_EMAIL = 'diegooliveiragn@gmail.com';

// ESTRUTURA DADOS REGIONAIS DO BRASIL
const stateDataMap: Record<string, { name: string; rev: string; percent: string; orders: number; ticket: string; cities: string[]; fill: string }> = {
  SP: { name: 'São Paulo', rev: 'R$ 7.800,00', percent: '42%', orders: 24, ticket: 'R$ 325,00', cities: ['São Paulo Capital (60%)', 'Campinas (20%)', 'Ribeirão Preto (20%)'], fill: '#10b981' },
  RJ: { name: 'Rio de Janeiro', rev: 'R$ 3.340,00', percent: '18%', orders: 10, ticket: 'R$ 334,00', cities: ['Rio Capital (70%)', 'Niterói (30%)'], fill: '#059669' },
  PR: { name: 'Paraná', rev: 'R$ 2.600,00', percent: '14%', orders: 8, ticket: 'R$ 325,00', cities: ['Curitiba (80%)', 'Maringá (20%)'], fill: '#047857' },
  SC: { name: 'Santa Catarina', rev: 'R$ 1.850,00', percent: '10%', orders: 6, ticket: 'R$ 308,00', cities: ['Florianópolis (60%)', 'Balneário Camboriú (40%)'], fill: '#065f46' },
  CE: { name: 'Ceará', rev: 'R$ 1.480,00', percent: '8%', orders: 5, ticket: 'R$ 296,00', cities: ['Fortaleza (100%)'], fill: '#064e3b' },
  MG: { name: 'Minas Gerais', rev: 'R$ 930,00', percent: '5%', orders: 3, ticket: 'R$ 310,00', cities: ['Belo Horizonte (100%)'], fill: '#115e59' },
  RS: { name: 'Rio Grande do Sul', rev: 'R$ 560,00', percent: '3%', orders: 2, ticket: 'R$ 280,00', cities: ['Porto Alegre (100%)'], fill: '#134e4a' },
};

export default function CortexSaaS() {
  const [activeModule, setActiveModule] = useState<'cockpit' | 'unit_econ' | 'arsenal' | 'producao' | 'logistica' | 'blackbook' | 'persona' | 'seeding' | 'mapa'>('cockpit');
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const tractionData = [
    { time: '10:00', vendas: 2, acessos: 150 },
    { time: '12:00', vendas: 12, acessos: 420 },
    { time: '14:00', vendas: 35, acessos: 980 },
    { time: '16:00', vendas: 48, acessos: 1100 },
    { time: '18:00', vendas: 58, acessos: 1340 },
  ];

  const funnelData = [
    { step: 'Acessos Site', users: 1340 },
    { step: 'Página Produto', users: 890 },
    { step: 'Clicou Tamanho', users: 310 },
    { step: 'Iniciou Checkout', users: 145 },
    { step: 'Pagamento OK', users: 58 },
  ];

  const financialMetrics = useMemo(() => {
    const grossRevenue = 18560.00;
    const approvedCount = 58;
    const totalCosts = approvedCount * (95 + 18 + 8.5) + (grossRevenue * 0.06);
    const netProfit = grossRevenue - totalCosts;
    return { grossRevenue, approvedCount, netProfit, marginPercent: ((netProfit / grossRevenue) * 100).toFixed(1) };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const currentHoverData = hoveredState ? stateDataMap[hoveredState] : null;

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex font-sans antialiased selection:bg-emerald-500 selection:text-black">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0d0d10] border-r border-zinc-800/80 flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="p-6 space-y-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
              <h1 className="font-bold tracking-widest text-lg text-white uppercase font-mono">CÓRTEX OS</h1>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">Standalone SaaS • v4.1</p>
          </div>

          <nav className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block px-3 mb-2">Painel de Comando</span>
            {[
              { id: 'cockpit', label: 'Cockpit 360', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /> },
              { id: 'unit_econ', label: 'Unit Economics', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /> },
              { id: 'mapa', label: 'Heatmap Brasil (SVG)', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 6.75V15m6-6v8.25m.503-11.487l4.875 1.218c.26.065.44.298.44.566v11.141c0 .356-.347.625-.694.538l-4.708-1.177A1.5 1.5 0 0114 16.5V6.75M9 6.75V4.838c0-.356.347-.625.694-.538l4.708 1.177c.366.091.598.412.598.788v2.485M9 6.75L4.125 5.532A.563.563 0 003.563 6.1v11.14c0 .357.347.626.694.539L9 16.5" /> },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveModule(item.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                  activeModule === item.id ? 'bg-zinc-800 text-white font-semibold border border-zinc-700/50' : 'text-zinc-400 hover:bg-zinc-900/60'
                }`}
              >
                <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24">{item.svg}</svg>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/80 flex items-center justify-between text-xs">
          <div>
            <p className="font-bold text-white">Diego Oliveira</p>
            <span className="text-[10px] text-amber-400 font-mono">CEO LR • MASTER</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-zinc-800/80 px-8 flex items-center justify-between bg-[#0d0d10]/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-zinc-500">CÓRTEX /</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">{activeModule.replace('_', ' ')}</span>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-3 py-1 rounded">
            HEATMAP BRASIL ONLINE
          </span>
        </header>

        <div className="p-8 max-w-7xl w-full space-y-6">
          
          {/* COCKPIT 360 */}
          {activeModule === 'cockpit' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-mono">
                <div className="bg-[#0d0d10] border border-zinc-800/80 p-5 rounded-lg">
                  <span className="text-[10px] text-zinc-500 uppercase">FATURAMENTO BRUTO</span>
                  <p className="text-2xl font-bold text-white mt-1">R$ {financialMetrics.grossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-[#0d0d10] border border-zinc-800/80 p-5 rounded-lg">
                  <span className="text-[10px] text-zinc-500 uppercase">LUCRO LÍQUIDO REAL</span>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">R$ {financialMetrics.netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-[#0d0d10] border border-zinc-800/80 p-5 rounded-lg">
                  <span className="text-[10px] text-zinc-500 uppercase">TAXA DE CONVERSÃO</span>
                  <p className="text-2xl font-bold text-white mt-1">4.32%</p>
                </div>
                <div className="bg-[#0d0d10] border border-zinc-800/80 p-5 rounded-lg">
                  <span className="text-[10px] text-zinc-500 uppercase">DEMANDA REPRIMIDA</span>
                  <p className="text-2xl font-bold text-amber-400 mt-1">R$ 8.640,00</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg font-mono">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Tração de Vendas vs Acessos</h3>
                  <div className="h-64 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={tractionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis dataKey="time" stroke="#71717a" />
                        <YAxis stroke="#71717a" />
                        <RechartsTooltip />
                        <Line type="monotone" dataKey="vendas" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="acessos" stroke="#52525b" strokeWidth={1} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg font-mono">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Funil de Conversão</h3>
                  <div className="h-64 w-full text-[10px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={funnelData} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                        <XAxis type="number" stroke="#71717a" hide />
                        <YAxis dataKey="step" type="category" stroke="#a1a1aa" />
                        <RechartsTooltip />
                        <Bar dataKey="users" fill="#e4e4e7" radius={[0, 4, 4, 0]} barSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* MÓDULO: MAPA SVG INTERATIVO BRASIL */}
          {activeModule === 'mapa' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg space-y-6 font-mono">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">MAPA VECTORIAL DE DENSIDADE DE VENDAS — BRASIL</h2>
                  <p className="text-[10px] text-zinc-500 mt-1">Passe o cursor sobre os Estados para visualizar métricas por Cidade</p>
                </div>
                <span className="text-xs text-emerald-400 font-bold bg-emerald-950/50 border border-emerald-800 px-3 py-1 rounded">
                  HOVER INTERACTOR ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* CONTAINER DO MAPA SVG */}
                <div 
                  className="lg:col-span-2 bg-black border border-zinc-800/80 p-6 rounded-lg relative overflow-hidden flex items-center justify-center min-h-[420px]"
                  onMouseMove={handleMouseMove}
                >
                  {/* SVG MAPA INTERATIVO BRASIL */}
                  <svg viewBox="0 0 600 600" className="w-full h-auto max-h-[400px] select-none">
                    {/* ESTADOS NORTE / NORDESTE / CENTRO-OESTE / SUDESTE / SUL */}
                    {/* CEARÁ */}
                    <path
                      d="M 390 140 L 420 135 L 430 160 L 400 170 Z"
                      fill={stateDataMap['CE'].fill}
                      stroke="#09090b"
                      strokeWidth="2"
                      className="cursor-pointer transition-all hover:opacity-80 hover:stroke-white"
                      onMouseEnter={() => setHoveredState('CE')}
                      onMouseLeave={() => setHoveredState(null)}
                    />
                    {/* SÃO PAULO */}
                    <path
                      d="M 330 360 L 380 350 L 395 385 L 340 395 Z"
                      fill={stateDataMap['SP'].fill}
                      stroke="#09090b"
                      strokeWidth="2"
                      className="cursor-pointer transition-all hover:opacity-80 hover:stroke-white"
                      onMouseEnter={() => setHoveredState('SP')}
                      onMouseLeave={() => setHoveredState(null)}
                    />
                    {/* RIO DE JANEIRO */}
                    <path
                      d="M 395 365 L 430 360 L 425 380 L 395 385 Z"
                      fill={stateDataMap['RJ'].fill}
                      stroke="#09090b"
                      strokeWidth="2"
                      className="cursor-pointer transition-all hover:opacity-80 hover:stroke-white"
                      onMouseEnter={() => setHoveredState('RJ')}
                      onMouseLeave={() => setHoveredState(null)}
                    />
                    {/* PARANÁ */}
                    <path
                      d="M 310 400 L 360 395 L 355 425 L 305 420 Z"
                      fill={stateDataMap['PR'].fill}
                      stroke="#09090b"
                      strokeWidth="2"
                      className="cursor-pointer transition-all hover:opacity-80 hover:stroke-white"
                      onMouseEnter={() => setHoveredState('PR')}
                      onMouseLeave={() => setHoveredState(null)}
                    />
                    {/* SANTA CATARINA */}
                    <path
                      d="M 320 430 L 365 425 L 360 455 L 315 450 Z"
                      fill={stateDataMap['SC'].fill}
                      stroke="#09090b"
                      strokeWidth="2"
                      className="cursor-pointer transition-all hover:opacity-80 hover:stroke-white"
                      onMouseEnter={() => setHoveredState('SC')}
                      onMouseLeave={() => setHoveredState(null)}
                    />
                    {/* MINAS GERAIS */}
                    <path
                      d="M 355 300 L 420 290 L 430 355 L 365 350 Z"
                      fill={stateDataMap['MG'].fill}
                      stroke="#09090b"
                      strokeWidth="2"
                      className="cursor-pointer transition-all hover:opacity-80 hover:stroke-white"
                      onMouseEnter={() => setHoveredState('MG')}
                      onMouseLeave={() => setHoveredState(null)}
                    />
                    {/* RIO GRANDE DO SUL */}
                    <path
                      d="M 295 460 L 350 455 L 340 510 L 285 500 Z"
                      fill={stateDataMap['RS'].fill}
                      stroke="#09090b"
                      strokeWidth="2"
                      className="cursor-pointer transition-all hover:opacity-80 hover:stroke-white"
                      onMouseEnter={() => setHoveredState('RS')}
                      onMouseLeave={() => setHoveredState(null)}
                    />

                    {/* DEMAIS ESTADOS (APAGADOS / BACKGROUND MILITAR) */}
                    <path d="M 120 100 L 280 80 L 260 220 L 100 180 Z" fill="#18181b" stroke="#09090b" strokeWidth="1.5" />
                    <path d="M 280 80 L 380 90 L 350 200 L 260 220 Z" fill="#18181b" stroke="#09090b" strokeWidth="1.5" />
                    <path d="M 250 225 L 340 210 L 350 300 L 260 310 Z" fill="#18181b" stroke="#09090b" strokeWidth="1.5" />
                    <path d="M 380 175 L 460 170 L 450 280 L 380 285 Z" fill="#18181b" stroke="#09090b" strokeWidth="1.5" />
                  </svg>

                  {/* TOOLTIP FLUTUANTE COLADO NO CURSOR */}
                  {currentHoverData && (
                    <div 
                      className="absolute z-30 pointer-events-none bg-black/95 border border-emerald-500 p-4 rounded shadow-2xl space-y-2 min-w-[220px]"
                      style={{ top: Math.min(mousePos.y + 15, 260), left: Math.min(mousePos.x + 15, 320) }}
                    >
                      <div className="flex justify-between items-center border-b border-zinc-800 pb-1.5">
                        <span className="font-bold text-white uppercase text-xs">{currentHoverData.name} ({hoveredState})</span>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">
                          {currentHoverData.percent}
                        </span>
                      </div>
                      
                      <div className="space-y-1 text-[11px]">
                        <div className="flex justify-between text-zinc-400">
                          <span>Faturamento:</span>
                          <span className="font-bold text-white">{currentHoverData.rev}</span>
                        </div>
                        <div className="flex justify-between text-zinc-400">
                          <span>Pedidos Conf.:</span>
                          <span className="font-bold text-white">{currentHoverData.orders} un.</span>
                        </div>
                        <div className="flex justify-between text-zinc-400">
                          <span>Ticket Médio:</span>
                          <span className="font-bold text-emerald-400">{currentHoverData.ticket}</span>
                        </div>
                      </div>

                      <div className="border-t border-zinc-800 pt-2 space-y-1">
                        <span className="text-[9px] text-zinc-500 uppercase block font-bold">Cidades de Maior Conversão:</span>
                        {currentHoverData.cities.map((c, i) => (
                          <span key={i} className="text-[10px] text-zinc-300 block font-mono">• {c}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* PAINEL DE INSIGHTS REGIONAIS */}
                <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg space-y-4">
                  <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Recomendação Tática Córtex</h3>
                  
                  <div className="space-y-3 text-xs text-zinc-400 font-sans leading-relaxed">
                    <p>
                      **São Paulo e Curitiba** lideram o volume financeiro acumulado no Lote Zero, englobando **56% da liquidez total**.
                    </p>
                    <p className="border-l-2 border-emerald-500 pl-3 text-emerald-400 font-mono text-[11px]">
                      Ação Recomendada: Direcionar 60% do orçamento de anúncios do Instagram/TikTok Ads para o raio de SP Capital e Grande Curitiba no Drop 01.
                    </p>
                  </div>

                  <div className="border-t border-zinc-800 pt-4 space-y-2 font-mono text-[10px]">
                    <span className="text-zinc-500 block uppercase font-bold">Resumo por Região:</span>
                    <div className="flex justify-between text-zinc-300">
                      <span>Sudeste (SP, RJ, MG):</span>
                      <span className="font-bold text-white">65%</span>
                    </div>
                    <div className="flex justify-between text-zinc-300">
                      <span>Sul (PR, SC, RS):</span>
                      <span className="font-bold text-white">27%</span>
                    </div>
                    <div className="flex justify-between text-zinc-300">
                      <span>Nordeste (CE):</span>
                      <span className="font-bold text-white">8%</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* DEMAIS MÓDULOS */}
          {activeModule !== 'cockpit' && activeModule !== 'mapa' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-12 rounded-lg text-center font-mono text-xs text-zinc-400">
              Módulo Mapeado e Pronto para o Próximo Bloco.
            </div>
          )}

        </div>
      </main>
    </div>
  );
}