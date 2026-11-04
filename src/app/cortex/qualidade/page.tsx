'use client';

import React, { useEffect, useState } from 'react';
import { 
  Star, MessageSquare, TrendingUp, RefreshCw, ThumbsUp, 
  Sparkles, Plus, Trash2, Edit2, X, AlertCircle, CheckCircle2 
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface Review {
  id: string;
  customer_name: string;
  product_name: string;
  rating: number; // 1 a 10
  sport?: string;
  comment: string;
  created_at: string;
}

export default function CortexQualidadePage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal CRUD Feedback
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [customerName, setCustomerName] = useState('');
  const [productName, setProductName] = useState('VESTIGIUM (Boxy Bordô)');
  const [sport, setSport] = useState('Beach Tennis');
  const [rating, setRating] = useState('10');
  const [comment, setComment] = useState('');

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setReviews(data);
      } else {
        const saved = localStorage.getItem('laromme_reviews_v1');
        if (saved) {
          setReviews(JSON.parse(saved));
        } else {
          setReviews([]);
        }
      }
    } catch (e) {
      console.warn('Fallback para cache de reviews:', e);
      const saved = localStorage.getItem('laromme_reviews_v1');
      if (saved) setReviews(JSON.parse(saved));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const saveReviews = (updated: Review[]) => {
    setReviews(updated);
    localStorage.setItem('laromme_reviews_v1', JSON.stringify(updated));
  };

  const openCreateModal = () => {
    setEditingId(null);
    setCustomerName('');
    setProductName('VESTIGIUM (Boxy Bordô)');
    setSport('Beach Tennis');
    setRating('10');
    setComment('');
    setIsModalOpen(true);
  };

  const openEditModal = (rev: Review) => {
    setEditingId(rev.id);
    setCustomerName(rev.customer_name);
    setProductName(rev.product_name);
    setSport(rev.sport || 'Beach Tennis');
    setRating(rev.rating.toString());
    setComment(rev.comment);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Deseja excluir esta avaliação?')) {
      try {
        await supabase.from('product_reviews').delete().eq('id', id);
      } catch (e) {
        console.warn('Erro ao deletar no Supabase, removendo local:', e);
      }
      saveReviews(reviews.filter(r => r.id !== id));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanRating = parseInt(rating) || 10;

    if (editingId) {
      const updated = reviews.map(r => 
        r.id === editingId
          ? { ...r, customer_name: customerName, product_name: productName, sport, rating: cleanRating, comment }
          : r
      );
      saveReviews(updated);
    } else {
      const newReview: Review = {
        id: `REV-${Date.now().toString().slice(-6)}`,
        customer_name: customerName,
        product_name: productName,
        sport,
        rating: cleanRating,
        comment,
        created_at: new Date().toISOString()
      };
      saveReviews([newReview, ...reviews]);
    }

    setIsModalOpen(false);
  };

  // Cálculo Dinâmico de NPS
  const totalReviews = reviews.length;
  const promoters = reviews.filter(r => r.rating >= 9).length;
  const passives = reviews.filter(r => r.rating >= 7 && r.rating <= 8).length;
  const detractors = reviews.filter(r => r.rating <= 6).length;

  const npsScore = totalReviews > 0 
    ? Math.round(((promoters - detractors) / totalReviews) * 100) 
    : 0;

  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
    : '—';

  return (
    <div className="space-y-6 pb-12 font-sans bg-transparent">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <span className="text-[10px] font-mono tracking-widest text-zinc-400 uppercase">
            QUALIDADE & SATISFAÇÃO • FEEDBACK EM QUADRA
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 uppercase">
            Painel de Avaliação & NPS
          </h1>
          <p className="text-xs text-zinc-500 mt-0.5">
            Monitoramento de Experiência Têxtil, Notas Pós-Treino e Feedbacks de Patronos
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openCreateModal}
            className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo Feedback</span>
          </button>
          <button
            onClick={fetchReviews}
            disabled={loading}
            className="px-3 py-1.5 border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 rounded text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sincronizar</span>
          </button>
        </div>
      </div>

      {/* KPIS DE NPS E SATISFAÇÃO */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">
            NPS Score Oficial
          </span>
          <div className="text-3xl font-bold text-zinc-900 font-mono tracking-tight">
            {totalReviews > 0 ? `${npsScore} pts` : '—'}
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            {totalReviews > 0 ? (npsScore >= 75 ? 'Zona de Excelência' : 'Zona de Atenção') : 'Aguardando primeiras entregas'}
          </p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">
            Média de Avaliação (1 a 10)
          </span>
          <div className="text-3xl font-bold text-emerald-600 font-mono tracking-tight flex items-baseline gap-1">
            {avgRating} <span className="text-base text-zinc-400">/ 10</span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-1 font-mono">
            {totalReviews} {totalReviews === 1 ? 'avaliação registrada' : 'avaliações registradas'}
          </p>
        </div>

        <div className="p-5 rounded-lg border border-zinc-200 bg-white shadow-sm flex flex-col justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-2">
            Distribuição de Patronos
          </span>
          <div className="flex items-center gap-2 pt-1 font-mono text-xs">
            <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">
              {promoters} Promotores
            </span>
            <span className="text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-bold">
              {passives} Neutros
            </span>
            <span className="text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded font-bold">
              {detractors} Detratores
            </span>
          </div>
          <p className="text-[11px] text-zinc-400 mt-2 font-mono">
            Protocolo 7 dias pós-entrega
          </p>
        </div>

      </div>

      {/* LISTA CRUD DE AVALIAÇÕES */}
      <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center">
          <h2 className="text-xs font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-zinc-500" /> Registros de Feedback & Avaliação
          </h2>
          <span className="text-[10px] font-mono text-zinc-500 uppercase">
            {reviews.length} Feedbacks
          </span>
        </div>

        {reviews.length === 0 ? (
          <div className="py-16 text-center text-xs font-mono text-zinc-400 space-y-2">
            <CheckCircle2 className="w-6 h-6 text-zinc-300 mx-auto" />
            <p className="font-bold text-zinc-700">Nenhum feedback cadastrado ainda.</p>
            <p className="text-[11px]">Clique em "Novo Feedback" para adicionar relatos de patronos que testaram as peças.</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-100">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-zinc-50/50 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-zinc-900 font-sans">
                      {rev.customer_name}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 bg-zinc-100 px-2 py-0.5 rounded uppercase">
                      {rev.sport || 'Esporte'}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                      Nota: {rev.rating}/10
                    </span>
                  </div>
                  <p className="text-xs font-light text-zinc-600 leading-relaxed font-sans">
                    "{rev.comment}"
                  </p>
                  <span className="text-[10px] font-mono text-zinc-400 block pt-0.5">
                    Peça: {rev.product_name} • {new Date(rev.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>

                <div className="flex items-center gap-1 shrink-0 self-end md:self-center">
                  <button
                    onClick={() => openEditModal(rev)}
                    className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded hover:bg-zinc-100"
                    title="Editar"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(rev.id)}
                    className="p-1.5 text-zinc-400 hover:text-rose-600 rounded hover:bg-rose-50"
                    title="Excluir"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL CRUD DE FEEDBACK */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-zinc-200 p-6 max-w-md w-full shadow-xl space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <h3 className="font-serif text-base font-bold uppercase text-zinc-900">
                {editingId ? 'Editar Feedback' : 'Novo Feedback de Patrono'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-zinc-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-zinc-600 mb-1 uppercase font-bold">Nome do Patrono:</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ex: Carlos Albuquerque"
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded font-sans text-xs focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div>
                <label className="block text-zinc-600 mb-1 uppercase font-bold">Artefato Avaliado:</label>
                <select
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                >
                  <option value="VESTIGIUM (Boxy Bordô)">VESTIGIUM (Boxy Bordô)</option>
                  <option value="TENAX (Camiseta Preta)">TENAX (Camiseta Preta)</option>
                  <option value="LIBERTAS (Regata Preta)">LIBERTAS (Regata Preta)</option>
                  <option value="UMBRA (Boné 5-Panel)">UMBRA (Boné 5-Panel)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-600 mb-1 uppercase font-bold">Modalidade Esportiva:</label>
                  <input
                    type="text"
                    value={sport}
                    onChange={(e) => setSport(e.target.value)}
                    placeholder="Ex: Corrida, Beach Tennis"
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900"
                  />
                </div>
                <div>
                  <label className="block text-zinc-600 mb-1 uppercase font-bold">Nota de Satisfação (1 a 10):</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    required
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded text-xs focus:outline-none focus:border-zinc-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-600 mb-1 uppercase font-bold">Relato / Comentário:</label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Relato de uso real em treino ou no dia a dia..."
                  className="w-full p-2.5 bg-zinc-50 border border-zinc-200 rounded font-sans text-xs focus:outline-none focus:border-zinc-900"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-zinc-200 text-zinc-600 rounded text-xs font-bold uppercase tracking-wider hover:bg-zinc-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-zinc-900 hover:bg-zinc-800 text-white rounded text-xs font-bold uppercase tracking-wider shadow-sm"
                >
                  Salvar Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}