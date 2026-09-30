'use client';

import { useState } from 'react';
import FadeIn from '@/components/FadeIn';

export default function SenadoVipPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [submitted, setSetSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSetSubmitted(true);
    }
  };

  return (
    <div className="pt-36 pb-28 px-6 md:px-12 max-w-3xl mx-auto space-y-16 font-sans">
      
      <FadeIn>
        <div className="text-center space-y-4">
          <span className="text-[10px] font-mono tracking-[0.3em] text-zinc-500 uppercase">PORTAL DO MEMBRO</span>
          <h1 className="font-serif text-3xl md:text-5xl tracking-[0.25em] text-white uppercase font-bold">SENADO VIP.</h1>
          <p className="text-xs font-mono tracking-[0.3em] text-zinc-400">ACESSO PRIORITÁRIO & CONTA.</p>
        </div>
      </FadeIn>

      {!submitted ? (
        <FadeIn delay={150}>
          <form onSubmit={handleSubmit} className="bg-[#080808] border border-zinc-900 p-8 md:p-12 space-y-6">
            <div className="space-y-2 border-b border-zinc-800 pb-4">
              <h2 className="font-serif text-lg text-white font-bold uppercase tracking-wider">ENTRAR NA SUA CONTA</h2>
              <p className="text-xs text-zinc-400 leading-relaxed font-light">
                Digite seu e-mail cadastrado ou chave de acesso do Lote Zero para acompanhar pedidos e receber avisos antecipados sobre os próximos lançamentos.
              </p>
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <label className="block text-zinc-400 mb-2 uppercase tracking-widest">E-MAIL DO MEMBRO:</label>
                <input
                  type="email"
                  required
                  placeholder="membro@laromme.com.br"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3.5 text-white focus:outline-none focus:border-white transition-all"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-2 uppercase tracking-widest">CÓDIGO DE ACESSO / SENHA (OPCIONAL):</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 px-4 py-3.5 text-white focus:outline-none focus:border-white transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-white text-black font-bold text-xs tracking-[0.3em] uppercase py-4 hover:bg-zinc-200 transition-all font-sans shadow-xl"
            >
              ACESSAR SENADO VIP.
            </button>
          </form>
        </FadeIn>
      ) : (
        <FadeIn>
          <div className="bg-[#080808] border border-zinc-800 p-10 text-center space-y-6 font-mono">
            <span className="text-[10px] text-zinc-500 uppercase tracking-widest block">SOLICITAÇÃO RECEBIDA</span>
            <h2 className="font-serif text-2xl text-white font-bold tracking-wider uppercase">BEM-VINDO, SENADOR.</h2>
            <p className="text-xs text-zinc-300 leading-relaxed font-sans font-light max-w-md mx-auto">
              Sua chave de acesso para o e-mail <span className="text-white font-bold">{email}</span> foi validada no sistema. Você receberá notificações prioritárias sobre o Drop 02 diretamente na sua caixa de entrada.
            </p>
            <button
              onClick={() => setSetSubmitted(false)}
              className="text-xs text-zinc-400 underline underline-offset-4 hover:text-white pt-4"
            >
              VOLTAR AO FORMULÁRIO.
            </button>
          </div>
        </FadeIn>
      )}

      {/* BENEFÍCIOS DO SENADO VIP */}
      <FadeIn delay={250}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-xs">
          <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-2">
            <span className="text-white font-bold uppercase block tracking-widest">01 // ACESSO ANTECIPADO</span>
            <p className="text-zinc-500 text-[11px]">Membros do Senado VIP compram novos lotes 24 horas antes do lançamento público.</p>
          </div>
          <div className="bg-zinc-950 border border-zinc-900 p-6 space-y-2">
            <span className="text-white font-bold uppercase block tracking-widest">02 // SUPORTE DIRETO</span>
            <p className="text-zinc-500 text-[11px]">Atendimento prioritário para ajustes de tamanho, entregas e rastreio do Lote Zero.</p>
          </div>
        </div>
      </FadeIn>

    </div>
  );
}