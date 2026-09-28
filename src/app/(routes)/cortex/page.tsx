'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { playHapticSound } from '@/lib/sound';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  date: string;
}

export default function CortexDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dre' | 'opex' | 'shipments'>('dre');

  // DADOS FINANCEIROS
  const [orders, setOrders] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);

  // FORMULÁRIO DE OPEX (CUSTOS OPERACIONAIS)
  const [expCategory, setExpCategory] = useState('Meta Ads');
  const [expDescription, setExpDescription] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [addingExp, setAddingExp] = useState(false);

  // FORMULÁRIO DE DESPACHO LOGÍSTICO
  const [shipOrderId, setShipOrderId] = useState('');
  const [trackingCode, setTrackingCode] = useState('');
  const [carrier, setCarrier] = useState('Correios');
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shipSuccessMsg, setShipSuccessMsg] = useState('');

  useEffect(() => {
    async function initCortex() {
      const ceoMode = localStorage.getItem('lr_ceo_mode');
      const email = localStorage.getItem('lr_user_email');

      if (ceoMode !== 'true' && email !== 'diegooliveiragn@gmail.com') {
        router.push('/acesso');
        return;
      }

      try {
        const { data: dbOrders } = await supabase.from('orders').select('*, customers(full_name, email)');
        if (dbOrders) setOrders(dbOrders);

        const { data: dbExpenses } = await supabase.from('expenses').select('*').order('date', { ascending: false });
        if (dbExpenses) setExpenses(dbExpenses);
      } catch (err) {
        console.error('Erro ao carregar dados do Córtex:', err);
      } finally {
        setLoading(false);
      }
    }
    initCortex();
  }, [router]);

  // CÁLCULO MESTRE DA DRE & EBITDA
  const dreMetrics = useMemo(() => {
    const paidOrders = orders.filter(o => o.payment_status === 'PAGO');
    const grossRevenue = paidOrders.reduce((acc, o) => acc + Number(o.total_amount || 0), 0);

    // Estimativas de Custo Direto (CMV + Taxas)
    const cogs = paidOrders.length * 95.00; // Custo unitário de produção/matéria-prima
    const gatewayFees = grossRevenue * 0.0399; // Taxa Média Pix/Gateway (~3.99%)
    const taxes = grossRevenue * 0.06; // Simples Nacional (~6%)

    const grossProfit = grossRevenue - cogs - gatewayFees - taxes;

    // OpEx (Custos Operacionais Lançados)
    const totalOpEx = expenses.reduce((acc, e) => acc + Number(e.amount || 0), 0);

    // EBITDA / Lucro Líquido Real
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
      totalOrdersCount: orders.length,
      paidOrdersCount: paidOrders.length
    };
  }, [orders, expenses]);

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
      const { data, error } = await supabase.from('expenses').insert([newExp]).select().single();
      if (!error && data) {
        setExpenses([data, ...expenses]);
      } else {
        // Fallback local caso a tabela no Supabase ainda esteja sendo sincronizada
        setExpenses([{ ...newExp, id: String(Date.now()) }, ...expenses]);
      }
      setExpDescription('');
      setExpAmount('');
    } catch (err) {
      setExpenses([{ ...newExp, id: String(Date.now()) }, ...expenses]);
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
        setShipSuccessMsg(`Rastreio ${trackingCode} despachado e e-mail enviado ao cliente.`);
        setTrackingCode('');
      } else {
        alert(data.error || 'Falha ao processar despacho.');
      }
    } catch (err) {
      alert('Erro na comunicação com servidor.');
    } finally {
      setShippingLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-[100dvh] bg-black text-white flex items-center justify-center font-sans text-xs uppercase tracking-widest text-zinc-500">
        Autenticando Córtex OS...
      </main>
    );
  }

  return (
    <main className="min-h-[100dvh] bg-black text-white font-sans flex flex-col items-center">
      
      {/* CABEÇALHO CÓRTEX OS */}
      <header className="w-full px-6 pt-14 pb-6 flex justify-between items-center max-w-6xl mx-auto border-b border-zinc-900">
        <div className="flex items-center gap-3">
          <span className="font-serif text-xl tracking-widest text-white">LaRomme.</span>
          <span className="text-[9px] bg-zinc-900 text-zinc-400 border border-zinc-800 px-2.5 py-0.5 uppercase tracking-widest font-sans">
            Córtex OS • CEO
          </span>
        </div>
        <Link href="/" onClick={playHapticSound} className="text-[10px] font-sans uppercase tracking-widest text-zinc-500 hover:text-white transition-colors">
          Encerrar Painel
        </Link>
      </header>

      <div className="flex-1 w-full max-w-6xl mx-auto px-6 py-10 space-y-12">
        
        {/* TAB NAVIGATION */}
        <div className="flex border-b border-zinc-900 font-sans text-[10px] uppercase tracking-widest">
          <button
            onClick={() => { playHapticSound(); setActiveTab('dre'); }}
            className={`pb-4 px-6 transition-colors ${activeTab === 'dre' ? 'text-white border-b-2 border-white font-bold' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            DRE & EBITDA Real
          </button>
          <button
            onClick={() => { playHapticSound(); setActiveTab('opex'); }}
            className={`pb-4 px-6 transition-colors ${activeTab === 'opex' ? 'text-white border-b-2 border-white font-bold' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            Lançar OpEx (Custos)
          </button>
          <button
            onClick={() => { playHapticSound(); setActiveTab('shipments'); }}
            className={`pb-4 px-6 transition-colors ${activeTab === 'shipments' ? 'text-white border-b-2 border-white font-bold' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            Despacho & Rastreio
          </button>
        </div>

        {/* ABA 1: DRE & EBITDA REAL */}
        {activeTab === 'dre' && (
          <div className="space-y-10 animate-in fade-in duration-300">
            
            {/* CARDS DE DESTAQUE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#050505] border border-zinc-900 p-6 space-y-2">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">Receita Bruta</span>
                <span className="text-2xl font-serif text-white block">R$ {dreMetrics.grossRevenue.toFixed(2)}</span>
                <span className="text-[9px] text-zinc-600 block">{dreMetrics.paidOrdersCount} pedidos liquidados</span>
              </div>

              <div className="bg-[#050505] border border-zinc-900 p-6 space-y-2">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">Custos Operacionais (OpEx)</span>
                <span className="text-2xl font-serif text-amber-400 block">R$ {dreMetrics.totalOpEx.toFixed(2)}</span>
                <span className="text-[9px] text-zinc-600 block">Tráfego, Embalagens & SaaS</span>
              </div>

              <div className="bg-[#050505] border border-zinc-900 p-6 space-y-2">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">EBITDA (Lucro Real)</span>
                <span className={`text-2xl font-serif block ${dreMetrics.ebitda >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  R$ {dreMetrics.ebitda.toFixed(2)}
                </span>
                <span className="text-[9px] text-zinc-600 block">Resultado Líquido Final</span>
              </div>

              <div className="bg-[#050505] border border-zinc-900 p-6 space-y-2">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">Margem EBITDA</span>
                <span className="text-2xl font-serif text-white block">{dreMetrics.ebitdaMargin.toFixed(1)}%</span>
                <span className="text-[9px] text-zinc-600 block">Eficiência do Modelo</span>
              </div>
            </div>

            {/* DEMONSTRATIVO DETALHADO (DRE) */}
            <div className="bg-[#050505] border border-zinc-900 p-8 space-y-6">
              <h2 className="text-xs font-sans uppercase tracking-widest text-zinc-300 border-b border-zinc-800 pb-4">
                Demonstrativo do Resultado do Exercício
              </h2>

              <div className="space-y-3 font-sans text-xs">
                <div className="flex justify-between text-zinc-300 py-1 border-b border-zinc-900">
                  <span>(+) Receita Operacional Bruta</span>
                  <span className="font-bold text-white">R$ {dreMetrics.grossRevenue.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-500 py-1 border-b border-zinc-900 pl-4">
                  <span>(-) Deduções de Impostos (Simples 6%)</span>
                  <span>R$ {dreMetrics.taxes.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-500 py-1 border-b border-zinc-900 pl-4">
                  <span>(-) Taxas de Gateway / Pix (~3.99%)</span>
                  <span>R$ {dreMetrics.gatewayFees.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-500 py-1 border-b border-zinc-900 pl-4">
                  <span>(-) Custo da Peça / Matéria-Prima (CMV)</span>
                  <span>R$ {dreMetrics.cogs.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-zinc-300 py-2 border-b border-zinc-800 font-bold">
                  <span>(=) Lucro Bruto</span>
                  <span>R$ {dreMetrics.grossProfit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-amber-500/80 py-1 border-b border-zinc-900 pl-4">
                  <span>(-) Custos Operacionais Lançados (OpEx Total)</span>
                  <span>R$ {dreMetrics.totalOpEx.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-emerald-400 py-3 border-t border-zinc-700 text-sm font-bold uppercase tracking-widest">
                  <span>(=) EBITDA (Resultado Líquido Real)</span>
                  <span>R$ {dreMetrics.ebitda.toFixed(2)}</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* ABA 2: LANÇAR OPEX (CUSTOS OPERACIONAIS) */}
        {activeTab === 'opex' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 animate-in fade-in duration-300">
            
            <form onSubmit={handleAddExpense} className="lg:col-span-1 bg-[#050505] border border-zinc-900 p-8 space-y-6 h-fit">
              <h2 className="text-xs font-sans uppercase tracking-widest text-zinc-300 border-b border-zinc-800 pb-3">
                Novo Lançamento de Custo
              </h2>

              <div className="space-y-4 text-xs font-sans">
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-400 uppercase tracking-widest">Categoria</label>
                  <select
                    value={expCategory}
                    onChange={(e) => setExpCategory(e.target.value)}
                    className="w-full bg-black border border-zinc-800 px-4 py-3 text-white outline-none focus:border-zinc-500"
                  >
                    <option value="Meta Ads">Tráfego Pago / Meta Ads</option>
                    <option value="Embalagem">Caixas & Sacolas de Envio</option>
                    <option value="Software/SaaS">Softwares & Hospedagem</option>
                    <option value="Logistica">Frete Fixo / Coleta</option>
                    <option value="Outros">Outras Despesas</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-400 uppercase tracking-widest">Descrição</label>
                  <input
                    type="text"
                    placeholder="Ex: Campanha Tráfego Lote Zero - Semana 01"
                    value={expDescription}
                    onChange={(e) => setExpDescription(e.target.value)}
                    className="w-full bg-black border border-zinc-800 px-4 py-3 text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-400 uppercase tracking-widest">Valor (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="500.00"
                    value={expAmount}
                    onChange={(e) => setExpAmount(e.target.value)}
                    className="w-full bg-black border border-zinc-800 px-4 py-3 text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={addingExp}
                  className="w-full bg-white text-black font-bold text-[10px] uppercase tracking-widest py-4 hover:bg-zinc-200 transition-colors disabled:opacity-50 mt-2"
                >
                  {addingExp ? 'Gravando...' : 'Lançar no Córtex'}
                </button>
              </div>
            </form>

            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xs font-sans uppercase tracking-widest text-zinc-300 border-b border-zinc-900 pb-3">
                Histórico de OpEx Registrados
              </h2>

              {expenses.length === 0 ? (
                <div className="bg-[#050505] border border-zinc-900 p-8 text-center text-[10px] uppercase tracking-widest text-zinc-500">
                  Nenhum custo registrado no período.
                </div>
              ) : (
                <div className="space-y-2 font-sans">
                  {expenses.map((exp) => (
                    <div key={exp.id} className="bg-[#050505] border border-zinc-800/80 p-5 flex justify-between items-center">
                      <div className="space-y-1">
                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">{exp.category} • {exp.date}</span>
                        <span className="text-xs text-white uppercase tracking-wider block font-bold">{exp.description}</span>
                      </div>
                      <span className="text-sm text-amber-400 font-serif font-bold">
                        - R$ {Number(exp.amount).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ABA 3: DESPACHO LOGÍSTICO & RASTREIO */}
        {activeTab === 'shipments' && (
          <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in duration-300">
            <div className="bg-[#050505] border border-zinc-900 p-8 space-y-6">
              <div>
                <h2 className="text-xs font-sans uppercase tracking-widest text-zinc-300 border-b border-zinc-800 pb-3">
                  Inspecionar & Despachar Artefato
                </h2>
                <p className="text-[10px] text-zinc-500 mt-2">
                  O envio do código de rastreio dispara automaticamente o e-mail transacional White Glove para o cliente.
                </p>
              </div>

              {shipSuccessMsg && (
                <div className="bg-emerald-950/30 border border-emerald-800 text-emerald-400 p-4 text-[10px] uppercase tracking-widest text-center font-sans">
                  ✓ {shipSuccessMsg}
                </div>
              )}

              <form onSubmit={handleDispatchOrder} className="space-y-4 font-sans text-xs">
                <div className="space-y-2">
                  <label className="text-[10px] text-zinc-400 uppercase tracking-widest">Selecionar Pedido</label>
                  <select
                    value={shipOrderId}
                    onChange={(e) => setShipOrderId(e.target.value)}
                    required
                    className="w-full bg-black border border-zinc-800 px-4 py-3 text-white outline-none focus:border-zinc-500"
                  >
                    <option value="">Selecione um pedido pendente</option>
                    {orders.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.order_number} — {o.customers?.full_name || 'Cliente'} (R$ {o.total_amount})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-400 uppercase tracking-widest">Transportadora</label>
                    <select
                      value={carrier}
                      onChange={(e) => setCarrier(e.target.value)}
                      className="w-full bg-black border border-zinc-800 px-4 py-3 text-white outline-none focus:border-zinc-500"
                    >
                      <option value="Correios SEDEX">Correios SEDEX</option>
                      <option value="JADLOG Express">JADLOG Express</option>
                      <option value="Loggi Prime">Loggi Prime</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] text-zinc-400 uppercase tracking-widest">Código de Rastreio</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: AA123456789BR"
                      value={trackingCode}
                      onChange={(e) => setTrackingCode(e.target.value)}
                      className="w-full bg-black border border-zinc-800 px-4 py-3 text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={shippingLoading}
                  className="w-full bg-white text-black font-bold text-[10px] uppercase tracking-widest py-4 hover:bg-zinc-200 transition-colors disabled:opacity-50 mt-4"
                >
                  {shippingLoading ? 'Notificando Cliente...' : 'Despachar Artefato & Enviar E-mail'}
                </button>
              </form>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}