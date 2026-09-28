'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { playHapticSound } from '@/lib/sound';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface OrderItem {
  id: string;
  order_number: string;
  total_amount: number;
  payment_status: string;
  delivery_state: string;
  created_at: string;
  customers?: { full_name: string; email: string; phone: string };
}

interface CashFlowItem {
  id: string;
  type: 'ENTRADA' | 'SAIDA';
  category: string;
  description: string;
  amount: number;
  status: string;
  date: string;
}

interface SupplierItem {
  id: string;
  name: string;
  type: string;
  moq: number;
  leadTime: number;
  unitCost: number;
  contact: string;
}

interface ProductItem {
  id: string;
  name: string;
  sku: string;
  price: number;
  cost: number;
  stock: number;
  fabric: string;
}

interface CustomerItem {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  rfm_tag: string;
  ltv: number;
  created_at: string;
}

interface RegionalStatItem {
  state: string;
  sales: number;
  amount: number;
  percent: number;
}

interface ReturnItem {
  id: string;
  order_number: string;
  customer: string;
  reason: string;
  status: string;
  date: string;
}

const MOCK_1_YEAR: {
  orders: OrderItem[];
  cashFlow: CashFlowItem[];
  suppliers: SupplierItem[];
  productsList: ProductItem[];
  customers: CustomerItem[];
  regionalStats: RegionalStatItem[];
  returns: ReturnItem[];
} = {
  orders: [
    { id: 'm1', order_number: 'LR-90214', total_amount: 320.00, payment_status: 'PAGO', delivery_state: 'SP', created_at: '2026-09-12T10:30:00Z', customers: { full_name: 'Gabriel Siqueira', email: 'gabriel.siqueira@gmail.com', phone: '11988887766' } },
    { id: 'm2', order_number: 'LR-90215', total_amount: 640.00, payment_status: 'PAGO', delivery_state: 'RJ', created_at: '2026-09-12T11:15:00Z', customers: { full_name: 'Lucas Arantes', email: 'lucas.arantes@hotmail.com', phone: '21997776655' } },
    { id: 'm3', order_number: 'LR-90216', total_amount: 320.00, payment_status: 'PAGO', delivery_state: 'CE', created_at: '2026-09-12T12:00:00Z', customers: { full_name: 'Renan Vasconcelos', email: 'renan.v@gmail.com', phone: '85991112233' } },
    { id: 'm4', order_number: 'LR-90217', total_amount: 280.00, payment_status: 'PAGO', delivery_state: 'MG', created_at: '2026-09-12T14:20:00Z', customers: { full_name: 'Mateus Castro', email: 'mcastro@yahoo.com.br', phone: '31984443322' } },
    { id: 'm5', order_number: 'LR-90218', total_amount: 560.00, payment_status: 'PENDENTE', delivery_state: 'PR', created_at: '2026-09-12T15:45:00Z', customers: { full_name: 'Felipe Diniz', email: 'fdiniz@outlook.com', phone: '41992221100' } },
  ],
  cashFlow: [
    { id: 'cf1', type: 'ENTRADA', category: 'Vendas Pix', description: 'Liquidação Autônoma LR-90214', amount: 320.00, status: 'CONCILIADO', date: '2026-09-12' },
    { id: 'cf2', type: 'SAIDA', category: 'Tráfego Pago', description: 'Campanha Meta Ads Lote Zero', amount: 2500.00, status: 'CONCILIADO', date: '2026-09-10' },
    { id: 'cf3', type: 'SAIDA', category: 'Facção / Costura', description: 'Adiantamento Lote 02 - Oficina Fortaleza', amount: 4800.00, status: 'CONCILIADO', date: '2026-09-08' },
    { id: 'cf4', type: 'ENTRADA', category: 'Vendas Pix', description: 'Liquidação Autônoma LR-90215', amount: 640.00, status: 'CONCILIADO', date: '2026-09-12' }
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
  ],
  regionalStats: [
    { state: 'São Paulo (SP)', sales: 1850, amount: 592000.00, percent: 40 },
    { state: 'Rio de Janeiro (RJ)', sales: 920, amount: 294400.00, percent: 20 },
    { state: 'Ceará (CE - HQ)', sales: 640, amount: 204800.00, percent: 14 },
    { state: 'Minas Gerais (MG)', sales: 480, amount: 153600.00, percent: 10 },
    { state: 'Paraná (PR)', sales: 310, amount: 99200.00, percent: 7 },
    { state: 'Rio Grande do Sul (RS)', sales: 220, amount: 70400.00, percent: 5 }
  ],
  returns: [
    { id: 'ret1', order_number: 'LR-89012', customer: 'Bruno Henrique', reason: 'Ajuste de Tamanho (M -> G)', status: 'AGUARDANDO_APROVACAO', date: '2026-09-11' },
    { id: 'ret2', order_number: 'LR-88940', customer: 'Marcelo Rossi', reason: 'Arrependimento / Reembolso', status: 'EM_INSPECAO', date: '2026-09-10' }
  ]
};

export default function CortexDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isCeo, setIsCeo] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(true);

  const [activeTab, setActiveTab] = useState<
    'cockpit' | 'treasury' | 'pricing' | 'products' | 'suppliers' | 'crm' | 'content' | 'shipments'
  >('cockpit');

  const [dbOrders, setDbOrders] = useState<OrderItem[]>([]);
  const [dbExpenses, setDbExpenses] = useState<any[]>([]);
  const [dbCustomers, setDbCustomers] = useState<CustomerItem[]>([]);

  // PRECIFICAÇÃO DINÂMICA E ESTRESSE
  const [fabricCost, setFabricCost] = useState(45);
  const [sewingCost, setSewingCost] = useState(25);
  const [tagPackCost, setTagPackCost] = useState(15);
  const [laserSerialCost, setLaserSerialCost] = useState(10);
  const [stressInflation, setStressInflation] = useState(0);

  const [selectedContentPillar, setSelectedContentPillar] = useState<'territory' | 'structure' | 'material' | 'sport'>('territory');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  useEffect(() => {
    async function initCortex() {
      const email = localStorage.getItem('lr_user_email');
      const ceoMode = localStorage.getItem('lr_ceo_mode');
      const isCEOUser = email === 'diegooliveiragn@gmail.com' || ceoMode === 'true';
      setIsCeo(isCEOUser);

      try {
        const [{ data: resOrders }, { data: resExpenses }, { data: resCustomers }] = await Promise.all([
          supabase.from('orders').select('*, customers(*)').order('created_at', { ascending: false }),
          supabase.from('expenses').select('*').order('date', { ascending: false }),
          supabase.from('customers').select('*').order('created_at', { ascending: false })
        ]);
        if (resOrders) setDbOrders(resOrders);
        if (resExpenses) setDbExpenses(resExpenses);
        if (resCustomers) setDbCustomers(resCustomers);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    initCortex();
  }, []);

  const toggleDemoMode = () => {
    playHapticSound();
    setIsDemoMode(!isDemoMode);
  };

  const rawUnitCost = fabricCost + sewingCost + tagPackCost + laserSerialCost;
  const stressedUnitCost = useMemo(() => {
    return rawUnitCost * (1 + stressInflation / 100);
  }, [rawUnitCost, stressInflation]);

  const scenarios = useMemo(() => {
    return {
      conservative: {
        markup: 2.2,
        price: Math.ceil((stressedUnitCost * 2.2) / 10) * 10,
        marginPercent: ((1 - 1 / 2.2) * 100).toFixed(1)
      },
      recommended: {
        markup: 3.2,
        price: Math.ceil((stressedUnitCost * 3.2) / 10) * 10,
        marginPercent: ((1 - 1 / 3.2) * 100).toFixed(1)
      },
      luxury: {
        markup: 4.5,
        price: Math.ceil((stressedUnitCost * 4.5) / 10) * 10,
        marginPercent: ((1 - 1 / 4.5) * 100).toFixed(1)
      }
    };
  }, [stressedUnitCost]);

  const handlePasswordReset = (customerEmail: string) => {
    playHapticSound();
    alert(`E-mail com link de redefinição de senha e credencial enviado para: ${customerEmail}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-['Montserrat',sans-serif] text-xs uppercase tracking-widest text-zinc-500">
        Iniciando Córtex OS...
      </div>
    );
  }

  // SWAP DINÂMICO ENTRE DEMO E BANCO REAL
  const activeCustomers = isDemoMode ? MOCK_1_YEAR.customers : dbCustomers;
  const activeOrders = isDemoMode ? MOCK_1_YEAR.orders : dbOrders;

  return (
    <div className="h-screen w-screen bg-[#030303] text-white font-['Montserrat',sans-serif] flex overflow-hidden">
      
      {/* SIDEBAR LATERAL FIXA */}
      <aside className="w-64 bg-[#070707] border-r border-zinc-800/80 flex flex-col justify-between shrink-0 h-full">
        <div className="p-6 space-y-6">
          <div className="space-y-1">
            <span className="font-serif text-xl tracking-[0.2em] text-white block">CÓRTEX OS</span>
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest block font-mono">Executive Suite v3.0</span>
          </div>

          <button
            onClick={toggleDemoMode}
            className={`w-full text-[9px] border px-3 py-2.5 uppercase tracking-widest font-bold transition-all text-left flex items-center justify-between ${
              isDemoMode
                ? 'bg-amber-950/80 text-amber-400 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                : 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(52,211,153,0.15)]'
            }`}
          >
            <span>{isDemoMode ? '🟡 MODO DEMO (1 ANO)' : '🟢 MODO REAL (LIVE)'}</span>
            <span className="text-xs">⇄</span>
          </button>

          {isCeo && (
            <div className="bg-amber-950/40 border border-amber-500/30 p-2.5 text-[9px] text-amber-400 uppercase tracking-widest font-bold flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>
              ♚ CEO MASTER ATIVO
            </div>
          )}

          <nav className="space-y-1 pt-4 border-t border-zinc-800/80 text-[10px] uppercase tracking-widest">
            {[
              { id: 'cockpit', label: '1. Cockpit 360° & Regiões' },
              { id: 'treasury', label: '2. Tesouraria & Conciliação' },
              { id: 'pricing', label: '3. Precificação & Estresse' },
              { id: 'products', label: '4. Cadastro de Produtos' },
              { id: 'suppliers', label: '5. Fornecedores Whitelabel' },
              { id: 'crm', label: `6. CRM 360 Dropdown (${activeCustomers.length})` },
              { id: 'content', label: '7. Content OS & Matriz' },
              { id: 'shipments', label: '8. Logística White Glove & RMA' }
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

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 h-screen overflow-y-auto p-10 bg-[#030303]">
        
        {/* MÓDULO 1: COCKPIT 360° & GRÁFICOS DE BARRA */}
        {activeTab === 'cockpit' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="text-xl font-serif text-white uppercase tracking-widest">Cockpit 360° & Vendas por Região</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Indicadores reais e gráficos de barra de penetração de mercado.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">Receita Bruta</span>
                <span className="text-2xl font-serif text-white block">{isDemoMode ? 'R$ 1.482.000,00' : 'R$ 0,00'}</span>
                <span className="text-[9px] text-emerald-400 block uppercase">EBITDA Real: 38.0%</span>
              </div>
              <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">Volume de Pedidos</span>
                <span className="text-2xl font-serif text-amber-400 block">{isDemoMode ? '4.630 peças' : '0 peças'}</span>
                <span className="text-[9px] text-zinc-500 block uppercase">Ticket Médio: R$ 320,00</span>
              </div>
              <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">Conversão Pix Autônoma</span>
                <span className="text-2xl font-serif text-white block">88.4%</span>
                <span className="text-[9px] text-emerald-400 block uppercase">Tempo médio: 3.8 min</span>
              </div>
              <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">Status dos Servidores</span>
                <span className="text-xl font-serif text-emerald-400 block">SISTEMAS ONLINE</span>
                <span className="text-[9px] text-zinc-500 block uppercase">MercadoPago • Resend • Supabase</span>
              </div>
            </div>

            {/* GRÁFICOS DE BARRA DE VENDAS POR REGIONAL */}
            <div className="bg-[#070707] border border-zinc-800 p-8 space-y-6">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <h2 className="text-xs uppercase tracking-widest text-zinc-200 font-bold">
                  Concentração de Vendas por Estado (Gráfico de Barras)
                </h2>
                <span className="text-[9px] bg-zinc-900 border border-zinc-800 text-amber-400 px-3 py-1 uppercase tracking-widest font-mono">
                  Atribuição Preditiva
                </span>
              </div>

              <div className="space-y-5">
                {MOCK_1_YEAR.regionalStats.map((item) => (
                  <div key={item.state} className="space-y-2 font-sans text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold uppercase">{item.state}</span>
                      <span className="text-amber-400 font-mono font-bold">
                        {isDemoMode ? item.sales : 0} pedidos • R$ {isDemoMode ? item.amount.toLocaleString('pt-BR') : '0,00'} ({isDemoMode ? item.percent : 0}%)
                      </span>
                    </div>
                    <div className="w-full h-3 bg-black border border-zinc-800 rounded-sm overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all duration-1000"
                        style={{ width: `${isDemoMode ? item.percent * 2.5 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MÓDULO 2: TESOURARIA & CONCILIAÇÃO BANCRÁRIA AUTÔNOMA */}
        {activeTab === 'treasury' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="text-xl font-serif text-white uppercase tracking-widest">Tesouraria, Conciliação Autônoma & Extrato</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Extração automática de liquidações Pix e lançamentos manuais de exceção.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-[#070707] border border-zinc-800 p-6 space-y-6">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                  <h2 className="text-xs uppercase tracking-widest text-zinc-200 font-bold">
                    Extrato de Movimentações de Caixa (Cash Ledger)
                  </h2>
                  <span className="text-[9px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 font-bold">
                    AUTO-CONCILIADO WEBHOOK
                  </span>
                </div>

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

              {/* FORMULÁRIO DE EXCEÇÃO MANUAL */}
              <form className="bg-[#070707] border border-zinc-800 p-6 space-y-4 font-sans text-xs h-fit">
                <h2 className="text-xs uppercase tracking-widest text-zinc-200 font-bold border-b border-zinc-800 pb-3">
                  Lançamento de Exceção Manual
                </h2>
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-400 uppercase">Tipo</label>
                  <select className="w-full bg-black border border-zinc-800 p-3 text-white outline-none">
                    <option value="SAIDA">Saída / OpEx Extra</option>
                    <option value="ENTRADA">Entrada / Receita Adicional</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-400 uppercase">Categoria</label>
                  <input type="text" placeholder="Ex: Meta Ads / Impostos / Aluguel" className="w-full bg-black border border-zinc-800 p-3 text-white outline-none" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-400 uppercase">Valor exato (R$)</label>
                  <input type="number" placeholder="500.00" className="w-full bg-black border border-zinc-800 p-3 text-white outline-none" />
                </div>
                <button type="button" className="w-full bg-white text-black font-bold py-3.5 uppercase tracking-widest text-[10px] hover:bg-zinc-200 transition-colors">
                  Registrar no Caixa
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MÓDULO 3: PRECIFICAÇÃO PSICODINÂMICA & ANÁLISE DE CRISE/ESTRESSE */}
        {activeTab === 'pricing' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="text-xl font-serif text-white uppercase tracking-widest">Precificação Psicodinâmica & Análise de Estresse</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Simulador de cenários (Conservador, Recomendado, Luxo) e teste de estresse de inflação.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="bg-[#070707] border border-zinc-800 p-6 space-y-5 font-sans text-xs">
                <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3">Custo Fabril Unitário</h2>
                
                <div className="space-y-2">
                  <label className="text-zinc-400 flex justify-between"><span>Tecido 260GSM</span> <span className="text-white font-bold">R$ {fabricCost}</span></label>
                  <input type="range" min="20" max="100" value={fabricCost} onChange={(e) => setFabricCost(Number(e.target.value))} className="w-full accent-amber-400" />
                </div>
                <div className="space-y-2">
                  <label className="text-zinc-400 flex justify-between"><span>Facção / Costura</span> <span className="text-white font-bold">R$ {sewingCost}</span></label>
                  <input type="range" min="15" max="80" value={sewingCost} onChange={(e) => setSewingCost(Number(e.target.value))} className="w-full accent-amber-400" />
                </div>
                <div className="space-y-2">
                  <label className="text-zinc-400 flex justify-between"><span>Packaging + Laser Serial</span> <span className="text-white font-bold">R$ {tagPackCost + laserSerialCost}</span></label>
                  <input type="range" min="10" max="60" value={tagPackCost + laserSerialCost} onChange={(e) => setTagPackCost(Number(e.target.value) / 2)} className="w-full accent-amber-400" />
                </div>

                <div className="pt-4 border-t border-zinc-800 space-y-2">
                  <label className="text-amber-400 font-bold uppercase flex justify-between">
                    <span>Estresse de Inflação / Insumo</span> <span className="text-amber-400">+{stressInflation}%</span>
                  </label>
                  <input type="range" min="0" max="30" value={stressInflation} onChange={(e) => setStressInflation(Number(e.target.value))} className="w-full accent-amber-400" />
                  <span className="text-[9px] text-zinc-500 block">Custo ajustado pós-estresse: R$ {stressedUnitCost.toFixed(2)}</span>
                </div>
              </div>

              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#070707] border border-zinc-800 p-6 space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] text-zinc-500 uppercase font-bold block">1. Cenário Conservador</span>
                    <span className="text-2xl font-serif text-white block mt-2">R$ {scenarios.conservative.price.toFixed(2)}</span>
                    <span className="text-[10px] text-zinc-400 block mt-1">Markup: 2.2x</span>
                  </div>
                  <div className="border-t border-zinc-900 pt-3">
                    <span className="text-[10px] text-emerald-400 block font-bold">Margem Contribuição: {scenarios.conservative.marginPercent}%</span>
                  </div>
                </div>

                <div className="bg-[#070707] border border-amber-500/50 p-6 space-y-3 flex flex-col justify-between shadow-[0_0_20px_rgba(245,158,11,0.1)]">
                  <div>
                    <span className="text-[9px] text-amber-400 uppercase font-bold block">2. Cenário Recomendado</span>
                    <span className="text-3xl font-serif text-amber-400 block mt-2">R$ {scenarios.recommended.price.toFixed(2)}</span>
                    <span className="text-[10px] text-zinc-300 block mt-1">Markup: 3.2x</span>
                  </div>
                  <div className="border-t border-zinc-900 pt-3">
                    <span className="text-[10px] text-emerald-400 block font-bold">Margem Contribuição: {scenarios.recommended.marginPercent}%</span>
                  </div>
                </div>

                <div className="bg-[#070707] border border-zinc-800 p-6 space-y-3 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] text-zinc-500 uppercase font-bold block">3. Cenário Luxo / Teto</span>
                    <span className="text-2xl font-serif text-white block mt-2">R$ {scenarios.luxury.price.toFixed(2)}</span>
                    <span className="text-[10px] text-zinc-400 block mt-1">Markup: 4.5x</span>
                  </div>
                  <div className="border-t border-zinc-900 pt-3">
                    <span className="text-[10px] text-emerald-400 block font-bold">Margem Contribuição: {scenarios.luxury.marginPercent}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MÓDULO 4: CADASTRO DE PRODUTOS */}
        {activeTab === 'products' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="text-xl font-serif text-white uppercase tracking-widest">Cadastro de Produtos & Artefatos</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Catálogo de produtos, SKUs e saldo físico.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-3 font-sans text-xs">
                {MOCK_1_YEAR.productsList.map((p) => (
                  <div key={p.id} className="bg-[#070707] border border-zinc-800 p-4 flex justify-between items-center">
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

              <form className="bg-[#070707] border border-zinc-800 p-6 space-y-3 font-sans text-xs h-fit">
                <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3">Novo Artefato</h2>
                <input type="text" placeholder="Nome da Peça" className="w-full bg-black border border-zinc-800 p-2.5 text-white outline-none" />
                <input type="text" placeholder="SKU (Ex: BOXY-BLK-M)" className="w-full bg-black border border-zinc-800 p-2.5 text-white outline-none" />
                <input type="number" placeholder="Preço (R$ 320.00)" className="w-full bg-black border border-zinc-800 p-2.5 text-white outline-none" />
                <button type="button" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest text-[10px]">Salvar Produto</button>
              </form>
            </div>
          </div>
        )}

        {/* MÓDULO 5: FORNECEDORES WHITELABEL */}
        {activeTab === 'suppliers' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="text-xl font-serif text-white uppercase tracking-widest">Cadeia de Fornecedores Whitelabel</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Lead times, MOQ e custos por fábrica.</p>
            </div>

            <div className="space-y-3 font-sans text-xs">
              {MOCK_1_YEAR.suppliers.map((s) => (
                <div key={s.id} className="bg-[#070707] border border-zinc-800 p-4 flex justify-between items-center">
                  <div>
                    <span className="text-amber-400 font-bold block">{s.name}</span>
                    <span className="text-zinc-400 text-[10px] block">{s.type} • {s.contact}</span>
                  </div>
                  <div className="text-right text-[10px] font-mono">
                    <span className="text-white block font-bold">MOQ: {s.moq} un</span>
                    <span className="text-emerald-400 block">Lead Time: {s.leadTime} dias</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* MÓDULO 6: CRM 360 DROPDOWN COM REDEFINIÇÃO DE SENHA */}
        {activeTab === 'crm' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            <div>
              <h1 className="text-xl font-serif text-white uppercase tracking-widest">CRM 360° • Membros do Senado VIP</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Gaveta dropdown completa com opção de redefinição de acesso VIP.</p>
            </div>

            <div className="space-y-3 font-sans text-xs">
              {activeCustomers.map((c) => {
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
                        <span className="bg-zinc-900 text-amber-400 border border-zinc-800 px-3 py-1 font-bold text-[9px]">{c.rfm_tag}</span>
                        <span className="font-mono text-white">LTV: R$ {Number(c.ltv || 0).toFixed(2)}</span>
                        <span>{isSelected ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="border-t border-zinc-800 bg-[#040404] p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                        <div>
                          <span className="text-zinc-500 font-bold block mb-1">Dados Biométricos</span>
                          <p className="text-zinc-300">• Altura: 178cm | Peso: 78kg</p>
                          <p className="text-zinc-300">• Caimento: Boxy Oversized</p>
                        </div>
                        <div>
                          <span className="text-zinc-500 font-bold block mb-1">Atribuição</span>
                          <p className="text-zinc-300">• Canal: Instagram Orgânico</p>
                        </div>
                        <div className="space-y-2">
                          <button
                            onClick={() => handlePasswordReset(c.email)}
                            className="bg-amber-950/80 border border-amber-500/50 text-amber-400 text-[10px] font-bold py-2.5 px-4 w-full uppercase tracking-widest hover:bg-amber-900 transition-colors"
                          >
                            Redefinir Senha / Credencial VIP
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* MÓDULO 7: CONTENT OS & MATRIZ EDITORIAL ENRIQUECIDA */}
        {activeTab === 'content' && (
          <div className="space-y-6 animate-in fade-in duration-300 font-sans text-xs">
            <div>
              <h1 className="text-xl font-serif text-white uppercase tracking-widest">Content OS & Matriz Editorial Preditiva</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Diretrizes de cena, roteiros de hook e pautas sugeridas pela telemetria.</p>
            </div>

            <div className="flex gap-2 border-b border-zinc-800 pb-3">
              {[
                { id: 'territory', label: 'Território (Fortaleza)' },
                { id: 'structure', label: 'Estrutura (Roma)' },
                { id: 'material', label: 'Materialidade (260GSM)' },
                { id: 'sport', label: 'Movimento & Esporte' }
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setSelectedContentPillar(p.id as any)}
                  className={`px-4 py-2 text-[10px] uppercase font-bold border transition-colors ${
                    selectedContentPillar === p.id ? 'border-amber-400 text-amber-400 bg-amber-950/20' : 'border-zinc-800 text-zinc-500'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#070707] border border-zinc-800 p-6 space-y-3">
                <span className="text-amber-400 font-bold uppercase block text-[10px]">Roteiro Reels #01 • Povoamento</span>
                <h3 className="text-sm font-serif text-white uppercase">A Tensão do Mar e da Pedra</h3>
                <p className="text-zinc-400 leading-relaxed">• <strong>Hook (0-3s):</strong> Tomada em PB de onda quebrando no calçadão e corte seco para o tecido 260GSM.</p>
                <p className="text-zinc-400 leading-relaxed">• <strong>Narrativa:</strong> "A força de Roma. O movimento de Fortaleza."</p>
                <span className="text-[9px] text-emerald-400 block font-mono">Sugestão Telemetria: Retenção na PDP de 78% ao exibir o vídeo da praia.</span>
              </div>

              <div className="bg-[#070707] border border-zinc-800 p-6 space-y-3">
                <span className="text-amber-400 font-bold uppercase block text-[10px]">Roteiro Reels #02 • Macro Produto</span>
                <h3 className="text-sm font-serif text-white uppercase">A Arquitetura da Gola 3cm</h3>
                <p className="text-zinc-400 leading-relaxed">• <strong>Hook (0-3s):</strong> Gravação de serial numerado gravado a laser na placa.</p>
                <p className="text-zinc-400 leading-relaxed">• <strong>Narrativa:</strong> "Cada peça gravada com código irrevogável do Lote Zero."</p>
                <span className="text-[9px] text-emerald-400 block font-mono">Sugestão Telemetria: Alta busca por detalhes do caimento no provador.</span>
              </div>
            </div>
          </div>
        )}

        {/* MÓDULO 8: LOGÍSTICA WHITE GLOVE & PIPELINE DE TROCAS (RMA) */}
        {activeTab === 'shipments' && (
          <div className="space-y-8 animate-in fade-in duration-300 font-sans text-xs">
            <div>
              <h1 className="text-xl font-serif text-white uppercase tracking-widest">Logística White Glove & Central de Trocas (RMA)</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Despacho de expedição e aprovação de logística reversa.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-[#070707] border border-zinc-800 p-6 space-y-4">
                <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3 font-bold">Expedição SEDEX</h2>
                <input type="text" placeholder="Código de Rastreio (Ex: AA123456789BR)" className="w-full bg-black border border-zinc-800 p-3 text-white outline-none" />
                <button type="button" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest">Despachar & Disparar E-mail White Glove</button>
              </div>

              <div className="bg-[#070707] border border-zinc-800 p-6 space-y-4">
                <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3 font-bold">Solicitações de Troca / Reversa (RMA)</h2>
                {MOCK_1_YEAR.returns.map((ret) => (
                  <div key={ret.id} className="bg-[#040404] border border-zinc-800 p-4 space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-bold">{ret.order_number} — {ret.customer}</span>
                      <span className="text-[9px] bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 font-bold">{ret.status}</span>
                    </div>
                    <span className="text-zinc-400 block text-[10px]">Motivo: {ret.reason}</span>
                    <div className="flex gap-2 pt-2">
                      <button onClick={playHapticSound} className="bg-emerald-950 text-emerald-400 border border-emerald-800 text-[9px] font-bold py-1 px-3 uppercase">Aprovar Troca</button>
                      <button onClick={playHapticSound} className="bg-zinc-900 text-zinc-400 border border-zinc-800 text-[9px] py-1 px-3 uppercase">Recusar</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}