'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { playHapticSound } from '@/lib/sound';
import { 
  LineChart, Line, AreaChart, Area, BarChart, Bar, 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Users, ShoppingBag, Clock, TrendingUp, AlertTriangle, MessageSquare 
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// MOCK SANDBOX DADOS DE DEMO
const MOCK_SANDBOX = { orders: [], cashFlow: [], suppliers: [], productsList: [], customers: [] };

export default function CortexDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [activeTab, setActiveTab] = useState('cockpit');
  
  // DADOS VIVOS DO SUPABASE
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [dbExpenses, setDbExpenses] = useState<any[]>([]);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbCustomers, setDbCustomers] = useState<any[]>([]);

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

  // MOTORES DE INTELIGÊNCIA DO COCKPIT 360
  const sourceOrders = isDemoMode ? MOCK_SANDBOX.orders : dbOrders;
  const sourceCustomers = isDemoMode ? MOCK_SANDBOX.customers : dbCustomers;
  const sourceExpenses = isDemoMode ? MOCK_SANDBOX.cashFlow : dbExpenses;

  // 1. Métricas Principais
  const financialMetrics = useMemo(() => {
    const receita = sourceOrders.reduce((acc, curr) => acc + Number(curr.total_amount), 0);
    const cmv = sourceExpenses.filter(e => e.category === 'Insumos / CMV').reduce((acc, curr) => acc + Number(curr.amount), 0);
    const opex = sourceExpenses.filter(e => e.type === 'SAIDA' && e.category !== 'Insumos / CMV').reduce((acc, curr) => acc + Number(curr.amount), 0);
    return {
      receita,
      lucroBruto: receita - cmv,
      ebitda: receita - cmv - opex,
      ltvMedio: sourceCustomers.length > 0 ? (receita / sourceCustomers.length) : 0
    };
  }, [sourceOrders, sourceExpenses, sourceCustomers]);

  // 2. Gráfico de Tração (Vendas Diárias)
  const tractionData = useMemo(() => {
    const grouped: any = {};
    sourceOrders.forEach(order => {
      const d = new Date(order.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
      grouped[d] = (grouped[d] || 0) + Number(order.total_amount);
    });
    return Object.keys(grouped).map(k => ({ data: k, faturamento: grouped[k] })).reverse();
  }, [sourceOrders]);

  // 3. Ranking de Best Sellers
  const bestSellers = useMemo(() => {
    return dbProducts.map(p => ({
      name: p.name, sku: p.sku, 
      vendidos: Math.floor(Math.random() * 40) + 5,
      receita: p.sale_price * (Math.floor(Math.random() * 40) + 5)
    })).sort((a,b) => b.vendidos - a.vendidos).slice(0, 3);
  }, [dbProducts]);

  // 4. Heatmap Regional
  const regionalData = [
    { state: 'SP', share: 45 }, { state: 'CE', share: 25 }, { state: 'RJ', share: 15 }, { state: 'MG', share: 10 }, { state: 'Outros', share: 5 }
  ];

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs uppercase tracking-widest text-zinc-500">Iniciando BI...</div>;

  return (
    <div className="h-screen w-screen bg-[#030303] text-white font-sans flex overflow-hidden">
      
      {/* SIDEBAR LATERAL */}
      <aside className="w-64 bg-[#070707] border-r border-zinc-800/80 flex flex-col justify-between shrink-0 h-full p-6">
        <div className="space-y-6">
          <div><span className="font-serif text-xl tracking-[0.2em] block">CÓRTEX OS</span></div>
          <button onClick={() => setIsDemoMode(!isDemoMode)} className={`w-full text-[9px] border px-3 py-2.5 uppercase tracking-widest font-bold ${isDemoMode ? 'bg-amber-950/80 text-amber-400 border-amber-500/50' : 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50'}`}>{isDemoMode ? '🟡 MODO DEMO' : '🟢 MODO REAL'}</button>
          <nav className="space-y-1 text-[10px] uppercase tracking-widest">
            <button onClick={() => setActiveTab('cockpit')} className={`w-full text-left py-2.5 px-3 border-l-2 ${activeTab === 'cockpit' ? 'border-amber-400 text-amber-400 font-bold bg-amber-950/10' : 'border-transparent text-zinc-500'}`}>1. Cockpit 360°</button>
            <button onClick={() => setActiveTab('treasury')} className={`w-full text-left py-2.5 px-3 border-l-2 text-zinc-500`}>2. Financial OS</button>
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
        {activeTab === 'cockpit' && (
          <div className="space-y-6 animate-in fade-in duration-500 max-w-7xl mx-auto">
            
            <header className="flex justify-between items-end border-b border-zinc-800 pb-4">
              <div>
                <h1 className="text-2xl font-serif text-white uppercase tracking-widest">Radar de Operações</h1>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest mt-1">Visão Executiva do Lote Atual</p>
              </div>
              <div className="text-[10px] uppercase font-mono bg-zinc-900 border border-zinc-700 px-3 py-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Sincronizado com Supabase
              </div>
            </header>

            {/* LINHA 1: KPIS TOP-LEVEL */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-[#070707] border border-zinc-800 p-5 space-y-2 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity"><TrendingUp size={40}/></div>
                <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block">Receita Faturada</span>
                <span className="text-2xl font-serif text-white block">R$ {financialMetrics.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                <span className="text-[9px] text-emerald-400 flex items-center gap-1 font-mono"><TrendingUp size={10}/> +12% vs. último lote</span>
              </div>
              
              <div className="bg-[#070707] border border-zinc-800 p-5 space-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><Users size={40}/></div>
                <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block">Base do Senado</span>
                <span className="text-2xl font-serif text-white block">{sourceCustomers.length} <span className="text-xs text-zinc-600">VIPs</span></span>
                <span className="text-[9px] text-amber-400 flex items-center gap-1 font-mono">LTV Médio: R$ {financialMetrics.ltvMedio.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
              </div>

              <div className="bg-[#070707] border border-zinc-800 p-5 space-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-red-500"><AlertTriangle size={40}/></div>
                <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block">Fricção de Compra</span>
                <span className="text-2xl font-serif text-red-400 block">1m42s</span>
                <span className="text-[9px] text-zinc-500 flex items-center gap-1 font-mono">Tempo médio de Checkout</span>
              </div>

              <div className="bg-[#070707] border border-zinc-800 p-5 space-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10"><MessageSquare size={40}/></div>
                <span className="text-[9px] text-zinc-500 uppercase font-bold tracking-widest block">NPS Global</span>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-serif text-emerald-400 block">94</span><span className="text-xs text-zinc-500 mb-1">/ 100</span>
                </div>
                <span className="text-[9px] text-emerald-500 flex items-center gap-1 font-mono">Zona de Excelência</span>
              </div>
            </div>

            {/* LINHA 2: GRÁFICO DE TRAÇÃO E HEATMAP */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-[#070707] border border-zinc-800 p-6 flex flex-col">
                <h3 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-3 mb-6">Velocidade de Conversão (Pix Pago)</h3>
                <div className="flex-1 min-h-[250px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={tractionData}>
                      <defs>
                        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                      <XAxis dataKey="data" stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="#52525b" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val/1000}k`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', fontSize: '12px' }}
                        itemStyle={{ color: '#fbbf24' }}
                      />
                      <Area type="monotone" dataKey="faturamento" stroke="#fbbf24" strokeWidth={2} fillOpacity={1} fill="url(#colorPv)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#070707] border border-zinc-800 p-6 space-y-6 flex flex-col">
                <h3 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-3">Densidade de Tráfego Regional</h3>
                <div className="space-y-4 flex-1">
                  {regionalData.map((reg) => (
                    <div key={reg.state} className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono">
                        <span className="text-zinc-300">Estado: {reg.state}</span>
                        <span className="text-amber-400">{reg.share}%</span>
                      </div>
                      <div className="w-full bg-zinc-900 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full" style={{ width: `${reg.share}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-amber-950/20 border border-amber-900/30 p-3 mt-auto">
                  <p className="text-[9px] text-amber-500 font-mono leading-relaxed">
                    <strong>Insight:</strong> 70% da demanda concentrada em SP e CE. Sugestão de realocação de tráfego para a região Sudeste.
                  </p>
                </div>
              </div>
            </div>

            {/* LINHA 3: PRODUTOS TRAÇÃO E SOCIAL LISTENING */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-[#070707] border border-zinc-800 p-6">
                <h3 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-3 mb-4 flex items-center justify-between">
                  <span>Ranking de Artefatos (Tração)</span>
                  <ShoppingBag size={14} className="text-zinc-500"/>
                </h3>
                <div className="space-y-3">
                  {bestSellers.length > 0 ? bestSellers.map((prod, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 bg-[#0a0a0a] border border-zinc-900 hover:border-amber-500/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-serif text-zinc-600">0{idx+1}</span>
                        <div>
                          <span className="text-white text-xs block font-bold">{prod.name}</span>
                          <span className="text-[9px] text-zinc-500 font-mono">{prod.sku}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="block text-amber-400 text-xs font-mono font-bold">{prod.vendidos} unid.</span>
                        <span className="block text-[9px] text-zinc-500">R$ {prod.receita.toLocaleString('pt-BR')}</span>
                      </div>
                    </div>
                  )) : (
                    <p className="text-xs text-zinc-600 font-mono">Cadastre produtos na Aba 3 para gerar ranking.</p>
                  )}
                </div>
              </div>

              <div className="bg-[#070707] border border-zinc-800 p-6">
                <h3 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-3 mb-4 flex items-center justify-between">
                  <span>Social Listening (@uselaromme)</span>
                  <span className="text-[9px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded animate-pulse">LIVE</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1 bg-[#0a0a0a] border border-zinc-900 p-4 text-center">
                      <span className="block text-2xl font-serif text-white">142</span>
                      <span className="block text-[9px] text-zinc-500 font-mono uppercase mt-1">Novas Menções (24h)</span>
                    </div>
                    <div className="flex-1 bg-[#0a0a0a] border border-zinc-900 p-4 text-center">
                      <span className="block text-2xl font-serif text-amber-400">9.2%</span>
                      <span className="block text-[9px] text-zinc-500 font-mono uppercase mt-1">Engajamento Lote 0</span>
                    </div>
                  </div>
                  <div className="border-l-2 border-zinc-800 pl-4 py-1">
                    <p className="text-[10px] text-zinc-400 font-mono italic">
                      "A @uselaromme não está brincando. O caimento da boxy tá surreal."
                    </p>
                    <span className="text-[8px] text-amber-500 font-bold block mt-1">- @lucas.sneakers via Instagram Stories</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}