'use client';

import { useState } from 'react';
import FadeIn from '@/components/FadeIn';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SenadoVipPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      await supabase.from('senado_vip').insert([
        {
          email: email.trim().toLowerCase(),
          name: name.trim() || null,
          phone: phone.trim() || null,
          origin: 'portal_senado_vip',
          status: 'active',
        },
      ]);
    } catch (err) {
      console.error('Erro ao cadastrar no Senado VIP:', err);
    } finally {
      setLoading(false);
      setSubmitted(true);
    }
  };

  return (
    <div className="pt-36 pb-28 px-6 md:px-12 max-w-4xl mx-auto space-y-20 font-sans">

      <FadeIn>
        <div className="text-center space-y-4">
          <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase">CÍRCULO DE PERTENCIMENTO & PRÁTICA</span>
          <h1 className="font-serif text-3xl md:text-6xl tracking-[0.25em] text-white uppercase font-bold">SENADO VIP.</h1>
          <p className="text-xs font-mono tracking-[0.3em] text-zinc-400">ACESSO PRIORITÁRIO • FORTALEZA, BRASIL.</p>
        </div>
      </FadeIn>

      {!submitted ? (
        <FadeIn delay={150}>
          <form onSubmit={handleSubmit} className="bg-[#080808] border border-zinc-900 p-8 md:p-12 space-y-8">
            <div className="space-y-2 border-b border-zinc-800 pb-4">
              <h2 className="font-serif text-lg text-white font-bold uppercase tracking-wider">SOLICITAR INGRESSO</h2>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                O Senado VIP reúne praticantes e entusiastas que vivem o esporte e a costa. Membros garantem reserva prioritária em novos lotes antes da abertura geral do acervo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
              <div className="md:col-span-2">
                <label className="block text-zinc-400 mb-2 uppercase tracking-widest text-[10px]">NOME COMPLETO:</label>
                <input
                  type="text"
                  required
                  placeholder="SEU NOME"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3.5 text-white focus:outline-none focus:border-white transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-2 uppercase tracking-widest text-[10px]">E-MAIL PRINCIPAL:</label>
                <input
                  type="email"
                  required
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3.5 text-white focus:outline-none focus:border-white transition-all font-mono"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-2 uppercase tracking-widest text-[10px]">WHATSAPP / TELEFONE:</label>
                <input
                  type="text"
                  placeholder="(85) 90000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3.5 text-white focus:outline-none focus:border-white transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-white text-black font-bold text-xs tracking-[0.3em] uppercase py-4 hover:bg-zinc-200 transition-all font-sans shadow-xl disabled:opacity-50"
            >
              {loading ? 'VALIDANDO DADOS...' : 'SOLICITAR ACESSO AO SENADO.'}
            </button>
          </form>
        </FadeIn>
      ) : (
        <FadeIn>
          <div className="bg-[#080808] border border-zinc-800 p-12 text-center space-y-6 font-mono">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">CREDENCIAL REGISTRADA</span>
            <h2 className="font-serif text-2xl text-white font-bold tracking-wider uppercase">BEM-VINDO AO SENADO.</h2>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans font-light max-w-md mx-auto">
              Seu acesso para <span className="text-white font-bold">{email}</span> foi confirmado no sistema. As aberturas privativas serão enviadas diretamente para a sua caixa de entrada com 24 horas de antecedência.
            </p>
            <button
              onClick={() => setSubmitted(false)}
              className="text-xs text-zinc-400 underline underline-offset-4 hover:text-white pt-4"
            >
              RETORNAR AO FORMULÁRIO.
            </button>
          </div>
        </FadeIn>
      )}

      {/* PILARES DO SENADO VIP */}
      <FadeIn delay={250}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-3">
            <span className="text-white font-bold uppercase block tracking-widest">01 // JANELA DE 24H</span>
            <p className="text-zinc-500 text-[11px] leading-relaxed font-sans">
              Acesso privativo antecipado aos lançamentos antes da liberação ao público geral.
            </p>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-3">
            <span className="text-white font-bold uppercase block tracking-widest">02 // LOTES LIMITADOS</span>
            <p className="text-zinc-500 text-[11px] leading-relaxed font-sans">
              Garantia de reserva em tiragens numeradas com produção técnica controlada.
            </p>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-3">
            <span className="text-white font-bold uppercase block tracking-widest">03 // CANAL DIRETO</span>
            <p className="text-zinc-500 text-[11px] leading-relaxed font-sans">
              Comunicação sem intermediários para ajustes, suporte de entregas e feedback de campo.
            </p>
          </div>
        </div>
      </FadeIn>

    </div>
  );
}
