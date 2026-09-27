'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const CEO_EMAIL = 'diegooliveiragn@gmail.com';

export default function AcessoPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    setTimeout(() => {
      setLoading(false);
      const isCeo = email.toLowerCase() === CEO_EMAIL;
      
      // Salva sessão localmente
      localStorage.setItem('lr_user_email', email);
      localStorage.setItem('lr_ceo_mode', isCeo ? 'true' : 'false');

      if (isCeo) {
        setMessage('CHAVE MESTRE RECONHECIDA. Redirecionando para Córtex OS...');
        setTimeout(() => router.push('/cortex'), 1200);
      } else {
        setMessage('ACESSO SENADO VIP CONFIRMADO. Bem-vindo de volta.');
        setTimeout(() => router.push('/conta'), 1200);
      }
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white pt-28 px-4 flex items-center justify-center font-mono selection:bg-emerald-500 selection:text-black">
      <div className="max-w-md w-full bg-[#0d0d10] border border-zinc-800 p-8 rounded-lg space-y-6 shadow-2xl">
        
        <div className="text-center space-y-2">
          <span className="text-[10px] border border-zinc-700 px-3 py-1 uppercase tracking-widest text-zinc-400">
            Acesso Restrito • LaRomme
          </span>
          <h1 className="text-2xl font-serif uppercase tracking-widest text-white pt-2">Senado VIP</h1>
          <p className="text-[11px] text-zinc-500">Entre para acessar seu Certificado de Posse e Drops Secretos.</p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 uppercase tracking-wider block">E-mail Cadastrado</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seuemail@dominio.com"
              className="w-full bg-black border border-zinc-800 px-4 py-3 text-xs text-white outline-none focus:border-white transition-colors"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-zinc-400 uppercase tracking-wider block">Senha de Membro</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="w-full bg-black border border-zinc-800 px-4 py-3 text-xs text-white outline-none focus:border-white transition-colors"
            />
          </div>

          {message && (
            <p className={`text-[11px] text-center ${email.toLowerCase() === CEO_EMAIL ? 'text-amber-400' : 'text-emerald-400'}`}>
              {message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-white text-black text-xs uppercase font-bold tracking-widest hover:bg-zinc-200 transition-colors disabled:opacity-50"
          >
            {loading ? '[ VERIFICANDO ACCESS KEY... ]' : '[ AUTENTICAR ACESSO ]'}
          </button>
        </form>

        <div className="border-t border-zinc-800/80 pt-4 text-center">
          <p className="text-[10px] text-zinc-500">
            Ainda não é membro do Lote Zero? <a href="/checkout" className="text-zinc-300 underline">Adquira sua posse no site</a>.
          </p>
        </div>

      </div>
    </main>
  );
}