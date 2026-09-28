'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { playHapticSound } from '@/lib/sound';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export default function ColecaoOrigoPage() {
  const [emailVip, setEmailVip] = useState('');
  const [registered, setRegistered] = useState(false);

  // SIMULAÇÃO DE ESTOQUE ESGOTADO (COFRE DE ARQUIVO)
  const isSoldOut = false; // Mudar para true para ativar modo cofre completo

  const handleVipRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    playHapticSound();

    if (!emailVip) return;

    try {
      await supabase.from('customers').insert([{
        email: emailVip,
        full_name: 'Interessado Drop 01',
        rfm_tag: 'WAITLIST_DROP01'
      }]);
      setRegistered(true);
    } catch (e) {
      console.error(e);
      setRegistered(true);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white font-sans py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* CABEÇALHO DA COLEÇÃO */}
        <div className="border-b border-zinc-800 pb-8 space-y-2 font-mono">
          <span className="text-[10px] text-amber-400 uppercase tracking-widest block font-bold">
            ✦ COLEÇÃO 00 • ORIGO
          </span>
          <h1 className="text-3xl font-serif uppercase tracking-widest text-white">
            {isSoldOut ? 'Cofre de Arquivo (Archive Vault)' : 'Coleção Origo (Lote Zero)'}
          </h1>
          <p className="text-xs text-zinc-400 max-w-2xl font-sans leading-relaxed">
            Peças utilitárias de alta gramatura com seriais gravados a laser. Fabricação numerada e irrepetível.
          </p>
        </div>

        {/* GRADE DE PRODUTOS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* PEÇA 1 */}
          <div className="bg-[#0d0d10] border border-zinc-800 rounded-lg overflow-hidden group relative">
            {isSoldOut && (
              <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-10 flex items-center justify-center">
                <span className="text-xs font-mono font-bold text-zinc-400 border border-zinc-700 bg-black px-4 py-2 uppercase tracking-widest">
                  SOLDOUT • ARCHIVE ONLY
                </span>
              </div>
            )}
            
            <div className="aspect-[3/4] bg-zinc-900 flex items-center justify-center p-6 text-zinc-600 font-mono text-xs">
              [ FOTO REGATA BOXY ]
            </div>

            <div className="p-6 space-y-3 font-mono">
              <span className="text-[9px] text-zinc-500 uppercase block">SERIAL: LR-D00-001/050</span>
              <h2 className="text-sm font-bold text-white uppercase">Camiseta Boxy Heavyweight</h2>
              <div className="flex justify-between items-center pt-2">
                <span className="text-sm font-bold text-emerald-400">R$ 320,00</span>
                <Link
                  href="/produto/regata-brutalista"
                  onClick={playHapticSound}
                  className="bg-white text-black font-bold text-[10px] uppercase px-3 py-2 hover:bg-zinc-200 transition-colors"
                >
                  [ DETALHES ]
                </Link>
              </div>
            </div>
          </div>

        </div>

        {/* CARD CAPTAÇÃO VIP PARA O DROP 01 */}
        <div className="bg-[#0d0d10] border border-amber-900/40 p-8 rounded-lg font-mono space-y-4 max-w-2xl mx-auto text-center">
          <span className="text-[10px] text-amber-400 uppercase font-bold tracking-widest block">
            [ ACESSO ANTECIPADO SILENCIOSO • DROP 01 ]
          </span>
          <h3 className="text-lg font-serif uppercase tracking-widest text-white">
            Receba o link 1 hora antes do público geral
          </h3>
          <p className="text-xs text-zinc-400 font-sans leading-relaxed">
            Cadastre seu e-mail para garantir prioridade de reserva nos seriais numerados do próximo lote.
          </p>

          {registered ? (
            <div className="bg-emerald-950/40 border border-emerald-800 text-emerald-400 p-4 text-xs rounded font-mono">
              ✓ E-mail registrado no Senado VIP. Você receberá o alerta reservado no lançamento.
            </div>
          ) : (
            <form onSubmit={handleVipRegister} className="flex gap-2 max-w-md mx-auto pt-2">
              <input
                type="email"
                required
                placeholder="seu.email@dominio.com"
                value={emailVip}
                onChange={(e) => setEmailVip(e.target.value)}
                className="flex-1 bg-black border border-zinc-800 px-4 py-3 text-xs text-white outline-none focus:border-white"
              />
              <button
                type="submit"
                className="bg-white text-black font-bold text-xs uppercase px-6 py-3 hover:bg-zinc-200 transition-colors shrink-0"
              >
                [ CADASTRAR ]
              </button>
            </form>
          )}
        </div>

      </div>
    </main>
  );
}