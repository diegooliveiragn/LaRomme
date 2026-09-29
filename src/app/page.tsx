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
      
      {/* VÍDEO HERO EM ESCALA DE CINZENTOS */}
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

      {/* CABEÇALHO COM VETOR BRANCO DO CAPACETE E NOME DA MARCA */}
      <header className="relative z-10 w-full px-6 pt-14 pb-4 flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/" onClick={playHapticSound} className="flex items-center gap-3 group">
          {/* VETOR VIVO DO CAPACETE ROMANO */}
          <svg className="w-7 h-7 text-white fill-current transition-transform duration-300 group-hover:scale-105" viewBox="0 0 24 24">
            <path d="M12 2C9.5 2 7 3.5 7 6V9C7 11.21 8.79 13 11 13V15H8C6.34 15 5 16.34 5 18V21H19V18C19 16.34 17.66 15 16 15H13V13C15.21 13 17 11.21 17 9V6C17 3.5 14.5 2 12 2ZM11 4.1C11.32 4.03 11.66 4 12 4C12.34 4 12.68 4.03 13 4.1V11H11V4.1ZM9 6.5C9.8 6.1 10.8 6 12 6C13.2 6 14.2 6.1 15 6.5V9C15 10.1 14.1 11 13 11H11C9.9 11 9 10.1 9 9V6.5Z"/>
          </svg>
          <span className="font-serif text-xl tracking-[0.2em] text-white">LaRomme.</span>
        </Link>

        <Link 
          href="/acesso" 
          onClick={() => { playHapticSound(); trackEvent('nav_senado_vip_click'); }} 
          className="text-[10px] md:text-xs font-sans uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
        >
          Senado VIP
        </Link>
      </header>

      {/* ANIMAÇÃO CENTRAL (FRASES + FADE-IN DO CAPACETE GIGANTE) */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {phrases[fadeState] === "LOGO" ? (
             <div className="flex flex-col items-center justify-center animate-in zoom-in-95 duration-1000">
               <svg className="w-24 h-24 md:w-36 md:h-36 text-white fill-current drop-shadow-[0_0_35px_rgba(255,255,255,0.2)]" viewBox="0 0 24 24">
                 <path d="M12 2C9.5 2 7 3.5 7 6V9C7 11.21 8.79 13 11 13V15H8C6.34 15 5 16.34 5 18V21H19V18C19 16.34 17.66 15 16 15H13V13C15.21 13 17 11.21 17 9V6C17 3.5 14.5 2 12 2ZM11 4.1C11.32 4.03 11.66 4 12 4C12.34 4 12.68 4.03 13 4.1V11H11V4.1ZM9 6.5C9.8 6.1 10.8 6 12 6C13.2 6 14.2 6.1 15 6.5V9C15 10.1 14.1 11 13 11H11C9.9 11 9 10.1 9 9V6.5Z"/>
               </svg>
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