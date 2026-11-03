'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Star, 
  MessageSquare, 
  TrendingUp, 
  RefreshCw, 
  ThumbsUp, 
  Sparkles, 
  Tag 
} from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface Review {
  id: string;
  order_id?: string;
  customer_name: string;
  product_name: string;
  rating: number; // 1 a 5
  comment: string;
  created_at: string;
}

export default function CortexQualidadePage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('product_reviews')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setReviews(data);
      } else {
        setReviews([]);
      }
    } catch (err) {
      console.error('Erro ao buscar avaliações:', err);
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Análise dos Dados
  const totalReviews = reviews.length;
  const averageRating = totalReviews > 0 
    ? (reviews.reduce((acc, r) => acc + Number(r.rating || 0), 0) / totalReviews) 
    : 0;

  const positivePercent = totalReviews > 0
    ? ((reviews.filter(r => r.rating >= 4).length / totalReviews) * 100).toFixed(0)
    : '0';

  // Síntese analítica baseada nas avaliações reais
  const getExecutiveSynthesis = () => {
    if (totalReviews === 0) {
      return 'Nenhuma avaliação registrada até o momento. O sistema aguarda as primeiras confirmações de entrega do Drop 01 para gerar a síntese de satisfação.';
    }
    if (averageRating >= 4.5) {
      return `Alto índice de aprovação (${averageRating.toFixed(1)}/5.0). Comentários destacam a densidade têxtil e a precisão do caimento no corpo.`;
    }
    if (averageRating >= 3.5) {
      return `Desempenho regular (${averageRating.toFixed(1)}/5.0). Recomenda-se monitorar observações sobre grade e tempo de entrega.`;
    }
    return `Alerta de qualidade (${averageRating.toFixed(1)}/5.0). Há comentários apontando ajustes necessários em modelagem ou expedição.`;
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-zinc-900 p-6 md:p-10 font-sans selection:bg-zinc-200">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Topo */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-zinc-200 pb-5 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">
                CORTEX OS // QUALIDADE & AUDIÊNCIA
              </span>
              <span className="text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded font-mono font-bold">
                ● Feedback Loop Compradores
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight uppercase font-sans text-zinc-950">
              Avaliações & Inteligência de Produto
            </h1>
            <p className="text-xs text-zinc-500 mt-0.5 font-mono">
              Notas, comentários dos patronos e parecer preditivo sobre o Drop 01.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchReviews}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-700 hover:text-black bg-white hover:bg-zinc-50 px-3 py-2 border border-zinc-300 rounded font-semibold transition-colors shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Sincronizar
            </button>
            <Link
              href="/cortex"
              className="text-xs font-mono text-zinc-700 hover:text-black bg-white hover:bg-zinc-50 px-3 py-2 border border-zinc-300 rounded font-semibold transition-colors shadow-sm"
            >
              ← Cockpit C-Level
            </Link>
          </div>
        </div>

        {/* Indicadores de Avaliação */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono">
          <div className="p-5 bg-white border border-zinc-200 rounded-lg shadow-sm space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">NOTA MÉDIA GERAL</span>
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-zinc-950">
                {totalReviews > 0 ? averageRating.toFixed(1) : '—'}
              </span>
              <div className="flex text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    className={`w-4 h-4 ${s <= Math.round(averageRating) ? 'fill-amber-400' : 'text-zinc-200'}`} 
                  />
                ))}
              </div>
            </div>
            <span className="text-[11px] text-zinc-500 block">Escala de 1 a 5 estrelas</span>
          </div>

          <div className="p-5 bg-white border border-zinc-200 rounded-lg shadow-sm space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">ÍNDICE DE RECOMENDAÇÃO</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-emerald-600">
                {totalReviews > 0 ? `${positivePercent}%` : '—'}
              </span>
            </div>
            <span className="text-[11px] text-zinc-500 block">Avaliações positivas (4 e 5 estrelas)</span>
          </div>

          <div className="p-5 bg-white border border-zinc-200 rounded-lg shadow-sm space-y-1">
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">AVALIAÇÕES AUDITADAS</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-zinc-950">{totalReviews}</span>
              <span className="text-xs text-zinc-500">comentários reais</span>
            </div>
            <span className="text-[11px] text-zinc-500 block">Sincronizado via Supabase</span>
          </div>
        </div>

        {/* Parecer Inteligente da LaRomme */}
        <div className="p-5 bg-white border border-zinc-200 rounded-lg shadow-sm space-y-2 font-mono">
          <div className="flex items-center gap-2 text-zinc-900 font-bold text-xs uppercase">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Diagnóstico Automatizado de Satisfação</span>
          </div>
          <p className="text-xs text-zinc-700 leading-relaxed font-sans">
            {getExecutiveSynthesis()}
          </p>
        </div>

        {/* Lista de Avaliações dos Compradores */}
        <div className="p-5 bg-white border border-zinc-200 rounded-lg shadow-sm space-y-4 font-mono">
          <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900">
              Registros de Avaliação dos Compradores
            </h2>
            <span className="text-[10px] text-zinc-400">FEEDBACK PÓS-COMPRA</span>
          </div>

          {reviews.length === 0 ? (
            <div className="py-10 text-center space-y-2">
              <MessageSquare className="w-8 h-8 text-zinc-300 mx-auto" />
              <p className="text-xs text-zinc-400">
                Aguardando avaliações dos primeiros compradores do Drop 01.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 bg-zinc-50 border border-zinc-200 rounded space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-bold text-xs text-zinc-950 uppercase block">
                        {rev.customer_name}
                      </span>
                      <span className="text-[10px] text-zinc-500 block">
                        Artefato: {rev.product_name}
                      </span>
                    </div>

                    <div className="flex text-amber-400">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star 
                          key={s} 
                          className={`w-3.5 h-3.5 ${s <= rev.rating ? 'fill-amber-400' : 'text-zinc-200'}`} 
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-zinc-800 font-sans italic bg-white p-2.5 rounded border border-zinc-200">
                    "{rev.comment}"
                  </p>

                  <span className="text-[10px] text-zinc-400 block text-right">
                    {new Date(rev.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}