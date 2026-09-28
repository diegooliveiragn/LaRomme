'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';

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
    setLoading(true);
    setErrorMsg('');

    try {
      if (mode === 'signup') {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
        });

        if (authError) throw authError;

        await supabase.from('customers').insert([{
          full_name: fullName || 'Membro VIP',
          email: email,
          rfm_tag: 'NEWBIE',
          ltv: 0.00
        }]);

        localStorage.setItem('lr_user_email', email);
        alert('Credencial do Senado VIP criada com sucesso! Faça login.');
        setMode('login');
      } else {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

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
      setErrorMsg(err.message || 'Falha na autenticação. Verifique e-mail e senha.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6 font-sans">
      <div className="max-w-md w-full bg-[#0d0d10] border border-zinc-800 p-8 rounded-lg space-y-6">
        
        <div className="flex border-b border-zinc-800 pb-4 font-mono text-xs">
          <button 
            onClick={() => setMode('login')} 
            className={`flex-1 py-2 font-bold uppercase tracking-wider transition-colors ${mode === 'login' ? 'text-white border-b-2 border-white' : 'text-zinc-500'}`}
          >
            [ Acessar Senado ]
          </button>
          <button 
            onClick={() => setMode('signup')} 
            className={`flex-1 py-2 font-bold uppercase tracking-wider transition-colors ${mode === 'signup' ? 'text-white border-b-2 border-white' : 'text-zinc-500'}`}
          >
            [ Criar Credencial VIP ]
          </button>
        </div>

        <div className="text-center space-y-1">
          <h1 className="text-xl font-serif uppercase tracking-widest">
            {mode === 'login' ? 'Acesso ao Senado VIP' : 'Nova Credencial VIP'}
          </h1>
          <p className="text-xs text-zinc-500 font-mono">
            {mode === 'login' ? 'Insira seu e-mail e senha cadastrados.' : 'Cadastre-se para acompanhar seus pedidos e seriais.'}
          </p>
        </div>

        {errorMsg && (
          <div className="bg-red-950/40 border border-red-800 text-red-400 p-3 text-xs font-mono text-center rounded">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-[10px] text-zinc-400 font-mono uppercase block mb-1">Nome Completo</label>
              <input 
                type="text" 
                required 
                placeholder="Seu Nome" 
                value={fullName} 
                onChange={(e) => setFullName(e.target.value)} 
                className="w-full bg-black border border-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-white transition-colors" 
              />
            </div>
          )}

          <div>
            <label className="text-[10px] text-zinc-400 font-mono uppercase block mb-1">E-mail</label>
            <input 
              type="email" 
              required 
              placeholder="seu.email@dominio.com" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="w-full bg-black border border-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-white transition-colors" 
            />
          </div>

          <div>
            <label className="text-[10px] text-zinc-400 font-mono uppercase block mb-1">Senha</label>
            <input 
              type="password" 
              required 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              className="w-full bg-black border border-zinc-800 px-4 py-3 text-sm text-white outline-none focus:border-white transition-colors" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            className="w-full bg-white text-black text-xs font-bold font-mono uppercase tracking-widest py-4 hover:bg-zinc-200 transition-colors disabled:opacity-50 mt-2"
          >
            {loading ? '[ VERIFICANDO... ]' : mode === 'login' ? '[ AUTENTICAR ACESSO ]' : '[ ATIVAR REGISTRO VIP ]'}
          </button>
        </form>

      </div>
    </main>
  );
}