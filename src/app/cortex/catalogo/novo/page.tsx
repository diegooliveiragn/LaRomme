'use client';

import React, { useState, useEffect } from 'react';
import { Package, Calculator, Camera, Layers, CheckCircle2, AlertTriangle, ArrowRight, Tag, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';

// Conexão Segura Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function NovoProdutoPIM() {
  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Estados do PIM
  const [categoria, setCategoria] = useState('');
  
  // Estados de Upload (Storage)
  const [isUploading, setIsUploading] = useState<string | null>(null); // Guarda qual slot está upando
  const [uploadedUrls, setUploadedUrls] = useState<Record<string, string>>({}); // { "Frontal": "https://..." }

  // Estados da Calculadora CMV
  const [opValorTotal, setOpValorTotal] = useState<number | ''>('');
  const [opQuantidade, setOpQuantidade] = useState<number | ''>('');
  const [custoUnboxing, setCustoUnboxing] = useState<number>(8.50);
  const [margemDesejada, setMargemDesejada] = useState<number>(65);
  
  // Estados Derivados
  const [custoBase, setCustoBase] = useState(0);
  const [cmvTotal, setCmvTotal] = useState(0);
  const [precoSugerido, setPrecoSugerido] = useState(0);
  const [gradeSugerida, setGradeSugerida] = useState({ P: 0, M: 0, G: 0, GG: 0 });

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

  // LÓGICA DE UPLOAD PARA O BUCKET 'artefatos'
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, slotName: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(slotName);

    try {
      // 1. Gera nome único para evitar sobreposição (Timestamp + Nome)
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${categoria}/${fileName}`; // Cria pastinha por categoria

      // 2. Faz o upload pro Supabase
      const { data, error } = await supabase.storage
        .from('artefatos')
        .upload(filePath, file);

      if (error) throw error;

      // 3. Pega a URL Pública (para exibir no site depois)
      const { data: { publicUrl } } = supabase.storage
        .from('artefatos')
        .getPublicUrl(filePath);

      // 4. Salva a URL no estado
      setUploadedUrls(prev => ({ ...prev, [slotName]: publicUrl }));
      
    } catch (error) {
      console.error('Erro no upload:', error);
      alert('Falha ao subir imagem. Verifique se o bucket "artefatos" é público no Supabase.');
    } finally {
      setIsUploading(null);
    }
  };

  // Motor de Cálculo em Tempo Real
  useEffect(() => {
    if (opValorTotal && opQuantidade) {
      const base = Number(opValorTotal) / Number(opQuantidade);
      setCustoBase(base);
      const totalCmv = base + custoUnboxing;
      setCmvTotal(totalCmv);
      const multiplicadorMargem = 1 - (margemDesejada / 100);
      const precoFinal = multiplicadorMargem > 0 ? totalCmv / multiplicadorMargem : 0;
      setPrecoSugerido(precoFinal);

      const qtd = Number(opQuantidade);
      setGradeSugerida({
        P: Math.round(qtd * 0.15),
        M: Math.round(qtd * 0.35),
        G: Math.round(qtd * 0.35),
        GG: Math.round(qtd * 0.15),
      });
    } else {
      setCustoBase(0); setCmvTotal(0); setPrecoSugerido(0); setGradeSugerida({ P: 0, M: 0, G: 0, GG: 0 });
    }
  }, [opValorTotal, opQuantidade, custoUnboxing, margemDesejada]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 font-sans max-w-5xl mx-auto">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <Link href="/cortex/catalogo" className="text-xs text-zinc-500 font-mono font-bold hover:text-zinc-900 mb-2 inline-block">
            &larr; Voltar ao Catálogo
          </Link>
          <h1 className="text-2xl font-bold text-zinc-900 font-serif tracking-wide uppercase flex items-center gap-3">
            Motor PIM <Package className="w-6 h-6 text-zinc-800" />
          </h1>
          <p className="text-sm text-zinc-500 font-mono mt-1 font-bold">Product Information Management & Precificação Ativa</p>
        </div>
        <button className="px-5 py-3 text-xs font-black uppercase tracking-wider text-white bg-zinc-900 border border-zinc-800 rounded hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 shadow-sm">
          <Save className="w-4 h-4" /> Salvar Artefato
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* COLUNA ESQUERDA: INFOS E IMAGENS */}
        <div className="space-y-6">
          
          <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm space-y-4">
            <h2 className="text-sm font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2 border-b border-zinc-100 pb-3">
              <Tag className="w-4 h-4 text-zinc-500" /> Identidade do Artefato
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 mb-2">
                  Nome do Artefato (Latim)
                </label>
                <input 
                  type="text" 
                  placeholder="Ex: Camiseta Vestigium"
                  className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-500 focus:bg-white transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-widest text-zinc-500 mb-2">
                  Família / Categoria
                </label>
                <select 
                  className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-500 focus:bg-white transition-colors appearance-none font-bold"
                  value={categoria}
                  onChange={(e) => {
                    setCategoria(e.target.value);
                    setUploadedUrls({}); // Reseta as fotos se trocar a categoria
                  }}
                >
                  <option value="" disabled>Selecione a Categoria Arquitetural...</option>
                  <option value="TOPWEAR">Topwear (Camisetas, Regatas, Compressão)</option>
                  <option value="BOTTOMWEAR">Bottomwear (Shorts, Calças)</option>
                  <option value="HEADWEAR">Headwear (Bonés, Viseiras)</option>
                  <option value="ACESSORIOS">Acessórios Têxteis (Meias, Toalhas)</option>
                </select>
              </div>
            </div>
          </div>

          {/* MOTOR DE UPLOAD (PIM) */}
          {categoria && (
            <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm space-y-4 animate-in fade-in zoom-in duration-300">
              <h2 className="text-sm font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2 border-b border-zinc-100 pb-3">
                <Camera className="w-4 h-4 text-emerald-600" /> Exigências de Mídia (PIM)
              </h2>
              <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                Clique nos slots para conectar o artefato ao servidor Supabase. O sistema armazenará os vetores automaticamente.
              </p>
              
              <div className="grid grid-cols-2 gap-4 mt-4">
                {getSlots().map((slot, index) => (
                  <label key={index} className="relative border-2 border-dashed border-zinc-200 bg-zinc-50 rounded-lg h-32 flex flex-col items-center justify-center text-center cursor-pointer hover:border-zinc-400 hover:bg-zinc-100 transition-all group overflow-hidden">
                    <input 
                      type="file" 
                      accept="image/png, image/jpeg, image/webp"
                      className="hidden" 
                      onChange={(e) => handleFileUpload(e, slot)}
                      disabled={isUploading === slot}
                    />
                    
                    {isUploading === slot ? (
                      <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-5 h-5 text-emerald-600 animate-spin" />
                        <span className="text-[9px] font-mono text-emerald-700 font-bold uppercase tracking-widest">Enviando...</span>
                      </div>
                    ) : uploadedUrls[slot] ? (
                      <div className="absolute inset-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={uploadedUrls[slot]} alt={slot} className="w-full h-full object-cover opacity-90 group-hover:opacity-60 transition-opacity" />
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                          <CheckCircle2 className="w-6 h-6 text-white mb-1" />
                          <span className="text-[9px] font-mono text-white font-bold uppercase tracking-widest">Trocar Imagem</span>
                        </div>
                      </div>
                    ) : (
                      <>
                        <Camera className="w-6 h-6 text-zinc-300 group-hover:text-zinc-500 mb-2" />
                        <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500">{slot}</span>
                        <span className="text-[9px] text-zinc-400 mt-1">Upload PNG/JPG</span>
                      </>
                    )}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* COLUNA DIREITA: CALCULADORA E GRADE */}
        <div className="space-y-6">
          <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 shadow-sm space-y-5 text-white">
            <h2 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Calculator className="w-4 h-4 text-amber-500" /> Calculadora de Margem (C-Level)
            </h2>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-2">Valor Total da OP (R$)</label>
                <input type="number" value={opValorTotal} onChange={(e) => setOpValorTotal(Number(e.target.value))} placeholder="Ex: 5000" className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors font-mono" />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-2">Qtd. Produzida (Unidades)</label>
                <input type="number" value={opQuantidade} onChange={(e) => setOpQuantidade(Number(e.target.value))} placeholder="Ex: 100" className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-white focus:outline-none focus:border-amber-500 transition-colors font-mono" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 mb-2">Custo Unboxing/Envio (Fixo)</label>
                <input type="number" value={custoUnboxing} onChange={(e) => setCustoUnboxing(Number(e.target.value))} className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3 text-sm text-zinc-400 focus:outline-none focus:border-amber-500 transition-colors font-mono" />
              </div>
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-400 mb-2">Margem de Lucro Alvo (%)</label>
                <input type="number" value={margemDesejada} onChange={(e) => setMargemDesejada(Number(e.target.value))} className="w-full bg-zinc-950 border border-emerald-900 px-4 py-3 text-sm text-emerald-400 focus:outline-none focus:border-emerald-500 transition-colors font-mono font-bold" />
              </div>
            </div>

            <div className="bg-zinc-950 rounded p-5 border border-zinc-800 mt-4">
              <div className="flex justify-between items-center mb-3 border-b border-zinc-900 pb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Custo Base da Peça:</span>
                <span className="text-sm font-mono text-zinc-300">{formatBRL(custoBase)}</span>
              </div>
              <div className="flex justify-between items-center mb-3 border-b border-zinc-900 pb-3">
                <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500 flex items-center gap-1.5"><AlertTriangle className="w-3 h-3"/> CMV Total (Peça + Unboxing):</span>
                <span className="text-sm font-mono text-zinc-300">{formatBRL(cmvTotal)}</span>
              </div>
              <div className="flex justify-between items-end pt-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 font-bold">Preço de Venda Sugerido:</span>
                <span className="text-3xl font-black text-white tracking-tight">{formatBRL(precoSugerido)}</span>
              </div>
            </div>
          </div>

          {opQuantidade && Number(opQuantidade) > 0 && (
            <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex justify-between items-start border-b border-zinc-100 pb-3">
                <h2 className="text-sm font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
                  <Layers className="w-4 h-4 text-zinc-500" /> Matriz True Fit
                </h2>
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400 bg-zinc-100 px-2 py-1 rounded">Curva Padrão: 15-35-35-15</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed font-medium mb-4">
                Com base na sua compra de <strong className="text-zinc-900">{opQuantidade} unidades</strong>, esta é a divisão exata sugerida para a confecção visando mitigar encalhe:
              </p>
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-zinc-50 border border-zinc-200 rounded p-3 text-center">
                  <span className="block text-lg font-black text-zinc-900">{gradeSugerida.P}</span>
                  <span className="block text-[10px] font-mono font-bold text-zinc-500 mt-1">Tamanho P</span>
                </div>
                <div className="bg-zinc-100 border border-zinc-300 rounded p-3 text-center shadow-inner">
                  <span className="block text-lg font-black text-zinc-900">{gradeSugerida.M}</span>
                  <span className="block text-[10px] font-mono font-bold text-zinc-700 mt-1">Tamanho M</span>
                </div>
                <div className="bg-zinc-100 border border-zinc-300 rounded p-3 text-center shadow-inner">
                  <span className="block text-lg font-black text-zinc-900">{gradeSugerida.G}</span>
                  <span className="block text-[10px] font-mono font-bold text-zinc-700 mt-1">Tamanho G</span>
                </div>
                <div className="bg-zinc-50 border border-zinc-200 rounded p-3 text-center">
                  <span className="block text-lg font-black text-zinc-900">{gradeSugerida.GG}</span>
                  <span className="block text-[10px] font-mono font-bold text-zinc-500 mt-1">Tamanho GG</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}