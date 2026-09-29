'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { playHapticSound } from '@/lib/sound';
import { trackEvent } from '@/lib/telemetry';
import Link from 'next/link';
import Image from 'next/image';

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

  // A última fase (índice 4) será a imagem da logo central
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

      {/* CABEÇALHO RESTAURADO COM IMAGENS REAIS */}
      <header className="relative z-10 w-full px-6 pt-14 pb-4 flex justify-between items-center max-w-7xl mx-auto">
        <Link href="/" onClick={playHapticSound} className="flex items-center gap-3 group">
          <div className="relative w-8 h-8 transition-transform duration-500 group-hover:scale-105">
            <Image 
              src="/logo-capacete.png" 
              alt="Capacete LaRomme" 
              fill 
              className="object-contain"
              priority
            />
          </div>
          <div className="relative w-28 h-6 opacity-90 transition-opacity duration-500 group-hover:opacity-100 hidden sm:block">
             <Image 
              src="/logo-nome.png" 
              alt="LaRomme" 
              fill 
              className="object-contain object-left"
              priority
            />
          </div>
        </Link>

        <Link 
          href="/acesso" 
          onClick={() => { playHapticSound(); trackEvent('nav_senado_vip_click'); }} 
          className="text-[10px] md:text-xs font-sans uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
        >
          Senado VIP
        </Link>
      </header>

      {/* TEXTO / LOGO CENTRAL PULSANTE */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-6">
        <div className={`transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          {phrases[fadeState] === "LOGO" ? (
             <div className="relative w-32 h-40 md:w-48 md:h-56 mx-auto animate-in zoom-in-95 duration-1000">
               <Image 
                 src="/logo-capacete.png" 
                 alt="Símbolo LaRomme" 
                 fill 
                 className="object-contain drop-shadow-[0_0_30px_rgba(255,255,255,0.15)]"
                 priority
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