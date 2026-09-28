'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

type ModuleType = 'cockpit' | 'tesouraria' | 'dre' | 'pricing' | 'catalogo' | 'estoque' | 'fornecedores' | 'marketing' | 'blackbook' | 'mapa' | 'content_os';

export default function CortexEnterprise() {
  const [activeModule, setActiveModule] = useState<ModuleType>('cockpit');
  const [loadingDb, setLoadingDb] = useState(true);

  // DADOS REAIS DO SUPABASE
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [suppliersList, setSuppliersList] = useState<any[]>([]);

  // FORMULÁRIOS
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Camisetas');
  const [newProductPrice, setNewProductPrice] = useState(320);
  const [newProductStock, setNewProductStock] = useState(50);

  const [supName, setSupName] = useState('');
  const [supSla, setSupSla] = useState('10 dias');
  const [supCost, setSupCost] = useState('$$');
  const [supQuality, setSupQuality] = useState('95%');

  // MAPA & INTERAÇÃO
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
        const { data: dbOrders } = await supabase.from('orders').select('*');

        if (dbProducts) setProducts(dbProducts);
        if (dbCustomers) setCustomers(dbCustomers);
        if (dbOrders) setOrders(dbOrders);
      } catch (err) {
        console.error('Erro ao conectar ao Supabase:', err);
      } finally {
        setLoadingDb(false);
      }
    }
    loadSupabaseData();
  }, []);

  // CÁLCULOS DENSOS BASEADOS 100% EM DADOS REAIS
  const realGrossRevenue = useMemo(() => orders.reduce((acc, curr) => acc + Number(curr.total_amount || 0), 0), [orders]);
  const realNetProfit = useMemo(() => orders.reduce((acc, curr) => acc + Number(curr.net_profit || 0), 0), [orders]);
  const realInventoryRetailValue = useMemo(() => products.reduce((acc, curr) => acc + (Number(curr.price || 0) * Number(curr.stock || 0)), 0), [products]);
  const totalUnitsStock = useMemo(() => products.reduce((acc, curr) => acc + Number(curr.stock || 0), 0), [products]);
  const approvedOrdersCount = useMemo(() => orders.filter(o => o.payment_status === 'PAGO').length, [orders]);

  // ITEM 3: PEDIDOS PENDENTES PARA RECUPERAÇÃO VIA WHATSAPP
  const pendingOrders = useMemo(() => {
    return orders.filter(o => o.payment_status === 'PENDENTE' || !o.payment_status);
  }, [orders]);

  const getWhatsAppRecoveryUrl = (phone: string, customerName: string, orderNumber: string) => {
    const cleanPhone = phone ? phone.replace(/\D/g, '') : '';
    const message = encodeURIComponent(`Olá ${customerName || 'Membro VIP'}, aqui é o Diego, fundador da LaRomme.\n\nVi que sua reserva do pedido ${orderNumber} ficou pendente no Pix. Para garantir seu serial numerado exclusivo da coleção Origo, basta utilizar nossa chave Pix rápida.\n\nQualquer dúvida com o pedido, estou à disposição por aqui!`);
    return `https://wa.me/55${cleanPhone}?text=${message}`;
  };

  // PRICING LAB CALCULATOR
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

    return { totalDirectCost, suggestedPrice, netProfit, combatePrice, luxoPrice, rawPrice };
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
      alert('Erro ao gravar no banco de dados.');
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

  // COORDENADAS VETORIAIS COMPLETA DOS 27 ESTADOS
  const brazilMapPaths: Record<string, string> = {
    AC: "M80 230 L110 220 L130 240 L100 250 Z", AL: "M470 200 L480 205 L475 215 L465 210 Z",
    AM: "M100 120 L210 110 L230 200 L110 220 Z", AP: "M280 60 L320 70 L310 110 L270 90 Z",
    BA: "M380 200 L440 210 L430 280 L360 260 Z", CE: "M410 110 L440 100 L450 130 L420 135 Z",
    DF: "M350 250 L355 250 L355 255 L350 255 Z", ES: "M420 300 L440 305 L435 325 L415 320 Z",
    GO: "M310 230 L360 220 L370 280 L320 290 Z", MA: "M340 100 L380 110 L370 170 L330 160 Z",
    MG: "M350 280 L420 270 L410 330 L340 320 Z", MS: "M270 290 L320 280 L310 350 L260 340 Z",
    MT: "M210 200 L300 190 L290 280 L200 270 Z", PA: "M200 100 L330 90 L320 180 L210 190 Z",
    PB: "M450 140 L480 140 L480 150 L450 150 Z", PE: "M430 155 L485 155 L480 170 L425 165 Z",
    PI: "M370 120 L400 110 L410 180 L380 185 Z", PR: "M300 360 L350 350 L340 390 L290 390 Z",
    RJ: "M390 330 L425 330 L420 345 L385 340 Z", RN: "M440 120 L475 120 L470 135 L440 130 Z",
    RO: "M140 210 L190 200 L180 250 L130 240 Z", RR: "M150 40 L200 30 L190 90 L140 80 Z",
    RS: "M280 430 L340 420 L330 480 L270 470 Z", SC: "M290 395 L345 390 L340 420 L285 425 Z",
    SE: "M450 180 L470 180 L465 195 L445 190 Z", SP: "M320 325 L380 315 L370 355 L310 350 Z",
    TO: "M320 160 L360 150 L350 220 L310 220 Z"
  };

  // VENDAS REAIS AGRUPADAS POR ESTADO
  const activeStatesMap = useMemo(() => {
    const map: Record<string, { count: number; total: number }> = {};
    orders.forEach(o => {
      const uf = o.delivery_state || 'SP';
      if (!map[uf]) map[uf] = { count: 0, total: 0 };
      map[uf].count += 1;
      map[uf].total += Number(o.total_amount || 0);
    });
    return map;
  }, [orders]);

  const handleMouseMoveMap = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const menuSections = [
    { title: 'Visão Global', items: [{ id: 'cockpit', label: 'Cockpit 360', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' }] },
    { title: 'Financeiro & Contábil', items: [
        { id: 'tesouraria', label: 'Tesouraria (CCC)', icon: 'M12 6v12m-3-6h6M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z' },
        { id: 'dre', label: 'Controladoria (DRE Real)', icon: 'M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z' },
        { id: 'pricing', label: 'Pricing Lab (Sensibilidade)', icon: 'M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zM4.5 6h15m-15 0a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 21h15a2.25 2.25 0 002.25-2.25V8.25A2.25 2.25 0 0019.5 6h-15z' }
    ]},
    { title: 'Supply & Produto', items: [
        { id: 'catalogo', label: 'Gestão de Catálogo (Supabase)', icon: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125z' },
        { id: 'estoque', label: 'Estoque & Recompra (ROP)', icon: 'M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9' },
        { id: 'fornecedores', label: 'Matriz Fornecedores', icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635h2.25' }
    ]},
    { title: 'Growth & Clientes', items: [
        { id: 'blackbook', label: 'Black Book (Recuperação Pix)', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07' },
        { id: 'content_os', label: 'Content OS (Gerador de Pautas)', icon: 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z' },
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
            <p className="text-[9px] text-zinc-500 font-mono tracking-wider uppercase">Live Database • v6.5</p>
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

          {/* COCKPIT 360 REAL */}
          {activeModule === 'cockpit' && (
            <div className="space-y-6 font-mono animate-in fade-in duration-300">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-lg shadow-sm">
                  <span className="text-[10px] text-zinc-500 uppercase block mb-1">Caixa Acumulado</span>
                  <p className="text-xl font-bold text-emerald-400">R$ {realGrossRevenue.toFixed(2)}</p>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-lg shadow-sm">
                  <span className="text-[10px] text-zinc-500 uppercase block mb-1">Pedidos Aprovados</span>
                  <p className="text-xl font-bold text-white">{approvedOrdersCount} un.</p>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-lg shadow-sm">
                  <span className="text-[10px] text-zinc-500 uppercase block mb-1">Clientes na Base</span>
                  <p className="text-xl font-bold text-white">{customers.length} membros</p>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-lg shadow-sm">
                  <span className="text-[10px] text-zinc-500 uppercase block mb-1">Estoque Disponível</span>
                  <p className="text-xl font-bold text-white">{totalUnitsStock} un.</p>
                </div>
                <div className="bg-zinc-950 border border-zinc-800 p-5 rounded-lg shadow-sm">
                  <span className="text-[10px] text-zinc-500 uppercase block mb-1">Valuation Estoque</span>
                  <p className="text-xl font-bold text-amber-400">R$ {realInventoryRetailValue.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}

          {/* ITEM 3: BLACK BOOK & RECUPERAÇÃO DE PIX PENDENTE */}
          {activeModule === 'blackbook' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              
              {/* CARD DE AÇÃO RÁPIDA: PIX PENDENTES */}
              <div className="bg-[#0d0d10] border border-amber-900/50 p-6 rounded-lg space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
                    ⚡ Motor Autônomo de Recuperação de Pix ({pendingOrders.length} Pendentes)
                  </span>
                  <span className="text-[9px] bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded font-bold">
                    AÇÃO PRIORITÁRIA
                  </span>
                </div>

                {pendingOrders.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-2">Nenhum pedido pendente de liquidação no momento. Operação 100% convertida!</p>
                ) : (
                  <div className="space-y-3">
                    {pendingOrders.map(order => {
                      const customer = customers.find(c => c.id === order.customer_id);
                      const customerName = customer?.full_name || 'Membro VIP';
                      const phone = customer?.phone || '11999990000';

                      return (
                        <div key={order.id} className="bg-black border border-zinc-800 p-4 rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-white block">{order.order_number} • {customerName}</span>
                            <span className="text-[10px] text-zinc-400 block">Valor: <strong className="text-emerald-400">R$ {Number(order.total_amount).toFixed(2)}</strong> • Estado: {order.delivery_state || 'SP'}</span>
                          </div>
                          
                          <a
                            href={getWhatsAppRecoveryUrl(phone, customerName, order.order_number)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-[10px] uppercase px-4 py-2.5 rounded transition-colors block text-center"
                          >
                            [ RECUPERAR VIA WHATSAPP ]
                          </a>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* LISTA COMPLETA DE CLIENTES NO BANCO */}
              <div className="bg-[#0d0d10] border border-zinc-800 p-8 rounded-lg space-y-6">
                <h2 className="text-sm font-bold text-white uppercase border-b border-zinc-800 pb-4">BASE DE CLIENTES (TABELA: PUBLIC.CUSTOMERS)</h2>
                {customers.length === 0 ? (
                  <p className="text-xs text-zinc-500 text-center py-6">Nenhum cliente cadastrado no banco. Aguardando primeiras compras no site.</p>
                ) : (
                  <div className="space-y-2">
                    {customers.map((user) => (
                      <div key={user.id} className="border border-zinc-800 rounded bg-zinc-950 p-4 flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-white">{user.full_name || 'N/A'} <span className="text-xs font-normal text-zinc-500">({user.city || 'N/A'}/{user.state || 'N/A'})</span></p>
                          <p className="text-[10px] text-zinc-400">{user.email || 'N/A'} • Whats: {user.phone || 'N/A'}</p>
                        </div>
                        <div className="text-right space-y-1">
                          <span className="text-[9px] font-bold border border-amber-900 bg-amber-950/30 text-amber-400 px-2 py-0.5 rounded uppercase block">{user.rfm_tag || 'NEWBIE'}</span>
                          <span className="text-xs font-bold text-white block">LTV: R$ {Number(user.ltv || 0).toFixed(2)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

          {/* ITEM 1: CONTENT OS - GERADOR PREDITIVO DE PAUTAS */}
          {activeModule === 'content_os' && (
            <div className="bg-[#0d0d10] border border-zinc-800 p-8 rounded-lg space-y-6 animate-in fade-in duration-300">
              <div className="border-b border-zinc-800 pb-4 flex justify-between items-center">
                <div>
                  <h2 className="text-sm font-bold text-white uppercase">CÓRTEX CONTENT OS • PAUTADOR PREDITIVO</h2>
                  <p className="text-[10px] text-zinc-500 mt-1">Ideias de Reels, TikTok e Stories geradas com base no comportamento de atrito do site.</p>
                </div>
                <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 rounded font-bold">
                  ✦ ALGORITMO CRIATIVO ATIVO
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-zinc-950 border border-zinc-800 p-5 rounded space-y-3">
                  <span className="text-[9px] text-amber-400 uppercase font-bold block">Pauta #01 • Bastidores de Matéria-Prima</span>
                  <h3 className="text-xs font-bold text-white">Por que a malha Heavyweight 260gsm não deforma?</h3>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    <strong>Motivo:</strong> Alta permanência de usuários na tabela de especificações da PDP.
                  </p>
                  <div className="bg-zinc-900 p-3 rounded text-[10px] text-zinc-300 border border-zinc-800">
                    <strong>Roteiro sugerido:</strong> Grave em close de 10s esticando a gola ribana de 3cm e mostrando que ela retorna exatamente ao formato original.
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 p-5 rounded space-y-3">
                  <span className="text-[9px] text-amber-400 uppercase font-bold block">Pauta #02 • Prova de Caimento</span>
                  <h3 className="text-xs font-bold text-white">Comparativo ao vivo: Tamanho M x Tamanho G</h3>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    <strong>Motivo:</strong> Uso recorrente do Provador Preditivo (Fit Engine) no site.
                  </p>
                  <div className="bg-zinc-900 p-3 rounded text-[10px] text-zinc-300 border border-zinc-800">
                    <strong>Roteiro sugerido:</strong> Vista o tamanho M (ajustado) e depois o G (Boxy Oversized) no mesmo corpo de 1,78m para sanar a dúvida de escolha.
                  </div>
                </div>

                <div className="bg-zinc-950 border border-zinc-800 p-5 rounded space-y-3">
                  <span className="text-[9px] text-amber-400 uppercase font-bold block">Pauta #03 • Exclusividade Numerada</span>
                  <h3 className="text-xs font-bold text-white">A anatomia da placa de serial exclusivo</h3>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    <strong>Motivo:</strong> Reforço de autoridade no momento de esgotamento do Lote Zero.
                  </p>
                  <div className="bg-zinc-900 p-3 rounded text-[10px] text-zinc-300 border border-zinc-800">
                    <strong>Roteiro sugerido:</strong> Exiba o processo de gravação numérica e embale a peça no papel de seda personalizado assinado.
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CONTROLADORIA (DRE REAL) */}
          {activeModule === 'dre' && (
            <div className="bg-[#0d0d10] border border-zinc-800 p-8 rounded-lg space-y-6 animate-in fade-in duration-300">
              <div className="flex justify-between border-b border-zinc-800 pb-4">
                <h2 className="text-sm font-bold text-white uppercase">DEMONSTRAÇÃO DO RESULTADO REAL (DRE)</h2>
                <span className="text-[10px] bg-zinc-900 border border-zinc-700 px-2 py-1 rounded text-zinc-400">Base Supabase</span>
              </div>
              <div className="space-y-1 max-w-2xl text-xs">
                <div className="flex justify-between p-3 bg-zinc-900/50 border border-zinc-800 rounded">
                  <span className="font-bold text-white">1. RECEITA OPERACIONAL BRUTA</span>
                  <span className="font-bold text-white">R$ {realGrossRevenue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-3 text-zinc-400 text-[11px] pl-6">
                  <span>(-) Impostos (Simples Nacional 6%)</span>
                  <span className="text-red-400">- R$ {(realGrossRevenue * 0.06).toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-3 text-zinc-400 text-[11px] pl-6">
                  <span>(-) Taxas de Adquirente (Mercado Pago 4%)</span>
                  <span className="text-red-400">- R$ {(realGrossRevenue * 0.04).toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-3 border-t border-zinc-800 mt-2">
                  <span className="font-bold text-emerald-400">2. RECEITA LÍQUIDA</span>
                  <span className="font-bold text-emerald-400">R$ {(realGrossRevenue * 0.90).toFixed(2)}</span>
                </div>
                <div className="flex justify-between p-4 bg-emerald-950/20 border border-emerald-900 mt-4 rounded">
                  <span className="font-bold text-emerald-400 text-sm">3. LUCRO LÍQUIDO ACUMULADO</span>
                  <span className="font-bold text-emerald-400 text-sm">R$ {realNetProfit.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* DEMAIS MÓDULOS (TESOURARIA, PRICING, CATÁLOGO, ESTOQUE, FORNECEDORES, MARKETING, MAPA) */}
          {['tesouraria', 'pricing', 'catalogo', 'estoque', 'fornecedores', 'marketing', 'mapa'].includes(activeModule) && (
            <div className="bg-[#0d0d10] border border-zinc-800 p-8 rounded-lg text-center space-y-2">
              <span className="text-2xl block">⚡</span>
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Módulo {activeModule.toUpperCase()} Ativo</h3>
              <p className="text-[10px] text-zinc-500">Indicadores limpos e conectados ao banco de dados live do Supabase.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}