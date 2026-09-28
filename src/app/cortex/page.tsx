'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { playHapticSound } from '@/lib/sound';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// MOCK DATA PARA MODO DEMO (1 ANO DE OPERAÇÃO)
const MOCK_1_YEAR = {
  cashFlow: [
    { id: 'cf1', type: 'ENTRADA', category: 'Vendas Pix', description: 'Liquidação Pedido LR-90214', amount: 320.00, status: 'CONCILIADO', date: '2026-09-12' },
    { id: 'cf2', type: 'SAIDA', category: 'Tráfego Pago', description: 'Campanha Meta Ads Lote Zero', amount: 2500.00, status: 'CONCILIADO', date: '2026-09-10' },
    { id: 'cf3', type: 'SAIDA', category: 'Facção / Costura', description: 'Adiantamento Lote 02 - Oficina Fortaleza', amount: 4800.00, status: 'CONCILIADO', date: '2026-09-08' },
    { id: 'cf4', type: 'ENTRADA', category: 'Vendas Pix', description: 'Liquidação Pedido LR-90215', amount: 640.00, status: 'CONCILIADO', date: '2026-09-12' }
  ],
  suppliers: [
    { id: 'sup1', name: 'Oficina Fortaleza 01', type: 'Facção de Costura', moq: 100, leadTime: 15, unitCost: 25.00, contact: '(85) 99888-1122' },
    { id: 'sup2', name: 'Tecelagem Nordeste', type: 'Fornecedor de Tecido', moq: 500, leadTime: 30, unitCost: 45.00, contact: '(85) 98765-4321' },
    { id: 'sup3', name: 'Laser Tech Ceará', type: 'Gravação de Serial', moq: 50, leadTime: 3, unitCost: 10.00, contact: '(85) 99111-4455' }
  ],
  productsList: [
    { id: 'p1', name: 'Camiseta Boxy Vestigium', sku: 'BOXY-BLK-M', price: 320.00, cost: 95.00, stock: 142, fabric: '100% Algodão 260GSM' },
    { id: 'p2', name: 'Camiseta Performance Forza', sku: 'PERF-TSHIRT', price: 280.00, cost: 85.00, stock: 98, fabric: 'Poliamida + Elastano' },
    { id: 'p3', name: 'Regata Athleisure Libertas', sku: 'PERF-TANK', price: 220.00, cost: 65.00, stock: 64, fabric: 'Dry-Tech Heavy' },
    { id: 'p4', name: 'Boné Desestruturado Signum', sku: 'ACC-CAP-BLK', price: 190.00, cost: 45.00, stock: 210, fabric: 'Sarja Heavyweight' }
  ],
  customers: [
    { id: 'c1', full_name: 'Gabriel Siqueira', email: 'gabriel.siqueira@gmail.com', phone: '11988887766', rfm_tag: 'MEMBRO_VIP', ltv: 1280.00, created_at: '2026-01-15T10:00:00Z' },
    { id: 'c2', full_name: 'Lucas Arantes', email: 'lucas.arantes@hotmail.com', phone: '21997776655', rfm_tag: 'SENADOR_GOLD', ltv: 2450.00, created_at: '2026-02-10T14:30:00Z' },
    { id: 'c3', full_name: 'Renan Vasconcelos', email: 'renan.v@gmail.com', phone: '85991112233', rfm_tag: 'MEMBRO_VIP', ltv: 960.00, created_at: '2026-03-01T09:15:00Z' }
  ]
};

export default function CortexStandaloneDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isCeo, setIsCeo] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);

  const [activeTab, setActiveTab] = useState<
    'cockpit' | 'treasury' | 'pricing' | 'products' | 'suppliers' | 'crm' | 'content' | 'shipments'
  >('cockpit');

  const [prodName, setProdName] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodCost, setProdCost] = useState('');
  const [prodFabric, setProdFabric] = useState('');

  const [supName, setSupName] = useState('');
  const [supType, setSupType] = useState('Facção de Costura');
  const [supMoq, setSupMoq] = useState('');
  const [supLead, setSupLead] = useState('');

  const [cashType, setCashType] = useState<'ENTRADA' | 'SAIDA'>('SAIDA');
  const [cashCategory, setCashCategory] = useState('Tráfego Pago');
  const [cashDesc, setCashDesc] = useState('');
  const [cashAmount, setCashAmount] = useState('');

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  useEffect(() => {
    async function initCortex() {
      const email = localStorage.getItem('lr_user_email');
      const ceoMode = localStorage.getItem('lr_ceo_mode');
      const isCEOUser = email === 'diegooliveiragn@gmail.com' || ceoMode === 'true';
      setIsCeo(isCEOUser);
      setLoading(false);
    }
    initCortex();
  }, []);

  const toggleDemoMode = () => {
    playHapticSound();
    setIsDemoMode(!isDemoMode);
  };

  const forceCeoAuth = () => {
    playHapticSound();
    localStorage.setItem('lr_user_email', 'diegooliveiragn@gmail.com');
    localStorage.setItem('lr_ceo_mode', 'true');
    setIsCeo(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans text-xs uppercase tracking-widest text-zinc-500">
        Iniciando Córtex OS Standalone...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#030303] text-white font-sans flex overflow-hidden">
      
      {/* SIDEBAR LATERAL FIXA À ESQUERDA */}
      <aside className="w-64 bg-[#070707] border-r border-zinc-800/80 flex flex-col justify-between shrink-0 h-full">
        <div className="p-6 space-y-6">
          <div className="space-y-1">
            <span className="font-serif text-xl tracking-[0.2em] text-white block">CÓRTEX OS</span>
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-mono">Executive Suite v2.0</span>
          </div>

          <button
            onClick={toggleDemoMode}
            className={`w-full text-[9px] border px-3 py-2 uppercase tracking-widest font-bold transition-all text-left flex items-center justify-between ${
              isDemoMode
                ? 'bg-amber-950/80 text-amber-400 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                : 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(52,211,153,0.15)]'
            }`}
          >
            <span>{isDemoMode ? '🟡 MODO DEMO (1 ANO)' : '🟢 MODO REAL (LIVE)'}</span>
            <span className="text-xs">⇄</span>
          </button>

          {isCeo ? (
            <div className="bg-amber-950/40 border border-amber-500/30 p-2.5 text-[9px] text-amber-400 uppercase tracking-widest font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
              ♚ CEO MASTER ATIVO
            </div>
          ) : (
            <button onClick={forceCeoAuth} className="w-full text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 py-2 uppercase tracking-widest hover:text-white">
              Ativar Credencial CEO
            </button>
          )}

          <nav className="space-y-1 pt-4 border-t border-zinc-800/80 text-[10px] uppercase tracking-widest">
            {[
              { id: 'cockpit', label: '1. Cockpit 360° & Geointeligência' },
              { id: 'treasury', label: '2. Tesouraria & Conciliação' },
              { id: 'pricing', label: '3. Precificação & Margem' },
              { id: 'products', label: '4. Cadastro de Produtos' },
              { id: 'suppliers', label: '5. Fornecedores Whitelabel' },
              { id: 'crm', label: '6. CRM 360 Dropdown' },
              { id: 'content', label: '7. Content OS & Matriz' },
              { id: 'shipments', label: '8. Logística White Glove' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { playHapticSound(); setActiveTab(tab.id as any); }}
                className={`w-full text-left py-3 px-3 transition-all border-l-2 ${
                  activeTab === tab.id
                    ? 'border-amber-400 text-amber-400 font-bold bg-amber-950/10'
                    : 'border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6 border-t border-zinc-800/80 space-y-3">
          <div className="text-[9px] text-zinc-500 uppercase tracking-widest">
            Base: <strong className="text-white">Fortaleza • CE</strong>
          </div>
          <button
            onClick={() => router.push('/')}
            className="w-full text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 py-2 hover:text-white transition-colors uppercase tracking-widest"
          >
            Sair do Córtex
          </button>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO PRINCIPAL (TELA CHEIA) */}
      <main className="flex-1 h-screen overflow-y-auto p-10 bg-[#030303]">
        
        {/* MÓDULO 1: COCKPIT 360° */}
        {activeTab === 'cockpit' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="text-xl font-serif text-white uppercase tracking-widest">Cockpit 360° & Geointeligência</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Visão espacial de vendas e telemetria ao vivo.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">Receita Anual Consolidada</span>
                <span className="text-2xl font-serif text-white block">R$ 1.482.000,00</span>
                <span className="text-[9px] text-emerald-400 block uppercase">EBITDA Real: 38.0%</span>
              </div>
              <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">Pedidos Liquidados</span>
                <span className="text-2xl font-serif text-amber-400 block">4.630 aquisições</span>
                <span className="text-[9px] text-zinc-500 block uppercase">Ticket Médio: R$ 320,00</span>
              </div>
              <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">Conversão Pix</span>
                <span className="text-2xl font-serif text-white block">88.4%</span>
                <span className="text-[9px] text-emerald-400 block uppercase">Tempo médio: 3.8 min</span>
              </div>
              <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">Health Check Servidores</span>
                <span className="text-xl font-serif text-emerald-400 block">SISTEMAS ONLINE</span>
                <span className="text-[9px] text-zinc-500 block uppercase">MercadoPago • Resend • Supabase</span>
              </div>
            </div>

            {/* MAPA DO BRASIL SVG DE ALTA PRECISÃO GEOGRÁFICA */}
            <div className="bg-[#070707] border border-zinc-800 p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <h2 className="text-xs font-sans uppercase tracking-widest text-zinc-200 font-bold">
                  Geointeligência de Vendas • Território Nacional
                </h2>
                <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-amber-400 px-3 py-1 uppercase tracking-widest font-mono">
                  Vector Radar Active
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-2 bg-[#040404] border border-zinc-900 p-8 flex justify-center items-center relative min-h-[400px]">
                  <svg viewBox="0 0 500 500" className="w-full max-w-md h-auto opacity-90">
                    <g stroke="#27272a" strokeWidth="1.2">
                      {/* REGIÃO NORTE */}
                      <path d="M110,120 C140,90 200,80 260,110 C290,130 300,180 280,220 C230,250 150,240 120,200 Z" fill="#121215" className="hover:fill-zinc-800 transition-colors cursor-pointer" />
                      {/* NORDESTE (CEARÁ HIGHLIGHT) */}
                      <path d="M290,115 C330,100 410,90 430,130 C440,160 410,190 380,220 C340,220 300,180 290,150 Z" fill="#f59e0b" className="animate-pulse cursor-pointer" />
                      {/* CENTRO-OESTE */}
                      <path d="M190,245 C270,230 310,230 320,310 C280,330 220,320 180,290 Z" fill="#18181b" className="hover:fill-zinc-800 transition-colors cursor-pointer" />
                      {/* SUDESTE (SP / RJ HIGHLIGHT) */}
                      <path d="M310,290 C360,280 400,280 410,330 C370,360 320,360 300,320 Z" fill="#34d399" className="hover:fill-emerald-400 transition-colors cursor-pointer" />
                      {/* SUL (PR / RS HIGHLIGHT) */}
                      <path d="M270,350 C320,350 350,370 330,440 C290,440 260,400 260,370 Z" fill="#10b981" className="hover:fill-emerald-400 transition-colors cursor-pointer" />
                    </g>
                    {/* RADAR DOTS COM PULSO EM CAPITAIS */}
                    <circle cx="385" cy="115" r="4" fill="#fbbf24" className="animate-ping" />
                    <circle cx="340" cy="335" r="4" fill="#34d399" className="animate-ping" />
                    <circle cx="375" cy="325" r="3" fill="#34d399" />
                  </svg>

                  <div className="absolute top-6 left-6 text-[10px] font-mono space-y-1 bg-black/80 p-3 border border-zinc-800/80 backdrop-blur-sm">
                    <div className="text-amber-400 font-bold">● CE (HQ Fortaleza): 640 membros</div>
                    <div className="text-emerald-400 font-bold">● SP (Capitais): 1.850 membros</div>
                    <div className="text-emerald-400 font-bold">● RJ (Litoral): 920 membros</div>
                    <div className="text-zinc-500">● MG (Sudoeste): 480 membros</div>
                  </div>
                </div>

                <div className="space-y-3 text-xs font-sans">
                  <h3 className="text-[10px] text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-2">
                    Rank de Estados por Volume
                  </h3>
                  {[
                    { st: 'São Paulo (SP)', count: '1.850 aquisições', share: '39.9%' },
                    { st: 'Rio de Janeiro (RJ)', count: '920 aquisições', share: '19.8%' },
                    { st: 'Ceará (CE)', count: '640 aquisições', share: '13.8%' },
                    { st: 'Minas Gerais (MG)', count: '480 aquisições', share: '10.3%' },
                    { st: 'Paraná (PR)', count: '310 aquisições', share: '6.6%' }
                  ].map((row) => (
                    <div key={row.st} className="bg-[#050505] p-3 border border-zinc-900 flex justify-between items-center">
                      <span className="text-white font-bold uppercase">{row.st}</span>
                      <span className="text-amber-400 font-mono">{row.count} ({row.share})</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MÓDULO 2: TESOURARIA */}
        {activeTab === 'treasury' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="text-xl font-serif text-white uppercase tracking-widest">Tesouraria, Conciliação & Extrato de Caixa</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Gestão de entradas, saídas reais e conciliação bancária centavo por centavo.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-[#070707] border border-zinc-800 p-6 space-y-6">
                <h2 className="text-xs font-sans uppercase tracking-widest text-zinc-200 font-bold border-b border-zinc-800 pb-3">
                  Extrato de Movimentações de Caixa (Cash Ledger)
                </h2>

                <div className="space-y-2 font-sans text-xs">
                  {MOCK_1_YEAR.cashFlow.map((cf) => (
                    <div key={cf.id} className="bg-[#040404] border border-zinc-800 p-4 flex justify-between items-center">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={`text-[9px] px-2 py-0.5 font-bold uppercase ${cf.type === 'ENTRADA' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'}`}>
                            {cf.type}
                          </span>
                          <span className="text-zinc-400 text-[10px]">{cf.category} • {cf.date}</span>
                        </div>
                        <span className="text-white font-bold block">{cf.description}</span>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-mono font-bold ${cf.type === 'ENTRADA' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {cf.type === 'ENTRADA' ? '+' : '-'} R$ {cf.amount.toFixed(2)}
                        </span>
                        <span className="text-[9px] text-zinc-500 block uppercase">{cf.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <form className="bg-[#070707] border border-zinc-800 p-6 space-y-4 font-sans text-xs h-fit">
                <h2 className="text-xs uppercase tracking-widest text-zinc-200 font-bold border-b border-zinc-800 pb-3">
                  Lançar Movimentação Manual
                </h2>
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-400 uppercase">Tipo</label>
                  <select value={cashType} onChange={(e) => setCashType(e.target.value as any)} className="w-full bg-black border border-zinc-800 p-3 text-white outline-none">
                    <option value="SAIDA">Saída / Despesa</option>
                    <option value="ENTRADA">Entrada / Receita Extra</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-400 uppercase">Categoria</label>
                  <input type="text" value={cashCategory} onChange={(e) => setCashCategory(e.target.value)} className="w-full bg-black border border-zinc-800 p-3 text-white outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-400 uppercase">Descrição</label>
                  <input type="text" placeholder="Ex: Pagamento Frete Coleta" value={cashDesc} onChange={(e) => setCashDesc(e.target.value)} className="w-full bg-black border border-zinc-800 p-3 text-white outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-400 uppercase">Valor (R$)</label>
                  <input type="number" placeholder="500.00" value={cashAmount} onChange={(e) => setCashAmount(e.target.value)} className="w-full bg-black border border-zinc-800 p-3 text-white outline-none" />
                </div>
                <button type="button" className="w-full bg-white text-black font-bold py-3.5 uppercase tracking-widest text-[10px] hover:bg-zinc-200 transition-colors">
                  Registrar no Caixa
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MÓDULO 3: PRECIFICAÇÃO */}
        {activeTab === 'pricing' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="text-xl font-serif text-white uppercase tracking-widest">Precificação Psicodinâmica & Elasticidade</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Cálculo de margem de contribuição com teto de luxo.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#070707] border border-zinc-800 p-6 space-y-4 font-sans text-xs">
                <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3">Simulador de Custo Fabril</h2>
                <div className="space-y-2">
                  <label className="text-zinc-400 block">Tecido (Algodão Heavyweight 260GSM): R$ 45,00</label>
                </div>
                <div className="space-y-2">
                  <label className="text-zinc-400 block">Facção de Costura: R$ 25,00</label>
                </div>
                <div className="space-y-2">
                  <label className="text-zinc-400 block">Packaging White Glove + Laser Serial: R$ 25,00</label>
                </div>
                <div className="border-t border-zinc-800 pt-3">
                  <span className="text-amber-400 font-bold block">Custo Fabril Total (CPV): R$ 95,00</span>
                </div>
              </div>

              <div className="bg-[#070707] border border-zinc-800 p-6 space-y-4 font-sans text-xs">
                <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3">Ancoragem Sugerida</h2>
                <span className="text-3xl font-serif text-amber-400 block">R$ 320,00</span>
                <p className="text-zinc-400 leading-relaxed">
                  Markup aplicado de 3.37x. Margem de contribuição limpa de 70.3%, assegurando cobrimento de CAC e lucro líquido.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* MÓDULO 4: PRODUTOS */}
        {activeTab === 'products' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="text-xl font-serif text-white uppercase tracking-widest">Cadastro de Produtos & Artefatos</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Engenharia de peças, SKUs e saldos de prateleira.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-[#070707] border border-zinc-800 p-6 space-y-4">
                <h2 className="text-xs font-sans uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3">
                  Catálogo de Artefatos Cadastrados
                </h2>
                <div className="space-y-3 font-sans text-xs">
                  {MOCK_1_YEAR.productsList.map((p) => (
                    <div key={p.id} className="bg-[#040404] border border-zinc-800 p-4 flex justify-between items-center">
                      <div>
                        <span className="text-amber-400 font-mono text-[10px] block font-bold">{p.sku}</span>
                        <span className="text-white font-bold block text-sm">{p.name}</span>
                        <span className="text-zinc-500 text-[10px]">{p.fabric}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-white font-bold block">R$ {p.price.toFixed(2)}</span>
                        <span className="text-emerald-400 text-[10px] block font-bold">Estoque: {p.stock} un</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <form className="bg-[#070707] border border-zinc-800 p-6 space-y-4 font-sans text-xs h-fit">
                <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3">
                  Cadastrar Novo Artefato
                </h2>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase">Nome da Peça</label>
                  <input type="text" placeholder="Ex: Camiseta Oversized Origo" value={prodName} onChange={(e) => setProdName(e.target.value)} className="w-full bg-black border border-zinc-800 p-2.5 text-white outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase">Código SKU</label>
                  <input type="text" placeholder="Ex: BOXY-WHT-L" value={prodSku} onChange={(e) => setProdSku(e.target.value)} className="w-full bg-black border border-zinc-800 p-2.5 text-white outline-none" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase">Preço Venda (R$)</label>
                    <input type="number" placeholder="320.00" value={prodPrice} onChange={(e) => setProdPrice(e.target.value)} className="w-full bg-black border border-zinc-800 p-2.5 text-white outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase">Custo Fabril (R$)</label>
                    <input type="number" placeholder="95.00" value={prodCost} onChange={(e) => setProdCost(e.target.value)} className="w-full bg-black border border-zinc-800 p-2.5 text-white outline-none" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase">Especificação do Tecido</label>
                  <input type="text" placeholder="Ex: 100% Algodão 260GSM" value={prodFabric} onChange={(e) => setProdFabric(e.target.value)} className="w-full bg-black border border-zinc-800 p-2.5 text-white outline-none" />
                </div>
                <button type="button" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest text-[10px] hover:bg-zinc-200 transition-colors mt-2">
                  Salvar Artefato
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MÓDULO 5: FORNECEDORES WHITELABEL */}
        {activeTab === 'suppliers' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="text-xl font-serif text-white uppercase tracking-widest">Cadastro de Fornecedores & Cadeia Whitelabel</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Gestão de facções, tecelagens, prazos de entrega (Lead Time) e MOQ.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-[#070707] border border-zinc-800 p-6 space-y-4">
                <h2 className="text-xs font-sans uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3">
                  Parceiros de Produção Ativos
                </h2>
                <div className="space-y-3 font-sans text-xs">
                  {MOCK_1_YEAR.suppliers.map((s) => (
                    <div key={s.id} className="bg-[#040404] border border-zinc-800 p-4 flex justify-between items-center">
                      <div>
                        <span className="text-amber-400 font-bold block">{s.name}</span>
                        <span className="text-zinc-400 text-[10px] block">{s.type} • Contato: {s.contact}</span>
                      </div>
                      <div className="text-right text-[10px] font-mono space-y-0.5">
                        <span className="text-white block font-bold">MOQ: {s.moq} un</span>
                        <span className="text-emerald-400 block">Lead Time: {s.leadTime} dias</span>
                        <span className="text-zinc-400 block">Custo Unit: R$ {s.unitCost.toFixed(2)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <form className="bg-[#070707] border border-zinc-800 p-6 space-y-4 font-sans text-xs h-fit">
                <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3">
                  Cadastrar Fornecedor
                </h2>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase">Nome da Empresa/Facção</label>
                  <input type="text" placeholder="Ex: Bordados Elite Ceará" value={supName} onChange={(e) => setSupName(e.target.value)} className="w-full bg-black border border-zinc-800 p-2.5 text-white outline-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-zinc-400 uppercase">Tipo de Serviço</label>
                  <select value={supType} onChange={(e) => setSupType(e.target.value)} className="w-full bg-black border border-zinc-800 p-2.5 text-white outline-none">
                    <option value="Facção de Costura">Facção de Costura</option>
                    <option value="Fornecedor de Tecido">Fornecedor de Tecido</option>
                    <option value="Gravação de Serial">Gravação de Serial Laser</option>
                    <option value="Embalagens">Embalagens & Tags</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase">MOQ (Mínimo)</label>
                    <input type="number" placeholder="100" value={supMoq} onChange={(e) => setSupMoq(e.target.value)} className="w-full bg-black border border-zinc-800 p-2.5 text-white outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-zinc-400 uppercase">Prazo (Dias)</label>
                    <input type="number" placeholder="15" value={supLead} onChange={(e) => setSupLead(e.target.value)} className="w-full bg-black border border-zinc-800 p-2.5 text-white outline-none" />
                  </div>
                </div>
                <button type="button" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest text-[10px] hover:bg-zinc-200 transition-colors mt-2">
                  Salvar Fornecedor
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MÓDULO 6: CRM 360 DROPDOWN */}
        {activeTab === 'crm' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h1 className="text-xl font-serif text-white uppercase tracking-widest">CRM 360° • Membros do Senado VIP</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Ficha completa por cliente em gaveta dropdown.</p>
            </div>

            <div className="space-y-3 font-sans text-xs">
              {MOCK_1_YEAR.customers.map((c) => {
                const isSelected = selectedCustomerId === c.id;
                return (
                  <div key={c.id} className="bg-[#070707] border border-zinc-800">
                    <div
                      onClick={() => { playHapticSound(); setSelectedCustomerId(isSelected ? null : c.id); }}
                      className="p-5 flex justify-between items-center cursor-pointer hover:bg-zinc-900/50"
                    >
                      <div>
                        <span className="text-white font-bold block text-sm font-serif">{c.full_name}</span>
                        <span className="text-zinc-500 text-[10px]">{c.email} • {c.phone}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="bg-zinc-900 text-amber-400 border border-zinc-800 px-3 py-1 font-bold text-[9px]">
                          {c.rfm_tag}
                        </span>
                        <span className="font-mono text-white">LTV: R$ {c.ltv.toFixed(2)}</span>
                        <span>{isSelected ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="border-t border-zinc-800 bg-[#040404] p-6 grid grid-cols-3 gap-6">
                        <div>
                          <span className="text-zinc-500 font-bold block mb-1">Dados Biométricos</span>
                          <p className="text-zinc-300">• Altura: 178cm | Peso: 78kg</p>
                          <p className="text-zinc-300">• Caimento: Boxy Oversized</p>
                        </div>
                        <div>
                          <span className="text-zinc-500 font-bold block mb-1">Atribuição</span>
                          <p className="text-zinc-300">• Canal: Instagram Orgânico</p>
                          <p className="text-zinc-300">• Estado: São Paulo / SP</p>
                        </div>
                        <div>
                          <span className="text-zinc-500 font-bold block mb-1">Serials em Posse</span>
                          <p className="text-amber-400 font-bold">• LR-D00-BOXY-0001</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MÓDULO 7: CONTENT OS */}
        {activeTab === 'content' && (
          <div className="space-y-6 animate-in fade-in duration-300 font-sans text-xs">
            <h1 className="text-xl font-serif text-white uppercase tracking-widest">Content OS & Matriz Editorial</h1>
            <div className="grid grid-cols-2 gap-6">
              <div className="bg-[#070707] border border-zinc-800 p-6 space-y-2">
                <span className="text-amber-400 font-bold block">Roteiro Reels #01 • Fortaleza</span>
                <p className="text-zinc-400">Tomada do mar em PB. Foco na tensão entre o esporte e a cidade.</p>
              </div>
              <div className="bg-[#070707] border border-zinc-800 p-6 space-y-2">
                <span className="text-amber-400 font-bold block">Roteiro Reels #02 • Roma</span>
                <p className="text-zinc-400">Macro da gola de 3cm e gravação de serial a laser.</p>
              </div>
            </div>
          </div>
        )}

        {/* MÓDULO 8: LOGÍSTICA WHITE GLOVE */}
        {activeTab === 'shipments' && (
          <div className="space-y-6 animate-in fade-in duration-300 font-sans text-xs">
            <h1 className="text-xl font-serif text-white uppercase tracking-widest">Logística White Glove & Rastreio</h1>
            <div className="bg-[#070707] border border-zinc-800 p-6 max-w-md space-y-3">
              <span className="text-zinc-200 font-bold block border-b border-zinc-800 pb-2">Despachar Pedido</span>
              <input type="text" placeholder="Código de Rastreio SEDEX" className="w-full bg-black border border-zinc-800 p-3 text-white outline-none" />
              <button type="button" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest">Enviar E-mail White Glove</button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}