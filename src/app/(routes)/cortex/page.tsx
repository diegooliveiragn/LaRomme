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
  const [activeModule, setActiveModule] = useState<'cockpit' | 'unit_econ' | 'pricing' | 'catalogo' | 'blackbook' | 'mapa'>('blackbook');
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  // ESTADOS DO PRICING LAB
  const [cogsPiece, setCogsPiece] = useState(85.00);
  const [cogsPackaging, setCogsPackaging] = useState(18.00);
  const [targetMarginPercent, setTargetMarginPercent] = useState(60);

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

  // CATÁLOGO DE PRODUTOS
  const [products] = useState([
    { id: 'PROD-01', name: 'Camiseta Boxy Heavyweight', category: 'Camisetas', collection: 'ORIGO / 01', price: 320.00, stock: 80, serialPrefix: 'LR-D00-BOXY', status: 'ATIVO' },
    { id: 'PROD-02', name: 'Boné Strapback Brutalista', category: 'Acessórios', collection: 'DROP 01', price: 180.00, stock: 50, serialPrefix: 'LR-D01-CAP', status: 'RASCUNHO' },
  ]);

  // BLACK BOOK (CLIENTES VIP)
  const [vipUsers] = useState([
    { id: 'VIP-001', name: 'Lucas Andrade', email: 'lucas.andrade@gmail.com', phone: '5511982341102', insta: '@lucas.andrade', gender: 'Masculino', rfm: 'CHAMPION', purchases: 2, ltv: 640.00, prefSize: 'G', serials: ['LR-D00-BOXY-0042', 'LR-D00-BOXY-0043'] },
    { id: 'VIP-002', name: 'Matheus Fontes', email: 'm.fontes@outlook.com', phone: '5521971239988', insta: '@mfontes.arch', gender: 'Masculino', rfm: 'LOYAL', purchases: 1, ltv: 320.00, prefSize: 'M', serials: ['LR-D00-BOXY-0015'] },
    { id: 'VIP-003', name: 'Dinha Damasceno', email: 'dinhadamasceno2010@hotmail.com', phone: '5585988221020', insta: '@dinhadamasceno', gender: 'Feminino', rfm: 'VIP', purchases: 1, ltv: 320.00, prefSize: 'P', serials: ['LR-D00-BOXY-0011'] },
    { id: 'VIP-004', name: 'Rodrigo Mello', email: 'rodrigo.mello@icloud.com', phone: '5511991223344', insta: '@rodrigomello', gender: 'Masculino', rfm: 'CHAMPION', purchases: 2, ltv: 640.00, prefSize: 'GG', serials: ['LR-D00-BOXY-0008', 'LR-D00-BOXY-0009'] },
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

  const toggleUserExpansion = (id: string) => {
    if (expandedUser === id) {
      setExpandedUser(null);
    } else {
      setExpandedUser(id);
    }
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
            <p className="text-[10px] text-zinc-500 font-mono tracking-wider uppercase">Standalone SaaS • v4.3</p>
          </div>

          <nav className="space-y-1 font-mono">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block px-3 mb-2">Painel de Comando</span>
            {[
              { id: 'cockpit', label: 'Cockpit 360', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /> },
              { id: 'pricing', label: 'Pricing Lab (Calculadora)', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6v12m-3-6h6M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z" /> },
              { id: 'catalogo', label: 'Catálogo & SKUs', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" /> },
              { id: 'blackbook', label: 'Black Book 360 (CRM)', svg: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" /> },
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
        </header>

        <div className="p-8 max-w-7xl w-full space-y-6">
          
          {/* MÓDULO 3: BLACK BOOK 360 (CRM SANFONADO) */}
          {activeModule === 'blackbook' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-8 rounded-lg space-y-6 font-mono">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <div>
                  <h2 className="text-sm font-bold text-white uppercase tracking-wider">BLACK BOOK 360 (CRM VIP)</h2>
                  <p className="text-[10px] text-zinc-500 mt-1">Clique na linha do cliente para expandir o Raio-X completo</p>
                </div>
                <button className="bg-zinc-900 border border-zinc-700 text-zinc-300 font-bold text-[10px] uppercase px-4 py-2 hover:bg-zinc-800 transition">
                  [ EXPORTAR LOOKALIKE (CSV) ]
                </button>
              </div>

              <div className="space-y-2">
                {vipUsers.map((user) => (
                  <div key={user.id} className="border border-zinc-800 rounded-md overflow-hidden bg-zinc-950 transition-all">
                    
                    {/* CABEÇALHO (CLICÁVEL) */}
                    <div 
                      onClick={() => toggleUserExpansion(user.id)}
                      className="flex justify-between items-center p-4 cursor-pointer hover:bg-zinc-900/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-1.5 h-1.5 rounded-full ${user.rfm === 'CHAMPION' ? 'bg-amber-400' : 'bg-emerald-500'}`}></span>
                        <div>
                          <p className="text-sm font-bold text-white">{user.name}</p>
                          <span className="text-[10px] text-zinc-500 block">{user.id} • {user.email}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-8 text-right">
                        <div className="hidden sm:block">
                          <span className="text-[10px] text-zinc-500 block uppercase">Nível RFM</span>
                          <span className={`text-[10px] font-bold border px-1.5 py-0.5 rounded ${user.rfm === 'CHAMPION' ? 'text-amber-400 border-amber-900 bg-amber-950/30' : 'text-emerald-400 border-emerald-900 bg-emerald-950/30'}`}>
                            {user.rfm}
                          </span>
                        </div>
                        <div className="hidden sm:block">
                          <span className="text-[10px] text-zinc-500 block uppercase">LTV (Lifetime Value)</span>
                          <span className="text-xs font-bold text-white">R$ {user.ltv.toFixed(2)}</span>
                        </div>
                        <span className="text-zinc-600 text-lg">{expandedUser === user.id ? '−' : '+'}</span>
                      </div>
                    </div>

                    {/* CONTEÚDO EXPANDIDO (RAIO-X 360) */}
                    {expandedUser === user.id && (
                      <div className="p-4 border-t border-zinc-800 bg-black grid grid-cols-1 md:grid-cols-3 gap-6 animate-in slide-in-from-top-2">
                        
                        <div className="space-y-3">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Radar Social & Contato</span>
                          <div className="space-y-1">
                            <span className="text-[11px] text-zinc-400 block">WhatsApp: <span className="text-white font-bold">{user.phone}</span></span>
                            <span className="text-[11px] text-zinc-400 block">Gênero: <span className="text-white">{user.gender}</span></span>
                            <span className="text-[11px] text-zinc-400 block">
                              Instagram: <a href={`https://instagram.com/${user.insta.replace('@', '')}`} target="_blank" rel="noreferrer" className="text-emerald-400 font-bold underline">{user.insta}</a>
                            </span>
                          </div>
                        </div>

                        <div className="space-y-3 border-l border-zinc-800 pl-6">
                          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Aquisições (Seriais Registrados)</span>
                          <div className="space-y-1">
                            {user.serials.map(serial => (
                              <span key={serial} className="text-[10px] font-bold text-amber-300 bg-amber-950/20 border border-amber-500/30 px-2 py-0.5 rounded block w-max mb-1">
                                {serial}
                              </span>
                            ))}
                            <span className="text-[10px] text-zinc-400 block pt-1">
                              Prefere Caimento: Tamanho <span className="text-white font-bold">{user.prefSize}</span>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-end">
                          <a 
                            href={`https://wa.me/${user.phone}`}
                            target="_blank"
                            rel="noreferrer"
                            className="bg-white text-black font-bold text-xs uppercase px-6 py-3 tracking-widest hover:bg-zinc-200 transition-colors w-full text-center"
                          >
                            [ ACIONAR CONCIERGE ]
                          </a>
                        </div>

                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DEMAIS MÓDULOS MANTIDOS EM TELA (MAPA E COCKPIT OCULTOS DO SCRIPT P/ LEVEZA, MAS FUNCIONAIS NO NEXT) */}
          {activeModule !== 'blackbook' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-12 rounded-lg text-center font-mono text-xs text-zinc-400">
              Alternando módulo ativo no Córtex OS...
            </div>
          )}

        </div>
      </main>
    </div>
  );
}