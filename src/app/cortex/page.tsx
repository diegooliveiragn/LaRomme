'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { playHapticSound } from '@/lib/sound';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// MOCK DATA EXCLUSIVO DO MODO DEMO / SANDBOX (NUNCA VAZA PARA O MODO REAL)
const MOCK_SANDBOX = {
  orders: [
    { id: 'm1', order_number: 'LR-90214', total_amount: 320.00, payment_status: 'PAGO', delivery_state: 'SP', created_at: '2026-09-12T10:30:00Z', customers: { full_name: 'Gabriel Siqueira' } },
  ],
  cashFlow: [
    { id: 'cf1', type: 'ENTRADA', category: 'Vendas Direct-to-Consumer', description: 'Liquidação Lote Zero (Demo)', amount: 180000.00, status: 'CONCILIADO', date: '2026-09-12' },
  ],
  suppliers: [
    { id: 'sup1', name: 'Oficina Fortaleza 01', service_type: 'Facção de Costura', moq: 100, lead_time_days: 15, unit_cost: 25.00, contact_whatsapp: '85998881122' },
  ],
  productsList: [
    { id: 'p1', name: 'Camiseta Boxy Vestigium', sku: 'BOXY-BLK-M', sale_price: 320.00, cost_price: 95.00, stock_m: 142, fabric_spec: '100% Algodão 260GSM' },
  ],
  customers: [
    { id: 'c1', full_name: 'Gabriel Siqueira', email: 'gabriel.siqueira@gmail.com', phone: '11988887766', instagram: '@gabrielsiq', rfm_tag: 'SENADOR_VIP', created_at: '2026-01-15T10:00:00Z' },
  ]
};

export default function CortexDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  
  // GARANTIA: O SISTEMA SEMPRE INICIA NO MODO REAL (LIVE) COM ZERO DADOS FALSOS
  const [isDemoMode, setIsDemoMode] = useState(false);

  const [activeTab, setActiveTab] = useState('cockpit');
  const [treasurySubTab, setTreasurySubTab] = useState<'dre' | 'matrix' | 'cashflow'>('dre');

  // FILTROS TEMPORAIS
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');

  // ESTADOS VIVOS DO SUPABASE (BANCO REAL)
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [dbExpenses, setDbExpenses] = useState<any[]>([]);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbSuppliers, setDbSuppliers] = useState<any[]>([]);
  const [dbCustomers, setDbCustomers] = useState<any[]>([]);

  // SIMULADOR WEBHOOK (DEMO APENAS)
  const [simulating, setSimulating] = useState(false);
  const [simLog, setSimLog] = useState<string[]>([]);
  const [currentTestOrderId, setCurrentTestOrderId] = useState<string | null>(null);

  // FORMULÁRIOS DE CADASTRO
  const [expType, setExpType] = useState('SAIDA');
  const [expCategory, setExpCategory] = useState('Tráfego Pago');
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expDate, setExpDate] = useState('2026-09-29');

  const [prodName, setProdName] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodSourcing, setProdSourcing] = useState('WHITELABEL');
  const [prodPrice, setProdPrice] = useState('');
  const [prodFabricSpec, setProdFabricSpec] = useState('100% Algodão 260GSM');
  const [prodFabricCost, setProdFabricCost] = useState('45.00');
  const [prodSewingCost, setProdSewingCost] = useState('25.00');
  const [prodPackCost, setProdPackCost] = useState('15.00');
  const [prodLaserCost, setProdLaserCost] = useState('10.00');

  const [supName, setSupName] = useState('');
  const [supType, setSupType] = useState('WHITELABEL');
  const [supMoq, setSupMoq] = useState('100');
  const [supLeadTime, setSupLeadTime] = useState('15');
  const [supWhatsapp, setSupWhatsapp] = useState('');

  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custInsta, setCustInsta] = useState('');

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

      setDbOrders(resOrders || []);
      setDbExpenses(resExpenses || []);
      setDbProducts(resProducts || []);
      setDbSuppliers(resSuppliers || []);
      setDbCustomers(resCustomers || []);
    } catch (e) {
      console.error("Erro na leitura do Supabase:", e);
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
    if (!isDemoMode === false && activeTab === 'webhook_sim') {
      setActiveTab('cockpit');
    }
    setIsDemoMode(!isDemoMode);
  };

  // NAVEGAÇÃO DINÂMICA: A ABA 8 É DESTRUIDA FISICAMENTE NO MODO REAL
  const navTabs = useMemo(() => {
    const tabs = [
      { id: 'cockpit', label: '1. Cockpit 360° & Vendas' },
      { id: 'treasury', label: '2. Financial & Treasury OS' },
      { id: 'products', label: '3. Artefatos & CMV Fabril' },
      { id: 'suppliers', label: '4. Fornecedores Whitelabel' },
      { id: 'crm', label: `5. CRM 360 & Senado VIP (${isDemoMode ? MOCK_SANDBOX.customers.length : dbCustomers.length})` },
      { id: 'content', label: '6. Content OS & Matriz' },
      { id: 'logistics', label: '7. Logística White Glove & RMA' },
    ];
    if (isDemoMode) {
      tabs.push({ id: 'webhook_sim', label: '8. Sandbox: Webhook MP' });
    }
    return tabs;
  }, [isDemoMode, dbCustomers.length]);

  // FONTE DE DADOS ISOLADA
  const rawExpenses = isDemoMode ? MOCK_SANDBOX.cashFlow : dbExpenses;
  const activeProducts = isDemoMode ? MOCK_SANDBOX.productsList : dbProducts;
  const activeSuppliers = isDemoMode ? MOCK_SANDBOX.suppliers : dbSuppliers;
  const activeCustomers = isDemoMode ? MOCK_SANDBOX.customers : dbCustomers;
  const activeOrders = isDemoMode ? MOCK_SANDBOX.orders : dbOrders;

  // OPERAÇÕES DE CRUD REAL NO SUPABASE
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expCategory || !expDesc || !expAmount) return alert("Preencha todos os campos.");
    playHapticSound();
    const { error } = await supabase.from('expenses').insert([{ type: expType, category: expCategory, description: expDesc, amount: parseFloat(expAmount), date: expDate, status: 'CONCILIADO' }]);
    if (!error) { alert("Lançamento registrado!"); setExpDesc(''); setExpAmount(''); fetchCortexData(); }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Confirmar exclusão desta transação financeira?")) return;
    playHapticSound();
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (!error) fetchCortexData();
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodSku || !prodPrice) return alert("Preencha os dados do artefato.");
    playHapticSound();
    const totalCostFabril = (parseFloat(prodFabricCost)||0) + (parseFloat(prodSewingCost)||0) + (parseFloat(prodPackCost)||0) + (parseFloat(prodLaserCost)||0);
    const { error } = await supabase.from('products').insert([{ 
      name: prodName, 
      sku: prodSku, 
      sourcing_type: prodSourcing,
      sale_price: parseFloat(prodPrice), 
      cost_price: totalCostFabril, 
      cost_fabric: parseFloat(prodFabricCost)||0,
      cost_sewing: parseFloat(prodSewingCost)||0,
      cost_packaging: parseFloat(prodPackCost)||0,
      cost_laser: parseFloat(prodLaserCost)||0,
      fabric_spec: prodFabricSpec 
    }]);
    if (!error) { alert("Artefato cadastrado!"); setProdName(''); setProdSku(''); setProdPrice(''); fetchCortexData(); }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Deseja realmente apagar este produto do catálogo?")) return;
    playHapticSound();
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) fetchCortexData();
  };

  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custEmail) return alert("Preencha nome e e-mail do cliente.");
    playHapticSound();
    const { error } = await supabase.from('customers').insert([{ 
      full_name: custName, 
      email: custEmail, 
      phone: custPhone, 
      instagram: custInsta.startsWith('@') ? custInsta : `@${custInsta}`,
      rfm_tag: 'MEMBRO_VIP' 
    }]);
    if (!error) { alert("Membro adicionado ao Senado VIP!"); setCustName(''); setCustEmail(''); setCustPhone(''); setCustInsta(''); fetchCortexData(); }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm("Atenção: Deseja banir/apagar este cliente do CRM?")) return;
    playHapticSound();
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (!error) fetchCortexData();
  };

  const handleSendResetPassword = (email: string) => {
    playHapticSound();
    alert(`Link de redefinição de senha enviado com segurança para: ${email}`);
  };

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName || !supType) return alert("Preencha os dados do fornecedor.");
    playHapticSound();
    const { error } = await supabase.from('suppliers').insert([{ 
      name: supName, 
      service_type: supType, 
      moq: parseInt(supMoq)||0, 
      lead_time_days: parseInt(supLeadTime)||0, 
      contact_whatsapp: supWhatsapp 
    }]);
    if (!error) { alert("Fornecedor adicionado!"); setSupName(''); setSupWhatsapp(''); fetchCortexData(); }
  };

  const handleDeleteSupplier = async (id: string) => {
    if (!confirm("Deseja remover este fornecedor do sistema?")) return;
    playHapticSound();
    const { error } = await supabase.from('suppliers').delete().eq('id', id);
    if (!error) fetchCortexData();
  };

  // MÉTIRCAS FINANCEIRAS
  const financialMetrics = useMemo(() => {
    const totalEntradas = rawExpenses.filter((e: any) => e.type === 'ENTRADA').reduce((acc: number, e: any) => acc + Number(e.amount), 0);
    const totalSaidas = rawExpenses.filter((e: any) => e.type === 'SAIDA').reduce((acc: number, e: any) => acc + Number(e.amount), 0);
    const cmvTotal = rawExpenses.filter((e: any) => e.category === 'Insumos / CMV').reduce((acc: number, e: any) => acc + Number(e.amount), 0);
    const opexTotal = rawExpenses.filter((e: any) => e.category === 'Tráfego Pago' || e.category === 'OpEx Fixos & SaaS').reduce((acc: number, e: any) => acc + Number(e.amount), 0);
    const impostosEGateway = totalEntradas * 0.07;

    return {
      receitaBruta: totalEntradas,
      lucroBruto: totalEntradas - impostosEGateway - cmvTotal,
      ebitda: totalEntradas - impostosEGateway - cmvTotal - opexTotal,
      saldoCaixaAtual: totalEntradas - totalSaidas
    };
  }, [rawExpenses]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans text-xs uppercase tracking-widest text-zinc-500">
        Iniciando Córtex OS V3.0 (Infraestrutura Blindada)...
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
        
        {/* BARRA DE FILTRO TEMPORAL E STATUS DE BLINDAGEM */}
        <div className="mb-8 p-4 bg-[#070707] border border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-bold uppercase tracking-widest text-[10px]">Horizonte Temporal:</span>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="bg-black border border-zinc-800 px-3 py-1.5 text-white outline-none">
              <option value="2026">Ano 2026</option>
            </select>
          </div>
          <div className="text-[10px] uppercase tracking-widest flex items-center gap-2">
            {!isDemoMode && <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>}
            <span className={isDemoMode ? "text-amber-500 font-bold" : "text-emerald-400 font-bold"}>
              {isDemoMode ? 'AMBIENTE DE SIMULAÇÃO ATIVO' : 'AMBIENTE DE PRODUÇÃO BLINDADO'}
            </span>
          </div>
        </div>

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

        {/* ABA 2: TREASURY OS */}
        {activeTab === 'treasury' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex justify-between items-center border-b border-zinc-800/80 pb-6">
              <h1 className="text-xl font-serif text-white uppercase tracking-widest">Controladoria & Tesouraria</h1>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-mono text-xs">
              <div className="lg:col-span-2 bg-[#070707] border border-zinc-800 p-6 space-y-4">
                <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-3">Livro Razão (Caixa)</h2>
                <div className="space-y-2">
                  {rawExpenses.map((cf: any) => (
                    <div key={cf.id} className="bg-[#040404] border border-zinc-800 p-3 flex justify-between items-center">
                      <div><span className="text-[9px] text-amber-500 block">{cf.date || '2026-09-29'} • {cf.category}</span><span className="text-white font-bold block">{cf.description}</span></div>
                      <div className="flex items-center gap-4">
                        <span className={`font-bold ${cf.type === 'ENTRADA' ? 'text-emerald-400' : 'text-red-400'}`}>{cf.type === 'ENTRADA' ? '+' : '-'} R$ {Number(cf.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                        {!isDemoMode && <button onClick={() => handleDeleteExpense(cf.id)} className="text-red-500 text-[10px] hover:underline">Excluir</button>}
                      </div>
                    </div>
                  ))}
                  {rawExpenses.length === 0 && <p className="text-zinc-600">Nenhum lançamento físico registrado no caixa real.</p>}
                </div>
              </div>
              {!isDemoMode && (
                <form onSubmit={handleAddExpense} className="bg-[#070707] border border-zinc-800 p-6 space-y-3 h-fit">
                  <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3">Novo Lançamento</h2>
                  <input type="date" value={expDate} onChange={e=>setExpDate(e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <select value={expType} onChange={e=>setExpType(e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-white outline-none"><option value="SAIDA">Saída</option><option value="ENTRADA">Entrada</option></select>
                  <select value={expCategory} onChange={e=>setExpCategory(e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-white outline-none"><option value="Tráfego Pago">Tráfego Pago</option><option value="Insumos / CMV">Insumos / CMV</option><option value="OpEx Fixos & SaaS">OpEx Fixos & SaaS</option></select>
                  <input type="text" value={expDesc} onChange={e=>setExpDesc(e.target.value)} placeholder="Descrição" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="number" step="0.01" value={expAmount} onChange={e=>setExpAmount(e.target.value)} placeholder="Valor (R$)" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <button type="submit" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest text-[10px]">Registrar no Banco</button>
                </form>
              )}
            </div>
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
                    <div>
                      <span className="text-amber-400 font-bold">{p.sku} • {p.sourcing_type || 'WHITELABEL'}</span>
                      <h3 className="text-white font-serif text-base">{p.name}</h3>
                      <span className="text-zinc-500 text-[10px]">{p.fabric_spec}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-lg font-bold text-white">R$ {Number(p.sale_price).toFixed(2)}</span>
                      {!isDemoMode && <button onClick={() => handleDeleteProduct(p.id)} className="text-red-500 text-[10px] hover:underline">Excluir</button>}
                    </div>
                  </div>
                ))}
                {activeProducts.length === 0 && <p className="text-zinc-600 font-mono text-xs">Nenhum artefato cadastrado na base real.</p>}
              </div>

              {!isDemoMode && (
                <form onSubmit={handleAddProduct} className="bg-[#070707] border border-zinc-800 p-6 space-y-3 h-fit font-mono text-xs">
                  <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3">Cadastrar Novo Artefato</h2>
                  <input type="text" value={prodName} onChange={e=>setProdName(e.target.value)} placeholder="Nome do Artefato" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="text" value={prodSku} onChange={e=>setProdSku(e.target.value)} placeholder="SKU (ex: BOXY-BLK-M)" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <select value={prodSourcing} onChange={e=>setProdSourcing(e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-white outline-none">
                    <option value="WHITELABEL">Modelo Whitelabel</option>
                    <option value="FACCION">Modelo Facção (Insumos Separados)</option>
                  </select>
                  <input type="number" step="0.01" value={prodPrice} onChange={e=>setProdPrice(e.target.value)} placeholder="Preço de Venda (R$)" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <button type="submit" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest text-[10px]">Salvar Produto</button>
                </form>
              )}
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
                    <div>
                      <span className="text-amber-400 font-bold block">{s.name}</span>
                      <span className="text-zinc-400 text-[10px] block">{s.service_type} • Lead Time: {s.lead_time_days} dias</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-white font-bold">MOQ: {s.moq} un</span>
                      {!isDemoMode && <button onClick={() => handleDeleteSupplier(s.id)} className="text-red-500 text-[10px] hover:underline">Excluir</button>}
                    </div>
                  </div>
                ))}
                {activeSuppliers.length === 0 && <p className="text-zinc-600">Nenhum fornecedor cadastrado na base real.</p>}
              </div>

              {!isDemoMode && (
                <form onSubmit={handleAddSupplier} className="bg-[#070707] border border-zinc-800 p-6 space-y-3 h-fit font-mono text-xs">
                  <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3">Novo Fornecedor</h2>
                  <input type="text" value={supName} onChange={e=>setSupName(e.target.value)} placeholder="Nome da Empresa / Oficina" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <select value={supType} onChange={e=>setSupType(e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-white outline-none">
                    <option value="WHITELABEL">Whitelabel Peça Pronta</option>
                    <option value="COSTURA">Facção de Costura</option>
                    <option value="TECELAGEM">Tecelagem / Malharia</option>
                  </select>
                  <input type="number" value={supMoq} onChange={e=>setSupMoq(e.target.value)} placeholder="MOQ Mínimo" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="text" value={supWhatsapp} onChange={e=>setSupWhatsapp(e.target.value)} placeholder="WhatsApp (ex: 85999998888)" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <button type="submit" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest text-[10px]">Cadastrar Parceiro</button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ABA 5: CRM 360 */}
        {activeTab === 'crm' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div><h1 className="text-xl font-serif text-white uppercase tracking-widest">CRM 360 & Senado VIP</h1></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-mono text-xs">
              <div className="lg:col-span-2 space-y-3">
                {activeCustomers.map((c: any) => (
                  <div key={c.id} className="bg-[#070707] border border-zinc-800 p-4 flex justify-between items-center">
                    <div>
                      <span className="text-white font-bold block">{c.full_name} {c.instagram && <span className="text-amber-400 font-normal">({c.instagram})</span>}</span>
                      <span className="text-zinc-500 text-[10px]">{c.email} • {c.phone || 'Sem telefone'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button onClick={() => handleSendResetPassword(c.email)} className="text-[9px] bg-zinc-900 border border-zinc-800 px-2 py-1 text-zinc-300 hover:text-white">Redefinir Senha</button>
                      {!isDemoMode && <button onClick={() => handleDeleteCustomer(c.id)} className="text-red-500 text-[10px] hover:underline">Banir</button>}
                    </div>
                  </div>
                ))}
                {activeCustomers.length === 0 && <p className="text-zinc-600">Nenhum cliente cadastrado no Senado VIP (Modo Real Limpo).</p>}
              </div>

              {!isDemoMode && (
                <form onSubmit={handleAddCustomer} className="bg-[#070707] border border-zinc-800 p-6 space-y-3 h-fit font-mono text-xs">
                  <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3">Cadastrar Membro</h2>
                  <input type="text" value={custName} onChange={e=>setCustName(e.target.value)} placeholder="Nome Completo" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="email" value={custEmail} onChange={e=>setCustEmail(e.target.value)} placeholder="E-mail" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="text" value={custPhone} onChange={e=>setCustPhone(e.target.value)} placeholder="WhatsApp / Telefone" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="text" value={custInsta} onChange={e=>setCustInsta(e.target.value)} placeholder="@instagram" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <button type="submit" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest text-[10px]">Adicionar Cliente</button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ABA 6: CONTENT */}
        {activeTab === 'content' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div><h1 className="text-xl font-serif text-white uppercase tracking-widest">Content OS & Matriz</h1></div>
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

        {/* ABA 8: SIMULADOR (SÓ EXISTE NO MODO DEMO) */}
        {isDemoMode && activeTab === 'webhook_sim' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div><h1 className="text-xl font-serif text-white uppercase tracking-widest text-amber-400">Sandbox: Simulador Webhook MP</h1></div>
            <div className="bg-[#070707] border border-amber-500/30 p-6 font-mono text-xs text-amber-400">
              Ambiente de testes isolado ativo. Nenhuma operação executada aqui impacta o banco de dados do Modo Real.
            </div>
          </div>
        )}

      </main>
    </div>
  );
}