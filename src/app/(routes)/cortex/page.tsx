'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const CEO_EMAIL = 'diegooliveiragn@gmail.com';
const CEO_CPF = '02477105396';

export default function CortexSaaS() {
  const [activeModule, setActiveModule] = useState<'cockpit' | 'unit_econ' | 'arsenal' | 'producao' | 'logistica' | 'blackbook' | 'persona' | 'seeding' | 'mapa'>('cockpit');
  const [showPersonaPopup, setShowPersonaPopup] = useState(false);

  // --- DUMB DATA GRÁFICOS (RECHARTS) ---
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

  // --- DUMB DATA OPERACIONAL ---
  const [rawTransactions] = useState([
    { id: 'LR-901', client: 'Lucas Andrade', email: 'lucas.andrade@gmail.com', method: 'PIX', amount: 320.00, status: 'APROVADO', state: 'SP' },
    { id: 'LR-902', client: 'Matheus Fontes', email: 'm.fontes@outlook.com', method: 'CARTÃO', amount: 320.00, status: 'APROVADO', state: 'RJ' },
    { id: 'LR-903', client: 'Rodrigo Mello', email: 'rodrigo.mello@icloud.com', method: 'PIX', amount: 640.00, status: 'APROVADO', state: 'SP' },
    { id: 'LR-CEO-TEST', client: 'Diego Oliveira Gomes', email: CEO_EMAIL, method: 'PIX', amount: 1.00, status: 'TESTE_CEO', state: 'CE' }
  ]);

  const isCEO = (email?: string, cpf?: string) => {
    if (!email && !cpf) return false;
    return email?.toLowerCase() === CEO_EMAIL || cpf === CEO_CPF;
  };

  const realTransactions = useMemo(() => rawTransactions.filter(tx => !isCEO(tx.email)), [rawTransactions]);

  const financialMetrics = useMemo(() => {
    const grossRevenue = 18560.00;
    const approvedCount = 58;
    const totalCosts = approvedCount * (95 + 18 + 8.5) + (grossRevenue * 0.06);
    const netProfit = grossRevenue - totalCosts;
    return {
      grossRevenue,
      approvedCount,
      netProfit,
      marginPercent: ((netProfit / grossRevenue) * 100).toFixed(1)
    };
  }, []);

  // Custom Tooltip para Brutalist Design
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black border border-zinc-700 p-3 shadow-xl font-mono text-xs">
          <p className="text-zinc-400 mb-1 uppercase">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="font-bold">
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

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
            <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">DataViz SaaS • v4.0</p>
          </div>

          <nav className="space-y-1">
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block px-3 mb-2">Painel de Comando</span>
            {[
              { id: 'cockpit', label: 'Cockpit 360', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /> },
              { id: 'unit_econ', label: 'Unit Economics', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" /> },
              { id: 'arsenal', label: 'Arsenal & Catálogo', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /> },
              { id: 'logistica', label: 'Logística & Reversa', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635c0 .621.504 1.125 1.125 1.125h2.25" /> },
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

            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block px-3 pt-6 mb-2">Inteligência & Mercado</span>
            {[
              { id: 'blackbook', label: 'Black Book (RFM)', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /> },
              { id: 'mapa', label: 'Heatmap Geográfico', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 6.75V15m6-6v8.25m.503-11.487l4.875 1.218c.26.065.44.298.44.566v11.141c0 .356-.347.625-.694.538l-4.708-1.177A1.5 1.5 0 0114 16.5V6.75M9 6.75V4.838c0-.356.347-.625.694-.538l4.708 1.177c.366.091.598.412.598.788v2.485M9 6.75L4.125 5.532A.563.563 0 003.563 6.1v11.14c0 .357.347.626.694.539L9 16.5" /> },
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

        {/* CEO FOOTER */}
        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/80 flex items-center justify-between text-xs">
          <div>
            <div className="flex items-center gap-2">
              <p className="font-bold text-white">Diego Oliveira</p>
              <span className="px-1.5 py-0.2 text-[8px] bg-amber-500/20 text-amber-300 border border-amber-500/50 rounded font-mono font-bold">CEO</span>
            </div>
            <span className="text-[10px] text-zinc-500 font-mono">Status: INVISÍVEL</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-zinc-800/80 px-8 flex items-center justify-between bg-[#0d0d10]/50 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-zinc-500">CÓRTEX /</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">{activeModule.replace('_', ' ')}</span>
          </div>
          <button className="text-[10px] bg-white text-black font-bold uppercase tracking-widest px-4 py-1.5 hover:bg-zinc-200 transition">
            NOVO PRODUTO +
          </button>
        </header>

        <div className="p-8 max-w-7xl w-full space-y-6">
          
          {/* COCKPIT 360 COM GRÁFICOS RECHARTS */}
          {activeModule === 'cockpit' && (
            <div className="space-y-6">
              {/* KPIs TOP */}
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

              {/* GRÁFICOS DATAVIZ */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* GRÁFICO 1: TRAÇÃO DE VENDAS */}
                <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg font-mono">
                  <div className="flex justify-between items-end mb-6">
                    <div>
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider">Tração de Vendas vs Acessos</h3>
                      <p className="text-[10px] text-zinc-500 mt-1">Velocidade de fechamento por hora do dia.</p>
                    </div>
                    <span className="text-[10px] text-emerald-400 bg-emerald-950/30 border border-emerald-800/50 px-2 py-1 rounded">LIVE FEED</span>
                  </div>
                  <div className="h-64 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={tractionData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis dataKey="time" stroke="#71717a" tick={{fill: '#71717a'}} tickLine={false} axisLine={false} />
                        <YAxis stroke="#71717a" tick={{fill: '#71717a'}} tickLine={false} axisLine={false} />
                        <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#3f3f46', strokeWidth: 1, strokeDasharray: '5 5' }} />
                        <Line type="monotone" dataKey="vendas" name="Vendas Confirmadas" stroke="#10b981" strokeWidth={2} dot={{ r: 4, fill: '#10b981', strokeWidth: 0 }} activeDot={{ r: 6 }} />
                        <Line type="monotone" dataKey="acessos" name="Tráfego (Acessos)" stroke="#52525b" strokeWidth={1} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* GRÁFICO 2: FUNIL DE CONVERSÃO */}
                <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg font-mono">
                  <div className="mb-6">
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider">Funil de Conversão (Drop-off)</h3>
                    <p className="text-[10px] text-zinc-500 mt-1">Onde os clientes estão abandonando a jornada.</p>
                  </div>
                  <div className="h-64 w-full text-[10px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={funnelData} layout="vertical" margin={{ top: 0, right: 30, left: 30, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                        <XAxis type="number" stroke="#71717a" hide />
                        <YAxis dataKey="step" type="category" stroke="#a1a1aa" tickLine={false} axisLine={false} />
                        <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#18181b' }} />
                        <Bar dataKey="users" name="Usuários Ativos" fill="#e4e4e7" radius={[0, 4, 4, 0]} barSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DEMAIS MÓDULOS (Placeholder Visual Temporário) */}
          {activeModule !== 'cockpit' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-12 rounded-lg flex flex-col items-center justify-center text-center space-y-4">
              <span className="text-4xl">🏗️</span>
              <div>
                <h3 className="text-sm font-bold text-white uppercase font-mono tracking-widest">{activeModule.replace('_', ' ')}</h3>
                <p className="text-xs text-zinc-500 mt-2 max-w-md font-sans">
                  A infraestrutura deste módulo foi projetada no Master Blueprint. A visualização de dados via Recharts e Supabase está na fila de renderização tática.
                </p>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}