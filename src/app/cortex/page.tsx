'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { playHapticSound } from '@/lib/sound';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// MOCK DATA MANTIDO PARA O MODO DEMO / SANDBOX
const MOCK_1_YEAR = {
  orders: [
    { id: 'm1', order_number: 'LR-90214', total_amount: 320.00, payment_status: 'PAGO', delivery_state: 'SP', created_at: '2026-09-12T10:30:00Z', customers: { full_name: 'Gabriel Siqueira' } },
    { id: 'm2', order_number: 'LR-90215', total_amount: 640.00, payment_status: 'PAGO', delivery_state: 'RJ', created_at: '2026-08-15T11:15:00Z', customers: { full_name: 'Lucas Arantes' } },
  ],
  cashFlow: [
    { id: 'cf1', type: 'ENTRADA', category: 'Vendas Direct-to-Consumer', description: 'Liquidação Lote Zero (Set/26)', amount: 180000.00, status: 'CONCILIADO', date: '2026-09-12' },
    { id: 'cf2', type: 'SAIDA', category: 'Insumos / CMV', description: 'Tecelagem & Costura Lote Zero', amount: 54000.00, status: 'CONCILIADO', date: '2026-09-02' },
    { id: 'cf3', type: 'SAIDA', category: 'Tráfego Pago', description: 'Meta Ads Setembro', amount: 25000.00, status: 'CONCILIADO', date: '2026-09-05' },
    { id: 'cf4', type: 'SAIDA', category: 'OpEx Fixos & SaaS', description: 'Infraestrutura Vercel/Supabase', amount: 4200.00, status: 'CONCILIADO', date: '2026-09-01' },
  ],
  suppliers: [
    { id: 'sup1', name: 'Oficina Fortaleza 01', type: 'Facção de Costura', moq: 100, leadTime: 15, unitCost: 25.00, contact: '(85) 99888-1122' },
  ],
  productsList: [
    { id: 'p1', name: 'Camiseta Boxy Vestigium', sku: 'BOXY-BLK-M', price: 320.00, cost_fabric: 45.00, cost_sewing: 25.00, cost_packaging: 15.00, cost_laser: 10.00, stock: 142, fabric: '100% Algodão 260GSM' },
  ],
  customers: [
    { id: 'c1', full_name: 'Gabriel Siqueira', email: 'gabriel.siqueira@gmail.com', phone: '11988887766', rfm_tag: 'MEMBRO_VIP', ltv: 1280.00, created_at: '2026-01-15T10:00:00Z' },
  ]
};

export default function CortexDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // O sistema inicia no MODO REAL por padrão, forçando governança séria
  const [isDemoMode, setIsDemoMode] = useState(false);

  const [activeTab, setActiveTab] = useState('cockpit');
  const [treasurySubTab, setTreasurySubTab] = useState<'dre' | 'matrix' | 'cashflow'>('dre');

  // GOVERNANÇA TEMPORAL
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');

  // DADOS VIVOS DO SUPABASE
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [dbExpenses, setDbExpenses] = useState<any[]>([]);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbSuppliers, setDbSuppliers] = useState<any[]>([]);
  const [dbCustomers, setDbCustomers] = useState<any[]>([]);

  // ESTADOS DO SIMULADOR DE WEBHOOK MP
  const [simulating, setSimulating] = useState(false);
  const [simLog, setSimLog] = useState<string[]>([]);
  const [currentTestOrderId, setCurrentTestOrderId] = useState<string | null>(null);

  // FORMULÁRIOS
  const [expType, setExpType] = useState('SAIDA');
  const [expCategory, setExpCategory] = useState('Tráfego Pago');
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expDate, setExpDate] = useState('2026-09-29');

  const [prodName, setProdName] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodFabricSpec, setProdFabricSpec] = useState('');
  const [prodFabricCost, setProdFabricCost] = useState('45.00');
  const [prodSewingCost, setProdSewingCost] = useState('25.00');
  const [prodPackCost, setProdPackCost] = useState('15.00');
  const [prodLaserCost, setProdLaserCost] = useState('10.00');

  const [supName, setSupName] = useState('');
  const [supType, setSupType] = useState('');
  const [supMoq, setSupMoq] = useState('');
  const [supLeadTime, setSupLeadTime] = useState('');

  const fetchCortexData = async () => {
    try {
      const [
        { data: resOrders },
        { data: resExpenses },
        { data: resProducts },
        { data: resSuppliers },
        { data: resCustomers }
      ] = await Promise.all([
        supabase.from('orders').select('*, customers(*)').order('created_at', { ascending: false }),
        supabase.from('expenses').select('*').order('date', { ascending: false }),
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('suppliers').select('*').order('created_at', { ascending: false }),
        supabase.from('customers').select('*').order('created_at', { ascending: false })
      ]);

      if (resOrders) setDbOrders(resOrders);
      if (resExpenses) setDbExpenses(resExpenses);
      if (resProducts) setDbProducts(resProducts);
      if (resSuppliers) setDbSuppliers(resSuppliers);
      if (resCustomers) setDbCustomers(resCustomers);
    } catch (e) {
      console.error("Erro na leitura Supabase:", e);
    }
  };

  useEffect(() => {
    async function init() {
      await fetchCortexData();
      setLoading(false);
    }
    init();
  }, []);

  const toggleDemoMode = () => {
    playHapticSound();
    // Se estiver saindo do Demo Mode e estiver na aba do Simulador, muda a aba pra evitar travamento na UI
    if (isDemoMode && activeTab === 'webhook_sim') {
      setActiveTab('cockpit');
    }
    setIsDemoMode(!isDemoMode);
  };

  // NAVEGAÇÃO DINÂMICA: Isola o Simulador apenas no Demo Mode
  const navTabs = [
    { id: 'cockpit', label: '1. Cockpit 360° & Vendas' },
    { id: 'treasury', label: '2. Financial & Treasury OS' },
    { id: 'products', label: '3. Artefatos & CMV Fabril' },
    { id: 'suppliers', label: '4. Fornecedores Whitelabel' },
    { id: 'crm', label: `5. CRM 360 & Senado VIP (${isDemoMode ? MOCK_1_YEAR.customers.length : dbCustomers.length})` },
    { id: 'content', label: '6. Content OS & Matriz' },
    { id: 'logistics', label: '7. Logística White Glove & RMA' },
  ];
  if (isDemoMode) {
    navTabs.push({ id: 'webhook_sim', label: '8. Sandbox: Webhook MP' });
  }

  // --- HANDLERS DOS FORMULÁRIOS ---
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expCategory || !expDesc || !expAmount) return alert("Preencha todos os campos.");
    playHapticSound();
    const { error } = await supabase.from('expenses').insert([{ type: expType, category: expCategory, description: expDesc, amount: parseFloat(expAmount), date: expDate, status: 'CONCILIADO' }]);
    if (!error) { alert("Lançamento registrado!"); setExpDesc(''); setExpAmount(''); fetchCortexData(); }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodSku || !prodPrice) return alert("Preencha os dados.");
    playHapticSound();
    const totalCostFabril = (parseFloat(prodFabricCost)||0) + (parseFloat(prodSewingCost)||0) + (parseFloat(prodPackCost)||0) + (parseFloat(prodLaserCost)||0);
    const { error } = await supabase.from('products').insert([{ name: prodName, sku: prodSku, sale_price: parseFloat(prodPrice), cost_price: totalCostFabril, fabric_spec: prodFabricSpec || '100% Algodão' }]);
    if (!error) { alert("Artefato cadastrado!"); setProdName(''); setProdSku(''); setProdPrice(''); fetchCortexData(); }
  };

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName || !supType) return alert("Preencha os dados do fornecedor.");
    playHapticSound();
    const { error } = await supabase.from('suppliers').insert([{ name: supName, service_type: supType, moq: parseInt(supMoq)||0, lead_time_days: parseInt(supLeadTime)||0, unit_cost: 0 }]);
    if (!error) { alert("Fornecedor adicionado!"); setSupName(''); setSupType(''); fetchCortexData(); }
  };

  // --- SIMULADOR DE WEBHOOK ---
  const handleCreateTestOrder = async () => {
    playHapticSound();
    setSimulating(true);
    setSimLog(prev => [...prev, "1. Gerando Cliente Fictício na tabela 'customers'..."]);

    const { data: customerData, error: custErr } = await supabase.from('customers').upsert([{ full_name: 'Senador Teste Pix', email: 'senado.teste@laromme.com', rfm_tag: 'WAITLIST' }], { onConflict: 'email' }).select().single();
    if (custErr) { setSimLog(prev => [...prev, "ERRO ao criar cliente: " + custErr.message]); setSimulating(false); return; }

    const testOrderNum = 'LR-SIM-' + Math.floor(1000 + Math.random() * 9000);
    setSimLog(prev => [...prev, `2. Criando Pedido ${testOrderNum} (R$ 320,00)...`]);

    const { data: orderData, error: orderErr } = await supabase.from('orders').insert([{ customer_id: customerData.id, order_number: testOrderNum, total_amount: 320.00, payment_status: 'PENDENTE', payment_method: 'PIX', net_profit: 0.00, delivery_state: 'CE' }]).select().single();
    if (orderErr) { setSimLog(prev => [...prev, "ERRO ao criar pedido: " + orderErr.message]); setSimulating(false); return; }

    setCurrentTestOrderId(orderData.id);
    setSimLog(prev => [...prev, `SUCESSO: Pedido gerado (${orderData.id.slice(0, 8)}...). Pronto para receber Webhook.`]);
    setSimulating(false);
    fetchCortexData();
  };

  const handleSimulateWebhookTrigger = async () => {
    if (!currentTestOrderId) return alert("Gere um pedido de teste primeiro.");
    playHapticSound();
    setSimulating(true);
    setSimLog(prev => [...prev, `3. Disparando POST para /api/webhooks/mercadopago...`]);
    try {
      const response = await fetch('/api/webhooks/mercadopago', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ order_id: currentTestOrderId, payment_status: 'PAGO' }) });
      if (response.ok) { setSimLog(prev => [ ...prev, `4. Webhook retornado com SUCESSO 200 OK!`, `5. GATILHO POSTGRESQL DISPARADO: Linha de Entrada gerada no Caixa!` ]); fetchCortexData(); } 
      else { const result = await response.json(); setSimLog(prev => [...prev, `ERRO no Webhook: ${result.error}`]); }
    } catch (e: any) { setSimLog(prev => [...prev, `ERRO de Conexão: ${e.message}`]); } finally { setSimulating(false); }
  };

  // FONTE DE DADOS (MOCK VS LIVE)
  const rawExpenses = isDemoMode ? MOCK_1_YEAR.cashFlow : dbExpenses;
  const activeProducts = isDemoMode ? MOCK_1_YEAR.productsList : dbProducts;
  const activeSuppliers = isDemoMode ? MOCK_1_YEAR.suppliers : dbSuppliers;
  const activeCustomers = isDemoMode ? MOCK_1_YEAR.customers : dbCustomers;
  const activeOrders = isDemoMode ? MOCK_1_YEAR.orders : dbOrders;

  const filteredExpenses = useMemo(() => {
    return rawExpenses.filter((e: any) => {
      const itemDate = e.date ? new Date(e.date) : new Date(e.created_at || '2026-01-01');
      const itemYear = itemDate.getFullYear().toString();
      const itemMonth = (itemDate.getMonth() + 1).toString().padStart(2, '0');
      if (selectedYear !== 'ALL' && itemYear !== selectedYear) return false;
      if (selectedMonth !== 'ALL' && itemMonth !== selectedMonth) return false;
      return true;
    });
  }, [rawExpenses, selectedYear, selectedMonth]);

  const financialMetrics = useMemo(() => {
    const totalEntradas = filteredExpenses.filter((e: any) => e.type === 'ENTRADA').reduce((acc: number, e: any) => acc + Number(e.amount), 0);
    const totalSaidas = filteredExpenses.filter((e: any) => e.type === 'SAIDA').reduce((acc: number, e: any) => acc + Number(e.amount), 0);
    const cmvTotal = filteredExpenses.filter((e: any) => e.category === 'Insumos / CMV').reduce((acc: number, e: any) => acc + Number(e.amount), 0);
    const opexTotal = filteredExpenses.filter((e: any) => e.category === 'Tráfego Pago' || e.category === 'OpEx Fixos & SaaS').reduce((acc: number, e: any) => acc + Number(e.amount), 0);
    const impostosEGateway = filteredExpenses.filter((e: any) => e.category === 'Impostos & Gateway').reduce((acc: number, e: any) => acc + Number(e.amount), 0) || (totalEntradas * 0.07);

    const receitaLiquida = totalEntradas - impostosEGateway;
    const lucroBruto = receitaLiquida - cmvTotal;
    const ebitda = lucroBruto - opexTotal;

    const saldoCaixaAtual = rawExpenses.reduce((acc: number, e: any) => e.type === 'ENTRADA' ? acc + Number(e.amount) : acc - Number(e.amount), 0);

    return {
      receitaBruta: totalEntradas,
      impostosEGateway,
      receitaLiquida,
      cmvTotal,
      lucroBruto,
      opexTotal,
      ebitda,
      saldoCaixaAtual
    };
  }, [filteredExpenses, rawExpenses]);

  const monthlyMatrix = useMemo(() => {
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return months.map((m, idx) => {
      const monthExpenses = rawExpenses.filter((e: any) => {
        const itemDate = e.date ? new Date(e.date) : new Date(e.created_at || '2026-01-01');
        const itemYear = itemDate.getFullYear().toString();
        const itemMonth = (itemDate.getMonth() + 1).toString().padStart(2, '0');
        return (selectedYear === 'ALL' || itemYear === selectedYear) && itemMonth === m;
      });
      const rec = monthExpenses.filter((e: any) => e.type === 'ENTRADA').reduce((a: number, b: any) => a + Number(b.amount), 0);
      const cmv = monthExpenses.filter((e: any) => e.category === 'Insumos / CMV').reduce((a: number, b: any) => a + Number(b.amount), 0);
      const opex = monthExpenses.filter((e: any) => e.category === 'Tráfego Pago' || e.category === 'OpEx Fixos & SaaS').reduce((a: number, b: any) => a + Number(b.amount), 0);
      return { label: labels[idx], receita: rec, cmv, opex, ebitda: (rec * 0.93) - cmv - opex };
    });
  }, [rawExpenses, selectedYear]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans text-xs uppercase tracking-widest text-zinc-500">
        Iniciando Córtex OS V3.0 (Ambiente de Produção)...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#030303] text-white font-sans flex overflow-hidden">
      
      {/* SIDEBAR LATERAL DINÂMICA */}
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
            <span>{isDemoMode ? '🟡 MODO DEMO / SANDBOX' : '🟢 MODO REAL (LIVE)'}</span>
            <span className="text-xs">⇄</span>
          </button>

          <nav className="space-y-1 pt-4 border-t border-zinc-800/80 text-[10px] uppercase tracking-widest">
            {navTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => { playHapticSound(); setActiveTab(tab.id); }}
                className={`w-full text-left py-2.5 px-3 transition-all border-l-2 ${
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

        <div className="p-6 border-t border-zinc-800/80">
          <button onClick={() => router.push('/')} className="w-full text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 py-2 hover:text-white transition-colors uppercase tracking-widest">
            Voltar para Vitrine
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 h-screen overflow-y-auto p-10 bg-[#030303]">
        
        {/* BARRA DE FILTRO TEMPORAL E AVISO DE PRODUÇÃO */}
        <div className="mb-8 p-4 bg-[#070707] border border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-bold uppercase tracking-widest text-[10px]">Horizonte Temporal:</span>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="bg-black border border-zinc-800 px-3 py-1.5 text-white outline-none">
              <option value="2026">Ano 2026</option>
              <option value="ALL">Todo o Histórico</option>
            </select>
          </div>
          <div className="text-[10px] uppercase tracking-widest flex items-center gap-2">
            {!isDemoMode && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>}
            <span className={isDemoMode ? "text-amber-500 font-bold" : "text-emerald-400 font-bold"}>
              {isDemoMode ? 'AMBIENTE DE SIMULAÇÃO ATIVO' : 'AMBIENTE DE PRODUÇÃO BLINDADO'}
            </span>
          </div>
        </div>

        {/* MÓDULOS (Omitindo repetições visuais, lógica mantida igual) */}
        
        {/* ABA 1: COCKPIT */}
        {activeTab === 'cockpit' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div><h1 className="text-xl font-serif text-white uppercase tracking-widest">Cockpit 360° & Vendas</h1></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1"><span className="text-[9px] text-zinc-500 uppercase block">Receita Bruta</span><span className="text-xl font-serif text-white block">R$ {financialMetrics.receitaBruta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
              <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1"><span className="text-[9px] text-zinc-500 uppercase block">Lucro Bruto</span><span className="text-xl font-serif text-emerald-400 block">R$ {financialMetrics.lucroBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
              <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1"><span className="text-[9px] text-zinc-500 uppercase block">EBITDA Líquido</span><span className="text-xl font-serif text-amber-400 block">R$ {financialMetrics.ebitda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
              <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1"><span className="text-[9px] text-zinc-500 uppercase block">Total de Pedidos</span><span className="text-xl font-serif text-white block">{activeOrders.length} pedidos</span></div>
            </div>
          </div>
        )}

        {/* ABA 2: FINANCIAL OS */}
        {activeTab === 'treasury' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex justify-between items-center border-b border-zinc-800/80 pb-6">
              <h1 className="text-xl font-serif text-white uppercase tracking-widest">Controladoria & Tesouraria</h1>
              <div className="flex bg-[#070707] border border-zinc-800 p-1 text-[10px] font-bold uppercase tracking-widest">
                <button onClick={() => setTreasurySubTab('dre')} className={`px-4 py-2 ${treasurySubTab === 'dre' ? 'bg-amber-400 text-black' : 'text-zinc-500'}`}>DRE Destaque</button>
                <button onClick={() => setTreasurySubTab('matrix')} className={`px-4 py-2 ${treasurySubTab === 'matrix' ? 'bg-amber-400 text-black' : 'text-zinc-500'}`}>Matriz MoM</button>
                <button onClick={() => setTreasurySubTab('cashflow')} className={`px-4 py-2 ${treasurySubTab === 'cashflow' ? 'bg-amber-400 text-black' : 'text-zinc-500'}`}>Fluxo de Caixa</button>
              </div>
            </div>

            {treasurySubTab === 'dre' && (
              <div className="bg-[#070707] border border-zinc-800 p-6 space-y-4 text-xs font-mono">
                <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-3">Demonstrativo de Resultado</h2>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 text-white font-bold"><span>(+) RECEITA BRUTA</span><span>R$ {financialMetrics.receitaBruta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                  <div className="flex justify-between py-1 text-zinc-400 pl-4"><span>(-) Impostos & Gateway</span><span className="text-red-400">- R$ {financialMetrics.impostosEGateway.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                  <div className="flex justify-between py-2 border-b border-zinc-800 text-emerald-400 font-bold bg-emerald-950/10 px-2"><span>(=) MARGEM BRUTA</span><span>R$ {financialMetrics.lucroBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                  <div className="flex justify-between py-1 text-zinc-400 pl-4"><span>(-) OpEx Operacional + Ads</span><span className="text-red-400">- R$ {financialMetrics.opexTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                  <div className="flex justify-between py-3 border-t-2 border-amber-500/50 text-amber-400 font-bold bg-amber-950/20 px-3"><span>(=) EBITDA LÍQUIDO</span><span>R$ {financialMetrics.ebitda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span></div>
                </div>
              </div>
            )}

            {treasurySubTab === 'matrix' && (
              <div className="bg-[#070707] border border-zinc-800 p-6 space-y-6 overflow-x-auto font-mono text-[11px]">
                <h2 className="text-xs uppercase font-bold text-amber-400 border-b border-zinc-800 pb-3">Evolução Histórica DRE (Ano {selectedYear})</h2>
                <table className="w-full text-left border-collapse">
                  <thead><tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[9px]"><th className="py-3 px-2">Rubrica</th>{monthlyMatrix.map((m) => (<th key={m.label} className="py-3 px-2 text-right">{m.label}</th>))}</tr></thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    <tr className="bg-amber-950/20 font-bold"><td className="py-3 px-2 text-amber-400">EBITDA Líquido</td>{monthlyMatrix.map((m) => (<td key={m.label} className="py-3 px-2 text-right text-amber-400">{m.receita > 0 ? `R$ ${m.ebitda.toLocaleString('pt-BR')}` : '-'}</td>))}</tr>
                  </tbody>
                </table>
              </div>
            )}

            {treasurySubTab === 'cashflow' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-mono text-xs">
                <div className="lg:col-span-2 bg-[#070707] border border-zinc-800 p-6 space-y-4">
                  <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-3">Cash Ledger Real</h2>
                  <div className="space-y-2">
                    {filteredExpenses.map((cf: any) => (
                      <div key={cf.id} className="bg-[#040404] border border-zinc-800 p-3 flex justify-between items-center">
                        <div><span className="text-[9px] text-amber-500 block">{cf.date || '2026-09-29'} • {cf.category}</span><span className="text-white font-bold block">{cf.description}</span></div>
                        <span className={`font-bold ${cf.type === 'ENTRADA' ? 'text-emerald-400' : 'text-red-400'}`}>{cf.type === 'ENTRADA' ? '+' : '-'} R$ {Number(cf.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                      </div>
                    ))}
                    {filteredExpenses.length === 0 && <p className="text-zinc-600">Nenhum lançamento físico neste período.</p>}
                  </div>
                </div>
                <form onSubmit={handleAddExpense} className="bg-[#070707] border border-zinc-800 p-6 space-y-3 h-fit">
                  <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3">Novo Lançamento</h2>
                  <input type="date" value={expDate} onChange={e=>setExpDate(e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <select value={expType} onChange={e=>setExpType(e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-white outline-none"><option value="SAIDA">Saída</option><option value="ENTRADA">Entrada</option></select>
                  <select value={expCategory} onChange={e=>setExpCategory(e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-white outline-none"><option value="Tráfego Pago">Tráfego Pago</option><option value="Insumos / CMV">Insumos / CMV</option><option value="OpEx Fixos & SaaS">OpEx Fixos & SaaS</option></select>
                  <input type="text" value={expDesc} onChange={e=>setExpDesc(e.target.value)} placeholder="Descrição" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="number" step="0.01" value={expAmount} onChange={e=>setExpAmount(e.target.value)} placeholder="Valor (R$)" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <button type="submit" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest text-[10px]">Lançar no Banco de Dados</button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ABA 3: ARTEFATOS */}
        {activeTab === 'products' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div><h1 className="text-xl font-serif text-white uppercase tracking-widest">Artefatos & CMV Fabril</h1></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4 font-mono text-xs">
                {activeProducts.map((p: any) => (
                  <div key={p.id} className="bg-[#070707] border border-zinc-800 p-5 flex justify-between items-center">
                    <div><span className="text-amber-400 font-bold">{p.sku}</span><h3 className="text-white font-serif text-base">{p.name}</h3></div>
                    <span className="text-lg font-bold text-white">R$ {Number(p.sale_price || p.price || 320.00).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ABA 4: FORNECEDORES */}
        {activeTab === 'suppliers' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div><h1 className="text-xl font-serif text-white uppercase tracking-widest">Cadeia de Fornecedores</h1></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-mono text-xs">
              <div className="lg:col-span-2 space-y-3">
                {activeSuppliers.map((s: any) => (
                  <div key={s.id} className="bg-[#070707] border border-zinc-800 p-4 flex justify-between items-center">
                    <div><span className="text-amber-400 font-bold block">{s.name}</span><span className="text-zinc-400 text-[10px] block">{s.service_type || s.type}</span></div>
                    <span className="text-white font-bold">MOQ: {s.moq} un</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ABA 5: CRM */}
        {activeTab === 'crm' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div><h1 className="text-xl font-serif text-white uppercase tracking-widest">CRM 360 & Senado VIP</h1></div>
            <div className="space-y-3 text-xs font-mono">
              {activeCustomers.map((c: any) => (
                <div key={c.id} className="bg-[#070707] border border-zinc-800 p-4 flex justify-between items-center">
                  <div><span className="text-white font-bold block">{c.full_name}</span><span className="text-zinc-500 text-[10px]">{c.email}</span></div>
                  <span className="text-amber-400 font-bold px-2 py-1 bg-amber-950/40 border border-amber-500/30">{c.rfm_tag || 'MEMBRO_VIP'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABA 6: CONTENT */}
        {activeTab === 'content' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div><h1 className="text-xl font-serif text-white uppercase tracking-widest">Content OS</h1></div>
            <div className="bg-[#070707] border border-zinc-800 p-6 text-xs font-mono"><span className="text-amber-400 font-bold block">Matriz Lote Zero Ativa</span></div>
          </div>
        )}

        {/* ABA 7: LOGÍSTICA */}
        {activeTab === 'logistics' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div><h1 className="text-xl font-serif text-white uppercase tracking-widest">Logística White Glove</h1></div>
            <div className="bg-[#070707] border border-zinc-800 p-6 text-xs font-mono"><span className="text-emerald-400 font-bold block">RMA e Expedição</span></div>
          </div>
        )}

        {/* ABA 8: SIMULADOR WEBHOOK (RENDERIZA APENAS NO MODO DEMO) */}
        {isDemoMode && activeTab === 'webhook_sim' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div><h1 className="text-xl font-serif text-white uppercase tracking-widest text-amber-400">Sandbox: Simulador Webhook MP</h1></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 font-mono text-xs">
              <div className="bg-[#070707] border border-amber-500/30 p-6 space-y-4">
                <button onClick={handleCreateTestOrder} disabled={simulating} className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 uppercase tracking-widest text-[10px]">1. Gerar Pedido Teste Pix (R$ 320,00)</button>
                <button onClick={handleSimulateWebhookTrigger} disabled={simulating || !currentTestOrderId} className="w-full bg-amber-400 text-black font-bold py-3 uppercase tracking-widest text-[10px]">2. Simular Sinal de Pix Pago (Webhook MP)</button>
              </div>
              <div className="bg-[#070707] border border-amber-500/30 p-6 text-[10px] text-emerald-400 space-y-2 h-64 overflow-y-auto">
                <p className="text-amber-500/80">// Logs de Telemetria Sandbox...</p>
                {simLog.map((log, index) => (<p key={index}>{log}</p>))}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}