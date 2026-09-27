'use client';

import { useState, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const CEO_EMAIL = 'diegooliveiragn@gmail.com';

const stateDataMap: Record<string, { name: string; rev: string; percent: string; orders: number; ticket: string; cities: string[]; fill: string }> = {
  SP: { name: 'São Paulo', rev: 'R$ 7.800,00', percent: '42%', orders: 24, ticket: 'R$ 325,00', cities: ['São Paulo Capital (60%)', 'Campinas (20%)', 'Ribeirão Preto (20%)'], fill: '#10b981' },
  RJ: { name: 'Rio de Janeiro', rev: 'R$ 3.340,00', percent: '18%', orders: 10, ticket: 'R$ 334,00', cities: ['Rio Capital (70%)', 'Niterói (30%)'], fill: '#059669' },
  PR: { name: 'Paraná', rev: 'R$ 2.600,00', percent: '14%', orders: 8, ticket: 'R$ 325,00', cities: ['Curitiba (80%)', 'Maringá (20%)'], fill: '#047857' },
  SC: { name: 'Santa Catarina', rev: 'R$ 1.850,00', percent: '10%', orders: 6, ticket: 'R$ 308,00', cities: ['Florianópolis (60%)', 'Balneário Camboriú (40%)'], fill: '#065f46' },
  CE: { name: 'Ceará', rev: 'R$ 1.480,00', percent: '8%', orders: 5, ticket: 'R$ 296,00', cities: ['Fortaleza (100%)'], fill: '#064e3b' },
};

export default function CortexSaaS() {
  const [activeModule, setActiveModule] = useState<'cockpit' | 'pricing' | 'catalogo' | 'blackbook' | 'mapa'>('cockpit');
  
  // ESTADOS DO MAPA
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  // ESTADOS DO BLACKBOOK
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  // ESTADOS DO PRICING LAB
  const [cogsPiece, setCogsPiece] = useState(85.00);
  const [cogsPackaging, setCogsPackaging] = useState(18.00);
  const [targetMarginPercent, setTargetMarginPercent] = useState(60);

  // DADOS COCKPIT
  const tractionData = [
    { time: '10:00', vendas: 2, acessos: 150 },
    { time: '12:00', vendas: 12, acessos: 420 },
    { time: '14:00', vendas: 35, acessos: 980 },
    { time: '16:00', vendas: 48, acessos: 1100 },
    { time: '18:00', vendas: 58, acessos: 1340 },
  ];

  const funnelData = [
    { step: 'Acessos', users: 1340 },
    { step: 'Página Peça', users: 890 },
    { step: 'Tamanho', users: 310 },
    { step: 'Checkout', users: 145 },
    { step: 'Pago OK', users: 58 },
  ];

  const financialMetrics = useMemo(() => {
    const grossRevenue = 18560.00;
    const approvedCount = 58;
    const totalCosts = approvedCount * (95 + 18 + 8.5) + (grossRevenue * 0.06);
    const netProfit = grossRevenue - totalCosts;
    return { grossRevenue, approvedCount, netProfit, marginPercent: ((netProfit / grossRevenue) * 100).toFixed(1) };
  }, []);

  // CÁLCULOS PRICING LAB
  const pricingCalculations = useMemo(() => {
    const totalDirectCost = cogsPiece + cogsPackaging;
    const taxRate = 0.06; 
    const gatewayRate = 0.04; 
    const divisor = 1 - ((targetMarginPercent / 100) + taxRate + gatewayRate);
    const suggestedPrice = divisor > 0 ? totalDirectCost / divisor : 0;
    const estimatedTax = suggestedPrice * taxRate;
    const estimatedGateway = suggestedPrice * gatewayRate;
    const netProfit = suggestedPrice - totalDirectCost - estimatedTax - estimatedGateway;

    return { totalDirectCost, suggestedPrice, netProfit, combatePrice: suggestedPrice * 0.85, luxoPrice: suggestedPrice * 1.25 };
  }, [cogsPiece, cogsPackaging, targetMarginPercent]);

  // DADOS CATÁLOGO
  const [products] = useState([
    { id: 'PROD-01', name: 'Camiseta Boxy Heavyweight', category: 'Camisetas', collection: 'ORIGO / 01', price: 320.00, stock: 80, serialPrefix: 'LR-D00-BOXY', status: 'ATIVO' },
    { id: 'PROD-02', name: 'Boné Strapback Brutalista', category: 'Acessórios', collection: 'DROP 01', price: 180.00, stock: 50, serialPrefix: 'LR-D01-CAP', status: 'RASCUNHO' },
  ]);

  // DADOS BLACK BOOK
  const [vipUsers] = useState([
    { id: 'VIP-001', name: 'Lucas Andrade', email: 'lucas.andrade@gmail.com', phone: '5511982341102', insta: '@lucas.andrade', gender: 'Masculino', rfm: 'CHAMPION', ltv: 640.00, prefSize: 'G', serials: ['LR-D00-BOXY-0042', 'LR-D00-BOXY-0043'] },
    { id: 'VIP-002', name: 'Matheus Fontes', email: 'm.fontes@outlook.com', phone: '5521971239988', insta: '@mfontes.arch', gender: 'Masculino', rfm: 'LOYAL', ltv: 320.00, prefSize: 'M', serials: ['LR-D00-BOXY-0015'] },
    { id: 'VIP-003', name: 'Dinha Damasceno', email: 'dinhadamasceno2010@hotmail.com', phone: '5585988221020', insta: '@dinhadamasceno', gender: 'Feminino', rfm: 'VIP', ltv: 320.00, prefSize: 'P', serials: ['LR-D00-BOXY-0011'] },
  ]);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  const currentHoverData = hoveredState ? stateDataMap[hoveredState] : null;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black border border-zinc-700 p-3 shadow-xl font-mono text-xs">
          <p className="text-zinc-400 mb-1 uppercase">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="font-bold">{entry.name}: {entry.value}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex font-sans antialiased selection:bg-emerald-500 selection:text-black">
      
      {/* SIDEBAR MESTRE */}
      <aside className="w-64 bg-[#0d0d10] border-r border-zinc-800/80 flex flex-col justify-between shrink-0 hidden md:flex">
        <div className="p-6 space-y-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
              <h1 className="font-bold tracking-widest text-lg text-white uppercase font-mono">CÓRTEX OS</h1>
            </div>
            <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">Master Edition • v4.4</p>
          </div>

          <nav className="space-y-1 font-mono">
            {[
              { id: 'cockpit', label: 'Cockpit 360', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /> },
              { id: 'pricing', label: 'Pricing Lab', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v12m-3-6h6M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z" /> },
              { id: 'catalogo', label: 'Catálogo & SKUs', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /> },
              { id: 'blackbook', label: 'Black Book (CRM)', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /> },
              { id: 'mapa', label: 'Heatmap Brasil', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 6.75V15m6-6v8.25m.503-11.487l4.875 1.218c.26.065.44.298.44.566v11.141c0 .356-.347.625-.694.538l-4.708-1.177A1.5 1.5 0 0114 16.5V6.75M9 6.75V4.838c0-.356.347-.625.694-.538l4.708 1.177c.366.091.598.412.598.788v2.485M9 6.75L4.125 5.532A.563.563 0 003.563 6.1v11.14c0 .357.347.626.694.539L9 16.5" /> },
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
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-zinc-800/80 px-8 flex items-center justify-between bg-[#0d0d10]/50 backdrop-blur-sm sticky top-0 z-10 font-mono">
          <div className="flex items-center gap-4">
            <span className="text-xs text-zinc-500">CÓRTEX /</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">{activeModule.replace('_', ' ')}</span>
          </div>
        </header>

        <div className="p-8 max-w-7xl w-full space-y-6">
          
          {/* --- 1. COCKPIT 360 --- */}
          {activeModule === 'cockpit' && (
            <div className="space-y-6 font-mono">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Tração vs Acessos</h3>
                  <div className="h-64 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={tractionData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis dataKey="time" stroke="#71717a" />
                        <YAxis stroke="#71717a" />
                        <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#3f3f46' }} />
                        <Line type="monotone" dataKey="vendas" stroke="#10b981" strokeWidth={2} />
                        <Line type="monotone" dataKey="acessos" stroke="#52525b" strokeWidth={1} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Funil de Conversão</h3>
                  <div className="h-64 w-full text-[10px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={funnelData} layout="vertical" margin={{ left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                        <XAxis type="number" stroke="#71717a" hide />
                        <YAxis dataKey="step" type="category" stroke="#a1a1aa" tickLine={false} axisLine={false} />
                        <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#18181b' }} />
                        <Bar dataKey="users" name="Usuários" fill="#e4e4e7" radius={[0, 4, 4, 0]} barSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- 2. PRICING LAB --- */}
          {activeModule === 'pricing' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-8 rounded-lg space-y-8 font-mono">
              <div className="border-b border-zinc-800 pb-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">LABORATÓRIO DE PRECIFICAÇÃO (PRICING ENGINE)</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4 bg-zinc-950 p-6 rounded border border-zinc-800">
                  <span className="text-xs font-bold text-amber-300 uppercase block">1. Custos Diretos</span>
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-400 block">Fabrico (Peça)</label>
                    <input type="number" value={cogsPiece} onChange={(e) => setCogsPiece(Number(e.target.value))} className="bg-black border border-zinc-800 px-3 py-2 text-white w-full" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-400 block">Embalagem White Glove</label>
                    <input type="number" value={cogsPackaging} onChange={(e) => setCogsPackaging(Number(e.target.value))} className="bg-black border border-zinc-800 px-3 py-2 text-white w-full" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-400 block">Margem Alvo ({targetMarginPercent}%)</label>
                    <input type="range" min="30" max="80" value={targetMarginPercent} onChange={(e) => setTargetMarginPercent(Number(e.target.value))} className="w-full accent-emerald-500" />
                  </div>
                </div>
                <div className="md:col-span-2 bg-zinc-950 p-6 rounded border border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-4 content-start">
                  <div className="bg-zinc-900/50 p-4 rounded border border-zinc-800 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase block">Combate</span>
                    <span className="text-lg font-bold text-white">R$ {pricingCalculations.combatePrice.toFixed(2)}</span>
                  </div>
                  <div className="bg-emerald-950/40 p-4 rounded border border-emerald-500/50 space-y-1 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase block">✦ Preço Ideal</span>
                    <span className="text-2xl font-bold text-white">R$ {pricingCalculations.suggestedPrice.toFixed(2)}</span>
                  </div>
                  <div className="bg-zinc-900/50 p-4 rounded border border-zinc-800 space-y-1">
                    <span className="text-[10px] text-amber-400 uppercase block">Luxo</span>
                    <span className="text-lg font-bold text-amber-300">R$ {pricingCalculations.luxoPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- 3. CATÁLOGO --- */}
          {activeModule === 'catalogo' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-8 rounded-lg space-y-6 font-mono">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-zinc-800 pb-4">CATÁLOGO & SERIALIZAÇÃO DE DROPS</h2>
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-900 text-zinc-400 uppercase text-[9px] border-b border-zinc-800">
                  <tr><th className="p-3">Produto</th><th className="p-3">Preço</th><th className="p-3">Estoque</th><th className="p-3">Prefixo Serial</th></tr>
                </thead>
                <tbody className="divide-y divide-zinc-900">
                  {products.map((p) => (
                    <tr key={p.id}>
                      <td className="p-3 font-bold text-white">{p.name} <span className="block text-[10px] text-zinc-500">{p.id}</span></td>
                      <td className="p-3 font-bold text-emerald-400">R$ {p.price.toFixed(2)}</td>
                      <td className="p-3 text-white">{p.stock} un.</td>
                      <td className="p-3 text-amber-300 font-bold bg-zinc-900">{p.serialPrefix}-XXXX</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* --- 4. BLACK BOOK CRM --- */}
          {activeModule === 'blackbook' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-8 rounded-lg space-y-6 font-mono">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-4">BLACK BOOK 360 (CRM VIP)</h2>
              <div className="space-y-2">
                {vipUsers.map((user) => (
                  <div key={user.id} className="border border-zinc-800 rounded-md overflow-hidden bg-zinc-950 transition-all">
                    <div onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)} className="flex justify-between items-center p-4 cursor-pointer hover:bg-zinc-900/50">
                      <div className="flex items-center gap-4">
                        <span className={`w-1.5 h-1.5 rounded-full ${user.rfm === 'CHAMPION' ? 'bg-amber-400' : 'bg-emerald-500'}`}></span>
                        <div><p className="text-sm font-bold text-white">{user.name}</p><span className="text-[10px] text-zinc-500">{user.email}</span></div>
                      </div>
                      <span className="text-zinc-600 text-lg">{expandedUser === user.id ? '−' : '+'}</span>
                    </div>
                    {expandedUser === user.id && (
                      <div className="p-4 border-t border-zinc-800 bg-black grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-2">
                        <div className="space-y-1 text-[11px] text-zinc-400">
                          <span className="block">WhatsApp: <strong className="text-white">{user.phone}</strong></span>
                          <span className="block">Insta: <strong className="text-emerald-400 underline">{user.insta}</strong></span>
                        </div>
                        <div className="space-y-1">
                          {user.serials.map(s => <span key={s} className="text-[10px] font-bold text-amber-300 bg-amber-950/20 border border-amber-500/30 px-2 py-0.5 rounded block w-max">{s}</span>)}
                        </div>
                        <div className="text-right">
                          <a href={`https://wa.me/${user.phone}`} target="_blank" rel="noreferrer" className="bg-white text-black font-bold text-xs px-4 py-2 hover:bg-zinc-200 uppercase inline-block">WhatsApp direto</a>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- 5. MAPA SVG --- */}
          {activeModule === 'mapa' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg space-y-6 font-mono">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-4">MAPA VECTORIAL — BRASIL</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 bg-black border border-zinc-800/80 p-6 rounded-lg relative min-h-[420px] flex justify-center" onMouseMove={handleMouseMove}>
                  <svg viewBox="0 0 600 600" className="w-full h-auto max-h-[400px]">
                    {/* ESTADOS ATIVOS */}
                    <path d="M 390 140 L 420 135 L 430 160 L 400 170 Z" fill={stateDataMap['CE'].fill} stroke="#09090b" strokeWidth="2" className="cursor-pointer hover:opacity-80 hover:stroke-white" onMouseEnter={() => setHoveredState('CE')} onMouseLeave={() => setHoveredState(null)}/>
                    <path d="M 330 360 L 380 350 L 395 385 L 340 395 Z" fill={stateDataMap['SP'].fill} stroke="#09090b" strokeWidth="2" className="cursor-pointer hover:opacity-80 hover:stroke-white" onMouseEnter={() => setHoveredState('SP')} onMouseLeave={() => setHoveredState(null)}/>
                    <path d="M 395 365 L 430 360 L 425 380 L 395 385 Z" fill={stateDataMap['RJ'].fill} stroke="#09090b" strokeWidth="2" className="cursor-pointer hover:opacity-80 hover:stroke-white" onMouseEnter={() => setHoveredState('RJ')} onMouseLeave={() => setHoveredState(null)}/>
                    <path d="M 310 400 L 360 395 L 355 425 L 305 420 Z" fill={stateDataMap['PR'].fill} stroke="#09090b" strokeWidth="2" className="cursor-pointer hover:opacity-80 hover:stroke-white" onMouseEnter={() => setHoveredState('PR')} onMouseLeave={() => setHoveredState(null)}/>
                    <path d="M 320 430 L 365 425 L 360 455 L 315 450 Z" fill={stateDataMap['SC'].fill} stroke="#09090b" strokeWidth="2" className="cursor-pointer hover:opacity-80 hover:stroke-white" onMouseEnter={() => setHoveredState('SC')} onMouseLeave={() => setHoveredState(null)}/>
                    {/* INATIVOS */}
                    <path d="M 120 100 L 280 80 L 260 220 L 100 180 Z" fill="#18181b" stroke="#09090b" strokeWidth="1.5" />
                    <path d="M 280 80 L 380 90 L 350 200 L 260 220 Z" fill="#18181b" stroke="#09090b" strokeWidth="1.5" />
                    <path d="M 250 225 L 340 210 L 350 300 L 260 310 Z" fill="#18181b" stroke="#09090b" strokeWidth="1.5" />
                  </svg>
                  {currentHoverData && (
                    <div className="absolute z-30 pointer-events-none bg-black border border-emerald-500 p-4 rounded shadow-2xl space-y-2 min-w-[200px]" style={{ top: Math.min(mousePos.y + 15, 260), left: Math.min(mousePos.x + 15, 320) }}>
                      <span className="font-bold text-white uppercase text-xs">{currentHoverData.name}</span>
                      <div className="text-[11px] text-zinc-400">Faturamento: <span className="text-white font-bold">{currentHoverData.rev}</span></div>
                    </div>
                  )}
                </div>
                <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg text-xs text-zinc-400 font-sans">
                  SP e Curitiba englobam 56% da liquidez. Focar Ads nestas regiões.
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}