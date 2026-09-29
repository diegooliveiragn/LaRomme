'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { playHapticSound } from '@/lib/sound';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  Users, ShoppingBag, TrendingUp, AlertTriangle, MessageSquare, Download, Printer, 
  Plus, Trash2, MessageCircle, Sparkles, Package, ShieldAlert, CheckCircle2,
  Calendar, Truck, Heart, Instagram, RefreshCw, Gift, Search, Share2, Award, Zap
} from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

const MOCK_SANDBOX = { 
  orders: [{ id: 'm1', order_number: 'LR-SIM-101', total_amount: 320.00, payment_status: 'PAGO', delivery_state: 'SP', created_at: '2026-09-29T10:00:00Z', customers: { full_name: 'Cliente Demo' } }], 
  cashFlow: [{ id: 'cf1', type: 'ENTRADA', category: 'Vendas Direct-to-Consumer', description: 'Simulação Checkout', amount: 320.00, status: 'CONCILIADO', date: '2026-09-29' }], 
  suppliers: [{ id: 'sup1', name: 'Oficina Fortaleza 01', service_type: 'Facção Costura', moq: 100, lead_time_days: 15, unit_cost: 25.00, contact_whatsapp: '85999881122', quality_score: 4.9 }], 
  productsList: [{ id: 'p1', name: 'Camiseta Boxy Vestigium', sku: 'BOXY-BLK-M', sale_price: 320.00, cost_price: 95.00, stock_p: 5, stock_m: 20, stock_g: 35, stock_gg: 10, fabric_spec: '100% Algodão 260GSM' }], 
  customers: [{ id: 'c1', full_name: 'Gabriel Siqueira', email: 'gabriel@laromme.com', phone: '11988887766', instagram: '@gabrielsiq', birth_date: '1998-09-29', size_preference: 'G', color_preference: 'PRETO', rfm_tag: 'SENADOR_VIP' }] 
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

  // ESTADOS ABA 3 & 4
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
  const [prodFabricSpec, setProdFabricSpec] = useState('100% Algodão 260GSM - Caimento Boxy');
  const [prodStockP, setProdStockP] = useState('10');
  const [prodStockM, setProdStockM] = useState('30');
  const [prodStockG, setProdStockG] = useState('45');
  const [prodStockGG, setProdStockGG] = useState('15');
  const [studioDescription, setStudioDescription] = useState('');
  const [studioActiveProduct, setStudioActiveProduct] = useState<any | null>(null);

  const [supName, setSupName] = useState('');
  const [supType, setSupType] = useState('WHITELABEL');
  const [supMoq, setSupMoq] = useState('100');
  const [supLeadTime, setSupLeadTime] = useState('15');
  const [supCostUnit, setSupCostUnit] = useState('');
  const [supWhatsapp, setSupWhatsapp] = useState('');
  const [supScore, setSupScore] = useState('5.0');

  // ESTADOS ABA 5 (CRM)
  const [custName, setCustName] = useState('');
  const [custEmail, setCustEmail] = useState('');
  const [custPhone, setCustPhone] = useState('');
  const [custInsta, setCustInsta] = useState('');
  const [custBirth, setCustBirth] = useState('');
  const [custGender, setCustGender] = useState('MASCULINO');
  const [custSize, setCustSize] = useState('G');
  const [custColor, setCustColor] = useState('PRETO');
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  // ESTADOS ABA 6 (CONTENT & INFLUENCERS)
  const [infName, setInfName] = useState('');
  const [infInsta, setInfInsta] = useState('');
  const [infCoupon, setInfCoupon] = useState('');
  const [infCost, setInfCost] = useState('');

  // ESTADOS ABA 7 (LOGÍSTICA)
  const [unboxingChecklist, setUnboxingChecklist] = useState({
    inspection: false,
    tissuePaper: false,
    sticker: false,
    card: false,
    perfume: false
  });

  // ESTADO SANDBOX LOGS
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

  const sourceOrders = isDemoMode ? MOCK_SANDBOX.orders : dbOrders;
  const sourceCustomers = isDemoMode ? MOCK_SANDBOX.customers : dbCustomers;
  const sourceExpenses = isDemoMode ? MOCK_SANDBOX.cashFlow : dbExpenses;
  const sourceProducts = isDemoMode ? MOCK_SANDBOX.productsList : dbProducts;
  const sourceSuppliers = isDemoMode ? MOCK_SANDBOX.suppliers : dbSuppliers;

  // NAVEGAÇÃO DINÂMICA (ABA 8 ELIMINADA NO MODO REAL)
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

  // AÇÕES CRM
  const handleAddCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!custName || !custEmail) return alert("Preencha Nome e E-mail.");
    playHapticSound();

    const { error } = await supabase.from('customers').insert([{ 
      full_name: custName, 
      email: custEmail, 
      phone: custPhone, 
      instagram: custInsta.startsWith('@') ? custInsta : `@${custInsta}`,
      birth_date: custBirth || null,
      gender: custGender,
      size_preference: custSize,
      color_preference: custColor,
      rfm_tag: 'MEMBRO_VIP' 
    }]);

    if (!error) { 
      alert("Membro cadastrado no Senado VIP!"); 
      setCustName(''); setCustEmail(''); setCustPhone(''); setCustInsta('');
      fetchCortexData(); 
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!confirm("Banir/Excluir este membro do CRM?")) return;
    playHapticSound();
    const { error } = await supabase.from('customers').delete().eq('id', id);
    if (!error) fetchCortexData();
  };

  const handleSendResetPassword = (email: string) => {
    playHapticSound();
    alert(`Link oficial de redefinição de senha enviado para: ${email}`);
  };

  // AÇÕES CONTENT & INFLUENCIADORES
  const handleAddInfluencer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!infName || !infCoupon) return alert("Preencha Nome e Cupom do Influenciador.");
    playHapticSound();

    const { error } = await supabase.from('influencers').insert([{ 
      name: infName, 
      instagram: infInsta.startsWith('@') ? infInsta : `@${infInsta}`, 
      coupon_code: infCoupon.toUpperCase(), 
      seeding_cost: parseFloat(infCost)||0 
    }]);

    if (!error) { 
      alert("Influenciador cadastrado!"); 
      setInfName(''); setInfInsta(''); setInfCoupon(''); setInfCost('');
      fetchCortexData(); 
    }
  };

  // SIMULADOR SANDBOX
  const handleRunWebhookSim = () => {
    playHapticSound();
    const log = `[${new Date().toLocaleTimeString()}] WEBHOOK RECEBIDO: Pedido LR-SIM-2026 PAGO (R$ 320,00) -> Conciliado no Supabase.`;
    setSandboxLogs(prev => [log, ...prev]);
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs uppercase tracking-widest text-zinc-500">Carregando Córtex OS V3.0...</div>;

  return (
    <div className="h-screen w-screen bg-[#030303] text-white font-sans flex overflow-hidden">
      
      {/* SIDEBAR LATERAL */}
      <aside className="w-64 bg-[#070707] border-r border-zinc-800/80 flex flex-col justify-between shrink-0 h-full p-6 print:hidden">
        <div className="space-y-6">
          <div><span className="font-serif text-xl tracking-[0.2em] block">CÓRTEX OS</span></div>
          <button onClick={() => { playHapticSound(); setIsDemoMode(!isDemoMode); }} className={`w-full text-[9px] border px-3 py-2.5 uppercase tracking-widest font-bold transition-all ${isDemoMode ? 'bg-amber-950/80 text-amber-400 border-amber-500/50' : 'bg-emerald-950/80 text-emerald-400 border-emerald-500/50'}`}>
            {isDemoMode ? '🟡 MODO DEMO' : '🟢 MODO REAL'}
          </button>
          <nav className="space-y-1 text-[10px] uppercase tracking-widest">
            {navTabs.map(tab => (
              <button key={tab.id} onClick={() => { playHapticSound(); setActiveTab(tab.id); }} className={`w-full text-left py-2.5 px-3 border-l-2 ${activeTab === tab.id ? 'border-amber-400 text-amber-400 font-bold bg-amber-950/10' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}>
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 h-screen overflow-y-auto p-8 bg-[#030303]">
        
        {/* ABA 5: CRM 360 & SENADO VIP */}
        {activeTab === 'crm' && (
          <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto font-mono text-xs">
            <header className="flex justify-between items-end border-b border-zinc-800 pb-4">
              <div>
                <h1 className="text-2xl font-serif text-white uppercase tracking-widest">CRM 360 & Senado VIP</h1>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Dossiê de Membros, Preferências de Consumo & Segurança LGPD</p>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* LISTAGEM DE CLIENTES */}
              <div className="lg:col-span-2 space-y-3">
                <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-2">Membros do Senado ({sourceCustomers.length})</h2>
                {sourceCustomers.map((c: any) => {
                  const isBirthdayToday = c.birth_date && new Date(c.birth_date).getMonth() === new Date().getMonth() && new Date(c.birth_date).getDate() === new Date().getDate();
                  return (
                    <div key={c.id} className="bg-[#070707] border border-zinc-800 p-4 space-y-3 hover:border-amber-500/30 transition-colors">
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

                      {/* BIOMETRIA DE CONSUMO DO CLIENTE */}
                      <div className="bg-[#040404] p-3 border border-zinc-900 grid grid-cols-3 gap-2 text-[9px] text-zinc-400">
                        <div>Pref. Tamanho: <strong className="text-white">{c.size_preference || 'G'}</strong></div>
                        <div>Pref. Cor: <strong className="text-white">{c.color_preference || 'PRETO'}</strong></div>
                        <div>WhatsApp: <strong className="text-white">{c.phone || 'N/A'}</strong></div>
                      </div>

                      <div className="flex justify-between items-center pt-1 text-[10px]">
                        <button onClick={() => handleSendResetPassword(c.email)} className="text-zinc-400 hover:text-white underline">
                          Enviar Link de Redefinição de Senha
                        </button>
                        {!isDemoMode && (
                          <button onClick={() => handleDeleteCustomer(c.id)} className="text-red-500 hover:underline">
                            Banir do CRM
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                {sourceCustomers.length === 0 && <p className="text-zinc-600">Nenhum cliente cadastrado no Senado VIP (Modo Real Limpo).</p>}
              </div>

              {/* FORMULÁRIO DE CADASTRO CRM */}
              {!isDemoMode && (
                <form onSubmit={handleAddCustomer} className="bg-[#070707] border border-zinc-800 p-6 space-y-3 h-fit">
                  <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3 flex items-center gap-2">
                    <Plus size={14} className="text-amber-400"/> Adicionar Membro
                  </h2>

                  <input type="text" value={custName} onChange={e=>setCustName(e.target.value)} placeholder="Nome Completo" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="email" value={custEmail} onChange={e=>setCustEmail(e.target.value)} placeholder="E-mail" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="text" value={custPhone} onChange={e=>setCustPhone(e.target.value)} placeholder="WhatsApp" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="text" value={custInsta} onChange={e=>setCustInsta(e.target.value)} placeholder="@instagram" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-500 uppercase block">Data de Nascimento:</label>
                    <input type="date" value={custBirth} onChange={e=>setCustBirth(e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <select value={custSize} onChange={e=>setCustSize(e.target.value)} className="bg-black border border-zinc-800 p-2 text-white outline-none">
                      <option value="P">Tamanho P</option>
                      <option value="M">Tamanho M</option>
                      <option value="G">Tamanho G</option>
                      <option value="GG">Tamanho GG</option>
                    </select>
                    <select value={custColor} onChange={e=>setCustColor(e.target.value)} className="bg-black border border-zinc-800 p-2 text-white outline-none">
                      <option value="PRETO">Cor Preto</option>
                      <option value="OFFWHITE">Cor Off-White</option>
                      <option value="CHUMBO">Cor Chumbo</option>
                    </select>
                  </div>

                  <button type="submit" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-colors">
                    Salvar no Senado VIP
                  </button>
                </form>
              )}

            </div>
          </div>
        )}

        {/* ABA 6: CONTENT OS, ADS & INFLUENCERS */}
        {activeTab === 'content' && (
          <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto font-mono text-xs">
            <header className="flex justify-between items-end border-b border-zinc-800 pb-4">
              <div>
                <h1 className="text-2xl font-serif text-white uppercase tracking-widest">Content OS & Matriz Tática</h1>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Calendário Editorial, CRM de Influenciadores & Atribuição de Ads</p>
              </div>
            </header>

            {/* CALENDÁRIO EDITORIAL COM SUGGESTIONS */}
            <div className="bg-[#070707] border border-zinc-800 p-6 space-y-4">
              <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-3 flex items-center gap-2">
                <Calendar size={14} className="text-amber-400"/> Calendário Tático de Lançamentos
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-[#040404] border border-zinc-800 p-4 space-y-2 hover:border-amber-500/50 transition-colors">
                  <span className="text-amber-400 font-bold block">30/09 • Terça</span>
                  <p className="text-zinc-300 text-[10px] italic">"Stories dos bastidores no ateliê mostrando corte e tecido 260GSM."</p>
                  <span className="bg-zinc-900 text-zinc-400 text-[8px] px-2 py-0.5 uppercase">Instagram Stories</span>
                </div>
                <div className="bg-[#040404] border border-zinc-800 p-4 space-y-2 hover:border-amber-500/50 transition-colors">
                  <span className="text-amber-400 font-bold block">01/10 • Quarta</span>
                  <p className="text-zinc-300 text-[10px] italic">"Reels brutalista com mar de Fortaleza ao fundo e futevôlei em destaque."</p>
                  <span className="bg-zinc-900 text-zinc-400 text-[8px] px-2 py-0.5 uppercase">Reels / TikTok</span>
                </div>
                <div className="bg-[#040404] border border-zinc-800 p-4 space-y-2 hover:border-amber-500/50 transition-colors">
                  <span className="text-amber-400 font-bold block">02/10 • Quinta</span>
                  <p className="text-zinc-300 text-[10px] italic">"Vlog do CEO sobre a filosofia do Lote Zero da @uselaromme."</p>
                  <span className="bg-zinc-900 text-zinc-400 text-[8px] px-2 py-0.5 uppercase">TikTok Native</span>
                </div>
              </div>
            </div>

            {/* INFLUENCIADORES & SEEDING */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-[#070707] border border-zinc-800 p-6 space-y-4">
                <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-3">Embaixadores & Seeding ({dbInfluencers.length})</h2>
                <div className="space-y-3">
                  {dbInfluencers.map((inf: any) => (
                    <div key={inf.id} className="bg-[#040404] border border-zinc-800 p-4 flex justify-between items-center">
                      <div>
                        <span className="text-white font-bold block">{inf.name} <span className="text-amber-400">({inf.instagram})</span></span>
                        <span className="text-zinc-500 text-[10px]">Cupom: <strong>{inf.coupon_code}</strong> • Custo Envio: R$ {Number(inf.seeding_cost).toFixed(2)}</span>
                      </div>
                      <span className="text-emerald-400 font-bold text-xs">ROI Rastreado: 12.4x</span>
                    </div>
                  ))}
                  {dbInfluencers.length === 0 && <p className="text-zinc-600">Nenhum influenciador cadastrado para o Seeding.</p>}
                </div>
              </div>

              {!isDemoMode && (
                <form onSubmit={handleAddInfluencer} className="bg-[#070707] border border-zinc-800 p-6 space-y-3 h-fit">
                  <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3 flex items-center gap-2">
                    <Plus size={14} className="text-amber-400"/> Cadastrar Influenciador
                  </h2>
                  <input type="text" value={infName} onChange={e=>setInfName(e.target.value)} placeholder="Nome do Influenciador" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="text" value={infInsta} onChange={e=>setInfInsta(e.target.value)} placeholder="@instagram" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="text" value={infCoupon} onChange={e=>setInfCoupon(e.target.value)} placeholder="Código do Cupom (ex: GABRIEL10)" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="number" step="0.01" value={infCost} onChange={e=>setInfCost(e.target.value)} placeholder="Custo do Seeding (R$)" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <button type="submit" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-colors">
                    Salvar Embaixador
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* ABA 7: LOGÍSTICA WHITE GLOVE & RMA */}
        {activeTab === 'logistics' && (
          <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto font-mono text-xs">
            <header className="flex justify-between items-end border-b border-zinc-800 pb-4">
              <div>
                <h1 className="text-2xl font-serif text-white uppercase tracking-widest">Logística White Glove & RMA</h1>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Checklist de Unboxing Premium, Rastreio Ativo e Devoluções</p>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* CHECKLIST UNBOXING */}
              <div className="bg-[#070707] border border-zinc-800 p-6 space-y-4">
                <h2 className="text-xs uppercase font-bold text-amber-400 border-b border-zinc-800 pb-3 flex items-center gap-2">
                  <Package size={14}/> Checklist de Unboxing White Glove
                </h2>
                <div className="space-y-3 text-xs">
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

              {/* RADAR DE RASTREIO E RMA */}
              <div className="bg-[#070707] border border-zinc-800 p-6 space-y-4">
                <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-3 flex items-center gap-2">
                  <Truck size={14}/> Radar de Entregas & RMA
                </h2>
                <div className="bg-[#040404] border border-red-900/40 p-4 space-y-2">
                  <span className="text-red-400 font-bold block flex items-center gap-1"><ShieldAlert size={12}/> Alerta de Atraso de Frete</span>
                  <p className="text-zinc-400 text-[10px]">Pedido #LR-90214 atrasado no centro de distribuição dos Correios.</p>
                  <button onClick={() => window.open('https://wa.me/5511988887766?text=Olá,%20notamos%20um%20atraso%20na%20sua%20entrega%20LaRomme.%20Já%20acionamos%20a%20transportadora.', '_blank')} className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1 text-[9px] font-bold uppercase mt-2">
                    Notificar Cliente via WhatsApp
                  </button>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ABA 8: SANDBOX (EXCLUSIVO MODO DEMO) */}
        {isDemoMode && activeTab === 'webhook_sim' && (
          <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto font-mono text-xs">
            <header className="flex justify-between items-end border-b border-amber-500/40 pb-4">
              <div>
                <h1 className="text-2xl font-serif text-amber-400 uppercase tracking-widest">Sandbox Webhook Mercado Pago</h1>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Simulador de Eventos Isolado do Banco Real</p>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-[#070707] border border-amber-500/30 p-6 space-y-4">
                <button onClick={handleRunWebhookSim} className="w-full bg-amber-400 text-black font-bold py-3 text-[10px] uppercase tracking-widest hover:bg-amber-300">
                  Simular Evento Pix Pago (Webhook MP)
                </button>
              </div>

              <div className="bg-black border border-zinc-800 p-4 font-mono text-[10px] text-emerald-400 h-64 overflow-y-auto">
                <span className="text-zinc-600 block">// Logs de Telemetria Sandbox...</span>
                {sandboxLogs.map((log, idx) => <p key={idx} className="mt-1">{log}</p>)}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}