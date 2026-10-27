'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Package, Plus, RefreshCw, Loader2, Edit, Trash2, X } from 'lucide-react';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CatalogoPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any | null>(null);

  const [name, setName] = useState('');
  const [sku, setSku] = useState('');
  const [category, setCategory] = useState('Topwear');
  const [price, setPrice] = useState('');
  const [cost, setCost] = useState('');

  const formatBRL = (val: number) =>
    new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err: any) {
      console.error('Erro ao buscar catálogo:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const openCreateModal = () => {
    setEditingProduct(null);
    setName('');
    setSku('');
    setCategory('Topwear');
    setPrice('');
    setCost('');
    setIsModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingProduct(p);
    setName(p.name || '');
    setSku(p.sku_code || '');
    setCategory(p.category || 'Topwear');
    setPrice(String(p.price || ''));
    setCost(String(p.cost_piece || ''));
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name,
        sku_code: sku,
        category,
        price: parseFloat(price) || 0,
        cost_piece: parseFloat(cost) || 0,
        stock: 0,
        stock_p: 0,
        stock_m: 0,
        stock_g: 0,
        stock_gg: 0,
        status: 'ATIVO'
      };

      if (editingProduct) {
        const res = await fetch('/api/cortex/products', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: editingProduct.id, ...payload })
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Erro ao atualizar');
      } else {
        const res = await fetch('/api/cortex/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Erro ao cadastrar');
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      alert(`Erro ao salvar produto: ${err.message}`);
    }
  };

  const handleDeleteProduct = async (id: string, prodName: string) => {
    if (!confirm(`Deseja remover "${prodName}" definitivamente?`)) return;
    try {
      const res = await fetch(`/api/cortex/products?id=${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Erro ao excluir');

      setProducts(prev => prev.filter(p => p.id !== id));
      alert(`"${prodName}" excluído com sucesso.`);
    } catch (err: any) {
      alert(`Erro ao excluir: ${err.message}`);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 font-sans">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-6">
        <div>
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-zinc-500 font-bold block mb-1">
            Engenharia de Acervo & SKUs Oficiais
          </span>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-zinc-900 uppercase">
            Catálogo de Produtos
          </h1>
          <p className="text-xs text-zinc-500 font-mono mt-1 font-bold">
            Gestão Direta do Catálogo Oficial LaRomme
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={openCreateModal}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 shadow-2xs"
          >
            <Plus className="w-4 h-4" />
            <span>Cadastrar Artefato</span>
          </button>

          <button
            onClick={fetchProducts}
            disabled={loading}
            className="p-2 bg-white hover:bg-zinc-100 text-zinc-900 border border-zinc-300 rounded-lg transition-all shadow-2xs disabled:opacity-50"
            title="Atualizar Catálogo"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-zinc-200 shadow-2xs overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/70 flex justify-between items-center">
          <h2 className="text-xs font-black text-zinc-900 tracking-wider uppercase">
            Modelos Registrados no Acervo
          </h2>
          <span className="text-xs font-mono text-zinc-500 font-bold tabular-nums">
            {products.length} itens cadastrados
          </span>
        </div>

        {loading ? (
          <div className="p-16 text-center text-xs font-mono font-bold text-zinc-500 flex flex-col items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin text-zinc-400" />
            Sincronizando acervo...
          </div>
        ) : products.length === 0 ? (
          <div className="p-16 text-center text-xs font-mono font-bold text-zinc-500 flex flex-col items-center gap-3">
            <Package className="w-10 h-10 text-zinc-300" />
            Nenhum produto cadastrado até o momento. Utilize o botão acima para adicionar.
          </div>
        ) : (
          <div className="divide-y divide-zinc-100 font-mono text-xs">
            {products.map(p => (
              <div key={p.id} className="p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-zinc-50/60 transition-colors">
                <div>
                  <span className="font-bold text-zinc-900 text-sm block font-sans">{p.name}</span>
                  <span className="text-[11px] text-zinc-400 uppercase">{p.sku_code || 'SKU PENDENTE'} • {p.category}</span>
                </div>

                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 block uppercase">Preço Oficial</span>
                    <span className="font-black text-zinc-900 text-sm tabular-nums">{formatBRL(p.price || 0)}</span>
                  </div>

                  <div className="flex items-center gap-2 border-l border-zinc-200 pl-4">
                    <button
                      onClick={() => openEditModal(p)}
                      className="p-1.5 text-zinc-500 hover:text-zinc-900 rounded-lg hover:bg-zinc-100 transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteProduct(p.id, p.name)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Excluir"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white border border-zinc-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 font-sans">
            <div className="flex justify-between items-center border-b border-zinc-200 pb-3">
              <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wider">
                {editingProduct ? 'Editar Artefato' : 'Novo Artefato no Catálogo'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-zinc-600 block mb-1 font-bold">Nome do Produto</label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Camiseta Boxy Heavyweight"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 focus:outline-none focus:border-zinc-400 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-600 block mb-1 font-bold">Código SKU</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: BOXY-HW-01"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 focus:outline-none focus:border-zinc-400 uppercase"
                  />
                </div>
                <div>
                  <label className="text-zinc-600 block mb-1 font-bold">Categoria</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 focus:outline-none focus:border-zinc-400 font-sans"
                  >
                    <option value="Topwear">Topwear</option>
                    <option value="Bottomwear">Bottomwear</option>
                    <option value="Headwear">Headwear</option>
                    <option value="Acessórios">Acessórios</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-600 block mb-1 font-bold">Preço de Venda (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="240.00"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 focus:outline-none focus:border-zinc-400"
                  />
                </div>
                <div>
                  <label className="text-zinc-600 block mb-1 font-bold">Custo de Confecção CPV (R$)</label>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="65.00"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-zinc-900 focus:outline-none focus:border-zinc-400"
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
                  Salvar Produto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}