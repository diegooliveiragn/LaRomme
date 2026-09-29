'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { playHapticSound } from '@/lib/sound';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// --- MOCK DATA PARA O MODO DEMO (1 ANO) ---
const MOCK_1_YEAR = {
  orders: [
    { id: 'm1', order_number: 'LR-90214', total_amount: 320.00, payment_status: 'PAGO', delivery_state: 'SP', created_at: '2026-09-12T10:30:00Z', customers: { full_name: 'Gabriel Siqueira', email: 'gabriel.siqueira@gmail.com', phone: '11988887766' } },
    { id: 'm2', order_number: 'LR-90215', total_amount: 640.00, payment_status: 'PAGO', delivery_state: 'RJ', created_at: '2026-09-12T11:15:00Z', customers: { full_name: 'Lucas Arantes', email: 'lucas.arantes@hotmail.com', phone: '21997776655' } },
  ],
  cashFlow: [
    { id: 'cf1', type: 'ENTRADA', category: 'Vendas Direct-to-Consumer', description: 'Liquidação Autônoma Lote Zero', amount: 1482000.00, status: 'CONCILIADO', date: '2026-09-12' },
    { id: 'cf2', type: 'SAIDA', category: 'Insumos / CMV', description: 'Facção Whitelabel - Lote 01 & 02', amount: 440800.00, status: 'CONCILIADO', date: '2026-08-10' },
    { id: 'cf3', type: 'SAIDA', category: 'Tráfego Pago', description: 'Meta Ads & TikTok Ads (Anual)', amount: 240000.00, status: 'CONCILIADO', date: '2026-09-01' },
    { id: 'cf4', type: 'SAIDA', category: 'OpEx Fixos & SaaS', description: 'Vercel, Supabase, Domínio, Softwares', amount: 39200.00, status: 'CONCILIADO', date: '2026-09-05' },
    { id: 'cf5', type: 'SAIDA', category: 'Impostos & Gateway', description: 'Simples Nacional + Taxa Mercado Pago', amount: 103740.00, status: 'CONCILIADO', date: '2026-09-10' },
  ],
  suppliers: [
    { id: 'sup1', name: 'Oficina Fortaleza 01', type: 'Facção de Costura', moq: 100, leadTime: 15, unitCost: 25.00, contact: '(85) 99888-1122' },
  ],
  productsList: [
    { id: 'p1', name: 'Camiseta Boxy Vestigium', sku: 'BOXY-BLK-M', price: 320.00, cost: 95.00, stock: 142, fabric: '100% Algodão 260GSM' },
  ],
  customers: [
    { id: 'c1', full_name: 'Gabriel Siqueira', email: 'gabriel.siqueira@gmail.com', phone: '11988887766', rfm_tag: 'MEMBRO_VIP', ltv: 1280.00, created_at: '2026-01-15T10:00:00Z' },
  ],
};

export default function CortexDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(true);

  const [activeTab, setActiveTab] = useState('treasury');
  const [treasurySubTab, setTreasurySubTab] = useState<'dre' | 'cashflow'>('dre');

  // --- ESTADOS VIVOS DO SUPABASE ---
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [dbExpenses, setDbExpenses] = useState<any[]>([]);
  const [dbCustomers, setDbCustomers] = useState<any[]>([]);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbSuppliers, setDbSuppliers] = useState<any[]>([]);

  // --- FORMULÁRIO DE TESOURARIA COM CLASSIFICAÇÃO CONTÁBIL ---
  const [expType, setExpType] = useState('SAIDA');
  const [expCategory, setExpCategory] = useState('Tráfego Pago');
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('');

  // --- FORMULÁRIOS ADICIONAIS ---
  const [prodName, setProdName] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodFabric, setProdFabric] = useState('');

  const [supName, setSupName] = useState('');
  const [supType, setSupType] = useState('');
  const [supMoq, setSupMoq] = useState('');
  const [supLeadTime, setSupLeadTime] = useState('');

  const fetchCortexData = async () => {
    try {
      const [
        { data: resOrders },
        { data: resExpenses },
        { data: resCustomers },
        { data: resProducts },
        { data: resSuppliers }
      ] = await Promise.all([
        supabase.from('orders').select('*, customers(*)').order('created_at', { ascending: false }),
        supabase.from('expenses').select('*').order('date', { ascending: false }),
        supabase.from('customers').select('*').order('created_at', { ascending: false }),
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('suppliers').select('*').order('created_at', { ascending: false })
      ]);

      if (resOrders) setDbOrders(resOrders);
      if (resExpenses) setDbExpenses(resExpenses);
      if (resCustomers) setDbCustomers(resCustomers);
      if (resProducts) setDbProducts(resProducts);
      if (resSuppliers) setDbSuppliers(resSuppliers);
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
    setIsDemoMode(!isDemoMode);
  };

  // --- GRAVAÇÃO NO BANCO DE DADOS ---
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expCategory || !expDesc || !expAmount) return alert("Preencha todos os campos.");
    
    playHapticSound();
    const { error } = await supabase.from('expenses').insert([{
      type: expType,
      category: expCategory,
      description: expDesc,
      amount: parseFloat(expAmount),
      status: 'CONCILIADO'
    }]);

    if (!error) {
      alert("Lançamento efetuado com sucesso!");
      setExpDesc(''); setExpAmount('');
      fetchCortexData();
    } else {
      alert("Erro ao gravar: " + error.message);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodSku || !prodPrice || !prodFabric) return alert("Preencha os dados do produto.");
    
    playHapticSound();
    const { error } = await supabase.from('products').insert([{
      name: prodName,
      sku: prodSku,
      sale_price: parseFloat(prodPrice),
      fabric_spec: prodFabric
    }]);

    if (!error) {
      alert("Artefato salvo!");
      setProdName(''); setProdSku(''); setProdPrice(''); setProdFabric('');
      fetchCortexData();
    } else {
      alert("Erro ao gravar: " + error.message);
    }
  };

  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName || !supType || !supMoq || !supLeadTime) return alert("Preencha os dados do fornecedor.");
    
    playHapticSound();
    const { error } = await supabase.from('suppliers').insert([{
      name: supName,
      service_type: supType,
      moq: parseInt(supMoq),
      lead_time_days: parseInt(supLeadTime),
      unit_cost: 0
    }]);

    if (!error) {
      alert("Fornecedor cadastrado!");
      setSupName(''); setSupType(''); setSupMoq(''); setSupLeadTime('');
      fetchCortexData();
    } else {
      alert("Erro ao gravar: " + error.message);
    }
  };

  // --- SELEÇÃO DE FONTE DE DADOS (DEMO VS LIVE) ---
  const activeExpenses = isDemoMode ? MOCK_1_YEAR.cashFlow : dbExpenses;
  const activeProducts = isDemoMode ? MOCK_1_YEAR.productsList : dbProducts;
  const activeSuppliers = isDemoMode ? MOCK_1_YEAR.suppliers : dbSuppliers;

  // --- MOTORES DE CÁLCULO CONTÁBIL ---
  const financialMetrics = useMemo(() => {
    const totalEntradas = activeExpenses
      .filter((e: any) => e.type === 'ENTRADA')
      .reduce((acc: number, e: any) => acc + Number(e.amount), 0);

    const totalSaidas = activeExpenses
      .filter((e: any) => e.type === 'SAIDA')
      .reduce((acc: number, e: any) => acc + Number(e.amount), 0);

    const cmvTotal = activeExpenses
      .filter((e: any) => e.category === 'Insumos / CMV')
      .reduce((acc: number, e: any) => acc + Number(e.amount), 0);

    const opexTotal = activeExpenses
      .filter((e: any) => e.category === 'Tráfego Pago' || e.category === 'OpEx Fixos & SaaS')
      .reduce((acc: number, e: any) => acc + Number(e.amount), 0);

    const impostosEGateway = activeExpenses
      .filter((e: any) => e.category === 'Impostos & Gateway')
      .reduce((acc: number, e: any) => acc + Number(e.amount), 0) || (totalEntradas * 0.07); // ~7% Simples + Pix se zerado

    const receitaLiquida = totalEntradas - impostosEGateway;
    const lucroBruto = receitaLiquida - cmvTotal;
    const ebitda = lucroBruto - opexTotal;
    const margemEbitda = receitaLiquida > 0 ? ((ebitda / receitaLiquida) * 100).toFixed(1) : '0.0';

    const saldoCaixaAtual = totalEntradas - totalSaidas;
    const burnRateMensal = opexTotal > 0 ? (opexTotal / 12) : 1;
    const cashRunwayMeses = (saldoCaixaAtual / burnRateMensal).toFixed(1);

    return {
      receitaBruta: totalEntradas,
      impostosEGateway,
      receitaLiquida,
      cmvTotal,
      lucroBruto,
      margemBrutaPercent: receitaLiquida > 0 ? ((lucroBruto / receitaLiquida) * 100).toFixed(1) : '0.0',
      opexTotal,
      ebitda,
      margemEbitda,
      saldoCaixaAtual,
      burnRateMensal,
      cashRunwayMeses
    };
  }, [activeExpenses]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans text-xs uppercase tracking-widest text-zinc-500">
        Iniciando Módulos Financeiros...
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-[#030303] text-white font-sans flex overflow-hidden">
      
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

          <nav className="space-y-1 pt-4 border-t border-zinc-800/80 text-[10px] uppercase tracking-widest">
            {[
              { id: 'treasury', label: '1. Financial & Treasury OS' },
              { id: 'cockpit', label: '2. Cockpit 360° & Vendas' },
              { id: 'products', label: '3. Cadastro de Produtos' },
              { id: 'suppliers', label: '4. Fornecedores Whitelabel' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { playHapticSound(); setActiveTab(tab.id); }}
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

        <div className="p-6 border-t border-zinc-800/80">
          <button onClick={() => router.push('/')} className="w-full text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-400 py-2 hover:text-white transition-colors uppercase tracking-widest">
            Voltar para Vitrine
          </button>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 h-screen overflow-y-auto p-10 bg-[#030303]">
        
        {/* MÓDULO 2: FINANCIAL & TREASURY OS */}
        {activeTab === 'treasury' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
              <div>
                <h1 className="text-xl font-serif text-white uppercase tracking-widest">Controladoria & Tesouraria de Guerra</h1>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
                  P&L Gerencial por Competência e Gestão de Caixa em Tempo Real.
                </p>
              </div>

              {/* CHAVEADOR DE SUB-ABAS (DRE VS FLUXO DE CAIXA) */}
              <div className="flex bg-[#070707] border border-zinc-800 p-1 rounded-none text-[10px] font-bold uppercase tracking-widest">
                <button
                  onClick={() => { playHapticSound(); setTreasurySubTab('dre'); }}
                  className={`px-4 py-2 transition-all ${treasurySubTab === 'dre' ? 'bg-amber-400 text-black font-bold' : 'text-zinc-500 hover:text-white'}`}
                >
                  DRE Gerencial (P&L)
                </button>
                <button
                  onClick={() => { playHapticSound(); setTreasurySubTab('cashflow'); }}
                  className={`px-4 py-2 transition-all ${treasurySubTab === 'cashflow' ? 'bg-amber-400 text-black font-bold' : 'text-zinc-500 hover:text-white'}`}
                >
                  Fluxo de Caixa (Tesouraria)
                </button>
              </div>
            </div>

            {/* SUB-ABA 1: DRE GERENCIAL */}
            {treasurySubTab === 'dre' && (
              <div className="space-y-8">
                {/* METRIC CARDS SUPERIORES */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">Receita Bruta</span>
                    <span className="text-xl font-serif text-white block">R$ {financialMetrics.receitaBruta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">Lucro Bruto (CMV Abatido)</span>
                    <span className="text-xl font-serif text-emerald-400 block">R$ {financialMetrics.lucroBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    <span className="text-[9px] text-zinc-500 block font-mono">Margem Bruta: {financialMetrics.margemBrutaPercent}%</span>
                  </div>
                  <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">OpEx Operacional + Ads</span>
                    <span className="text-xl font-serif text-red-400 block">R$ {financialMetrics.opexTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1 shadow-[0_0_20px_rgba(245,158,11,0.05)] border-amber-500/30">
                    <span className="text-[9px] text-amber-400 uppercase tracking-widest block font-bold">EBITDA Líquido</span>
                    <span className="text-xl font-serif text-amber-400 block">R$ {financialMetrics.ebitda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    <span className="text-[9px] text-amber-500/80 block font-mono font-bold">Margem EBITDA: {financialMetrics.margemEbitda}%</span>
                  </div>
                </div>

                {/* ESTRUTURA DEMONSTRATIVA DRE */}
                <div className="bg-[#070707] border border-zinc-800 p-6 space-y-4 text-xs">
                  <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-3 tracking-widest">
                    Demonstrativo do Resultado do Exercício (Regime de Competência)
                  </h2>

                  <div className="space-y-3 font-mono">
                    <div className="flex justify-between items-center py-2 border-b border-zinc-800/40 text-white font-bold">
                      <span>(+) RECEITA BRUTA DE VENDAS</span>
                      <span>R$ {financialMetrics.receitaBruta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between items-center py-1 text-zinc-400 text-[11px] pl-4">
                      <span>(-) Impostos (Simples Nacional ~6%) & Taxas Gateway</span>
                      <span className="text-red-400">- R$ {financialMetrics.impostosEGateway.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-zinc-800/40 text-zinc-200 font-bold bg-zinc-900/30 px-2">
                      <span>(=) RECEITA LÍQUIDA</span>
                      <span>R$ {financialMetrics.receitaLiquida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between items-center py-1 text-zinc-400 text-[11px] pl-4">
                      <span>(-) Custo das Mercadorias Vendidas (CMV Fabril)</span>
                      <span className="text-red-400">- R$ {financialMetrics.cmvTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between items-center py-2 border-b border-zinc-800/40 text-emerald-400 font-bold bg-emerald-950/10 px-2">
                      <span>(=) MARGEM BRUTA DE CONTRIBUIÇÃO</span>
                      <span>R$ {financialMetrics.lucroBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between items-center py-1 text-zinc-400 text-[11px] pl-4">
                      <span>(-) Despesas Operacionais (OpEx, Anúncios Meta Ads, Ferramentas SaaS)</span>
                      <span className="text-red-400">- R$ {financialMetrics.opexTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>

                    <div className="flex justify-between items-center py-3 border-t-2 border-amber-500/50 text-amber-400 font-serif text-sm font-bold bg-amber-950/20 px-3">
                      <span>(=) EBITDA LÍQUIDO OPERACIONAL</span>
                      <span>R$ {financialMetrics.ebitda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-ABA 2: FLUXO DE CAIXA DE TESOURARIA */}
            {treasurySubTab === 'cashflow' && (
              <div className="space-y-8">
                {/* CARDS DE SALDO E RUNWAY */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">Saldo Atual em Conta</span>
                    <span className="text-2xl font-serif text-emerald-400 block">R$ {financialMetrics.saldoCaixaAtual.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">Burn Rate Médio Mensal</span>
                    <span className="text-2xl font-serif text-red-400 block">R$ {financialMetrics.burnRateMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1 shadow-[0_0_20px_rgba(52,211,153,0.05)] border-emerald-500/30">
                    <span className="text-[9px] text-emerald-400 uppercase tracking-widest block font-bold">Cash Runway (Pista de Voo)</span>
                    <span className="text-2xl font-serif text-white block">{financialMetrics.cashRunwayMeses} Meses</span>
                    <span className="text-[9px] text-zinc-500 block font-mono">Autonomia sem novas vendas</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* EXTRATO DE TESOURARIA (CASH LEDGER) */}
                  <div className="lg:col-span-2 bg-[#070707] border border-zinc-800 p-6 space-y-4">
                    <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-3 tracking-widest">
                      Extrato Diário de Lançamentos (Cash Ledger)
                    </h2>
                    <div className="space-y-2 text-xs">
                      {activeExpenses.map((cf: any) => (
                        <div key={cf.id} className="bg-[#040404] border border-zinc-800 p-4 flex justify-between items-center">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] px-2 py-0.5 font-bold uppercase ${cf.type === 'ENTRADA' ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                                {cf.type}
                              </span>
                              <span className="text-zinc-400 text-[10px] font-mono">{cf.category}</span>
                            </div>
                            <span className="text-white font-bold block">{cf.description}</span>
                          </div>
                          <div className="text-right">
                            <span className={`text-sm font-mono font-bold ${cf.type === 'ENTRADA' ? 'text-emerald-400' : 'text-red-400'}`}>
                              {cf.type === 'ENTRADA' ? '+' : '-'} R$ {Number(cf.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      ))}
                      {activeExpenses.length === 0 && <p className="text-zinc-500 text-xs">Nenhuma movimentação registrada.</p>}
                    </div>
                  </div>

                  {/* FORMULÁRIO DE LANÇAMENTO CONTÁBIL */}
                  <form onSubmit={handleAddExpense} className="bg-[#070707] border border-zinc-800 p-6 space-y-4 text-xs h-fit">
                    <h2 className="text-xs uppercase tracking-widest text-zinc-200 font-bold border-b border-zinc-800 pb-3">
                      Lançamento de Tesouraria
                    </h2>
                    <div className="space-y-2">
                      <label className="text-[10px] text-zinc-400 uppercase">Tipo de Movimento</label>
                      <select value={expType} onChange={e=>setExpType(e.target.value)} className="w-full bg-black border border-zinc-800 p-3 text-white outline-none">
                        <option value="SAIDA">Saída (Débito)</option>
                        <option value="ENTRADA">Entrada (Crédito)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-zinc-400 uppercase">Classificação Contábil</label>
                      <select value={expCategory} onChange={e=>setExpCategory(e.target.value)} className="w-full bg-black border border-zinc-800 p-3 text-white outline-none">
                        <option value="Tráfego Pago">Tráfego Pago (Meta/TikTok Ads)</option>
                        <option value="Insumos / CMV">Insumos / CMV (Costura/Tecido/Laser)</option>
                        <option value="OpEx Fixos & SaaS">OpEx Fixos & SaaS (Sistemas/Infra)</option>
                        <option value="Impostos & Gateway">Impostos & Gateway (Simples/Pix)</option>
                        <option value="Vendas Direct-to-Consumer">Vendas Direct-to-Consumer</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-zinc-400 uppercase">Descrição</label>
                      <input type="text" value={expDesc} onChange={e=>setExpDesc(e.target.value)} placeholder="Ex: Pagamento Lote 02 Tecelagem" className="w-full bg-black border border-zinc-800 p-3 text-white outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] text-zinc-400 uppercase">Valor Exato (R$)</label>
                      <input type="number" step="0.01" value={expAmount} onChange={e=>setExpAmount(e.target.value)} placeholder="500.00" className="w-full bg-black border border-zinc-800 p-3 text-white outline-none" />
                    </div>
                    <button type="submit" className="w-full bg-white text-black font-bold py-3.5 uppercase tracking-widest text-[10px] hover:bg-zinc-200 transition-colors">
                      Registrar no Caixa Real
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* MÓDULO 2: COCKPIT */}
        {activeTab === 'cockpit' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="text-xl font-serif text-white uppercase tracking-widest">Cockpit 360° & Vendas</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Visão panorâmica consolidada.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">Receita Bruta</span>
                <span className="text-2xl font-serif text-white block">R$ {financialMetrics.receitaBruta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">Volume de Pedidos</span>
                <span className="text-2xl font-serif text-amber-400 block">{isDemoMode ? 4630 : dbOrders.length} peças</span>
              </div>
              <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">Lucro Bruto</span>
                <span className="text-2xl font-serif text-emerald-400 block">R$ {financialMetrics.lucroBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
              </div>
            </div>
          </div>
        )}

        {/* MÓDULO 3: PRODUTOS */}
        {activeTab === 'products' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="text-xl font-serif text-white uppercase tracking-widest">Cadastro de Produtos & Artefatos</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Catálogo vivo de SKUs e tecidos.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-3 text-xs">
                {activeProducts.map((p: any) => (
                  <div key={p.id} className="bg-[#070707] border border-zinc-800 p-4 flex justify-between items-center">
                    <div>
                      <span className="text-amber-400 font-mono text-[10px] block font-bold">{p.sku}</span>
                      <span className="text-white font-bold block text-sm">{p.name}</span>
                      <span className="text-zinc-500 text-[10px]">{p.fabric_spec || p.fabric}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-white font-bold block">R$ {Number(p.sale_price || p.price).toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddProduct} className="bg-[#070707] border border-zinc-800 p-6 space-y-3 text-xs h-fit">
                <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3">Novo Artefato</h2>
                <input type="text" value={prodName} onChange={e=>setProdName(e.target.value)} placeholder="Nome da Peça" className="w-full bg-black border border-zinc-800 p-2.5 text-white outline-none" />
                <input type="text" value={prodSku} onChange={e=>setProdSku(e.target.value)} placeholder="SKU (Ex: BOXY-BLK-M)" className="w-full bg-black border border-zinc-800 p-2.5 text-white outline-none" />
                <input type="text" value={prodFabric} onChange={e=>setProdFabric(e.target.value)} placeholder="Tecido (Ex: 100% Algodão 260GSM)" className="w-full bg-black border border-zinc-800 p-2.5 text-white outline-none" />
                <input type="number" step="0.01" value={prodPrice} onChange={e=>setProdPrice(e.target.value)} placeholder="Preço Final (Ex: 320.00)" className="w-full bg-black border border-zinc-800 p-2.5 text-white outline-none" />
                <button type="submit" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest text-[10px]">Salvar Produto</button>
              </form>
            </div>
          </div>
        )}

        {/* MÓDULO 4: FORNECEDORES */}
        {activeTab === 'suppliers' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="text-xl font-serif text-white uppercase tracking-widest">Cadeia de Fornecedores Whitelabel</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Gestão de oficinas e parceiros industriais.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-3 text-xs">
                {activeSuppliers.map((s: any) => (
                  <div key={s.id} className="bg-[#070707] border border-zinc-800 p-4 flex justify-between items-center">
                    <div>
                      <span className="text-amber-400 font-bold block">{s.name}</span>
                      <span className="text-zinc-400 text-[10px] block">{s.service_type || s.type}</span>
                    </div>
                    <div className="text-right text-[10px] font-mono">
                      <span className="text-white block font-bold">MOQ: {s.moq} un</span>
                      <span className="text-emerald-400 block">Lead Time: {s.lead_time_days || s.leadTime} dias</span>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddSupplier} className="bg-[#070707] border border-zinc-800 p-6 space-y-3 text-xs h-fit">
                <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3">Novo Parceiro</h2>
                <input type="text" value={supName} onChange={e=>setSupName(e.target.value)} placeholder="Nome da Oficina" className="w-full bg-black border border-zinc-800 p-2.5 text-white outline-none" />
                <input type="text" value={supType} onChange={e=>setSupType(e.target.value)} placeholder="Tipo (Ex: Costura / Tecido / Laser)" className="w-full bg-black border border-zinc-800 p-2.5 text-white outline-none" />
                <input type="number" value={supMoq} onChange={e=>setSupMoq(e.target.value)} placeholder="MOQ (Pedido Mínimo)" className="w-full bg-black border border-zinc-800 p-2.5 text-white outline-none" />
                <input type="number" value={supLeadTime} onChange={e=>setSupLeadTime(e.target.value)} placeholder="Lead Time (Dias)" className="w-full bg-black border border-zinc-800 p-2.5 text-white outline-none" />
                <button type="submit" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest text-[10px]">Adicionar Parceiro</button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}