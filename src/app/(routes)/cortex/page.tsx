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
  const [activeModule, setActiveModule] = useState<'cockpit' | 'unit_econ' | 'pricing' | 'catalogo' | 'blackbook' | 'mapa'>('cockpit');
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // ESTADOS DO PRICING LAB
  const [cogsPiece, setCogsPiece] = useState(85.00);
  const [cogsPackaging, setCogsPackaging] = useState(18.00);
  const [targetMarginPercent, setTargetMarginPercent] = useState(60);

  // CÁLCULO MATEMÁTICO DE PRECIFICAÇÃO
  const pricingCalculations = useMemo(() => {
    const totalDirectCost = cogsPiece + cogsPackaging;
    const taxRate = 0.06; // Simples Nacional 6%
    const gatewayRate = 0.04; // Taxa Média Mercado Pago
    
    // Fórmula: Preço = Custo Direto / (1 - (Margem Desejada + Impostos + Adquirente))
    const divisor = 1 - ((targetMarginPercent / 100) + taxRate + gatewayRate);
    const suggestedPrice = divisor > 0 ? totalDirectCost / divisor : 0;
    
    const estimatedTax = suggestedPrice * taxRate;
    const estimatedGateway = suggestedPrice * gatewayRate;
    const netProfit = suggestedPrice - totalDirectCost - estimatedTax - estimatedGateway;

    return {
      totalDirectCost,
      suggestedPrice,
      netProfit,
      combatePrice: suggestedPrice * 0.85,
      luxoPrice: suggestedPrice * 1.25,
    };
  }, [cogsPiece, cogsPackaging, targetMarginPercent]);

  // CATÁLOGO DE PRODUTOS
  const [products] = useState([
    { id: 'PROD-01', name: 'Camiseta Boxy Heavyweight', category: 'Camisetas', collection: 'ORIGO / 01', price: 320.00, stock: 80, serialPrefix: 'LR-D00-BOXY', status: 'ATIVO' },
    { id: 'PROD-02', name: 'Boné Strapback Brutalista', category: 'Acessórios', collection: 'DROP 01', price: 180.00, stock: 50, serialPrefix: 'LR-D01-CAP', status: 'RASCUNHO' },
    { id: 'PROD-03', name: 'Shorts Oversized Algodão', category: 'Shorts', collection: 'DROP 01', price: 260.00, stock: 40, serialPrefix: 'LR-D01-SHORT', status: 'RASCUNHO' },
  ]);

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
            <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">Standalone SaaS • v4.2</p>
          </div>

          <nav className="space-y-1 font-mono">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block px-3 mb-2">Painel de Comando</span>
            {[
              { id: 'cockpit', label: 'Cockpit 360', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /> },
              { id: 'pricing', label: 'Pricing Lab (Calculadora)', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v12m-3-6h6M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z" /> },
              { id: 'catalogo', label: 'Catálogo & SKUs', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /> },
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

        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/80 flex items-center justify-between text-xs font-mono">
          <div>
            <p className="font-bold text-white">Diego Oliveira</p>
            <span className="text-[10px] text-amber-400">CEO LR • MASTER</span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <header className="h-16 border-b border-zinc-800/80 px-8 flex items-center justify-between bg-[#0d0d10]/50 backdrop-blur-sm sticky top-0 z-10 font-mono">
          <div className="flex items-center gap-4">
            <span className="text-xs text-zinc-500">CÓRTEX /</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">{activeModule.replace('_', ' ')}</span>
          </div>
          <span className="text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-3 py-1 rounded">
            PRICING ENGINE ONLINE
          </span>
        </header>

        <div className="p-8 max-w-7xl w-full space-y-6">
          
          {/* MÓDULO: PRICING LAB */}
          {activeModule === 'pricing' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-8 rounded-lg space-y-8 font-mono">
              <div className="border-b border-zinc-800 pb-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">LABORATÓRIO DE PRECIFICAÇÃO DE LUXO (PRICING ENGINE)</h2>
                <p className="text-[10px] text-zinc-500 mt-1">Insira os custos diretos para calcular o preço ideal de venda por peça com margem protegida</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* ENTRADA DE INPUTS */}
                <div className="space-y-4 bg-zinc-950 p-6 rounded border border-zinc-800">
                  <span className="text-xs font-bold text-amber-300 uppercase block">1. Insumos Brutos por Unidade</span>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-400 block">Custo de Fabricação (Peça + Tag + Costura)</label>
                    <div className="flex items-center bg-black border border-zinc-800 px-3 py-2 text-xs">
                      <span className="text-zinc-500 mr-2">R$</span>
                      <input type="number" value={cogsPiece} onChange={(e) => setCogsPiece(Number(e.target.value))} className="bg-transparent text-white font-bold outline-none w-full" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-400 block">Custo de Unboxing (Caixa + Seda + Perfume)</label>
                    <div className="flex items-center bg-black border border-zinc-800 px-3 py-2 text-xs">
                      <span className="text-zinc-500 mr-2">R$</span>
                      <input type="number" value={cogsPackaging} onChange={(e) => setCogsPackaging(Number(e.target.value))} className="bg-transparent text-white font-bold outline-none w-full" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-400 block">Margem Líquida Alvo (%)</label>
                    <input type="range" min="30" max="80" value={targetMarginPercent} onChange={(e) => setTargetMarginPercent(Number(e.target.value))} className="w-full accent-emerald-500" />
                    <span className="text-xs text-emerald-400 font-bold block text-right">{targetMarginPercent}% de Margem Limpa</span>
                  </div>
                </div>

                {/* RESULTADO PREÇO SUGERIDO */}
                <div className="md:col-span-2 bg-zinc-950 p-6 rounded border border-zinc-800 flex flex-col justify-between space-y-6">
                  <span className="text-xs font-bold text-emerald-400 uppercase block">2. Sugestão Algorítmica de Preço</span>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-zinc-900/50 p-4 rounded border border-zinc-800 space-y-1">
                      <span className="text-[10px] text-zinc-500 uppercase block">Margem de Combate</span>
                      <span className="text-lg font-bold text-white">R$ {pricingCalculations.combatePrice.toFixed(2)}</span>
                      <span className="text-[9px] text-zinc-500 block">Volume rápido</span>
                    </div>

                    <div className="bg-emerald-950/40 p-4 rounded border border-emerald-500/50 space-y-1 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase block">✦ Preço Ideal Recomendado</span>
                      <span className="text-2xl font-bold text-white">R$ {pricingCalculations.suggestedPrice.toFixed(2)}</span>
                      <span className="text-[9px] text-emerald-300 block font-bold">Margem {targetMarginPercent}% Preservada</span>
                    </div>

                    <div className="bg-zinc-900/50 p-4 rounded border border-zinc-800 space-y-1">
                      <span className="text-[10px] text-amber-400 uppercase block">Margem Escassez / Luxo</span>
                      <span className="text-lg font-bold text-amber-300">R$ {pricingCalculations.luxoPrice.toFixed(2)}</span>
                      <span className="text-[9px] text-zinc-500 block">Lotes ultra-restritos</span>
                    </div>
                  </div>

                  <div className="border-t border-zinc-800 pt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                    <div>
                      <span className="text-zinc-500 block text-[10px]">CUSTO DIRETO TOTAL</span>
                      <span className="font-bold text-red-400">R$ {pricingCalculations.totalDirectCost.toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px]">IMPOSTO SIMPLES (6%)</span>
                      <span className="font-bold text-red-400">R$ {(pricingCalculations.suggestedPrice * 0.06).toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-zinc-500 block text-[10px]">GATEWAY MÉDIO (4%)</span>
                      <span className="font-bold text-red-400">R$ {(pricingCalculations.suggestedPrice * 0.04).toFixed(2)}</span>
                    </div>
                    <div>
                      <span className="text-emerald-400 font-bold block text-[10px]">LUCRO LÍQUIDO/PEÇA</span>
                      <span className="font-bold text-emerald-400">+ R$ {pricingCalculations.netProfit.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* MÓDULO: CATÁLOGO & DROPS */}
          {activeModule === 'catalogo' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-8 rounded-lg space-y-6 font-mono">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">GESTÃO DE CATÁLOGO & SERIALIZAÇÃO DE DROPS</h2>
                  <p className="text-[10px] text-zinc-500 mt-1">Matriz de produtos ativos e identificadores únicos por peça (`LR-Serial`)</p>
                </div>
                <button className="bg-white text-black font-bold text-xs uppercase px-4 py-2 hover:bg-zinc-200 transition">
                  + CADASTRAR NOVO NOVO ITEM
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-900 text-zinc-400 uppercase text-[9px] border-b border-zinc-800">
                    <tr>
                      <th className="p-3">ID / Produto</th>
                      <th className="p-3">Categoria</th>
                      <th className="p-3">Coleção</th>
                      <th className="p-3">Preço</th>
                      <th className="p-3">Estoque</th>
                      <th className="p-3">Prefixo LR-Serial</th>
                      <th className="p-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td className="p-3 font-bold text-white">{p.name} <span className="block text-[10px] text-zinc-500">{p.id}</span></td>
                        <td className="p-3 text-zinc-300">{p.category}</td>
                        <td className="p-3 text-zinc-400">{p.collection}</td>
                        <td className="p-3 font-bold text-emerald-400">R$ {p.price.toFixed(2)}</td>
                        <td className="p-3 text-white">{p.stock} un.</td>
                        <td className="p-3"><span className="px-2 py-0.5 text-[9px] bg-zinc-900 border border-zinc-700 rounded font-bold text-amber-300">{p.serialPrefix}-XXXX</span></td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 text-[9px] rounded font-bold ${p.status === 'ATIVO' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}>
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* COCKPIT MANTIDO */}
          {activeModule === 'cockpit' && (
            <div className="space-y-6 font-mono">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-[#0d0d10] border border-zinc-800/80 p-5 rounded-lg">
                  <span className="text-[10px] text-zinc-500 uppercase">FATURAMENTO BRUTO</span>
                  <p className="text-2xl font-bold text-white mt-1">R$ 18.560,00</p>
                </div>
                <div className="bg-[#0d0d10] border border-zinc-800/80 p-5 rounded-lg">
                  <span className="text-[10px] text-zinc-500 uppercase">LUCRO LÍQUIDO REAL</span>
                  <p className="text-2xl font-bold text-emerald-400 mt-1">R$ 10.708,54</p>
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

                <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg">
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

          {/* DEMAIS MÓDULOS */}
          {activeModule !== 'cockpit' && activeModule !== 'pricing' && activeModule !== 'catalogo' && activeModule !== 'mapa' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-12 rounded-lg text-center font-mono text-xs text-zinc-400">
              Módulo Mapeado e Pronto para Renderização.
            </div>
          )}

        </div>
      </main>
    </div>
  );
}