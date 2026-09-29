'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { playHapticSound } from '@/lib/sound';
import { trackEvent } from '@/lib/telemetry';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function Home() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [registered, setRegistered] = useState(false);
  
  const [fadeState, setFadeState] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  // ASSETS OFICIAIS HOSPEDADOS NO SUPABASE STORAGE
  const LOGO_CAPACETE_URL = "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Assets/logo%20branca.png";
  const LOGO_NOME_URL = "https://ekljqqdhrltlydomfeua.supabase.co/storage/v1/object/public/Assets/fcfc607a-ba81-4ff7-998e-2df1f0697b81-removebg-preview.png";

  const phrases = [
    "LaRomme.",
    "A força de Roma.",
    "O movimento de Fortaleza.",
    "Lote Zero.",
    "LOGO" 
  ];

  useEffect(() => {
    trackEvent('home_view');
    const cycleText = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setFadeState((prev) => (prev + 1) % phrases.length);
        setIsVisible(true);
      }, 1200);
    }, 4500);
    return () => clearInterval(cycleText);
  }, [phrases.length]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    playHapticSound();
    
    if (!email) return;
    setLoading(true);

    try {
      await supabase.from('customers').insert([{
        full_name: 'Senado VIP - Waitlist',
        email: email,
        rfm_tag: 'WAITLIST_LOTE_ZERO',
        total_purchases: 0,
        ltv: 0
      }]);
      trackEvent('waitlist_signup', { email });
      setRegistered(true);
    } catch (err) {
      setRegistered(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-[100dvh] bg-black text-white flex flex-col justify-between overflow-hidden font-sans">
      
      {/* VÍDEO HERO EM ESCALA DE CINZA */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover grayscale opacity-40 filter contrast-125"
        >
          <source src="/hero-beach.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/70"></div>
      </div>

      {/* CABEÇALHO RESTAURADO COM LOGO E LOGOTIPO OFICIAIS DO SUPABASE */}
      <header className="relative z-10 w-full px-6 pt-14 pb-4 flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/" onClick={playHapticSound} className="flex items-center gap-3.5 group">
          <img 
            src={LOGO_CAPACETE_URL} 
            alt="Capacete LaRomme" 
            className="w-8 h-8 md:w-9 md:h-9 object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <img 
            src={LOGO_NOME_URL} 
            alt="LaRomme" 
            className="h-5 md:h-6 object-contain hidden sm:block opacity-90 group-hover:opacity-100 transition-opacity duration-300"
          />
        </Link>

        <Link 
          href="/acesso" 
          onClick={() => { playHapticSound(); trackEvent('nav_senado_vip_click'); }} 
          className="text-[10px] md:text-xs font-sans uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
        >
          Senado VIP
        </Link>
      </header>

      {/* ANIMAÇÃO CENTRAL (FRASES + FADE-IN DO CAPACETE EM NUVEM) */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {phrases[fadeState] === "LOGO" ? (
             <div className="flex flex-col items-center justify-center animate-in zoom-in-95 duration-1000">
               <img 
                 src={LOGO_CAPACETE_URL} 
                 alt="Símbolo LaRomme" 
                 className="w-28 h-28 md:w-40 md:h-40 object-contain drop-shadow-[0_0_35px_rgba(255,255,255,0.25)]"
               />
             </div>
          ) : (
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-serif text-white text-center tracking-[0.15em]">
              {phrases[fadeState]}
            </h1>
          )}
        </div>
      </div>

      {/* RODAPÉ */}
      <div className="relative z-10 w-full px-6 pb-12 pt-6 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="w-full md:w-auto">
          {registered ? (
            <p className="text-xs font-sans tracking-widest text-emerald-400 uppercase text-center md:text-left">
              Sua credencial foi ativada.
            </p>
          ) : (
            <form 
              onSubmit={handleRegister} 
              className="flex flex-col sm:flex-row gap-0 sm:gap-4 items-center border-b border-zinc-600/50 pb-2 transition-colors focus-within:border-white"
            >
              <input
                type="email"
                required
                placeholder="E-mail para acesso restrito"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-transparent text-[10px] md:text-xs font-sans tracking-widest text-white placeholder:text-zinc-500 outline-none w-full sm:w-64 text-center sm:text-left py-2"
              />
              <button
                type="submit"
                disabled={loading}
                className="text-[10px] md:text-xs font-sans uppercase tracking-widest text-zinc-400 hover:text-white transition-colors mt-3 sm:mt-0"
              >
                {loading ? 'Aguarde' : 'Descobrir'}
              </button>
            </form>
          )}
        </div>

        <div className="text-[9px] md:text-[10px] font-sans tracking-widest uppercase text-zinc-500">
          Fortaleza • CE
        </div>
      </div>
    </main>
  );
}