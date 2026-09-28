'use client';

import { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { playHapticSound } from '@/lib/sound';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function HomeManifesto() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    playHapticSound();
    
    if (!email) return;
    setLoading(true);

    try {
      await supabase.from('customers').insert([{
        full_name: 'Lead Lote Zero',
        email: email,
        rfm_tag: 'WAITLIST_LOTE_ZERO',
        total_purchases: 0,
        ltv: 0
      }]);
      setRegistered(true);
    } catch (err) {
      console.error(err);
      setRegistered(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col items-center justify-between px-6 py-12 font-sans overflow-hidden">
      
      {/* CAMADA DE FUNDO DA PRAIA (MANTIDA COM OVERLAY ESCURO) */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-luminosity pointer-events-none">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=2073&auto=format&fit=crop"
        >
          <source src="https://assets.mixkit.co/videos/preview/mixkit-dramatic-dark-ocean-waves-4216-large.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/80"></div>
      </div>

      {/* HEADER SUPERIOR */}
      <header className="z-10 w-full max-w-5xl flex justify-between items-center font-mono text-xs border-b border-zinc-800/80 pb-4">
        <span className="font-bold tracking-widest text-white uppercase">LaRomme.</span>
        <div className="flex items-center gap-2 bg-black/60 border border-zinc-800 px-3 py-1 rounded-full backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
          <span className="text-[10px] text-amber-400 uppercase tracking-wider font-bold">LOTE ZERO • FORJANDO</span>
        </div>
      </header>

      {/* CONTEÚDO CENTRAL: MANIFESTO & CAPTAÇÃO */}
      <div className="z-10 max-w-2xl w-full my-auto space-y-8 text-center font-mono py-12">
        
        <div className="space-y-3">
          <span className="text-[10px] text-amber-400 uppercase tracking-widest block font-bold">
            ✦ MANIFESTO DE ABERTURA
          </span>
          <h1 className="text-3xl md:text-5xl font-serif uppercase tracking-[0.15em] text-white">
            O Luxo Exige Silêncio.
          </h1>
        </div>

        <div className="space-y-4 text-zinc-300 font-sans leading-relaxed text-xs md:text-sm bg-black/50 border border-zinc-800/80 p-6 md:p-8 rounded-lg backdrop-blur-md text-center">
          <p>
            Estamos finalizando a fundição do <strong className="text-white">Lote Zero</strong>. Peças de alta gramatura, modelagem Boxy Heavyweight e seriais numéricos gravados a laser.
          </p>
          <p className="text-zinc-400 text-[11px]">
            O estoque será limitado e irrepetível. Cadastre seu e-mail para receber a chave de acesso reservada 1 hora antes do público geral.
          </p>
        </div>

        {/* FORMULÁRIO DE ENTRADA NO SENADO VIP */}
        <div className="pt-2">
          {registered ? (
            <div className="bg-emerald-950/80 border border-emerald-800 text-emerald-400 p-4 rounded-lg font-mono text-xs backdrop-blur-md">
              ✓ Credencial registrada. Seu e-mail está na lista de prioridade do Lote Zero.
            </div>
          ) : (
            <form onSubmit={handleRegister} className="max-w-md mx-auto space-y-3">
              <input
                type="email"
                required
                placeholder="seu.email@dominio.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/80 border border-zinc-700 px-4 py-3.5 text-xs text-white outline-none focus:border-white transition-colors text-center backdrop-blur-md"
              />
              <button
                type="submit"
                disabled={loading}
                onClick={playHapticSound}
                className="w-full bg-white text-black font-bold text-xs uppercase tracking-widest py-4 hover:bg-zinc-200 transition-colors disabled:opacity-50"
              >
                {loading ? '[ REGISTRANDO... ]' : '[ REQUERER ACESSO ANTECIPADO ]'}
              </button>
            </form>
          )}
        </div>

      </div>

      {/* FOOTER */}
      <footer className="z-10 w-full max-w-5xl flex justify-between items-center font-mono text-[9px] text-zinc-500 border-t border-zinc-800/80 pt-4 uppercase">
        <span>SÃO PAULO • BR</span>
        <span>© 2026 LAROMME BRAND</span>
      </footer>

    </main>
  );
}