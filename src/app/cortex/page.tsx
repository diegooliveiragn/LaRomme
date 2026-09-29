'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { playHapticSound } from '@/lib/sound';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// MOCK DATA MANTIDO PARA O MODO DEMO
const MOCK_1_YEAR = {
  cashFlow: [
    { id: 'cf1', type: 'ENTRADA', category: 'Vendas Direct-to-Consumer', description: 'Liquidação Lote Zero (Set/26)', amount: 180000.00, status: 'CONCILIADO', date: '2026-09-12' },
    { id: 'cf2', type: 'SAIDA', category: 'Insumos / CMV', description: 'Tecelagem & Costura Lote Zero', amount: 54000.00, status: 'CONCILIADO', date: '2026-09-02' },
  ],
  productsList: [
    { id: 'p1', name: 'Camiseta Boxy Vestigium', sku: 'BOXY-BLK-M', price: 320.00, cost_fabric: 45.00, cost_sewing: 25.00, cost_packaging: 15.00, cost_laser: 10.00, stock: 142 },
  ],
  suppliers: [
    { id: 'sup1', name: 'Oficina Fortaleza 01', type: 'Facção de Costura', moq: 100, leadTime: 15 },
  ]
};

export default function CortexDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(true);

  const [activeTab, setActiveTab] = useState('webhook_sim');
  const [treasurySubTab, setTreasurySubTab] = useState<'dre' | 'matrix' | 'cashflow'>('dre');

  // GOVERNANÇA TEMPORAL
  const [selectedYear, setSelectedYear] = useState<string>('2026');
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

  // FORMULÁRIOS DA TESOURARIA
  const [expType, setExpType] = useState('SAIDA');
  const [expCategory, setExpCategory] = useState('Tráfego Pago');
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expDate, setExpDate] = useState('2026-09-29');

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
      console.error("Erro ao carregar dados do Supabase:", e);
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

  // --- LOGICA DE SIMULAÇÃO DO WEBHOOK MERCADO PAGO ---
  const handleCreateTestOrder = async () => {
    playHapticSound();
    setSimulating(true);
    setSimLog(prev => [...prev, "1. Gerando Cliente Fictício na tabela 'customers'..."]);

    // 1. Garante cliente no banco
    const { data: customerData, error: custErr } = await supabase
      .from('customers')
      .upsert([{
        full_name: 'Senador Teste Pix',
        email: 'senado.teste@laromme.com',
        rfm_tag: 'WAITLIST'
      }], { onConflict: 'email' })
      .select()
      .single();

    if (custErr) {
      setSimLog(prev => [...prev, "ERRO ao criar cliente: " + custErr.message]);
      setSimulating(false);
      return;
    }

    const testOrderNum = 'LR-SIM-' + Math.floor(1000 + Math.random() * 9000);
    setSimLog(prev => [...prev, `2. Criando Pedido ${testOrderNum} (R$ 320,00) com Status: PENDENTE...`]);

    // 2. Cria pedido com status PENDENTE
    const { data: orderData, error: orderErr } = await supabase
      .from('orders')
      .insert([{
        customer_id: customerData.id,
        order_number: testOrderNum,
        total_amount: 320.00,
        payment_status: 'PENDENTE',
        delivery_state: 'CE'
      }])
      .select()
      .single();

    if (orderErr) {
      setSimLog(prev => [...prev, "ERRO ao criar pedido: " + orderErr.message]);
      setSimulating(false);
      return;
    }

    setCurrentTestOrderId(orderData.id);
    setSimLog(prev => [...prev, `SUCESSO: Pedido gerado com ID ${orderData.id.slice(0, 8)}... Pronto para receber Webhook.`]);
    setSimulating(false);
    fetchCortexData();
  };

  const handleSimulateWebhookTrigger = async () => {
    if (!currentTestOrderId) return alert("Gere um pedido de teste primeiro.");

    playHapticSound();
    setSimulating(true);
    setSimLog(prev => [...prev, `3. Disparando POST para /api/webhooks/mercadopago com Pedido ID ${currentTestOrderId.slice(0, 8)}...`]);

    try {
      const response = await fetch('/api/webhooks/mercadopago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: currentTestOrderId,
          payment_status: 'PAGO'
        })
      });

      const result = await response.json();

      if (response.ok) {
        setSimLog(prev => [
          ...prev, 
          `4. Webhook retornado com SUCESSO 200 OK!`,
          `5. GATILHO POSTGRESQL DISPARADO: Linha de Entrada (+ R$ 320,00) gerada no Caixa e Cliente atualizado para MEMBRO_VIP!`
        ]);
        fetchCortexData();
      } else {
        setSimLog(prev => [...prev, `ERRO no Webhook: ${result.error}`]);
      }
    } catch (e: any) {
      setSimLog(prev => [...prev, `ERRO de Conexão: ${e.message}`]);
    } finally {
      setSimulating(false);
    }
  };

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
      alert("Lançamento registrado!");
      setExpDesc(''); setExpAmount('');
      fetchCortexData();
    }
  };

  // SELEÇÃO DE DADOS MOCK VS LIVE
  const rawExpenses = isDemoMode ? MOCK_1_YEAR.cashFlow : dbExpenses;
  const activeProducts = isDemoMode ? MOCK_1_YEAR.productsList : dbProducts;

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
    const impostosEGateway = totalEntradas * 0.07;
    const receitaLiquida = totalEntradas - impostosEGateway;
    const lucroBruto = receitaLiquida - cmvTotal;
    const ebitda = lucroBruto - opexTotal;

    return {
      receitaBruta: totalEntradas,
      impostosEGateway,
      receitaLiquida,
      cmvTotal,
      lucroBruto,
      opexTotal,
      ebitda,
      saldoCaixaAtual: totalEntradas - totalSaidas
    };
  }, [filteredExpenses]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center font-sans text-xs uppercase tracking-widest text-zinc-500">
        Iniciando Módulo de Simulação Webhook Mercado Pago...
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
              { id: 'webhook_sim', label: '1. Simulador Webhook Mercado Pago' },
              { id: 'treasury', label: '2. Financial & Treasury OS' },
              { id: 'products', label: '3. Artefatos & CMV Fabril' },
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
        
        {/* FILTRO TEMPORAL */}
        <div className="mb-8 p-4 bg-[#070707] border border-zinc-800 flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          <div className="flex items-center gap-3">
            <span className="text-amber-400 font-bold uppercase tracking-widest text-[10px]">Horizonte Temporal:</span>
            <select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)} className="bg-black border border-zinc-800 px-3 py-1.5 text-white outline-none">
              <option value="2026">Ano 2026</option>
              <option value="ALL">Todo o Histórico</option>
            </select>
          </div>
          <div className="text-[10px] text-zinc-500 uppercase tracking-widest">
            Modo Atual: <span className="text-white font-bold">{isDemoMode ? 'Simulação (Demo)' : 'Conectado ao Supabase (Live)'}</span>
          </div>
        </div>

        {/* MÓDULO 1: SIMULADOR DE WEBHOOK MERCADO PAGO */}
        {activeTab === 'webhook_sim' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div>
              <h1 className="text-xl font-serif text-white uppercase tracking-widest">Simulador de Webhook Mercado Pago</h1>
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">
                Ambiente de Teste para Validação da Liquidação Autônoma sem Dinheiro Real.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* PAINEL DE CONTROLE DE SIMULAÇÃO */}
              <div className="bg-[#070707] border border-zinc-800 p-6 space-y-6 font-mono text-xs">
                <h2 className="text-xs uppercase font-bold text-amber-400 border-b border-zinc-800 pb-3 tracking-widest">
                  Controle de Execução do Teste
                </h2>

                <div className="space-y-4">
                  <div className="bg-black border border-zinc-800 p-4 space-y-2">
                    <span className="text-zinc-400 text-[10px] block uppercase">Etapa A: Gerar Pedido de Teste</span>
                    <p className="text-zinc-500 text-[11px]">Cria um pedido fictício do Lote Zero no valor de R$ 320,00 no Supabase com status PENDENTE.</p>
                    <button
                      onClick={handleCreateTestOrder}
                      disabled={simulating}
                      className="w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 uppercase tracking-widest text-[10px] transition-colors"
                    >
                      {simulating ? 'Processando...' : '1. Gerar Pedido Teste Pix (R$ 320,00)'}
                    </button>
                  </div>

                  <div className="bg-black border border-zinc-800 p-4 space-y-2">
                    <span className="text-zinc-400 text-[10px] block uppercase">Etapa B: Notificação do Mercado Pago</span>
                    <p className="text-zinc-500 text-[11px]">Envia requisição POST para o Webhook indicando aprovação do Pix no gateway.</p>
                    <button
                      onClick={handleSimulateWebhookTrigger}
                      disabled={simulating || !currentTestOrderId}
                      className={`w-full font-bold py-3 uppercase tracking-widest text-[10px] transition-all ${
                        currentTestOrderId
                          ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                          : 'bg-zinc-900 text-zinc-600 cursor-not-allowed'
                      }`}
                    >
                      2. Simular Sinal de Pix Pago (Webhook MP)
                    </button>
                  </div>
                </div>

                {/* HISTÓRICO DE PEDIDOS NO BANCO */}
                <div className="pt-4 border-t border-zinc-800 space-y-3">
                  <span className="text-zinc-400 text-[10px] font-bold uppercase block">Pedidos na Tabela Orders (Supabase):</span>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {dbOrders.map((ord: any) => (
                      <div key={ord.id} className="bg-black border border-zinc-800 p-3 flex justify-between items-center text-[11px]">
                        <div>
                          <span className="text-white font-bold block">{ord.order_number}</span>
                          <span className="text-zinc-500 text-[9px]">{ord.customers?.full_name || 'Cliente'}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-white font-bold block">R$ {Number(ord.total_amount).toFixed(2)}</span>
                          <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${ord.payment_status === 'PAGO' ? 'bg-emerald-950 text-emerald-400' : 'bg-amber-950 text-amber-400'}`}>
                            {ord.payment_status}
                          </span>
                        </div>
                      </div>
                    ))}
                    {dbOrders.length === 0 && <p className="text-zinc-600 text-[11px]">Nenhum pedido cadastrado no Supabase.</p>}
                  </div>
                </div>
              </div>

              {/* TERMINAL DE LOGS DE TELEMETRIA */}
              <div className="bg-[#070707] border border-zinc-800 p-6 flex flex-col justify-between font-mono text-xs">
                <div className="space-y-4">
                  <h2 className="text-xs uppercase font-bold text-emerald-400 border-b border-zinc-800 pb-3 tracking-widest flex items-center justify-between">
                    <span>Terminal do Webhook em Tempo Real</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  </h2>

                  <div className="bg-black border border-zinc-800/80 p-4 rounded text-[10px] space-y-2 text-emerald-400 h-80 overflow-y-auto leading-relaxed">
                    <p className="text-zinc-600">// Aguardando simulação...</p>
                    {simLog.map((log, index) => (
                      <p key={index} className="border-b border-zinc-900/50 pb-1">{log}</p>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-800 text-[10px] text-zinc-500">
                  Ao aprovar o pedido via Webhook, verifique a aba <strong className="text-amber-400">Financial & Treasury OS</strong> no Modo Real para observar a nova linha de liquidação.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MÓDULO 2: FINANCIAL OS */}
        {activeTab === 'treasury' && (
          <div className="space-y-8 animate-in fade-in duration-300">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-6">
              <h1 className="text-xl font-serif text-white uppercase tracking-widest">Controladoria & DRE de Governança</h1>
              <div className="flex bg-[#070707] border border-zinc-800 p-1 text-[10px] font-bold uppercase tracking-widest">
                <button onClick={() => setTreasurySubTab('dre')} className={`px-4 py-2 ${treasurySubTab === 'dre' ? 'bg-amber-400 text-black font-bold' : 'text-zinc-500'}`}>DRE Destaque</button>
                <button onClick={() => setTreasurySubTab('cashflow')} className={`px-4 py-2 ${treasurySubTab === 'cashflow' ? 'bg-amber-400 text-black font-bold' : 'text-zinc-500'}`}>Fluxo de Caixa</button>
              </div>
            </div>

            {treasurySubTab === 'cashflow' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#070707] border border-zinc-800 p-6 space-y-4">
                  <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-3 tracking-widest">Extrato de Lançamentos (Cash Ledger)</h2>
                  <div className="space-y-2 text-xs font-mono">
                    {filteredExpenses.map((cf: any) => (
                      <div key={cf.id} className="bg-[#040404] border border-zinc-800 p-3 flex justify-between items-center">
                        <div>
                          <span className="text-[9px] text-amber-500 block">{cf.date || '2026-09-29'} • {cf.category}</span>
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
                  <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3">Lançamento Direto</h2>
                  <input type="date" value={expDate} onChange={e=>setExpDate(e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <select value={expType} onChange={e=>setExpType(e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-white outline-none">
                    <option value="SAIDA">Saída</option>
                    <option value="ENTRADA">Entrada</option>
                  </select>
                  <select value={expCategory} onChange={e=>setExpCategory(e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-white outline-none">
                    <option value="Tráfego Pago">Tráfego Pago</option>
                    <option value="Insumos / CMV">Insumos / CMV</option>
                    <option value="Vendas Direct-to-Consumer">Vendas Direct-to-Consumer</option>
                  </select>
                  <input type="text" value={expDesc} onChange={e=>setExpDesc(e.target.value)} placeholder="Descrição" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="number" step="0.01" value={expAmount} onChange={e=>setExpAmount(e.target.value)} placeholder="Valor (R$)" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <button type="submit" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest text-[10px]">Registrar Lançamento</button>
                </form>
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}