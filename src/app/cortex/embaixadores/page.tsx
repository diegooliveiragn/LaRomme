'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface Ambassador {
  id: string;
  name: string;
  instagram_handle?: string;
  niche?: string;
  audience_size?: number;
  engagement_rate?: number;
}

interface SeedingOp {
  id: string;
  ambassador_id: string;
  cache_paid: number;
  shipping_cost: number;
  total_operation_cost: number;
  promo_code?: string;
  tracking_code?: string;
  created_at: string;
}

interface Order {
  id: string;
  total_amount?: number;
  subtotal?: number;
  status: string;
}

export default function CortexEmbaixadoresPage() {
  const [ambassadors, setAmbassadors] = useState<Ambassador[]>([]);
  const [seedings, setSeedings] = useState<SeedingOp[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'EMBAIXADORES' | 'SEEDING'>('SEEDING');
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  // Form State Seeding
  const [ambassadorId, setAmbassadorId] = useState('');
  const [cachePaid, setCachePaid] = useState('');
  const [shippingCost, setShippingCost] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [trackingCode, setTrackingCode] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: ambData } = await supabase.from('ambassadors').select('*');
      if (ambData) setAmbassadors(ambData as Ambassador[]);

      const { data: seedData } = await supabase
        .from('seeding_operations')
        .select('*')
        .order('created_at', { ascending: false });
      if (seedData) setSeedings(seedData as SeedingOp[]);

      const { data: orderData } = await supabase.from('orders').select('*').eq('status', 'paid');
      if (orderData) setOrders(orderData as Order[]);
    } catch (err) {
      console.error('Erro ao carregar dados de Embaixadores:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateSeeding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ambassadorId) return;

    setSaving(true);
    try {
      const cache = parseFloat(cachePaid) || 0;
      const shipping = parseFloat(shippingCost) || 0;
      const totalCost = cache + shipping;

      const newOp = {
        ambassador_id: ambassadorId,
        cache_paid: cache,
        shipping_cost: shipping,
        total_operation_cost: totalCost,
        promo_code: promoCode.toUpperCase().trim() || null,
        tracking_code: trackingCode.trim() || null,
      };

      const { data, error } = await supabase.from('seeding_operations').insert([newOp]).select();
      if (error) throw error;

      if (data && data[0]) {
        setSeedings((prev) => [data[0] as SeedingOp, ...prev]);
      }

      setShowModal(false);
      setCachePaid('');
      setShippingCost('');
      setPromoCode('');
      setTrackingCode('');
      alert('Operação de Seeding registrada com sucesso!');
    } catch (err) {
      alert('Falha ao cadastrar envio de Seeding.');
    } finally {
      setSaving(false);
    }
  };

  const totalSeedingCost = seedings.reduce((sum, s) => sum + Number(s.total_operation_cost || 0), 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/40 pb-5">
        <div>
          <h1 className="font-serif text-2xl font-bold tracking-wide uppercase">Parcerias & ROI de Seeding</h1>
          <p className="text-xs text-slate-400 mt-1">Gestão de Influenciadores, Envio de Artefatos e Retorno Financeiro</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors shadow-sm"
          >
            + Lançar Envio (Seeding)
          </button>
          <button
            onClick={fetchData}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
          >
            Sincronizar
          </button>
        </div>
      </div>

      {/* KPIS DE SEEDING */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border bg-slate-900/40 border-slate-800/80">
          <span className="text-[10px] uppercase font-mono text-slate-400 block">Total de Envios (Seeding)</span>
          <span className="text-2xl font-bold text-slate-100 mt-2 block">{seedings.length}</span>
        </div>
        <div className="p-4 rounded-xl border bg-amber-500/5 border-amber-500/20">
          <span className="text-[10px] uppercase font-mono text-amber-400 block">Investimento Total (Frete + Cachê)</span>
          <span className="text-2xl font-bold text-amber-400 mt-2 block">
            R$ {totalSeedingCost.toFixed(2).replace('.', ',')}
          </span>
        </div>
        <div className="p-4 rounded-xl border bg-emerald-500/5 border-emerald-500/20">
          <span className="text-[10px] uppercase font-mono text-emerald-400 block">Embaixadores Ativos</span>
          <span className="text-2xl font-bold text-emerald-400 mt-2 block">{ambassadors.length}</span>
        </div>
      </div>

      {/* SELETOR DE ABAS */}
      <div className="flex border-b border-slate-800/60 bg-slate-900/40 rounded-t-xl overflow-hidden">
        <button
          onClick={() => setActiveTab('SEEDING')}
          className={`px-6 py-3 text-xs font-bold tracking-wider uppercase transition-colors ${
            activeTab === 'SEEDING'
              ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-800/50'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Histórico de Envios & Cupom ({seedings.length})
        </button>
        <button
          onClick={() => setActiveTab('EMBAIXADORES')}
          className={`px-6 py-3 text-xs font-bold tracking-wider uppercase transition-colors ${
            activeTab === 'EMBAIXADORES'
              ? 'text-amber-400 border-b-2 border-amber-400 bg-slate-800/50'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Ficha de Embaixadores ({ambassadors.length})
        </button>
      </div>

      {/* ABA 1: OPERAÇÕES DE SEEDING */}
      {activeTab === 'SEEDING' && (
        <div className="rounded-xl border bg-slate-900/40 border-slate-800/80 overflow-hidden shadow-sm">
          {loading ? (
            <div className="p-12 text-center text-xs text-slate-500">Lendo operações de Seeding...</div>
          ) : seedings.length === 0 ? (
            <div className="p-12 text-center text-xs text-slate-500">Nenhum envio registrado. Clique em "+ Lançar Envio".</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-slate-950/80 border-b border-slate-800/80 text-slate-400 uppercase text-[10px] font-semibold tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4">Data</th>
                    <th className="py-3.5 px-4">Embaixador</th>
                    <th className="py-3.5 px-4">Cupom Dedicado</th>
                    <th className="py-3.5 px-4 text-right">Frete</th>
                    <th className="py-3.5 px-4 text-right">Cachê</th>
                    <th className="py-3.5 px-4 text-right">Custo Total</th>
                    <th className="py-3.5 px-4 text-center">Rastreio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {seedings.map((op) => {
                    const amb = ambassadors.find((a) => a.id === op.ambassador_id);
                    return (
                      <tr key={op.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="py-4 px-4 font-mono text-slate-400">
                          {new Date(op.created_at).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="py-4 px-4 font-semibold text-slate-200">
                          {amb ? amb.name : 'Embaixador não vinculado'}
                        </td>
                        <td className="py-4 px-4 font-mono font-bold text-amber-400">
                          {op.promo_code || 'SEM CUPOM'}
                        </td>
                        <td className="py-4 px-4 text-right font-mono text-slate-400">
                          R$ {Number(op.shipping_cost).toFixed(2).replace('.', ',')}
                        </td>
                        <td className="py-4 px-4 text-right font-mono text-slate-400">
                          R$ {Number(op.cache_paid).toFixed(2).replace('.', ',')}
                        </td>
                        <td className="py-4 px-4 text-right font-mono font-bold text-rose-400">
                          R$ {Number(op.total_operation_cost).toFixed(2).replace('.', ',')}
                        </td>
                        <td className="py-4 px-4 text-center font-mono text-[11px]">
                          {op.tracking_code ? (
                            <span className="text-emerald-400">{op.tracking_code}</span>
                          ) : (
                            <span className="text-slate-600">Sem rastreio</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ABA 2: FICHA DE EMBAIXADORES */}
      {activeTab === 'EMBAIXADORES' && (
        <div className="rounded-xl border bg-slate-900/40 border-slate-800/80 overflow-hidden shadow-sm p-6">
          {ambassadors.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">
              Nenhum embaixador cadastrado na base do Supabase.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ambassadors.map((amb) => (
                <div key={amb.id} className="p-4 rounded-lg border border-slate-800 bg-slate-950/60 space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-slate-200 text-sm">{amb.name}</h3>
                    <span className="text-xs text-amber-400 font-mono">{amb.instagram_handle || '@-'}</span>
                  </div>
                  <p className="text-xs text-slate-400 font-sans">Nicho: {amb.niche || 'Geral'}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL NOVO ENVIOS (SEEDING) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 max-w-md w-full space-y-6 shadow-2xl text-slate-100">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h2 className="font-serif text-lg font-bold uppercase tracking-wide">Lançar Envio de Seeding</h2>
              <button onClick={() => setShowModal(false)} className="text-xs text-slate-500 hover:text-slate-200">
                [ Fechar ]
              </button>
            </div>

            <form onSubmit={handleCreateSeeding} className="space-y-4 text-xs">
              <div>
                <label className="text-slate-400 block text-[10px] uppercase font-mono mb-1">Selecione o Embaixador</label>
                <select
                  required
                  value={ambassadorId}
                  onChange={(e) => setAmbassadorId(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="">Selecione...</option>
                  {ambassadors.map((a) => (
                    <option key={a.id} value={a.id}>{a.name} ({a.instagram_handle || '@-'})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-slate-400 block text-[10px] uppercase font-mono mb-1">Custo de Frete (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block text-[10px] uppercase font-mono mb-1">Cachê Pago (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={cachePaid}
                    onChange={(e) => setCachePaid(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] uppercase font-mono mb-1">Cupom Exclusivo de Vendas</label>
                <input
                  type="text"
                  placeholder="Ex: LAROMMEXFULANO"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500 font-mono uppercase"
                />
              </div>

              <div>
                <label className="text-slate-400 block text-[10px] uppercase font-mono mb-1">Código de Rastreamento</label>
                <input
                  type="text"
                  placeholder="Ex: NL123456789BR"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={saving || !ambassadorId}
                className="w-full bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold py-3 rounded text-xs uppercase tracking-widest transition-colors mt-4 disabled:opacity-50"
              >
                {saving ? 'Registrando...' : 'Confirmar Envio'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}