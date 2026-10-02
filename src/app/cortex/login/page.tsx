'use client';

import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function CortexLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg('Acesso negado. Credenciais inválidas.');
      } else if (data.session) {
        router.push('/cortex');
        router.refresh();
      }
    } catch (err) {
      setErrorMsg('Erro de autenticação com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-mono flex items-center justify-center px-6">
      <div className="w-full max-w-sm space-y-8 border border-zinc-900 bg-[#090909] p-8 shadow-2xl">
        <div className="space-y-2 text-center">
          <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 block">
            PROPRIETARY ERP
          </span>
          <h1 className="font-serif text-xl uppercase tracking-[0.2em] font-bold text-white">
            CORTEX OS
          </h1>
          <p className="text-[10px] text-zinc-600 uppercase tracking-widest pt-1">
            Acesso Restrito ao CEO
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 border border-red-900/50 bg-red-950/20 text-red-400 text-[10px] uppercase tracking-wider text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block text-[9px] uppercase tracking-widest text-zinc-500 mb-1">
              E-mail Operacional
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ceo@laromme.com.br"
              className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2.5 text-white focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-[9px] uppercase tracking-widest text-zinc-500 mb-1">
              Chave de Acesso
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2.5 text-white focus:outline-none focus:border-white transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-3 font-mono font-bold uppercase tracking-[0.2em] hover:bg-zinc-200 transition-colors text-[10px] pt-3 disabled:opacity-50"
          >
            {loading ? 'AUTENTICANDO...' : 'ENTRAR NO CORTEX'}
          </button>
        </form>

        <div className="border-t border-zinc-900 pt-4 text-center">
          <span className="text-[8px] text-zinc-700 uppercase tracking-widest block">
            LAROMME MAISON • ALL RIGHTS RESERVED
          </span>
        </div>
      </div>
    </div>
  );
}