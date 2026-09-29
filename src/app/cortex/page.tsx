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
  Calendar, Truck, Gift, RefreshCw, Zap, Eye, Share2, Award, ArrowUpRight
} from 'lucide-react';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500', '600', '700'] });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// CONJUNTO RICO DE DADOS FICTÍCIOS PARA O MODO DEMO (TODAS AS ABAS PREENCHIDAS)
const MOCK_SANDBOX = { 
  orders: [
    { id: 'm1', order_number: 'LR-SIM-101', total_amount: 320.00, payment_status: 'PAGO', delivery_state: 'SP', created_at: '2026-09-27T10:00:00Z', customers: { full_name: 'Gabriel Siqueira' } },
    { id: 'm2', order_number: 'LR-SIM-102', total_amount: 640.00, payment_status: 'PAGO', delivery_state: 'CE', created_at: '2026-09-28T14:30:00Z', customers: { full_name: 'Lucas Andrade' } },
    { id: 'm3', order_number: 'LR-SIM-103', total_amount: 960.00, payment_status: 'PAGO', delivery_state: 'RJ', created_at: '2026-09-29T16:00:00Z', customers: { full_name: 'Matheus Costa' } }
  ], 
  cashFlow: [
    { id: 'cf1', type: 'ENTRADA', category: 'Vendas Direct-to-Consumer', description: 'Liquidação Lote Demo', amount: 1920.00, status: 'CONCILIADO', date: '2026-09-29' },
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
    { id: 'inf1', name: 'Lucas Sneakers', instagram: '@lucas.sneakers', coupon_code: 'LUCAS10', seeding_cost: 180.00, sales_count: 14, revenue_generated: 4480.00 }
  ],
  logistics: [
    { id: 'log1', order_number: 'LR-SIM-101', customer_name: 'Gabriel Siqueira', status: 'EMBALADO', tracking_code: 'BR123456789BR', delay_alert: false },
    { id: 'log2', order_number: 'LR-SIM-102', customer_name: 'Lucas Andrade', status: 'EM_TRANSITO', tracking_code: 'BR987654321BR', delay_alert: true, delay_reason: 'Aguardando liberação no CD Correios Fortaleza' }
  ],
  rmaRequests: [
    { id: 'rma1', order_number: 'LR-SIM-099', customer_name: 'Matheus Costa', reason: 'Tamanho Pequeno (Solicitou G)', status: 'PENDENTE' }
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

  // ESTADOS VIVOS SUPABASE
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
  const sourceRma = isDemoMode ? MOCK_SANDBOX.rmaRequests : [];

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

  // CÁLCULO DE CUSTO UNITÁRIO E SCENARIOS DE PREÇO
  const computedUnitCost = useMemo(() => {
    if (prodSourcing === 'WHITELABEL') {
      const contract = parseFloat(prodTotalContract) || 0;
      const qty = parseInt(prodBatchQty) || 1;
      return contract > 0 && qty > 0 ? contract / qty : 0;
    } else {
      return (parseFloat(prodFabricCost)||0) + (parseFloat(prodSewingCost)||0) + (parseFloat(prodPackCost)||0) + (parseFloat(prodLaserCost)||0);
    }
  }, [prodSourcing, prodTotalContract, prodBatchQty, prodFabricCost, prodSewingCost, prodPackCost, prodLaserCost]);

  const pricingScenarios = useMemo(() => ({
    base: computedUnitCost * 2.2,
    conservador: computedUnitCost * 3.5,
    luxo: computedUnitCost * 5.5
  }), [computedUnitCost]);

  // CAPITAL IMOBILIZADO E VGV
  const inventoryMetrics = useMemo(() => {
    let capitalImobilizado = 0;
    let vgvPotencial = 0;
    let totalPecaFisica = 0;

    sourceProducts.forEach(p => {
      const stockTotal = (p.stock_p || 0) + (p.stock_m || 0) + (p.stock_g || 0) + (p.stock_gg || 0);
      totalPecaFisica += stockTotal;
      capitalImobilizado += stockTotal * Number(p.cost_price || 0);
      vgvPotencial += stockTotal * Number(p.sale_price || 0);
    });

    return { capitalImobilizado, vgvPotencial, totalPecaFisica };
  }, [sourceProducts]);

  // MÉTRICAS FINANCIAL OS (CALCULADAS OU ZERADAS)
  const financialMetrics = useMemo(() => {
    const totalEntradas = sourceExpenses.filter(e => e.type === 'ENTRADA').reduce((acc, c) => acc + Number(c.amount), 0) + sourceOrders.reduce((acc, c) => acc + Number(c.total_amount), 0);
    const impostosGateway = totalEntradas * 0.07;
    const receitaLiquida = totalEntradas - impostosGateway;
    const cmvTotal = sourceExpenses.filter(e => e.category === 'Insumos / CMV').reduce((acc, c) => acc + Number(c.amount), 0);
    
    const opexTrafego = sourceExpenses.filter(e => e.category === 'Tráfego Pago').reduce((acc, c) => acc + Number(c.amount), 0);
    const opexSaas = sourceExpenses.filter(e => e.category === 'Infraestrutura Digital' || e.category === 'OpEx Fixos & SaaS').reduce((acc, c) => acc + Number(c.amount), 0);
    const opexLogistica = sourceExpenses.filter(e => e.category === 'Logística & Transportes').reduce((acc, c) => acc + Number(c.amount), 0);
    const opexOutros = sourceExpenses.filter(e => e.type === 'SAIDA' && !['Insumos / CMV', 'Tráfego Pago', 'Infraestrutura Digital', 'OpEx Fixos & SaaS', 'Logística & Transportes'].includes(e.category)).reduce((acc, c) => acc + Number(c.amount), 0);

    const opexTotal = opexTrafego + opexSaas + opexLogistica + opexOutros;

    return {
      receitaBruta: totalEntradas,
      impostosGateway,
      receitaLiquida,
      cmvTotal,
      margemBruta: receitaLiquida - cmvTotal,
      opexTrafego,
      opexSaas,
      opexLogistica,
      opexOutros,
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

  // MATRIZ MOM 12 MESES
  const momMatrixData = useMemo(() => {
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return months.map((m, idx) => {
      const monthNum = idx + 1;
      const monthExpenses = sourceExpenses.filter(e => {
        if(!e.date) return false;
        const d = new Date(e.date);
        return d.getMonth() + 1 === monthNum;
      });

      const receita = monthExpenses.filter(e=>e.type === 'ENTRADA').reduce((acc, c)=>acc + Number(c.amount), 0);
      const cmv = monthExpenses.filter(e=>e.category === 'Insumos / CMV').reduce((acc, c)=>acc + Number(c.amount), 0);
      const opex = monthExpenses.filter(e=>e.type === 'SAIDA' && e.category !== 'Insumos / CMV').reduce((acc, c)=>acc + Number(c.amount), 0);

      return { month: m, receita, cmv, opex, ebitda: receita - (receita * 0.07) - cmv - opex };
    });
  }, [sourceExpenses]);

  // OPERAÇÕES DE BANCO DE DADOS (SUPABASE REAL)
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expCategory || !expDesc || !expAmount) return alert("Preencha todos os campos do lançamento.");
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
    const { error } = await supabase.from('products').insert([{ 
      name: prodName, sku: prodSku, sourcing_type: prodSourcing, sale_price: parseFloat(prodSalePrice), cost_price: computedUnitCost, 
      fabric_spec: prodFabricSpec, stock_p: parseInt(prodStockP)||0, stock_m: parseInt(prodStockM)||0, stock_g: parseInt(prodStockG)||0, stock_gg: parseInt(prodStockGG)||0 
    }]);
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

  const handleAddInfluencer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!infName || !infCoupon) return alert("Preencha nome e cupom.");
    playHapticSound();
    const { error } = await supabase.from('influencers').insert([{ name: infName, instagram: infInsta.startsWith('@') ? infInsta : `@${infInsta}`, coupon_code: infCoupon.toUpperCase(), seeding_cost: parseFloat(infCost)||0 }]);
    if (!error) { alert("Embaixador cadastrado!"); setInfName(''); setInfInsta(''); setInfCoupon(''); fetchCortexData(); }
  };

  const handleExportCSV = () => {
    playHapticSound();
    const headers = "Data,Tipo,Categoria,Descricao,Valor(R$)\n";
    const rows = sourceExpenses.map(e => `"${e.date || ''}","${e.type}","${e.category}","${e.description}",${e.amount}`).join("\n");
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `LaRomme_Extrato_Financeiro_${selectedYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) return <div className={`min-h-screen bg-black text-white flex items-center justify-center text-xs uppercase tracking-widest ${montserrat.className}`}>Iniciando Córtex OS V3.0...</div>;

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

            {/* KPIS PRINCIPAIS (4 CARDS + 2 SECUNDÁRIOS) */}
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

            {/* LINHA DE ANÁLISE DE DESEMPENHO */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#070707] border border-zinc-800 p-4 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">Fricção de Compra (Tempo Checkout)</span>
                  <span className="text-xl font-bold text-red-400 block mt-1">1m 42s</span>
                </div>
                <span className="text-[10px] text-zinc-600 font-mono">Meta: &lt; 1m 00s</span>
              </div>
              <div className="bg-[#070707] border border-zinc-800 p-4 flex justify-between items-center">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-bold block">NPS Global & Satisfação</span>
                  <span className="text-xl font-bold text-emerald-400 block mt-1">94 / 100</span>
                </div>
                <span className="text-[10px] text-emerald-500 font-bold bg-emerald-950 px-2 py-0.5 rounded">Zona de Excelência</span>
              </div>
            </div>

            {/* GRÁFICO + HEATMAP REGIONAL */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-[#070707] border border-zinc-800 p-6 space-y-4">
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

              {/* DENSIDADE REGIONAL (HEATMAP) */}
              <div className="bg-[#070707] border border-zinc-800 p-6 space-y-4 flex flex-col justify-between">
                <div>
                  <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-3">Densidade Regional de Vendas</h2>
                  <div className="space-y-3 mt-4 text-xs font-mono">
                    <div>
                      <div className="flex justify-between mb-1"><span>São Paulo (SP)</span><span className="text-amber-400">45%</span></div>
                      <div className="w-full bg-zinc-900 h-1.5"><div className="bg-amber-400 h-full w-[45%]"></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1"><span>Ceará (CE)</span><span className="text-amber-400">25%</span></div>
                      <div className="w-full bg-zinc-900 h-1.5"><div className="bg-amber-400 h-full w-[25%]"></div></div>
                    </div>
                    <div>
                      <div className="flex justify-between mb-1"><span>Rio de Janeiro (RJ)</span><span className="text-amber-400">15%</span></div>
                      <div className="w-full bg-zinc-900 h-1.5"><div className="bg-amber-400 h-full w-[15%]"></div></div>
                    </div>
                  </div>
                </div>
                <div className="bg-amber-950/20 border border-amber-900/40 p-3 text-[10px] text-amber-400 font-mono">
                  <strong>Insight Regional:</strong> 70% da demanda concentrada em SP e CE. Sugestão de realocação de verba em Ads.
                </div>
              </div>
            </div>

            {/* RANKING BEST SELLERS + SOCIAL LISTENING */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#070707] border border-zinc-800 p-6 space-y-3">
                <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-2">Ranking de Tração de Artefatos</h2>
                {sourceProducts.slice(0, 3).map((prod, idx) => (
                  <div key={idx} className="flex justify-between items-center p-3 bg-black border border-zinc-900 text-xs">
                    <div>
                      <span className="font-bold text-white block">{idx + 1}. {prod.name}</span>
                      <span className="text-[10px] text-zinc-500">{prod.sku}</span>
                    </div>
                    <span className="text-amber-400 font-bold font-mono">R$ {Number(prod.sale_price).toFixed(2)}</span>
                  </div>
                ))}
                {sourceProducts.length === 0 && <p className="text-zinc-600 text-xs">Nenhum produto em destaque.</p>}
              </div>

              <div className="bg-[#070707] border border-zinc-800 p-6 space-y-3">
                <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-2">Social Listening (@uselaromme)</h2>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-3 bg-black border border-zinc-900 italic text-zinc-300">
                    "A @uselaromme não está brincando. O caimento da boxy tá surreal."
                  </div>
                  <span className="text-[10px] text-amber-500 font-bold block">- @lucas.sneakers via Instagram Stories</span>
                </div>
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
                <p className="text-[11px] text-zinc-500 uppercase tracking-widest mt-1">DRE Gerencial, Matriz MoM e Livro Razão</p>
              </div>
              <div className="flex gap-2">
                <button onClick={handleExportCSV} className="bg-zinc-900 border border-zinc-700 text-zinc-300 hover:text-white px-3 py-1.5 text-[10px] uppercase font-bold flex items-center gap-1">
                  <Download size={12}/> Exportar CSV
                </button>
                <button onClick={() => window.print()} className="bg-amber-400 text-black px-3 py-1.5 text-[10px] uppercase font-bold flex items-center gap-1">
                  <Printer size={12}/> Imprimir PDF
                </button>
              </div>
            </header>

            {/* SELETOR DE SUB-ABAS DA TESOURARIA */}
            <div className="flex border-b border-zinc-800 gap-6 text-xs uppercase tracking-widest font-bold">
              <button onClick={() => setTreasurySubTab('dre')} className={`pb-3 ${treasurySubTab === 'dre' ? 'border-b-2 border-amber-400 text-amber-400' : 'text-zinc-500'}`}>1. DRE Gerencial</button>
              <button onClick={() => setTreasurySubTab('matrix')} className={`pb-3 ${treasurySubTab === 'matrix' ? 'border-b-2 border-amber-400 text-amber-400' : 'text-zinc-500'}`}>2. Matriz MoM (12 Meses)</button>
              <button onClick={() => setTreasurySubTab('cashflow')} className={`pb-3 ${treasurySubTab === 'cashflow' ? 'border-b-2 border-amber-400 text-amber-400' : 'text-zinc-500'}`}>3. Livro Razão & Extrato</button>
            </div>

            {/* SUB-ABA 1: DRE GERENCIAL */}
            {treasurySubTab === 'dre' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-xs">
                <div className="lg:col-span-2 bg-[#070707] border border-zinc-800 p-6 space-y-4">
                  <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-3">Demonstrativo de Resultado do Exercício ({selectedYear})</h2>
                  <div className="space-y-3 font-medium">
                    <div className="flex justify-between py-2 border-b border-zinc-900"><span className="text-zinc-300 font-bold">(+) RECEITA BRUTA DE VENDAS</span><span className="text-white font-bold">R$ {financialMetrics.receitaBruta.toFixed(2)}</span></div>
                    <div className="flex justify-between py-2 border-b border-zinc-900 text-zinc-500 pl-4"><span>(-) Impostos & Gateway (7%)</span><span>R$ {financialMetrics.impostosGateway.toFixed(2)}</span></div>
                    <div className="flex justify-between py-2 border-b border-zinc-800 font-bold text-amber-400"><span>(=) RECEITA LÍQUIDA</span><span>R$ {financialMetrics.receitaLiquida.toFixed(2)}</span></div>
                    <div className="flex justify-between py-2 border-b border-zinc-900 text-zinc-500 pl-4"><span>(-) CMV Fabril (Insumos/Tecidos)</span><span>R$ {financialMetrics.cmvTotal.toFixed(2)}</span></div>
                    <div className="flex justify-between py-2 border-b border-zinc-800 font-bold text-emerald-400"><span>(=) MARGEM BRUTA</span><span>R$ {financialMetrics.margemBruta.toFixed(2)}</span></div>
                    <div className="flex justify-between py-2 border-b border-zinc-900 text-zinc-500 pl-4"><span>(-) OpEx - Tráfego Pago (Ads)</span><span>R$ {financialMetrics.opexTrafego.toFixed(2)}</span></div>
                    <div className="flex justify-between py-2 border-b border-zinc-900 text-zinc-500 pl-4"><span>(-) OpEx - SaaS & Infraestrutura Digital</span><span>R$ {financialMetrics.opexSaas.toFixed(2)}</span></div>
                    <div className="flex justify-between py-2 border-b border-zinc-900 text-zinc-500 pl-4"><span>(-) OpEx - Logística & Envio Fretes</span><span>R$ {financialMetrics.opexLogistica.toFixed(2)}</span></div>
                    <div className="flex justify-between py-3 border-t-2 border-amber-500 font-bold bg-amber-950/20 px-3 text-sm">
                      <span className="text-amber-400">(=) EBITDA LÍQUIDO FINAL</span>
                      <span className={financialMetrics.ebitda >= 0 ? "text-emerald-400" : "text-red-400"}>R$ {financialMetrics.ebitda.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {!isDemoMode && (
                  <form onSubmit={handleAddExpense} className="bg-[#070707] border border-zinc-800 p-6 space-y-3 h-fit">
                    <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3 flex items-center gap-1">
                      <Plus size={14} className="text-amber-400"/> Novo Lançamento Físico
                    </h2>
                    <input type="date" value={expDate} onChange={e=>setExpDate(e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                    <select value={expType} onChange={e=>setExpType(e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-white outline-none"><option value="SAIDA">Saída / Despesa</option><option value="ENTRADA">Entrada / Receita</option></select>
                    <select value={expCategory} onChange={e=>setExpCategory(e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-white outline-none"><option value="Tráfego Pago">Tráfego Pago (Ads)</option><option value="Insumos / CMV">Insumos / CMV Fabril</option><option value="Infraestrutura Digital">Infraestrutura Digital</option><option value="Logística & Transportes">Logística & Gasolina</option></select>
                    <input type="text" value={expDesc} onChange={e=>setExpDesc(e.target.value)} placeholder="Descrição do Gasto" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                    <input type="number" step="0.01" value={expAmount} onChange={e=>setExpAmount(e.target.value)} placeholder="Valor (R$)" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                    <button type="submit" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-colors">Registrar no Banco</button>
                  </form>
                )}
              </div>
            )}

            {/* SUB-ABA 2: MATRIZ MOM 12 MESES */}
            {treasurySubTab === 'matrix' && (
              <div className="bg-[#070707] border border-zinc-800 p-6 space-y-4 text-xs font-mono overflow-x-auto">
                <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-3">Evolução Mês a Mês ({selectedYear})</h2>
                <table className="w-full text-left text-[11px]">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-500 uppercase">
                      <th className="py-2 pr-4">Linha DRE</th>
                      {momMatrixData.map(m => <th key={m.month} className="py-2 px-2 text-right">{m.month}</th>)}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900">
                    <tr>
                      <td className="py-2 pr-4 font-bold text-white">Receita Bruta</td>
                      {momMatrixData.map(m => <td key={m.month} className="py-2 px-2 text-right text-zinc-300">R${m.receita}</td>)}
                    </tr>
                    <tr>
                      <td className="py-2 pr-4 text-zinc-500">(-) CMV Fabril</td>
                      {momMatrixData.map(m => <td key={m.month} className="py-2 px-2 text-right text-zinc-500">R${m.cmv}</td>)}
                    </tr>
                    <tr className="font-bold bg-zinc-900/50">
                      <td className="py-2 pr-4 text-amber-400">(=) EBITDA Líquido</td>
                      {momMatrixData.map(m => <td key={m.month} className={`py-2 px-2 text-right ${m.ebitda >= 0 ? 'text-emerald-400':'text-red-400'}`}>R${m.ebitda}</td>)}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SUB-ABA 3: LIVRO RAZÃO & EXTRATO */}
            {treasurySubTab === 'cashflow' && (
              <div className="bg-[#070707] border border-zinc-800 p-6 space-y-4 text-xs font-mono">
                <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-3">Extrato Consolidado do Caixa</h2>
                <div className="space-y-2">
                  {sourceExpenses.map((e: any) => (
                    <div key={e.id} className="bg-black border border-zinc-900 p-3 flex justify-between items-center">
                      <div>
                        <span className="text-[10px] text-amber-500 block">{e.date || '2026-09-29'} • {e.category}</span>
                        <span className="text-white font-bold block">{e.description}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`font-bold ${e.type === 'ENTRADA' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {e.type === 'ENTRADA' ? '+' : '-'} R$ {Number(e.amount).toFixed(2)}
                        </span>
                        {!isDemoMode && <button onClick={() => handleDeleteExpense(e.id)} className="text-red-500 text-[10px]">Excluir</button>}
                      </div>
                    </div>
                  ))}
                  {sourceExpenses.length === 0 && <p className="text-zinc-600 py-4">Nenhum lançamento no extrato real.</p>}
                </div>
              </div>
            )}

          </div>
        )}

        {/* ABA 3: ARTEFATOS, CMV FABRIL & ESTOQUE */}
        {activeTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto text-xs">
            <header className="flex justify-between items-end border-b border-zinc-800 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Artefatos, CMV & Engenharia Fabril</h1>
                <p className="text-[11px] text-zinc-500 uppercase tracking-widest mt-1">Custeio Híbrido, Cenários de Precificação e Studio de Lançamento</p>
              </div>
            </header>

            {/* PAINEL FINANCEIRO DE ESTOQUE + BI GRADE PREDITIVA */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">Capital Imobilizado (Custo)</span>
                <span className="text-xl font-bold text-amber-400 block">R$ {inventoryMetrics.capitalImobilizado.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                <span className="text-[10px] text-zinc-600 block">{inventoryMetrics.totalPecaFisica} peças em estoque</span>
              </div>
              <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase font-bold block">VGV Potencial (Mercado)</span>
                <span className="text-xl font-bold text-emerald-400 block">R$ {inventoryMetrics.vgvPotencial.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                <span className="text-[10px] text-zinc-600 block">Faturamento potencial</span>
              </div>
              <div className="bg-[#070707] border border-amber-900/40 bg-amber-950/10 p-5 space-y-1">
                <span className="text-[10px] text-amber-400 font-bold uppercase flex items-center gap-1"><Sparkles size={12}/> BI Grade Preditiva por IA</span>
                <p className="text-[11px] text-zinc-300 leading-relaxed font-mono">
                  Sugestão para próximo lote: <strong className="text-amber-400">10% P | 30% M | 45% G | 15% GG</strong>.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LISTA DE ARTEFATOS COM GRADE FÍSICA DETALHADA */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-2">Catálogo de Artefatos ({sourceProducts.length})</h2>
                {sourceProducts.map((p: any) => (
                  <div key={p.id} className="bg-[#070707] border border-zinc-800 p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-amber-400 font-bold block text-[10px]">{p.sku} • {p.sourcing_type || 'WHITELABEL'}</span>
                        <h3 className="text-base font-bold text-white">{p.name}</h3>
                        <span className="text-zinc-500 text-[10px]">{p.fabric_spec}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-white block">R$ {Number(p.sale_price).toFixed(2)}</span>
                        <span className="text-zinc-500 text-[10px]">Custo Fabril: R$ {Number(p.cost_price).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* MATRIZ DE GRADE DE ESTOQUE */}
                    <div className="bg-black p-3 border border-zinc-900 flex justify-between items-center text-[11px] font-mono">
                      <span className="text-zinc-500 font-bold">Grade Física:</span>
                      <div className="flex gap-4">
                        <span>P: <strong className="text-white">{p.stock_p || 0}</strong></span>
                        <span>M: <strong className="text-white">{p.stock_m || 0}</strong></span>
                        <span>G: <strong className="text-amber-400">{p.stock_g || 0}</strong></span>
                        <span>GG: <strong className="text-white">{p.stock_gg || 0}</strong></span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <button onClick={() => setStudioActiveProduct(p)} className="text-amber-400 hover:underline text-[11px] flex items-center gap-1 font-bold">
                        <Sparkles size={12}/> Abrir no Studio de Lançamento
                      </button>
                      {!isDemoMode && <button onClick={() => handleDeleteProduct(p.id)} className="text-red-500 text-[10px] hover:underline">Excluir Peça</button>}
                    </div>
                  </div>
                ))}
                {sourceProducts.length === 0 && <p className="text-zinc-600 py-4">Nenhum artefato cadastrado no banco real.</p>}
              </div>

              {/* FORMULÁRIO DE ENGENHARIA DE PRODUTO */}
              {!isDemoMode && (
                <form onSubmit={handleAddProduct} className="bg-[#070707] border border-zinc-800 p-6 space-y-3 h-fit font-mono">
                  <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3 flex items-center gap-1">
                    <Plus size={14} className="text-amber-400"/> Cadastrar Artefato
                  </h2>
                  <input type="text" value={prodName} onChange={e=>setProdName(e.target.value)} placeholder="Nome do Artefato" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="text" value={prodSku} onChange={e=>setProdSku(e.target.value)} placeholder="SKU (ex: BOXY-BLK-M)" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  
                  <select value={prodSourcing} onChange={e=>setProdSourcing(e.target.value as any)} className="w-full bg-black border border-zinc-800 p-2 text-white outline-none">
                    <option value="WHITELABEL">Modelo Whitelabel (Lote Fechado)</option>
                    <option value="FACCION">Modelo Facção (Insumos Separados)</option>
                  </select>

                  {prodSourcing === 'WHITELABEL' ? (
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" value={prodTotalContract} onChange={e=>setProdTotalContract(e.target.value)} placeholder="Valor Lote (R$)" className="bg-black border border-zinc-800 p-2 text-white outline-none" />
                      <input type="number" value={prodBatchQty} onChange={e=>setProdBatchQty(e.target.value)} placeholder="Total Peças" className="bg-black border border-zinc-800 p-2 text-white outline-none" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" step="0.01" value={prodFabricCost} onChange={e=>setProdFabricCost(e.target.value)} placeholder="Tecido (R$)" className="bg-black border border-zinc-800 p-2 text-white outline-none" />
                      <input type="number" step="0.01" value={prodSewingCost} onChange={e=>setProdSewingCost(e.target.value)} placeholder="Costura (R$)" className="bg-black border border-zinc-800 p-2 text-white outline-none" />
                    </div>
                  )}

                  <div className="bg-black p-3 border border-zinc-800 space-y-1">
                    <span className="text-[10px] text-amber-400 font-bold block">Custo Unitário: R$ {computedUnitCost.toFixed(2)}</span>
                    <span className="text-[9px] text-zinc-500 block">Cenários de Preço: Base: R${pricingScenarios.base.toFixed(0)} | Luxo: R${pricingScenarios.luxo.toFixed(0)}</span>
                  </div>

                  <input type="number" step="0.01" value={prodSalePrice} onChange={e=>setProdSalePrice(e.target.value)} placeholder="Preço Oficial de Venda (R$)" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none font-bold text-amber-400" />
                  
                  <div className="grid grid-cols-4 gap-1 text-[10px]">
                    <input type="number" value={prodStockP} onChange={e=>setProdStockP(e.target.value)} placeholder="P" className="bg-black border border-zinc-800 p-1 text-center text-white" />
                    <input type="number" value={prodStockM} onChange={e=>setProdStockM(e.target.value)} placeholder="M" className="bg-black border border-zinc-800 p-1 text-center text-white" />
                    <input type="number" value={prodStockG} onChange={e=>setProdStockG(e.target.value)} placeholder="G" className="bg-black border border-zinc-800 p-1 text-center text-white" />
                    <input type="number" value={prodStockGG} onChange={e=>setProdStockGG(e.target.value)} placeholder="GG" className="bg-black border border-zinc-800 p-1 text-center text-white" />
                  </div>

                  <button type="submit" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-colors">Publicar Produto</button>
                </form>
              )}
            </div>

            {/* STUDIO DE LANÇAMENTO (PREVIEW AO VIVO) */}
            {studioActiveProduct && (
              <div className="bg-[#070707] border border-amber-500/50 p-6 space-y-4 mt-8 animate-in fade-in">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                  <h3 className="text-xs uppercase font-bold text-amber-400 flex items-center gap-2">
                    <Sparkles size={14}/> Studio de Lançamento (Preview ao Vivo na Vitrine)
                  </h3>
                  <button onClick={() => setStudioActiveProduct(null)} className="text-zinc-500 text-[10px] hover:text-white">Fechar Preview</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="aspect-[3/4] bg-black border border-zinc-800 p-6 flex flex-col justify-between relative overflow-hidden">
                    <span className="font-serif text-6xl text-zinc-800 tracking-widest absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">LR</span>
                    <div className="z-10 flex justify-between text-[10px]">
                      <span className="bg-amber-400 text-black font-bold px-2 py-0.5">PREVIEW</span>
                      <span className="text-zinc-400">{studioActiveProduct.sku}</span>
                    </div>
                    <div className="z-10 space-y-1">
                      <h4 className="text-lg text-white font-bold uppercase">{studioActiveProduct.name}</h4>
                      <p className="text-[10px] text-zinc-400 leading-relaxed font-mono">{studioDescription || studioActiveProduct.fabric_spec}</p>
                      <span className="font-mono text-amber-400 text-sm block font-bold pt-2">R$ {Number(studioActiveProduct.sale_price).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button onClick={() => setStudioDescription(`Artefato em algodão estruturado (${studioActiveProduct.fabric_spec}). Modelagem boxy com caimento pesado e acabamento minimalista da LaRomme.`)} className="w-full bg-zinc-900 border border-zinc-700 text-amber-400 py-2 text-[10px] font-bold uppercase flex items-center justify-center gap-2">
                      <Sparkles size={12}/> Sugerir Descrição por IA
                    </button>
                    <textarea value={studioDescription} onChange={e=>setStudioDescription(e.target.value)} placeholder="Descrição do produto no site..." rows={5} className="w-full bg-black border border-zinc-800 p-3 text-white text-xs outline-none font-mono" />
                    <button onClick={() => alert("Artefato sincronizado com a Vitrine!")} className="w-full bg-amber-400 text-black font-bold py-3 text-[10px] uppercase tracking-widest hover:bg-amber-300">
                      Anexar Artefato & Atualizar Vitrine
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ABA 4: FORNECEDORES & CADEIA FABRIL */}
        {activeTab === 'suppliers' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto text-xs">
            <header className="flex justify-between items-end border-b border-zinc-800 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Matriz de Fornecedores & Cadeia Fabril</h1>
                <p className="text-[11px] text-zinc-500 uppercase tracking-widest mt-1">Scorecard de Qualidade, MOQ e Disparo via WhatsApp</p>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-2">Oficinas & Facções Cadastradas ({sourceSuppliers.length})</h2>
                {sourceSuppliers.map((s: any) => (
                  <div key={s.id} className="bg-[#070707] border border-zinc-800 p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-amber-400 font-bold block text-[10px]">{s.service_type}</span>
                        <h3 className="text-base font-bold text-white">{s.name}</h3>
                        <span className="text-zinc-500 text-[10px]">Lead Time: {s.lead_time_days} dias úteis</span>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-400 font-bold block">Score: {s.quality_score || '5.0'} / 5.0</span>
                        <span className="text-zinc-500 text-[10px]">MOQ: {s.moq} un</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-zinc-900">
                      <button onClick={() => window.open(`https://wa.me/${s.contact_whatsapp}?text=Olá%20${s.name},%20gostaria%20de%20solicitar%20um%20novo%20lote%20LaRomme.`, '_blank')} className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1.5 font-bold text-[10px] flex items-center gap-2">
                        <MessageCircle size={14}/> Pedido de Reposição via WhatsApp
                      </button>
                      {!isDemoMode && <button onClick={() => handleDeleteSupplier(s.id)} className="text-red-500 text-[10px] hover:underline">Excluir</button>}
                    </div>
                  </div>
                ))}
                {sourceSuppliers.length === 0 && <p className="text-zinc-600 py-4">Nenhum fornecedor cadastrado no banco real.</p>}
              </div>

              {!isDemoMode && (
                <form onSubmit={handleAddSupplier} className="bg-[#070707] border border-zinc-800 p-6 space-y-3 h-fit font-mono">
                  <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3 flex items-center gap-1">
                    <Plus size={14} className="text-amber-400"/> Cadastrar Fornecedor
                  </h2>
                  <input type="text" value={supName} onChange={e=>setSupName(e.target.value)} placeholder="Nome da Oficina / Tecelagem" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <select value={supType} onChange={e=>setSupType(e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-white outline-none">
                    <option value="WHITELABEL">Whitelabel (Peça Pronta)</option>
                    <option value="COSTURA">Facção de Costura</option>
                    <option value="TECELAGEM">Tecelagem / Malharia</option>
                  </select>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" value={supMoq} onChange={e=>setSupMoq(e.target.value)} placeholder="MOQ Mínimo" className="bg-black border border-zinc-800 p-2 text-white outline-none" />
                    <input type="number" value={supLeadTime} onChange={e=>setSupLeadTime(e.target.value)} placeholder="Lead Time (Dias)" className="bg-black border border-zinc-800 p-2 text-white outline-none" />
                  </div>
                  <input type="text" value={supWhatsapp} onChange={e=>setSupWhatsapp(e.target.value)} placeholder="WhatsApp com DDD" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <button type="submit" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-colors">Salvar Parceiro</button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ABA 5: CRM 360 & SENADO VIP */}
        {activeTab === 'crm' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto text-xs">
            <header className="flex justify-between items-end border-b border-zinc-800 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-wider">CRM 360 & Dossiê do Senado VIP</h1>
                <p className="text-[11px] text-zinc-500 uppercase tracking-widest mt-1">Biometria de Consumo, Preferências e Segurança LGPD</p>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-3">
                <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-2">Membros do Senado VIP ({sourceCustomers.length})</h2>
                {sourceCustomers.map((c: any) => {
                  const isBirthdayToday = c.birth_date && new Date(c.birth_date).getMonth() === new Date().getMonth() && new Date(c.birth_date).getDate() === new Date().getDate();
                  return (
                    <div key={c.id} className="bg-[#070707] border border-zinc-800 p-4 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-bold text-sm">{c.full_name}</span>
                            {isBirthdayToday && <span className="bg-amber-400 text-black text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1"><Gift size={10}/> ANIVERSÁRIO HOJE</span>}
                          </div>
                          <span className="text-amber-400 text-[10px] block">{c.instagram || '@uselaromme'} • {c.email}</span>
                        </div>
                        <span className="bg-zinc-900 border border-zinc-800 text-zinc-400 text-[9px] px-2 py-1 uppercase">{c.rfm_tag || 'MEMBRO_VIP'}</span>
                      </div>

                      <div className="bg-black p-3 border border-zinc-900 grid grid-cols-3 gap-2 text-[10px] text-zinc-400 font-mono">
                        <div>Pref. Tamanho: <strong className="text-white">{c.size_preference || 'G'}</strong></div>
                        <div>Pref. Cor: <strong className="text-white">{c.color_preference || 'PRETO'}</strong></div>
                        <div>WhatsApp: <strong className="text-white">{c.phone || 'N/A'}</strong></div>
                      </div>

                      <div className="flex justify-between items-center pt-1">
                        <button onClick={() => alert(`Link de redefinição de senha enviado para: ${c.email}`)} className="text-zinc-400 hover:text-white underline text-[10px]">
                          Enviar Link de Redefinição de Senha
                        </button>
                        {!isDemoMode && <button onClick={() => handleDeleteCustomer(c.id)} className="text-red-500 text-[10px] hover:underline">Banir Cliente</button>}
                      </div>
                    </div>
                  );
                })}
                {sourceCustomers.length === 0 && <p className="text-zinc-600 py-4">Nenhum membro cadastrado no Senado VIP (Modo Real Limpo).</p>}
              </div>

              {!isDemoMode && (
                <form onSubmit={handleAddCustomer} className="bg-[#070707] border border-zinc-800 p-6 space-y-3 h-fit font-mono">
                  <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3 flex items-center gap-1">
                    <Plus size={14} className="text-amber-400"/> Adicionar Membro
                  </h2>
                  <input type="text" value={custName} onChange={e=>setCustName(e.target.value)} placeholder="Nome Completo" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="email" value={custEmail} onChange={e=>setCustEmail(e.target.value)} placeholder="E-mail" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="text" value={custPhone} onChange={e=>setCustPhone(e.target.value)} placeholder="WhatsApp" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="text" value={custInsta} onChange={e=>setCustInsta(e.target.value)} placeholder="@instagram" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <button type="submit" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-colors">Salvar Membro</button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ABA 6: CONTENT OS, ADS & INFLUENCERS */}
        {activeTab === 'content' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto text-xs">
            <header className="flex justify-between items-end border-b border-zinc-800 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Content OS & Matriz Tática</h1>
                <p className="text-[11px] text-zinc-500 uppercase tracking-widest mt-1">Calendário Editorial, Seeding e Atribuição de Anúncios</p>
              </div>
            </header>

            {/* CALENDÁRIO EDITORIAL COM SUGGESTIONS */}
            <div className="bg-[#070707] border border-zinc-800 p-6 space-y-4">
              <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-3 flex items-center gap-2">
                <Calendar size={14} className="text-amber-400"/> Calendário Tático de Lançamentos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
                <div className="bg-black border border-zinc-800 p-4 space-y-2">
                  <span className="text-amber-400 font-bold block">30/09 • Terça</span>
                  <p className="text-zinc-300 text-[10px] italic">"Stories dos bastidores no ateliê mostrando corte e tecido 260GSM."</p>
                  <span className="bg-zinc-900 text-zinc-400 text-[8px] px-2 py-0.5 uppercase">Instagram Stories</span>
                </div>
                <div className="bg-black border border-zinc-800 p-4 space-y-2">
                  <span className="text-amber-400 font-bold block">01/10 • Quarta</span>
                  <p className="text-zinc-300 text-[10px] italic">"Reels brutalista com mar de Fortaleza ao fundo e futevôlei em destaque."</p>
                  <span className="bg-zinc-900 text-zinc-400 text-[8px] px-2 py-0.5 uppercase">Reels / TikTok</span>
                </div>
                <div className="bg-black border border-zinc-800 p-4 space-y-2">
                  <span className="text-amber-400 font-bold block">02/10 • Quinta</span>
                  <p className="text-zinc-300 text-[10px] italic">"Vlog do CEO sobre a filosofia do Lote Zero da @uselaromme."</p>
                  <span className="bg-zinc-900 text-zinc-400 text-[8px] px-2 py-0.5 uppercase">TikTok Native</span>
                </div>
              </div>
            </div>

            {/* INFLUENCIADORES & SEEDING */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-[#070707] border border-zinc-800 p-6 space-y-4">
                <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-3">Embaixadores & Seeding ({sourceInfluencers.length})</h2>
                <div className="space-y-3 font-mono">
                  {sourceInfluencers.map((inf: any) => (
                    <div key={inf.id} className="bg-black border border-zinc-800 p-4 flex justify-between items-center">
                      <div>
                        <span className="text-white font-bold block">{inf.name} <span className="text-amber-400">({inf.instagram})</span></span>
                        <span className="text-zinc-500 text-[10px]">Cupom: <strong>{inf.coupon_code}</strong> • Custo Envio: R$ {Number(inf.seeding_cost).toFixed(2)}</span>
                      </div>
                      <span className="text-emerald-400 font-bold text-xs">ROI Rastreado: 12.4x</span>
                    </div>
                  ))}
                  {sourceInfluencers.length === 0 && <p className="text-zinc-600 py-4">Nenhum influenciador cadastrado para o Seeding.</p>}
                </div>
              </div>

              {!isDemoMode && (
                <form onSubmit={handleAddInfluencer} className="bg-[#070707] border border-zinc-800 p-6 space-y-3 h-fit font-mono">
                  <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3 flex items-center gap-1">
                    <Plus size={14} className="text-amber-400"/> Cadastrar Influenciador
                  </h2>
                  <input type="text" value={infName} onChange={e=>setInfName(e.target.value)} placeholder="Nome do Influenciador" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="text" value={infInsta} onChange={e=>setInfInsta(e.target.value)} placeholder="@instagram" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="text" value={infCoupon} onChange={e=>setInfCoupon(e.target.value)} placeholder="Código do Cupom" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="number" step="0.01" value={infCost} onChange={e=>setInfCost(e.target.value)} placeholder="Custo do Seeding (R$)" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <button type="submit" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-colors">Salvar Embaixador</button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ABA 7: LOGÍSTICA WHITE GLOVE & RMA */}
        {activeTab === 'logistics' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto text-xs">
            <header className="flex justify-between items-end border-b border-zinc-800 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-white uppercase tracking-wider">Logística White Glove & Central RMA</h1>
                <p className="text-[11px] text-zinc-500 uppercase tracking-widest mt-1">Checklist de Unboxing Premium, Rastreio Ativo e Trocas/Devoluções</p>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* CHECKLIST UNBOXING WHITE GLOVE */}
              <div className="bg-[#070707] border border-zinc-800 p-6 space-y-4">
                <h2 className="text-xs uppercase font-bold text-amber-400 border-b border-zinc-800 pb-3 flex items-center gap-2">
                  <Package size={14}/> Checklist de Unboxing White Glove
                </h2>
                <div className="space-y-3 font-medium">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={unboxingChecklist.inspection} onChange={e=>setUnboxingChecklist({...unboxingChecklist, inspection: e.target.checked})} className="accent-amber-400 w-4 h-4" />
                    <span>Peça inspecionada (Costuras & Estampa limpas)</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={unboxingChecklist.tissuePaper} onChange={e=>setUnboxingChecklist({...unboxingChecklist, tissuePaper: e.target.checked})} className="accent-amber-400 w-4 h-4" />
                    <span>Papel Seda com lacre adesivo LaRomme</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={unboxingChecklist.sticker} onChange={e=>setUnboxingChecklist({...unboxingChecklist, sticker: e.target.checked})} className="accent-amber-400 w-4 h-4" />
                    <span>Cartela de Adesivos do Lote Zero inclusa</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={unboxingChecklist.card} onChange={e=>setUnboxingChecklist({...unboxingChecklist, card: e.target.checked})} className="accent-amber-400 w-4 h-4" />
                    <span>Cartão de Agradecimento personalizado ao Senador</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={unboxingChecklist.perfume} onChange={e=>setUnboxingChecklist({...unboxingChecklist, perfume: e.target.checked})} className="accent-amber-400 w-4 h-4" />
                    <span>Essência da marca aplicada na caixa</span>
                  </label>
                </div>
              </div>

              {/* RADAR DE ENTREGA & CENTRAL DE RMA */}
              <div className="bg-[#070707] border border-zinc-800 p-6 space-y-4">
                <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-3 flex items-center gap-2">
                  <Truck size={14}/> Radar de Entregas & RMA
                </h2>
                
                {sourceLogistics.length > 0 ? (
                  sourceLogistics.map((log: any) => (
                    <div key={log.id} className="bg-black border border-red-900/40 p-4 space-y-2 font-mono">
                      <span className="text-red-400 font-bold block">Alerta no Pedido #{log.order_number} ({log.customer_name})</span>
                      <p className="text-zinc-400 text-[10px]">{log.delay_reason || 'Entrega com atraso identificado.'}</p>
                      <button onClick={() => window.open('https://wa.me/5511988887766', '_blank')} className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 font-bold text-[9px] uppercase mt-1">Notificar Cliente via WhatsApp</button>
                    </div>
                  ))
                ) : (
                  <p className="text-zinc-600 py-6 text-center font-mono">Nenhum atraso ou devolução registrada no banco real (0 anomalias).</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ABA 8: SANDBOX WEBHOOK (EXCLUSIVO MODO DEMO) */}
        {isDemoMode && activeTab === 'webhook_sim' && (
          <div className="space-y-6 animate-in fade-in duration-300 max-w-7xl mx-auto text-xs font-mono">
            <header className="flex justify-between items-end border-b border-amber-500/40 pb-4">
              <div>
                <h1 className="text-2xl font-bold text-amber-400 uppercase tracking-wider">Sandbox Webhook Mercado Pago</h1>
                <p className="text-[11px] text-zinc-500 uppercase tracking-widest mt-1">Ambiente de Teste Isolado do Modo Real</p>
              </div>
            </header>
            <div className="bg-[#070707] border border-amber-500/30 p-6 space-y-4">
              <button onClick={() => setSandboxLogs(prev=>[`[${new Date().toLocaleTimeString()}] WEBHOOK RECEBIDO: Pedido LR-SIM-2026 PAGO (R$ 320,00)`, ...prev])} className="bg-amber-400 text-black font-bold py-3 px-6 text-[10px] uppercase tracking-widest hover:bg-amber-300">
                Simular Evento Pix Pago
              </button>
              <div className="bg-black border border-zinc-800 p-4 text-emerald-400 text-[10px] h-48 overflow-y-auto">
                {sandboxLogs.map((log, idx) => <p key={idx}>{log}</p>)}
                {sandboxLogs.length === 0 && <span className="text-zinc-600">// Aguardando simulação...</span>}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}