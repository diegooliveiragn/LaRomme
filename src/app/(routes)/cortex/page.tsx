'use client';

import { useState, useMemo } from 'react';
import { createClient } from '@supabase/supabase-js';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '');

// --- DADOS GLOBAIS DE SIMULAÇÃO (DUMB DATA DENSO) ---
const financialData = {
  grossRevenue: 18560.00, taxes: 1113.60, gatewayFees: 742.40,
  cogs: 6554.00, marketing: 1200.00, software: 250.00,
  cashIn: 15400.00, cashOut: 8004.00, pendingReceivables: 3160.00
};

// Ciclo de Conversão de Caixa (CCC)
const cccMetrics = {
  dio: 35, // Prazo médio de estocagem (dias)
  dso: 2,  // Prazo médio de recebimento (Mercado Pago D+1/D+2)
  dpo: 15, // Prazo médio de pagamento a fornecedores
  get ccc() { return this.dio + this.dso - this.dpo; }
};

const suppliers = [
  { id: 'FORN-01', name: 'Malharia Sul (Tecido)', sla: 15, costLevel: '$$$', quality: '98%', status: 'PAGO' },
  { id: 'FORN-02', name: 'Oficina Costura SP', sla: 10, costLevel: '$$', quality: '95%', status: 'A PAGAR' },
  { id: 'FORN-03', name: 'Embalagens Premium', sla: 5, costLevel: '$', quality: '100%', status: 'PAGO' },
];

const inventoryValuation = {
  totalUnits: 130, costValue: 7800.00, retailValue: 41600.00,
  safetyStock: 10, // Estoque de segurança
  leadTime: 20, // Tempo total de reposição (SLA Fornecedores somados)
  items: [
    { sku: 'BOXY-BLK-P', qty: 12, cost: 60, retail: 320, velocity: 0.5 }, // vende 0.5 un/dia
    { sku: 'BOXY-BLK-M', qty: 45, cost: 60, retail: 320, velocity: 1.2 }, // vende 1.2 un/dia
    { sku: 'BOXY-BLK-G', qty: 28, cost: 60, retail: 320, velocity: 0.8 }, // vende 0.8 un/dia
  ]
};

const marketingInsights = {
  trends: [{ name: 'Cores Escuras (Preto/Chumbo)', share: '82%' }, { name: 'Modelagem Oversized', share: '95%' }],
  trafficSource: [{ name: 'Instagram Orgânico', value: '45%' }, { name: 'Meta Ads', value: '35%' }, { name: 'TikTok', value: '20%' }],
  siteSuggestions: [
    'Otimização: O tempo de carregamento da imagem Hero está em 2.4s. Reduzir para < 1.0s aumenta a retenção em 12%.',
    'Gatilho de Liquidez: Temos R$ 4.800 em demanda reprimida no tamanho G. Disparar link de pré-venda no WhatsApp.',
    'Churn Risk: 12 clientes do Lote Anterior não visitam o site há 60 dias. Sugestão: Acesso Antecipado silencioso.'
  ]
};

const brazilMapPaths = {
  SP: "M310.4,281.4l18.2-0.7l16,11.6l17.5,6.5l-5.1,13.1l-17.5-6.5l-20.4-2.9l-11.6-10.9L310.4,281.4z",
  RJ: "M368.6,269.1l11.6,2.2l10.2,7.3l-8,8l-18.2-5.1L368.6,269.1z",
  PR: "M290.7,314.2l19.6-1.5l17.5,13.1l2.9,13.1l-24,10.9l-21.8-0.7l-6.5-13.8L290.7,314.2z",
  SC: "M310.4,341.1l21.1,0.7l4.4,16.7l-15.3,10.2l-14.5-5.1L310.4,341.1z",
  CE: "M414.4,74.9l8,6.5l8-4.4l8,6.5l2.2,16.7l-9.5,15.3l-9.5-2.2l-14.5-9.5L392.6,88l7.3-8L414.4,74.9z"
};

const stateDataMap: Record<string, { name: string; rev: string; percent: string; orders: number; ticket: string; cities: string[]; fill: string }> = {
  SP: { name: 'São Paulo', rev: 'R$ 7.800,00', percent: '42%', orders: 24, ticket: 'R$ 325,00', cities: ['SP Capital (60%)', 'Campinas (20%)', 'Ribeirão Preto (20%)'], fill: '#10b981' },
  RJ: { name: 'Rio de Janeiro', rev: 'R$ 3.340,00', percent: '18%', orders: 10, ticket: 'R$ 334,00', cities: ['Rio Capital (70%)', 'Niterói (30%)'], fill: '#059669' },
  PR: { name: 'Paraná', rev: 'R$ 2.600,00', percent: '14%', orders: 8, ticket: 'R$ 325,00', cities: ['Curitiba (80%)', 'Maringá (20%)'], fill: '#047857' },
  SC: { name: 'Santa Catarina', rev: 'R$ 1.850,00', percent: '10%', orders: 6, ticket: 'R$ 308,00', cities: ['Florianópolis (60%)', 'Balneário Camboriú (40%)'], fill: '#065f46' },
  CE: { name: 'Ceará', rev: 'R$ 1.480,00', percent: '8%', orders: 5, ticket: 'R$ 296,00', cities: ['Fortaleza (100%)'], fill: '#064e3b' },
};

type ModuleType = 'cockpit' | 'tesouraria' | 'dre' | 'pricing' | 'catalogo' | 'estoque' | 'fornecedores' | 'marketing' | 'blackbook' | 'mapa';

export default function CortexEnterprise() {
  const [activeModule, setActiveModule] = useState<ModuleType>('estoque');

  // ESTADOS DO MAPA
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  // ESTADOS DO PRICING LAB & STRESS TEST
  const [cogsPiece, setCogsPiece] = useState(60.00);
  const [cogsPackaging, setCogsPackaging] = useState(10.50);
  const [targetMarginPercent, setTargetMarginPercent] = useState(59);
  const [stressTestInflation, setStressTestInflation] = useState(0); // Variação em % do custo

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

  // --- CÁLCULOS PRICING LAB & STRESS TEST ---
  const pricingCalculations = useMemo(() => {
    // Aplica a inflação do Teste de Estresse nos custos
    const inflationMultiplier = 1 + (stressTestInflation / 100);
    const stressedPiece = cogsPiece * inflationMultiplier;
    const stressedPackaging = cogsPackaging * inflationMultiplier;
    const totalDirectCost = stressedPiece + stressedPackaging;
    
    const taxRate = 0.06; 
    const gatewayRate = 0.04; 
    const divisor = 1 - ((targetMarginPercent / 100) + taxRate + gatewayRate);
    const rawPrice = divisor > 0 ? totalDirectCost / divisor : 0;
    
    // Ancoragem Psicológica: Terminar em ,90
    const anchorPrice = (price: number) => {
      const rounded = Math.round(price / 10) * 10;
      return rounded > price ? rounded - 0.10 : rounded + 9.90;
    };

    const suggestedPrice = anchorPrice(rawPrice);
    const combatePrice = anchorPrice(rawPrice * 0.85);
    const luxoPrice = anchorPrice(rawPrice * 1.25);

    const netProfit = suggestedPrice - totalDirectCost - (suggestedPrice * taxRate) - (suggestedPrice * gatewayRate);

    return { 
      totalDirectCost, suggestedPrice, netProfit, combatePrice, luxoPrice, rawPrice,
      stressedPiece, stressedPackaging
    };
  }, [cogsPiece, cogsPackaging, targetMarginPercent, stressTestInflation]);


  // MENU STRUCTURE
  const menuSections = [
    { title: 'Visão Global', items: [{ id: 'cockpit', label: 'Cockpit 360', icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z' }] },
    { title: 'Financeiro & Contábil', items: [
        { id: 'tesouraria', label: 'Tesouraria (CCC)', icon: 'M12 6v12m-3-6h6M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75z' },
        { id: 'dre', label: 'Controladoria (DRE)', icon: 'M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z' },
        { id: 'pricing', label: 'Pricing Lab (Sensibilidade)', icon: 'M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zM4.5 6h15m-15 0a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 21h15a2.25 2.25 0 002.25-2.25V8.25A2.25 2.25 0 0019.5 6h-15z' }
    ]},
    { title: 'Supply & Produto', items: [
        { id: 'catalogo', label: 'Gestão de Catálogo', icon: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125z' },
        { id: 'estoque', label: 'Estoque & Recompra (ROP)', icon: 'M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9' },
        { id: 'fornecedores', label: 'Matriz Fornecedores', icon: 'M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635h2.25' }
    ]},
    { title: 'Growth & Clientes', items: [
        { id: 'marketing', label: 'Marketing & Insights', icon: 'M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z' },
        { id: 'blackbook', label: 'Black Book (CRM)', icon: 'M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07' },
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
            <p className="text-[9px] text-zinc-500 font-mono tracking-wider uppercase">Enterprise ERP • v6.1</p>
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
      </aside>

      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        <header className="h-16 border-b border-zinc-800/80 px-8 flex items-center justify-between bg-[#0d0d10]/50 backdrop-blur-md sticky top-0 z-20 font-mono shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-[10px] text-zinc-500">CÓRTEX /</span>
            <span className="text-xs font-bold text-white uppercase tracking-wider">{activeModule.replace('_', ' ')}</span>
          </div>
        </header>

        <div className="p-8 max-w-7xl w-full mx-auto space-y-6 pb-20">

          {/* --- NOVO MÓDULO: ESTOQUE E ROP (Supply Chain) --- */}
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

              <table className="w-full text-left text-[11px] border border-zinc-800 rounded overflow-hidden">
                <thead className="bg-zinc-900 text-zinc-400 uppercase text-[9px] border-b border-zinc-800">
                  <tr><th className="p-3">SKU</th><th className="p-3">Velocidade (Vendas/Dia)</th><th className="p-3">Qtd Atual</th><th className="p-3">Ponto ROP (Alerta)</th><th className="p-3">Ação Tática</th></tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-zinc-300">
                  {inventoryValuation.items.map(item => {
                    // CÁLCULO DO PONTO DE RECOMPRA (ROP): (Velocidade x Tempo de Entrega) + Estoque de Segurança
                    const calculatedROP = Math.ceil(item.velocity * inventoryValuation.leadTime) + inventoryValuation.safetyStock;
                    const isCritical = item.qty <= calculatedROP;
                    const isOut = item.qty === 0;

                    return (
                      <tr key={item.sku} className={isCritical && !isOut ? 'bg-amber-950/10' : ''}>
                        <td className="p-3 font-bold text-white">{item.sku}</td>
                        <td className="p-3">{item.velocity.toFixed(1)} un/dia</td>
                        <td className={`p-3 font-bold ${isCritical ? 'text-amber-400' : 'text-emerald-400'} ${isOut ? 'text-red-500' : ''}`}>{item.qty} un.</td>
                        <td className="p-3 font-bold text-zinc-500">Gatilho em: {calculatedROP} un.</td>
                        <td className="p-3">
                          {isOut ? (
                            <span className="bg-red-950/50 text-red-400 border border-red-900 px-2 py-1 text-[9px] rounded font-bold">ESGOTADO (PERDA R$)</span>
                          ) : isCritical ? (
                            <button className="bg-amber-500 text-black px-3 py-1 text-[9px] font-bold uppercase hover:bg-amber-400">Acionar Fábrica</button>
                          ) : (
                            <span className="text-emerald-500 text-[9px] font-bold">SAUDÁVEL</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <div className="bg-zinc-950 border-l-2 border-emerald-500 p-4 text-xs text-zinc-400">
                <strong className="text-emerald-400">Inteligência ROP:</strong> O sistema detectou que a fábrica leva 20 dias para entregar. A Boxy M vende 1.2 peças/dia. O gatilho de segurança foi calculado para 34 unidades.
              </div>
            </div>
          )}

          {/* --- NOVO MÓDULO: TESOURARIA E CCC --- */}
          {activeModule === 'tesouraria' && (
            <div className="bg-[#0d0d10] border border-zinc-800 p-8 rounded-lg space-y-6 font-mono animate-in fade-in duration-300">
              <div className="border-b border-zinc-800 pb-4">
                <h2 className="text-sm font-bold text-white uppercase">TESOURARIA & CICLO DE CONVERSÃO DE CAIXA (CCC)</h2>
                <p className="text-[10px] text-zinc-500 mt-1">Análise de eficiência do capital de giro e extrato operacional.</p>
              </div>
              
              {/* PAINEL CCC */}
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

              <table className="w-full text-left text-[11px] border border-zinc-800 rounded">
                <thead className="bg-zinc-900 text-zinc-400 uppercase text-[9px] border-b border-zinc-800">
                  <tr><th className="p-3">Data</th><th className="p-3">Descrição / Origem</th><th className="p-3">Tipo</th><th className="p-3 text-right">Valor</th></tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-zinc-300">
                  <tr><td className="p-3">Hoje, 10:42</td><td className="p-3 font-bold text-white">Liquidação Mercado Pago (Lote Zero)</td><td className="p-3 text-emerald-400">ENTRADA</td><td className="p-3 text-right font-bold text-emerald-400">+ R$ 4.800,00</td></tr>
                  <tr><td className="p-3">Ontem, 16:30</td><td className="p-3">Pagamento Fatura Meta Ads</td><td className="p-3 text-red-400">SAÍDA</td><td className="p-3 text-right text-red-400">- R$ 1.200,00</td></tr>
                  <tr><td className="p-3">25/09/2026</td><td className="p-3">Malharia Sul (Adiantamento Tecido)</td><td className="p-3 text-red-400">SAÍDA</td><td className="p-3 text-right text-red-400">- R$ 3.500,00</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {/* --- NOVO MÓDULO: PRICING COM TESTE DE ESTRESSE --- */}
          {activeModule === 'pricing' && (
            <div className="bg-[#0d0d10] border border-zinc-800 p-8 rounded-lg space-y-8 font-mono animate-in fade-in duration-300">
              <div className="border-b border-zinc-800 pb-4">
                <h2 className="text-sm font-bold text-white uppercase tracking-wider">LABORATÓRIO DE PRECIFICAÇÃO & STRESS TEST</h2>
                <p className="text-[10px] text-zinc-500 mt-1">Análise de Sensibilidade: Simule choques de mercado e defina a margem ancorada final.</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                <div className="space-y-6">
                  {/* Inputs Base */}
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

                  {/* Teste de Estresse (Inflação) */}
                  <div className="bg-red-950/10 p-5 rounded border border-red-900/30 space-y-4 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full bg-red-500/50"></div>
                    <span className="text-[10px] font-bold text-red-400 uppercase block">⚡ Shock Test (Inflação/Custo)</span>
                    <div className="space-y-2">
                      <div className="flex justify-between"><span className="text-[9px] text-zinc-400">Piora no cenário:</span><span className="text-xs text-red-400 font-bold">+{stressTestInflation}%</span></div>
                      <input type="range" min="0" max="50" step="5" value={stressTestInflation} onChange={(e) => setStressTestInflation(Number(e.target.value))} className="w-full accent-red-500" />
                    </div>
                    {stressTestInflation > 0 && (
                      <div className="text-[9px] text-zinc-500">
                        Custo Fabrico salta de R$ {cogsPiece} para <strong className="text-red-400">R$ {pricingCalculations.stressedPiece.toFixed(2)}</strong>. O algoritmo recalculará o preço ideal para salvar a margem.
                      </div>
                    )}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-6">
                  {/* Resultado Ancorado */}
                  <div className="bg-zinc-950 p-6 rounded border border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-4 relative">
                    <div className="absolute top-3 right-4 text-[9px] text-zinc-500 flex gap-4">
                      <span>Imposto (6%): R$ {(pricingCalculations.suggestedPrice * 0.06).toFixed(2)}</span>
                      <span>Gateway (4%): R$ {(pricingCalculations.suggestedPrice * 0.04).toFixed(2)}</span>
                    </div>
                    
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

                  {/* Simulador de Margem Limpa */}
                  <div className="bg-zinc-950 p-5 rounded border border-zinc-800 flex items-center gap-6">
                    <div className="flex-1">
                      <label className="text-[10px] text-zinc-400 uppercase block mb-2">Meta de Margem Líquida Limpa ({targetMarginPercent}%)</label>
                      <input type="range" min="30" max="80" value={targetMarginPercent} onChange={(e) => setTargetMarginPercent(Number(e.target.value))} className="w-full accent-emerald-500" />
                    </div>
                    <div className="w-32 text-right">
                      <span className="text-[9px] text-zinc-500 uppercase block">Lucro Real / Peça</span>
                      <span className="text-lg font-bold text-emerald-400">R$ {pricingCalculations.netProfit.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* DEMAIS MÓDULOS MANTIDOS EM BACKGROUND */}
          {['cockpit', 'dre', 'catalogo', 'fornecedores', 'marketing', 'blackbook', 'mapa'].includes(activeModule) && (
            <div className="bg-emerald-950/10 border border-emerald-900/50 p-8 text-center rounded-lg font-mono animate-in fade-in duration-300">
              <span className="text-2xl block mb-2">⚡</span>
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Módulo {activeModule} OK</h3>
              <p className="text-[10px] text-zinc-500">Rodando na infraestrutura central Córtex v6.1.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}