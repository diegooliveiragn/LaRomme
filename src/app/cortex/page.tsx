'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { playHapticSound } from '@/lib/sound';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// --- MOCK DATA PARA O MODO DEMO ---
const MOCK_1_YEAR = {
  orders: [
    { id: 'm1', order_number: 'LR-90214', total_amount: 320.00, payment_status: 'PAGO', delivery_state: 'SP', created_at: '2026-09-12T10:30:00Z', customers: { full_name: 'Gabriel Siqueira' } },
    { id: 'm2', order_number: 'LR-90215', total_amount: 640.00, payment_status: 'PAGO', delivery_state: 'RJ', created_at: '2026-08-15T11:15:00Z', customers: { full_name: 'Lucas Arantes' } },
    { id: 'm3', order_number: 'LR-90102', total_amount: 960.00, payment_status: 'PAGO', delivery_state: 'CE', created_at: '2026-01-20T14:20:00Z', customers: { full_name: 'Matheus Costa' } },
  ],
  cashFlow: [
    { id: 'cf1', type: 'ENTRADA', category: 'Vendas Direct-to-Consumer', description: 'Liquidação Lote Zero (Set/26)', amount: 180000.00, status: 'CONCILIADO', date: '2026-09-12' },
    { id: 'cf2', type: 'SAIDA', category: 'Insumos / CMV', description: 'Tecelagem & Costura Lote Zero', amount: 54000.00, status: 'CONCILIADO', date: '2026-09-02' },
    { id: 'cf3', type: 'SAIDA', category: 'Tráfego Pago', description: 'Meta Ads Setembro', amount: 25000.00, status: 'CONCILIADO', date: '2026-09-05' },
    { id: 'cf4', type: 'SAIDA', category: 'OpEx Fixos & SaaS', description: 'Infraestrutura Vercel/Supabase', amount: 4200.00, status: 'CONCILIADO', date: '2026-09-01' },
    { id: 'cf5', type: 'ENTRADA', category: 'Vendas Direct-to-Consumer', description: 'Liquidação Drop Agosto', amount: 150000.00, status: 'CONCILIADO', date: '2026-08-15' },
    { id: 'cf6', type: 'SAIDA', category: 'Insumos / CMV', description: 'Insumos Drop Agosto', amount: 45000.00, status: 'CONCILIADO', date: '2026-08-01' },
    { id: 'cf7', type: 'SAIDA', category: 'Tráfego Pago', description: 'Meta Ads Agosto', amount: 20000.00, status: 'CONCILIADO', date: '2026-08-05' },
  ],
  suppliers: [
    { id: 'sup1', name: 'Oficina Fortaleza 01', type: 'Facção de Costura', moq: 100, leadTime: 15, unitCost: 25.00, contact: '(85) 99888-1122' },
    { id: 'sup2', name: 'Têxtil Santa Catarina', type: 'Tecelagem 260GSM', moq: 300, leadTime: 30, unitCost: 45.00, contact: '(47) 98877-3344' },
  ],
  productsList: [
    { id: 'p1', name: 'Camiseta Boxy Vestigium', sku: 'BOXY-BLK-M', price: 320.00, cost_fabric: 45.00, cost_sewing: 25.00, cost_packaging: 15.00, cost_laser: 10.00, stock: 142, fabric: '100% Algodão 260GSM' },
    { id: 'p2', name: 'Camiseta Boxy Origo', sku: 'BOXY-WHT-L', price: 340.00, cost_fabric: 48.00, cost_sewing: 27.00, cost_packaging: 15.00, cost_laser: 10.00, stock: 98, fabric: '100% Algodão 280GSM' },
  ],
};

export default function CortexDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(true);

  const [activeTab, setActiveTab] = useState('treasury');
  const [treasurySubTab, setTreasurySubTab] = useState<'dre' | 'cashflow' | 'matrix'>('dre');

  // --- FILTROS DE GOVERNANÇA TEMPORAL ---
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');

  // --- ESTADOS VIVOS DO SUPABASE ---
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [dbExpenses, setDbExpenses] = useState<any[]>([]);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbSuppliers, setDbSuppliers] = useState<any[]>([]);

  // --- FORMULÁRIOS DE ENTRADA ---
  const [expType, setExpType] = useState('SAIDA');
  const [expCategory, setExpCategory] = useState('Tráfego Pago');
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expDate, setExpDate] = useState('2026-09-29');

  // FORMULÁRIO DE PRODUTO COM ENGENHARIA DE CUSTOS POR SKU
  const [prodName, setProdName] = useState('');
  const [prodSku, setProdSku] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodFabricSpec, setProdFabricSpec] = useState('');
  const [prodFabricCost, setProdFabricCost] = useState('45.00');
  const [prodSewingCost, setProdSewingCost] = useState('25.00');
  const [prodPackCost, setProdPackCost] = useState('15.00');
  const [prodLaserCost, setProdLaserCost] = useState('10.00');

  // SIMULADOR DE ESTRESSE DA CADEIA DE SUPRIMENTOS
  const [stressFactor, setStressFactor] = useState<number>(0); // % de inflação em insumos

  const fetchCortexData = async () => {
    try {
      const [
        { data: resOrders },
        { data: resExpenses },
        { data: resProducts },
        { data: resSuppliers }
      ] = await Promise.all([
        supabase.from('orders').select('*, customers(*)').order('created_at', { ascending: false }),
        supabase.from('expenses').select('*').order('date', { ascending: false }),
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('suppliers').select('*').order('created_at', { ascending: false })
      ]);

      if (resOrders) setDbOrders(resOrders);
      if (resExpenses) setDbExpenses(resExpenses);
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

  // --- GRAVAÇÃO NO BANCO DE DADOS (SUPABASE) ---
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expCategory || !expDesc || !expAmount) return alert("Preencha todos os campos.");
    
    playHapticSound();
    const { error } = await supabase.from('expenses').insert([{
      type: expType,
      category: expCategory,
      description: expDesc,
      amount: parseFloat(expAmount),
      date: expDate,
      status: 'CONCILIADO'
    }]);

    if (!error) {
      alert("Lançamento registrado com sucesso!");
      setExpDesc(''); setExpAmount('');
      fetchCortexData();
    } else {
      alert("Erro ao gravar: " + error.message);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodSku || !prodPrice) return alert("Preencha os dados do artefato.");
    
    playHapticSound();
    const fabricCostNum = parseFloat(prodFabricCost) || 0;
    const sewingCostNum = parseFloat(prodSewingCost) || 0;
    const packCostNum = parseFloat(prodPackCost) || 0;
    const laserCostNum = parseFloat(prodLaserCost) || 0;
    const totalCostFabril = fabricCostNum + sewingCostNum + packCostNum + laserCostNum;

    const { error } = await supabase.from('products').insert([{
      name: prodName,
      sku: prodSku,
      sale_price: parseFloat(prodPrice),
      cost_price: totalCostFabril,
      fabric_spec: prodFabricSpec || '100% Algodão Premium'
    }]);

    if (!error) {
      alert("Artefato com Engenharia de Custos cadastrado!");
      setProdName(''); setProdSku(''); setProdPrice('');
      fetchCortexData();
    } else {
      alert("Erro ao gravar produto: " + error.message);
    }
  };

  // --- SELEÇÃO DE FONTE DE DADOS ---
  const rawExpenses = isDemoMode ? MOCK_1_YEAR.cashFlow : dbExpenses;
  const activeProducts = isDemoMode ? MOCK_1_YEAR.productsList : dbProducts;
  const activeSuppliers = isDemoMode ? MOCK_1_YEAR.suppliers : dbSuppliers;

  // --- FILTRAGEM TEMPORAL PARA GOVERNANÇA ---
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

  // --- MOTORES DE CÁLCULO CONTÁBIL ---
  const financialMetrics = useMemo(() => {
    const totalEntradas = filteredExpenses
      .filter((e: any) => e.type === 'ENTRADA')
      .reduce((acc: number, e: any) => acc + Number(e.amount), 0);

    const totalSaidas = filteredExpenses
      .filter((e: any) => e.type === 'SAIDA')
      .reduce((acc: number, e: any) => acc + Number(e.amount), 0);

    const cmvTotal = filteredExpenses
      .filter((e: any) => e.category === 'Insumos / CMV')
      .reduce((acc: number, e: any) => acc + Number(e.amount), 0);

    const opexTotal = filteredExpenses
      .filter((e: any) => e.category === 'Tráfego Pago' || e.category === 'OpEx Fixos & SaaS')
      .reduce((acc: number, e: any) => acc + Number(e.amount), 0);

    const impostosEGateway = filteredExpenses
      .filter((e: any) => e.category === 'Impostos & Gateway')
      .reduce((acc: number, e: any) => acc + Number(e.amount), 0) || (totalEntradas * 0.07);

    const receitaLiquida = totalEntradas - impostosEGateway;
    const lucroBruto = receitaLiquida - cmvTotal;
    const ebitda = lucroBruto - opexTotal;
    const margemEbitda = receitaLiquida > 0 ? ((ebitda / receitaLiquida) * 100).toFixed(1) : '0.0';

    const saldoCaixaAtual = rawExpenses
      .reduce((acc: number, e: any) => e.type === 'ENTRADA' ? acc + Number(e.amount) : acc - Number(e.amount), 0);
    
    const burnRateMensal = opexTotal > 0 ? (opexTotal / 12) : 10000;
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
  }, [filteredExpenses, rawExpenses]);

  // MATRIZ MÊS A MÊS (DESDOBRAMENTO HISTÓRICO PARA GOVERNANÇA)
  const monthlyMatrix = useMemo(() => {
    const months = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
    const labels = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

    return months.map((m, idx) => {
      const monthExpenses = rawExpenses.filter((e: any) => {
        const itemDate = e.date ? new Date(e.date) : new Date(e.created_at || '2026-01-01');
        const itemYear = itemDate.getFullYear().toString();
        const itemMonth = (itemDate.getMonth() + 1).toString().padStart(2, '0');
        return itemYear === (selectedYear === 'ALL' ? '2026' : selectedYear) && itemMonth === m;
      });

      const rec = monthExpenses.filter((e: any) => e.type === 'ENTRADA').reduce((a: number, b: any) => a + Number(b.amount), 0);
      const cmv = monthExpenses.filter((e: any) => e.category === 'Insumos / CMV').reduce((a: number, b: any) => a + Number(b.amount), 0);
      const opex = monthExpenses.filter((e: any) => e.category === 'Tráfego Pago' || e.category === 'OpEx Fixos & SaaS').reduce((a: number, b: any) => a + Number(b.amount), 0);
      const ebitda = (rec * 0.93) - cmv - opex;

      return {
        label: labels[idx],
        receita: rec,
        cmv,
        opex,
        ebitda
      };
    });
  }, [rawExpenses, selectedYear]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans text-xs uppercase tracking-widest text-zinc-500">
        Carregando Governança & Engenharia de Custos...
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
            <span>{isDemoMode ? '🟡 MODO DEMO' : '🟢 MODO REAL (LIVE)'}</span>
            <span className="text-xs">⇄</span>
          </button>

          <nav className="space-y-1 pt-4 border-t border-zinc-800/80 text-[10px] uppercase tracking-widest">
            {[
              { id: 'treasury', label: '1. Financial & Treasury OS' },
              { id: 'products', label: '2. Artefatos & CMV Fabril' },
              { id: 'suppliers', label: '3. Fornecedores Whitelabel' },
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
        
        {/* BARRA DE FILTRO DE GOVERNANÇA TEMPORAL */}
        <div className="mb-8 p-4 bg-[#070707] border border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-bold uppercase tracking-widest text-[10px]">Horizonte Temporal:</span>
            <select
              value={selectedYear}
              onChange={(e) => { playHapticSound(); setSelectedYear(e.target.value); }}
              className="bg-black border border-zinc-800 px-3 py-1.5 text-white outline-none"
            >
              <option value="2026">Ano 2026</option>
              <option value="2025">Ano 2025</option>
              <option value="ALL">Todo o Histórico</option>
            </select>

            <select
              value={selectedMonth}
              onChange={(e) => { playHapticSound(); setSelectedMonth(e.target.value); }}
              className="bg-black border border-zinc-800 px-3 py-1.5 text-white outline-none"
            >
              <option value="ALL">Todos os Meses (Consolidado)</option>
              <option value="01">Janeiro</option>
              <option value="02">Fevereiro</option>
              <option value="03">Março</option>
              <option value="04">Abril</option>
              <option value="05">Maio</option>
              <option value="06">Junho</option>
              <option value="07">Julho</option>
              <option value="08">Agosto</option>
              <option value="09">Setembro</option>
              <option value="10">Outubro</option>
              <option value="11">Novembro</option>
              <option value="12">Dezembro</option>
            </select>
          </div>

          <div className="text-[10px] text-zinc-500 uppercase tracking-widest">
            Registros Filtrados: <span className="text-white font-bold">{filteredExpenses.length} movimentos</span>
          </div>
        </div>

        {/* MÓDULO 1: FINANCIAL & TREASURY OS (COM GOVERNANÇA) */}
        {activeTab === 'treasury' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800/80 pb-6">
              <div>
                <h1 className="text-xl font-serif text-white uppercase tracking-widest">Controladoria & DRE de Governança</h1>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
                  Demonstrativo Financeiro Auditável e Histórico Comparativo Mês a Mês.
                </p>
              </div>

              <div className="flex bg-[#070707] border border-zinc-800 p-1 rounded-none text-[10px] font-bold uppercase tracking-widest">
                <button
                  onClick={() => { playHapticSound(); setTreasurySubTab('dre'); }}
                  className={`px-4 py-2 transition-all ${treasurySubTab === 'dre' ? 'bg-amber-400 text-black font-bold' : 'text-zinc-500 hover:text-white'}`}
                >
                  DRE Destaque
                </button>
                <button
                  onClick={() => { playHapticSound(); setTreasurySubTab('matrix'); }}
                  className={`px-4 py-2 transition-all ${treasurySubTab === 'matrix' ? 'bg-amber-400 text-black font-bold' : 'text-zinc-500 hover:text-white'}`}
                >
                  Matriz Mês a Mês
                </button>
                <button
                  onClick={() => { playHapticSound(); setTreasurySubTab('cashflow'); }}
                  className={`px-4 py-2 transition-all ${treasurySubTab === 'cashflow' ? 'bg-amber-400 text-black font-bold' : 'text-zinc-500 hover:text-white'}`}
                >
                  Fluxo de Caixa
                </button>
              </div>
            </div>

            {/* DRE DETALHADA */}
            {treasurySubTab === 'dre' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">Receita Bruta</span>
                    <span className="text-xl font-serif text-white block">R$ {financialMetrics.receitaBruta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">Lucro Bruto (CMV Abatido)</span>
                    <span className="text-xl font-serif text-emerald-400 block">R$ {financialMetrics.lucroBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1">
                    <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">OpEx Operacional + Ads</span>
                    <span className="text-xl font-serif text-red-400 block">R$ {financialMetrics.opexTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1 border-amber-500/30">
                    <span className="text-[9px] text-amber-400 uppercase tracking-widest block font-bold">EBITDA Líquido</span>
                    <span className="text-xl font-serif text-amber-400 block">R$ {financialMetrics.ebitda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <div className="bg-[#070707] border border-zinc-800 p-6 space-y-4 text-xs font-mono">
                  <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-3 tracking-widest">
                    Demonstrativo por Período Selecionado
                  </h2>
                  <div className="space-y-2">
                    <div className="flex justify-between py-2 border-b border-zinc-800 text-white font-bold">
                      <span>(+) RECEITA BRUTA</span>
                      <span>R$ {financialMetrics.receitaBruta.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between py-1 text-zinc-400 pl-4">
                      <span>(-) Impostos & Gateway</span>
                      <span className="text-red-400">- R$ {financialMetrics.impostosEGateway.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-zinc-800 text-zinc-200 font-bold bg-zinc-900/40 px-2">
                      <span>(=) RECEITA LÍQUIDA</span>
                      <span>R$ {financialMetrics.receitaLiquida.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between py-1 text-zinc-400 pl-4">
                      <span>(-) Custo Fabril dos Produtos (CMV)</span>
                      <span className="text-red-400">- R$ {financialMetrics.cmvTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-zinc-800 text-emerald-400 font-bold bg-emerald-950/10 px-2">
                      <span>(=) MARGEM BRUTA</span>
                      <span>R$ {financialMetrics.lucroBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between py-1 text-zinc-400 pl-4">
                      <span>(-) OpEx Operacional + Ads</span>
                      <span className="text-red-400">- R$ {financialMetrics.opexTotal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between py-3 border-t-2 border-amber-500/50 text-amber-400 font-serif text-sm font-bold bg-amber-950/20 px-3">
                      <span>(=) EBITDA LÍQUIDO</span>
                      <span>R$ {financialMetrics.ebitda.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* MATRIZ MÊS A MÊS */}
            {treasurySubTab === 'matrix' && (
              <div className="bg-[#070707] border border-zinc-800 p-6 space-y-6 overflow-x-auto">
                <h2 className="text-xs uppercase font-bold text-amber-400 tracking-widest border-b border-zinc-800 pb-3">
                  Evolução Histórica da DRE (Ano {selectedYear === 'ALL' ? '2026' : selectedYear})
                </h2>
                <table className="w-full text-left border-collapse font-mono text-[11px]">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400 uppercase text-[9px]">
                      <th className="py-3 px-2">Rubrica Contábil</th>
                      {monthlyMatrix.map((m) => (
                        <th key={m.label} className="py-3 px-2 text-right">{m.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/50">
                    <tr>
                      <td className="py-3 px-2 text-white font-bold">Receita Bruta</td>
                      {monthlyMatrix.map((m) => (
                        <td key={m.label} className="py-3 px-2 text-right text-zinc-200">
                          {m.receita > 0 ? `R$ ${m.receita.toLocaleString('pt-BR')}` : '-'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-2 text-zinc-400">(-) CMV Fabril</td>
                      {monthlyMatrix.map((m) => (
                        <td key={m.label} className="py-3 px-2 text-right text-red-400/80">
                          {m.cmv > 0 ? `- R$ ${m.cmv.toLocaleString('pt-BR')}` : '-'}
                        </td>
                      ))}
                    </tr>
                    <tr>
                      <td className="py-3 px-2 text-zinc-400">(-) OpEx + Ads</td>
                      {monthlyMatrix.map((m) => (
                        <td key={m.label} className="py-3 px-2 text-right text-red-400/80">
                          {m.opex > 0 ? `- R$ ${m.opex.toLocaleString('pt-BR')}` : '-'}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-amber-950/20 font-bold">
                      <td className="py-3 px-2 text-amber-400">(=) EBITDA Líquido</td>
                      {monthlyMatrix.map((m) => (
                        <td key={m.label} className="py-3 px-2 text-right text-amber-400">
                          {m.receita > 0 ? `R$ ${m.ebitda.toLocaleString('pt-BR')}` : '-'}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* FLUXO DE CAIXA DE TESOURARIA COM FORM DE DATA HISTÓRICA */}
            {treasurySubTab === 'cashflow' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#070707] border border-zinc-800 p-6 space-y-4">
                  <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-3 tracking-widest">
                    Lançamentos do Período (Cash Ledger)
                  </h2>
                  <div className="space-y-2 text-xs font-mono">
                    {filteredExpenses.map((cf: any) => (
                      <div key={cf.id} className="bg-[#040404] border border-zinc-800 p-3 flex justify-between items-center">
                        <div>
                          <span className="text-[9px] text-amber-500/80 block">{cf.date || '2026-09-29'} • {cf.category}</span>
                          <span className="text-white font-bold block">{cf.description}</span>
                        </div>
                        <span className={`font-bold ${cf.type === 'ENTRADA' ? 'text-emerald-400' : 'text-red-400'}`}>
                          {cf.type === 'ENTRADA' ? '+' : '-'} R$ {Number(cf.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleAddExpense} className="bg-[#070707] border border-zinc-800 p-6 space-y-3 text-xs h-fit font-mono">
                  <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3">Novo Lançamento</h2>
                  <input type="date" value={expDate} onChange={e=>setExpDate(e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <select value={expType} onChange={e=>setExpType(e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-white outline-none">
                    <option value="SAIDA">Saída (Débito)</option>
                    <option value="ENTRADA">Entrada (Crédito)</option>
                  </select>
                  <select value={expCategory} onChange={e=>setExpCategory(e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-white outline-none">
                    <option value="Tráfego Pago">Tráfego Pago</option>
                    <option value="Insumos / CMV">Insumos / CMV</option>
                    <option value="OpEx Fixos & SaaS">OpEx Fixos & SaaS</option>
                    <option value="Impostos & Gateway">Impostos & Gateway</option>
                    <option value="Vendas Direct-to-Consumer">Vendas Direct-to-Consumer</option>
                  </select>
                  <input type="text" value={expDesc} onChange={e=>setExpDesc(e.target.value)} placeholder="Descrição da Operação" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="number" step="0.01" value={expAmount} onChange={e=>setExpAmount(e.target.value)} placeholder="Valor (R$)" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <button type="submit" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest text-[10px]">Registrar no Caixa</button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* MÓDULO 2: ENGENHARIA DE ARTEFATOS & CMV FABRIL POR SKU */}
        {activeTab === 'products' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="text-xl font-serif text-white uppercase tracking-widest">Engenharia de Artefatos & CMV por SKU</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
                Desdobramento Físico e Financeiro dos Custos de Produção da LaRomme.
              </p>
            </div>

            {/* SIMULADOR DE STRESS DE INSUMOS */}
            <div className="bg-[#070707] border border-zinc-800 p-5 flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
              <div>
                <span className="text-amber-400 font-bold uppercase block text-[10px]">Simulador de Estresse da Cadeia Fabril:</span>
                <span className="text-zinc-400 text-[11px]">Projeção de choque na inflação de algodão e facção de costura</span>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="range" min="0" max="50" step="5" 
                  value={stressFactor} 
                  onChange={(e) => setStressFactor(Number(e.target.value))} 
                  className="accent-amber-400"
                />
                <span className="text-white font-bold bg-black border border-zinc-800 px-3 py-1">
                  +{stressFactor}% Choque
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* LISTA DE SKUS COM DETALHAMENTO DE CMV */}
              <div className="lg:col-span-2 space-y-4 font-mono text-xs">
                {activeProducts.map((p: any) => {
                  const fCost = (p.cost_fabric || 45.00) * (1 + stressFactor / 100);
                  const sCost = (p.cost_sewing || 25.00) * (1 + stressFactor / 100);
                  const pCost = p.cost_packaging || 15.00;
                  const lCost = p.cost_laser || 10.00;
                  const totalCmvUnit = fCost + sCost + pCost + lCost;
                  const price = Number(p.sale_price || p.price || 320.00);
                  const margemContrib = price - totalCmvUnit;
                  const markup = (price / totalCmvUnit).toFixed(2);

                  return (
                    <div key={p.id} className="bg-[#070707] border border-zinc-800 p-5 space-y-4">
                      <div className="flex justify-between items-start border-b border-zinc-800 pb-3">
                        <div>
                          <span className="text-amber-400 font-bold text-xs">{p.sku}</span>
                          <h3 className="text-white font-serif text-base">{p.name}</h3>
                          <span className="text-zinc-500 text-[10px]">{p.fabric_spec || p.fabric}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs text-zinc-400 block uppercase">Preço Final</span>
                          <span className="text-lg font-bold text-white">R$ {price.toFixed(2)}</span>
                        </div>
                      </div>

                      {/* COMPOSIÇÃO FABRIL */}
                      <div className="grid grid-cols-4 gap-2 text-[10px] text-zinc-400 bg-black p-3 border border-zinc-800/80">
                        <div>
                          <span className="block text-zinc-600">Tecelagem</span>
                          <span className="text-white font-bold">R$ {fCost.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="block text-zinc-600">Costura / Facção</span>
                          <span className="text-white font-bold">R$ {sCost.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="block text-zinc-600">Packaging</span>
                          <span className="text-white font-bold">R$ {pCost.toFixed(2)}</span>
                        </div>
                        <div>
                          <span className="block text-zinc-600">Laser Serial</span>
                          <span className="text-white font-bold">R$ {lCost.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-xs pt-2">
                        <div className="flex gap-4">
                          <span>CMV Fabril: <strong className="text-red-400">R$ {totalCmvUnit.toFixed(2)}</strong></span>
                          <span>Markup: <strong className="text-amber-400">{markup}x</strong></span>
                        </div>
                        <span className="text-emerald-400 font-bold">Margem/Peça: + R$ {margemContrib.toFixed(2)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* FORMULÁRIO DE ENGENHARIA DE PRODUTO */}
              <form onSubmit={handleAddProduct} className="bg-[#070707] border border-zinc-800 p-6 space-y-3 text-xs h-fit font-mono">
                <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3">Cadastrar Novo SKU</h2>
                <input type="text" value={prodName} onChange={e=>setProdName(e.target.value)} placeholder="Nome do Artefato" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                <input type="text" value={prodSku} onChange={e=>setProdSku(e.target.value)} placeholder="SKU (Ex: BOXY-BLK-M)" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                <input type="text" value={prodFabricSpec} onChange={e=>setProdFabricSpec(e.target.value)} placeholder="Especificação Tecido (Ex: 260GSM)" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                <input type="number" step="0.01" value={prodPrice} onChange={e=>setProdPrice(e.target.value)} placeholder="Preço de Venda (R$)" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />

                <div className="pt-2 border-t border-zinc-800 space-y-2">
                  <span className="text-[10px] text-amber-400 font-bold uppercase block">Composição de Custos:</span>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" step="0.01" value={prodFabricCost} onChange={e=>setProdFabricCost(e.target.value)} placeholder="Tecido (R$)" className="bg-black border border-zinc-800 p-2 text-white outline-none" />
                    <input type="number" step="0.01" value={prodSewingCost} onChange={e=>setProdSewingCost(e.target.value)} placeholder="Costura (R$)" className="bg-black border border-zinc-800 p-2 text-white outline-none" />
                    <input type="number" step="0.01" value={prodPackCost} onChange={e=>setProdPackCost(e.target.value)} placeholder="Packaging (R$)" className="bg-black border border-zinc-800 p-2 text-white outline-none" />
                    <input type="number" step="0.01" value={prodLaserCost} onChange={e=>setProdLaserCost(e.target.value)} placeholder="Laser (R$)" className="bg-black border border-zinc-800 p-2 text-white outline-none" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest text-[10px] mt-3">
                  Salvar Artefato com CMV
                </button>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}