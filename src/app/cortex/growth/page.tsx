'use client';

import React, { useState } from 'react';
import { TrendingUp, Link as LinkIcon, Users, Target, Activity, MessageCircle, Copy, CheckCircle2, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function GrowthAnalytics() {
  const formatBRL = (val: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);

  // Estados do Gerador UTM
  const [urlOriginal, setUrlOriginal] = useState('');
  const [utmSource, setUtmSource] = useState('');
  const [utmMedium, setUtmMedium] = useState('');
  const [utmCampaign, setUtmCampaign] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerateUTM = () => {
    if (!urlOriginal) return;
    const slug = utmCampaign ? utmCampaign.toLowerCase().replace(/\s+/g, '-') : 'campanha';
    setGeneratedLink(`https://laromme.com.br/go/${utmSource.toLowerCase()}-${slug}`);
    setCopied(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Mock Data: Radar RFM (Recência, Frequência, Valor Monetário)
  const rfmClients = [
    { id: '1', name: 'Thiago Mendes', ltv: 1450.00, lastPurchase: 'Há 85 dias', status: 'Risco de Fuga', color: 'rose' },
    { id: '2', name: 'Marina Costa', ltv: 890.00, lastPurchase: 'Há 12 dias', status: 'Ativo VIP', color: 'emerald' },
    { id: '3', name: 'Lucas Albuquerque', ltv: 3200.00, lastPurchase: 'Há 110 dias', status: 'Dormente', color: 'amber' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12 font-sans max-w-6xl mx-auto">
      
      {/* CABEÇALHO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-zinc-200 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 font-serif tracking-wide uppercase flex items-center gap-3">
            Growth & Comportamento <TrendingUp className="w-6 h-6 text-emerald-600" />
          </h1>
          <p className="text-sm text-zinc-500 font-mono mt-1 font-bold">Rastreio de Aquisição, Persona True Fit e Radar RFM</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUNA ESQUERDA: UTM E RFM */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Seção 1: Gerador UTM Proprietário */}
          <div className="bg-white p-6 rounded-lg border border-zinc-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
              <h2 className="text-sm font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-zinc-500" /> Gerador de Links (UTM LaRomme)
              </h2>
              <span className="text-[10px] font-mono bg-zinc-100 px-2 py-1 rounded text-zinc-500 font-bold uppercase">Substitui Linktree</span>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-2">URL Destino (Vitrine ou Produto)</label>
                <input 
                  type="text" 
                  value={urlOriginal}
                  onChange={(e) => setUrlOriginal(e.target.value)}
                  placeholder="Ex: https://laromme.com.br/produto/tenax"
                  className="w-full bg-zinc-50 border border-zinc-200 px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-zinc-500 transition-colors font-mono"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-2">Origem (Source)</label>
                  <input type="text" value={utmSource} onChange={(e) => setUtmSource(e.target.value)} placeholder="Ex: Meta" className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-zinc-500 font-mono" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-2">Mídia (Medium)</label>
                  <input type="text" value={utmMedium} onChange={(e) => setUtmMedium(e.target.value)} placeholder="Ex: IG_Stories" className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-zinc-500 font-mono" />
                </div>
                <div>
                  <label className="block text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-500 mb-2">Campanha</label>
                  <input type="text" value={utmCampaign} onChange={(e) => setUtmCampaign(e.target.value)} placeholder="Ex: Drop02" className="w-full bg-zinc-50 border border-zinc-200 px-3 py-2 text-sm text-zinc-900 focus:outline-none focus:border-zinc-500 font-mono" />
                </div>
              </div>

              <button 
                onClick={handleGenerateUTM}
                className="w-full py-3 text-xs font-black uppercase tracking-wider text-white bg-zinc-900 border border-zinc-800 rounded hover:bg-zinc-800 transition-colors"
              >
                Gerar Link Encurtado LaRomme
              </button>

              {generatedLink && (
                <div className="mt-4 p-4 bg-emerald-50 border border-emerald-200 rounded flex items-center justify-between animate-in zoom-in duration-300">
                  <div>
                    <span className="block text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-800 mb-1">Link Pronto para Uso:</span>
                    <span className="text-sm font-mono text-emerald-900 font-bold">{generatedLink}</span>
                  </div>
                  <button onClick={copyToClipboard} className="p-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded transition-colors">
                    {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Seção 2: Radar RFM */}
          <div className="bg-white rounded-lg border border-zinc-200 shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-zinc-100 bg-zinc-50">
              <h2 className="text-sm font-bold text-zinc-900 tracking-widest uppercase flex items-center gap-2">
                <Target className="w-4 h-4 text-rose-500" /> Radar RFM (Resgate de Patronos)
              </h2>
            </div>
            
            <div className="divide-y divide-zinc-100">
              {rfmClients.map((client) => (
                <div key={client.id} className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4 hover:bg-zinc-50 transition-colors">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-black text-zinc-900 uppercase tracking-wide">{client.name}</span>
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded border ${
                        client.color === 'rose' ? 'bg-rose-50 text-rose-700 border-rose-200' :
                        client.color === 'emerald' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {client.status}
                      </span>
                    </div>
                    <span className="text-xs font-mono text-zinc-500 font-bold">LTV: {formatBRL(client.ltv)} • Última compra: {client.lastPurchase}</span>
                  </div>
                  
                  <button className="w-full sm:w-auto px-4 py-2 text-[10px] font-black uppercase tracking-wider text-emerald-900 bg-emerald-400 border border-emerald-500 rounded hover:bg-emerald-500 transition-colors flex items-center justify-center gap-2 shadow-sm">
                    <MessageCircle className="w-3.5 h-3.5" /> Acionar Concierge
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLUNA DIREITA: PERSONA TRUE FIT */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 shadow-sm space-y-5 text-white">
            <div className="border-b border-zinc-800 pb-3">
              <h2 className="text-sm font-bold text-white tracking-widest uppercase flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-500" /> Mapa "Persona True Fit"
              </h2>
              <p className="text-[10px] font-mono text-zinc-400 mt-2 uppercase tracking-widest">
                Interseção de Modelagem vs Público Alvo
              </p>
            </div>
            
            <div className="space-y-6">
              {/* Categoria: Topwear */}
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-zinc-300 block mb-3 border-l-2 border-amber-500 pl-2">Topwear (Camisetas & Regatas)</span>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-zinc-950 border border-zinc-800 rounded p-2 text-center">
                    <span className="block text-[10px] font-mono text-zinc-500 mb-1">TAM P</span>
                    <span className="block text-sm font-black text-zinc-300">12%</span>
                  </div>
                  <div className="bg-amber-500/20 border border-amber-500/50 rounded p-2 text-center shadow-inner">
                    <span className="block text-[10px] font-mono text-amber-500 mb-1">TAM M</span>
                    <span className="block text-sm font-black text-amber-400">45%</span>
                  </div>
                  <div className="bg-zinc-800 border border-zinc-700 rounded p-2 text-center">
                    <span className="block text-[10px] font-mono text-zinc-400 mb-1">TAM G</span>
                    <span className="block text-sm font-black text-white">35%</span>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800 rounded p-2 text-center">
                    <span className="block text-[10px] font-mono text-zinc-500 mb-1">TAM GG</span>
                    <span className="block text-sm font-black text-zinc-300">8%</span>
                  </div>
                </div>
              </div>

              {/* Categoria: Bottomwear */}
              <div>
                <span className="text-xs font-black uppercase tracking-widest text-zinc-300 block mb-3 border-l-2 border-emerald-500 pl-2">Bottomwear (Shorts)</span>
                <div className="grid grid-cols-4 gap-2">
                  <div className="bg-zinc-950 border border-zinc-800 rounded p-2 text-center">
                    <span className="block text-[10px] font-mono text-zinc-500 mb-1">TAM P</span>
                    <span className="block text-sm font-black text-zinc-300">5%</span>
                  </div>
                  <div className="bg-zinc-800 border border-zinc-700 rounded p-2 text-center">
                    <span className="block text-[10px] font-mono text-zinc-400 mb-1">TAM M</span>
                    <span className="block text-sm font-black text-white">30%</span>
                  </div>
                  <div className="bg-emerald-500/20 border border-emerald-500/50 rounded p-2 text-center shadow-inner">
                    <span className="block text-[10px] font-mono text-emerald-500 mb-1">TAM G</span>
                    <span className="block text-sm font-black text-emerald-400">55%</span>
                  </div>
                  <div className="bg-zinc-950 border border-zinc-800 rounded p-2 text-center">
                    <span className="block text-[10px] font-mono text-zinc-500 mb-1">TAM GG</span>
                    <span className="block text-sm font-black text-zinc-300">10%</span>
                  </div>
                </div>
              </div>

              {/* Insight Automático */}
              <div className="bg-zinc-950 border border-zinc-800 rounded p-4 flex gap-3 mt-4">
                <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <p className="text-[11px] text-zinc-400 leading-relaxed font-mono">
                  <strong className="text-zinc-200">Insight P&D:</strong> Seus Patronos possuem tronco médio (M) e pernas/quadril mais largos (G). Para a próxima fábrica, solicite a grade Topwear (1-4-3-1) e Bottomwear (1-3-5-1).
                </p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}