'use client';

import { useState, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// --- DADOS DO MAPA (SVG PATHS REAIS DO BRASIL) ---
// Coordenadas simplificadas em alta qualidade para os 27 estados
const brazilMapPaths = {
  AC: "M89.7,163.6l-6.9,8.7l-9.1,1.8l-8.4-1.5l-6.9,8.7l-15.3,1.8l-1.5-6.9l8.7-18.6l10.2-2.9l12.4,4.4L89.7,163.6z",
  AL: "M435.5,125.1l0.7,5.1l-6.6,5.1l-6.6-4.4l3.6-7.3L435.5,125.1z",
  AM: "M149.3,27l8,2.2l12.4-7.3l24,13.8l20.4,1.5l40.7-5.1l9.1,11.6l-3.3,10.9l-22.5,9.5l1.8,11.6l-18.2,12.4l-11.6,2.9l-25.5,15.3l-24.7-6.5l-33.8,17.5l-16-16l-33.1,1.5l-2.2-5.1l11.6-13.1l6.5-25.5l17.5-6.5l8-14.5l5.1-13.8l20.4-8L149.3,27z",
  AP: "M257,5.2L270.1,8.8l10.2,21.1l-1.5,14.5l-13.8,10.2l-21.8,2.2L238.8,32l5.8-21.1L257,5.2z",
  BA: "M367.1,136.7l17.5-3.6l23.3-15.3l15.3,2.2l12.4,17.5l5.1,16l-2.9,13.1l-8,5.1l-3.6,18.9l-11.6,13.8l-17.5,7.3l-19.6-11.6l-11.6-26.9l-23.3-8l-18.9-8L367.1,136.7z",
  CE: "M414.4,74.9l8,6.5l8-4.4l8,6.5l2.2,16.7l-9.5,15.3l-9.5-2.2l-14.5-9.5L392.6,88l7.3-8L414.4,74.9z",
  DF: "M298.7,218.9l1.5,3.6l-2.9,2.2l-2.2-2.9L298.7,218.9z",
  ES: "M379.5,237.1l7.3,1.5l8,8.7l0.7,16.7l-9.5,1.5l-8.7-18.2L379.5,237.1z",
  GO: "M281.3,171.6l10.2-2.9l14.5,11.6l15.3,23.3l-1.5,18.2l-10.2,12.4l-11.6,2.2l-14.5,13.1l-18.9-6.5l-11.6-21.8l2.2-23.3L281.3,171.6z",
  MA: "M328.6,56.7l14.5,9.5l14.5,20.4l8.7,21.8l-18.2,30.5l-18.9-10.9l-18.2,4.4l-12.4-15.3l-3.6-21.1l7.3-25.5l10.9-10.9L328.6,56.7z",
  MG: "M354.7,205.8l23.3,13.1l2.9,18.9l-9.5,23.3l-15.3,12.4l-18.2-1.5l-18.2-13.8l-23.3,0.7l-5.1-13.8l10.9-22.5l20.4-4.4L354.7,205.8z",
  MS: "M252.2,253.1l18.9,8l13.1,13.8l10.2,21.1l-10.2,20.4l-18.9,10.2l-21.8,0.7l-15.3-21.1l6.5-23.3l10.9-20.4L252.2,253.1z",
  MT: "M201.2,143.2l20.4-1.5l16.7,18.2l14.5,16l9.5,24l5.1,23.3l-24.7,6.5l-21.8,1.5l-18.2-23.3l-17.5-6.5l-8.7-25.5l5.1-23.3L201.2,143.2z",
  PA: "M251.5,35.7l13.8-5.8l16,21.8l13.8,12.4l3.6,23.3l-5.1,19.6l-18.2,16l-21.1-2.9l-29.8,2.9l-15.3-6.5l-16-16.7l-26.2-8.7l5.1-32l16-24L251.5,35.7z",
  PB: "M435.5,99.6l10.2-2.9l4.4,5.1l0.7,6.5l-16,3.6L435.5,99.6z",
  PE: "M404.2,104l24-10.2l18.9,6.5l-1.5,11.6l-19.6,4.4l-26.9,8L404.2,104z",
  PI: "M353.3,77.8l12.4,17.5l-4.4,24l-9.5,16.7l-18.9,8L322,128l3.6-21.1L353.3,77.8z",
  PR: "M290.7,314.2l19.6-1.5l17.5,13.1l2.9,13.1l-24,10.9l-21.8-0.7l-6.5-13.8L290.7,314.2z",
  RJ: "M368.6,269.1l11.6,2.2l10.2,7.3l-8,8l-18.2-5.1L368.6,269.1z",
  RN: "M434,80.7l12.4,5.1l2.9,8l-12.4,1.5l-6.5-5.1L434,80.7z",
  RO: "M149.3,165.8l18.9,8l21.1-3.6l7.3,13.1l10.2,20.4l-25.5,8l-13.8-13.1l-11.6-12.4L149.3,165.8z",
  RR: "M155.8,1.5L169,4.4l7.3,15.3l-2.9,13.1l-14.5,13.8l-10.2-10.9L155.8,1.5z",
  RS: "M295.1,357.8l20.4,14.5l5.1,20.4l-8.7,21.8l-23.3,13.1l-21.1-13.1l0.7-25.5l10.9-19.6L295.1,357.8z",
  SC: "M310.4,341.1l21.1,0.7l4.4,16.7l-15.3,10.2l-14.5-5.1L310.4,341.1z",
  SE: "M417.3,130.2l8.7,1.5l0.7,5.1l-13.1,8L417.3,130.2z",
  SP: "M310.4,281.4l18.2-0.7l16,11.6l17.5,6.5l-5.1,13.1l-17.5-6.5l-20.4-2.9l-11.6-10.9L310.4,281.4z",
  TO: "M308.9,103.3l14.5,5.1l7.3,18.9l1.5,18.2l-11.6,21.1l-13.1,4.4l-12.4-18.9l-5.1-23.3L308.9,103.3z"
};

const stateDataMap: Record<string, { name: string; rev: string; percent: string; orders: number; ticket: string; cities: string[]; fill: string }> = {
  SP: { name: 'São Paulo', rev: 'R$ 7.800,00', percent: '42%', orders: 24, ticket: 'R$ 325,00', cities: ['SP Capital (60%)', 'Campinas (20%)', 'Ribeirão Preto (20%)'], fill: '#10b981' },
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
  const [cogsPiece, setCogsPiece] = useState(60.00);
  const [cogsPackaging, setCogsPackaging] = useState(10.50);
  const [targetMarginPercent, setTargetMarginPercent] = useState(59);

  // --- DADOS DENSOS PARA O COCKPIT 360 ---
  const tractionData = [
    { time: '10:00', vendas: 2, acessos: 150, ctr: 1.3 },
    { time: '12:00', vendas: 12, acessos: 420, ctr: 2.8 },
    { time: '14:00', vendas: 35, acessos: 980, ctr: 3.5 },
    { time: '16:00', vendas: 48, acessos: 1100, ctr: 4.3 },
    { time: '18:00', vendas: 58, acessos: 1340, ctr: 4.32 },
  ];

  const funnelData = [
    { step: 'Acessos Site', users: 1340 },
    { step: 'Visualizou Peça', users: 890 },
    { step: 'Selecionou Tam.', users: 310 },
    { step: 'Iniciou Checkout', users: 145 },
    { step: 'Pagou (Conversão)', users: 58 },
  ];

  const financialMetrics = useMemo(() => {
    const grossRevenue = 18560.00;
    const approvedCount = 58;
    const totalCosts = approvedCount * (cogsPiece + cogsPackaging + 8.5) + (grossRevenue * 0.06);
    const netProfit = grossRevenue - totalCosts;
    return { grossRevenue, approvedCount, netProfit, marginPercent: ((netProfit / grossRevenue) * 100).toFixed(1) };
  }, [cogsPiece, cogsPackaging]);

  // --- CÁLCULOS PRICING LAB (ANCORAGEM COMPORTAMENTAL) ---
  const pricingCalculations = useMemo(() => {
    const totalDirectCost = cogsPiece + cogsPackaging;
    const taxRate = 0.06; 
    const gatewayRate = 0.04; 
    const divisor = 1 - ((targetMarginPercent / 100) + taxRate + gatewayRate);
    const rawPrice = divisor > 0 ? totalDirectCost / divisor : 0;
    
    // Ancoragem Psicológica: Terminar sempre em ,90 ou ,00
    const anchorPrice = (price: number) => {
      const rounded = Math.round(price / 10) * 10; // Arredonda pra dezena mais próxima (ex: 284 -> 280)
      return rounded > price ? rounded - 0.10 : rounded + 9.90; // Ex: 289.90
    };

    const suggestedPrice = anchorPrice(rawPrice);
    const combatePrice = anchorPrice(rawPrice * 0.85);
    const luxoPrice = anchorPrice(rawPrice * 1.25);

    const netProfit = suggestedPrice - totalDirectCost - (suggestedPrice * taxRate) - (suggestedPrice * gatewayRate);

    return { totalDirectCost, suggestedPrice, netProfit, combatePrice, luxoPrice, rawPrice };
  }, [cogsPiece, cogsPackaging, targetMarginPercent]);

  // --- DADOS DENSOS DO BLACK BOOK (CRM) ---
  const [vipUsers] = useState([
    { id: 'LR-001', name: 'Lucas Andrade', email: 'lucas.andrade@gmail.com', phone: '5511982341102', insta: '@lucas.andrade', gender: 'Masculino', city: 'São Paulo, SP', rfm: 'CHAMPION', purchases: 2, ltv: 640.00, prefSize: 'G', lastBuy: '27/09/2026', serials: ['LR-D00-0042', 'LR-D00-0043'] },
    { id: 'LR-002', name: 'Matheus Fontes', email: 'm.fontes@outlook.com', phone: '5521971239988', insta: '@mfontes.arch', gender: 'Masculino', city: 'Rio de Janeiro, RJ', rfm: 'LOYAL', purchases: 1, ltv: 320.00, prefSize: 'M', lastBuy: '27/09/2026', serials: ['LR-D00-0015'] },
    { id: 'LR-003', name: 'Dinha Damasceno', email: 'dinhadamasceno2010@hotmail.com', phone: '5585988221020', insta: '@dinhadamasceno', gender: 'Feminino', city: 'Fortaleza, CE', rfm: 'VIP', purchases: 1, ltv: 320.00, prefSize: 'P', lastBuy: '27/09/2026', serials: ['LR-D00-0011'] },
    { id: 'LR-004', name: 'Rodrigo Mello', email: 'rodrigo.mello@icloud.com', phone: '5511991223344', insta: '@rodrigomello', gender: 'Masculino', city: 'Campinas, SP', rfm: 'CHAMPION', purchases: 2, ltv: 640.00, prefSize: 'GG', lastBuy: '27/09/2026', serials: ['LR-D00-0008', 'LR-D00-0009'] },
    { id: 'LR-005', name: 'Gabriel Siqueira', email: 'g.siqueira@yahoo.com', phone: '5541988112233', insta: '@gsiqueira', gender: 'Masculino', city: 'Curitiba, PR', rfm: 'NEWBIE', purchases: 1, ltv: 320.00, prefSize: 'M', lastBuy: '27/09/2026', serials: ['LR-D00-0025'] },
    { id: 'LR-006', name: 'Felipe Camargo', email: 'felipe.camargo@gmail.com', phone: '5547990192840', insta: '@fcamargo', gender: 'Masculino', city: 'Balneário C., SC', rfm: 'LOYAL', purchases: 1, ltv: 320.00, prefSize: 'G', lastBuy: '27/09/2026', serials: ['LR-D00-0033'] },
    { id: 'LR-007', name: 'Carolina Dias', email: 'carol.dias@hotmail.com', phone: '5521998887766', insta: '@caroldias', gender: 'Feminino', city: 'Niterói, RJ', rfm: 'NEWBIE', purchases: 1, ltv: 320.00, prefSize: 'P', lastBuy: '27/09/2026', serials: ['LR-D00-0040'] },
    { id: 'LR-008', name: 'Thiago Ventura', email: 't.ventura@gmail.com', phone: '5511977778888', insta: '@thiagov', gender: 'Masculino', city: 'São Paulo, SP', rfm: 'LOYAL', purchases: 1, ltv: 320.00, prefSize: 'M', lastBuy: '27/09/2026', serials: ['LR-D00-0049'] },
  ]);

  const [products] = useState([
    { id: 'PROD-01', name: 'Camiseta Boxy Heavyweight', category: 'Camisetas', collection: 'ORIGO / 01', price: 320.00, stock: 80, serialPrefix: 'LR-D00-BOXY', status: 'ATIVO' },
    { id: 'PROD-02', name: 'Boné Strapback Brutalista', category: 'Acessórios', collection: 'DROP 01', price: 180.00, stock: 50, serialPrefix: 'LR-D01-CAP', status: 'RASCUNHO' },
  ]);

  const handleMouseMoveMap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  const currentHoverData = hoveredState ? stateDataMap[hoveredState] : null;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black border border-zinc-700 p-3 shadow-xl font-mono text-xs z-50">
          <p className="text-zinc-400 mb-1 uppercase">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color || entry.fill }} className="font-bold">{entry.name || entry.dataKey}: {entry.value}</p>
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
            <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">Master Edition • v5.0</p>
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
          
          {/* --- 1. COCKPIT 360 (DADOS DENSOS) --- */}
          {activeModule === 'cockpit' && (
            <div className="space-y-6 font-mono">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-[#0d0d10] border border-zinc-800/80 p-5 rounded-lg">
                  <span className="text-[10px] text-zinc-500 uppercase block mb-1">Faturamento</span>
                  <p className="text-xl font-bold text-white">R$ {financialMetrics.grossRevenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-[#0d0d10] border border-emerald-800/50 bg-emerald-950/10 p-5 rounded-lg">
                  <span className="text-[10px] text-emerald-500 uppercase block mb-1">Lucro Líquido Real</span>
                  <p className="text-xl font-bold text-emerald-400">R$ {financialMetrics.netProfit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="bg-[#0d0d10] border border-zinc-800/80 p-5 rounded-lg">
                  <span className="text-[10px] text-zinc-500 uppercase block mb-1">ROAS (Tráfego)</span>
                  <p className="text-xl font-bold text-white">8.4x</p>
                </div>
                <div className="bg-[#0d0d10] border border-zinc-800/80 p-5 rounded-lg">
                  <span className="text-[10px] text-zinc-500 uppercase block mb-1">CAC (Custo/Cliente)</span>
                  <p className="text-xl font-bold text-white">R$ 38,09</p>
                </div>
                <div className="bg-[#0d0d10] border border-zinc-800/80 p-5 rounded-lg">
                  <span className="text-[10px] text-zinc-500 uppercase block mb-1">Sell-Through (Esgotamento)</span>
                  <p className="text-xl font-bold text-amber-400">72.5%</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Aceleração de Vendas vs Acessos</h3>
                  <div className="h-64 w-full text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={tractionData} margin={{ left: -20, right: 10, top: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                        <XAxis dataKey="time" stroke="#71717a" tickLine={false} axisLine={false} />
                        <YAxis stroke="#71717a" tickLine={false} axisLine={false} />
                        <RechartsTooltip content={<CustomTooltip />} cursor={{ stroke: '#3f3f46' }} />
                        <Line type="monotone" dataKey="vendas" name="Pedidos Aprovados" stroke="#10b981" strokeWidth={3} dot={{r:4, fill:'#10b981', strokeWidth:0}} activeDot={{r:6}} />
                        <Line type="monotone" dataKey="acessos" name="Tráfego Total" stroke="#52525b" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg">
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Funil de Retenção e Drop-off</h3>
                  <div className="h-64 w-full text-[10px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={funnelData} layout="vertical" margin={{ left: 30, right: 10, top: 10 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                        <XAxis type="number" stroke="#71717a" hide />
                        <YAxis dataKey="step" type="category" stroke="#a1a1aa" tickLine={false} axisLine={false} />
                        <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: '#18181b' }} />
                        <Bar dataKey="users" name="Usuários na Etapa" fill="#e4e4e7" radius={[0, 4, 4, 0]} barSize={24}>
                          {funnelData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === 4 ? '#10b981' : '#52525b'} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- 2. PRICING LAB (ANCORAGEM COMPORTAMENTAL) --- */}
          {activeModule === 'pricing' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-8 rounded-lg space-y-8 font-mono">
              <div className="border-b border-zinc-800 pb-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">LABORATÓRIO DE PRECIFICAÇÃO (COMPORTAMENTAL)</h2>
                <p className="text-[10px] text-zinc-500 mt-1">Valores ancorados visualmente com terminações em ,90 ou ,00 baseados nos custos diretos.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-4 bg-zinc-950 p-6 rounded border border-zinc-800">
                  <span className="text-xs font-bold text-amber-300 uppercase block">1. Insumos Brutos (R$)</span>
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-400 block">Fabrico (Peça)</label>
                    <input type="number" value={cogsPiece} onChange={(e) => setCogsPiece(Number(e.target.value))} className="bg-black border border-zinc-800 px-3 py-2 text-white w-full" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-400 block">Embalagem White Glove</label>
                    <input type="number" value={cogsPackaging} onChange={(e) => setCogsPackaging(Number(e.target.value))} className="bg-black border border-zinc-800 px-3 py-2 text-white w-full" />
                  </div>
                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] text-zinc-400 block">Margem Líquida Alvo ({targetMarginPercent}%)</label>
                    <input type="range" min="30" max="80" value={targetMarginPercent} onChange={(e) => setTargetMarginPercent(Number(e.target.value))} className="w-full accent-emerald-500" />
                  </div>
                </div>
                <div className="md:col-span-2 bg-zinc-950 p-6 rounded border border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-4 content-start relative">
                  <span className="absolute top-2 right-4 text-[9px] text-zinc-600">Raw Price: R$ {pricingCalculations.rawPrice.toFixed(2)}</span>
                  <div className="bg-zinc-900/50 p-4 rounded border border-zinc-800 space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase block">Combate</span>
                    <span className="text-2xl font-bold text-white">R$ {pricingCalculations.combatePrice.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="bg-emerald-950/40 p-4 rounded border border-emerald-500/50 space-y-1 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                    <span className="text-[10px] text-emerald-400 font-bold uppercase block">✦ Preço Ideal Ancorado</span>
                    <span className="text-3xl font-bold text-white">R$ {pricingCalculations.suggestedPrice.toFixed(2).replace('.', ',')}</span>
                  </div>
                  <div className="bg-zinc-900/50 p-4 rounded border border-zinc-800 space-y-1">
                    <span className="text-[10px] text-amber-400 uppercase block">Escassez/Luxo</span>
                    <span className="text-2xl font-bold text-amber-300">R$ {pricingCalculations.luxoPrice.toFixed(2).replace('.', ',')}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- 3. CATÁLOGO --- */}
          {activeModule === 'catalogo' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-8 rounded-lg space-y-6 font-mono">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-4">CATÁLOGO & SERIALIZAÇÃO DE DROPS</h2>
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

          {/* --- 4. BLACK BOOK CRM (DENSO) --- */}
          {activeModule === 'blackbook' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-8 rounded-lg space-y-6 font-mono">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">BLACK BOOK 360 (CRM VIP)</h2>
                <span className="text-xs text-zinc-500">Base: 8 Membros Ouro</span>
              </div>
              <div className="space-y-2">
                {vipUsers.map((user) => (
                  <div key={user.id} className="border border-zinc-800 rounded-md overflow-hidden bg-zinc-950 transition-all">
                    <div onClick={() => setExpandedUser(expandedUser === user.id ? null : user.id)} className="grid grid-cols-5 items-center p-4 cursor-pointer hover:bg-zinc-900/80">
                      
                      {/* COLUNA 1: Nome e ID */}
                      <div className="col-span-2 flex items-center gap-4">
                        <span className={`w-2 h-2 rounded-full ${user.rfm === 'CHAMPION' ? 'bg-amber-400 shadow-[0_0_8px_#fbbf24]' : user.rfm === 'NEWBIE' ? 'bg-blue-400' : 'bg-emerald-500 shadow-[0_0_8px_#10b981]'}`}></span>
                        <div>
                          <p className="text-sm font-bold text-white">{user.name}</p>
                          <span className="text-[10px] text-zinc-500">{user.email}</span>
                        </div>
                      </div>

                      {/* COLUNA 2: LTV e RFM */}
                      <div className="hidden md:block col-span-1">
                        <span className="text-[9px] text-zinc-500 uppercase block">LTV / Peças</span>
                        <span className="text-xs font-bold text-white">R$ {user.ltv.toFixed(2)} <span className="text-zinc-500 font-normal">({user.purchases}x)</span></span>
                      </div>

                      <div className="hidden md:block col-span-1">
                        <span className="text-[9px] text-zinc-500 uppercase block">Tag RFM</span>
                        <span className={`text-[9px] font-bold border px-1.5 py-0.5 rounded ${user.rfm === 'CHAMPION' ? 'text-amber-400 border-amber-900 bg-amber-950/30' : user.rfm === 'NEWBIE' ? 'text-blue-400 border-blue-900 bg-blue-950/30' : 'text-emerald-400 border-emerald-900 bg-emerald-950/30'}`}>
                          {user.rfm}
                        </span>
                      </div>

                      {/* COLUNA 3: Ícone */}
                      <div className="col-span-3 md:col-span-1 text-right text-zinc-500 text-lg">
                        {expandedUser === user.id ? '−' : '+'}
                      </div>
                    </div>

                    {/* RAIO-X EXPANDIDO */}
                    {expandedUser === user.id && (
                      <div className="p-5 border-t border-zinc-800 bg-black grid grid-cols-1 md:grid-cols-4 gap-6 animate-in slide-in-from-top-2">
                        
                        <div className="space-y-2">
                          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest block">Demografia</span>
                          <span className="text-[11px] text-zinc-300 block">Cidade: <strong className="text-white">{user.city}</strong></span>
                          <span className="text-[11px] text-zinc-300 block">Gênero: <strong className="text-white">{user.gender}</strong></span>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest block">Radar Social</span>
                          <span className="text-[11px] text-zinc-300 block">Telefone: <strong className="text-white">{user.phone}</strong></span>
                          <span className="text-[11px] text-zinc-300 block">Insta: <a href={`https://instagram.com/${user.insta.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-emerald-400 underline">{user.insta}</a></span>
                        </div>

                        <div className="space-y-2">
                          <span className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest block">Aquisições (Seriais)</span>
                          <div className="flex flex-wrap gap-1">
                            {user.serials.map(s => <span key={s} className="text-[10px] font-bold text-amber-300 bg-amber-950/20 border border-amber-500/30 px-2 py-0.5 rounded">{s}</span>)}
                          </div>
                          <span className="text-[10px] text-zinc-500 block pt-1">Última: {user.lastBuy} • Prefere: {user.prefSize}</span>
                        </div>

                        <div className="flex items-center justify-end">
                          <a href={`https://wa.me/${user.phone}`} target="_blank" rel="noreferrer" className="bg-white text-black font-bold text-[10px] px-6 py-3 hover:bg-zinc-200 uppercase tracking-widest text-center w-full md:w-auto">
                            [ WhatsApp Concierge ]
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* --- 5. MAPA SVG REAL E INTERATIVO --- */}
          {activeModule === 'mapa' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg space-y-6 font-mono">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-4">MAPA VECTORIAL DE DENSIDADE GEOGRÁFICA</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* CONTAINER DO MAPA SVG REAL */}
                <div className="lg:col-span-2 bg-black border border-zinc-800/80 p-6 rounded-lg relative min-h-[460px] flex justify-center items-center" onMouseMove={handleMouseMoveMap}>
                  <svg viewBox="0 0 500 500" className="w-full max-w-[400px] h-auto drop-shadow-2xl">
                    {Object.entries(brazilMapPaths).map(([stateUF, pathData]) => {
                      const isActive = stateDataMap[stateUF];
                      return (
                        <path
                          key={stateUF}
                          d={pathData}
                          fill={isActive ? isActive.fill : '#18181b'}
                          stroke="#000000"
                          strokeWidth="1.5"
                          className="transition-all duration-200 ease-in-out cursor-pointer hover:stroke-white hover:stroke-2"
                          style={{ filter: isActive ? 'drop-shadow(0 0 6px rgba(16, 185, 129, 0.4))' : 'none' }}
                          onMouseEnter={() => isActive && setHoveredState(stateUF)}
                          onMouseLeave={() => setHoveredState(null)}
                        />
                      );
                    })}
                  </svg>
                  
                  {/* TOOLTIP FLUTUANTE REFINADO */}
                  {currentHoverData && (
                    <div className="absolute z-30 pointer-events-none bg-black/95 border border-emerald-500 p-4 rounded shadow-2xl space-y-2 min-w-[200px]" style={{ top: Math.min(mousePos.y + 15, 300), left: Math.min(mousePos.x + 15, 350) }}>
                      <div className="flex justify-between items-center border-b border-zinc-800 pb-1.5">
                        <span className="font-bold text-white uppercase text-xs">{currentHoverData.name}</span>
                        <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-1.5 py-0.5 rounded border border-emerald-800">{currentHoverData.percent}</span>
                      </div>
                      <div className="space-y-1 text-[10px]">
                        <div className="flex justify-between text-zinc-400"><span>Faturamento:</span><span className="font-bold text-white">{currentHoverData.rev}</span></div>
                        <div className="flex justify-between text-zinc-400"><span>Pedidos Conf.:</span><span className="font-bold text-white">{currentHoverData.orders} un.</span></div>
                        <div className="flex justify-between text-zinc-400"><span>Ticket Médio:</span><span className="font-bold text-emerald-400">{currentHoverData.ticket}</span></div>
                      </div>
                      <div className="border-t border-zinc-800 pt-2 space-y-1">
                        <span className="text-[9px] text-zinc-500 uppercase block font-bold">Cidades Tops:</span>
                        {currentHoverData.cities.map((c, i) => <span key={i} className="text-[9px] text-zinc-300 block font-mono">• {c}</span>)}
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg text-xs font-sans space-y-4">
                  <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">Insight Regional</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    O eixo <strong className="text-white">São Paulo e Curitiba</strong> concentra 56% do volume financeiro absorvido no Lote Zero.
                  </p>
                  <div className="border-l-2 border-emerald-500 pl-3 py-1">
                    <p className="text-emerald-400 font-mono text-[10px]">Ação: Alocar 60% do budget de Ads Meta/TikTok no raio de SP Capital e Grande Curitiba para o Drop 01.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}