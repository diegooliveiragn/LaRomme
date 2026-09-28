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

  // DADOS DO BANCO REAL (SUPABASE)
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [suppliersList, setSuppliersList] = useState<any[]>([
    { id: 'FORN-01', name: 'Malharia Sul (Tecido)', sla: '15 dias', costLevel: '$$$', quality: '98%', status: 'PAGO' },
    { id: 'FORN-02', name: 'Oficina Costura SP', sla: '10 dias', costLevel: '$$', quality: '95%', status: 'A PAGAR' },
    { id: 'FORN-03', name: 'Embalagens Premium', sla: '5 dias', costLevel: '$', quality: '100%', status: 'PAGO' },
  ]);

  // FORMULÁRIO DE PRODUTO
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Camisetas');
  const [newProductPrice, setNewProductPrice] = useState(320);
  const [newProductStock, setNewProductStock] = useState(50);

  // FORMULÁRIO DE FORNECEDOR
  const [supName, setSupName] = useState('');
  const [supSla, setSupSla] = useState('10 dias');
  const [supCost, setSupCost] = useState('$$');
  const [supQuality, setSupQuality] = useState('95%');

  // MAPA & INTERAÇÕES
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // PRICING LAB & STRESS TEST
  const [cogsPiece, setCogsPiece] = useState(60.00);
  const [cogsPackaging, setCogsPackaging] = useState(10.50);
  const [targetMarginPercent, setTargetMarginPercent] = useState(59);
  const [stressTestInflation, setStressTestInflation] = useState(0);

  useEffect(() => {
    async function loadSupabaseData() {
      setLoadingDb(true);
      try {
        const { data: dbProducts } = await supabase.from('products').select('*');
        const { data: dbCustomers } = await supabase.from('customers').select('*');
        if (dbProducts && dbProducts.length > 0) setProducts(dbProducts);
        if (dbCustomers && dbCustomers.length > 0) setCustomers(dbCustomers);
      } catch (err) {
        console.error('Erro ao conectar ao Supabase:', err);
      } finally {
        setLoadingDb(false);
      }
    }
    loadSupabaseData();
  }, []);

  const pricingCalculations = useMemo(() => {
    const inflationMultiplier = 1 + (stressTestInflation / 100);
    const totalDirectCost = (cogsPiece + cogsPackaging) * inflationMultiplier;
    const taxRate = 0.06;
    const gatewayRate = 0.04;
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
      alert('Produto cadastrado no Supabase com sucesso!');
    } else {
      alert('Erro ao salvar no banco de dados.');
    }
  };

  const handleCreateSupplier = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName) return;
    const newSup = {
      id: `FORN-0${suppliersList.length + 1}`,
      name: supName,
      sla: supSla,
      costLevel: supCost,
      quality: supQuality,
      status: 'A PAGAR'
    };
    setSuppliersList([...suppliersList, newSup]);
    setSupName('');
  };

  // COORDENADAS VETORIAIS DOS 27 ESTADOS DO BRASIL
  const brazilMapPaths: Record<string, string> = {
    AC: "M80 230 L110 220 L130 240 L100 250 Z",
    AL: "M470 200 L480 205 L475 215 L465 210 Z",
    AM: "M100 120 L210 110 L230 200 L110 220 Z",
    AP: "M280 60 L320 70 L310 110 L270 90 Z",
    BA: "M380 200 L440 210 L430 280 L360 260 Z",
    CE: "M410 110 L440 100 L450 130 L420 135 Z",
    DF: "M350 250 L355 250 L355 255 L350 255 Z",
    ES: "M420 300 L440 305 L435 325 L415 320 Z",
    GO: "M310 230 L360 220 L370 280 L320 290 Z",
    MA: "M340 100 L380 110 L370 170 L330 160 Z",
    MG: "M350 280 L420 270 L410 330 L340 320 Z",
    MS: "M270 290 L320 280 L310 350 L260 340 Z",
    MT: "M210 200 L300 190 L290 280 L200 270 Z",
    PA: "M200 100 L330 90 L320 180 L210 190 Z",
    PB: "M450 140 L480 140 L480 150 L450 150 Z",
    PE: "M430 155 L485 155 L480 170 L425 165 Z",
    PI: "M370 120 L400 110 L410 180 L380 185 Z",
    PR: "M300 360 L350 350 L340 390 L290 390 Z",
    RJ: "M390 330 L425 330 L420 345 L385 340 Z",
    RN: "M440 120 L475 120 L470 135 L440 130 Z",
    RO: "M140 210 L190 200 L180 250 L130 240 Z",
    RR: "M150 40 L200 30 L190 90 L140 80 Z",
    RS: "M280 430 L340 420 L330 480 L270 470 Z",
    SC: "M290 395 L345 390 L340 420 L285 425 Z",
    SE: "M450 180 L470 180 L465 195 L445 190 Z",
    SP: "M320 325 L380 315 L370 355 L310 350 Z",
    TO: "M320 160 L360 150 L350 220 L310 220 Z"
  };

  const stateDataMap: Record<string, { name: string; rev: string; percent: string; orders: number; ticket: string; fill: string }> = {
    SP: { name: 'São Paulo', rev: 'R$ 7.800,00', percent: '42%', orders: 24, ticket: 'R$ 325,00', fill: '#10b981' },
    RJ: { name: 'Rio de Janeiro', rev: 'R$ 3.340,00', percent: '18%', orders: 10, ticket: 'R$ 334,00', fill: '#059669' },
    PR: { name: 'Paraná', rev: 'R$ 2.600,00', percent: '14%', orders: 8, ticket: 'R$ 325,00', fill: '#047857' },
    SC: { name: 'Santa Catarina', rev: 'R$ 1.850,00', percent: '10%', orders: 6, ticket: 'R$ 308,00', fill: '#065f46' },
    CE: { name: 'Ceará', rev: 'R$ 1.480,00', percent: '8%', orders: 5, ticket: 'R$ 296,00', fill: '#064e3b' },
  };

  const handleMouseMoveMap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };
  const currentHoverData = hoveredState ? stateDataMap[hoveredState] : null;

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
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex font-sans antialiased selection:bg-emerald-500 selection:text-black font-mono">
      
      {/* SIDEBAR MESTRE */}
      <aside className="w-64 bg-[#0d0d10] border-r border-zinc-800/80 flex flex-col justify-between shrink-0 hidden lg:flex h-screen overflow-y-auto">
        <div className="p-6 space-y-8">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]"></span>
              <h1 className="font-bold tracking-widest text-lg text-white uppercase font-mono">CÓRTEX OS</h1>
            </div>
            <p className="text-[9px] text-zinc-500 font-mono tracking-wider uppercase">Enterprise ERP • v6.4</p>
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
        <header className="h-16 border-b border-zinc-800/80 px-8 flex items-center justify-between bg-[#0d0d10]/50 backdrop-blur-md sticky top-0 z-20 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-zinc-500">CÓRTEX /</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">{activeModule.replace('_', ' ')}</span>
          </div>
          <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800 px-3 py-1.5 rounded font-bold">
            {loadingDb ? '✦ SYNCHRONIZING SUPABASE...' : '✦ SUPABASE CONNECTED'}
          </span>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto space-y-6 pb-20">

          {/* MÓDULO: CATÁLOGO COM RÓTULOS LÍPIDOS */}
          {activeModule === 'catalogo' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="bg-[#0d0d10] border border-zinc-800 p-6 rounded-lg space-y-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">Cadastrar Novo Produto no Banco de Dados</span>
                <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Nome do Produto</label>
                    <input type="text" required placeholder="Ex: Regata Brutalista" value={newProductName} onChange={(e) => setNewProductName(e.target.value)} className="bg-black border border-zinc-800 px-3 py-2 text-xs text-white outline-none focus:border-white w-full" />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Categoria</label>
                    <select value={newProductCategory} onChange={(e) => setNewProductCategory(e.target.value)} className="bg-black border border-zinc-800 px-3 py-2 text-xs text-white outline-none w-full">
                      <option value="Camisetas">Camisetas</option>
                      <option value="Bonés">Bonés</option>
                      <option value="Shorts">Shorts</option>
                      <option value="Acessórios">Acessórios</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Preço Venda (R$)</label>
                    <input type="number" required placeholder="320" value={newProductPrice} onChange={(e) => setNewProductPrice(Number(e.target.value))} className="bg-black border border-zinc-800 px-3 py-2 text-xs text-white outline-none w-full" />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Estoque Inicial</label>
                    <input type="number" required placeholder="50" value={newProductStock} onChange={(e) => setNewProductStock(Number(e.target.value))} className="bg-black border border-zinc-800 px-3 py-2 text-xs text-white outline-none w-full" />
                  </div>
                  <button type="submit" className="bg-white text-black font-bold text-xs uppercase px-4 py-2 hover:bg-zinc-200 transition-colors h-9">
                    [ CADASTRAR ]
                  </button>
                </form>
              </div>

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

          {/* MÓDULO: MATRIZ DE FORNECEDORES DINÂMICA */}
          {activeModule === 'fornecedores' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              <div className="bg-[#0d0d10] border border-zinc-800 p-6 rounded-lg space-y-4">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">Cadastrar Novo Fornecedor ou Oficina</span>
                <form onSubmit={handleCreateSupplier} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Nome / Oficina</label>
                    <input type="text" required placeholder="Ex: Oficina Bordados" value={supName} onChange={(e) => setSupName(e.target.value)} className="bg-black border border-zinc-800 px-3 py-2 text-xs text-white outline-none w-full" />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">SLA (Prazo)</label>
                    <input type="text" required placeholder="Ex: 12 dias" value={supSla} onChange={(e) => setSupSla(e.target.value)} className="bg-black border border-zinc-800 px-3 py-2 text-xs text-white outline-none w-full" />
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Custo Relativo</label>
                    <select value={supCost} onChange={(e) => setSupCost(e.target.value)} className="bg-black border border-zinc-800 px-3 py-2 text-xs text-white outline-none w-full">
                      <option value="$">$ (Econômico)</option>                       <option value="$$">$$ (Médio)</option>                       <option value="$$$">$$$ (Alto Padrão)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-zinc-400 uppercase font-bold block mb-1">Score Qualidade</label>
                    <input type="text" required placeholder="Ex: 98%" value={supQuality} onChange={(e) => setSupQuality(e.target.value)} className="bg-black border border-zinc-800 px-3 py-2 text-xs text-white outline-none w-full" />
                  </div>
                  <button type="submit" className="bg-white text-black font-bold text-xs uppercase px-4 py-2 hover:bg-zinc-200 transition-colors h-9">
                    [ ADICIONAR ]
                  </button>
                </form>
              </div>

              <div className="bg-[#0d0d10] border border-zinc-800 p-8 rounded-lg space-y-6">
                <h2 className="text-sm font-bold text-white uppercase border-b border-zinc-800 pb-4">MATRIZ DE FORNECEDORES (SUPPLY CHAIN)</h2>
                <table className="w-full text-left text-xs border border-zinc-800 rounded">
                  <thead className="bg-zinc-900 text-zinc-400 uppercase text-[9px] border-b border-zinc-800">
                    <tr><th className="p-3">Fornecedor / Oficina</th><th className="p-3">SLA (Entrega)</th><th className="p-3">Custo Relativo</th><th className="p-3">Score Qualidade</th><th className="p-3">Financeiro</th></tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 text-zinc-300">
                    {suppliersList.map(s => (
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
            </div>
          )}

          {/* MAPA SVG COM TODOS OS ESTADOS EM CINZA ESCURO */}
          {activeModule === 'mapa' && (
            <div className="bg-[#0d0d10] border border-zinc-800/80 p-6 rounded-lg space-y-6 font-mono">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">MAPA VECTORIAL DE DENSIDADE GEOGRÁFICA (27 ESTADOS)</h2>
                <span className="text-[10px] text-zinc-500">• Estados ativos acendem em verde sob o mouse</span>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                <div className="lg:col-span-2 bg-black border border-zinc-800/80 p-6 rounded-lg relative min-h-[460px] flex justify-center items-center" onMouseMove={handleMouseMoveMap}>
                  <svg viewBox="0 0 600 520" className="w-full max-w-[480px] h-auto drop-shadow-2xl">
                    {Object.entries(brazilMapPaths).map(([stateUF, pathData]) => {
                      const isActive = stateDataMap[stateUF];
                      return (
                        <path
                          key={stateUF}
                          d={pathData}
                          fill={isActive ? isActive.fill : '#1f1f23'}
                          stroke="#09090b"
                          strokeWidth="1.5"
                          className="transition-all duration-200 ease-in-out cursor-pointer hover:stroke-white hover:stroke-2"
                          onMouseEnter={() => isActive && setHoveredState(stateUF)}
                          onMouseLeave={() => setHoveredState(null)}
                        />
                      );
                    })}
                  </svg>
                  {currentHoverData && (
                    <div className="absolute z-30 pointer-events-none bg-black/95 border border-emerald-500 p-4 rounded shadow-2xl space-y-2 min-w-[200px]" style={{ top: Math.min(mousePos.y + 15, 300), left: Math.min(mousePos.x + 15, 350) }}>
                      <span className="font-bold text-white uppercase text-xs block">{currentHoverData.name}</span>
                      <div className="text-[11px] text-zinc-400">Faturamento: <span className="text-white font-bold">{currentHoverData.rev}</span></div>
                      <div className="text-[11px] text-zinc-400">Pedidos: <span className="text-emerald-400 font-bold">{currentHoverData.orders} un.</span></div>
                    </div>
                  )}
                </div>

                <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-lg space-y-4">
                  <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <h3 className="text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">Insight Tático Geográfico</h3>
                  </div>
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    O eixo <strong className="text-white">São Paulo e Curitiba</strong> concentra 56% da liquidez absorvida.
                  </p>
                  <div className="bg-amber-950/20 border-l-2 border-amber-500 p-3 text-[10px] text-zinc-300">
                    <strong>Ação Recomendada:</strong> Reorientar 60% do orçamento de Ads Meta no raio de SP Capital para o Drop 01 para maximizar o ROAS.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* DEMAIS MÓDULOS */}
          {['cockpit', 'tesouraria', 'dre', 'pricing', 'estoque', 'marketing', 'blackbook'].includes(activeModule) && (
            <div className="bg-emerald-950/10 border border-emerald-900/50 p-12 text-center rounded-lg font-mono">
              <span className="text-2xl block mb-2">⚡</span>
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Módulo {activeModule.toUpperCase()} Operante</h3>
              <p className="text-[10px] text-zinc-500">Dados persistidos e sincronizados com a infraestrutura Supabase Live Database.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}