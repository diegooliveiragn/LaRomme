import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { NewsletterForm } from '@/components/shared/NewsletterForm';

export function Footer() {
  return (
    <footer className="bg-brand-black text-brand-offwhite border-t border-zinc-800 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        {/* Brand Story Column */}
        <div className="space-y-4 md:col-span-1">
          <span className="font-serif text-2xl font-bold tracking-widest uppercase block">
            {siteConfig.name}
          </span>
          <p className="text-xs text-zinc-400 leading-relaxed uppercase tracking-wider">
            {siteConfig.slogans.manifesto}
          </p>
          <p className="text-[10px] text-zinc-500 font-mono tracking-widest">
            {siteConfig.coordinates}
          </p>
        </div>

        {/* Navigation Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold tracking-widest uppercase text-brand-red">
            Navegação
          </h4>
          <ul className="space-y-2 text-xs text-zinc-400 uppercase tracking-wider">
            <li>
              <Link href="/colecao/origo" className="hover:text-white transition">
                Drop 01 — Origo
              </Link>
            </li>
            <li>
              <Link href="/sobre" className="hover:text-white transition">
                Nossa História
              </Link>
            </li>
            <li>
              <Link href="/journal" className="hover:text-white transition">
                Journal
              </Link>
            </li>
          </ul>
        </div>

        {/* Suporte Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold tracking-widest uppercase text-brand-red">
            Atendimento
          </h4>
          <ul className="space-y-2 text-xs text-zinc-400 uppercase tracking-wider">
            <li>
              <Link href="/faq" className="hover:text-white transition">
                Perguntas Frequentes
              </Link>
            </li>
            <li>
              <Link href="/tamanho" className="hover:text-white transition">
                Guia de Tamanhos
              </Link>
            </li>
            <li>
              <Link href="/contato" className="hover:text-white transition">
                Contato
              </Link>
            </li>
          </ul>
        </div>

        {/* Newsletter Signup */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold tracking-widest uppercase text-brand-red">
            Comunidade
          </h4>
          <p className="text-xs text-zinc-400">
            Receba acesso antecipado a novos drops e conteúdos exclusivos.
          </p>
          <NewsletterForm />
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center text-[10px] text-zinc-500 uppercase tracking-widest gap-4">
        <p>© {new Date().getFullYear()} LaRomme. Todos os direitos reservados.</p>
        <div className="flex gap-6">
          <Link href="/politica-de-privacidade" className="hover:text-zinc-300">
            Privacidade
          </Link>
          <Link href="/termos" className="hover:text-zinc-300">
            Termos
          </Link>
        </div>
      </div>
    </footer>
  );
}