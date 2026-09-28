'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { playHapticSound } from '@/lib/sound';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function AcessoPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    playHapticSound();
    setLoading(true);
    setErrorMsg('');

    try {
      if (mode === 'signup') {
        const redirectUrl = typeof window !== 'undefined' ? `${window.location.origin}/acesso` : undefined;
        const { error: authError } = await supabase.auth.signUp({
          email, password, options: { emailRedirectTo: redirectUrl }
        });
        if (authError) throw authError;

        await supabase.from('customers').insert([{
          full_name: fullName || 'Membro VIP', email: email, rfm_tag: 'NEWBIE', ltv: 0.00
        }]);

        localStorage.setItem('lr_user_email', email);
        alert('Credencial do Senado VIP criada! Verifique seu e-mail para confirmar a conta.');
        setMode('login');
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
        if (authError) throw authError;

        localStorage.setItem('lr_user_email', email);
        if (email === 'diegooliveiragn@gmail.com') {
          localStorage.setItem('lr_ceo_mode', 'true');
          router.push('/cortex');
        } else {
          localStorage.setItem('lr_ceo_mode', 'false');
          router.push('/conta');
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Falha na autenticação. Verifique suas credenciais.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-[100dvh] bg-black text-white font-sans flex flex-col items-center">
      
      <header className="w-full px-6 pt-14 pb-6 flex justify-between items-center max-w-md mx-auto border-b border-zinc-900">
        <Link href="/" onClick={playHapticSound} className="font-serif text-xl tracking-widest text-white hover:text-zinc-300 transition-colors">
          LaRomme.
        </Link>
      </header>

      <div className="flex-1 w-full max-w-md mx-auto px-6 flex flex-col justify-center py-12">
        <div className="mb-10 space-y-2 text-center">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest block font-sans">
            Acesso Restrito
          </span>
          <h1 className="text-2xl md:text-3xl font-serif uppercase tracking-widest text-white">
            Senado VIP
          </h1>
        </div>

        <div className="flex border-b border-zinc-900 mb-8 font-sans text-[10px] uppercase tracking-widest">
          <button 
            type="button"
            onClick={() => { playHapticSound(); setMode('login'); }} 
            className={`flex-1 pb-3 transition-colors ${mode === 'login' ? 'text-white border-b border-white' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            Autenticar
          </button>
          <button 
            type="button"
            onClick={() => { playHapticSound(); setMode('signup'); }} 
            className={`flex-1 pb-3 transition-colors ${mode === 'signup' ? 'text-white border-b border-white' : 'text-zinc-600 hover:text-zinc-400'}`}
          >
            Criar Credencial
          </button>
        </div>

        {errorMsg && (
          <div className="bg-red-950/20 border border-red-900 text-red-500 p-4 text-[10px] uppercase tracking-widest font-sans text-center mb-6">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {mode === 'signup' && (
            <input 
              type="text" required placeholder="Nome Completo" value={fullName} onChange={(e) => setFullName(e.target.value)} 
              className="w-full bg-[#050505] border border-zinc-800/80 px-4 py-4 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition-colors" 
            />
          )}
          <input 
            type="email" required placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} 
            className="w-full bg-[#050505] border border-zinc-800/80 px-4 py-4 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition-colors" 
          />
          <input 
            type="password" required placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} 
            className="w-full bg-[#050505] border border-zinc-800/80 px-4 py-4 text-xs text-white placeholder:text-zinc-600 outline-none focus:border-zinc-500 transition-colors" 
          />
          <button 
            type="submit" disabled={loading} 
            className="w-full bg-white text-black font-sans font-bold text-[10px] uppercase tracking-widest py-4 hover:bg-zinc-200 transition-colors disabled:opacity-50 mt-4"
          >
            {loading ? 'Processando...' : mode === 'login' ? 'Acessar' : 'Garantir Acesso'}
          </button>
        </form>
      </div>
    </main>
  );
}