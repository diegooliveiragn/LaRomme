'use client';

import { useState } from 'react';
import FadeIn from '@/components/FadeIn';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SenadoVipPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [patronoId, setPatronoId] = useState('');

  // Form State
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [esporte, setEsporte] = useState('LIFESTYLE');
  const [tamanho, setTamanho] = useState('M');
  const [estado, setEstado] = useState('CE');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !nome) return;

    setLoading(true);
    try {
      // Tentativa de salvar na tabela (requer que a tabela senado_vip tenha as novas colunas configuradas no Supabase)
      await supabase.from('senado_vip').insert([
        {
          nome: nome.trim(),
          email: email.trim().toLowerCase(),
          whatsapp: whatsapp.trim(),
          esporte,
          tamanho,
          estado,
          origin: 'portal_alistamento',
          status: 'active',
        },
      ]);
    } catch (err) {
      console.error('Alerta (Pode ignorar se os campos não existirem no backend ainda):', err);
    } finally {
      // Gera ID Visual fake para a credencial e libera a tela
      setPatronoId(Math.floor(1000 + Math.random() * 9000).toString());
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="pt-36 pb-28 px-6 md:px-12 max-w-3xl mx-auto space-y-16 font-sans">
      <FadeIn>
        <div className="text-center space-y-4">
          <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase">PORTAL DO MEMBRO</span>
          <h1 className="font-serif text-3xl md:text-5xl tracking-[0.25em] text-white uppercase font-bold">SENADO VIP.</h1>
          <p className="text-xs font-mono tracking-[0.3em] text-zinc-400">PASSE LIVRE & ALISTAMENTO NO DROP 01.</p>
        </div>
      </FadeIn>

      {!submitted ? (
        <FadeIn delay={150}>
          <form onSubmit={handleSubmit} className="bg-[#080808] border border-zinc-900 p-8 md:p-12 space-y-8">
            <div className="space-y-2 border-b border-zinc-800 pb-4">
              <h2 className="font-serif text-lg text-white font-bold uppercase tracking-wider">FICHA DE ALISTAMENTO</h2>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Preencha suas coordenadas para receber o link de acesso exclusivo 24 horas antes da abertura do Drop 01. Garanta sua numeração antes do tráfego público.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
              <div className="md:col-span-2">
                <label className="block text-zinc-400 mb-2 uppercase tracking-widest">NOME DO PATRONO:</label>
                <input type="text" required value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome completo" className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3.5 text-white focus:outline-none focus:border-white transition-all" />
              </div>
              
              <div>
                <label className="block text-zinc-400 mb-2 uppercase tracking-widest">E-MAIL (PRINCIPAL):</label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="patrono@laromme.com.br" className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3.5 text-white focus:outline-none focus:border-white transition-all" />
              </div>

              <div>
                <label className="block text-zinc-400 mb-2 uppercase tracking-widest">WHATSAPP (OPCIONAL):</label>
                <input type="tel" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="(85) 90000-0000" className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3.5 text-white focus:outline-none focus:border-white transition-all" />
              </div>

              <div>
                <label className="block text-zinc-400 mb-2 uppercase tracking-widest">ARENA DE ATUAÇÃO:</label>
                <select value={esporte} onChange={(e) => setEsporte(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3.5 text-white focus:outline-none focus:border-white transition-all appearance-none cursor-pointer">
                  <option value="BEACH TENNIS">BEACH TENNIS</option>
                  <option value="CORRIDA DE RUA">CORRIDA DE RUA</option>
                  <option value="FUTEVÔLEI">FUTEVÔLEI</option>
                  <option value="TREINO FUNCIONAL / CROSS">TREINO FUNCIONAL / CROSS</option>
                  <option value="LIFESTYLE">LIFESTYLE / CASUAL</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-zinc-400 mb-2 uppercase tracking-widest">TAMANHO:</label>
                  <select value={tamanho} onChange={(e) => setTamanho(e.target.value)} className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3.5 text-white focus:outline-none focus:border-white transition-all appearance-none cursor-pointer text-center">
                    <option value="P">P</option>
                    <option value="M">M</option>
                    <option value="G">G</option>
                    <option value="GG">GG</option>
                  </select>
                </div>
                <div>
                  <label className="block text-zinc-400 mb-2 uppercase tracking-widest">ESTADO:</label>
                  <input type="text" value={estado} onChange={(e) => setEstado(e.target.value)} maxLength={2} placeholder="CE" className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3.5 text-white focus:outline-none focus:border-white transition-all text-center uppercase" />
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-white text-black font-bold text-xs tracking-[0.3em] uppercase py-4 mt-4 hover:bg-zinc-200 transition-all font-sans shadow-xl disabled:opacity-50">
              {loading ? 'PROCESSANDO CREDENCIAL...' : 'SOLICITAR ACESSO AO LOTE ZERO.'}
            </button>
          </form>
        </FadeIn>
      ) : (
        <FadeIn>
          <div className="bg-[#080808] border border-zinc-800 p-8 md:p-12 space-y-8 font-mono">
            <div className="text-center space-y-2">
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">ALISTAMENTO CONCLUÍDO</span>
              <h2 className="font-serif text-2xl text-white font-bold tracking-wider uppercase">BEM-VINDO AO SENADO.</h2>
            </div>
            
            {/* CREDENCIAL DIGITAL (CARD TÁTICO) */}
            <div className="border border-white/20 bg-zinc-950 p-6 md:p-8 relative overflow-hidden shadow-[0_0_30px_rgba(255,255,255,0.05)]">
              <div className="absolute top-0 right-0 bg-white text-black px-3 py-1 text-[9px] font-bold tracking-widest">ACESSO LIBERADO</div>
              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-end border-b border-zinc-800 pb-3">
                  <span className="text-[10px] text-zinc-500 tracking-widest">PATRONO</span>
                  <span className="text-white font-bold uppercase truncate max-w-[200px]">{nome || 'MEMBRO VIP'}</span>
                </div>
                <div className="flex justify-between items-end border-b border-zinc-800 pb-3">
                  <span className="text-[10px] text-zinc-500 tracking-widest">CREDENCIAL</span>
                  <span className="text-white font-bold tracking-widest">#{patronoId} / LOTE ZERO</span>
                </div>
                <div className="flex justify-between items-end border-b border-zinc-800 pb-3">
                  <span className="text-[10px] text-zinc-500 tracking-widest">PERFIL TÁTICO</span>
                  <span className="text-white text-xs uppercase">{tamanho} • {esporte}</span>
                </div>
                <div className="flex justify-between items-end pt-2">
                  <span className="text-[9px] text-zinc-600 tracking-widest">COORDENADAS ATIVAS</span>
                  <span className="text-[9px] text-zinc-500 tracking-widest">03°43'16"S 38°32'41"W</span>
                </div>
              </div>
            </div>
            
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans font-light text-center">
              Tire um print de sua credencial. O link do cofre privado será enviado para <strong className="text-white">{email}</strong> com 24 horas de antecedência ao lançamento público.
            </p>
          </div>
        </FadeIn>
      )}

      {/* BENEFÍCIOS DO SENADO VIP */}
      <FadeIn delay={250}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-2">
            <span className="text-white font-bold uppercase block tracking-widest">01 // CONCIERGE DIRETO</span>
            <p className="text-zinc-500 text-[11px]">Reserva de peças limitadas e suporte tático via WhatsApp para os primeiros cadastrados.</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-2">
            <span className="text-white font-bold uppercase block tracking-widest">02 // ACESSO DE 24 HORAS</span>
            <p className="text-zinc-500 text-[11px]">Garantia de escolha da numeração no Lote Zero antes que o acervo chegue ao público geral.</p>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
