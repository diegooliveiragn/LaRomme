import { Metadata } from 'next';
import { siteConfig } from '@/config/site';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sobre A Marca | LaRomme',
  description: 'A história da LaRomme: a fusão entre a disciplina de Roma e a liberdade do lifestyle praiano.',
};

export default function SobrePage() {
  return (
    <div className="pt-28 pb-24 max-w-5xl mx-auto px-6 space-y-20">
      {/* Header Institucional */}
      <div className="text-center space-y-4">
        <span className="text-xs uppercase font-bold tracking-editorial text-brand-red block">
          Nossa Origem
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold uppercase tracking-tight text-brand-black">
          A Sua Casa. A Sua Força.
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 uppercase tracking-widest max-w-2xl mx-auto">
          {siteConfig.slogans.essence}
        </p>
      </div>

      {/* Hero Narrative Block */}
      <div className="bg-brand-black text-brand-offwhite p-8 sm:p-16 border border-zinc-800 space-y-8">
        <span className="text-xs uppercase font-mono tracking-widest text-brand-red">
          ORIGEM: {siteConfig.coordinates}
        </span>
        <h2 className="font-serif text-2xl sm:text-4xl font-bold uppercase tracking-tight leading-tight">
          O Ponto de Encontro Entre A Arena e O Lifestyle
        </h2>
        <div className="space-y-4 text-xs sm:text-sm text-zinc-400 uppercase tracking-wider leading-relaxed">
          <p>
            A LaRomme nasceu da observação do contraste: a disciplina inflexível da pedra e dos guerreiros de Roma combinada com o movimento contínuo e a liberdade do mar.
          </p>
          <p>
            Não somos apenas uma marca de roupas. Construímos um universo para quem utiliza o esporte, a estética e o estilo de vida como expressão de identidade e pertencimento.
          </p>
          <p>
            Fortaleza é o nosso ponto de partida físico; a ambição, a performance e a cultura contemporânea são a nossa linguagem global.
          </p>
        </div>
      </div>

      {/* Grade de Contrastes Visuais */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-zinc-200 p-8 space-y-4">
          <h3 className="font-serif text-xl font-bold uppercase text-brand-black border-b border-zinc-200 pb-3">
            O Código Roma
          </h3>
          <p className="text-xs text-zinc-600 uppercase tracking-wider leading-relaxed">
            Roma não é utilizada como adereço literal ou fantasia histórica. Roma funciona como postura, estrutura, respeito ao processo e permanência do que é essencial.
          </p>
        </div>
        <div className="bg-white border border-zinc-200 p-8 space-y-4">
          <h3 className="font-serif text-xl font-bold uppercase text-brand-black border-b border-zinc-200 pb-3">
            O Território Praia
          </h3>
          <p className="text-xs text-zinc-600 uppercase tracking-wider leading-relaxed">
            A praia é a arena viva. É o espaço do vôlei, do futevôlei, do beach tennis, da corrida ao sol e da socialização que conecta pessoas através da atitude.
          </p>
        </div>
      </div>

      {/* CTA Final */}
      <div className="text-center pt-8 border-t border-zinc-300 space-y-6">
        <h3 className="font-serif text-2xl font-bold uppercase text-brand-black">
          Viva A Experiência LaRomme
        </h3>
        <div>
          <Link
            href="/colecao/origo"
            className="inline-block bg-brand-red text-white text-xs font-bold uppercase tracking-editorial px-10 py-5 hover:bg-red-700 transition-all shadow-md"
          >
            Conhecer O Drop 01 — Origo
          </Link>
        </div>
      </div>
    </div>
  );
}
