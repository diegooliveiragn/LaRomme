'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Supplier {
  id: string;
  trade_name: string;
  category: string;
  contact_info?: any;
  status: string;
}

interface ProductionOrder {
  id: string;
  op_code: string;
  supplier_id: string;
  product_id?: string;
  quantity_requested: number;
  unit_cost_agreed?: number;
  total_order_value?: number;
  status: string;
  target_delivery_date?: string;
}

export default function CortexSupplyPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [orders, setOrders] = useState<ProductionOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'FORNECEDORES' | 'OPS'>('OPS');
  const [showOpModal, setShowOpModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form para nova OP
  const [opSupplier, setOpSupplier] = useState('');
  const [opProduct, setOpProduct] = useState('');
  const [opQuantity, setOpQuantity] = useState('');
  const [opUnitCost, setOpUnitCost] = useState('');
  const [opDate, setOpDate] = useState('');

  const fetchSupplyData = async () => {
    setLoading(true);
    try {
      const { data: supData, error: supErr } = await supabase
        .from('suppliers')
        .select('*')
        .order('trade_name', { ascending: true });

      if (!supErr && supData) {
        setSuppliers(supData as Supplier[]);
      }

      const { data: opData, error: opErr } = await supabase
        .from('production_orders')
        .select('*')
        .order('op_code', { ascending: false });

      if (!opErr && opData) {
        setOrders(opData as ProductionOrder[]);
      }
    } catch (err) {
      console.error('Erro ao carregar Supply Chain:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSupplyData();
  }, []);

  const handleCreateOP = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const quantity = parseInt(opQuantity);
      const cost = parseFloat(opUnitCost);
      const total = quantity * cost;
      const randomCode = `OP-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const newOp = {
        op_code: randomCode,
        supplier_id: opSupplier,
        product_id: opProduct,
        quantity_requested: quantity,
        unit_cost_agreed: cost,
        total_order_value: total,
        status: 'IN_PRODUCTION',
        target_delivery_date: opDate || null,
      };

      const { data, error } = await supabase
        .from('production_orders')
        .insert([newOp])
        .select();

      if (error) throw error;

      if (data && data[0]) {
        setOrders((prev) => [data[0] as ProductionOrder, ...prev]);
      }
      
      setShowOpModal(false);
      alert(`Ordem de Produção ${randomCode} criada com sucesso!`);
    } catch (err) {
      alert('Falha ao registrar Ordem de Produção.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'IN_PRODUCTION':
        return <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30">Em Confecção</span>;
      case 'QUALITY_INSPECTION':
        return <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">Auditoria (QA)</span>;
      case 'COMPLETED':
        return <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">Concluída (Em Estoque)</span>;
      case 'DRAFT':
        return <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-slate-800 text-slate-300">Cotação / Rascunho</span>;
      default:
        return <span className="px-2.5 py-1 rounded text-[10px] font-bold bg-slate-800 text-slate-300">{status}</span>;
    }
  };

  const getCategoryName = (cat: string) => {
    const map: Record<string, string> = {
      TECIDOS_MALHAS: 'Tecelagem & Malharia',
      AVIAMENTOS_METAIS: 'Aviamentos & Metais',
      FACCAO_COSTURA: 'Oficina de Costura (Facção)',
      ESTAMPARIA_BORDADO: 'Estamparia & Bordado',
      EMBALAGENS_GRAFICA: 'Gráfica & Embalagens',
      PRIVATE_LABEL_FULL: 'Produção Vertical (Private Label)',
    };
    return map[cat] || cat;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/40 pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-wide uppercase">Supply Chain & Facções</h1>
          <p className="text-xs text-slate-400 mt-1">Matriz de Fornecedores, Custos de Produção e Rastreio de Lotes</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowOpModal(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-sm"
          >
            + Nova Ordem (OP)
          </button>
          <button
            onClick={fetchSupplyData}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
          >
            Sincronizar
          </button>
        </div>
      </div>

      {/* SELETOR DE ABAS */}
      <div className="flex border-b border-slate-800/60 bg-slate-900/40 rounded-t-xl overflow-hidden">
        <button
          onClick={() => setActiveTab('OPS')}
          className={`px-6 py-3 text-xs font-bold tracking-wider uppercase transition-colors ${
            activeTab === 'OPS'
              ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-800/50'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Ordens de Produção ({orders.length})
        </button>
        <button
          onClick={() => setActiveTab('FORNECEDORES')}
          className={`px-6 py-3 text-xs font-bold tracking-wider uppercase transition-colors ${
            activeTab === 'FORNECEDORES'
              ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-800/50'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Cadeia de Fornecedores ({suppliers.length})
        </button>
      </div>

      {/* ABA 1: ORDENS DE PRODUÇÃO (OPS) */}
      {activeTab === 'OPS' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="p-4 rounded-xl border bg-blue-500/5 border-blue-500/20">
              <span className="text-[10px] uppercase font-mono text-blue-400 block">Peças em Confecção</span>
              <span className="text-2xl font-bold text-blue-400 mt-2 block">
                {orders.filter(o => o.status === 'IN_PRODUCTION').reduce((sum, o) => sum + o.quantity_requested, 0)}
              </span>
            </div>
            <div className="p-4 rounded-xl border bg-amber-500/5 border-amber-500/20">
              <span className="text-[10px] uppercase font-mono text-amber-400 block">Capital Empenhado (Obras em Andamento)</span>
              <span className="text-2xl font-bold text-amber-400 mt-2 block">
                R$ {orders.filter(o => o.status !== 'COMPLETED').reduce((sum, o) => sum + (o.total_order_value || 0), 0).toFixed(2).replace('.', ',')}
              </span>
            </div>
            <div className="p-4 rounded-xl border bg-slate-900/40 border-slate-800/80">
              <span className="text-[10px] uppercase font-mono text-slate-400 block">Lotes Concluídos (All-Time)</span>
              <span className="text-2xl font-bold text-slate-100 mt-2 block">
                {orders.filter(o => o.status === 'COMPLETED').length}
              </span>
            </div>
          </div>

          <div className="rounded-xl border bg-slate-900/40 border-slate-800/80 overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500">Buscando Ordens de Produção...</div>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">Nenhuma Ordem de Produção (OP) cadastrada.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans">
                  <thead className="bg-slate-950/80 border-b border-slate-800/80 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4">Código (OP)</th>
                      <th className="py-3.5 px-4">Fornecedor Responsável</th>
                      <th className="py-3.5 px-4">Artefato (Produto)</th>
                      <th className="py-3.5 px-4 text-center">Quantidade</th>
                      <th className="py-3.5 px-4 text-right">Valor Total Estimado</th>
                      <th className="py-3.5 px-4">Status Industrial</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/40">
                    {orders.map((op) => {
                      const supplier = suppliers.find(s => s.id === op.supplier_id);
                      return (
                        <tr key={op.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-4 px-4 font-mono font-bold text-slate-200">{op.op_code}</td>
                          <td className="py-4 px-4 font-semibold text-slate-300">{supplier?.trade_name || 'Fornecedor Desconhecido'}</td>
                          <td className="py-4 px-4 font-mono text-[11px] text-slate-400 uppercase">{op.product_id || 'Não especificado'}</td>
                          <td className="py-4 px-4 text-center font-bold text-slate-200">{op.quantity_requested}</td>
                          <td className="py-4 px-4 text-right font-mono font-bold text-amber-400/80">
                            R$ {op.total_order_value?.toFixed(2).replace('.', ',')}
                          </td>
                          <td className="py-4 px-4">{getStatusBadge(op.status)}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ABA 2: FORNECEDORES */}
      {activeTab === 'FORNECEDORES' && (
        <div className="space-y-6">
          <div className="rounded-xl border bg-slate-900/40 border-slate-800/80 overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500">Lendo base de fornecedores...</div>
            ) : suppliers.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">Você ainda não cadastrou nenhum fornecedor no banco de dados.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-slate-800/40">
                {suppliers.map((sup) => (
                  <div key={sup.id} className="p-6 hover:bg-slate-800/20 transition-colors flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-slate-200 text-sm">{sup.trade_name}</h3>
                        <span className={`w-2 h-2 rounded-full ${sup.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-600'}`} title={sup.status} />
                      </div>
                      <span className="px-2 py-0.5 rounded text-[9px] font-mono font-semibold bg-slate-800 text-slate-300 uppercase block w-fit mb-4">
                        {getCategoryName(sup.category)}
                      </span>
                    </div>
                    <div className="pt-4 border-t border-slate-800/40 text-xs font-mono text-slate-500 flex justify-between items-center">
                      <span>ID: {sup.id.substring(0, 8)}</span>
                      <button className="text-amber-400 hover:underline underline-offset-2">Editar Ficha</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL DE CRIAÇÃO DE OP */}
      {showOpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-6 shadow-2xl text-slate-100">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="font-serif text-lg font-bold uppercase tracking-wide">Lançar Ordem de Produção</h2>
              <button onClick={() => setShowOpModal(false)} className="text-xs text-slate-500 hover:text-slate-200">
                [ Fechar ]
              </button>
            </div>

            <form onSubmit={handleCreateOP} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block text-[10px] uppercase font-mono mb-1">Fornecedor Responsável</label>
                <select
                  required
                  value={opSupplier}
                  onChange={(e) => setOpSupplier(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="">Selecione um fornecedor...</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.trade_name} ({getCategoryName(s.category)})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] uppercase font-mono mb-1">Referência do Produto (SKU / Modelo)</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Boné Origo Preto"
                  value={opProduct}
                  onChange={(e) => setOpProduct(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block text-[10px] uppercase font-mono mb-1">Quantidade Lote</label>
                  <input
                    type="number"
                    required
                    placeholder="Ex: 100"
                    value={opQuantity}
                    onChange={(e) => setOpQuantity(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block text-[10px] uppercase font-mono mb-1">Custo Unitário (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="Ex: 45.50"
                    value={opUnitCost}
                    onChange={(e) => setOpUnitCost(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] uppercase font-mono mb-1">Previsão de Entrega (Opcional)</label>
                <input
                  type="date"
                  value={opDate}
                  onChange={(e) => setOpDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-400 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div className="bg-amber-500/10 border border-amber-500/20 p-3 rounded mt-2">
                <span className="text-[10px] text-amber-500 uppercase font-mono block">Valor Total Empenhado:</span>
                <span className="text-lg font-bold text-amber-400">
                  R$ {((parseFloat(opQuantity) || 0) * (parseFloat(opUnitCost) || 0)).toFixed(2).replace('.', ',')}
                </span>
              </div>

              <button
                type="submit"
                disabled={saving || !opSupplier}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded text-xs uppercase tracking-widest transition-colors mt-4 disabled:opacity-50"
              >
                {saving ? 'Gravando...' : 'Gerar Ordem de Produção'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}