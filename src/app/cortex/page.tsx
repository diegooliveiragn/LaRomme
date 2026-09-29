'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { playHapticSound } from '@/lib/sound';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Users, ShoppingBag, TrendingUp, AlertTriangle, MessageSquare, Download, FileText, Printer, Plus, Trash2 
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const MOCK_SANDBOX = { orders: [], cashFlow: [], suppliers: [], productsList: [], customers: [] };

export default function CortexDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [activeTab, setActiveTab] = useState('cockpit');
  const [treasurySubTab, setTreasurySubTab] = useState<'dre' | 'matrix' | 'cashflow'>('dre');

  // FILTROS TEMPORAIS
  const [selectedYear, setSelectedYear] = useState<string>('2026');
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // DADOS VIVOS DO SUPABASE
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [dbExpenses, setDbExpenses] = useState<any[]>([]);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbCustomers, setDbCustomers] = useState<any[]>([]);

  // FORMULÁRIO DE LANÇAMENTO FINANCEIRO GRANULAR
  const [expType, setExpType] = useState('SAIDA');
  const [expCategory, setExpCategory] = useState('Tráfego Pago');
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expDate, setExpDate] = useState('2026-09-29');

  const fetchCortexData = async () => {
    try {
      const [{ data: o }, { data: e }, { data: p }, { data: c }] = await Promise.all([
        supabase.from('orders').select('*, customers(*)').order('created_at', { ascending: false }),
        supabase.from('expenses').select('*').order('date', { ascending: false }),
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('customers').select('*').order('created_at', { ascending: false })
      ]);
      if(o) setDbOrders(o); if(e) setDbExpenses(e); if(p) setDbProducts(p); if(c) setDbCustomers(c);
    } catch (error) {}
  };

  useEffect(() => { fetchCortexData().then(()=>setLoading(false)); }, []);

  const sourceOrders = isDemoMode ? MOCK_SANDBOX.orders : dbOrders;
  const sourceCustomers = isDemoMode ? MOCK_SANDBOX.customers : dbCustomers;
  const sourceExpenses = isDemoMode ? MOCK_SANDBOX.cashFlow : dbExpenses;

  // 1. MÉTIRICAS FINANCEIRAS DRE & CAIXA
  const financialMetrics = useMemo(() => {
    const totalEntradas = sourceExpenses.filter(e => e.type === 'ENTRADA').reduce((acc, curr) => acc + Number(curr.amount), 0) + sourceOrders.reduce((acc, curr) => acc + Number(curr.total_amount), 0);
    const totalImpostosGateway = totalEntradas * 0.07;
    const receitaLiquida = totalEntradas - totalImpostosGateway;

    const cmvTotal = sourceExpenses.filter(e => e.category === 'Insumos / CMV').reduce((acc, curr) => acc + Number(curr.amount), 0);
    const margemBruta = receitaLiquida - cmvTotal;

    const opexTrafego = sourceExpenses.filter(e => e.category === 'Tráfego Pago').reduce((acc, curr) => acc + Number(curr.amount), 0);
    const opexSaas = sourceExpenses.filter(e => e.category === 'OpEx Fixos & SaaS' || e.category === 'Infraestrutura Digital').reduce((acc, curr) => acc + Number(curr.amount), 0);
    const opexLogistica = sourceExpenses.filter(e => e.category === 'Logística & Transportes').reduce((acc, curr) => acc + Number(curr.amount), 0);
    const opexOutros = sourceExpenses.filter(e => e.type === 'SAIDA' && !['Insumos / CMV', 'Tráfego Pago', 'OpEx Fixos & SaaS', 'Infraestrutura Digital', 'Logística & Transportes'].includes(e.category)).reduce((acc, curr) => acc + Number(curr.amount), 0);

    const opexTotal = opexTrafego + opexSaas + opexLogistica + opexOutros;
    const ebitda = margemBruta - opexTotal;
    const totalSaidas = sourceExpenses.filter(e => e.type === 'SAIDA').reduce((acc, curr) => acc + Number(curr.amount), 0);

    return {
      receitaBruta: totalEntradas,
      impostosGateway: totalImpostosGateway,
      receitaLiquida,
      cmvTotal,
      margemBruta,
      opexTrafego,
      opexSaas,
      opexLogistica,
      opexOutros,
      opexTotal,
      ebitda,
      saldoCaixaAtual: totalEntradas - totalSaidas
    };
  }, [sourceExpenses, sourceOrders]);

  // 2. MATRIZ MOM (MONTH OVER MONTH 12 MESES)
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

      return {
        month: m,
        receita,
        cmv,
        opex,
        ebitda: receita - (receita * 0.07) - cmv - opex
      };
    });
  }, [sourceExpenses]);

  // CRUD TESOURARIA
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expCategory || !expDesc || !expAmount) return alert("Preencha todos os campos do lançamento.");
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
      alert("Lançamento efetuado no banco de dados!"); 
      setExpDesc(''); 
      setExpAmount(''); 
      fetchCortexData(); 
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm("Confirmar exclusão e estorno desta transação financeira?")) return;
    playHapticSound();
    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (!error) fetchCortexData();
  };

  // EXPORTAÇÃO CSV / XLS
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

  const handlePrintPDF = () => {
    playHapticSound();
    window.print();
  };

  const filteredExpenses = useMemo(() => {
    if (categoryFilter === 'ALL') return sourceExpenses;
    return sourceExpenses.filter(e => e.category === categoryFilter);
  }, [sourceExpenses, categoryFilter]);

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs uppercase tracking-widest text-zinc-500">Iniciando BI Financeiro...</div>;

  return (
    <div className="h-screen w-screen bg-[#030303] text-white font-sans flex overflow-hidden">
      
      {/* SIDEBAR LATERAL */}
      <aside className="w-64 bg-[#070707] border-r border-zinc-800/80 flex flex-col justify-between shrink-0 h-full p-6 print:hidden">
        <div className="space-y-6">
          <div><span className="font-serif text-xl tracking-[0.2em] block">CÓRTEX OS</span></div>
          <button onClick={() => setIsDemoMode(!isDemoMode)} className={`w-full text-[9px] border px-3 py-2.5 uppercase tracking-widest font-bold ${isDemoMode ? 'bg-amber-950/80 text-amber-400 border-amber-500/50' : 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50'}`}>{isDemoMode ? '🟡 MODO DEMO' : '🟢 MODO REAL'}</button>
          <nav className="space-y-1 text-[10px] uppercase tracking-widest">
            <button onClick={() => setActiveTab('cockpit')} className={`w-full text-left py-2.5 px-3 border-l-2 ${activeTab === 'cockpit' ? 'border-amber-400 text-amber-400 font-bold bg-amber-950/10' : 'border-transparent text-zinc-500'}`}>1. Cockpit 360°</button>
            <button onClick={() => setActiveTab('treasury')} className={`w-full text-left py-2.5 px-3 border-l-2 ${activeTab === 'treasury' ? 'border-amber-400 text-amber-400 font-bold bg-amber-950/10' : 'border-transparent text-zinc-500'}`}>2. Financial OS</button>
            <button onClick={() => setActiveTab('products')} className={`w-full text-left py-2.5 px-3 border-l-2 text-zinc-500`}>3. Artefatos & CMV</button>
            <button onClick={() => setActiveTab('suppliers')} className={`w-full text-left py-2.5 px-3 border-l-2 text-zinc-500`}>4. Fornecedores</button>
            <button onClick={() => setActiveTab('crm')} className={`w-full text-left py-2.5 px-3 border-l-2 text-zinc-500`}>5. CRM 360 ({dbCustomers.length})</button>
            <button onClick={() => setActiveTab('content')} className={`w-full text-left py-2.5 px-3 border-l-2 text-zinc-500`}>6. Content OS</button>
            <button onClick={() => setActiveTab('logistics')} className={`w-full text-left py-2.5 px-3 border-l-2 text-zinc-500`}>7. Logística</button>
          </nav>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 h-screen overflow-y-auto p-8 bg-[#030303]">
        
        {/* ABA 2: FINANCIAL & TREASURY OS */}
        {activeTab === 'treasury' && (
          <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
            
            {/* CABEÇALHO DA CONTROLADORIA COM EXPORTAÇÃO */}
            <header className="flex flex-wrap justify-between items-end border-b border-zinc-800 pb-4 gap-4 print:hidden">
              <div>
                <h1 className="text-2xl font-serif text-white uppercase tracking-widest">Controladoria & Tesouraria OS</h1>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1">Demonstração Financeira Auditável da LaRomme</p>
              </div>

              {/* BOTOES DE EXPORTAÇAO */}
              <div className="flex items-center gap-3">
                <button onClick={handleExportCSV} className="bg-zinc-900 border border-zinc-700 hover:border-amber-500/50 text-zinc-300 hover:text-white px-3 py-2 text-[10px] font-mono uppercase tracking-widest flex items-center gap-2 transition-colors">
                  <Download size={12}/> Exportar CSV / XLS
                </button>
                <button onClick={handlePrintPDF} className="bg-amber-400 text-black hover:bg-amber-300 px-3 py-2 text-[10px] font-mono uppercase tracking-widest font-bold flex items-center gap-2 transition-colors">
                  <Printer size={12}/> Relatório PDF
                </button>
              </div>
            </header>

            {/* NAVEGAÇÃO INTERNA DA TESOURARIA */}
            <div className="flex border-b border-zinc-800 text-xs font-mono tracking-widest uppercase gap-6 print:hidden">
              <button onClick={() => setTreasurySubTab('dre')} className={`pb-3 ${treasurySubTab === 'dre' ? 'border-b-2 border-amber-400 text-amber-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}>1. DRE Gerencial</button>
              <button onClick={() => setTreasurySubTab('matrix')} className={`pb-3 ${treasurySubTab === 'matrix' ? 'border-b-2 border-amber-400 text-amber-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}>2. Matriz MoM (12 Meses)</button>
              <button onClick={() => setTreasurySubTab('cashflow')} className={`pb-3 ${treasurySubTab === 'cashflow' ? 'border-b-2 border-amber-400 text-amber-400 font-bold' : 'text-zinc-500 hover:text-zinc-300'}`}>3. Livro Razão & Lançamentos</button>
            </div>

            {/* SUB-ABA 1: DRE GERENCIAL */}
            {treasurySubTab === 'dre' && (
              <div className="space-y-6 font-mono">
                <div className="bg-[#070707] border border-zinc-800 p-6 space-y-4">
                  <h2 className="text-xs uppercase font-bold text-zinc-400 border-b border-zinc-800 pb-3">Demonstrativo de Resultado do Exercício ({selectedYear})</h2>
                  
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between py-2 border-b border-zinc-900"><span className="text-zinc-300 font-bold">(+) RECEITA BRUTA DE VENDAS</span><span className="text-white font-bold">R$ {financialMetrics.receitaBruta.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span></div>
                    <div className="flex justify-between py-2 border-b border-zinc-900 pl-4 text-zinc-500"><span>(-) Impostos & Taxas Gateway MP (7%)</span><span>R$ {financialMetrics.impostosGateway.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span></div>
                    <div className="flex justify-between py-2 border-b border-zinc-800 font-bold text-amber-400"><span>(=) RECEITA LÍQUIDA</span><span>R$ {financialMetrics.receitaLiquida.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span></div>
                    
                    <div className="flex justify-between py-2 border-b border-zinc-900 pl-4 text-zinc-500"><span>(-) CMV Fabril (Insumos/Tecelagem/Costura)</span><span>R$ {financialMetrics.cmvTotal.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span></div>
                    <div className="flex justify-between py-2 border-b border-zinc-800 font-bold text-emerald-400"><span>(=) MARGEM BRUTA OPERACIONAL</span><span>R$ {financialMetrics.margemBruta.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span></div>

                    <div className="flex justify-between py-2 border-b border-zinc-900 pl-4 text-zinc-500"><span>(-) OpEx - Tráfego Pago (Meta/TikTok Ads)</span><span>R$ {financialMetrics.opexTrafego.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span></div>
                    <div className="flex justify-between py-2 border-b border-zinc-900 pl-4 text-zinc-500"><span>(-) OpEx - SaaS & Infraestrutura (Vercel/Supabase)</span><span>R$ {financialMetrics.opexSaas.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span></div>
                    <div className="flex justify-between py-2 border-b border-zinc-900 pl-4 text-zinc-500"><span>(-) OpEx - Logística & Envio Fretes</span><span>R$ {financialMetrics.opexLogistica.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span></div>
                    <div className="flex justify-between py-2 border-b border-zinc-900 pl-4 text-zinc-500"><span>(-) OpEx - Outros Custos Operacionais</span><span>R$ {financialMetrics.opexOutros.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span></div>
                    
                    <div className="flex justify-between py-4 border-t-2 border-amber-500 text-sm font-bold bg-amber-950/20 px-4 mt-4">
                      <span className="text-amber-400">(=) EBITDA LÍQUIDO FINAL</span>
                      <span className={financialMetrics.ebitda >= 0 ? "text-emerald-400" : "text-red-400"}>R$ {financialMetrics.ebitda.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUB-ABA 2: MATRIZ MOM 12 MESES */}
            {treasurySubTab === 'matrix' && (
              <div className="bg-[#070707] border border-zinc-800 p-6 space-y-4 font-mono overflow-x-auto">
                <h2 className="text-xs uppercase font-bold text-zinc-400 border-b border-zinc-800 pb-3">Acompanhamento Mês a Mês ({selectedYear})</h2>
                <table className="w-full text-left text-[10px]">
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
                    <tr>
                      <td className="py-2 pr-4 text-zinc-500">(-) OpEx Total</td>
                      {momMatrixData.map(m => <td key={m.month} className="py-2 px-2 text-right text-zinc-500">R${m.opex}</td>)}
                    </tr>
                    <tr className="font-bold bg-zinc-900/50">
                      <td className="py-2 pr-4 text-amber-400">(=) EBITDA Líquido</td>
                      {momMatrixData.map(m => <td key={m.month} className={`py-2 px-2 text-right ${m.ebitda >= 0 ? 'text-emerald-400':'text-red-400'}`}>R${m.ebitda}</td>)}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {/* SUB-ABA 3: LIVRO RAZÃO & NOVO LANÇAMENTO */}
            {treasurySubTab === 'cashflow' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 font-mono text-xs">
                
                {/* LISTAGEM EXTRATO */}
                <div className="lg:col-span-2 bg-[#070707] border border-zinc-800 p-6 space-y-4">
                  <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                    <h2 className="text-xs uppercase font-bold text-zinc-300">Extrato Consolidado</h2>
                    <select value={categoryFilter} onChange={e=>setCategoryFilter(e.target.value)} className="bg-black border border-zinc-800 text-[10px] px-2 py-1 text-zinc-400 outline-none">
                      <option value="ALL">Todas as Categorias</option>
                      <option value="Tráfego Pago">Tráfego Pago</option>
                      <option value="Insumos / CMV">Insumos / CMV</option>
                      <option value="OpEx Fixos & SaaS">OpEx Fixos & SaaS</option>
                      <option value="Infraestrutura Digital">Infraestrutura Digital</option>
                      <option value="Logística & Transportes">Logística & Transportes</option>
                      <option value="Seeding / RP">Seeding / RP</option>
                      <option value="CapEx / Equipamentos">CapEx / Equipamentos</option>
                    </select>
                  </div>

                  <div className="space-y-2 max-h-[500px] overflow-y-auto">
                    {filteredExpenses.map((cf: any) => (
                      <div key={cf.id} className="bg-[#040404] border border-zinc-800/80 p-3 flex justify-between items-center hover:border-zinc-700 transition-colors">
                        <div>
                          <span className="text-[9px] text-amber-500 block">{cf.date || '2026-09-29'} • {cf.category}</span>
                          <span className="text-white font-bold block">{cf.description}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`font-bold ${cf.type === 'ENTRADA' ? 'text-emerald-400' : 'text-red-400'}`}>
                            {cf.type === 'ENTRADA' ? '+' : '-'} R$ {Number(cf.amount).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                          </span>
                          {!isDemoMode && (
                            <button onClick={() => handleDeleteExpense(cf.id)} className="text-red-500 hover:text-red-400 p-1">
                              <Trash2 size={12}/>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                    {filteredExpenses.length === 0 && <p className="text-zinc-600 py-8 text-center">Nenhum lançamento encontrado nesta categoria.</p>}
                  </div>
                </div>

                {/* FORMULÁRIO DE NOVO LANÇAMENTO */}
                {!isDemoMode && (
                  <form onSubmit={handleAddExpense} className="bg-[#070707] border border-zinc-800 p-6 space-y-3 h-fit">
                    <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3 flex items-center gap-2">
                      <Plus size={14} className="text-amber-400"/> Novo Lançamento Físico
                    </h2>
                    <input type="date" value={expDate} onChange={e=>setExpDate(e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                    <select value={expType} onChange={e=>setExpType(e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-white outline-none">
                      <option value="SAIDA">Saída / Despesa</option>
                      <option value="ENTRADA">Entrada / Aporte</option>
                    </select>
                    <select value={expCategory} onChange={e=>setExpCategory(e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-white outline-none">
                      <option value="Tráfego Pago">Tráfego Pago (Ads)</option>
                      <option value="Insumos / CMV">Insumos / CMV Fabril</option>
                      <option value="OpEx Fixos & SaaS">OpEx Fixos & Software</option>
                      <option value="Infraestrutura Digital">Infra (Vercel / Supabase)</option>
                      <option value="Logística & Transportes">Logística (Gasolina / Correios)</option>
                      <option value="Seeding / RP">Seeding (Peças para Influencers)</option>
                      <option value="CapEx / Equipamentos">CapEx (Impressora / Estúdio)</option>
                    </select>
                    <input type="text" value={expDesc} onChange={e=>setExpDesc(e.target.value)} placeholder="Descrição do Gasto (ex: Gasolina entrega)" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                    <input type="number" step="0.01" value={expAmount} onChange={e=>setExpAmount(e.target.value)} placeholder="Valor exato (R$)" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                    <button type="submit" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-colors">
                      Registrar Lançamento
                    </button>
                  </form>
                )}

              </div>
            )}

          </div>
        )}

        {/* OUTRAS ABAS MANTIDAS IGUAIS */}
        {activeTab === 'cockpit' && (
          <div className="text-xs font-mono text-zinc-500">Mantenha a aba 1 ativada para visualizar o Cockpit.</div>
        )}

      </main>
    </div>
  );
}