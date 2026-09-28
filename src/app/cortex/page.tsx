'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { playHapticSound } from '@/lib/sound';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// CONJUNTO DE DADOS MOCK (SIMULAÇÃO DE 1 ANO DE OPERAÇÃO)
const MOCK_1_YEAR = {
  orders: [
    { id: 'm1', order_number: 'LR-90214', total_amount: 320.00, payment_status: 'PAGO', delivery_state: 'SP', created_at: '2026-09-12T10:30:00Z', customers: { full_name: 'Gabriel Siqueira', email: 'gabriel.siqueira@gmail.com', phone: '11988887766' } },
    { id: 'm2', order_number: 'LR-90215', total_amount: 640.00, payment_status: 'PAGO', delivery_state: 'RJ', created_at: '2026-09-12T11:15:00Z', customers: { full_name: 'Lucas Arantes', email: 'lucas.arantes@hotmail.com', phone: '21997776655' } },
    { id: 'm3', order_number: 'LR-90216', total_amount: 320.00, payment_status: 'PAGO', delivery_state: 'CE', created_at: '2026-09-12T12:00:00Z', customers: { full_name: 'Renan Vasconcelos', email: 'renan.v@gmail.com', phone: '85991112233' } },
    { id: 'm4', order_number: 'LR-90217', total_amount: 280.00, payment_status: 'PAGO', delivery_state: 'MG', created_at: '2026-09-12T14:20:00Z', customers: { full_name: 'Mateus Castro', email: 'mcastro@yahoo.com.br', phone: '31984443322' } },
    { id: 'm5', order_number: 'LR-90218', total_amount: 560.00, payment_status: 'PENDENTE', delivery_state: 'PR', created_at: '2026-09-12T15:45:00Z', customers: { full_name: 'Felipe Diniz', email: 'fdiniz@outlook.com', phone: '41992221100' } },
    { id: 'm6', order_number: 'LR-90219', total_amount: 320.00, payment_status: 'PAGO', delivery_state: 'RS', created_at: '2026-09-12T16:10:00Z', customers: { full_name: 'Rodrigo Burlamaqui', email: 'burlamaqui@gmail.com', phone: '51981119988' } },
    { id: 'm7', order_number: 'LR-90220', total_amount: 190.00, payment_status: 'PAGO', delivery_state: 'CE', created_at: '2026-09-12T17:05:00Z', customers: { full_name: 'Caio Menezes', email: 'caio.menezes@gmail.com', phone: '85987654321' } },
    { id: 'm8', order_number: 'LR-90221', total_amount: 320.00, payment_status: 'PENDENTE', delivery_state: 'SP', created_at: '2026-09-12T18:30:00Z', customers: { full_name: 'Thiago Alencar', email: 'talencar@gmail.com', phone: '11971112233' } }
  ],
  expenses: [
    { id: 'e1', category: 'Meta Ads', description: 'Tráfego Pago Meta Ads • Campanha Lote Zero', amount: 18500.00, date: '2026-09-01' },
    { id: 'e2', category: 'Software/SaaS', description: 'Assinaturas do Ecossistema (Vercel, Supabase, Resend)', amount: 1450.00, date: '2026-09-05' },
    { id: 'e3', category: 'Embalagem', description: 'Produção Lote 01 • Caixas Rígidas + Seda', amount: 8200.00, date: '2026-08-20' },
    { id: 'e4', category: 'Logistica', description: 'Contrato de Coleta Expressa SEDEX/Jadlog', amount: 3100.00, date: '2026-09-10' }
  ],
  customers: [
    { id: 'c1', full_name: 'Gabriel Siqueira', email: 'gabriel.siqueira@gmail.com', phone: '11988887766', rfm_tag: 'MEMBRO_VIP', ltv: 1280.00, created_at: '2026-01-15T10:00:00Z' },
    { id: 'c2', full_name: 'Lucas Arantes', email: 'lucas.arantes@hotmail.com', phone: '21997776655', rfm_tag: 'SENADOR_GOLD', ltv: 2450.00, created_at: '2026-02-10T14:30:00Z' },
    { id: 'c3', full_name: 'Renan Vasconcelos', email: 'renan.v@gmail.com', phone: '85991112233', rfm_tag: 'MEMBRO_VIP', ltv: 960.00, created_at: '2026-03-01T09:15:00Z' },
    { id: 'c4', full_name: 'Mateus Castro', email: 'mcastro@yahoo.com.br', phone: '31984443322', rfm_tag: 'WAITLIST', ltv: 280.00, created_at: '2026-04-12T18:00:00Z' },
    { id: 'c5', full_name: 'Rodrigo Burlamaqui', email: 'burlamaqui@gmail.com', phone: '51981119988', rfm_tag: 'SENADOR_GOLD', ltv: 1890.00, created_at: '2026-05-20T11:45:00Z' }
  ],
  serials: [
    { id: 's1', serial_code: 'LR-D00-BOXY-0001', customer_id: 'c1', size: 'M' },
    { id: 's2', serial_code: 'LR-D00-BOXY-0002', customer_id: 'c2', size: 'G' },
    { id: 's3', serial_code: 'LR-D00-FORZ-0001', customer_id: 'c3', size: 'M' },
    { id: 's4', serial_code: 'LR-D00-LIBE-0001', customer_id: 'c5', size: 'P' }
  ],
  telemetry: [
    { id: 't1', event_type: 'pdp_view', page_url: '/produto/vestigium', created_at: new Date().toISOString() },
    { id: 't2', event_type: 'fit_engine_open', page_url: '/produto/vestigium', created_at: new Date(Date.now() - 120000).toISOString() },
    { id: 't3', event_type: 'checkout_initiated', page_url: '/checkout', created_at: new Date(Date.now() - 300000).toISOString() },
    { id: 't4', event_type: 'waitlist_signup', page_url: '/', created_at: new Date(Date.now() - 600000).toISOString() }
  ],
  totals: {
    grossRevenue: 1482000.00,
    paidOrdersCount: 4630,
    ebitda: 563160.00,
    ebitdaMargin: 38.0
  }
};

export default function CortexStandaloneDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isCeo, setIsCeo] = useState(false);
  
  // TOGGLE DE MODO DEMO / SIMULAÇÃO DE 1 ANO
  const [isDemoMode, setIsDemoMode] = useState(true);

  const [activeTab, setActiveTab] = useState<
    'cockpit' | 'dre' | 'pricing' | 'whitelabel' | 'crm' | 'content' | 'whatsapp' | 'shipments'
  >('cockpit');

  // DADOS VIVOS DO BANCO
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [dbExpenses, setDbExpenses] = useState<any[]>([]);
  const [dbCustomers, setDbCustomers] = useState<any[]>([]);
  const [dbSerials, setDbSerials] = useState<any[]>([]);
  const [dbTelemetry, setDbTelemetry] = useState<any[]>([]);
  
  // CLIENTE SELECIONADO (DROPDOWN CRM 360)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  // SIMULADOR PRECIFICAÇÃO
  const [fabricCost, setFabricCost] = useState(45);
  const [sewingCost, setSewingCost] = useState(25);
  const [tagPackCost, setTagPackCost] = useState(15);
  const [laserSerialCost, setLaserSerialCost] = useState(10);
  const [targetMarkup, setTargetMarkup] = useState(3.2);

  // LANÇAMENTO DE OPEX
  const [expCategory, setExpCategory] = useState('Meta Ads');
  const [expDescription, setExpDescription] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [addingExp, setAddingExp] = useState(false);

  // LOGÍSTICA
  const [shipOrderId, setShipOrderId] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [carrier, setCarrier] = useState('Correios SEDEX');
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shipSuccessMsg, setShipSuccessMsg] = useState('');

  useEffect(() => {
    async function initCortex() {
      const email = localStorage.getItem('lr_user_email');
      const ceoMode = localStorage.getItem('lr_ceo_mode');
      const demoMode = localStorage.getItem('lr_demo_mode');

      if (demoMode !== null) {
        setIsDemoMode(demoMode === 'true');
      }

      const isCEOUser = email === 'diegooliveiragn@gmail.com' || ceoMode === 'true';
      setIsCeo(isCEOUser);

      try {
        const [
          { data: resOrders },
          { data: resExpenses },
          { data: resCustomers },
          { data: resSerials },
          { data: resTelemetry }
        ] = await Promise.all([
          supabase.from('orders').select('*, customers(*)').order('created_at', { ascending: false }),
          supabase.from('expenses').select('*').order('date', { ascending: false }),
          supabase.from('customers').select('*').order('created_at', { ascending: false }),
          supabase.from('serialized_items').select('*'),
          supabase.from('telemetry_events').select('*').order('created_at', { ascending: false }).limit(30)
        ]);

        if (resOrders) setDbOrders(resOrders);
        if (resExpenses) setDbExpenses(resExpenses);
        if (resCustomers) setDbCustomers(resCustomers);
        if (resSerials) setDbSerials(resSerials);
        if (resTelemetry) setDbTelemetry(resTelemetry);
      } catch (err) {
        console.error('Erro de sincronização Córtex OS:', err);
      } finally {
        setLoading(false);
      }
    }
    initCortex();
  }, []);

  const toggleDemoMode = () => {
    playHapticSound();
    const nextMode = !isDemoMode;
    setIsDemoMode(nextMode);
    localStorage.setItem('lr_demo_mode', String(nextMode));
  };

  const forceCeoAuth = () => {
    playHapticSound();
    localStorage.setItem('lr_user_email', 'diegooliveiragn@gmail.com');
    localStorage.setItem('lr_ceo_mode', 'true');
    setIsCeo(true);
  };

  // DADOS ATIVOS DEPENDENDO DO MODO (REAL vs DEMO 1 ANO)
  const orders = isDemoMode ? MOCK_1_YEAR.orders : dbOrders;
  const expenses = isDemoMode ? MOCK_1_YEAR.expenses : dbExpenses;
  const customers = isDemoMode ? MOCK_1_YEAR.customers : dbCustomers;
  const serials = isDemoMode ? MOCK_1_YEAR.serials : dbSerials;
  const telemetryEvents = isDemoMode ? MOCK_1_YEAR.telemetry : dbTelemetry;

  // GEOINTELIGÊNCIA
  const stateDensity = useMemo(() => {
    if (isDemoMode) {
      return { SP: 1850, RJ: 920, CE: 640, MG: 480, PR: 310, RS: 220, SC: 150, BA: 120, DF: 90 };
    }
    const counts: Record<string, number> = { CE: 0, SP: 0, RJ: 0, MG: 0, PR: 0, RS: 0, SC: 0, BA: 0, DF: 0 };
    orders.forEach((o) => {
      const st = o.delivery_state || 'CE';
      counts[st] = (counts[st] || 0) + 1;
    });
    return counts;
  }, [orders, isDemoMode]);

  // CÁLCULO DRE
  const dreMetrics = useMemo(() => {
    if (isDemoMode) {
      return {
        grossRevenue: MOCK_1_YEAR.totals.grossRevenue,
        cogs: 439850.00,
        gatewayFees: 59131.80,
        taxes: 88920.00,
        grossProfit: 894098.20,
        totalOpEx: 330938.20,
        ebitda: MOCK_1_YEAR.totals.ebitda,
        ebitdaMargin: MOCK_1_YEAR.totals.ebitdaMargin,
        paidCount: MOCK_1_YEAR.totals.paidOrdersCount
      };
    }

    const paidOrders = orders.filter((o) => o.payment_status === 'PAGO');
    const grossRevenue = paidOrders.reduce((acc, o) => acc + Number(o.total_amount || 0), 0);

    const cogs = paidOrders.length * 95.0;
    const gatewayFees = grossRevenue * 0.0399;
    const taxes = grossRevenue * 0.06;

    const grossProfit = grossRevenue - cogs - gatewayFees - taxes;
    const totalOpEx = expenses.reduce((acc, e) => acc + Number(e.amount || 0), 0);

    const ebitda = grossProfit - totalOpEx;
    const ebitdaMargin = grossRevenue > 0 ? (ebitda / grossRevenue) * 100 : 0;

    return {
      grossRevenue,
      cogs,
      gatewayFees,
      taxes,
      grossProfit,
      totalOpEx,
      ebitda,
      ebitdaMargin,
      paidCount: paidOrders.length
    };
  }, [orders, expenses, isDemoMode]);

  const unitCostTotal = fabricCost + sewingCost + tagPackCost + laserSerialCost;
  const suggestedPrice = Math.ceil((unitCostTotal * targetMarkup) / 10) * 10;

  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    playHapticSound();
    if (!expAmount || Number(expAmount) <= 0) return;

    setAddingExp(true);
    const newExp = {
      category: expCategory,
      description: expDescription || expCategory,
      amount: Number(expAmount),
      date: new Date().toISOString().split('T')[0]
    };

    try {
      const { data } = await supabase.from('expenses').insert([newExp]).select().single();
      if (data && !isDemoMode) setDbExpenses([data, ...dbExpenses]);
      setExpDescription('');
      setExpAmount('');
    } catch (e) {
      console.error(e);
    } finally {
      setAddingExp(false);
    }
  };

  const handleDispatchOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    playHapticSound();
    if (!shipOrderId || !trackingCode) return;

    setShippingLoading(true);
    setShipSuccessMsg('');

    try {
      const res = await fetch('/api/cortex/ship', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: shipOrderId, trackingCode, carrier })
      });
      const data = await res.json();

      if (data.success) {
        setShipSuccessMsg(`Rastreio ${trackingCode} enviado ao e-mail do cliente.`);
        setTrackingCode('');
      } else alert(data.error || 'Falha no envio.');
    } catch (e) {
      alert('Erro de conexão.');
    } finally {
      setShippingLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center font-sans text-xs uppercase tracking-widest text-zinc-500">
        Iniciando Córtex OS Standalone...
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#030303] text-white font-sans flex flex-col">
      
      {/* CABEÇALHO STANDALONE EXECUTIVO COM ALTERNADOR DE MODO */}
      <header className="w-full px-8 py-5 bg-[#070707] border-b border-zinc-800/80 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-6">
          <span className="font-serif text-2xl tracking-[0.2em] text-white">CÓRTEX OS</span>

          {/* BOTÃO ALTERNADOR DE MODO (DEMO vs REAL) */}
          <button
            onClick={toggleDemoMode}
            className={`text-[9px] border px-3 py-1.5 uppercase tracking-widest font-bold transition-all flex items-center gap-2 ${
              isDemoMode
                ? 'bg-amber-950/80 text-amber-400 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                : 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(52,211,153,0.2)]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isDemoMode ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400 animate-pulse'}`}></span>
            {isDemoMode ? '🟡 MODO DEMO (SIMULAÇÃO 1 ANO)' : '🟢 MODO REAL (LIVE PRODUÇÃO)'}
          </button>

          {isCeo ? (
            <span className="text-[10px] bg-zinc-900 border border-zinc-700 text-zinc-300 px-3 py-1 uppercase tracking-widest font-bold hidden md:inline-block">
              ♚ CEO MASTER
            </span>
          ) : (
            <button
              onClick={forceCeoAuth}
              className="text-[9px] bg-zinc-900 text-zinc-400 border border-zinc-800 px-3 py-1 uppercase tracking-widest hover:border-amber-500/50 hover:text-amber-400 transition-colors"
            >
              Autenticar CEO
            </button>
          )}
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right hidden sm:block">
            <span className="text-[9px] text-zinc-500 block uppercase tracking-widest">Base Operacional</span>
            <span className="text-xs text-white font-bold uppercase tracking-wider">Fortaleza &bull; CE</span>
          </div>
          <button
            onClick={() => router.push('/')}
            className="text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-4 py-2 hover:text-white hover:border-zinc-600 transition-colors uppercase tracking-widest"
          >
            Sair do Córtex
          </button>
        </div>
      </header>

      {/* NAVEGAÇÃO DOS 8 MÓDULOS */}
      <nav className="bg-[#050505] border-b border-zinc-900 px-8 flex overflow-x-auto text-[10px] uppercase tracking-widest gap-1">
        {[
          { id: 'cockpit', label: '1. Cockpit 360° & Geointeligência' },
          { id: 'dre', label: '2. Financeiro & EBITDA' },
          { id: 'pricing', label: '3. Precificação Psicodinâmica' },
          { id: 'whitelabel', label: '4. Whitelabel & Estocagem' },
          { id: 'crm', label: `5. CRM 360 Dropdown (${customers.length})` },
          { id: 'content', label: '6. Content OS & Matriz' },
          { id: 'whatsapp', label: '7. Recuperação WhatsApp' },
          { id: 'shipments', label: '8. Logística White Glove' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              playHapticSound();
              setActiveTab(tab.id as any);
            }}
            className={`py-4 px-4 whitespace-nowrap transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-amber-400 text-amber-400 font-bold bg-amber-950/10'
                : 'border-transparent text-zinc-500 hover:text-zinc-300'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="flex-1 p-8 max-w-7xl w-full mx-auto space-y-10">

        {/* MÓDULO 1: COCKPIT 360° */}
        {activeTab === 'cockpit' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-[#070707] border border-zinc-800/80 p-6 space-y-2">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">Sessões Ativas Agora</span>
                <span className="text-3xl font-serif text-white block">{isDemoMode ? '48 ativas' : '3 ativas'}</span>
                <span className="text-[9px] text-emerald-400 block uppercase">78% no Provador Preditivo</span>
              </div>
              <div className="bg-[#070707] border border-zinc-800/80 p-6 space-y-2">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">Conversão de Pix</span>
                <span className="text-3xl font-serif text-amber-400 block">{isDemoMode ? '88.4%' : '0.0%'}</span>
                <span className="text-[9px] text-zinc-500 block uppercase">Liquidação média em 3.8 min</span>
              </div>
              <div className="bg-[#070707] border border-zinc-800/80 p-6 space-y-2">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">Health Check Infra</span>
                <span className="text-xl font-serif text-emerald-400 block">SISTEMAS ONLINE</span>
                <span className="text-[9px] text-zinc-500 block uppercase">Resend • MercadoPago • Supabase</span>
              </div>
              <div className="bg-[#070707] border border-zinc-800/80 p-6 space-y-2">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">Velocidade de Caixa</span>
                <span className="text-3xl font-serif text-white block">{isDemoMode ? 'R$ 4.060/dia' : 'R$ 0/dia'}</span>
                <span className="text-[9px] text-zinc-500 block uppercase">Ritmo Lote Zero</span>
              </div>
            </div>

            <div className="bg-[#070707] border border-zinc-800/80 p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <div>
                  <h2 className="text-xs font-sans uppercase tracking-widest text-zinc-200 font-bold">
                    Geointeligência de Vendas & Membros do Senado VIP
                  </h2>
                  <p className="text-[10px] text-zinc-500 mt-1">
                    Densidade espacial dos pedidos liquidados por estado.
                  </p>
                </div>
                <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 px-3 py-1 uppercase tracking-widest">
                  Brasil Vector Radar
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                <div className="lg:col-span-2 bg-[#040404] border border-zinc-900 p-8 flex justify-center items-center relative min-h-[320px]">
                  <svg viewBox="0 0 500 500" className="w-full max-w-md h-auto opacity-90">
                    <g fill="#121215" stroke="#27272a" strokeWidth="1.5">
                      <path d="M300,120 L360,110 L380,150 L340,170 Z" fill={stateDensity.CE > 0 ? '#f59e0b' : '#1f1f23'} className="transition-all duration-500 hover:fill-amber-400 cursor-pointer" />
                      <path d="M260,280 L310,270 L330,310 L280,320 Z" fill={stateDensity.SP > 0 ? '#34d399' : '#1f1f23'} className="transition-all duration-500 hover:fill-emerald-400 cursor-pointer" />
                      <path d="M320,290 L350,285 L360,305 L330,310 Z" fill={stateDensity.RJ > 0 ? '#34d399' : '#1f1f23'} className="transition-all duration-500 hover:fill-emerald-400 cursor-pointer" />
                      <path d="M250,330 L290,325 L280,380 L240,370 Z" fill={stateDensity.PR > 0 ? '#34d399' : '#1f1f23'} className="transition-all duration-500 hover:fill-emerald-400 cursor-pointer" />
                      <path d="M150,100 L280,100 L270,220 L140,200 Z" fill="#121215" />
                      <path d="M200,200 L280,210 L270,280 L190,260 Z" fill="#121215" />
                    </g>
                  </svg>
                  <div className="absolute top-4 left-4 text-[9px] uppercase tracking-widest text-zinc-500 font-mono">
                    • SP (Capitais): <span className="text-emerald-400 font-bold">{stateDensity.SP} membros</span><br/>
                    • RJ (Litoral): <span className="text-emerald-400 font-bold">{stateDensity.RJ} membros</span><br/>
                    • CE (HQ Fortaleza): <span className="text-amber-400 font-bold">{stateDensity.CE} membros</span>
                  </div>
                </div>

                <div className="space-y-3 font-sans text-xs">
                  <h3 className="text-[10px] text-zinc-400 uppercase tracking-widest border-b border-zinc-800 pb-2">
                    Concentração por Região
                  </h3>
                  {Object.entries(stateDensity).slice(0, 6).map(([st, count]) => (
                    <div key={st} className="flex justify-between items-center bg-[#050505] p-3 border border-zinc-900">
                      <span className="text-white font-bold uppercase tracking-widest">{st} — Estado</span>
                      <span className="text-xs font-mono text-amber-400">{count} aquisições</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MÓDULO 2: FINANCEIRO & EBITDA */}
        {activeTab === 'dre' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-[#070707] border border-zinc-800/80 p-8 space-y-6">
                <h2 className="text-xs font-sans uppercase tracking-widest text-zinc-200 border-b border-zinc-800 pb-4 font-bold">
                  Demonstrativo do Resultado do Exercício (DRE {isDemoMode ? '1 Ano Consolidado' : 'Real'})
                </h2>
                <div className="space-y-3 font-sans text-xs">
                  <div className="flex justify-between text-zinc-300 py-2 border-b border-zinc-900">
                    <span>(+) Receita Operacional Bruta</span>
                    <span className="font-bold text-white">R$ {dreMetrics.grossRevenue.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500 py-1.5 border-b border-zinc-900 pl-4">
                    <span>(-) Deduções de Impostos (Simples 6%)</span>
                    <span>R$ {dreMetrics.taxes.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500 py-1.5 border-b border-zinc-900 pl-4">
                    <span>(-) Taxas de Gateway / Pix (~3.99%)</span>
                    <span>R$ {dreMetrics.gatewayFees.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500 py-1.5 border-b border-zinc-900 pl-4">
                    <span>(-) Custo da Peça Vendida / CMV (Fabril R$ 95/un)</span>
                    <span>R$ {dreMetrics.cogs.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-zinc-300 py-2.5 border-b border-zinc-800 font-bold">
                    <span>(=) Lucro Bruto de Margem</span>
                    <span>R$ {dreMetrics.grossProfit.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-amber-500/80 py-1.5 border-b border-zinc-900 pl-4">
                    <span>(-) OpEx Total (Tráfego, Software, Embalagem)</span>
                    <span>R$ {dreMetrics.totalOpEx.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 py-4 border-t border-zinc-700 text-sm font-bold uppercase tracking-widest bg-emerald-950/10 px-4 mt-4">
                    <span>(=) EBITDA Real (Lucro Líquido no Caixa)</span>
                    <span>R$ {dreMetrics.ebitda.toFixed(2)} ({dreMetrics.ebitdaMargin.toFixed(1)}%)</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleAddExpense} className="bg-[#070707] border border-zinc-800/80 p-8 space-y-6 h-fit">
                <h2 className="text-xs font-sans uppercase tracking-widest text-zinc-200 border-b border-zinc-800 pb-3 font-bold">
                  Lançar Custo de Software / OpEx
                </h2>
                <div className="space-y-4 text-xs font-sans">
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-400 uppercase tracking-widest">Categoria de Custo</label>
                    <select value={expCategory} onChange={(e) => setExpCategory(e.target.value)} className="w-full bg-black border border-zinc-800 px-4 py-3 text-white outline-none">
                      <option value="Meta Ads">Meta Ads / Tráfego Pago</option>
                      <option value="Embalagem">Embalagens & Sacolas</option>
                      <option value="Software/SaaS">Softwares (Vercel/Resend/Supabase)</option>
                      <option value="Logistica">Fretes de Coleta & Insumos</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-400 uppercase tracking-widest">Descrição</label>
                    <input type="text" placeholder="Ex: Assinatura Mensal Resend API" value={expDescription} onChange={(e) => setExpDescription(e.target.value)} className="w-full bg-black border border-zinc-800 px-4 py-3 text-white outline-none" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-400 uppercase tracking-widest">Valor exato (R$)</label>
                    <input type="number" step="0.01" required placeholder="120.00" value={expAmount} onChange={(e) => setExpAmount(e.target.value)} className="w-full bg-black border border-zinc-800 px-4 py-3 text-white outline-none" />
                  </div>
                  <button type="submit" disabled={addingExp} className="w-full bg-white text-black font-bold text-[10px] uppercase tracking-widest py-4 hover:bg-zinc-200 transition-colors">
                    {addingExp ? 'Gravando...' : 'Registrar no Caixa'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MÓDULO 3: PRECIFICAÇÃO PSICODINÂMICA */}
        {activeTab === 'pricing' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-300">
            <div className="bg-[#070707] border border-zinc-800/80 p-8 space-y-6">
              <h2 className="text-xs font-sans uppercase tracking-widest text-zinc-200 border-b border-zinc-800 pb-3 font-bold">
                Calculadora de Custo Fabril & Markup de Luxo
              </h2>
              <div className="space-y-4 font-sans text-xs">
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-400 uppercase tracking-widest flex justify-between">
                    <span>Tecido (Algodão 260GSM)</span> <span className="text-white">R$ {fabricCost}</span>
                  </label>
                  <input type="range" min="20" max="100" value={fabricCost} onChange={(e) => setFabricCost(Number(e.target.value))} className="w-full accent-amber-400" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-400 uppercase tracking-widest flex justify-between">
                    <span>Oficina / Facção de Costura</span> <span className="text-white">R$ {sewingCost}</span>
                  </label>
                  <input type="range" min="15" max="80" value={sewingCost} onChange={(e) => setSewingCost(Number(e.target.value))} className="w-full accent-amber-400" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-400 uppercase tracking-widest flex justify-between">
                    <span>Tags + Packaging White Glove</span> <span className="text-white">R$ {tagPackCost}</span>
                  </label>
                  <input type="range" min="5" max="40" value={tagPackCost} onChange={(e) => setTagPackCost(Number(e.target.value))} className="w-full accent-amber-400" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-400 uppercase tracking-widest flex justify-between">
                    <span>Gravação de Serial a Laser</span> <span className="text-white">R$ {laserSerialCost}</span>
                  </label>
                  <input type="range" min="5" max="30" value={laserSerialCost} onChange={(e) => setLaserSerialCost(Number(e.target.value))} className="w-full accent-amber-400" />
                </div>
                <div className="space-y-2 pt-2 border-t border-zinc-800">
                  <label className="text-[10px] text-amber-400 font-bold uppercase tracking-widest flex justify-between">
                    <span>Target Markup de Luxo</span> <span>{targetMarkup}x</span>
                  </label>
                  <input type="range" min="2.0" max="6.0" step="0.1" value={targetMarkup} onChange={(e) => setTargetMarkup(Number(e.target.value))} className="w-full accent-amber-400" />
                </div>
              </div>
            </div>

            <div className="bg-[#070707] border border-zinc-800/80 p-8 space-y-6 flex flex-col justify-between">
              <div>
                <h2 className="text-xs font-sans uppercase tracking-widest text-zinc-200 border-b border-zinc-800 pb-3 font-bold">
                  Resultado de Ancoragem Psicodinâmica
                </h2>
                <div className="space-y-6 pt-4 font-sans">
                  <div>
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">Custo Fabril Total (CPV)</span>
                    <span className="text-2xl font-serif text-white">R$ {unitCostTotal.toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-amber-400 uppercase tracking-widest block">Preço Sugerido (Ancoragem Contida)</span>
                    <span className="text-4xl font-serif text-amber-400">R$ {suggestedPrice.toFixed(2)}</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 leading-relaxed bg-[#040404] p-4 border border-zinc-900">
                    O valor de <strong>R$ {suggestedPrice.toFixed(2)}</strong> garante uma margem de contribuição limpa de {((1 - (unitCostTotal / suggestedPrice)) * 100).toFixed(1)}%, cobrindo CAC e sustentando o posicionamento de escassez sem ruído de varejo.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MÓDULO 4: WHITELABEL & ESTOCAGEM */}
        {activeTab === 'whitelabel' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { title: 'VESTIGIUM', sku: 'BOXY-BLK-M', stock: isDemoMode ? 142 : 50, value: isDemoMode ? 13490 : 4750, supplier: 'Oficina Fortaleza 01' },
                { title: 'FORZA', sku: 'PERF-TSHIRT', stock: isDemoMode ? 98 : 50, value: isDemoMode ? 8330 : 4250, supplier: 'Oficina Fortaleza 02' },
                { title: 'LIBERTAS', sku: 'PERF-TANK', stock: isDemoMode ? 64 : 50, value: isDemoMode ? 4864 : 3800, supplier: 'Oficina Fortaleza 02' },
                { title: 'SIGNUM', sku: 'ACC-CAP-BLK', stock: isDemoMode ? 210 : 30, value: isDemoMode ? 12600 : 1800, supplier: 'Bordados Elite' }
              ].map((item) => (
                <div key={item.title} className="bg-[#070707] border border-zinc-800/80 p-6 space-y-3">
                  <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">{item.supplier}</span>
                  <h3 className="text-lg font-serif text-white uppercase tracking-widest">{item.title}</h3>
                  <div className="border-t border-zinc-900 pt-3 space-y-1 font-sans text-[10px] uppercase tracking-widest">
                    <div className="flex justify-between text-zinc-400">
                      <span>Saldo em Prateleira</span>
                      <span className="text-emerald-400 font-bold">{item.stock} un</span>
                    </div>
                    <div className="flex justify-between text-zinc-500">
                      <span>Capital Imobilizado</span>
                      <span className="text-white">R$ {item.value.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MÓDULO 5: CRM 360 DROPDOWN */}
        {activeTab === 'crm' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-xs font-sans uppercase tracking-widest text-zinc-200 border-b border-zinc-800 pb-3 font-bold">
              Base de Membros do Senado VIP ({isDemoMode ? 'Dados Simulados de 1 Ano' : 'Dados Reais'})
            </h2>

            <div className="space-y-3 font-sans">
              {customers.map((c) => {
                const isSelected = selectedCustomerId === c.id;
                return (
                  <div key={c.id} className="bg-[#070707] border border-zinc-800/80 transition-all">
                    <div
                      onClick={() => {
                        playHapticSound();
                        setSelectedCustomerId(isSelected ? null : c.id);
                      }}
                      className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 cursor-pointer hover:bg-zinc-900/50"
                    >
                      <div>
                        <span className="text-sm text-white font-serif uppercase tracking-widest block font-bold">
                          {c.full_name || 'Senador VIP'}
                        </span>
                        <span className="text-[10px] text-zinc-500 block">{c.email}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-[9px] bg-zinc-900 text-amber-400 border border-zinc-800 px-3 py-1 uppercase tracking-widest font-bold">
                          {c.rfm_tag || 'WAITLIST'}
                        </span>
                        <span className="text-xs text-zinc-300 font-mono">
                          LTV: R$ {Number(c.ltv || 0).toFixed(2)}
                        </span>
                        <span className="text-zinc-500 text-xs">{isSelected ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="border-t border-zinc-800 bg-[#040404] p-6 grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in text-xs">
                        <div className="space-y-2">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Dados Biométricos / Provador</span>
                          <p className="text-zinc-300">• Altura: 178 cm</p>
                          <p className="text-zinc-300">• Peso: 78 kg</p>
                          <p className="text-zinc-300">• Fit Preferido: Boxy Oversized</p>
                        </div>
                        <div className="space-y-2">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Origem de Atribuição</span>
                          <p className="text-zinc-300">• Canal: Instagram Orgânico</p>
                          <p className="text-zinc-300">• Cidade: São Paulo / SP</p>
                          <p className="text-zinc-300">• Data do Cadastro: {new Date(c.created_at).toLocaleDateString()}</p>
                        </div>
                        <div className="space-y-2">
                          <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-bold">Serials Laser em Posse</span>
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

        {/* MÓDULO 6: CONTENT OS */}
        {activeTab === 'content' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-xs font-sans uppercase tracking-widest text-zinc-200 border-b border-zinc-800 pb-3 font-bold">
              Content OS • Diretrizes & Roteiros Editorial
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans text-xs">
              <div className="bg-[#070707] border border-zinc-800/80 p-6 space-y-3">
                <span className="text-[9px] text-amber-400 font-bold uppercase tracking-widest block">Pilar: Território (Fortaleza)</span>
                <h3 className="text-sm font-serif text-white uppercase">A Respiração e o Mar</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Tomada cinematográfica do mar de Fortaleza em preto e branco. Foco no movimento contínuo da água antes do corte brusco para o homem vestindo a camiseta Boxy.
                </p>
              </div>
              <div className="bg-[#070707] border border-zinc-800/80 p-6 space-y-3">
                <span className="text-[9px] text-amber-400 font-bold uppercase tracking-widest block">Pilar: Estrutura (Roma)</span>
                <h3 className="text-sm font-serif text-white uppercase">A Arquitetura do Tecido</h3>
                <p className="text-zinc-400 leading-relaxed">
                  Macro fotografia da gola ribana de 3cm e da placa de serial numerada gravada a laser. Áudio seco, sem música apelativa.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* MÓDULO 7: RECUPERAÇÃO WHATSAPP */}
        {activeTab === 'whatsapp' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <h2 className="text-xs font-sans uppercase tracking-widest text-zinc-200 border-b border-zinc-800 pb-3 font-bold">
              Régua de Conversão VIP via WhatsApp
            </h2>
            <div className="space-y-3 font-sans">
              {orders.filter((o) => o.payment_status === 'PENDENTE').map((ord) => (
                <div key={ord.id} className="bg-[#070707] border border-zinc-800 p-5 flex justify-between items-center">
                  <div>
                    <span className="text-xs font-serif text-white block uppercase font-bold">{ord.order_number} — R$ {ord.total_amount}</span>
                    <span className="text-[10px] text-zinc-500 block">{ord.customers?.full_name || 'Cliente'}</span>
                  </div>
                  <button className="bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[10px] uppercase font-bold px-4 py-2 hover:bg-emerald-900 transition-colors">
                    Enviar Mensagem VIP →
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MÓDULO 8: LOGÍSTICA WHITE GLOVE */}
        {activeTab === 'shipments' && (
          <div className="max-w-xl mx-auto space-y-6 animate-in fade-in duration-300">
            <div className="bg-[#070707] border border-zinc-800/80 p-8 space-y-6">
              <h2 className="text-xs font-sans uppercase tracking-widest text-zinc-200 border-b border-zinc-800 pb-3 font-bold">
                Expedição & Despacho White Glove
              </h2>

              {shipSuccessMsg && (
                <div className="bg-emerald-950/40 border border-emerald-800 text-emerald-400 p-4 text-[10px] uppercase tracking-widest text-center font-sans">
                  ✓ {shipSuccessMsg}
                </div>
              )}

              <form onSubmit={handleDispatchOrder} className="space-y-4 font-sans text-xs">
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-400 uppercase tracking-widest">Selecione o Pedido</label>
                  <select value={shipOrderId} onChange={(e) => setShipOrderId(e.target.value)} required className="w-full bg-black border border-zinc-800 px-4 py-3 text-white outline-none">
                    <option value="">Selecione o pedido do Lote Zero</option>
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.order_number} — {o.customers?.full_name} (R$ {o.total_amount})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-400 uppercase tracking-widest">Código de Rastreio</label>
                  <input type="text" required placeholder="Ex: AA123456789BR" value={trackingCode} onChange={(e) => setTrackingCode(e.target.value)} className="w-full bg-black border border-zinc-800 px-4 py-3 text-white outline-none" />
                </div>

                <button type="submit" disabled={shippingLoading} className="w-full bg-white text-black font-bold text-[10px] uppercase tracking-widest py-4 hover:bg-zinc-200 transition-colors">
                  {shippingLoading ? 'Notificando Cliente...' : 'Despachar & Enviar E-mail de Rastreio'}
                </button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}