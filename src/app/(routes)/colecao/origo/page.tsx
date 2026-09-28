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

  const handleVipRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    playHapticSound();
    if (!emailVip) return;
    try {
      await supabase.from('customers').insert([{
        email: emailVip, full_name: 'Lead Lote Zero', rfm_tag: 'WAITLIST_DROP01'
      }]);
      setRegistered(true);
    } catch (e) {
      setRegistered(true);
    }
  };

  const artifacts = [
    { id: 'vestigium', title: 'Vestigium', desc: 'O que permanece. Algodão heavyweight, estrutura impecável.', type: 'Lifestyle / Boxy', price: 'R$ 320,00' },
    { id: 'forza', title: 'Forza', desc: 'O que nos faz continuar. Engenharia térmica para intensidade.', type: 'Performance / T-Shirt', price: 'R$ 280,00' },
    { id: 'libertas', title: 'Libertas', desc: 'Movimento sem restrição. Fluidez absoluta para a arena.', type: 'Performance / Regata', price: 'R$ 240,00' },
    { id: 'signum', title: 'Signum', desc: 'O sinal de pertencimento. Proteção estruturada.', type: 'Acessório / Cap', price: 'R$ 190,00' }
  ];

  return (
    <main className="min-h-[100dvh] bg-black text-white font-sans py-14 px-6 flex flex-col">
      <div className="max-w-5xl mx-auto w-full space-y-16 flex-1">
        
        <header className="border-b border-zinc-900 pb-10 space-y-4">
          <Link href="/" onClick={playHapticSound} className="text-[10px] text-zinc-500 hover:text-white uppercase tracking-widest block font-sans transition-colors">
            ← Retornar
          </Link>
          <div className="pt-4 space-y-2">
            <span className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">
              Coleção 00
            </span>
            <h1 className="text-3xl md:text-5xl font-serif uppercase tracking-widest text-white">
              Origo.
            </h1>
            <p className="text-xs text-zinc-500 max-w-xl font-sans leading-relaxed pt-2">
              A materialização da origem. Quatro artefatos essenciais concebidos para transitar entre a intensidade da arena e a exigência da cidade. Seriais limitados.
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
          {artifacts.map((art) => (
            <Link 
              key={art.id} 
              href={`/produto/${art.id}`} 
              onClick={playHapticSound}
              className="group bg-[#050505] border border-zinc-900 hover:border-zinc-700 p-8 flex flex-col justify-between aspect-square md:aspect-auto md:h-80 transition-colors relative overflow-hidden"
            >
              <div className="space-y-1 z-10">
                <span className="text-[9px] text-zinc-500 uppercase tracking-widest block">{art.type}</span>
                <h2 className="text-2xl font-serif text-white uppercase tracking-wider group-hover:text-zinc-300 transition-colors">{art.title}</h2>
              </div>
              
              <div className="space-y-4 z-10">
                <p className="text-[11px] text-zinc-500 pr-8">{art.desc}</p>
                <div className="flex justify-between items-center border-t border-zinc-900 pt-4">
                  <span className="text-xs font-sans tracking-widest text-white">{art.price}</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-white transition-colors">Ver Artefato →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="border-t border-zinc-900 pt-16 pb-8 max-w-md mx-auto text-center space-y-6">
          <h3 className="text-lg font-serif uppercase tracking-widest text-white">
            Acesso ao Cofre
          </h3>
          <p className="text-[11px] text-zinc-500 font-sans leading-relaxed">
            A produção é intencionalmente escassa. Cadastre sua credencial para receber a chave do Lote Zero antes da abertura oficial.
          </p>

          {registered ? (
            <div className="text-xs font-sans tracking-widest text-emerald-400 uppercase">
              Credencial Ativada com Sucesso.
            </div>
          ) : (
            <form onSubmit={handleVipRegister} className="flex flex-col gap-4 border-b border-zinc-700 pb-2 focus-within:border-white transition-colors">
              <input type="email" required placeholder="Insira seu melhor e-mail" value={emailVip} onChange={(e) => setEmailVip(e.target.value)} className="bg-transparent text-xs font-sans tracking-widest text-white placeholder:text-zinc-600 outline-none text-center py-2" />
              <button type="submit" className="text-[10px] font-sans uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">
                Garantir Prioridade
              </button>
            </form>
          )}
        </div>

      </div>
    </main>
  );
}