'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Box, RefreshCw, Loader2, Edit, Trash2, Plus, X, Package } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CortexEstoquePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any | null>(null);

  // Form states para grade
  const [pStock, setPStock] = useState('0');
  const [mStock, setMStock] = useState('0');
  const [gStock, setGStock] = useState('0');
  const [ggStock, setGgStock] = useState('0');

  const fetchStock = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      console.error('Erro ao consultar WMS:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStock();
  }, []);

  const openAdjustModal = (item: any) => {
    setEditingItem(item);
    setPStock(String(item.stock_p || 0));
    setMStock(String(item.stock_m || 0));
    setGStock(String(item.stock_g || 0));
    setGgStock(String(item.stock_gg || 0));
    setIsModalOpen(true);
  };

  const handleSaveStock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const p = parseInt(pStock) || 0;
      const m = parseInt(mStock) || 0;
      const g = parseInt(gStock) || 0;
      const gg = parseInt(ggStock) || 0;
      const total = p + m + g + gg;

      await supabase.from('products').update({
        stock_p: p,
        stock_m: m,
        stock_g: g,
        stock_gg: gg,
        stock: total
      }).eq('id', editingItem.id);

      setIsModalOpen(false);
      fetchStock();
    } catch (err: any) {
      alert(`Erro ao atualizar saldo: ${err.message}`);
    }
  };

  const handleDeleteItem = async (id: string, name: string) => {
    if (!confirm(`Remover "${name}" do controle de estoque?`)) return;
    try {
      await supabase.from('products').delete().eq('id', id);
      fetchStock();
    } catch (err: any) {
      alert(`Erro ao excluir: ${err.message}`);
    }
  };

  const totalFisico = products.reduce((acc, p) => {
    const sum = (p.stock_p || 0) + (p.stock_m || 0) + (p.stock_g || 0) + (p.stock_gg || 0);
    return acc + sum;
  }, 0);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 font-bold block mb-1">
            Galpão Central & Matriz WMS
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-zinc-900 uppercase">
            WMS & Controle de Estoque
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-1 font-bold">
            Grade Dimensional e Registro de Entradas/Saídas Físicas
          </p>
        </div>

        <button
          onClick={fetchStock}
          disabled={loading}
          className="px-4 py-2 bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-300 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-2xs disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Sincronizar Saldo</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500 block mb-2">
            Total de Peças Físicas
          </span>
          <span className="text-3xl font-black text-zinc-900 tabular-nums tracking-tight block font-mono">
            {totalFisico}
          </span>
          <span className="text-xs font-bold text-zinc-500 mt-2 block">
            Nenhuma peça produzida no momento
          </span>
        </div>

        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500 block mb-2">
            Modelos Registrados
          </span>
          <span className="text-3xl font-black text-zinc-900 tabular-nums tracking-tight block font-mono">
            {products.length}
          </span>
          <span className="text-xs font-bold text-zinc-500 mt-2 block">
            SKUs aptos para corte e costura
          </span>
        </div>

        <div className="p-6 rounded-xl border bg-white border-zinc-200 shadow-2xs flex flex-col justify-between">
          <span className="text-xs font-mono font-black uppercase tracking-wider text-zinc-500 block mb-2">
            Status Operacional
          </span>
          <span className="text-3xl font-black text-amber-600 tabular-nums tracking-tight block font-mono">
            Pré-Produção
          </span>
          <span className="text-xs font-bold text-zinc-500 mt-2 block">
            Aguardando abertura de lote
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/70 flex justify-between items-center">
          <h2 className="text-xs font-black text-zinc-900 tracking-wider uppercase">
            Matriz de Inventário Dimensional
          </h2>
          <span className="text-xs font-mono text-zinc-500 font-bold">{products.length} itens</span>
        </div>

        {loading ? (
          <div className="p-16 text-center text-xs font-mono font-bold text-zinc-500 flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
            Consultando prateleiras...
          </div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center text-xs font-mono font-bold text-zinc-500 flex flex-col items-center gap-3">
            <Package className="w-10 h-10 text-zinc-300" />
            Nenhum artefato configurado no WMS. Cadastre modelos no Catálogo.
          </div>
        ) : (
          <div className="overflow-x-auto font-mono text-xs">
            <table className="w-full text-left">
              <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="px-6 py-3.5 font-bold">Artefato</th>
                  <th className="px-4 py-3.5 font-bold text-center">P</th>
                  <th className="px-4 py-3.5 font-bold text-center">M</th>
                  <th className="px-4 py-3.5 font-bold text-center">G</th>
                  <th className="px-4 py-3.5 font-bold text-center">GG</th>
                  <th className="px-6 py-3.5 font-bold text-right">Saldo Físico</th>
                  <th className="px-6 py-3.5 font-bold text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {products.map(p => {
                  const pStk = p.stock_p || 0;
                  const mStk = p.stock_m || 0;
                  const gStk = p.stock_g || 0;
                  const ggStk = p.stock_gg || 0;
                  const total = pStk + mStk + gStk + ggStk;

                  return (
                    <tr key={p.id} className="hover:bg-zinc-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <span className="font-bold text-zinc-900 block font-sans">{p.name}</span>
                        <span className="text-[10px] text-zinc-400 uppercase">{p.sku_code || 'SEM SKU'}</span>
                      </td>
                      <td className="px-4 py-4 text-center font-bold text-zinc-700">{pStk}</td>
                      <td className="px-4 py-4 text-center font-bold text-zinc-700">{mStk}</td>
                      <td className="px-4 py-4 text-center font-bold text-zinc-700">{gStk}</td>
                      <td className="px-4 py-4 text-center font-bold text-zinc-700">{ggStk}</td>
                      <td className="px-6 py-4 text-right font-black text-sm text-zinc-900 bg-zinc-50/40 tabular-nums">
                        {total} un.
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openAdjustModal(p)}
                            className="p-1.5 text-zinc-500 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors"
                            title="Ajustar Grade"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteItem(p.id, p.name)}
                            className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL DE AJUSTE DE SALDO FÍSICO */}
      {isModalOpen && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5 font-sans">
            <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
              <div>
                <span className="text-xs font-mono uppercase text-zinc-400 font-bold block">Ajuste de Estoque</span>
                <h3 className="text-base font-black text-zinc-900 uppercase mt-0.5">{editingItem.name}</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveStock} className="space-y-4 text-xs font-mono">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-600 block mb-1 font-bold">Saldo Tamanho P</label>
                  <input
                    type="number"
                    min="0"
                    value={pStock}
                    onChange={(e) => setPStock(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 font-bold focus:outline-none focus:border-zinc-400"
                  />
                </div>
                <div>
                  <label className="text-zinc-600 block mb-1 font-bold">Saldo Tamanho M</label>
                  <input
                    type="number"
                    min="0"
                    value={mStock}
                    onChange={(e) => setMStock(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 font-bold focus:outline-none focus:border-zinc-400"
                  />
                </div>
                <div>
                  <label className="text-zinc-600 block mb-1 font-bold">Saldo Tamanho G</label>
                  <input
                    type="number"
                    min="0"
                    value={gStock}
                    onChange={(e) => setGStock(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 font-bold focus:outline-none focus:border-zinc-400"
                  />
                </div>
                <div>
                  <label className="text-zinc-600 block mb-1 font-bold">Saldo Tamanho GG</label>
                  <input
                    type="number"
                    min="0"
                    value={ggStock}
                    onChange={(e) => setGgStock(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 font-bold focus:outline-none focus:border-zinc-400"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-200 flex justify-end gap-2 font-sans">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-zinc-200 rounded-lg text-xs font-bold text-zinc-600 hover:bg-zinc-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider"
                >
                  Salvar Saldo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}