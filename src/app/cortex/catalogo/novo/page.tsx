'use client';

import React, { useState, useEffect } from 'react';
import { Package, Layers, Camera, CheckCircle2, ArrowRight, Tag, Save, Loader2, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function NovoProdutoPIM() {
  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Estados do Artefato
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('');
  const [precoVenda, setPrecoVenda] = useState<number | ''>('');
  const [loteProducao, setLoteProducao] = useState<number | ''>('');
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Estados de Upload (Storage)
  const [isUploading, setIsUploading] = useState<string | null>(null);
  const [uploadedUrls, setUploadedUrls] = useState<Record<string, string>>({});

  // Matriz True Fit (Curva Padrão: 15-35-35-15)
  const [gradeSugerida, setGradeSugerida] = useState({ P: 0, M: 0, G: 0, GG: 0 });

  useEffect(() => {
    if (loteProducao && Number(loteProducao) > 0) {
      const qtd = Number(loteProducao);
      setGradeSugerida({
        P: Math.round(qtd * 0.15),
        M: Math.round(qtd * 0.35),
        G: Math.round(qtd * 0.35),
        GG: Math.round(qtd * 0.15),
      });
    } else {
      setGradeSugerida({ P: 0, M: 0, G: 0, GG: 0 });
    }
  }, [loteProducao]);

  const slotsImagens = {
    'TOPWEAR': ['Frontal (Lookbook)', 'Costas (Detalhe)', 'Macro (Textura do Tecido)', 'Fit no Corpo (Lifestyle)'],
    'BOTTOMWEAR': ['Frontal', 'Traseira', 'Macro (Detalhe do Cós/Bolso)', 'Fit no Corpo'],
    'HEADWEAR': ['Frontal (Coroa)', 'Perfil (Aba)', 'Traseira (Fecho)', 'Interior (Etiqueta)'],
    'ACESSORIOS': ['Produto Esticado', 'Em Uso (Lifestyle)', 'Macro (Detalhe)', 'Embalagem'],
    'DEFAULT': ['Imagem Principal', 'Imagem Secundária']
  };

  const getSlots = () => {
    return slotsImagens[categoria as keyof typeof slotsImagens] || slotsImagens['DEFAULT'];
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, slotName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(slotName);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${categoria || 'geral'}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('artefatos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('artefatos')
        .getPublicUrl(filePath);

      setUploadedUrls(prev => ({ ...prev, [slotName]: publicUrl }));
    } catch (error: any) {
      console.error('Erro no upload:', error.message);
      alert('Falha ao subir imagem para o storage.');
    } finally {
      setIsUploading(null);
    }
  };

  const handleSalvarArtefato = async () => {
    if (!nome.trim() || !categoria) {
      alert('Preencha o nome do artefato e selecione a categoria.');
      return;
    }

    setIsSaving(true);
    setFeedback('Registrando artefato no acervo...');
    try {
      const { error } = await supabase.from('products').insert({
        name: nome.trim(),
        category: categoria,
        price: Number(precoVenda) || 0,
        images: Object.values(uploadedUrls),
        created_at: new Date().toISOString(),
      });

      if (error) throw error;
      setFeedback('✓ Artefato cadastrado com sucesso no acervo!');
      setNome('');
      setPrecoVenda('');
      setUploadedUrls({});
    } catch (err: any) {
      setFeedback(`Erro ao salvar: ${err.message}`);
    } finally {
      setIsSaving(false);
      setTimeout(() => setFeedback(null), 5000);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12 font-sans max-w-5xl mx-auto">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <Link href="/cortex/catalogo" className="text-xs text-slate-400 font-mono font-bold hover:text-white mb-2 inline-block">
            &larr; Voltar ao Catálogo
          </Link>
          <h1 className="font-serif text-3xl font-bold tracking-tight text-white uppercase flex items-center gap-3">
            Motor PIM <Package className="w-6 h-6 text-slate-400" />
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-1 font-bold">
            Gestão de Informações de Produto & Matriz Dimensional
          </p>
        </div>

        <button
          onClick={handleSalvarArtefato}
          disabled={isSaving}
          className="px-6 py-3 text-xs font-black uppercase tracking-wider text-slate-950 bg-white rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
        >
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>Salvar Artefato</span>
        </button>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-white flex items-center justify-between">
          <span>{feedback}</span>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white ml-4">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* COLUNA ESQUERDA: IDENTIDADE & MÍDIA */}
        <div className="space-y-6">

          <div className="bg-slate-950/60 p-6 rounded-xl border border-slate-800 shadow-sm space-y-4">
            <h2 className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2 border-b border-slate-800 pb-3">
              <Tag className="w-4 h-4 text-slate-400" /> Identidade do Artefato
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Nome do Artefato
                </label>
                <input
                  type="text"
                  placeholder="Ex: Camiseta Vestigium"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-slate-400 font-sans font-bold"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Família / Categoria
                </label>
                <select
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:border-slate-400 font-sans font-bold appearance-none cursor-pointer"
                  value={categoria}
                  onChange={(e) => {
                    setCategoria(e.target.value);
                    setUploadedUrls({});
                  }}
                >
                  <option value="" disabled>Selecione a Categoria Arquitetural...</option>
                  <option value="TOPWEAR">Topwear (Camisetas, Regatas, Compressão)</option>
                  <option value="BOTTOMWEAR">Bottomwear (Shorts, Calças)</option>
                  <option value="HEADWEAR">Headwear (Bonés, Viseiras)</option>
                  <option value="ACESSORIOS">Acessórios Têxteis (Meias, Toalhas)</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                  Preço de Venda Sugerido (R$)
                </label>
                <input
                  type="number"
                  placeholder="Ex: 289.00"
                  value={precoVenda}
                  onChange={(e) => setPrecoVenda(e.target.value ? Number(e.target.value) : '')}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-emerald-400 font-mono font-black placeholder-slate-600 focus:outline-none focus:border-emerald-400"
                />
                <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                  Valor final exposto ao patrono na vitrine.
                </span>
              </div>
            </div>
          </div>

          {/* MOTOR DE UPLOAD (PIM) */}
          {categoria && (
            <div className="bg-slate-950/60 p-6 rounded-xl border border-slate-800 shadow-sm space-y-4 animate-in fade-in duration-300">
              <h2 className="text-xs font-bold text-white tracking-widest uppercase flex items-center gap-2 border-b border-slate-800 pb-3">
                <Camera className="w-4 h-4 text-emerald-400" /> Acervo de Mídia (PIM)
              </h2>

              <div className="grid grid-cols-2 gap-4">
                {getSlots().map((slot, index) => (
                  <label key={index} className="relative border-2 border-dashed border-slate-800 bg-slate-900/60 rounded-lg h-32 flex flex-col items-center justify-center text-center cursor-pointer hover:border-slate-600 transition-all group overflow-hidden">
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/webp"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, slot)}
                      disabled={isUploading === slot}
                    />

                    {isUploading === slot ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                        <span className="text-[9px] font-mono text-emerald-400 font-bold uppercase">Enviando...</span>
                      </div>
                    ) : uploadedUrls[slot] ? (
                      <div className="absolute inset-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={uploadedUrls[slot]} alt={slot} className="w-full h-full object-cover opacity-90 group-hover:opacity-60 transition-opacity" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity">
                          <CheckCircle2 className="w-5 h-5 text-white mb-1" />
                          <span className="text-[9px] font-mono text-white font-bold uppercase">Substituir</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Camera className="w-5 h-5 text-slate-500 group-hover:text-slate-300 mb-1.5" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 px-2">{slot}</span>
                      </>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* COLUNA DIREITA: ENGENHARIA DE PRECIFICAÇÃO & MATRIZ TRUE FIT */}
        <div className="space-y-6">

          {/* VÍNCULO AO MOTOR DE SUPPLY */}
          <div className="bg-slate-950/60 p-6 rounded-xl border border-slate-800 shadow-sm space-y-4">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 font-bold block">
                  Engenharia Fiscal & Insumos
                </span>
                <h2 className="text-xs font-bold text-white tracking-widest uppercase mt-0.5">
                  Ficha Técnica Oficial (Supply)
                </h2>
              </div>
              <Link
                href="/cortex/supply"
                className="text-[11px] font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1 uppercase tracking-wider"
              >
                Abrir Simulador <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              A precificação contábil da LaRomme é regida pela <strong>Ficha Técnica de Supply</strong>, que consolida custo de facção têxtil, insumos, alíquota de imposto e taxa de processamento do gateway.
            </p>

            <div className="bg-slate-900 p-4 rounded-lg border border-slate-800 text-xs font-mono space-y-2">
              <div className="flex justify-between items-center text-slate-300">
                <span>Padrão Fiscal da Maison:</span>
                <span className="font-bold text-white">Simples Nacional (6,0%)</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Processamento Pix Gateway:</span>
                <span className="font-bold text-white">4,99%</span>
              </div>
              <div className="flex justify-between items-center text-slate-300">
                <span>Margem Alvo Recomendada:</span>
                <span className="font-bold text-emerald-400">30% a 40% líquida</span>
              </div>
            </div>
          </div>

          {/* MATRIZ TRUE FIT / GRADE DE CORTE */}
          <div className="bg-slate-950/60 p-6 rounded-xl border border-slate-800 shadow-sm space-y-4">
            <div className="flex justify-between items-start border-b border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-400 font-bold block">
                  Distribuição de Confecção
                </span>
                <h2 className="text-xs font-bold text-white tracking-widest uppercase mt-0.5 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-slate-400" /> Matriz True Fit
                </h2>
              </div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 bg-slate-900 border border-slate-800 px-2 py-1 rounded">
                Curva: 15-35-35-15
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                Volume Total do Lote (Unidades)
              </label>
              <input
                type="number"
                placeholder="Ex: 100"
                value={loteProducao}
                onChange={(e) => setLoteProducao(e.target.value ? Number(e.target.value) : '')}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white font-mono font-black placeholder-slate-600 focus:outline-none focus:border-slate-400"
              />
            </div>

            <div className="grid grid-cols-4 gap-3 pt-2">
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center">
                <span className="block text-xl font-black text-white tabular-nums">{gradeSugerida.P}</span>
                <span className="block text-[10px] font-mono font-bold text-slate-400 mt-1">Grade P (15%)</span>
              </div>
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-center">
                <span className="block text-xl font-black text-amber-300 tabular-nums">{gradeSugerida.M}</span>
                <span className="block text-[10px] font-mono font-bold text-slate-300 mt-1">Grade M (35%)</span>
              </div>
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-center">
                <span className="block text-xl font-black text-amber-300 tabular-nums">{gradeSugerida.G}</span>
                <span className="block text-[10px] font-mono font-bold text-slate-300 mt-1">Grade G (35%)</span>
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 text-center">
                <span className="block text-xl font-black text-white tabular-nums">{gradeSugerida.GG}</span>
                <span className="block text-[10px] font-mono font-bold text-slate-400 mt-1">Grade GG (15%)</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}