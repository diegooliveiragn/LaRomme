'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

type ModuleType = 'cockpit' | 'tesouraria' | 'dre' | 'pricing' | 'catalogo' | 'estoque' | 'fornecedores' | 'marketing' | 'blackbook' | 'mapa';

export default function CortexEnterprise() {
  const [activeModule, setActiveModule] = useState<ModuleType>('catalogo');
  const [loadingDb, setLoadingDb] = useState(true);

  // BANCO DE DADOS EM TEMPO REAL (SUPABASE)
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  // MAPA & CRM
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [expandedUser, setExpandedUser] = useState<string | null>(null);
  const [generatedInvites, setGeneratedInvites] = useState<Record<string, string[]>>({});

  // PRICING LAB & STRESS TEST
  const [cogsPiece, setCogsPiece] = useState(60.00);
  const [cogsPackaging, setCogsPackaging] = useState(10.50);
  const [targetMarginPercent, setTargetMarginPercent] = useState(59);
  const [stressTestInflation, setStressTestInflation] = useState(0);

  // CADASTRO NOVO PRODUTO NO BANCO
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Camisetas');
  const [newProductPrice, setNewProductPrice] = useState(320);
  const [newProductStock, setNewProductStock] = useState(50);

  // CARREGA DADOS DO SUPABASE REAL
  useEffect(() => {
    async function loadSupabaseData() {
      setLoadingDb(true);
      try {
        const { data: dbProducts } = await supabase.from('products').select('*');
        const { data: dbCustomers } = await supabase.from('customers').select('*');
        const { data: dbOrders } = await supabase.from('orders').select('*');

        if (dbProducts && dbProducts.length > 0) setProducts(dbProducts);
        if (dbCustomers && dbCustomers.length > 0) setCustomers(dbCustomers);
        if (dbOrders && dbOrders.length > 0) setOrders(dbOrders);
      } catch (err) {
        console.error('Erro ao conectar ao Supabase:', err);
      } finally {
        setLoadingDb(false);
      }
    }
    loadSupabaseData();
  }, []);

  // FINANÇAS & CCC
  const financialData = {
    grossRevenue: 18560.00, taxes: 1113.60, gatewayFees: 742.40,
    cogs: 6554.00, marketing: 1200.00, software: 250.00,
    cashIn: 15400.00, cashOut: 8004.00, pendingReceivables: 3160.00
  };

  const cccMetrics = {
    dio: 35, dso: 2, dpo: 15,
    get ccc() { return this.dio + this.dso - this.dpo; }
  };

  const suppliers = [
    { id: 'FORN-01', name: 'Malharia Sul (Tecido)', sla: '15 dias', costLevel: '$$$', quality: '98%', status: 'PAGO' },
    { id: 'FORN-02', name: 'Oficina Costura SP', sla: '10 dias', costLevel: '$$', quality: '95%', status: 'A PAGAR' },
    { id: 'FORN-03', name: 'Embalagens Premium', sla: '5 dias', costLevel: '$', quality: '100%', status: 'PAGO' },
  ];

  const inventoryValuation = {
    totalUnits: 130, costValue: 7800.00, retailValue: 41600.00,
    safetyStock: 10, leadTime: 20,
    items: [
      { sku: 'BOXY-BLK-P', qty: 12, cost: 60, retail: 320, velocity: 0.5, status: 'SAUDÁVEL' },
      { sku: 'BOXY-BLK-M', qty: 45, cost: 60, retail: 320, velocity: 1.2, status: 'SAUDÁVEL' },
      { sku: 'BOXY-BLK-G', qty: 28, cost: 60, retail: 320, velocity: 0.8, status: 'SAUDÁVEL' },
    ]
  };

  const cohortData = [
    { cohort: 'Lote Zero (Set/26)', buyers: 58, retentionD30: '100%', retentionD60: '42%', retentionD90: '38%' },
    { cohort: 'Drop 01 (Previsão)', buyers: 120, retentionD30: '---', retentionD60: '---', retentionD90: '---' },
  ];

  const brazilMapPaths: Record<string, string> = {
    SP: "M310.4,281.4l18.2-0.7l16,11.6l17.5,6.5l-5.1,13.1l-17.5-6.5l-20.4-2.9l-11.6-10.9L310.4,281.4z",
    RJ: "M368.6,269.1l11.6,2.2l10.2,7.3l-8,8l-18.2-5.1L368.6,269.1z",
    PR: "M290.7,314.2l19.6-1.5l17.5,13.1l2.9,13.1l-24,10.9l-21.8-0.7l-6.5-13.8L290.7,314.2z",
    SC: "M310.4,341.1l21.1,0.7l4.4,16.7l-15.3,10.2l-14.5-5.1L310.4,341.1z",
    CE: "M414.4,74.9l8,6.5l8-4.4l8,6.5l2.2,16.7l-9.5,15.3l-9.5-2.2l-14.5-9.5L392.6,88l7.3-8L414.4,74.9z"
  };

  const stateDataMap: Record<string, { name: string; rev: string; percent: string; orders: number; ticket: string; cities: string[]; fill: string }> = {
    SP: { name: 'São Paulo', rev: 'R$ 7.800,00', percent: '42%', orders: 24, ticket: 'R$ 325,00', cities: ['SP Capital (60%)', 'Campinas (20%)'], fill: '#10b981' },
    RJ: { name: 'Rio de Janeiro', rev: 'R$ 3.340,00', percent: '18%', orders: 10, ticket: 'R$ 334,00', cities: ['Rio Capital (70%)', 'Niterói (30%)'], fill: '#059669' },
    PR: { name: 'Paraná', rev: 'R$ 2.600,00', percent: '14%', orders: 8, ticket: 'R$ 325,00', cities: ['Curitiba (80%)'], fill: '#047857' },
    SC: { name: 'Santa Catarina', rev: 'R$ 1.850,00', percent: '10%', orders: 6, ticket: 'R$ 308,00', cities: ['Florianópolis (60%)'], fill: '#065f46' },
    CE: { name: 'Ceará', rev: 'R$ 1.480,00', percent: '8%', orders: 5, ticket: 'R$ 296,00', cities: ['Fortaleza (100%)'], fill: '#064e3b' },
  };

  const tractionData = [
    { time: '10:00', vendas: 2, acessos: 150 }, { time: '12:00', vendas: 12, acessos: 420 },
    { time: '14:00', vendas: 35, acessos: 980 }, { time: '16:00', vendas: 48, acessos: 1100 },
    { time: '18:00', vendas: 58, acessos: 1340 },
  ];

  const funnelData = [
    { step: 'Acessos Site', users: 1340 }, { step: 'Visualizou Peça', users: 890 },
    { step: 'Selecionou Tam.', users: 310 }, { step: 'Iniciou Checkout', users: 145 },
    { step: 'Pagou (Conversão)', users: 58 },
  ];

  // PRECIFICAÇÃO & TESTE DE ESTRESSE
  const pricingCalculations = useMemo(() => {
    const inflationMultiplier = 1 + (stressTestInflation / 100);
    const totalDirectCost = (cogsPiece + cogsPackaging) * inflationMultiplier;
    const taxRate = 0.06; const gatewayRate = 0.04;
    const divisor = 1 - ((targetMarginPercent / 100) + taxRate + gatewayRate);
    const rawPrice = divisor > 0 ? totalDirectCost / divisor : 0;
    
    const anchorPrice = (price: number) => {
      const rounded = Math.round(price / 10) * 10;
      return rounded > price ? rounded - 0.10 : rounded + 9.90;
    };

    const suggestedPrice = anchorPrice(rawPrice);
    const combatePrice = anchorPrice(rawPrice * 0.85);
    const luxoPrice = anchorPrice(rawPrice * 1.25);
    const netProfit = suggestedPrice - totalDirectCost - (suggestedPrice * taxRate) - (suggestedPrice * gatewayRate);

    return { totalDirectCost, suggestedPrice, netProfit, combatePrice, luxoPrice, rawPrice, stressedPiece: cogsPiece * inflationMultiplier };
  }, [cogsPiece, cogsPackaging, targetMarginPercent, stressTestInflation]);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName) return;

    const skuCode = `${newProductCategory.substring(0,3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    const serialPrefix = `LR-D01-${newProductCategory.substring(0,3).toUpperCase()}`;

    const newProd = {
      sku_code: skuCode,
      name: newProductName,
      category: newProductCategory,
      collection: 'DROP 01',
      price: Number(newProductPrice),
      cost_piece: 60.00,
      cost_packaging: 10.50,
      stock: Number(newProductStock),
      serial_prefix: serialPrefix,
      status: 'ATIVO'
    };

    const { data, error } = await supabase.from('products').insert([newProd]).select();

    if (!error && data) {
      setProducts([...products, data[0]]);
      setNewProductName('');
      alert('Produto cadastrado e sincronizado no Supabase com sucesso!');
    } else {
      console.error(error);
      alert('Erro ao gravar no Supabase. Verifique as credenciais.');
    }
  };

  const handleMouseMoveMap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

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

  const menuSections = [
    { title: 'Visão Global', items: [{ id: 'cockpit', label: 'Cockpit 360', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' }] },
    { title: 'Financeiro & Contábil', items: [
        { id: 'tesouraria', label: 'Tesouraria (CCC)', icon: 'M12 6v12m-3-6h6M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z' },
        { id: 'dre', label: 'Controladoria (DRE)', icon: 'M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z' },
        { id: 'pricing', label: 'Pricing Lab (Sensibilidade)', icon: 'M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zM4.5 6h15m-15 0a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 21h15a2.25 2.25 0 002.25-2.25V8.25A2.25 2.25 0 0019.5 6h-15z' }
    ]},
    { title: 'Supply & Produto', items: [
        { id: 'catalogo', label: 'Gestão de Catálogo (Supabase)', icon: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125z' },
        { id: 'estoque', label: 'Estoque & Recompra (ROP)', icon: 'M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9' },
        { id: 'fornecedores', label: 'Matriz Fornecedores', icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635h2.25' }
    ]},
    { title: 'Growth & Clientes', items: [
        { id: 'marketing', label: 'Marketing & Cohorts', icon: 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z' },
        { id: 'blackbook', label: 'Black Book (CRM Real)', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07' },
        { id: 'mapa', label: 'Heatmap Geográfico', icon: 'M9 6.75V15m6-6v8.25m.503-11.487l4.875 1.218c.26.065.44.298.44.566v11.141c0 .356-.347.625-.694.538l-4.708-1.177A1.5 1.5 0 0114 16.5V6.75' }
    ]}
  ];

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex font-sans antialiased selection:bg-emerald-500 selection:text-black">
      
      {/* SIDEBAR MESTRE */}
      <aside className="w-64 bg-[#0d0d10] border-r border-zinc-800/80 flex flex-col justify-between shrink-0 hidden lg:flex h-screen overflow-y-auto">
        <div className="p-6 space-y-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
              <h1 className="font-bold tracking-widest text-lg text-white uppercase font-mono">CÓRTEX OS</h1>
            </div>
            <p className="text-[9px] text-zinc-500 font-mono tracking-wider uppercase">Live Database • v6.3</p>
          </div>

          <div className="space-y-6">
            {menuSections.map((section, idx) => (
              <nav key={idx} className="space-y-1 font-mono">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest block px-3 mb-2 font-bold">{section.title}</span>
                {section.items.map((item) => (
                  <button key={item.id} onClick={() => setActiveModule(item.id as ModuleType)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-[11px] font-medium transition-all ${ activeModule === item.id ? 'bg-zinc-800 text-white font-bold border border-zinc-700/50 shadow-sm' : 'text-zinc-400 hover:bg-zinc-900/60 hover:text-zinc-200' }`}>
                    <svg className="w-4 h-4 stroke-current" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={item.icon} /></svg>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-zinc-800/80 bg-zinc-950/80 flex items-center justify-between text-xs font-mono shrink-0">
          <div><p className="font-bold text-white">Diego Oliveira</p><span className="text-[9px] text-amber-400">CEO • MASTER KEY</span></div>
          <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]"></span>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="h-16 border-b border-zinc-800/80 px-8 flex items-center justify-between bg-[#0d0d10]/50 backdrop-blur-md sticky top-0 z-20 font-mono shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-zinc-500">CÓRTEX /</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">{activeModule.replace('_', ' ')}</span>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-3 py-1.5 rounded font-bold font-mono">
            {loadingDb ? '✦ SYNCHRONIZING SUPABASE...' : '✦ SUPABASE CONNECTED'}
          </span>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto space-y-6 pb-20 font-mono">

          {/* COCKPIT */}
          {activeModule === 'cockpit' && (
            <div className="space-y-6 font-mono animate-in fade-in duration-300">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-lg shadow-sm"><span className="text-[10px] text-zinc-500 uppercase block mb-1">Caixa Atual (Líquido)</span><p className="text-xl font-bold text-emerald-400">R$ {financialData.cashIn.toLocaleString('pt-BR')}</p></div>
                <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-lg shadow-sm"><span className="text-[10px] text-zinc-500 uppercase block mb-1">Pedidos Lote Zero</span><p className="text-xl font-bold text-white">58 un.</p></div>
                <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-lg shadow-sm"><span className="text-[10px] text-zinc-500 uppercase block mb-1">Custo Aquisição (CAC)</span><p className="text-xl font-bold text-white">R$ 38,09</p></div>
                <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-lg shadow-sm"><span className="text-[10px] text-zinc-500 uppercase block mb-1">ROAS Tráfego</span><p className="text-xl font-bold text-white">8.4x</p></div>
                <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-lg shadow-sm"><span className="text-[10px] text-zinc-500 uppercase block mb-1">Valuation Estoque</span><p className="text-xl font-bold text-amber-400">R$ {inventoryValuation.retailValue.toLocaleString('pt-BR')}</p></div>
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

          {/* MÓDULO: CATÁLOGO COM PERSISTÊNCIA REAL NO SUPABASE */}
          {activeModule === 'catalogo' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* FORMULÁRIO DE CADASTRO NOVO PRODUTO */}
              <div className="bg-[#0d0d10] border border-zinc-800 p-6 rounded-lg space-y-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">Cadastrar Novo Produto no Banco de Dados</span>
                <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <input type="text" required placeholder="Nome do Produto (ex: Regata Brutalista)" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} className="bg-black border border-zinc-800 px-3 py-2 text-xs text-white outline-none focus:border-white" />
                  <select value={newProductCategory} onChange={(e) => setNewProductCategory(e.target.value)} className="bg-black border border-zinc-800 px-3 py-2 text-xs text-white outline-none">
                    <option value="Camisetas">Camisetas</option>
                    <option value="Bonés">Bonés</option>
                    <option value="Shorts">Shorts</option>
                    <option value="Acessórios">Acessórios</option>
                  </select>
                  <input type="number" required placeholder="Preço (R$)" value={newProductPrice} onChange={(e) => setNewProductPrice(Number(e.target.value))} className="bg-black border border-zinc-800 px-3 py-2 text-xs text-white outline-none" />
                  <input type="number" required placeholder="Estoque Inicial" value={newProductStock} onChange={(e) => setNewProductStock(Number(e.target.value))} className="bg-black border border-zinc-800 px-3 py-2 text-xs text-white outline-none" />
                  <button type="submit" className="bg-white text-black font-bold text-xs uppercase hover:bg-zinc-200 transition-colors">
                    [ CADASTRAR NO SUPABASE ]
                  </button>
                </form>
              </div>

              {/* TABELA DE PRODUTOS VINDOS DO SUPABASE */}
              <div className="bg-[#0d0d10] border border-zinc-800 p-8 rounded-lg space-y-4">
                <h2 className="text-sm font-bold text-white uppercase border-b border-zinc-800 pb-4">CATÁLOGO REAL (TABELA: PUBLIC.PRODUCTS)</h2>
                <table className="w-full text-left text-[11px] border border-zinc-800 rounded">
                  <thead className="bg-zinc-900 text-zinc-400 uppercase text-[9px] border-b border-zinc-800">
                    <tr><th className="p-3">SKU</th><th className="p-3">Produto</th><th className="p-3">Categoria</th><th className="p-3">Preço</th><th className="p-3">Estoque</th><th className="p-3">Prefix Serial</th><th className="p-3">Status</th></tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-zinc-300">
                    {products.map((p) => (
                      <tr key={p.id}>
                        <td className="p-3 font-bold text-white">{p.sku_code}</td>
                        <td className="p-3 font-bold text-white">{p.name}</td>
                        <td className="p-3 text-zinc-400">{p.category}</td>
                        <td className="p-3 text-emerald-400 font-bold">R$ {Number(p.price).toFixed(2)}</td>
                        <td className="p-3 text-white font-bold">{p.stock} un.</td>
                        <td className="p-3 text-amber-300 bg-zinc-950 font-bold">{p.serial_prefix}-XXXX</td>
                        <td className="p-3"><span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 text-[9px] rounded font-bold">{p.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* MÓDULO: BLACK BOOK COM CLIENTES VINDOS DO SUPABASE */}
          {activeModule === 'blackbook' && (
            <div className="bg-[#0d0d10] border border-zinc-800 p-8 rounded-lg space-y-6 animate-in fade-in duration-300">
              <h2 className="text-sm font-bold text-white uppercase border-b border-zinc-800 pb-4">BLACK BOOK REAL (TABELA: PUBLIC.CUSTOMERS)</h2>
              <div className="space-y-2">
                {customers.map((user) => (
                  <div key={user.id} className="border border-zinc-800 rounded bg-zinc-950 p-4 flex justify-between items-center">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">{user.full_name} <span className="text-xs font-normal text-zinc-500">({user.city}/{user.state})</span></p>
                      <p className="text-[10px] text-zinc-400">{user.email} • WhatsApp: {user.phone} • Insta: <strong className="text-emerald-400">{user.instagram}</strong></p>
                    </div>
                    <div className="text-right space-y-1">
                      <span className="text-[9px] font-bold border border-amber-900 bg-amber-950/30 text-amber-400 px-2 py-0.5 rounded uppercase block">{user.rfm_tag}</span>
                      <span className="text-xs font-bold text-white block">LTV: R$ {Number(user.ltv).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TESOURARIA & CCC */}
          {activeModule === 'tesouraria' && (
            <div className="bg-[#0d0d10] border border-zinc-800 p-8 rounded-lg space-y-6 font-mono animate-in fade-in duration-300">
              <div className="border-b border-zinc-800 pb-4">
                <h2 className="text-sm font-bold text-white uppercase">TESOURARIA & CICLO DE CONVERSÃO DE CAIXA (CCC)</h2>
                <p className="text-[10px] text-zinc-500 mt-1">Análise de eficiência do capital de giro e extrato operacional.</p>
              </div>
              
              <div className="bg-zinc-950 border border-zinc-800 p-6 rounded grid grid-cols-1 md:grid-cols-4 gap-4 items-center relative overflow-hidden">
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-amber-500"></div>
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase block">DIO (Dias de Estoque)</span>
                  <span className="text-lg font-bold text-white">{cccMetrics.dio} Dias</span>
                  <p className="text-[9px] text-zinc-600 mt-1">Tempo até vender</p>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase block">DSO (Recebimento)</span>
                  <span className="text-lg font-bold text-emerald-400">+ {cccMetrics.dso} Dias</span>
                  <p className="text-[9px] text-zinc-600 mt-1">Prazo Mercado Pago</p>
                </div>
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase block">DPO (Pagamento Forn.)</span>
                  <span className="text-lg font-bold text-red-400">- {cccMetrics.dpo} Dias</span>
                  <p className="text-[9px] text-zinc-600 mt-1">Prazo que a fábrica te dá</p>
                </div>
                <div className="bg-amber-950/20 p-3 border border-amber-900/50 rounded">
                  <span className="text-[10px] text-amber-500 uppercase font-bold block">Seu Dinheiro Fica Preso (CCC)</span>
                  <span className="text-2xl font-bold text-amber-400">{cccMetrics.ccc} Dias</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-emerald-950/20 border border-emerald-900/50 p-4 rounded"><span className="text-[10px] text-emerald-500 uppercase">Entradas (Liquidadas)</span><p className="text-lg font-bold text-emerald-400">R$ {financialData.cashIn.toLocaleString('pt-BR')}</p></div>
                <div className="bg-red-950/20 border border-red-900/50 p-4 rounded"><span className="text-[10px] text-red-500 uppercase">Saídas (Pagas)</span><p className="text-lg font-bold text-red-400">- R$ {financialData.cashOut.toLocaleString('pt-BR')}</p></div>
                <div className="bg-amber-950/20 border border-amber-900/50 p-4 rounded"><span className="text-[10px] text-amber-500 uppercase">A Receber (Cartão/Futuro)</span><p className="text-lg font-bold text-amber-400">R$ {financialData.pendingReceivables.toLocaleString('pt-BR')}</p></div>
              </div>
            </div>
          )}

          {/* DRE CONTROLADORIA */}
          {activeModule === 'dre' && (
            <div className="bg-[#0d0d10] border border-zinc-800 p-8 rounded-lg space-y-6 font-mono animate-in fade-in duration-300">
              <div className="flex justify-between border-b border-zinc-800 pb-4">
                <h2 className="text-sm font-bold text-white uppercase">DEMONSTRAÇÃO DO RESULTADO (DRE)</h2>
                <span className="text-[10px] bg-zinc-900 border border-zinc-700 px-2 py-1 rounded text-zinc-400">Setembro 2026</span>
              </div>
              <div className="space-y-1 max-w-2xl">
                <div className="flex justify-between p-3 bg-zinc-900/50 border border-zinc-800 rounded"><span className="font-bold text-white text-xs">1. RECEITA OPERACIONAL BRUTA</span><span className="font-bold text-white text-xs">R$ {financialData.grossRevenue.toFixed(2)}</span></div>
                <div className="flex justify-between p-3 text-zinc-400 text-[11px] pl-6"><span>(-) Impostos (Simples Nacional 6%)</span><span className="text-red-400">- R$ {financialData.taxes.toFixed(2)}</span></div>
                <div className="flex justify-between p-3 text-zinc-400 text-[11px] pl-6"><span>(-) Taxas de Adquirente (Mercado Pago)</span><span className="text-red-400">- R$ {financialData.gatewayFees.toFixed(2)}</span></div>
                <div className="flex justify-between p-3 border-t border-zinc-800 mt-2"><span className="font-bold text-emerald-400 text-xs">2. RECEITA LÍQUIDA</span><span className="font-bold text-emerald-400 text-xs">R$ {(financialData.grossRevenue - financialData.taxes - financialData.gatewayFees).toFixed(2)}</span></div>
                <div className="flex justify-between p-3 text-zinc-400 text-[11px] pl-6 mt-2"><span>(-) Custo dos Produtos Vendidos (CPV)</span><span className="text-red-400">- R$ {financialData.cogs.toFixed(2)}</span></div>
                <div className="flex justify-between p-3 border-t border-zinc-800 mt-2"><span className="font-bold text-white text-xs">3. LUCRO BRUTO</span><span className="font-bold text-white text-xs">R$ {(financialData.grossRevenue - financialData.taxes - financialData.gatewayFees - financialData.cogs).toFixed(2)}</span></div>
                <div className="flex justify-between p-3 text-zinc-400 text-[11px] pl-6 mt-2"><span>(-) Despesas de Marketing (Ads)</span><span className="text-red-400">- R$ {financialData.marketing.toFixed(2)}</span></div>
                <div className="flex justify-between p-3 text-zinc-400 text-[11px] pl-6"><span>(-) Despesas Operacionais (Software/Sistemas)</span><span className="text-red-400">- R$ {financialData.software.toFixed(2)}</span></div>
                <div className="flex justify-between p-4 bg-emerald-950/20 border border-emerald-900 mt-4 rounded"><span className="font-bold text-emerald-400 text-sm">4. LUCRO LÍQUIDO FINAL (EBITDA)</span><span className="font-bold text-emerald-400 text-sm">R$ {((financialData.grossRevenue - financialData.taxes - financialData.gatewayFees - financialData.cogs) - financialData.marketing - financialData.software).toFixed(2)}</span></div>
              </div>
            </div>
          )}

          {/* PRICING LAB & STRESS TEST */}
          {activeModule === 'pricing' && (
            <div className="bg-[#0d0d10] border border-zinc-800 p-8 rounded-lg space-y-8 font-mono animate-in fade-in duration-300">
              <div className="border-b border-zinc-800 pb-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">LABORATÓRIO DE PRECIFICAÇÃO & STRESS TEST</h2>
                <p className="text-[10px] text-zinc-500 mt-1">Análise de Sensibilidade: Simule choques de mercado e defina a margem ancorada final.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-6">
                  <div className="bg-zinc-950 p-5 rounded border border-zinc-800 space-y-4">
                    <span className="text-xs font-bold text-emerald-400 uppercase block">1. Custo Base Atual</span>
                    <div className="space-y-2">
                      <label className="text-[9px] text-zinc-400 uppercase block">Fabrico (Peça)</label>
                      <input type="number" value={cogsPiece} onChange={(e) => setCogsPiece(Number(e.target.value))} className="bg-black border border-zinc-800 px-3 py-2 text-white w-full text-xs" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[9px] text-zinc-400 uppercase block">Embalagem White Glove</label>
                      <input type="number" value={cogsPackaging} onChange={(e) => setCogsPackaging(Number(e.target.value))} className="bg-black border border-zinc-800 px-3 py-2 text-white w-full text-xs" />
                    </div>
                  </div>

                  <div className="bg-red-950/10 p-5 rounded border border-red-900/30 space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50"></div>
                    <span className="text-[10px] font-bold text-red-400 uppercase block">⚡ Shock Test (Inflação/Custo)</span>
                    <div className="space-y-2">
                      <div className="flex justify-between"><span className="text-[9px] text-zinc-400">Piora no cenário:</span><span className="text-xs text-red-400 font-bold">+{stressTestInflation}%</span></div>
                      <input type="range" min="0" max="50" step="5" value={stressTestInflation} onChange={(e) => setStressTestInflation(Number(e.target.value))} className="w-full accent-red-500" />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                  <div className="bg-zinc-950 p-6 rounded border border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-4 relative">
                    <div className="bg-zinc-900/50 p-4 rounded border border-zinc-800 space-y-1 mt-4">
                      <span className="text-[10px] text-zinc-500 uppercase block">Preço de Combate</span>
                      <span className="text-2xl font-bold text-white">R$ {pricingCalculations.combatePrice.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="bg-emerald-950/40 p-4 rounded border border-emerald-500/50 space-y-1 shadow-[0_0_15px_rgba(16,185,129,0.15)] mt-4">
                      <span className="text-[10px] text-emerald-400 font-bold uppercase block">✦ Preço Ideal Ancorado</span>
                      <span className="text-3xl font-bold text-white">R$ {pricingCalculations.suggestedPrice.toFixed(2).replace('.', ',')}</span>
                    </div>
                    <div className="bg-zinc-900/50 p-4 rounded border border-zinc-800 space-y-1 mt-4">
                      <span className="text-[10px] text-amber-400 uppercase block">Escassez/Luxo</span>
                      <span className="text-2xl font-bold text-amber-300">R$ {pricingCalculations.luxoPrice.toFixed(2).replace('.', ',')}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ESTOQUE & ROP */}
          {activeModule === 'estoque' && (
            <div className="bg-[#0d0d10] border border-zinc-800 p-8 rounded-lg space-y-6 font-mono animate-in fade-in duration-300">
              <div className="border-b border-zinc-800 pb-4">
                <h2 className="text-sm font-bold text-white uppercase">INTELIGÊNCIA DE ESTOQUE (MOTOR ROP)</h2>
                <p className="text-[10px] text-zinc-500 mt-1">Cálculo matemático preditivo do Ponto de Recompra (Reorder Point)</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-zinc-950 border border-zinc-800 p-4 rounded"><span className="text-[10px] text-zinc-500 uppercase">Estoque Físico</span><p className="text-xl font-bold text-white">{inventoryValuation.totalUnits} un.</p></div>
                <div className="bg-zinc-950 border border-zinc-800 p-4 rounded"><span className="text-[10px] text-zinc-500 uppercase">Valuation (Varejo)</span><p className="text-xl font-bold text-emerald-400">R$ {inventoryValuation.retailValue.toLocaleString('pt-BR')}</p></div>
                <div className="bg-zinc-950 border border-zinc-800 p-4 rounded"><span className="text-[10px] text-zinc-500 uppercase">Custo Imobilizado</span><p className="text-xl font-bold text-red-400">R$ {inventoryValuation.costValue.toLocaleString('pt-BR')}</p></div>
                <div className="bg-zinc-950 border border-zinc-800 p-4 rounded"><span className="text-[10px] text-amber-500 font-bold uppercase">Lead Time (Reposição)</span><p className="text-xl font-bold text-amber-400">{inventoryValuation.leadTime} Dias</p></div>
              </div>
            </div>
          )}

          {/* FORNECEDORES */}
          {activeModule === 'fornecedores' && (
            <div className="bg-[#0d0d10] border border-zinc-800 p-8 rounded-lg space-y-6 font-mono animate-in fade-in duration-300">
              <h2 className="text-sm font-bold text-white uppercase border-b border-zinc-800 pb-4">MATRIZ DE FORNECEDORES (SUPPLY CHAIN)</h2>
              <table className="w-full text-left text-xs border border-zinc-800 rounded">
                <thead className="bg-zinc-900 text-zinc-400 uppercase text-[9px] border-b border-zinc-800">
                  <tr><th className="p-3">Fornecedor / Oficina</th><th className="p-3">SLA (Entrega)</th><th className="p-3">Custo Relativo</th><th className="p-3">Score Qualidade</th><th className="p-3">Financeiro</th></tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-zinc-300">
                  {suppliers.map(s => (
                    <tr key={s.id}>
                      <td className="p-3 font-bold text-white">{s.name}</td>
                      <td className="p-3 text-zinc-400">{s.sla}</td>
                      <td className="p-3 text-amber-400">{s.costLevel}</td>
                      <td className="p-3 text-emerald-400 font-bold">{s.quality}</td>
                      <td className="p-3"><span className={`text-[9px] px-2 py-1 rounded font-bold border ${s.status === 'PAGO' ? 'bg-emerald-950 text-emerald-400 border-emerald-900' : 'bg-amber-950 text-amber-400 border-amber-900'}`}>{s.status}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* MARKETING & COHORTS */}
          {activeModule === 'marketing' && (
            <div className="bg-[#0d0d10] border border-zinc-800 p-8 rounded-lg space-y-8 font-mono animate-in fade-in duration-300">
              <div className="border-b border-zinc-800 pb-4">
                <h2 className="text-sm font-bold text-white uppercase">GROWTH ENGINE & ANÁLISE DE SAFRAS (COHORTS)</h2>
                <p className="text-[10px] text-zinc-500 mt-1">Métricas de retenção por lançamento e Radar de Conteúdo do Cliente (@uselaromme)</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-[10px] text-amber-400 uppercase font-bold tracking-widest">Safras de Retenção de Clientes (Cohorts)</h3>
                <table className="w-full text-left text-[11px] border border-zinc-800 rounded overflow-hidden">
                  <thead className="bg-zinc-900 text-zinc-400 uppercase text-[9px] border-b border-zinc-800">
                    <tr><th className="p-3">Safra / Lançamento</th><th className="p-3">Membros Adquiridos</th><th className="p-3">Retenção D+30</th><th className="p-3">Retenção D+60</th><th className="p-3">Retenção D+90</th></tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-zinc-300">
                    {cohortData.map(c => (
                      <tr key={c.cohort}>
                        <td className="p-3 font-bold text-white">{c.cohort}</td>
                        <td className="p-3">{c.buyers} compradores</td>
                        <td className="p-3 text-emerald-400 font-bold">{c.retentionD30}</td>
                        <td className="p-3 text-emerald-400">{c.retentionD60}</td>
                        <td className="p-3 text-zinc-500">{c.retentionD90}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MAPA SVG */}
          {activeModule === 'mapa' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg space-y-6 font-mono">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-4">MAPA VECTORIAL DE DENSIDADE GEOGRÁFICA</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 bg-black border border-zinc-800/80 p-6 rounded-lg relative min-h-[420px] flex justify-center items-center" onMouseMove={handleMouseMoveMap}>
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
                          onMouseEnter={() => isActive && setHoveredState(stateUF)}
                          onMouseLeave={() => setHoveredState(null)}
                        />
                      );
                    })}
                  </svg>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg text-xs font-sans space-y-4">
                  <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">Insight Regional</h3>
                  <p className="text-zinc-400 leading-relaxed">
                    O eixo <strong className="text-white">São Paulo e Curitiba</strong> concentra 56% do volume financeiro absorvido no Lote Zero.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
