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
  Plus, Trash2, MessageCircle, Sparkles, Package, Layers, ShieldAlert, CheckCircle2 
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

  // ESTADOS VIVOS SUPABASE
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [dbExpenses, setDbExpenses] = useState<any[]>([]);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [dbSuppliers, setDbSuppliers] = useState<any[]>([]);
  const [dbCustomers, setDbCustomers] = useState<any[]>([]);

  // ESTADOS FORMULÁRIO ARTEFATOS (ABA 3)
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

  // STUDIO PREVIEW (STUDIO DE LANÇAMENTO)
  const [studioDescription, setStudioDescription] = useState('');
  const [studioActiveProduct, setStudioActiveProduct] = useState<any | null>(null);

  // ESTADOS FORMULÁRIO FORNECEDORES (ABA 4)
  const [supName, setSupName] = useState('');
  const [supType, setSupType] = useState('WHITELABEL');
  const [supMoq, setSupMoq] = useState('100');
  const [supLeadTime, setSupLeadTime] = useState('15');
  const [supCostUnit, setSupCostUnit] = useState('');
  const [supWhatsapp, setSupWhatsapp] = useState('');
  const [supScore, setSupScore] = useState('5.0');

  // FORMULÁRIO DE LANÇAMENTO FINANCEIRO (ABA 2)
  const [expType, setExpType] = useState('SAIDA');
  const [expCategory, setExpCategory] = useState('Tráfego Pago');
  const [expDesc, setExpDesc] = useState('');
  const [expAmount, setExpAmount] = useState('');
  const [expDate, setExpDate] = useState('2026-09-29');

  const fetchCortexData = async () => {
    try {
      const [{ data: o }, { data: e }, { data: p }, { data: s }, { data: c }] = await Promise.all([
        supabase.from('orders').select('*, customers(*)').order('created_at', { ascending: false }),
        supabase.from('expenses').select('*').order('date', { ascending: false }),
        supabase.from('products').select('*').order('created_at', { ascending: false }),
        supabase.from('suppliers').select('*').order('created_at', { ascending: false }),
        supabase.from('customers').select('*').order('created_at', { ascending: false })
      ]);
      if(o) setDbOrders(o); if(e) setDbExpenses(e); if(p) setDbProducts(p); if(s) setDbSuppliers(s); if(c) setDbCustomers(c);
    } catch (error) {}
  };

  useEffect(() => { fetchCortexData().then(()=>setLoading(false)); }, []);

  const sourceOrders = isDemoMode ? MOCK_SANDBOX.orders : dbOrders;
  const sourceCustomers = isDemoMode ? MOCK_SANDBOX.customers : dbCustomers;
  const sourceExpenses = isDemoMode ? MOCK_SANDBOX.cashFlow : dbExpenses;
  const sourceProducts = isDemoMode ? MOCK_SANDBOX.productsList : dbProducts;
  const sourceSuppliers = isDemoMode ? MOCK_SANDBOX.suppliers : dbSuppliers;

  // CÁLCULO DE CUSTO UNITÁRIO E PRECIFICAÇÃO INTELIGENTE
  const computedUnitCost = useMemo(() => {
    if (prodSourcing === 'WHITELABEL') {
      const contract = parseFloat(prodTotalContract) || 0;
      const qty = parseInt(prodBatchQty) || 1;
      return contract > 0 && qty > 0 ? contract / qty : 0;
    } else {
      return (parseFloat(prodFabricCost)||0) + (parseFloat(prodSewingCost)||0) + (parseFloat(prodPackCost)||0) + (parseFloat(prodLaserCost)||0);
    }
  }, [prodSourcing, prodTotalContract, prodBatchQty, prodFabricCost, prodSewingCost, prodPackCost, prodLaserCost]);

  const pricingScenarios = useMemo(() => {
    return {
      base: computedUnitCost * 2.2,
      conservador: computedUnitCost * 3.5,
      luxo: computedUnitCost * 5.5
    };
  }, [computedUnitCost]);

  // CÁLCULO CAPITAL IMOBILIZADO E VGV
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

  // AÇÕES CRUD ARTEFATOS
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodSku || !prodSalePrice) return alert("Preencha nome, SKU e preço de venda.");
    playHapticSound();

    const { error } = await supabase.from('products').insert([{ 
      name: prodName, 
      sku: prodSku, 
      sourcing_type: prodSourcing,
      sale_price: parseFloat(prodSalePrice), 
      cost_price: computedUnitCost, 
      cost_fabric: parseFloat(prodFabricCost)||0,
      cost_sewing: parseFloat(prodSewingCost)||0,
      cost_packaging: parseFloat(prodPackCost)||0,
      cost_laser: parseFloat(prodLaserCost)||0,
      fabric_spec: prodFabricSpec,
      stock_p: parseInt(prodStockP)||0,
      stock_m: parseInt(prodStockM)||0,
      stock_g: parseInt(prodStockG)||0,
      stock_gg: parseInt(prodStockGG)||0
    }]);

    if (!error) { 
      alert("Artefato publicado na base de dados!"); 
      setProdName(''); setProdSku(''); setProdSalePrice('');
      fetchCortexData(); 
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Remover este artefato do inventário?")) return;
    playHapticSound();
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (!error) fetchCortexData();
  };

  // GERADOR DE DESCRIÇÃO BRUTALISTA PARA O STUDIO
  const handleGenerateDescription = () => {
    playHapticSound();
    const desc = `Artefato construído em estrito alinhamento com a arquitetura têxtil da LaRomme. Tecido estruturado (${prodFabricSpec}), modelagem boxy com caimento pesado e acabamento minimalista. Peça produzida em lote limitado.`;
    setStudioDescription(desc);
  };

  // AÇÕES CRUD FORNECEDORES
  const handleAddSupplier = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supName || !supWhatsapp) return alert("Preencha nome e WhatsApp do fornecedor.");
    playHapticSound();

    const { error } = await supabase.from('suppliers').insert([{ 
      name: supName, 
      service_type: supType, 
      moq: parseInt(supMoq)||0, 
      lead_time_days: parseInt(supLeadTime)||0, 
      unit_cost: parseFloat(supCostUnit)||0,
      contact_whatsapp: supWhatsapp.replace(/\D/g, ''),
      quality_score: parseFloat(supScore)||5.0 
    }]);

    if (!error) { 
      alert("Fornecedor cadastrado!"); 
      setSupName(''); setSupWhatsapp(''); setSupCostUnit('');
      fetchCortexData(); 
    }
  };

  const handleDeleteSupplier = async (id: string) => {
    if (!confirm("Remover parceiro fabril?")) return;
    playHapticSound();
    const { error } = await supabase.from('suppliers').delete().eq('id', id);
    if (!error) fetchCortexData();
  };

  const handleSendWhatsAppOrder = (supplier: any, productSku?: string) => {
    playHapticSound();
    const phone = supplier.contact_whatsapp;
    if (!phone) return alert("Fornecedor sem WhatsApp cadastrado.");
    const msg = encodeURIComponent(`Olá ${supplier.name}, aqui é da LaRomme (@uselaromme). Gostaria de solicitar cotação e cronograma para um novo lote do SKU ${productSku || 'Lote Zero'}. Nosso MOQ pretendido é de ${supplier.moq || 100} peças. Aguardo retorno.`);
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono text-xs uppercase tracking-widest text-zinc-500">Iniciando Córtex OS...</div>;

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
            <button onClick={() => setActiveTab('products')} className={`w-full text-left py-2.5 px-3 border-l-2 ${activeTab === 'products' ? 'border-amber-400 text-amber-400 font-bold bg-amber-950/10' : 'border-transparent text-zinc-500'}`}>3. Artefatos & CMV</button>
            <button onClick={() => setActiveTab('suppliers')} className={`w-full text-left py-2.5 px-3 border-l-2 ${activeTab === 'suppliers' ? 'border-amber-400 text-amber-400 font-bold bg-amber-950/10' : 'border-transparent text-zinc-500'}`}>4. Fornecedores</button>
            <button onClick={() => setActiveTab('crm')} className={`w-full text-left py-2.5 px-3 border-l-2 text-zinc-500`}>5. CRM 360 ({dbCustomers.length})</button>
            <button onClick={() => setActiveTab('content')} className={`w-full text-left py-2.5 px-3 border-l-2 text-zinc-500`}>6. Content OS</button>
            <button onClick={() => setActiveTab('logistics')} className={`w-full text-left py-2.5 px-3 border-l-2 text-zinc-500`}>7. Logística</button>
          </nav>
        </div>
      </aside>

      {/* ÁREA PRINCIPAL */}
      <main className="flex-1 h-screen overflow-y-auto p-8 bg-[#030303]">
        
        {/* ABA 3: ARTEFATOS, CMV FABRIL & ESTOQUE */}
        {activeTab === 'products' && (
          <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto font-mono">
            
            <header className="flex justify-between items-end border-b border-zinc-800 pb-4">
              <div>
                <h1 className="text-2xl font-serif text-white uppercase tracking-widest">Artefatos & Engenharia Fabril</h1>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Gestão Híbrida de Custos, Precificação & Grade Preditiva</p>
              </div>
            </header>

            {/* PAINEL DE CAPITAL IMOBILIZADO E VGV */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1">
                <span className="text-[9px] text-zinc-500 uppercase block font-bold">Capital Imobilizado (Custo Pago)</span>
                <span className="text-xl font-serif text-amber-400 block">R$ {inventoryMetrics.capitalImobilizado.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                <span className="text-[9px] text-zinc-600 block">{inventoryMetrics.totalPecaFisica} peças em estoque físico</span>
              </div>
              <div className="bg-[#070707] border border-zinc-800 p-5 space-y-1">
                <span className="text-[9px] text-zinc-500 uppercase block font-bold">VGV Potencial (Valor de Mercado)</span>
                <span className="text-xl font-serif text-emerald-400 block">R$ {inventoryMetrics.vgvPotencial.toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                <span className="text-[9px] text-emerald-600 block">Faturamento bruto potencial</span>
              </div>
              <div className="bg-[#070707] border border-amber-900/30 bg-amber-950/10 p-5 space-y-1">
                <span className="text-[9px] text-amber-400 uppercase block font-bold flex items-center gap-1"><Sparkles size={12}/> BI Grade Preditiva por IA</span>
                <p className="text-[10px] text-zinc-300 leading-relaxed">
                  Proporção de Grade Sugerida para próximo lote: <strong className="text-amber-400">10% P | 30% M | 45% G | 15% GG</strong>. <i>(Tamanho G possui 70% a mais de procura).</i>
                </p>
              </div>
            </div>

            {/* CORPO CENTRAL: FORMULÁRIO + LISTAGEM */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* LISTA DE ARTEFATOS */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-2">Artefatos Catalogados ({sourceProducts.length})</h2>
                {sourceProducts.map((p: any) => (
                  <div key={p.id} className="bg-[#070707] border border-zinc-800 p-5 space-y-4 hover:border-zinc-700 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-amber-400 text-[10px] font-bold block">{p.sku} • {p.sourcing_type || 'WHITELABEL'}</span>
                        <h3 className="text-base font-serif text-white font-bold">{p.name}</h3>
                        <span className="text-[10px] text-zinc-500 block">{p.fabric_spec}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-white block">R$ {Number(p.sale_price).toFixed(2)}</span>
                        <span className="text-[10px] text-zinc-500 block">Custo Fabril: R$ {Number(p.cost_price).toFixed(2)}</span>
                      </div>
                    </div>

                    {/* MATRIZ DE GRADE DE ESTOQUE */}
                    <div className="bg-[#040404] p-3 border border-zinc-900 flex justify-between items-center text-[10px]">
                      <span className="text-zinc-500 font-bold">Grade Física:</span>
                      <div className="flex gap-4">
                        <span>P: <strong className="text-white">{p.stock_p || 0}</strong></span>
                        <span>M: <strong className="text-white">{p.stock_m || 0}</strong></span>
                        <span>G: <strong className="text-amber-400">{p.stock_g || 0}</strong></span>
                        <span>GG: <strong className="text-white">{p.stock_gg || 0}</strong></span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 text-[10px]">
                      <button onClick={() => setStudioActiveProduct(p)} className="text-amber-400 hover:underline flex items-center gap-1">
                        <Sparkles size={12}/> Abrir no Studio de Lançamento
                      </button>
                      {!isDemoMode && (
                        <button onClick={() => handleDeleteProduct(p.id)} className="text-red-500 hover:underline flex items-center gap-1">
                          <Trash2 size={12}/> Excluir Peça
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* FORMULÁRIO DE ENGENHARIA DE PRODUTO */}
              {!isDemoMode && (
                <form onSubmit={handleAddProduct} className="bg-[#070707] border border-zinc-800 p-6 space-y-4 text-xs h-fit">
                  <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3 flex items-center gap-2">
                    <Plus size={14} className="text-amber-400"/> Cadastrar Novo Artefato
                  </h2>

                  <input type="text" value={prodName} onChange={e=>setProdName(e.target.value)} placeholder="Nome do Artefato (ex: Boxy Vestigium)" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="text" value={prodSku} onChange={e=>setProdSku(e.target.value)} placeholder="SKU Único (ex: BOXY-BLK-M)" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  
                  {/* SELEÇÃO DE SOURCING HÍBRIDO */}
                  <div className="space-y-1">
                    <label className="text-[9px] text-zinc-500 uppercase block">Modelo de Produção:</label>
                    <select value={prodSourcing} onChange={e=>setProdSourcing(e.target.value as any)} className="w-full bg-black border border-zinc-800 p-2 text-white outline-none">
                      <option value="WHITELABEL">Whitelabel (Valor Fechado do Lote)</option>
                      <option value="FACCION">Facção (Insumos Separados)</option>
                    </select>
                  </div>

                  {prodSourcing === 'WHITELABEL' ? (
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" value={prodTotalContract} onChange={e=>setProdTotalContract(e.target.value)} placeholder="Contrato Total (R$)" className="bg-black border border-zinc-800 p-2 text-white outline-none" />
                      <input type="number" value={prodBatchQty} onChange={e=>setProdBatchQty(e.target.value)} placeholder="Total de Peças" className="bg-black border border-zinc-800 p-2 text-white outline-none" />
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <input type="number" step="0.01" value={prodFabricCost} onChange={e=>setProdFabricCost(e.target.value)} placeholder="Tecido (R$)" className="bg-black border border-zinc-800 p-2 text-white outline-none" />
                      <input type="number" step="0.01" value={prodSewingCost} onChange={e=>setProdSewingCost(e.target.value)} placeholder="Costura (R$)" className="bg-black border border-zinc-800 p-2 text-white outline-none" />
                      <input type="number" step="0.01" value={prodPackCost} onChange={e=>setProdPackCost(e.target.value)} placeholder="Embalagem (R$)" className="bg-black border border-zinc-800 p-2 text-white outline-none" />
                      <input type="number" step="0.01" value={prodLaserCost} onChange={e=>setProdLaserCost(e.target.value)} placeholder="Laser/Etiqueta (R$)" className="bg-black border border-zinc-800 p-2 text-white outline-none" />
                    </div>
                  )}

                  <div className="bg-[#040404] p-3 border border-zinc-800 space-y-1">
                    <span className="text-[9px] text-amber-400 block font-bold">Custo Unitário Calculado: R$ {computedUnitCost.toFixed(2)}</span>
                    <span className="text-[9px] text-zinc-500 block">Sugestões de Preço de Venda:</span>
                    <div className="flex justify-between text-[9px] font-mono text-zinc-300 pt-1">
                      <span>Base: R${pricingScenarios.base.toFixed(0)}</span>
                      <span>Cons.: R${pricingScenarios.conservador.toFixed(0)}</span>
                      <span className="text-amber-400 font-bold">Luxo: R${pricingScenarios.luxo.toFixed(0)}</span>
                    </div>
                  </div>

                  <input type="number" step="0.01" value={prodSalePrice} onChange={e=>setProdSalePrice(e.target.value)} placeholder="Preço Oficial de Venda (R$)" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none font-bold text-amber-400" />
                  
                  {/* ENTRADA DE GRADE INICIAL */}
                  <div className="grid grid-cols-4 gap-1 text-[10px]">
                    <input type="number" value={prodStockP} onChange={e=>setProdStockP(e.target.value)} placeholder="P" className="bg-black border border-zinc-800 p-1.5 text-center text-white" />
                    <input type="number" value={prodStockM} onChange={e=>setProdStockM(e.target.value)} placeholder="M" className="bg-black border border-zinc-800 p-1.5 text-center text-white" />
                    <input type="number" value={prodStockG} onChange={e=>setProdStockG(e.target.value)} placeholder="G" className="bg-black border border-zinc-800 p-1.5 text-center text-white" />
                    <input type="number" value={prodStockGG} onChange={e=>setProdStockGG(e.target.value)} placeholder="GG" className="bg-black border border-zinc-800 p-1.5 text-center text-white" />
                  </div>

                  <button type="submit" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-colors">
                    Publicar Artefato
                  </button>
                </form>
              )}

            </div>

            {/* STUDIO DE LANÇAMENTO (PREVIEW) */}
            {studioActiveProduct && (
              <div className="bg-[#070707] border border-amber-500/50 p-6 space-y-4 mt-8 animate-in fade-in">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                  <h3 className="text-xs uppercase font-bold text-amber-400 flex items-center gap-2">
                    <Sparkles size={14}/> Studio de Lançamento (Preview ao Vivo na Vitrine)
                  </h3>
                  <button onClick={() => setStudioActiveProduct(null)} className="text-zinc-500 text-[10px] hover:text-white">Fechar Preview</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* CARD PREVIEW DENTRO DA VITRINE */}
                  <div className="aspect-[3/4] bg-black border border-zinc-800 p-6 flex flex-col justify-between relative overflow-hidden">
                    <span className="font-serif text-6xl text-zinc-800 tracking-widest absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">LR</span>
                    <div className="z-10 flex justify-between text-[10px]">
                      <span className="bg-amber-400 text-black font-bold px-2 py-0.5">PREVIEW</span>
                      <span className="text-zinc-400">{studioActiveProduct.sku}</span>
                    </div>
                    <div className="z-10 space-y-1">
                      <h4 className="font-serif text-lg text-white font-bold uppercase">{studioActiveProduct.name}</h4>
                      <p className="text-[10px] text-zinc-400 leading-relaxed">{studioDescription || studioActiveProduct.fabric_spec}</p>
                      <span className="font-mono text-amber-400 text-sm block font-bold pt-2">R$ {Number(studioActiveProduct.sale_price).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <button onClick={handleGenerateDescription} className="w-full bg-zinc-900 border border-zinc-700 text-amber-400 py-2 text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-800">
                      <Sparkles size={12}/> Sugerir Descrição Cativante por IA
                    </button>
                    <textarea value={studioDescription} onChange={e=>setStudioDescription(e.target.value)} placeholder="Descrição do produto no site..." rows={5} className="w-full bg-black border border-zinc-800 p-3 text-white text-xs outline-none" />
                    <button onClick={() => alert("Artefato sincronizado com a Vitrine Dinâmica!")} className="w-full bg-amber-400 text-black font-bold py-3 text-[10px] uppercase tracking-widest hover:bg-amber-300">
                      Anexar Artefato & Atualizar Vitrine
                    </button>
                  </div>
                </div>
              </div>
            )}

          </div>
        )}

        {/* ABA 4: FORNECEDORES & WHATSAPP DIRETO */}
        {activeTab === 'suppliers' && (
          <div className="space-y-8 animate-in fade-in duration-500 max-w-7xl mx-auto font-mono">
            <header className="flex justify-between items-end border-b border-zinc-800 pb-4">
              <div>
                <h1 className="text-2xl font-serif text-white uppercase tracking-widest">Matriz de Fornecedores & Cadeia Fabril</h1>
                <p className="text-[10px] text-zinc-500 uppercase tracking-widest mt-1">Scorecards de Qualidade, MOQ e Pedido Direto via WhatsApp</p>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-xs">
              
              {/* LISTAGEM DE PARCEIROS */}
              <div className="lg:col-span-2 space-y-4">
                <h2 className="text-xs uppercase font-bold text-zinc-300 border-b border-zinc-800 pb-2">Oficinas & Facções Cadastradas ({sourceSuppliers.length})</h2>
                {sourceSuppliers.map((s: any) => (
                  <div key={s.id} className="bg-[#070707] border border-zinc-800 p-5 space-y-4 hover:border-zinc-700 transition-colors">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-amber-400 text-[10px] font-bold block">{s.service_type}</span>
                        <h3 className="text-base font-serif text-white font-bold">{s.name}</h3>
                        <span className="text-[10px] text-zinc-500 block">Lead Time: {s.lead_time_days} dias úteis</span>
                      </div>
                      <div className="text-right">
                        <span className="text-emerald-400 font-bold block">Score: {s.quality_score || '5.0'} / 5.0</span>
                        <span className="text-[10px] text-zinc-500 block">MOQ: {s.moq} unidades</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-zinc-900 text-[10px]">
                      <button onClick={() => handleSendWhatsAppOrder(s)} className="bg-emerald-950 text-emerald-400 border border-emerald-800/50 px-3 py-1.5 font-bold flex items-center gap-2 hover:bg-emerald-900">
                        <MessageCircle size={14}/> Disparar Pedido de Reposição via WhatsApp
                      </button>
                      {!isDemoMode && (
                        <button onClick={() => handleDeleteSupplier(s.id)} className="text-red-500 hover:underline">
                          Excluir Fornecedor
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {sourceSuppliers.length === 0 && <p className="text-zinc-600">Nenhum fornecedor cadastrado na base real.</p>}
              </div>

              {/* FORMULÁRIO DE NOVO FORNECEDOR */}
              {!isDemoMode && (
                <form onSubmit={handleAddSupplier} className="bg-[#070707] border border-zinc-800 p-6 space-y-3 h-fit">
                  <h2 className="text-xs uppercase font-bold text-zinc-200 border-b border-zinc-800 pb-3 flex items-center gap-2">
                    <Plus size={14} className="text-amber-400"/> Cadastrar Fornecedor
                  </h2>

                  <input type="text" value={supName} onChange={e=>setSupName(e.target.value)} placeholder="Nome da Oficina / Tecelagem" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <select value={supType} onChange={e=>setSupType(e.target.value)} className="w-full bg-black border border-zinc-800 p-2 text-white outline-none">
                    <option value="WHITELABEL">Whitelabel (Peça Pronta)</option>
                    <option value="COSTURA">Facção de Costura</option>
                    <option value="TECELAGEM">Tecelagem / Malharia</option>
                    <option value="EMBALAGEM">Packaging & Caixas</option>
                    <option value="LASER">Gravação Laser / Etiqueta</option>
                  </select>

                  <div className="grid grid-cols-2 gap-2">
                    <input type="number" value={supMoq} onChange={e=>setSupMoq(e.target.value)} placeholder="MOQ Mínimo" className="bg-black border border-zinc-800 p-2 text-white outline-none" />
                    <input type="number" value={supLeadTime} onChange={e=>setSupLeadTime(e.target.value)} placeholder="Lead Time (Dias)" className="bg-black border border-zinc-800 p-2 text-white outline-none" />
                  </div>

                  <input type="text" value={supWhatsapp} onChange={e=>setSupWhatsapp(e.target.value)} placeholder="WhatsApp com DDD (ex: 85999881122)" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />
                  <input type="number" step="0.1" value={supScore} onChange={e=>setSupScore(e.target.value)} placeholder="Score Qualidade (1.0 a 5.0)" className="w-full bg-black border border-zinc-800 p-2 text-white outline-none" />

                  <button type="submit" className="w-full bg-white text-black font-bold py-3 uppercase tracking-widest text-[10px] hover:bg-amber-400 transition-colors">
                    Salvar Parceiro Fabril
                  </button>
                </form>
              )}

            </div>
          </div>
        )}

      </main>
    </div>
  );
}