'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { playHapticSound } from '@/lib/sound';
import { Montserrat } from 'next/font/google';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Users, ShoppingBag, TrendingUp, AlertTriangle, MessageSquare, Download, Printer, 
  Plus, Trash2, MessageCircle, Sparkles, Package, ShieldAlert, CheckCircle2,
  Calendar, Truck, Gift, RefreshCw, Zap
} from 'lucide-react';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// DADOS FICTÍCIOS COMPLETOS PARA O MODO DEMO
const MOCK_SANDBOX = { 
  orders: [
    { id: 'm1', order_number: 'LR-SIM-101', total_amount: 320.00, payment_status: 'PAGO', delivery_state: 'SP', created_at: '2026-09-28T10:00:00Z', customers: { full_name: 'Gabriel Siqueira' } },
    { id: 'm2', order_number: 'LR-SIM-102', total_amount: 640.00, payment_status: 'PAGO', delivery_state: 'CE', created_at: '2026-09-29T14:30:00Z', customers: { full_name: 'Lucas Andrade' } },
    { id: 'm3', order_number: 'LR-SIM-103', total_amount: 480.00, payment_status: 'PAGO', delivery_state: 'RJ', created_at: '2026-09-29T16:00:00Z', customers: { full_name: 'Matheus Costa' } }
  ], 
  cashFlow: [
    { id: 'cf1', type: 'ENTRADA', category: 'Vendas Direct-to-Consumer', description: 'Liquidação Lote Demo', amount: 1440.00, status: 'CONCILIADO', date: '2026-09-29' },
    { id: 'cf2', type: 'SAIDA', category: 'Tráfego Pago', description: 'Campanha Meta Ads Lote Zero', amount: 350.00, status: 'CONCILIADO', date: '2026-09-28' },
    { id: 'cf3', type: 'SAIDA', category: 'Insumos / CMV', description: 'Pagamento Facção Fortaleza', amount: 450.00, status: 'CONCILIADO', date: '2026-09-27' },
    { id: 'cf4', type: 'SAIDA', category: 'Infraestrutura Digital', description: 'Assinatura Vercel & Supabase', amount: 120.00, status: 'CONCILIADO', date: '2026-09-25' }
  ], 
  suppliers: [
    { id: 'sup1', name: 'Oficina Fortaleza 01', service_type: 'Facção de Costura', moq: 100, lead_time_days: 15, unit_cost: 25.00, contact_whatsapp: '85999881122', quality_score: 4.9 },
    { id: 'sup2', name: 'Malharia Sul Têxtil', service_type: 'Tecelagem 260GSM', moq: 300, lead_time_days: 20, unit_cost: 45.00, contact_whatsapp: '47991112233', quality_score: 5.0 }
  ], 
  productsList: [
    { id: 'p1', name: 'Camiseta Boxy Vestigium', sku: 'BOXY-BLK-M', sale_price: 320.00, cost_price: 95.00, stock_p: 12, stock_m: 28, stock_g: 45, stock_gg: 15, fabric_spec: '100% Algodão 260GSM', sourcing_type: 'FACCION' },
    { id: 'p2', name: 'Camiseta Heavyweight Origo', sku: 'HEAVY-OFF-L', sale_price: 350.00, cost_price: 110.00, stock_p: 5, stock_m: 18, stock_g: 30, stock_gg: 8, fabric_spec: '100% Algodão 280GSM', sourcing_type: 'WHITELABEL' }
  ], 
  customers: [
    { id: 'c1', full_name: 'Gabriel Siqueira', email: 'gabriel@laromme.com', phone: '11988887766', instagram: '@gabrielsiq', birth_date: '1998-09-29', size_preference: 'G', color_preference: 'PRETO', rfm_tag: 'SENADOR_VIP' },
    { id: 'c2', full_name: 'Lucas Andrade', email: 'lucas.andrade@gmail.com', phone: '85997776655', instagram: '@lucas.andrade', birth_date: '1995-04-12', size_preference: 'M', color_preference: 'OFFWHITE', rfm_tag: 'MEMBRO_VIP' }
  ],
  influencers: [
    { id: 'inf1', name: 'Lucas Sneakers', instagram: '@lucas.sneakers', coupon_code: 'LUCAS10', seeding_cost: 180.00 }
  ],
  logistics: [
    { id: 'log1', order_number: 'LR-SIM-101', status: 'EMBALADO', tracking_code: 'BR123456789BR', delay_alert: false },
    { id: 'log2', order_number: 'LR-SIM-102', status: 'EM_TRANSITO', tracking_code: 'BR987654321BR', delay_alert: true, delay_reason: 'Aguardando liberação no CD Correios Fortaleza' }
  ]
};

export default function CortexDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [activeTab, setActiveTab] = useState('cockpit');
  const [treasurySubTab, setTreasurySubTab] = useState<'dre' | 'matrix' | 'cashflow'>('dre');

  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // ESTADOS VIVOS SUPABASE (MODO REAL)
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [dbExpenses, setDbExpenses] = useState<any[]>([]);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbSuppliers, setDbSuppliers] = useState<any[]>([]);
  const [dbCustomers, setDbCustomers] = useState<any[]>([]);
  const [dbInfluencers, setDbInfluencers] = useState<any[]>([]);

  // FORMULÁRIOS
  const [prodName, setProdName] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodSourcing, setProdSourcing] = useState<'WHITELABEL' | 'FACCION'>('WHITELABEL');
  const [prodTotalContract, setProdTotalContract] = useState('');
  const [prodBatchQty, setProdBatchQty] = useState('');
  const [prodFabricCost, setProdFabricCost] = useState('');
  const [prodSewingCost, setProdSewingCost] = useState('');
  const [prodPackCost, setProdPackCost] = useState('');
  const [prodLaserCost, setProdLaserCost] = useState('');
  const [prodSalePrice, setProdSalePrice] = useState('');
  const [prodFabricSpec, setProdFabricSpec] = useState('100% Algodão 260GSM');
  const [prodStockP, setProdStockP] = useState('0');
  const [prodStockM, setProdStockM] = useState('0');
  const [prodStockG, setProdStockG] = useState('0');
  const [prodStockGG, setProdStockGG] = useState('0');
  const [studioDescription, setStudioDescription] = useState('');
  const [studioActiveProduct, setStudioActiveProduct] = useState<any | null>(null);

  const [supName, setSupName] = useState('');
  const [supType, setSupType] = useState('WHITELABEL');
  const [supMoq, setSupMoq] = useState('100');
  const [supLeadTime, setSupLeadTime] = useState('15');
  const [supCostUnit, setSupCostUnit] = useState('');
  const [supWhatsapp, setSupWhatsapp] = useState('');
  const [supScore, setSupScore] = useState('5.0');

  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custInsta, setCustInsta] = useState('');
  const [custBirth, setCustBirth] = useState('');
  const [custSize, setCustSize] = useState('G');
  const [custColor, setCustColor] = useState('PRETO');

  const [expType, setExpType] = useState('SAIDA');
  const [expCategory, setExpCategory] = useState('Tráfego Pago');
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expDate, setExpDate] = useState('2026-09-29');

  const [infName, setInfName] = useState('');
  const [infInsta, setInfInsta] = useState('');
  const [infCoupon, setInfCoupon] = useState('');
  const [infCost, setInfCost] = useState('');

  const [unboxingChecklist, setUnboxingChecklist] = useState({
    inspection: false, tissuePaper: false, sticker: false, card: false, perfume: false
  });

  const [sandboxLogs, setSandboxLogs] = useState<string[]>([]);

  const fetchCortexData = async () => {
    try {
      const [{ data: o }, { data: e }, { data: p }, { data: s }, { data: c }, { data: inf }] = await Promise.all([
        supabase.from('orders').select('*, customers(*)').order('created_at', { ascending: false }),
        supabase.from('expenses').select('*').order('date', { ascending: false }),
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('suppliers').select('*').order('created_at', { ascending: false }),
        supabase.from('customers').select('*').order('created_at', { ascending: false }),
        supabase.from('influencers').select('*').order('created_at', { ascending: false })
      ]);
      if(o) setDbOrders(o); if(e) setDbExpenses(e); if(p) setDbProducts(p); if(s) setDbSuppliers(s); if(c) setDbCustomers(c); if(inf) setDbInfluencers(inf);
    } catch (error) {}
  };

  useEffect(() => { fetchCortexData().then(()=>setLoading(false)); }, []);

  // SELEÇÃO RIGOROSA DA FONTE DE DADOS
  const sourceOrders = isDemoMode ? MOCK_SANDBOX.orders : dbOrders;
  const sourceCustomers = isDemoMode ? MOCK_SANDBOX.customers : dbCustomers;
  const sourceExpenses = isDemoMode ? MOCK_SANDBOX.cashFlow : dbExpenses;
  const sourceProducts = isDemoMode ? MOCK_SANDBOX.productsList : dbProducts;
  const sourceSuppliers = isDemoMode ? MOCK_SANDBOX.suppliers : dbSuppliers;
  const sourceInfluencers = isDemoMode ? MOCK_SANDBOX.influencers : dbInfluencers;
  const sourceLogistics = isDemoMode ? MOCK_SANDBOX.logistics : [];

  const navTabs = useMemo(() => {
    const tabs = [
      { id: 'cockpit', label: '1. Cockpit 360°' },
      { id: 'treasury', label: '2. Financial OS' },
      { id: 'products', label: '3. Artefatos & CMV' },
      { id: 'suppliers', label: '4. Fornecedores' },
      { id: 'crm', label: `5. CRM 360 VIP (${sourceCustomers.length})` },
      { id: 'content', label: '6. Content OS & Ads' },
      { id: 'logistics', label: '7. Logística & RMA' },
    ];
    if (isDemoMode) {
      tabs.push({ id: 'webhook_sim', label: '8. Sandbox Webhook' });
    }
    return tabs;
  }, [isDemoMode, sourceCustomers.length]);

  // MÉTRICAS FINANCEIRAS DRE (CALCULADAS OU ZERADAS)
  const financialMetrics = useMemo(() => {
    const totalEntradas = sourceExpenses.filter(e => e.type === 'ENTRADA').reduce((acc, c) => acc + Number(c.amount), 0) + sourceOrders.reduce((acc, c) => acc + Number(c.total_amount), 0);
    const impostosGateway = totalEntradas * 0.07;
    const receitaLiquida = totalEntradas - impostosGateway;
    const cmvTotal = sourceExpenses.filter(e => e.category === 'Insumos / CMV').reduce((acc, c) => acc + Number(c.amount), 0);
    const opexTotal = sourceExpenses.filter(e => e.type === 'SAIDA' && e.category !== 'Insumos / CMV').reduce((acc, c) => acc + Number(c.amount), 0);
    
    return {
      receitaBruta: totalEntradas,
      impostosGateway,
      receitaLiquida,
      cmvTotal,
      margemBruta: receitaLiquida - cmvTotal,
      opexTotal,
      ebitda: receitaLiquida - cmvTotal - opexTotal,
      ltvMedio: sourceCustomers.length > 0 ? (totalEntradas / sourceCustomers.length) : 0
    };
  }, [sourceExpenses, sourceOrders, sourceCustomers]);

  // DADOS DE TRAÇÃO PARA O GRÁFICO (RECHARTS)
  const tractionData = useMemo(() => {
    if (sourceOrders.length === 0) {
      return [
        { data: '25/Set', faturamento: 0 },
        { data: '26/Set', faturamento: 0 },
        { data: '27/Set', faturamento: 0 },
        { data: '28/Set', faturamento: 0 },
        { data: '29/Set', faturamento: 0 }
      ];
    }
    const grouped: any = {};
    sourceOrders.forEach(order => {
      const d = new Date(order.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      grouped[d] = (grouped[d] || 0) + Number(order.total_amount);
    });
    return Object.keys(grouped).map(k => ({ data: k, faturamento: grouped[k] }));
  }, [sourceOrders]);

  // OPERAÇÕES DE BANCO DE DADOS (SUPABASE REAL)
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expCategory || !expDesc || !expAmount) return alert("Preencha todos os campos.");
    playHapticSound();
    const { error } = await supabase.from('expenses').insert([{ type: expType, category: expCategory, description: expDesc, amount: parseFloat(expAmount), date: expDate, status: 'CONCILIADO' }]);
    if (!error) { alert("Lançamento efetuado!"); setExpDesc(''); setExpAmount(''); fetchCortexData(); }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Excluir lançamento financeiro?")) return;
    playHapticSound();
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (!error) fetchCortexData();
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodSku || !prodSalePrice) return alert("Preencha nome, SKU e preço.");
    playHapticSound();
    const costUnit = (parseFloat(prodFabricCost)||0) + (parseFloat(prodSewingCost)||0) + (parseFloat(prodPackCost)||0) + (parseFloat(prodLaserCost)||0);
    const { error } = await supabase.from('products').insert([{ name: prodName, sku: prodSku, sourcing_type: prodSourcing, sale_price: parseFloat(prodSalePrice), cost_price: costUnit, fabric_spec: prodFabricSpec, stock_p: parseInt(prodStockP)||0, stock_m: parseInt(prodStockM)||0, stock_g: parseInt(prodStockG)||0, stock_gg: parseInt(prodStockGG)||0 }]);
    if (!error) { alert("Artefato cadastrado!"); setProdName(''); setProdSku(''); setProdSalePrice(''); fetchCortexData(); }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Excluir produto do banco?")) return;
    playHapticSound();
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) fetchCortexData();
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custEmail) return alert("Preencha nome e e-mail.");
    playHapticSound();
    const { error } = await supabase.from('customers').insert([{ full_name: custName, email: custEmail, phone: custPhone, instagram: custInsta.startsWith('@') ? custInsta : `@${custInsta}`, birth_date: custBirth || null, size_preference: custSize, color_preference: custColor, rfm_tag: 'MEMBRO_VIP' }]);
    if (!error) { alert("Membro adicionado ao Senado VIP!"); setCustName(''); setCustEmail(''); fetchCortexData(); }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm("Banir cliente do CRM?")) return;
    playHapticSound();
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (!error) fetchCortexData();
  };

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName || !supWhatsapp) return alert("Preencha nome e WhatsApp.");
    playHapticSound();
    const { error } = await supabase.from('suppliers').insert([{ name: supName, service_type: supType, moq: parseInt(supMoq)||0, lead_time_days: parseInt(supLeadTime)||0, contact_whatsapp: supWhatsapp.replace(/\D/g, ''), quality_score: parseFloat(supScore)||5.0 }]);
    if (!error) { alert("Fornecedor cadastrado!"); setSupName(''); setSupWhatsapp(''); fetchCortexData(); }
  };

  const handleDeleteSupplier = async (id: string) => {
    if (!confirm("Remover fornecedor?")) return;
    playHapticSound();
    const { error } = await supabase.from('suppliers').delete().eq('id', id);
    if (!error) fetchCortexData();
  };

  if (loading) return <div className={`min-h-screen bg-black text-white flex items-center justify-center text-xs uppercase tracking-widest ${montserrat.className}`}>Iniciando Córtex OS...</div>;

  return (
    <div className={`h-screen w-screen bg-[#030303] text-white flex overflow-hidden ${montserrat.className}`}>
      
      {/* SIDEBAR LATERAL */}
      <aside className="w-64 bg-[#070707] border-r border-zinc-800/80 flex flex-col justify-between shrink-0 h-full p-6 print:hidden">
        <div className="space-y-6">
          <div>
            <span className="text-xl font-bold tracking-[0.2em] block text-white">CÓRTEX OS</span>
            <span className="text-[9px] text-zinc-500 uppercase tracking-widest block mt-0.5">LaRomme Executive Suite</span>
          </div>
          <button onClick={() => { playHapticSound(); setIsDemoMode(!isDemoMode); }} className={`w-full text-[10px] border px-3 py-2.5 uppercase tracking-widest font-bold transition-all text-left flex items-center justify-between ${isDemoMode ? 'bg-amber-950/80 text-amber-400 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.15)]' : 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50 shadow-[0_0_15px_rgba(52,211,153,0.15)]'}`}>
            <span>{isDemoMode ? '🟡 MODO DEMO' : '🟢 MODO REAL'}</span>
            <span className="text-xs">⇄</span>
          </button>
          <nav className="space-y-1 text-[11px] uppercase tracking-wider font-medium">
            {navTabs.map(tab => (
              <button key={tab.id} onClick={() => { playHapticSound(); setActiveTab(tab.id); }} className={`w-full text-left py-2.5 px-3 border-l-2 transition-all ${activeTab === tab.id ? 'border-amber-400 text-amber-400 font-bold bg-amber-950/10' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* ÁREA DE CONTEÚDO PRINCIPAL */}
      <main className="flex-1 h-screen overflow-y-auto p-8 bg-[#030303]">
        
        {/* ABA 1: COCKPIT 360° */}
        {activeTab === 'cockpit' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto">
            <header className="flex justify-between items-end border-b border-zinc-800 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Cockpit 360° & Radar de Operações</h1>
                <p className="text-[11px] text-zinc-500 uppercase tracking-widest mt-1">
                  {isDemoMode ? 'Exibindo Dados Fictícios de Simulação' : 'Ambiente de Produção (Dados Reais)'}
                </p>
              </div>
            </header>

            {/* KPIS PRINCIPAIS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">Receita Faturada</span>
                <span className="text-2xl font-bold text-white block">R$ {financialMetrics.receitaBruta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">Base do Senado VIP</span>
                <span className="text-2xl font-bold text-white block">{sourceCustomers.length} <span className="text-xs text-zinc-600 font-normal">membros</span></span>
              </div>
              <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">EBITDA Líquido</span>
                <span className={`text-2xl font-bold block ${financialMetrics.ebitda >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  R$ {financialMetrics.ebitda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </span>
              </div>
              <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider block">LTV Médio do Cliente</span>
                <span className="text-2xl font-bold text-amber-400 block">R$ {financialMetrics.ltvMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>

            {/* GRÁFICO DE VELOCIDADE DE CONVERSÃO */}
            <div className="bg-[#070707] border border-zinc-800 p-6 space-y-4">
              <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-3">Velocidade de Conversão (Pix Pago)</h2>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={tractionData}>
                    <defs>
                      <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                    <XAxis dataKey="data" stroke="#71717a" fontSize={11} tickLine={false} />
                    <YAxis stroke="#71717a" fontSize={11} tickLine={false} tickFormatter={(v)=>`R$${v}`} />
                    <Tooltip contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', fontSize: '12px' }} />
                    <Area type="monotone" dataKey="faturamento" stroke="#fbbf24" strokeWidth={2} fill="url(#colorPv)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* ABA 2: FINANCIAL OS */}
        {activeTab === 'treasury' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto">
            <header className="flex justify-between items-end border-b border-zinc-800 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Controladoria & Financial OS</h1>
                <p className="text-[11px] text-zinc-500 uppercase tracking-widest mt-1">DRE Gerencial e Livro Razão Auditável</p>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-xs">
              <div className="lg:col-span-2 bg-[#070707] border border-zinc-800 p-6 space-y-4">
                <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-3">Demonstrativo de Resultado (DRE)</h2>
                <div className="space-y-3 font-medium">
                  <div className="flex justify-between py-2 border-b border-zinc-900"><span className="text-zinc-300 font-bold">(+) RECEITA BRUTA DE VENDAS</span><span className="text-white font-bold">R$ {financialMetrics.receitaBruta.toFixed(2)}</span></div>
                  <div className="flex justify-between py-2 border-b border-zinc-900 text-zinc-500 pl-4"><span>(-) Impostos & Gateway (7%)</span><span>R$ {financialMetrics.impostosGateway.toFixed(2)}</span></div>
                  <div className="flex justify-between py-2 border-b border-zinc-800 font-bold text-amber-400"><span>(=) RECEITA LÍQUIDA</span><span>R$ {financialMetrics.receitaLiquida.toFixed(2)}</span></div>
                  <div className="flex justify-between py-2 border-b border-zinc-900 text-zinc-500 pl-4"><span>(-) CMV Fabril (Insumos/Tecidos)</span><span>R$ {financialMetrics.cmvTotal.toFixed(2)}</span></div>
                  <div className="flex justify-between py-2 border-b border-zinc-800 font-bold text-emerald-400"><span>(=) MARGEM BRUTA</span><span>R$ {financialMetrics.margemBruta.toFixed(2)}</span></div>
                  <div className="flex justify-between py-2 border-b border-zinc-900 text-zinc-500 pl-4"><span>(-) Despesas Operacionais (OpEx)</span><span>R$ {financialMetrics.opexTotal.toFixed(2)}</span></div>
                  <div className="flex justify-between py-3 border-t-2 border-amber-500 font-bold bg-amber-950/20 px-3 text-sm">
                    <span className="text-amber-400">(=) EBITDA LÍQUIDO</span>
                    <span className={financialMetrics.ebitda >= 0 ? "text-emerald-400" : "text-red-400"}>R$ {financialMetrics.ebitda.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {!isDemoMode && (
                <form onSubmit={handleAddExpense} className="bg-[#070707] border border-zinc-800 p-6 space-y-3 h-fit">
                  <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3">Novo Lançamento no Caixa</h2>
                  <input type="date" value={expDate} onChange={e=>setExpDate(e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <select value={expType} onChange={e=>setExpType(e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-white outline-none"><option value="SAIDA">Saída / Despesa</option><option value="ENTRADA">Entrada / Receita</option></select>
                  <select value={expCategory} onChange={e=>setExpCategory(e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-white outline-none"><option value="Tráfego Pago">Tráfego Pago</option><option value="Insumos / CMV">Insumos / CMV</option><option value="Infraestrutura Digital">Infraestrutura Digital</option></select>
                  <input type="text" value={expDesc} onChange={e=>setExpDesc(e.target.value)} placeholder="Descrição do Gasto" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="number" step="0.01" value={expAmount} onChange={e=>setExpAmount(e.target.value)} placeholder="Valor (R$)" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <button type="submit" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-colors">Registrar</button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ABA 3: ARTEFATOS & CMV */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto text-xs">
            <header className="flex justify-between items-end border-b border-zinc-800 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Artefatos, CMV & Estoque</h1>
                <p className="text-[11px] text-zinc-500 uppercase tracking-widest mt-1">Engenharia de Produto e Precificação Inteligente</p>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-2">Catálogo de Artefatos ({sourceProducts.length})</h2>
                {sourceProducts.map((p: any) => (
                  <div key={p.id} className="bg-[#070707] border border-zinc-800 p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-amber-400 font-bold block text-[10px]">{p.sku}</span>
                        <h3 className="text-base font-bold text-white">{p.name}</h3>
                        <span className="text-zinc-500 text-[10px]">{p.fabric_spec}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-white block">R$ {Number(p.sale_price).toFixed(2)}</span>
                        <span className="text-zinc-500 text-[10px]">Custo: R$ {Number(p.cost_price).toFixed(2)}</span>
                      </div>
                    </div>
                    {!isDemoMode && <button onClick={() => handleDeleteProduct(p.id)} className="text-red-500 text-[10px] hover:underline">Excluir Produto</button>}
                  </div>
                ))}
                {sourceProducts.length === 0 && <p className="text-zinc-600 py-4">Nenhum artefato cadastrado no banco real.</p>}
              </div>

              {!isDemoMode && (
                <form onSubmit={handleAddProduct} className="bg-[#070707] border border-zinc-800 p-6 space-y-3 h-fit">
                  <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3">Cadastrar Novo Artefato</h2>
                  <input type="text" value={prodName} onChange={e=>setProdName(e.target.value)} placeholder="Nome do Artefato" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="text" value={prodSku} onChange={e=>setProdSku(e.target.value)} placeholder="SKU Único" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="number" step="0.01" value={prodSalePrice} onChange={e=>setProdSalePrice(e.target.value)} placeholder="Preço de Venda (R$)" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <button type="submit" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest text-[10px]">Salvar Produto</button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ABA 4: FORNECEDORES */}
        {activeTab === 'suppliers' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto text-xs">
            <header className="flex justify-between items-end border-b border-zinc-800 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Matriz de Fornecedores</h1>
                <p className="text-[11px] text-zinc-500 uppercase tracking-widest mt-1">Gestão de Oficinas, Prazos e MOQ</p>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-3">
                {sourceSuppliers.map((s: any) => (
                  <div key={s.id} className="bg-[#070707] border border-zinc-800 p-5 flex justify-between items-center">
                    <div>
                      <span className="text-amber-400 font-bold block">{s.name}</span>
                      <span className="text-zinc-500 text-[10px]">{s.service_type} • Lead Time: {s.lead_time_days} dias</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <button onClick={() => window.open(`https://wa.me/${s.contact_whatsapp}`, '_blank')} className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 font-bold text-[10px]">WhatsApp</button>
                      {!isDemoMode && <button onClick={() => handleDeleteSupplier(s.id)} className="text-red-500 text-[10px] hover:underline">Excluir</button>}
                    </div>
                  </div>
                ))}
                {sourceSuppliers.length === 0 && <p className="text-zinc-600 py-4">Nenhum fornecedor cadastrado no banco real.</p>}
              </div>

              {!isDemoMode && (
                <form onSubmit={handleAddSupplier} className="bg-[#070707] border border-zinc-800 p-6 space-y-3 h-fit">
                  <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3">Novo Fornecedor</h2>
                  <input type="text" value={supName} onChange={e=>setSupName(e.target.value)} placeholder="Nome da Oficina" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="text" value={supWhatsapp} onChange={e=>setSupWhatsapp(e.target.value)} placeholder="WhatsApp com DDD" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <button type="submit" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest text-[10px]">Salvar Parceiro</button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ABA 5: CRM 360 */}
        {activeTab === 'crm' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto text-xs">
            <header className="flex justify-between items-end border-b border-zinc-800 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-wider">CRM 360 & Senado VIP</h1>
                <p className="text-[11px] text-zinc-500 uppercase tracking-widest mt-1">Dossiê de Clientes e Preferências de Consumo</p>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-3">
                {sourceCustomers.map((c: any) => (
                  <div key={c.id} className="bg-[#070707] border border-zinc-800 p-5 space-y-2">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="text-white font-bold block">{c.full_name} <span className="text-amber-400 font-normal">({c.instagram})</span></span>
                        <span className="text-zinc-500 text-[10px]">{c.email} • {c.phone}</span>
                      </div>
                      <span className="bg-zinc-900 border border-zinc-800 px-2 py-1 text-[9px] text-zinc-400">{c.rfm_tag || 'MEMBRO_VIP'}</span>
                    </div>
                    {!isDemoMode && <button onClick={() => handleDeleteCustomer(c.id)} className="text-red-500 text-[10px] hover:underline">Banir Cliente</button>}
                  </div>
                ))}
                {sourceCustomers.length === 0 && <p className="text-zinc-600 py-4">Nenhum membro cadastrado no Senado VIP (Modo Real Limpo).</p>}
              </div>

              {!isDemoMode && (
                <form onSubmit={handleAddCustomer} className="bg-[#070707] border border-zinc-800 p-6 space-y-3 h-fit">
                  <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3">Novo Membro</h2>
                  <input type="text" value={custName} onChange={e=>setCustName(e.target.value)} placeholder="Nome Completo" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="email" value={custEmail} onChange={e=>setCustEmail(e.target.value)} placeholder="E-mail" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <button type="submit" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest text-[10px]">Cadastrar</button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ABA 6: CONTENT OS */}
        {activeTab === 'content' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto text-xs">
            <header className="flex justify-between items-end border-b border-zinc-800 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Content OS & Marketing</h1>
                <p className="text-[11px] text-zinc-500 uppercase tracking-widest mt-1">Calendário Editorial e Seeding de Influenciadores</p>
              </div>
            </header>

            <div className="bg-[#070707] border border-zinc-800 p-6 space-y-4">
              <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-3">Embaixadores Cadastrados ({sourceInfluencers.length})</h2>
              {sourceInfluencers.map((inf: any) => (
                <div key={inf.id} className="bg-[#040404] border border-zinc-800 p-4 flex justify-between items-center">
                  <div>
                    <span className="text-white font-bold block">{inf.name} <span className="text-amber-400">({inf.instagram})</span></span>
                    <span className="text-zinc-500 text-[10px]">Cupom: {inf.coupon_code}</span>
                  </div>
                </div>
              ))}
              {sourceInfluencers.length === 0 && <p className="text-zinc-600 py-4">Nenhum influenciador cadastrado na base real.</p>}
            </div>
          </div>
        )}

        {/* ABA 7: LOGÍSTICA & RMA (ESTRUTURA VIVA SEM DUMMY HARDCODED NO LIVE) */}
        {activeTab === 'logistics' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto text-xs">
            <header className="flex justify-between items-end border-b border-zinc-800 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Logística White Glove & RMA</h1>
                <p className="text-[11px] text-zinc-500 uppercase tracking-widest mt-1">Checklist de Unboxing e Rastreio Ativo</p>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#070707] border border-zinc-800 p-6 space-y-4">
                <h2 className="text-xs uppercase font-bold text-amber-400 border-b border-zinc-800 pb-3 flex items-center gap-2">
                  <Package size={14}/> Checklist de Unboxing White Glove
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={unboxingChecklist.inspection} onChange={e=>setUnboxingChecklist({...unboxingChecklist, inspection: e.target.checked})} className="accent-amber-400 w-4 h-4" />
                    <span>Peça inspecionada (Costuras & Estampa)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={unboxingChecklist.tissuePaper} onChange={e=>setUnboxingChecklist({...unboxingChecklist, tissuePaper: e.target.checked})} className="accent-amber-400 w-4 h-4" />
                    <span>Papel Seda com lacre adesivo LaRomme</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={unboxingChecklist.perfume} onChange={e=>setUnboxingChecklist({...unboxingChecklist, perfume: e.target.checked})} className="accent-amber-400 w-4 h-4" />
                    <span>Essência da marca aplicada na caixa</span>
                  </label>
                </div>
              </div>

              <div className="bg-[#070707] border border-zinc-800 p-6 space-y-4">
                <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-3 flex items-center gap-2">
                  <Truck size={14}/> Radar de Entregas & Alertas de Atraso
                </h2>
                
                {sourceLogistics.length > 0 ? (
                  sourceLogistics.map((log: any) => (
                    <div key={log.id} className="bg-[#040404] border border-red-900/40 p-4 space-y-2">
                      <span className="text-red-400 font-bold block">Alerta de Atraso no Pedido #{log.order_number}</span>
                      <p className="text-zinc-400 text-[10px]">{log.delay_reason}</p>
                      <button onClick={() => window.open('https://wa.me/5511988887766', '_blank')} className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 font-bold text-[9px] uppercase mt-2">Notificar Cliente</button>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-600 py-8 text-center">Nenhuma anomalia de entrega registrada no banco real (0 atrasos).</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ABA 8: SANDBOX */}
        {isDemoMode && activeTab === 'webhook_sim' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto text-xs">
            <header className="flex justify-between items-end border-b border-amber-500/40 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-amber-400 uppercase tracking-wider">Sandbox Webhook Mercado Pago</h1>
                <p className="text-[11px] text-zinc-500 uppercase tracking-widest mt-1">Ambiente de Testes Isolado</p>
              </div>
            </header>
            <div className="bg-[#070707] border border-amber-500/30 p-6 font-mono text-amber-400">
              Modo Sandbox ativo. Simulação de requisições de pagamento sem impacto no banco oficial.
            </div>
          </div>
        )}

      </main>
    </div>
  );
}